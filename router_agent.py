from rag_agent import handle_rag_query
from schedule_agent import handle_schedule_query
from notification_agent import handle_notification
from langchain_ollama import ChatOllama

llm = ChatOllama(model="tinyllama", temperature=0)

def route_question(question):

    q = question.lower()

    # Hard rules for reliability
    if "remind" in q or "notify" in q or "alert" in q:
        return handle_notification(question)

    if "schedule" in q or "timetable" in q or "event" in q:
        return handle_schedule_query(question)

    # LLM decides for other queries
    prompt = f"""
You are an AI router for a campus assistant.

Choose ONE agent:

RAG → explanations, definitions, academic info
SCHEDULE → exams, assignments, timetable
NOTIFICATION → reminders, alerts

Return only the word.

Question: {question}
"""

    decision = llm.invoke(prompt).content.strip().upper()

    if "SCHEDULE" in decision:
        return handle_schedule_query(question)

    elif "NOTIFICATION" in decision:
        return handle_notification(question)

    else:
        return handle_rag_query(question)