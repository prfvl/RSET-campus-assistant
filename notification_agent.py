from notification_service import send_notification


def handle_notification(question):

    # For demo purposes we send a sample notification
    email = "student@rajagiri.edu.in"
    event = "Upcoming Assignment"
    date = "2026-04-10"
    time = "23:59"

    send_notification(email, event, date, time)

    return "Notification sent successfully."