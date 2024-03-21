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



#TESTING THIS CODE!!

def fetch_person_with_friends_by_id(person_id):
    try:
        # Fetch the individual record by ID
        record = table.get(person_id)

        # Extract major, house, and current position from the record
        major = record['fields'].get('Major', 'No major listed')
        house = record['fields'].get('House', 'No house listed')
        current_position = record['fields'].get('Current Position', 'No current position listed')

        # Get the IDs of the three closest friends from the record
        friend_ids = record['fields'].get('Closest Friends', [None, None, None])[:3]  # Get first three, fill with None if less

        # Initialize placeholders for the closest friends
        closest_friend1, closest_friend2, closest_friend3 = None, None, None

        # Fetch each friend's details from their IDs and assign to respective variables
        for index, friend_id in enumerate(friend_ids):
            if friend_id:  # Check if friend_id is not None
                try:
                    friend_record = table.get(friend_id)
                    friend_details = {
                        'id': friend_record['id'],
                        'name': friend_record['fields'].get('Name', 'Unknown'),
                        'image': friend_record['fields'].get('Images', [{"url": "no image"}])[0]["url"],
                        # Fetch additional info for each friend
                        'major': friend_record['fields'].get('Major', 'No major listed'),
                        'house': friend_record['fields'].get('House', 'No house listed'),
                        'current_position': friend_record['fields'].get('Current Position', 'No current position listed')
                    }
                    # Assign to respective friend variable based on index
                    if index == 0:
                        closest_friend1 = friend_details
                    elif index == 1:
                        closest_friend2 = friend_details
                    elif index == 2:
                        closest_friend3 = friend_details
                except Exception as e:
                    # Log error or assign placeholder if needed
                    pass

        # Construct the person details including the closest friends separately and person's own details
        person = {
            'id': record['id'],
            'name': record['fields'].get('Name', ''),
            'major': major,
            'house': house,
            'current_position': current_position,
            'image': record['fields'].get('Images', [{"url": "no image"}])[0]["url"],
            'email': record['fields'].get('Email', ''),
            'closest_friend1': closest_friend1,
            'closest_friend2': closest_friend2,
            'closest_friend3': closest_friend3
        }
        return person
    except Exception as e:
        # Return None if there's an error (e.g., person not found)
        return None

@mod.route('/get-personal-data-with-friends', methods=['GET'])
def get_personal_data_with_friends():
    person_id = request.args.get('person_id')
    person = fetch_person_with_friends_by_id(person_id)
    if person:
        return jsonify(person)
    return jsonify({'error': 'Person not found'})
