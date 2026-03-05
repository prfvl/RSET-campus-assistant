class ScheduleManager:

    def __init__(self):
        self.events = []

    def add_event(self, title, date, time):
        event = {
            "title": title,
            "date": date,
            "time": time
        }
        self.events.append(event)
        return "Event added"

    def get_events(self):
        return self.events