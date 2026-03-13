# Week 7 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## Instructions

Fill out all of the `TODO`s in this file.

## Submission Details

Name: **Dina Izzati Elfadheya** \
SUNet ID: **dinzzti** *(Ganti dengan ID kampus/sistem yang sesuai jika diperlukan)* \
Citations: **Warp AI Agent, GitHub Copilot, Graphite Diamond AI**

This assignment took me about **3-4** hours to do. 


## Task 1: Add more endpoints and validations
a. Links to relevant commits/issues
> https://github.com/dinzzti/modern-software-dev-assignments/pull/1

b. PR Description
> Added input validation for `NoteCreate` and `NotePatch` using Pydantic `Field` (min_length constraints) and created a `DELETE /notes/{note_id}` endpoint. Testing: Ran pytest and all passed.

c. Graphite Diamond generated code review
> Graphite AI successfully ran and provided general feedback: The implementation of `from_attributes = True` is correct for Pydantic v2. The use of `HTTPException` with `status_code=404` in the `DELETE` endpoint is a good practice for handling missing resources. Adding `min_length` to `title` and `content` ensures data integrity at the API level.


## Task 2: Extend extraction logic
a. Links to relevant commits/issues
> https://github.com/dinzzti/modern-software-dev-assignments/pull/2 (task2-extraction branch)

b. PR Description
> Extended the extraction logic to identify assignees using the "Name: Task" regex pattern. Introduced an `ActionItem` dataclass and `extract_action_items_with_assignee` function while maintaining backward compatibility with the existing `extract_action_items` function.

c. Graphite Diamond generated code review
> Graphite AI found a critical bug during the review: "Backward compatibility is broken. The legacy `extract_action_items()` function now returns lines with assignee prefixes that the original implementation would have rejected." It provided a fix to filter the wrapper function to maintain the original behavior, which was immediately implemented.


## Task 3: Try adding a new model and relationships
a. Links to relevant commits/issues
> https://github.com/dinzzti/modern-software-dev-assignments/pull/3 (task3-models branch)

b. PR Description
> Added an `assignee` column (String, nullable) to the `ActionItem` SQLAlchemy model. Updated the corresponding Pydantic schemas (`ActionItemCreate`, `ActionItemRead`, `ActionItemPatch`) to include the new optional `assignee` field.

c. Graphite Diamond generated code review
> Graphite AI review ran and left 0 comments. This indicates that the database schema changes and Pydantic model updates were implemented securely and correctly without raising any structural or syntactical issues.


## Task 4: Improve tests for pagination and sorting
a. Links to relevant commits/issues
> https://github.com/dinzzti/modern-software-dev-assignments/pull/4 (task4-pagination branch)

b. PR Description
> Added pytest functions (`test_get_notes_pagination_and_sorting`) to verify the API's pagination capabilities (`limit` and `skip` parameters) and sorting functionality to ensure data integrity when querying lists.

c. Graphite Diamond generated code review
> Graphite AI review ran and left 0 comments, confirming that the test logic properly covers the required constraints and follows standard testing practices.


## Brief Reflection 
a. The types of comments you typically made in your manual reviews (e.g., correctness, performance, security, naming, test gaps, API shape, UX, docs).
> In my manual reviews, I mostly focused on correctness, ensuring the logic matched the requirements, and test gaps (making sure the code passes `pytest`). I also looked at basic API shape to ensure the schemas matched what the database expected.

b. A comparison of **your** comments vs. **Graphite’s** AI-generated comments for each PR.
> Graphite's comments were much more detail-oriented regarding edge cases and system-wide impacts compared to my initial manual checks. While I focused on "does the code run and pass tests?", Graphite analyzed "how will this affect existing systems?"

c. When the AI reviews were better/worse than yours (cite specific examples)
> **Better:** In Task 2, Graphite was significantly better. It caught a backward compatibility issue where the new extraction logic would break legacy callers by returning unexpected data formats. I missed this because the new test passed, but Graphite saw the broader context.
> **Worse:** In Tasks 3 and 4, Graphite simply left "0 comments". While reassuring, a human reviewer might have left suggestions on how to further optimize the database indexing or suggest more robust edge-case testing for the pagination logic, rather than just silently approving.

d. Your comfort level trusting AI reviews going forward and any heuristics for when to rely on them.
> I have a high comfort level trusting AI for catching structural bugs, syntax issues, and edge cases (like the Task 2 backward compatibility catch). However, my heuristic going forward is to use AI as a "safety net" rather than a full replacement. I will rely on AI to catch technical oversights, but I will still manually verify business logic and architectural decisions, especially when the AI simply returns "0 comments".