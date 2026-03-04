def test_create_and_list_notes(client):
    payload = {"title": "Test", "content": "Hello world"}
    r = client.post("/notes/", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["title"] == "Test"

    r = client.get("/notes/")
    assert r.status_code == 200
    body = r.json()
    assert "items" in body
    assert "total" in body
    assert body["total"] >= 1
    assert len(body["items"]) >= 1

    r = client.get("/notes/search/")
    assert r.status_code == 200

    r = client.get("/notes/search/", params={"q": "Hello"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1


def test_notes_pagination_boundaries(client):
    # Seed 3 notes
    for i in range(3):
        client.post("/notes/", json={"title": f"N{i}", "content": f"body {i}"})

    # page_size=2 → first page has 2 items, second page has 1
    r = client.get("/notes/", params={"page": 1, "page_size": 2})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 2

    r = client.get("/notes/", params={"page": 2, "page_size": 2})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 1

    # Empty last page
    r = client.get("/notes/", params={"page": 3, "page_size": 2})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 0

    # Too-large page_size returns all items
    r = client.get("/notes/", params={"page": 1, "page_size": 100})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 3


def test_get_note_not_found(client):
    """GET /notes/{id} returns 404 when note does not exist."""
    r = client.get("/notes/9999")
    assert r.status_code == 404


def test_create_note_empty_title_returns_422(client):
    """POST /notes/ returns 422 when title is empty string."""
    r = client.post("/notes/", json={"title": "", "content": "some content"})
    assert r.status_code == 422


def test_create_note_empty_content_returns_422(client):
    """POST /notes/ returns 422 when content is empty string."""
    r = client.post("/notes/", json={"title": "Valid Title", "content": ""})
    assert r.status_code == 422


def test_create_note_missing_fields_returns_422(client):
    """POST /notes/ returns 422 when required fields are missing."""
    r = client.post("/notes/", json={})
    assert r.status_code == 422
