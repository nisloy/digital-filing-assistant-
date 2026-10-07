# Implementation Plan

To build the Digital Filing Assistant in an organized, stable way, we must build it piece by piece. Below is the chunked breakdown of the system. We will complete one phase, test it, and only then move to the next.

## Phase 1: Backend Foundation
**Goal:** Setup the core server and database.
*   Initialize FastAPI project.
*   Setup SQLite database connection (SQLAlchemy).
*   Create the `Document` database model (based on `database.db`).
*   Create Pydantic schemas for data validation.

## Phase 2: File Storage API
**Goal:** Allow the backend to receive and store files.
*   Create local `uploads/` directory with `.gitignore`.
*   Implement `POST /api/documents/upload` to receive a file, assign a UUID, and save it to disk.
*   Implement `GET /api/documents/{id}/file` to serve the file back.

## Phase 3: AI Integration ("The Brain")
**Goal:** Connect the backend to Gemini for document analysis.
*   Integrate the Google Generative AI SDK in Python.
*   Implement the AI Service layer using the prompt defined in `ai_prompts.md`.
*   Link the upload endpoint to the AI service: so a file is uploaded, passed to Gemini, and the resulting JSON is saved to the SQLite database.

## Phase 4: Frontend Foundation & Design System
**Goal:** Setup the React app and visual aesthetics.
*   Initialize React (Vite).
*   Setup vanilla CSS global styles, CSS variables (dark mode, glassmorphism, accent colors).
*   Create the core layout (Sidebar/Navigation, Main Content Area).

## Phase 5: The Document Dashboard
**Goal:** Display the processed documents.
*   Implement `GET /api/documents` on the backend.
*   Create the React `Dashboard` component.
*   Build the Document Grid/List view to display fetched documents.
*   Implement basic client-side filtering and sorting.

## Phase 6: Frontend Upload Experience
**Goal:** Provide a sleek way for users to upload files.
*   Create the Drag-and-Drop upload zone in React.
*   Implement real-time visual feedback (Processing..., Success, Failed).
*   Handle the API upload request and refresh the dashboard upon success.

## Phase 7: Proactive Intelligence (Alerts)
**Goal:** Build the expiration engine.
*   Implement the logic to highlight documents expiring in <14 days or <60 days.
*   Create the "Action Required" section in the UI.
*   Add toast notifications for expirations on app load.
