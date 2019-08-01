from flask import Flask
from os import path
from pril import config
def init_app():
    app = Flask(__name__)
    app.config.update(config.sql_queries)
    app.config.update(config.flask_conf)
    print('TEST_FUCK_VAR:', app.config.get('TEST_FUCK_VAR'))
    return app

app = init_app()

from pril import forms, views, SQLbase

