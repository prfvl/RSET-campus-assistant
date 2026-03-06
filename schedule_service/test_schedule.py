from schedule_manager import get_all_events, add_event

print("Test started")

print("Current events:")
print(get_all_events())

title = input("Enter event title: ")
date = input("Enter event date: ")
time = input("Enter event time: ")

add_event(title, date, time)

print("After adding event:")
print(get_all_events())