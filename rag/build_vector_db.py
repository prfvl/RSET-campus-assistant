import json
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

documents = []

# Load FAQ data
with open("../data/raw/data/processed/faq.json", "r") as f:
    faq_data = json.load(f)

for item in faq_data:
    text = f"Question: {item['question']}\nAnswer: {item['answer']}"
    
    documents.append(
        Document(
            page_content=text,
            metadata={"source": "faq"}
        )
    )


# Load CSE department data
with open("../data/raw/data/processed/cse_department.json", "r") as f:
    dept_data = json.load(f)


# Department description
documents.append(
    Document(
        page_content=f"Department: {dept_data['department_name']}\nAbout: {dept_data['about']}",
        metadata={"source": "cse_department"}
    )
)

# Programs offered
documents.append(
    Document(
        page_content="Programs Offered:\n" + "\n".join(dept_data["programs_offered"]),
        metadata={"source": "cse_department"}
    )
)

# Laboratories
documents.append(
    Document(
        page_content="Laboratories:\n" + "\n".join(dept_data["laboratories"]),
        metadata={"source": "cse_department"}
    )
)

# Core subjects
documents.append(
    Document(
        page_content="Core Subjects:\n" + "\n".join(dept_data["core_subjects"]),
        metadata={"source": "cse_department"}
    )
)

# Career opportunities
documents.append(
    Document(
        page_content="Career Opportunities:\n" + "\n".join(dept_data["career_opportunities"]),
        metadata={"source": "cse_department"}
    )
)


print(f"Loaded {len(documents)} documents.")


# Load embedding model (offline)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# Create FAISS vector database
vector_db = FAISS.from_documents(documents, embeddings)


# Save database
vector_db.save_local("vector_store")


print("Vector database created successfully!")