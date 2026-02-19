from __future__ import annotations

import os
import re
import json
from typing import List
from ollama import chat
from dotenv import load_dotenv

load_dotenv()


BULLET_PREFIX_PATTERN = re.compile(r"^\s*([-*•]|\d+\.)\s+")
KEYWORD_PREFIXES = ("todo:", "action:", "next:")

def _is_action_line(line: str) -> bool:
    stripped = line.strip().lower()
    if not stripped: return False
    if BULLET_PREFIX_PATTERN.match(stripped): return True
    if any(stripped.startswith(prefix) for prefix in KEYWORD_PREFIXES): return True
    if "[ ]" in stripped or "[todo]" in stripped: return True
    return False

def extract_action_items(text: str) -> List[str]:
    lines = text.splitlines()
    extracted: List[str] = []
    for raw_line in lines:
        line = raw_line.strip()
        if not line: continue
        if _is_action_line(line):
            cleaned = BULLET_PREFIX_PATTERN.sub("", line)
            cleaned = cleaned.strip().removeprefix("[ ]").strip().removeprefix("[todo]").strip()
            extracted.append(cleaned)
    if not extracted:
        sentences = re.split(r"(?<=[.!?])\s+", text.strip())
        for sentence in sentences:
            s = sentence.strip()
            if s and _looks_imperative(s):
                extracted.append(s)
    seen: set[str] = set()
    unique: List[str] = []
    for item in extracted:
        lowered = item.lower()
        if lowered not in seen:
            seen.add(lowered)
            unique.append(item)
    return unique

def _looks_imperative(sentence: str) -> bool:
    words = re.findall(r"[A-Za-z']+", sentence)
    if not words: return False
    first = words[0]
    imperative_starters = {"add", "create", "implement", "fix", "update", "write", "check", "verify", "refactor", "document", "design", "investigate", "buy", "call", "schedule", "remind"}
    return first.lower() in imperative_starters


def extract_action_items_llm(text: str) -> List[str]:
    """
    Versi ini memaksa AI mengubah teks narasi (cerita) menjadi poin tugas.
    """
    if not text or not text.strip():
        return []

    print(f"\n[DEBUG] Mengirim request ke Ollama...") 

    try:
        
        response = chat(
            model="llama3.1:8b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert personal assistant. "
                        "Your goal is to convert the user's notes (even narrative stories) into a JSON list of actionable tasks. "
                        "Example: Input 'I need to run', Output 'Go for a run'. "
                        "Return ONLY a JSON object with a key 'items'. "
                        "Example: {\"items\": [\"Task 1\", \"Task 2\"]}"
                    )
                },
                {"role": "user", "content": text},
            ],
            format="json", 
        )

        content = response.message.content
        
        
        print(f"[DEBUG] Respon Mentah AI: {repr(content)}") 

        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            clean = content.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean)

       
        if isinstance(data, list):
            return [str(item) for item in data]
        
        
        if isinstance(data, dict):
            
            for key in ["items", "action_items", "tasks", "todos", "actions", "list"]:
                if key in data and isinstance(data[key], list):
                    return [str(item) for item in data[key]]

            
            for key, value in data.items():
                if isinstance(value, list):
                    return [str(item) for item in value]

        print("[DEBUG] JSON valid tapi tidak ada list tugas.")
        return []

    except Exception as e:
        print(f"[ERROR] Gagal memproses AI: {e}")
        return []