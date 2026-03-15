import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_notification(email, event, date, time):

    # Sender email credentials
    sender_email = "u2303197@rajagiri.edu.in"
    app_password = "vtvrlgluwkvwksph"

    # Create email subject and body
    subject = "Campus Event Reminder"
    body = f"""
Hello Student,

This is a reminder for your upcoming campus event.

Event Name: {event}
Date: {date}
Time: {time}

Please make sure to attend on time.

Best Regards,
Campus Notification System
"""

    try:
        # Create email message
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        # Connect to Gmail SMTP server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        # Login to Gmail
        server.login(sender_email, app_password)

        # Send email
        server.send_message(msg)

        # Close connection
        server.quit()

        print("\n✅ Email notification sent successfully!")

    except Exception as e:
        print("\n❌ Error sending email:", e)