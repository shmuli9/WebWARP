import os
import time

from flask import Blueprint, request, url_for, current_app, redirect
from werkzeug.utils import secure_filename

from app.utils import exec_command, allowed_file
from app.init_app import model_init_app

api = Blueprint("api_routes", __name__, url_prefix="/api")


@api.route("/status/", methods=["GET", "POST"])
@api.route("/status/<command>", methods=["GET", "POST"])
def system_status(command=None):
    """
    Return system status

    :return:
    """
    model_dir = current_app.config["MODEL_DIRECTORY"]
    model_dir_exists = os.path.exists(model_dir)
    model_dir_contents = os.listdir(model_dir) if model_dir_exists else []

    parent_dir = os.path.dirname(model_dir)
    parent_dir_exists = os.path.exists(parent_dir)
    parent_dir_contents = os.listdir(parent_dir) if parent_dir_exists else []

    if command:
        return exec_command(command)

    data = {
        "configured_model_dir": model_dir,
        "parent_dir_exists": parent_dir_exists,
        "parent_dir_contents": parent_dir_contents,
        "model_dir_exists": model_dir_exists,
        "model_dir_contents": model_dir_contents,
    }

    return data


@api.route("/upload", methods=["POST"])
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
            current_app.logger.debug('Error in Upload - No file part')
            return redirect(request.url)

        file = request.files['file']

        if file.filename == '':
            current_app.logger.debug('Error in Upload - No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
            file.save(upload_path)

            # trigger neural net
            num_styles = request.form.get("num_styles", default=1, type=int)
            scale = request.form.get("scale", default=1.0, type=float)

            from app import warpgan
            start = time.time()
            images = warpgan.trigger_nn(upload_path, current_app.config["RESULTS_FOLDER"], num_styles, scale, True)
            total = time.time() - start

            image_urls = [url_for("static", filename=f"results/{image}") for image in images]

            # os.remove(upload_path)

            return {
                "num_styles": num_styles,
                "time_taken": total,
                "image": image_urls
            }

        return {"msg": "error"}
