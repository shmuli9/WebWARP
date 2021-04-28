import os
import time

from flask import Blueprint, request, url_for, current_app, redirect, jsonify
from werkzeug.utils import secure_filename

from app.utils import exec_command, allowed_file
from flask_cors import CORS

api = Blueprint("api_routes", __name__, url_prefix="/api")
CORS(api)

@api.route("/status/", methods=["POST"])
@api.route("/status/<command>", methods=["POST"])
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

    # log files
    # nginx error/nginx access/flask log
    flask_logs_dir = os.path.join(current_app.config["ROOT_FOLDER"], "../logs")
    flask_logs = open(os.path.join(flask_logs_dir, "webwarp.log"), "r").readlines()[-100:]
    flask_logs.reverse()

    nginx_logs_dir = "/var/log"
    nginx_access_logs, nginx_error_logs = [], []

    if os.path.exists(nginx_logs_dir):
        if os.path.exists(os.path.join(nginx_logs_dir, "webwarp_access.log")):
            nginx_access_logs = open(os.path.join(nginx_logs_dir, "webwarp_access.log")).readlines()[-100:]
            nginx_access_logs.reverse()
        if os.path.exists(os.path.join(nginx_logs_dir, "webwarp_error.log")):
            nginx_error_logs = open(os.path.join(nginx_logs_dir, "webwarp_error.log")).readlines()[-100:]
            nginx_error_logs.reverse()

    data = {
        "configured_model_dir": model_dir,
        "parent_dir_exists": parent_dir_exists,
        "parent_dir_contents": parent_dir_contents,
        "model_dir_exists": model_dir_exists,
        "model_dir_contents": model_dir_contents,
        "flask_logs": flask_logs,
        "nginx_error_logs": nginx_error_logs,
        "nginx_access_logs": nginx_access_logs
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
            aligned = True if request.form.get("aligned", default="false", type=str) == "true" else False

            from app import warpgan

            try:
                start = time.time()
                images = warpgan.trigger_nn(upload_path, current_app.config["RESULTS_FOLDER"], num_styles, scale,
                                            aligned)
                total = time.time() - start

            except Exception as e:
                current_app.logger.error(e.with_traceback(e.__traceback__))
                return jsonify({"error": e.args}), 415  # Unsupported Media Type

            image_urls = [url_for("static", filename=f"results/{image}") for image in images]

            os.remove(upload_path)

            return {
                "num_styles": num_styles,
                "time_taken": total,
                "image": image_urls
            }

        return {"msg": "error"}
