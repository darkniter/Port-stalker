from flask import Flask
def init_app():
    app = Flask(__name__)

    return app

app = init_app()
from pril import views