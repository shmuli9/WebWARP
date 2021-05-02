# WebWARP
##### A web interface for WarpGAN

[![Netlify Status](https://api.netlify.com/api/v1/badges/3f573cc0-8dfc-4ff5-a506-0ea5a8717e90/deploy-status)](https://app.netlify.com/sites/webwarp/deploys)

## Abstract

WebWARP is a webapp that allows users to transform their images into the style of a caricature. 
The webapp provides an interface to the innovative, if difficult to access, WarpGAN neural network, making it accessible and easy to use for novices and developers alike. 
WebWARP provides an easy-to-use UI exposing features such as scale factor, styles, and image cropping, as well as building an extendable API, and providing the code for the project here on GitHub.

## Index

- [Abstract](#abstract)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
    - [Setup backend instance](#setup-instance-ec2---t2medium)
        - [Setup user account](#setup-users)
        - [Password-less login](#enable-password-less-ssh-login)
        - [Firewall](#firewall)
    - [Install Application](#install-application)
        - [Install Dependencies](#dependencies)
        - [git clone](#git-clone)
        - [Frontend](#frontend)
        - [Create venv](#create-venv)
    - [Backend Configuration](#backend-configuration)
        - [Setup Supervisor](#setup-supervisor)
            - [Run Supervisor](#run-supervisor)
            - [Run Manually](#start-server-manually)
        - [Setup NGINX](#setup-nginx)
        - [SSL/HTTPS](#set-up-ssl)
    - [Frontend Deployment](#frontend-deployment-using-netlify)
    - [DNS Config](#custom-domains-dns-config)
    - [Update Application (via git)](#update-from-git)

## Development

Python requirements are provided in the requirements.txt file. 
Install with the following commands:

    python -m venv venv
    .\venv\Scripts\activate
    pip install --upgrade pip
    pip install -r requirements.txt

Please note this project requires Python 3.6 (due to the TensorFlow 1.9 dependency)

I ran into an SSL issue when downloading the pretrained model programmatically. To fix, I made the following edit: 

#### Original
##### File: `venv/Lib/site-packages/gdown/download.py:110`

    res = sess.get(url, stream=True)

#### Changed to
##### File: `venv/Lib/site-packages/gdown/download.py:110`
    res = sess.get(url, stream=True, verify=False)

This was a local issue on my machine and should work fine once deployed, so no need to worry about editing the venv for deployment.

## Testing

Run the test code in the following format:
    
    python test.py /path/to/model/dir /path/to/input/image /prefix/of/output/image

For example, from the root directory run the following commands to generate 5 images for Captain Marvel of different random styles:

    python app/WarpGAN/test.py app/WarpGAN/pretrained/warpgan_pretrained app/WarpGAN/data/example/CaptainMarvel.jpg app/WarpGAN/result/CaptainMarvel --num_styles 5

You can also change the warping extent by using the --scale argument. For example, the following command doubles the displacement of the warping control points:

    python app/WarpGAN/test.py app/WarpGAN/pretrained/warpgan_pretrained app/WarpGAN/data/example/CaptainMarvel.jpg app/WarpGAN/result/CaptainMarvel --num_styles 5 --scale 2.0

## Deployment

This aims to show how I deployed this application, including all the pertinent commands and configuration.

Large parts of this doc were inspired by this [article](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xvii-deployment-on-linux) 
from Miguel Grinberg

All commands assumed to be run from `~/WebWARP` except `git clone` which is run from `~/`

### Setup Instance (EC2 - t2.medium)

Create the instance on AWS EC2. I used the t2.medium but other size nodes may work too.

Login to the EC2 instance via SSH using the root account.

#### Setup users

Create user account for the rest of this guide

    adduser --gecos "" ubuntu
    usermod -aG sudo ubuntu
    su ubuntu

#### Enable password-less SSH login

Run the following commands on your local machine (using WSL Terminal if on Windows)

First check for pre-existing keys

    ls ~/.ssh

If no keys exist then (to create new keys) run:

    ssh-keygen

To print the key to the console, run:

    cat ~/.ssh/id_rsa.pub

Copy the printed key to keyboard.

Now on the SSH (remote) terminal paste in your key into the following command:

    echo <paste-key-here> >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys

Password-less login should now be setup!

You can test password-less login by closing your SSH session and starting again with:

    ssh ubuntu@<server-ip-address>

To further secure the instance, we can turn off root login, and turn off password logins for any account.

    sudo nano /etc/ssh/sshd_config

        PermitRootLogin no
        PasswordAuthentication no

    sudo service ssh restart

Now the **only** way to login is with password-less login

#### Firewall

Setup firewall to only allow certain ports to be open

    sudo apt-get install -y ufw
    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    sudo ufw status

### Install application

#### Dependencies

Install the dependencies with the following commands

    sudo add-apt-repository ppa:deadsnakes/ppa
    sudo apt update
    sudo apt install python3.6
    sudo apt install python3-virtualenv python3-pip supervisor nginx nodejs npm git


#### Git clone
Run from ~/

    git clone git@github.com:shmuli9/WebWARP.git  # (uses SSH key)

#### Frontend

Only necessary when deploying the frontend on EC2

    sudo npm install --global yarn
    cd frontend/
    yarn
    yarn build

#### Create venv

    virtualenv -p /usr/bin/python3.6 venv  

#### Setup Supervisor

    sudo nano /etc/supervisor/conf.d/webwarp.conf

Paste in:

    [program:webwarp]
    command=/home/ubuntu/WebWARP/venv/bin/gunicorn -b localhost:8000 -w 2 application:application
    directory=/home/ubuntu/WebWARP
    user=ubuntu
    autostart=true
    autorestart=true
    stopasgroup=true
    killasgroup=true

##### Run supervisor
    sudo supervisorctl reload

##### Start server manually
    gunicorn -b localhost:8000 application:application

### Backend Configuration

#### Setup nginx

Create certificates

    mkdir certs
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -keyout certs/key.pem -out certs/cert.pem

    sudo nano /etc/nginx/sites-enabled/webwarp

Paste in

    server {
        # listen on port 80 (http)
        listen 80;
        server_name _;
        location / {
            # redirect any requests to the same URL but on https
            return 301 https://$host$request_uri;
        }
    }
    server {
        # listen on port 443 (https)
        listen 443 ssl;
        server_name _;
    
        # location of the self-signed SSL certificate
        ssl_certificate /home/ubuntu/certs/cert.pem;
        ssl_certificate_key /home/ubuntu/certs/key.pem;

        # use the following if setting up real SSL (replace domain name with eg api.webwarp.uk)
        # ssl_certificate /etc/letsencrypt/live/{domain_name}/fullchain.pem;
        # ssl_certificate_key /etc/letsencrypt/live/{domain_name}/privkey.pem;

        # write access and error logs to /var/log
        access_log /var/log/webwarp_access.log;
        error_log /var/log/webwarp_error.log;

        # location used for LetsEncrypt verification
        location ~ /.well-known {
                root /home/ubuntu/certs;
        }
    
        location / {
            # forward application requests to the gunicorn server
            proxy_pass http://localhost:8000;
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            client_max_body_size 50M;        
        }
    }

then run

    sudo service nginx reload

##### Set up SSL

To use LetsEncrypt free certificates, we need to install certbot - instructions [here](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)

After certbot is installed, run the following command (replace domain name with the real domain, e.g. api.webwarp.uk) :

    sudo certbot certonly --webroot -w /home/ubuntu/certs -d {domain_name}

After the domain is verified and certificates are generated alter `/etc/nginx/sites-enabled/webwarp` to comment out the self cert ssl files, and uncomment (and replace the domain name) the real SSL parameters

### Frontend Deployment (using Netlify)

[![Netlify Status](https://api.netlify.com/api/v1/badges/3f573cc0-8dfc-4ff5-a506-0ea5a8717e90/deploy-status)](https://app.netlify.com/sites/webwarp/deploys)

To help alleviate the frontend work from the core backend server, we can host the frontend independently on Netlify.
To get started visit [Netlify](https://netlify.com) and follow the instruction to create an account and connect your GitHub repo containing the frontend.

When deploying this mono-repo I made the following changes to the default Netlify deploy scripts:

- Base directory: _frontend_
- Build command: _CI=false yarn build_
- Publish directory: _frontend/build_

To set up API requests to be routed to the backend EC2 instance, add an environment variable

    REACT_APP_BACKEND_URL: https://api.webwarp.uk

and put in the URL or IP address of your backend server (default is api.webwarp.uk).


### Custom domains (DNS Config)

To set up a custom domain, we need to set up our DNS to point api.webwarp.uk to the backend EC2 instance, and webwarp.uk to the Netlify endpoint.

First add a custom domain to Netlify and follow the instruction to update your DNS.

Next, add a subdomain, api, to your DNS and point it to your fixed EC2 IP (you may need to Elastic IP Address on AWS to get a fixed IP).

For me this looked like:

|Hostname    |Type   |Result                |
|------------|-------|----------------------|
|            | a     |75.2.60.5             |
|www         | CNAME |webwarp.netlify.app   |
|api         | a     |3.8.178.246           |

Once saved, tt may take some time for these new DNS settings to propagate.

Netlify can handle the SSL certificates for the frontend, but in order to access api.webwarp.uk (or your own custom backend) 
you must follow the instructions [here](#set-up-ssl) with the appropriate subdomain.

#### Update from git

() means optional - depends on whether a new dependency needs to be installed/updated

Yarn commands need to be run from `~/WebWARP/frontend`, and order is important as `yarn build` replaces the whole `build` directory, deleting some necessary folders, which are then replaced by the server

Yarn commands are only applicable if frontend is deployed on EC2, otherwise use Netlify.

    git pull                            # download the new version
    (yarn)                              # download new js packages
    yarn build                          # build react frontend
    (pip3 install -r requirements.txt)   # get new python packages
    sudo supervisorctl stop webwarp     # stop the current server
    sudo supervisorctl start webwarp    # start a new server

Or, in one line:

     cd /home/ubuntu/WebWARP/ && git pull && pip3 install -r requirements.txt; cd frontend && yarn && yarn build; sudo supervisorctl reload

If new deps, remember to do yarn and pip install but with `venv` activated