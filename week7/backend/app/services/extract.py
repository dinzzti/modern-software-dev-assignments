import re
from dataclasses import dataclass


@dataclass
class ActionItem:
    description: str
    assignee: str | None = None


# Pattern: "Name: task description" where Name is a capitalized word
_ASSIGNEE_RE = re.compile(r"^([A-Z][a-zA-Z]+):\s+(.+)$")


def _parse_assignee(text: str) -> tuple[str | None, str]:
    """Extract an optional assignee prefix from a line.

    Returns (assignee, remaining_text).  If no assignee pattern is found,
    assignee is None and the full text is returned unchanged.
    """
    m = _ASSIGNEE_RE.match(text)
    if m:
        candidate = m.group(1)
        # Avoid matching known prefixes like TODO / ACTION as assignees
        if candidate.upper() not in {"TODO", "ACTION"}:
            return candidate, m.group(2)
    return None, text


def extract_action_items(text: str) -> list[str]:
    """Legacy helper – returns plain description strings."""
    return [item.description for item in extract_action_items_with_assignee(text)]


def extract_action_items_with_assignee(text: str) -> list[ActionItem]:
    """Extract action items with optional assignee from text.

    Recognises:
    - Lines starting with ``TODO:`` or ``ACTION:``
    - Lines ending with ``!``
    - Lines with an assignee prefix like ``Dina: finish the report``
    """
    lines = [line.strip("- ") for line in text.splitlines() if line.strip()]
    results: list[ActionItem] = []
    for line in lines:
        assignee, description = _parse_assignee(line)
        normalized = description.lower()
        is_action = (
            normalized.startswith("todo:")
            or normalized.startswith("action:")
            or description.endswith("!")
        )
        # A line with an explicit assignee is always treated as an action item
        if is_action or assignee is not None:
            results.append(ActionItem(description=description, assignee=assignee))
    return results


