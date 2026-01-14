from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

def load_pdf(data_path):
    """
    Load PDF file and extract text
    
    Args:
        data_path: Path to the PDF file
        
    Returns:
        List of document objects
    """
    loader = PyPDFLoader(data_path)
    documents = loader.load()
    return documents

def text_split(extracted_data):
    """
    Split text into chunks for better embedding and retrieval
    
    Args:
        extracted_data: List of document objects
        
    Returns:
        List of text chunks
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    text_chunks = text_splitter.split_documents(extracted_data)
    return text_chunks

def download_gemini_embeddings():
    """
    Initialize and return Gemini embeddings model
    
    Returns:
        GoogleGenerativeAIEmbeddings object
    """
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=api_key
    )
    return embeddings

def create_pinecone_index(index_name="medical-chatbot"):
    """
    Create Pinecone index if it doesn't exist
    
    Args:
        index_name: Name of the Pinecone index
    """
    pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
    
    # Check if index already exists
    existing_indexes = [index.name for index in pc.list_indexes()]
    
    if index_name not in existing_indexes:
        pc.create_index(
            name=index_name,
            dimension=768,  # Gemini embedding dimension
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        print(f"Created new index: {index_name}")
    else:
        print(f"Index {index_name} already exists")
    
    return index_name

def store_embeddings_pinecone(text_chunks, embeddings, index_name="medical-chatbot"):
    """
    Store document embeddings in Pinecone vector database
    
    Args:
        text_chunks: List of text chunks to embed
        embeddings: Embedding model
        index_name: Name of the Pinecone index
        
    Returns:
        PineconeVectorStore object
    """
    # Create index if it doesn't exist
    create_pinecone_index(index_name)
    
    # Store embeddings
    vectorstore = PineconeVectorStore.from_documents(
        documents=text_chunks,
        embedding=embeddings,
        index_name=index_name
    )
    
    return vectorstore

def load_vectorstore(embeddings, index_name="medical-chatbot"):
    """
    Load existing Pinecone vector store
    
    Args:
        embeddings: Embedding model
        index_name: Name of the Pinecone index
        
    Returns:
        PineconeVectorStore object
    """
    vectorstore = PineconeVectorStore(
        index_name=index_name,
        embedding=embeddings
    )
    
    return vectorstore
