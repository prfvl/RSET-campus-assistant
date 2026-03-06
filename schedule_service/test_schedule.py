from schedule_service.schedule_manager import *

print("Test started")

print("\nCurrent events:")
print(get_all_events())

print("\nAdd a new event")

title = input("Enter event title: ")
date = input("Enter event date (YYYY-MM-DD): ")
time = input("Enter event time: ")

add_event(title, date, time)

print("\nEvent added successfully!")

print("\nUpdated events:")
print(get_all_events())