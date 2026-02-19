from __future__ import annotations
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .. import db
from week2.app.services.extract import extract_action_items, extract_action_items_llm

router = APIRouter(prefix="/action-items", tags=["action-items"])

class ExtractRequest(BaseModel):
    text: str
    save_note: bool = True

@router.post("/extract")
async def extract(request: ExtractRequest):
    """Endpoint untuk ekstraksi standar (heuristik)."""
    items_text = extract_action_items(request.text)
    
    note_id = None
    if request.save_note:
        note_id = db.insert_note(request.text)
    
    
    item_ids = db.insert_action_items(items_text, note_id)
    
   
    saved_items = []
    for i, text in enumerate(items_text):
        saved_items.append({
            "id": item_ids[i], 
            "text": text, 
            "done": False
        })
        
    return {"items": saved_items}

@router.post("/extract-llm")
async def extract_llm(request: ExtractRequest):
    """Endpoint untuk ekstraksi cerdas menggunakan LLM (Llama 3.1)."""
    
    items_text = extract_action_items_llm(request.text)
    
   
    note_id = None
    if request.save_note:
        note_id = db.insert_note(request.text)
    
    
    item_ids = db.insert_action_items(items_text, note_id)
    
    saved_items = []
    for i, text in enumerate(items_text):
        saved_items.append({
            "id": item_ids[i], 
            "text": text, 
            "done": False
        })
        
    return {"items": saved_items}

@router.get("")
def list_all(note_id: Optional[int] = None) -> List[Dict[str, Any]]:
    rows = db.list_action_items(note_id=note_id)
    return [
        {
            "id": r["id"],
            "note_id": r["note_id"],
            "text": r["text"],
            "done": bool(r["done"]),
            "created_at": r["created_at"],
        }
        for r in rows
    ]

@router.post("/{action_item_id}/done")
def mark_done(action_item_id: int, payload: Dict[str, Any]) -> Dict[str, Any]:
    done = bool(payload.get("done", True))
    db.mark_action_item_done(action_item_id, done)
    return {"id": action_item_id, "done": done}