# Core Document Management

## 1. Secure Local Storage Architecture
*   **Local-First Philosophy:** All uploaded files (PDFs, images) are stored directly on the host machine's file system (e.g., within a `./backend/uploads` directory). They are never permanently stored in the cloud.
*   **File Naming Convention:** To prevent collisions, uploaded files are renamed using a UUID suffix or prefix while retaining the original extension (e.g., `passport_123e4567-e89b.pdf`).
*   **Integrity & Security:** Files are referenced in the SQLite database via relative paths. If the database is moved, the files move with it, ensuring portability.

## 2. Advanced Upload Mechanisms
*   **Drag-and-Drop Interface:** A dedicated "drop zone" in the UI allowing users to drag multiple files at once from their desktop.
*   **Multi-Format & Batch Support:** Accepts PDFs, PNGs, JPEGs, and potentially WebP. Users can upload 10+ documents simultaneously.
*   **Upload Progress:** Real-time progress bars for file transfer to the local server, ensuring the user knows large PDFs are being handled.

## 3. Document Dashboard & Browsing
*   **Grid and List Views:** Users can toggle between a visual grid (showing document thumbnails/icons) and a dense data list (showing metadata columns).
*   **In-App Document Previewer:** Users can click a document to open a modal or split pane to view the PDF or image directly inside the app, without downloading it. Zoom and pan controls are included.

## 4. Search, Filtering, and Sorting
*   **Faceted Search:** A powerful search bar that searches not just the filename, but the *contents* of the AI-extracted JSON metadata. (e.g., searching "Apple" finds the receipt where Apple is the merchant).
*   **Dynamic Filtering:** Filter documents by `Category` (e.g., "Show only Passports"), `Status` (e.g., "Expiring Soon"), or `Date Range`.
*   **Sorting:** Sort by upload date, issue date, or expiration date (ascending/descending).
