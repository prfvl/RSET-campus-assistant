from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama


# Load embedding model (same used in build_vector_db.py)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load FAISS vector database
vector_db = FAISS.load_local(
    "rag/vector_store",
    embeddings,
    allow_dangerous_deserialization=True
)

# Retriever
retriever = vector_db.as_retriever(search_kwargs={"k": 1})


# Local LLM
llm = ChatOllama(
    model="tinyllama",
    temperature=0
)


def ask_question(question):

    docs = retriever.invoke(question)

    print("\nRetrieved Document:\n")

    for doc in docs:
        print(doc.page_content)
        print("-----")

    # Extract the exact retrieved text
    context = docs[0].page_content

    # Force model to use only retrieved text
    prompt = f"""
You are an assistant for Rajagiri School of Engineering and Technology (RSET).

Answer the question using ONLY the information below.

Information:
{context}

Question: {question}

Give the answer directly using the information above.
"""

    response = llm.invoke(prompt)

    return response.content


if __name__ == "__main__":

    while True:

        question = input("\nAsk a question (type 'exit' to quit): ")

        if question.lower() == "exit":
            break

        answer = ask_question(question)

        print("\nAnswer:", answer)