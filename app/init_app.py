import os

import gdown

from app.WarpGAN.warpgan import WarpGAN
from app.config import Config


def model_init_app():
    model_path = Config.MODEL_DIRECTORY

    # check if model path exists
    if not os.path.exists(model_path):

        # check if parent directory exists
        parent_dir = os.path.dirname(model_path)
        if not os.path.exists(parent_dir):
            os.mkdir(parent_dir)
            print(f"Created parent dir {parent_dir}")

        # download and unzip to correct path
        url = 'https://drive.google.com/uc?id=1XwjMGcYIg2qwEKHsC7uSmZayHvnEFhyg'
        output = os.path.join(parent_dir, 'warpgan_pretrained.zip')

        print("Downloading pretrained model")
        gdown.cached_download(url, output, quiet=False, postprocess=gdown.extractall)
        print("Download complete")

    network = WarpGAN()
    network.load_model(model_path)

    return network
