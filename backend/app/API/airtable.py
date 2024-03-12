from flask import Flask, jsonify, Blueprint
from pyairtable import Api, Base
import os

mod = Blueprint('auth', _name_, url_prefix='/auth')

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
            'Name': record['fields'].get('Name', ''),
            'Position': record['fields'].get('Positions Held', ["No positions"])[0],
            'Image': record['fields'].get('Images', [])
        }
        people.append(person)
    return people

@mod.route('get-data', methods=['GET'])
def get_data():
    people = fetch_data()
    return jsonify(people)