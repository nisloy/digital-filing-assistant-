# Project Structure

This outlines the target directory structure for the monorepo containing both frontend and backend.

```text
digital_filing_system/
├── ai/                     # Documentation and architecture rules
├── frontend/               # React (Vite) Application
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Buttons, Cards, Modals)
│   │   ├── pages/          # Full page views (Dashboard, Upload, Settings)
│   │   ├── services/       # API communication logic (axios/fetch wrappers)
│   │   ├── styles/         # Vanilla CSS (index.css, theme variables)
│   │   └── utils/          # Helper functions (date formatting, etc.)
│   ├── package.json
│   └── vite.config.js
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── main.py         # FastAPI entry point
│   │   ├── api/            # Route handlers (endpoints)
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # AI logic and file processing
│   │   └── core/           # Config, DB connection
│   ├── uploads/            # Local directory for stored files (Gitignored)
│   ├── database.db         # SQLite file (Gitignored)
│   └── requirements.txt    # Python dependencies
└── README.md
```
