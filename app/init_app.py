import os

import gdown

from app.WarpGAN.warpgan import WarpGAN
from app.config import Config  # must use direct import because this file is imported before Flask context is created
from flask import current_app

def model_init_app(reset=False):
    model_path = current_app.config["MODEL_DIRECTORY"]

    # check if model path exists
    if not os.path.exists(model_path):

        # check if parent directory exists
        parent_dir = os.path.dirname(model_path)
        if not os.path.exists(parent_dir):
            os.mkdir(parent_dir)
            current_app.logger.info(f"Created parent dir {parent_dir}")

        # download and unzip to correct path
        url = 'https://drive.google.com/uc?id=1XwjMGcYIg2qwEKHsC7uSmZayHvnEFhyg'
        output = os.path.join(parent_dir, 'warpgan_pretrained.zip')

        current_app.logger.debug("Downloading pretrained model")
        gdown.cached_download(url, output, quiet=False, postprocess=gdown.extractall)
        current_app.logger.debug("Download complete")
    else:
        current_app.logger.info("Pretrained model found - loading local file")

    if reset:
        from app import network

    network = WarpGAN()
    network.load_model(model_path)

    return network


def directories_init_app():
    directories = [Config.UPLOAD_FOLDER, Config.RESULTS_FOLDER]

    for directory in directories:
        if not os.path.exists(directory):
            os.mkdir(directory)

