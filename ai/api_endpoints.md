# API Endpoints Contract

This document outlines the REST API contract between the React frontend and the FastAPI backend.

## 1. Documents API

### `POST /api/documents/upload`
Uploads a document, saves it locally, and triggers the AI extraction process.
*   **Request:** `multipart/form-data` with `file` (the document).
*   **Response (200 OK):**
    ```json
    {
      "id": "uuid",
      "filename": "passport.pdf",
      "status": "processing"
    }
    ```

### `GET /api/documents`
Retrieves a list of all documents, with optional filtering.
*   **Query Params:** `?category=Passport&sort=expiration_date_asc`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "uuid",
        "filename": "passport.pdf",
        "category": "Passport",
        "issue_date": "2015-01-01",
        "expiration_date": "2025-01-01",
        "extracted_data": { ... }
      }
    ]
    ```

### `GET /api/documents/{id}`
Retrieves details for a specific document.

### `GET /api/documents/{id}/file`
Serves the raw file (PDF/Image) for preview in the browser.

### `PATCH /api/documents/{id}`
Allows the user to manually override or correct AI-extracted metadata.
*   **Request Body:** JSON containing updated fields.

### `DELETE /api/documents/{id}`
Deletes the document from the database and removes the file from local storage.
