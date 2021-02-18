import os
import time

from flask import Blueprint, request, url_for
from werkzeug.utils import secure_filename

from app.config import Config

# from app import db

bp = Blueprint("routes", __name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS


@bp.route("/upload", methods=["POST"])
def upload_image():
    """
    POST params:
        num_styles:
        scale:
        file:

    :return:
    """

    if request.method == "POST":
        if 'file' not in request.files:
            print('No file part')
            return redirect(request.url)

        file = request.files['file']

        if file.filename == '':
            print('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            pth = os.path.join(Config.UPLOAD_FOLDER, filename)
            file.save(pth)

            # trigger neural net
            num_styles = request.form.get("num_styles", default=1, type=int)
            scale = request.form.get("scale", default=1.0, type=float)

            from app import warpgan as wg
            start = time.time()
            images = wg.trigger_nn(pth, Config.RESULTS_FOLDER, num_styles, scale)
            total = time.time() - start

            image_urls = [url_for("static", filename=f"results/{image}") for image in images]

            os.remove(pth)

            return {
                "num_styles": num_styles,
                "time_taken": total,
                "image": image_urls
            }
