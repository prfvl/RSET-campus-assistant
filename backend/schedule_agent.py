from schedule_service.schedule_manager import get_all_events


def handle_schedule_query(question):

    events = get_all_events()

    if not events:
        return "No events scheduled."

    response = "Upcoming Events:\n"

    for e in events:
        response += f"{e['title']} on {e['date']} at {e['time']}\n"

    return response
