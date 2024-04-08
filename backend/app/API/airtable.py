from flask import Flask, jsonify, Blueprint, request
from pyairtable import Api, Base
from pyairtable.formulas import match
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

import logging

# Set up logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_person_with_friends_by_id(person_id):
    try:
        # Fetch the individual record by ID
        record = table.get(person_id)

        # Extract major, house, and current position from the record
        major = record['fields'].get('Major', 'No major listed')
        house = record['fields'].get('House', 'No house listed')
        current_position = record['fields'].get('Current Position', 'No current position listed')

        # Get the first three people's IDs from the Airtable
        # I don't need below lines if im getting top 3 friends
        #people_records = table.all(view='Grid view', max_records=3)  # Adjust view name if needed
        #friend_ids = [person['id'] for person in people_records]

        # Extract the IDs of the top 3 friends
        friend_names = [record['fields'].get(f'friend_{i}') for i in range(1, 4)]

        # Initialize placeholders for the closest friends
        closest_friends = []

        # Fetch each friend's details from their IDs and append to closest_friends list
        for friend_name in friend_names:
            if friend_name:  # Exclude the person's own ID
                try:
                    formula = match({"Name": friend_name})
                    matching_record = table.first(formula=formula)
                    if matching_record:
                        friend_record = matching_record
                        friend_details = {
                            'id': friend_record['id'],
                            'name': friend_record['fields'].get('Name', 'Unknown'),
                            'image': friend_record['fields'].get('Images', [{"url": "no image"}])[0]["url"],
                            'position': friend_record['fields'].get('Current Position', 'No position listed'),
                            'email': friend_record['fields'].get('Email', 'No email listed')
                        }
                        closest_friends.append(friend_details)
                        logger.info(f"Fetched friend: {friend_details}")
                    else:
                        raise Exception(f"{friend_name} not found in database")
                except Exception as e:
                    logger.error(f"Error fetching friend details for ID {friend_name}: {e}")
                    friend_details = {
                            'id': "",
                            'name': str(e),
                            'image': "",
                            'position': "",
                            'email': ""
                    }
                    closest_friends.append(friend_details)
                    # Log error or assign placeholder if needed

        # Construct the person details including the closest friends separately and person's own details
        person = {
            'id': record['id'],
            'name': record['fields'].get('Name', ''),
            'major': major,
            'house': house,
            'current_position': current_position,
            'image': record['fields'].get('Images', [{"url": "no image"}])[0]["url"],
            'email': record['fields'].get('Email', ''),
            'closest_friends': closest_friends
        }
        return person
    except Exception as e:
        # Return None if there's an error (e.g., person not found)
        logger.error(f"Error fetching person details for ID {person_id}: {e}")
        return None

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

@mod.route('/get-personal-data-with-friends', methods=['GET'])
def get_personal_data_with_friends():
    person_id = request.args.get('person_id')
    person = fetch_person_with_friends_by_id(person_id)
    if person:
        return jsonify(person)
    return jsonify({'error': 'Person not found'})
