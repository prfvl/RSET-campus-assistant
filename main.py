from router_agent import route_question

print("RSET AI Campus Assistant")
print("Type 'exit' to quit\n")

while True:

    question = input("Ask: ")

    if question.lower() == "exit":
        break

    answer = route_question(question)

    print("\nAnswer:", answer)