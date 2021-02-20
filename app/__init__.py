from flask import Flask

from app.config import Config
from app.init_app import model_init_app, directories_init_app

network = model_init_app()
directories_init_app()

def create_app(config_object=Config):
    app = Flask(__name__, static_folder='../frontend/build', static_url_path="/")
    app.config.from_object(config_object)

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    from app.api_routes import api
    app.register_blueprint(api)

    return app


if __name__ == '__main__':
    create_app().run()
