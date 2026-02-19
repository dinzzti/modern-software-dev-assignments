import os
import pytest

from ..app.services.extract import extract_action_items, extract_action_items_llm


def test_extract_bullets_and_checkboxes():
    text = """
    Notes from meeting:
    - [ ] Set up database
    * implement API extract endpoint
    1. Write tests
    Some narrative sentence.
    """.strip()

    items = extract_action_items(text)
    assert "Set up database" in items
    assert "implement API extract endpoint" in items
    assert "Write tests" in items

def test_extract_action_items_standard():
    text = "- [ ] Task 1\n* Task 2"
    items = extract_action_items(text)
    assert "Task 1" in items
    assert "Task 2" in items

def test_extract_action_items_llm():
    # Catatan: Ini butuh Ollama berjalan di background
    text = "Please remind me to call Sheila tomorrow."
    items = extract_action_items_llm(text)
    assert isinstance(items, list)


def test_extract_action_items_llm_empty_input():
    """TODO 2: Test LLM extraction with empty input - returns [] without calling Ollama."""
    assert extract_action_items_llm("") == []
    assert extract_action_items_llm("   ") == []
    assert extract_action_items_llm("\n\t") == []


def test_extract_action_items_llm_bullet_list():
    """TODO 2: Test LLM extraction with bullet list input. Requires Ollama running."""
    text = """
    Meeting notes:
    - Set up database
    * implement API extract endpoint
    1. Write tests
    """
    items = extract_action_items_llm(text.strip())
    assert isinstance(items, list)
   


def test_extract_action_items_llm_keyword_prefixed():
    """TODO 2: Test LLM extraction with keyword-prefixed lines. Requires Ollama running."""
    text = "todo: call the client\naction: send report\nnext: review PR"
    items = extract_action_items_llm(text)
    assert isinstance(items, list)