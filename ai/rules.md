# Digital Filing Assistant - Rules & Guidelines

## 1. Technology Stack
*   **Frontend:** React JS (initialized via Vite for performance).
*   **Backend:** Python FastAPI.
*   **Database:** SQLite (local file-based relational database).
*   **AI Integration:** Online API (e.g., Google Gemini Free Tier) for processing document text/images.

## 2. Architectural & Security Rules
*   **Local First Storage:** All original files (PDFs, images) MUST be saved locally on the user's machine (e.g., in a `backend/uploads` directory).
*   **Stateless AI:** The AI API is only used for inference. Files/text are sent for extraction, and the resulting JSON is stored locally in SQLite. 
*   **Separation of Concerns:** The frontend handles presentation and state; the backend handles file IO, DB operations, and AI API communication.

## 3. UI/UX & Styling Rules
*   **Strict Aesthetics Policy:** The design MUST feel premium and state-of-the-art. Avoid simple, generic MVP designs.
*   **Styling:** Use Vanilla CSS (unless Tailwind is explicitly requested). 
*   **Visual Elements:** 
    *   Use curated, harmonious color palettes (e.g., sleek dark mode, vibrant accents).
    *   Incorporate smooth gradients and glassmorphism where appropriate.
    *   Implement micro-animations (hover effects, loading states, transition animations) to make the app feel alive and dynamic.
    *   Use modern typography (e.g., Inter, Roboto, Outfit).
*   **No Placeholders:** If an image or specific asset is needed, generate a real working demonstration asset.

## 4. Development Workflow
*   Keep components focused and reusable.
*   Ensure all interactive elements have proper hover states and unique IDs.
*   Log errors properly on the backend to avoid silent failures during AI processing.
