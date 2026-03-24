import json
import os

_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(_DIR, "schedule_data.json")

def load_events():
    try:
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    except:
        return []

def save_events(events):
    with open(DATA_FILE, "w") as file:
        json.dump(events, file, indent=4)

def get_all_events():
    return load_events()

def add_event(title, date, time):
    events = load_events()

    new_event = {
        "title": title,
        "date": date,
        "time": time
    }

    events.append(new_event)
    save_events(events)

    return new_event
