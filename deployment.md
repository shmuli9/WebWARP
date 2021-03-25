# Deployment

All commands assumed to be run from `~/WebWARP` except `git clone` which is run from `~/`

## Setup Instance (EC2 - t2.medium)

### SSH

Also need to add SSH keys, to enable password-less login

    sudo nano /etc/ssh/sshd_config

        PermitRootLogin no
        PasswordAuthentication no

    sudo service ssh restart

### Firewall

    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    sudo ufw status

## Install application

### Dependencies

    sudo add-apt-repository ppa:deadsnakes/ppa
    sudo apt update
    sudo apt install python3.6
    sudo apt-get install -y ufw
    sudo apt install python3-virtualenv python3-pip supervisor nginx nodejs npm


### Git clone
Run from ~/

    git clone git@github.com:shmuli9/WebWARP.git  # (uses SSH key)

### Frontend

    sudo npm install --global yarn
    cd frontend/
    yarn
    yarn build

### Create venv

    virtualenv -p /usr/bin/python3.6 venv  

### Setup Supervisor

    sudo nano /etc/supervisor/conf.d/webwarp.conf

Paste in:

    [program:webwarp]
    command=/home/ubuntu/WebWARP/venv/bin/gunicorn -b localhost:8000 application:application
    directory=/home/ubuntu/WebWARP
    user=ubuntu
    autostart=true
    autorestart=true
    stopasgroup=true
    killasgroup=true

#### Run supervisor
    sudo supervisorctl reload

#### Start server manually
    gunicorn -b localhost:8000 application:application

### Setup nginx

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
        # use the following if setting up real SSL (replace domain name with eg webwarp.uk)
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
    
        # location /static {
            # handle static files directly, without forwarding to the application
        #    alias /home/ubuntu/WebWARP/frontend/build;
        #    expires 30d;
        #}
    }

then run

    sudo service nginx reload

#### Set up SSL

To use LetsEncrypt free certificates, we need to install certbot - instructions [here](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)

After certbot is installed, run the following command (replace domain name with the real domain, eg webwarp.uk) :

    sudo certbot certonly --webroot -w /home/ubuntu/certs -d {domain_name}

After the domain is verified and certificates are generated alter `/etc/nginx/sites-enabled/webwarp` to comment out the self cert ssl files, and uncomment (and replace the domain name) the real SSL parameters

### Update from git

() means optional - depends on whether a new dependency needs to be installed/updated

Yarn commands need to be run from `~/WebWARP/frontend`, and order is important as `yarn build` replaces the whole `build` directory, deleting some necessary folders, which are then replaced by the server

    git pull                            # download the new version
    (yarn)                              # download new js packages
    yarn build                          # build react frontend
    (pip3 install -r requirements.txt)   # get new python packages
    sudo supervisorctl stop webwarp     # stop the current server
    sudo supervisorctl start webwarp    # start a new server

Or, in one line:

     cd /home/ubuntu/WebWARP/ && git pull; sudo supervisorctl stop webwarp; cd frontend && yarn build; sudo supervisorctl start webwarp

If new deps, remember to do yarn and pip install but with `venv` activated