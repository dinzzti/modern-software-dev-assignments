def test_create_list_and_patch_notes(client):
    payload = {"title": "Test", "content": "Hello world"}
    r = client.post("/notes/", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["title"] == "Test"
    assert "created_at" in data and "updated_at" in data

    r = client.get("/notes/")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    r = client.get("/notes/", params={"q": "Hello", "limit": 10, "sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    note_id = data["id"]
    r = client.patch(f"/notes/{note_id}", json={"title": "Updated"})
    assert r.status_code == 200
    patched = r.json()
    assert patched["title"] == "Updated"

def test_get_notes_pagination_and_sorting(client):
    # Buat 5 catatan dummy untuk dites
    for i in range(5):
        client.post("/notes/", json={"title": f"Note {i}", "content": "Test content"})
    
    # Tes Pagination: Limit (Ambil 2 data saja)
    response_limit = client.get("/notes/?limit=2")
    assert response_limit.status_code == 200
    data_limit = response_limit.json()
    assert len(data_limit) == 2
    
    # Tes Pagination: Skip (Lewati 2 data pertama, ambil 2 data setelahnya)
    response_skip = client.get("/notes/?skip=2&limit=2")
    assert response_skip.status_code == 200
    data_skip = response_skip.json()
    assert len(data_skip) == 2
    
    # Tes Sorting: Pastikan ID berbeda (data sudah terurut/ter-skip dengan benar)
    assert data_limit[0]["id"] != data_skip[0]["id"]