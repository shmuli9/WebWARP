import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))
    STATIC_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend\\build')
    UPLOAD_FOLDER = os.path.join(STATIC_FOLDER, "uploads")
    RESULTS_FOLDER = os.path.join(STATIC_FOLDER, "results")

    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

    # Flask parameters
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI") or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MIGRATIONS_DIR = "migrations"
