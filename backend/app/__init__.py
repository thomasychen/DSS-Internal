from flask import Flask
from app.auth.views import mod as module_one_mod
from dotenv import load_dotenv
import os

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

    app.register_blueprint(module_one_mod)

    return app