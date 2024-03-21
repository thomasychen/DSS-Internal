from flask import Flask, jsonify, Blueprint, request
from pyairtable import Api, Base
import os

mod = Blueprint('api', __name__, url_prefix='/api')

BASE_ID = 'appkzoV3T5OcsljQl'
TABLE_NAME = 'tbl4TdhgfK0Qt5k6f'
ACCESS_TOKEN = os.environ.get('AIRTABLE_TOKEN')

api = Api(ACCESS_TOKEN)
base = Base(api, BASE_ID)
table = base.table(TABLE_NAME)

def fetch_data():
    records = table.all()
    people = []
    for record in records:
        person = {
            'id': record['id'],  # Include unique ID for each person
            'name': record['fields'].get('Name', ''),
            'position': record['fields'].get('Current Position', ["No positions"]),
            'image': record['fields'].get('Images', [{"url":"no image"}])[0]["url"],
            'email': record['fields'].get('Email', '')
        }
        people.append(person)
    return people

@mod.route('/get-personal-data', methods=['GET'])
def get_personal_data():
    person_id = request.args.get('person_id')  # Get person ID from query string
    
    # Find the person in the data by ID
    for person in fetch_data():
        if person['id'] == person_id:
            return jsonify(person)
    
    return jsonify({'error': 'Person not found'})

@mod.route('/get-data', methods=['GET'])
def get_data():
    people = fetch_data()
    return jsonify(people)
