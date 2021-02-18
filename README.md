### WebWARP
##### A web interface for WarpGAN

### Testing

Run the test code in the following format:
    
    python test.py /path/to/model/dir /path/to/input/image /prefix/of/output/image

For example, from the root directory run the following commands to generate 5 images for Captain Marvel of different random styles:

    python app/WarpGAN/test.py app/WarpGAN/pretrained/warpgan_pretrained app/WarpGAN/data/example/CaptainMarvel.jpg app/WarpGAN/result/CaptainMarvel --num_styles 5

You can also change the warping extent by using the --scale argument. For example, the following command doubles the displacement of the warpping control points:

    python app/WarpGAN/test.py app/WarpGAN/pretrained/warpgan_pretrained app/WarpGAN/data/example/CaptainMarvel.jpg app/WarpGAN/result/CaptainMarvel --num_styles 5 --scale 2.0
