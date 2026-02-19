# Week 2 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: **Dina** \
SUNet ID: **2310817120001** \
Citations: **Ollama Documentation, FastAPI Documentation, Cursor**

This assignment took me about **3** hours to do. 


## YOUR RESPONSES
For each exercise, please include what prompts you used to generate the answer, in addition to the location of the generated response. Make sure to clearly add comments in your code documenting which parts are generated.

### Exercise 1: Scaffold a New Feature
**Prompt Used**

You are a helpful assistant that extracts actionable tasks from meeting notes. Return ONLY a simple JSON array of strings. Do not include any explanation or prose. Example output: ["Buy milk", "Call the doctor"]"
User Input: "Extract action items from this text: {text}"


**Generated Code Snippets:**

- `week2/app/services/extract.py` (lines 56–122): Added function `extract_action_items_llm` to interface with Ollama (Llama 3.1 model) and parse structured JSON output.


### Exercise 2: Add Unit Tests
**Prompt Used**
"Create unit tests for extract_action_items_llm() covering multiple inputs: empty input, bullet list input, and keyword-prefixed lines (todo:, action:, next:) as required by the assignment. Verify the function returns a list in each case."

**Generated Code Snippets:**
- `week2/tests/test_extract.py`: Added `test_extract_action_items_llm()` (lines 27–31), `test_extract_action_items_llm_empty_input()` (lines 34–38), `test_extract_action_items_llm_bullet_list()` (lines 41–51), `test_extract_action_items_llm_keyword_prefixed()` (lines 54–57).

### Exercise 3: Refactor Existing Code for Clarity
**Prompt Used**
"Refactor the API endpoints to use Pydantic models for request bodies. Define ExtractRequest with text and save_note. Add CreateNoteRequest for notes with content validation. Improve error handling (400, 404, 500 where appropriate)."

**Generated/Modified Code Snippets:**
- `week2/app/routers/action_items.py`: Introduced `class ExtractRequest(BaseModel)` (lines 11–13) and updated both `/extract` and `/extract-llm` endpoints to use this schema.
- `week2/app/routers/notes.py`: Introduced `class CreateNoteRequest(BaseModel)` (lines 14–18), endpoint `GET ""` list_all_notes (lines 20–28), endpoint `POST ""` create_note with validation and error handling (lines 31–45), get_single_note with 404 when not found (lines 48–53).


### Exercise 4: Use Agentic Mode to Automate a Small Task
**Prompt Used:**
"Update the frontend to include an 'Extract LLM' button that calls the LLM extraction endpoint, and a loading spinner. Expose GET /notes to retrieve all notes and add a 'List Notes' button that fetches and displays them. Style the UI with CSS variables."

**Generated Code Snippets:**
- `week2/app/routers/action_items.py`: Added endpoint `POST /extract-llm` (lines 38–61).
- `week2/app/routers/notes.py`: Added endpoint `GET ""` list_all_notes (lines 20–28).
- `week2/frontend/index.html`: Buttons for Extract LLM and List Notes (lines 293–300), loading spinner, `listNotes()` and display of notes (lines 308–311, 375–405), styling and dynamic DOM.


### Exercise 5: Generate a README from the Codebase
**Prompt Used:**
"Analyze the codebase and generate a README.md with: brief overview of the project, how to set up and run (poetry install, poetry run fastapi dev or uvicorn), API endpoints and functionality, instructions for running the test suite (pytest)."

**Generated Code Snippets:**
- `week2/README.md`: Overview, Features (Standard Extraction, LLM Extraction, List Notes), Setup & Installation, How to Run, Testing, API Endpoints table, Project Structure.


## SUBMISSION INSTRUCTIONS
1. Hit a `Command (⌘) + F` (or `Ctrl + F`) to find any remaining `TODO`s in this file. If no results are found, congratulations – you've completed all required fields. 
2. Make sure you have all changes pushed to your remote repository for grading.
3. Submit via Gradescope. 