import os

import numpy as np
from scipy import misc

from app.WarpGAN.align.detect_align import detect_align
from app import network


def trigger_nn(input_path, output_path, num_styles=5, scale=1.0, aligned=False):
    """

    :param input_path : (required) The path to the image
    :param output_path: (required) The output path. Suffix will be added for different styles
    :param num_styles: The number of images to generate with different styles
    :param scale: Change the warping extent. For example, '2.0' doubles the displacement of the warping control points
    :param aligned: Set true if the input face is already normalized
    :return:
    """

    img = misc.imread(input_path, mode='RGB')

    if not aligned:
        img = detect_align(img)

    img = (img - 127.5) / 128.0

    images = np.tile(img[None], [num_styles, 1, 1, 1])
    scales = scale * np.ones(num_styles)
    styles = np.random.normal(0., 1., (num_styles, network.input_style.shape[1].value))

    output = network.generate_BA(images, scales, 16, styles=styles)
    output = 0.5 * output + 0.5

    out_name = os.path.basename(input_path).split(".")[0]

    outputs = []
    for i in range(num_styles):
        image_name = f"{out_name}_{i}.jpg"
        outputs.append(image_name)

        full_out_path = f"{output_path}/{image_name}"
        misc.imsave(full_out_path, output[i])

    return outputs


if __name__ == "__main__":
    print("Initiating neural net")
    model_dir = "WarpGAN/pretrained/warpgan_pretrained"
    trigger_nn("WarpGAN/data/example/Josh.jpeg", "app/WarpGAN/result")
    print("Image successfully created")
