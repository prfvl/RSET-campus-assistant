import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama

# Resolve paths relative to this file's directory
_DIR = os.path.dirname(os.path.abspath(__file__))
_VECTOR_STORE_PATH = os.path.join(_DIR, "vector_store")

# Load embedding model (same used in build_vector_db.py)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load FAISS vector database
vector_db = FAISS.load_local(
    _VECTOR_STORE_PATH,
    embeddings,
    allow_dangerous_deserialization=True
)

# Retriever
retriever = vector_db.as_retriever(search_kwargs={"k": 1})


# Local LLM
llm = ChatOllama(
    model="qwen2:0.5b",
    temperature=0
)


def ask_question(question):

    docs = retriever.invoke(question)
    
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
