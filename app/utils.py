import os
import shutil

from flask import current_app
from app.init_app import model_init_app


def exec_command(cmd):
    model_dir = current_app.config["MODEL_DIRECTORY"]
    parent_dir = os.path.dirname(model_dir)

    if cmd == "rmzip":
        zip_path = os.path.join(parent_dir, "warpgan_pretrained.zip")
        return delete(zip_path, cmd)

    elif cmd == "reset":
        # remove model
        data = delete(parent_dir, cmd)

        if not data["success"]:
            # directory not deleted successfully
            return data

        model_init_app(True)
        delete(os.path.join(parent_dir, 'warpgan_pretrained.zip'), cmd="reset, post download")

        return {
            "msg": f"command {cmd} executed successfully",
            "outcome": "pretrained model removed and re-downloaded",
            "success": True
        }


def delete(path, cmd="rmzip"):
    """
    Utility to delete directories or files
    :param path: path to directory/file to be deleted
    :param cmd: the command being executed (for logging)
    :return:
    """
    if os.path.exists(path):
        try:
            if os.path.isdir(path):
                shutil.rmtree(path)
            elif os.path.isfile(path):
                os.remove(path)

        except OSError as err:
            return {
                "msg": f"command {cmd} failed",
                "outcome": str(err),
                "success": False
            }
        return {
            "msg": f"command {cmd} executed successfully",
            "outcome": f"file {path} deleted",
            "success": True
        }
    return {
        "msg": f"file {path} not present",
        "outcome": None,
        "success": False
    }


def allowed_file(filename):
    """
    Utility to prevent non-images being uploaded
    :param filename:
    :return:
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]
