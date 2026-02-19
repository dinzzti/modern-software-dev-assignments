# AI-Powered Action Item Extractor — Pink Edition

## Project Overview

This is an **AI-powered Action Item Extractor** that converts free-form notes into structured, actionable task lists. Built with FastAPI and SQLite, the application has been updated to the **Pink Edition** with a modern, polished UI that provides an intuitive user experience. Users can paste meeting notes, informal narratives, or bullet-point lists and receive clean, enumerated action items in return.

---

## Features

### Standard Extraction (Regex-based)
The heuristic extraction engine uses predefined patterns to identify action items:
- **Bullet formats**: `-`, `*`, `•`, numbered lists (`1.`, `2.`, etc.)
- **Keyword prefixes**: `todo:`, `action:`, `next:`
- **Checkbox notation**: `[ ]`, `[todo]`
- **Imperative fallback**: Sentences starting with verbs like *add*, *create*, *implement*, *fix*, *update*, etc.

### LLM Extraction (Ollama / Llama 3)
As required in **TODO 1** and **TODO 4**, the application includes an LLM-powered extraction mode that leverages **Ollama** with the **Llama 3.1** model. This mode:
- Understands narrative text and conversational notes
- Converts unstructured content into actionable tasks via natural language understanding
- Returns structured JSON output for reliable parsing

### List History (List Notes)
Users can view all previously saved notes via the **List Notes** button. This feature fetches and displays the full history of stored notes, including their content and timestamps, providing quick access to past extractions.

### UI Updates (Pink Edition)
The interface has been modernized with:
- A cohesive pink color palette with gradients and soft accents
- Custom styling for inputs, buttons, and cards with rounded corners and subtle shadows
- Loading indicators and smooth animations during extraction
- Responsive layout and improved typography (Poppins font)
- Clear visual hierarchy between Standard Extraction, LLM Extraction, and List Notes actions

---

## Setup & Installation

### Prerequisites
- **Python** 3.10 or higher
- **Poetry** (package and environment manager)
- **Ollama** (for LLM extraction) — [Download](https://ollama.com)

### Install Dependencies

From the project root:

```bash
poetry install
```

This creates a virtual environment and installs all dependencies, including FastAPI, Ollama client, SQLite tooling, and dev tools (pytest, black, ruff).

### Python Version

The project requires Python `>=3.10,<4.0`. To use a specific Python version with Poetry:

```bash
# Check available Python versions
poetry env info

# Use a specific Python (e.g., 3.11) if installed
poetry env use python3.11

# Or point to a full path
poetry env use /path/to/python3.11
```

Then run `poetry install` again if the environment changes.

### Ollama Setup (for LLM Extraction)

Ensure Ollama is installed and running, then pull the model:

```bash
ollama pull llama3.1:8b
```

---

## How to Run

Start the development server:

```bash
poetry run fastapi dev week2/app/main.py
```

Or using uvicorn directly:

```bash
poetry run uvicorn week2.app.main:app --reload
```

Open a browser and navigate to **http://127.0.0.1:8000/**.

---

## Testing

Unit tests for the extraction logic (including the LLM extractor as per **TODO 2**) are located in `week2/tests/test_extract.py`. Run the full test suite:

```bash
poetry run pytest week2/tests/ -v
```

To run only the extract tests:

```bash
poetry run pytest week2/tests/test_extract.py -v
```

**Note:** Tests for `extract_action_items_llm()` require Ollama to be running with the `llama3.1:8b` model. Tests for empty input run without Ollama.

---

## API Endpoints

The API has been refactored with well-defined schemas (**TODO 3**) and structured routes:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serves the main HTML page |
| `POST` | `/action-items/extract` | Standard (regex) extraction |
| `POST` | `/action-items/extract-llm` | LLM-powered extraction (Ollama/Llama 3) |
| `GET` | `/action-items` | List all action items (optional: `?note_id=`) |
| `POST` | `/action-items/{id}/done` | Mark an action item as done or undone |
| `GET` | `/notes` | List all saved notes |
| `POST` | `/notes` | Create a new note |
| `GET` | `/notes/{note_id}` | Get a single note by ID |

### Example: Extract with LLM

```bash
curl -X POST http://127.0.0.1:8000/action-items/extract-llm \
  -H "Content-Type: application/json" \
  -d '{"text": "I need to finish the report by Friday and schedule a call with the team.", "save_note": true}'
```

### Example: List Notes

```bash
curl http://127.0.0.1:8000/notes
```

---

## Project Structure

```
week2/
├── app/
│   ├── main.py           # FastAPI application entry point
│   ├── db.py             # SQLite database layer
│   ├── routers/
│   │   ├── action_items.py   # /action-items endpoints
│   │   └── notes.py          # /notes endpoints
│   └── services/
│       └── extract.py    # Standard + LLM extraction logic
├── frontend/
│   └── index.html        # Pink Edition UI
├── tests/
│   └── test_extract.py   # Unit tests (TODO 2)
├── assignment.md
├── writeup.md
└── README.md
```

---

## License & Credits

Part of the Modern Software Development course. Built with FastAPI, SQLite, and Ollama.
