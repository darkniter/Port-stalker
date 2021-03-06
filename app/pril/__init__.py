from flask import Flask

# from os import path
from pril import config

def init_app():
    app = Flask(__name__)
    app.config.from_object(config)
    return app


app = init_app()

from pril import forms, views, SQLbase, Kladr_driver
