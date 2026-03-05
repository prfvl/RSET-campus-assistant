import json

FILE_PATH = "schedule_service/schedule_data.json"


def load_schedule():
    with open(FILE_PATH, "r") as file:
        data = json.load(file)
    return data["events"]


def get_all_events():
    return load_schedule()


def add_event(title, date, time):

    events = load_schedule()

    new_event = {
        "title": title,
        "date": date,
        "time": time
    }

    events.append(new_event)

    with open(FILE_PATH, "w") as file:
        json.dump({"events": events}, file, indent=4)