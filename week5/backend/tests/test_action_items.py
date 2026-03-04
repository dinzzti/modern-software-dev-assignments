def test_create_and_complete_action_item(client):
    payload = {"description": "Ship it"}
    r = client.post("/action-items/", json=payload)
    assert r.status_code == 201, r.text
    item = r.json()
    assert item["completed"] is False

    r = client.put(f"/action-items/{item['id']}/complete")
    assert r.status_code == 200
    done = r.json()
    assert done["completed"] is True

    r = client.get("/action-items/")
    assert r.status_code == 200
    body = r.json()
    assert "items" in body
    assert "total" in body
    assert body["total"] == 1
    assert len(body["items"]) == 1


def test_action_items_pagination_boundaries(client):
    # Seed 3 items
    for i in range(3):
        client.post("/action-items/", json={"description": f"Task {i}"})

    # page_size=2 → first page has 2 items, second page has 1
    r = client.get("/action-items/", params={"page": 1, "page_size": 2})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 2

    r = client.get("/action-items/", params={"page": 2, "page_size": 2})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 1

    # Empty last page
    r = client.get("/action-items/", params={"page": 3, "page_size": 2})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 0

    # Too-large page_size returns all items
    r = client.get("/action-items/", params={"page": 1, "page_size": 100})
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 3


def test_complete_item_not_found(client):
    """PUT /action-items/{id}/complete returns 404 when item does not exist."""
    r = client.put("/action-items/9999/complete")
    assert r.status_code == 404


def test_create_item_empty_description_returns_422(client):
    """POST /action-items/ returns 422 when description is empty string."""
    r = client.post("/action-items/", json={"description": ""})
    assert r.status_code == 422


def test_create_item_missing_fields_returns_422(client):
    """POST /action-items/ returns 422 when required fields are missing."""
    r = client.post("/action-items/", json={})
    assert r.status_code == 422
