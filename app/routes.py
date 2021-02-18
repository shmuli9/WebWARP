import time

from flask import Blueprint

# from app import db

bp = Blueprint("routes", __name__)


@bp.route("/test", methods=["GET", "POST"])
def test_route():
    """
    POST params:

    :return:
    """
    # trigger neural net
    num_styles = 1
    from app import test
    start = time.time()
    test.trigger_nn("app/WarpGAN/data/example/Joker.jpeg", "app/WarpGAN/result", num_styles)

    return {
        "data": "Success",
        "num_styles": num_styles,
        "time_taken": time.time() - start
    }
