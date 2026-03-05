from schedule_manager import get_all_events, add_event

print("Test started")

print("Current events:")
print(get_all_events())

add_event("ML Assignment", "20 April", "11:59 PM")

print("After adding event:")
print(get_all_events())