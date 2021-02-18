import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    MODEL_DIRECTORY = "app/WarpGAN/pretrained/warpgan_pretrained"

    # Flask parameters
    ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))
    STATIC_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend/build')
    UPLOAD_FOLDER = os.path.join(STATIC_FOLDER, "uploads")
    RESULTS_FOLDER = os.path.join(STATIC_FOLDER, "results")

    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
