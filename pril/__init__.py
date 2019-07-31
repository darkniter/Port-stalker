from flask import Flask


def init_app():
    app = Flask(__name__)
    app.config.from_pyfile("..\\config.py")
    return app


app = init_app()

from pril import forms, views, SQLbase
