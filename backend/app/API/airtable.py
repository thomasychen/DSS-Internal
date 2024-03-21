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
        people_records = table.all(view='Grid view', max_records=3)  # Adjust view name if needed
        friend_ids = [person['id'] for person in people_records]

        # Initialize placeholders for the closest friends
        closest_friends = []

        # Fetch each friend's details from their IDs and append to closest_friends list
        for friend_id in friend_ids:
            if friend_id != person_id:  # Exclude the person's own ID
                try:
                    friend_record = table.get(friend_id)
                    friend_details = {
                        'id': friend_record['id'],
                        'name': friend_record['fields'].get('Name', 'Unknown'),
                        'image': friend_record['fields'].get('Images', [{"url": "no image"}])[0]["url"],
                        # Fetch additional info for each friend
                        'position': friend_record['fields'].get('Current Position', 'No position listed'),
                        'email': friend_record['fields'].get('Email', 'No email listed')
                    }
                    closest_friends.append(friend_details)
                    logger.info(f"Fetched friend: {friend_details}")
                except Exception as e:
                    logger.error(f"Error fetching friend details for ID {friend_id}: {e}")
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
