import random
import time

from flask import Blueprint

# from app import db

bp = Blueprint("routes", __name__)


@bp.route("/test", methods=["GET", "POST"])
def test_route():
    # trigger neural net
    from app import test
    test.trigger_nn("app/WarpGAN/data/example/Joker.jpeg", "app/WarpGAN/result")

    return {"data": "Success"}
