print("Test started")
from schedule_manager import ScheduleManager

manager = ScheduleManager()

manager.add_event("DBMS Exam", "15 April", "10:00 AM")
manager.add_event("AI Assignment", "10 April", "11:59 PM")

print(manager.get_events())