from flask import Blueprint, jsonify, request, make_response, current_app
from flask_cors import cross_origin
import requests
import datetime
import jwt

from pyairtable import Api, Base
from pyairtable.formulas import match
import os
from dotenv import load_dotenv


load_dotenv(override=True)

BASE_ID = 'appkzoV3T5OcsljQl'
TABLE_NAME = 'tbl4TdhgfK0Qt5k6f'
ACCESS_TOKEN = os.environ.get('AIRTABLE_TOKEN')

api = Api(ACCESS_TOKEN)
base = Base(api, BASE_ID)
table = base.table(TABLE_NAME)

mod = Blueprint('auth', __name__, url_prefix='/auth')

@mod.route('/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({"message": "Logged out successfully"}))
    resp.set_cookie('auth_token', '', expires=0)  # Clear the cookie
    return resp

@mod.route('/session-status', methods=['GET'])
def check_session_status():
    # Access the cookie containing the JWT
    token_cookie = request.cookies.get('auth_token')
    if not token_cookie:
        return jsonify(status="inactive"), 401
    try:
        # Attempt to decode the JWT
        payload= jwt.decode(token_cookie, current_app.config.get("SECRET_KEY"), algorithms=["HS256"])
        return jsonify(status="active", userEmail=payload["email"], userExpiration=payload["exp"], userPicture=payload['user_photo']), 200
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify(status="inactive"), 401

@mod.route('/verify-google-token', methods=['POST'])
def verify_google_token():
    token = request.json.get('token')
    # Verify the token with Google's servers
    google_response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={token}')
    if google_response.ok:
        google_data = google_response.json()
        user_email = google_data['email']
        user_picture = google_data.get('picture', '')  # Retrieve profile picture URL
        # Check if the email is in your CSV/mailing list
        email_valid = check_email_in_list(user_email)
        if email_valid:
            custom_token = generate_jwt(user_email, user_picture)
            resp = make_response(jsonify(success=True, emailValid=True, userEmail=user_email, userPicture=user_picture))
            resp.set_cookie('auth_token', custom_token, httponly=True, secure=True, path='/')
        else:
            resp = make_response(jsonify(success=True, emailValid=False, userEmail=user_email, userPicture=user_picture))
        return resp 
    return jsonify(success=False, emailValid=False, userEmail="", userPicture="")

def check_email_in_list(email):
    # Implement your logic to check against the CSV/mailing list
    # For example, you could load the CSV and check if the email is in it
    ## use google sheets api to check current dss roster or smt
    return True  # or False, based on your validation

def generate_jwt(user_email, user_picture_link):
    payload = {
        'user_photo':user_picture_link,
        'email': user_email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expires in 1 day
    }
    token = jwt.encode(payload, current_app.config.get("SECRET_KEY"), algorithm='HS256')
    return token