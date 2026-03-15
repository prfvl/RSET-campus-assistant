import time
from datetime import datetime, timedelta
from notification_service import send_notification

events = []

# Take user input
email = input("Enter student email: ").strip()

# Allow only Rajagiri emails
if not email.endswith("@rajagiri.edu.in"):
    print("❌ Only Rajagiri emails are allowed.")
    exit()

event_name = input("Enter event name: ").strip()
event_date = input("Enter event date (YYYY-MM-DD): ").strip()
event_time = input("Enter event time: ").strip()

# Store event
events.append({
    "email": email,
    "event": event_name,
    "date": event_date,
    "time": event_time,
    "notified_2day": False,
    "notified_1day": False,
    "notified_today": False
})


def check_events():

    today = datetime.today().date()
    print("\nToday's date:", today)

    for event in events:

        try:
            event_date = datetime.strptime(event["date"], "%Y-%m-%d").date()
        except ValueError:
            print("❌ Invalid date format. Use YYYY-MM-DD.")
            continue

        print("\nChecking event:", event["event"])
        print("Event date:", event_date)

        # 2-day reminder
        if event_date == today + timedelta(days=2) and not event["notified_2day"]:
            print("📢 Event is in 2 days! Sending notification...")

            send_notification(
                event["email"],
                event["event"],
                event["date"],
                event["time"]
            )

            event["notified_2day"] = True

        # 1-day reminder
        elif event_date == today + timedelta(days=1) and not event["notified_1day"]:
            print("📢 Event is tomorrow! Sending notification...")

            send_notification(
                event["email"],
                event["event"],
                event["date"],
                event["time"]
            )

            event["notified_1day"] = True

        # Same-day reminder
        elif event_date == today and not event["notified_today"]:
            print("📢 Event is today! Sending notification...")

            send_notification(
                event["email"],
                event["event"],
                event["date"],
                event["time"]
            )

            event["notified_today"] = True

        elif event_date > today + timedelta(days=2):
            print("Event is in the future. Notification will be sent later.")

        else:
            print("No notification needed.")


# Run checker once every day
while True:
    check_events()
    print("\nNext check will run in 24 hours...")
    time.sleep(86400)  # 24 hours