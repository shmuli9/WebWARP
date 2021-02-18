from flask import Flask

from app.WarpGAN.warpgan import WarpGAN
from app.config import Config

network = WarpGAN()

def create_app(config_object=Config):
    app = Flask(__name__, static_folder='../frontend/build', static_url_path="/")
    app.config.from_object(config_object)

    network.load_model(Config.MODEL_DIRECTORY)

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    from app.routes import bp
    app.register_blueprint(bp)

    return app


if __name__ == '__main__':
    create_app().run()
