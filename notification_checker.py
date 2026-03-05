from datetime import datetime, timedelta
from notification_service import send_notification

events = []

# Take user input
email = input("Enter student email: ")
event_name = input("Enter event name: ")
event_date = input("Enter event date (YYYY-MM-DD): ")
event_time = input("Enter event time: ")

# Store event
events.append({
    "email": email,
    "event": event_name,
    "date": event_date,
    "time": event_time
})


def check_events():

    today = datetime.today().date()
    print("\nToday's date:", today)

    for event in events:

        # Convert string date to date object
        event_date = datetime.strptime(event["date"], "%Y-%m-%d").date()

        print("\nChecking event:", event["event"])
        print("Event date:", event_date)

        # Check if event is tomorrow
        if event_date == today + timedelta(days=1):

            print("Event is tomorrow! Sending notification...")

            send_notification(
                event["email"],
                event["event"],
                event["date"],
                event["time"]
            )

        else:
            print("No notification needed for this event.")


# Run checker
check_events()