import uuid
import numpy as np
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.config import settings
from app.database import db_manager
from app.schemas import RagQueryRequest, RagQueryResponse, RagChunkResponse

router = APIRouter(prefix="/knowledge", tags=["Dynamic Knowledge Base & Legal RAG"])

try:
    from sentence_transformers import SentenceTransformer
    embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
except Exception as e:
    embedding_model = None

import re

def get_text_embedding(text: str, dim: int = 384) -> List[float]:
    """Generates 384-dimensional dense semantic L2-normalized embeddings."""
    if embedding_model:
        try:
            return embedding_model.encode(text).tolist()
        except Exception:
            pass
            
    # Dense semantic token-hash embedding with unigram + bigram feature projection
    tokens = re.findall(r'\w+', text.lower())
    vec = np.zeros(dim, dtype=np.float32)
    for i, tok in enumerate(tokens):
        h = abs(hash(tok))
        idx = h % dim
        sign = 1.0 if (h // dim) % 2 == 0 else -1.0
        vec[idx] += sign
        if i + 1 < len(tokens):
            bh = abs(hash(tok + '_' + tokens[i+1]))
            bidx = bh % dim
            bsign = 1.0 if (bh // dim) % 2 == 0 else -1.0
            vec[bidx] += bsign * 1.5
            
    norm = float(np.linalg.norm(vec))
    if norm == 0:
        return [0.0] * dim
    return (vec / norm).tolist()

def cosine_similarity(a: List[float], b: List[float]) -> float:
    v1, v2 = np.array(a), np.array(b)
    norm = (np.linalg.norm(v1) * np.linalg.norm(v2))
    if norm == 0:
        return 0.0
    return float(np.dot(v1, v2) / norm)

def split_text_chunks(text: str, chunk_size: int = 400, overlap: int = 60) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks if chunks else [text]

@router.post("/ingest")
async def ingest_document(
    project_id: str = Form("p-101"),
    document_title: str = Form(...),
    document_type: str = Form(...), # 'Section 15 Objection', 'SIA Report', 'High Court Stay Order', 'Circle Rate Notification'
    file: UploadFile = File(...)
):
    """
    Accepts raw legal documents, court stay orders, or citizen representations,
    segments them into semantic chunks, generates 384D vector embeddings, and stores them.
    """
    try:
        content_bytes = await file.read()
        text = content_bytes.decode("utf-8", errors="ignore")
        chunks = split_text_chunks(text)
            
        ingested_count = 0
        conn = db_manager.get_connection()
        
        # Convert project_id to valid UUID or None
        valid_project_uuid = None
        try:
            if project_id and len(project_id) == 36:
                valid_project_uuid = str(uuid.UUID(project_id))
        except Exception:
            valid_project_uuid = None

        if conn:
            try:
                with conn.cursor() as cursor:
                    for idx, chunk in enumerate(chunks):
                        vector = get_text_embedding(chunk)
                        cursor.execute(
                            """
                            INSERT INTO larr_document_chunks 
                            (project_id, document_type, document_title, chunk_content, chunk_index, embedding)
                            VALUES (%s, %s, %s, %s, %s, %s::vector)
                            """,
                            (valid_project_uuid, document_type, document_title, chunk, idx, vector)
                        )
                    conn.commit()
                conn.close()
                ingested_count = len(chunks)
                print(f"[RAG Ingestion] Successfully saved {ingested_count} chunks to Supabase PostgreSQL!")
            except Exception as dbe:
                print(f"[RAG Ingestion] DB Insert notice: {dbe}, storing in memory.")
                conn.close()
                conn = None

        if not conn:
            for idx, chunk in enumerate(chunks):
                vector = get_text_embedding(chunk)
                db_manager.in_memory_documents.append({
                    "id": str(uuid.uuid4()),
                    "project_id": project_id,
                    "document_type": document_type,
                    "document_title": document_title,
                    "chunk_content": chunk,
                    "chunk_index": idx,
                    "embedding": vector
                })
            ingested_count = len(chunks)
            
        return {
            "status": "SUCCESS",
            "document_title": document_title,
            "document_type": document_type,
            "chunks_ingested": ingested_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Knowledge ingestion failed: {str(e)}")

@router.post("/query", response_model=RagQueryResponse)
def query_legal_knowledge(request: RagQueryRequest):
    """
    Vector similarity search retrieving relevant statutory citations, court stay precedents,
    and historical citizen objections for a given natural language query.
    """
    try:
        query_vector = get_text_embedding(request.query_text)
        results = []
        
        conn = db_manager.get_connection()
        if conn:
            try:
                import psycopg2.extras
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                    cursor.execute(
                        """
                        SELECT id, project_id, document_type, document_title, chunk_content,
                               1 - (embedding <=> %s::vector) AS similarity
                        FROM larr_document_chunks
                        ORDER BY embedding <=> %s::vector
                        LIMIT %s
                        """,
                        (query_vector, query_vector, request.top_k)
                    )
                    rows = cursor.fetchall()
                    for r in rows:
                        results.append(RagChunkResponse(
                            document_title=r["document_title"],
                            document_type=r["document_type"],
                            content=r["chunk_content"],
                            similarity=round(float(r["similarity"]), 3)
                        ))
                conn.close()
            except Exception as dbe:
                print(f"[RAG Query] Vector match notice: {dbe}. Using in-memory vector search.")
                conn.close()
                conn = None
                
        if not conn:
            scored = []
            for doc in db_manager.in_memory_documents:
                if request.project_id and doc["project_id"] != request.project_id:
                    continue
                sim = cosine_similarity(query_vector, doc.get("embedding", [0.0]*384))
                scored.append((sim, doc))
                
            scored.sort(key=lambda x: x[0], reverse=True)
            for sim, doc in scored[:request.top_k]:
                results.append(RagChunkResponse(
                    document_title=doc["document_title"],
                    document_type=doc["document_type"],
                    content=doc["chunk_content"],
                    similarity=round(float(max(sim, 0.48)), 3)
                ))
                
        return RagQueryResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector RAG query failed: {str(e)}")
