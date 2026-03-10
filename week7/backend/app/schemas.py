from datetime import datetime
from pydantic import BaseModel, Field

class NoteCreate(BaseModel):
    title: str = Field(..., min_length=3)
    content: str = Field(..., min_length=1)

class NoteRead(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class NotePatch(BaseModel):
    title: str | None = Field(default=None, min_length=3)
    content: str | None = Field(default=None, min_length=1)

class ActionItemCreate(BaseModel):
    description: str
    assignee: str | None = None

class ActionItemRead(BaseModel):
    id: int
    description: str
    completed: bool
    assignee: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ActionItemPatch(BaseModel):
    description: str | None = None
    completed: bool | None = None
    assignee: str | None = None