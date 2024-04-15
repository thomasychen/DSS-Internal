from flask import Flask
from app.auth.views import mod as module_one_mod
from app.API.airtable import mod as module_two_mod
import os

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

    app.register_blueprint(module_one_mod)
    app.register_blueprint(module_two_mod)

    return app