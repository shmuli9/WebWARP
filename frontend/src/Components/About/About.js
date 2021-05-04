import {Figure, Card} from "react-bootstrap";

function About() {
    const reference = (url, text) => {
        return <a href={url} target={url.startsWith("#") ? "" : "_blank"}>{text}</a>
    }

    return (
        <>
            <h2 className={"mb-3"}>About WebWARP</h2>
            <Card className={"text-justify"}>
                <Card.Header><h3>Architecture</h3></Card.Header>
                <Card.Body>
                    <Card.Img src={"/architecture.svg"}/>
                    <Card.Footer className={"mb-5"}>Overall system architecture of WebWARP application</Card.Footer>

                    <Card.Title>Backend</Card.Title>
                    <Card.Text>
                        <p>I built the web server backend in Python using the web framework Flask and created endpoints
                            for image generation. This endpoint accepts several parameters
                            that can be adjusted to customise the caricature generation.</p>
                        <p>One such parameter, the “scale factor”, controls how aggressively the neural net will morph
                            the provided image. This will, for example, change how large a chin is exaggerated in the
                            generated caricature image, and I expect that end users will enjoy playing with this slider
                            on the webpage.</p>
                        <p>The webserver requires the pretrained model, developed
                            by {reference("https://github.com/seasonSH/WarpGAN", "(Shi, Y., Deb, D. & Jain, A. K., 2019)")},
                            to
                            generate
                            caricatures from portraits. This file is very large, at approximately 600MB. This makes it
                            infeasible to be downloaded on the webpage, or even to include it in the code repository.
                            Instead the pretrained model is retrieved from Google Drive on server boot
                            (see {reference("#deployment-header", "Deployment")}, below).</p>
                        <p>To aid with debugging and monitoring of WebWARP, I added extensive logging functionality
                            using the Python logging library. I also created an endpoint to collect all the logs from
                            wherever they are on the server (see {reference("#deployment-header", "Deployment")}, below)
                            and
                            return them in a simple
                            JSON format for ease of use by a web developer.</p>
                        <p>With the intention of allowing web developers ease of use with the deployed server, I also
                            setup Flask to handle Cross-Origin Resource Sharing (CORS) (see Cross-Origin
                            Resource Sharing, below) using the Flask-CORS library on the API
                            endpoints.</p>
                        <p>The server receives images and parameters via the relevant endpoint and invokes the
                            pretrained model to generate a corresponding caricature.</p>

                    </Card.Text>

                    <Card.Title id={"frontend-header"}>Frontend</Card.Title>
                    <Card.Text>
                        <p>For the frontend I used React, as this easily allows
                            components on the webpage to be created, reused, and controlled.</p>
                        <p>Using React allowed me to iterate on ideas very quickly and ultimately to build an appealing
                            and intuitive website. One notable application of the reusability enabled by React, was a
                            library that I used, {reference("https://github.com/fengyuanchen/cropperjs", "CropperJS")}.
                            This was very easy to integrate and customise
                            to my use case. The library allows users to crop their photos before uploading them and
                            generating the caricature. This has a dual benefit:</p>
                        <ul>
                            <li>It gives the user more control over what the neural net will focus on in their image
                            </li>
                            <li>It significantly improves performance of the web server, as a big part of the CPU usage
                                in the processing pipeline is actually the pre-processing of the image.
                            </li>
                        </ul>
                        <p>By the user cropping
                            the image, the server does not need to identify the main object of the image, or perform the
                            image crop itself, saving a large amount of time and processing power
                            Deploying the frontend was made easy by use of Netlify which allows
                            deployment of frontend-only applications very easily and quickly.
                            Using {reference("https://netlify.com", "Netlify")} also allows
                            simple setup of continuous deployment (CD), by connecting to my GitHub repo and auto
                            deploying any new commits.</p>
                        <p>The frontend as deployed on Netlify is now a standalone site which makes simple API requests
                            to the WebWARP server. This has two immediate benefits:</p>
                        <ul>
                            <li>the task of responding to requests for the relatively simple frontend is handled by
                                Netlify, not the core WebWARP server. This means the core WebWARP server can save
                                its
                                processing capabilities for the much harder task of running the neural net
                            </li>
                            <li>by developing an independent frontend (deployed separately to the core WebWARP
                                server) I was forced to think about how a future web developer would use the WebWARP
                                service
                            </li>
                        </ul>
                        <p>Additionally, to aid in the monitoring and debugging the WebWARP I created
                            a {reference("/status", "dashboard")} to
                            easily display the most recent logs and issues for the site.
                        </p>

                        <Figure>
                            <Figure.Image src={"/benefits-of-cropping-on-frontend.png"}/>
                            <Figure.Caption className={"text-center"}>This image shows a drastic increase in performance when the user crops the
                                image
                                instead of the server. The mean time for processing an aligned image is 4.8 seconds
                                (standard deviation: 0.26) vs 20.4 seconds (standard deviation: 0.20) if the original
                                image is used.</Figure.Caption>
                        </Figure>

                    </Card.Text>

                    <Card.Title id={"deployment-header"}>Deployment</Card.Title>
                    <Card.Text>
                        <p>
                            I deployed the core WebWARP server on AWS, using the EC2 platform. AWS provides the
                            scalability and
                            reliability that I need for this service, and EC2 gave me the flexibility to setup the
                            WebWARP server with the required environment.</p>
                        <p>A decision had to be made early on of how to access the pretrained model on the web server.
                            One option would be to include it in source control (I used git ), this would
                            have been the easiest option technically, but would mean having to upload a very large
                            artefact which was less than ideal. Therefore, I decided to download the model directly to
                            the webserver.</p>
                        <p>One important priority on the EC2 instance is the use of network IO. The risk is a faulty
                            system repeatedly trying to download the model and going over the IO limitations
                            (potentially incurring increased fees). To address this, I built a utility into my web app
                            to look for the pretrained model on the local filesystem, and if it is not found, only then
                            to download from Google Drive to the EC2 instance. The trick here was to save the model into
                            semi-persistent storage on the instance, thereby reducing the number of times it needs to be
                            downloaded. If I deploy a new version of the server (for example, due to a new feature, or
                            bugfix) the model will not need to be redownloaded.</p>
                        <p>There are two entities that constitute the server: Gunicorn runs the Python
                            application locally on the server, without exposing the any ports to the internet. NGINX
                            is used as the reverse proxy which handles the remote connections over the
                            internet. To orchestrate and automate Gunicorn I used the Linux utility Supervisor.</p>
                        <p> NGINX is a high-performance HTTP server which works in tandem with Gunicorn. NGINX buffers
                            requests to Gunicorn letting the Gunicorn instances do the real work of running the neural
                            net and generating the caricatures. NGINX is exceptionally fast at handling static files
                            (although not relevant on this server) and also handles security.</p>
                        <p>One challenge was handling multiple caricature generation requests at once. While NGINX can
                            easily handle many thousands of simultaneous HTTP requests, the Gunicorn instances are
                            limited by the available RAM and CPU as the neural nets use a large amount of system
                            resources. Additionally, running the neural net is blocking meaning each Gunicorn worker can
                            only run one task at a time, which is not great for end-user experience.</p>
                        <p>To offset this limitation somewhat I configured Gunicorn to create two workers of the Flask
                            server, this means up to two simultaneous caricatures can be generated at once.</p>
                        <p>Additionally, I used Netlify to host the frontend. This means even if the
                            core server is busy with generating images, the frontend can still be accessed.</p>
                        <p>Supervisor, the Linux utility, is an essential part of core server. Its job is to start up
                            the correct number of Gunicorn instances, and ensures that if a crash occurs, the instances
                            are restarted.</p>
                        <p>I was fortunate enough to secure the domain, {reference("https://webwarp.uk", "webwarp.uk")},
                            free for a year. This is where my
                            site is currently hosted. To point this domain at my Netlify site, I had to add the relevant
                            A and CNAME records to my DNS settings. The backend is available
                            at {reference("https://api.webwarp.uk", "api.webwarp.uk")}, and I
                            used an A record to point it to the EC2 instance.</p>
                        <p>Additionally, I fixed the IP address of my EC2 instance using an Elastic IP Address. This is
                            necessary so that the DNS can be set to point to a fixed destination.
                        </p>

                        <Figure>
                            <Figure.Image src={"/scale-factor-comparison.png"}/>
                            <Figure.Caption className={"text-center"}>This graphic shows very little difference in the performance of the server when changing
                                the scale factor. For each setting tested (0.5, 1.0, 3.0, 6.5 and 9.0) the mean is 4.8s
                                (standard deviation: between 0.13-0.16).</Figure.Caption>
                        </Figure>

                    </Card.Text>

                    <Card.Title id={"security-header"}>Security</Card.Title>
                    <Card.Text>
                        <h6>HTTPS/SSL</h6>
                        <p>There were several areas where security was addressed. First and foremost was the use of SSL
                            certificates in all areas of the site.</p>
                        <p>In general SSL ensures that data is secure when being transmitted across the internet. This
                            is important for WebWARP as the intention is for the site to handle personal images of its
                            users. Therefore, both the frontend and backend have SSL certificates setup. This was
                            particularly important as the if the frontend is served over HTTPS (i.e. using SSL
                            encryption), then any API calls made from it must also be to HTTPS endpoints. This was
                            tricky as in my setup, the frontend and backend are on different servers (Netlify and EC2),
                            with each requiring its own domain and certificate.
                        </p>
                        <p>
                            I solved this issue by creating a subdomain, api.webwarp.uk, and pointing it to the EC2
                            fixed IP address using an A record in the DNS settings. The plain, webwarp.uk endpoint was
                            set to point to the Netlify IP address.
                        </p>
                        <p>
                            Netlify automatically handles SSL certificates after the DNS is setup properly so that was
                            fairly straightforward. To generate the appropriate certificates for the core server, I used
                            the free service Lets Encrypt which has a convenient utility called
                            CertBot which I ran on the EC2 instance, and very quickly created and served the
                            certificates.
                        </p>
                        <p>
                            The final change was to add an environment variable to the Netlify deployment. This allows
                            me to easily set where to direct API requests to from the frontend. Now when Netlify
                            deploys, it injects this variable into the fetch calls to ensure they are directed at the
                            correct server.</p>

                        <h6>Cross-Origin Resource Sharing</h6>
                        <p>Cross-Origin Resource Sharing (CORS) is a security policy implemented by
                            modern web browsers that prevents websites making cross-domain HTTP requests unless the
                            destination server allows it. A simple example of this is that if you browse to google.com,
                            the webpage should not make further requests to amazon.com (for example to fetch a product
                            image), unless amazon.com explicitly allows this.</p>
                        <p>
                            This security feature is applicable to WebWARP as the backend service is intended for use by
                            web developers going forward. Seeing as they will not be working from the webwarp.uk domain,
                            accessing the backend at api.webwarp.uk will necessitate a cross-origin request.</p>
                        <p>
                            To allow CORS requests to be made to the backend server I used a Flask library called
                            Flask-CORS. This library makes it easy to set the whole application or specific endpoints to
                            allow cross-origin requests. For WebWARP I decided that any route under the /api blueprint
                            should allow cross-origin requests. For example, the endpoint webwarp.uk/api/upload will now
                            accept and respond to cross-origin requests.</p>
                        <p>
                            In reality I could set every endpoint to allow CORS requests, but Flask-CORS makes it very
                            easy to limit it to specific endpoints, so I decided to take advantage of this
                            functionality.</p>

                        <h6>Firewall</h6>
                        <p>I setup a firewall on the backend server to limit connections to specified ports. This is
                            good practise to prevent a would-be attacker gleaning any useful information by scanning the
                            server’s open ports.</p>
                        <p>
                            The only ports needed by the server are 22, 80 and 443. Port 22 is used for SSH, which is
                            the protocol I use to remotely manage the server. Ports 80 and 443 are used by HTTP and
                            HTTPS respectively, so are essential for any web server.</p>
                        <p>
                            The firewall software is called UncomplicatedFirewall or ufw, and is a Ubuntu
                            utility. This utility allows a robust firewall to be configured with only a few
                            commands.</p>


                    </Card.Text>

                    <Card.Title>Overall Architecture</Card.Title>
                    <Card.Text>
                        <p>
                            With my development of this web app, backend server, frontend website, as well as the
                            deployment, the goal of making the WarpGAN technology widely available and easily usable is
                            achieved. At several points I prioritised ease of use, and ease of accessibility for the end
                            user. By exposing an API, I also allowed web developers to access the underlying neural net,
                            without having to jump through the same hoops that I had to.</p>
                        <p>
                            The web app is very user friendly and can be accessed on any internet connected device with
                            a web browser. This is a step change in how the WarpGAN model could previously be used.

                        </p>
                    </Card.Text>
                </Card.Body>

            </Card>
        </>
    )
}

export default About;