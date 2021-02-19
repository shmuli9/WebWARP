### WebWARP
##### A web interface for WarpGAN

### Development

I ran into an SSL issue when downloading the pretrained model programmatically. To fix, I made the following edit: 

##### Original
###### File: `venv/Lib/site-packages/gdown/download.py:110`

    res = sess.get(url, stream=True)

##### Changed to
###### File: `venv/Lib/site-packages/gdown/download.py:110`
    res = sess.get(url, stream=True, verify=False)

This was a local issue and should work fine once deployed, so no need to worry about editing the venv for deployment.

### Testing

Run the test code in the following format:
    
    python test.py /path/to/model/dir /path/to/input/image /prefix/of/output/image

For example, from the root directory run the following commands to generate 5 images for Captain Marvel of different random styles:

    python app/WarpGAN/test.py app/WarpGAN/pretrained/warpgan_pretrained app/WarpGAN/data/example/CaptainMarvel.jpg app/WarpGAN/result/CaptainMarvel --num_styles 5

You can also change the warping extent by using the --scale argument. For example, the following command doubles the displacement of the warpping control points:

    python app/WarpGAN/test.py app/WarpGAN/pretrained/warpgan_pretrained app/WarpGAN/data/example/CaptainMarvel.jpg app/WarpGAN/result/CaptainMarvel --num_styles 5 --scale 2.0
