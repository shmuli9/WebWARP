import os

from flask import Flask
import logging
from logging.handlers import RotatingFileHandler

from app.config import Config
from app.init_app import model_init_app, directories_init_app

network = None


def create_app(config_object=Config):
    app = Flask(__name__, static_folder='../frontend/build', static_url_path="/")
    app.config.from_object(config_object)

    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/webwarp.log', maxBytes=20480, backupCount=30)
    file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
    file_handler.setLevel(logging.DEBUG)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.DEBUG)

    app.logger.info("WebWARP started")

    with app.app_context():
        directories_init_app()
        global network
        network = model_init_app()

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    from app.api_routes import api
    app.register_blueprint(api)

    return app


if __name__ == '__main__':
    create_app().run()
