from __future__ import annotations

from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from .. import db


router = APIRouter(prefix="/notes", tags=["notes"])


# TODO 3: Well-defined API contract for create note request
class CreateNoteRequest(BaseModel):
    """Schema for creating a new note."""

    content: str = Field(..., min_length=1, description="Note content (non-empty)")


@router.get("")
def list_all_notes() -> List[Dict[str, Any]]:
    """TODO 4: Endpoint to retrieve all notes."""
    rows = db.list_notes()
    return [
        {"id": r["id"], "content": r["content"], "created_at": r["created_at"]}
        for r in rows
    ]


@router.post("")
def create_note(request: CreateNoteRequest) -> Dict[str, Any]:
    """Create a new note. Uses Pydantic for validation (TODO 3)."""
    content = request.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="content is required")
    note_id = db.insert_note(content)
    note = db.get_note(note_id)
    if note is None:
        raise HTTPException(status_code=500, detail="Failed to create note")
    return {
        "id": note["id"],
        "content": note["content"],
        "created_at": note["created_at"],
    }


@router.get("/{note_id}")
def get_single_note(note_id: int) -> Dict[str, Any]:
    row = db.get_note(note_id)
    if row is None:
        raise HTTPException(status_code=404, detail="note not found")
    return {"id": row["id"], "content": row["content"], "created_at": row["created_at"]}


