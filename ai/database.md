# Digital Filing Assistant - Database Schema

The database is implemented in **SQLite** via SQLAlchemy. Below is the primary schema design for storing the document metadata.

## Table: `documents`

This table acts as the central repository for all processed files.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier for the document record. |
| `filename` | String | NOT NULL | The original name of the uploaded file (e.g., `invoice_2023.pdf`). |
| `filepath` | String | NOT NULL | The relative path to the locally stored file (e.g., `uploads/uuid_invoice_2023.pdf`). |
| `file_type` | String | NOT NULL | Mime type or extension (e.g., `application/pdf`, `image/png`). |
| `category` | String | INDEXED | The AI-determined category (e.g., `Passport`, `Invoice`, `Certificate`). |
| `issue_date` | Date | | The extracted date the document was issued (if applicable). |
| `expiration_date` | Date | INDEXED | The extracted date the document expires (if applicable). Used heavily for alerts. |
| `extracted_data` | JSON / Text | | A flexible JSON string containing all other specific details extracted by the AI (e.g., `{"amount": 500, "name": "John Doe", "contract_number": "12345"}`). |
| `is_archived` | Boolean | DEFAULT FALSE | Allows users to "archive" expired or replaced documents without permanently deleting them. |
| `created_at` | DateTime | DEFAULT CURRENT_TIMESTAMP | When the document was uploaded and processed. |
| `updated_at` | DateTime | DEFAULT CURRENT_TIMESTAMP | When the document metadata was last manually edited. |

## Schema Design Rationale
*   **`extracted_data` (JSON):** Different document types have vastly different fields (a passport has a nationality, a receipt has a total amount). Storing the bulk of the extracted details in a single JSON column allows for maximum flexibility without needing a complex schema with dozens of nullable columns or secondary tables.
*   **Indexes:** Indexes on `category` and `expiration_date` are crucial to ensure that the dashboard filters and the "Expiration Engine" remain lightning fast, even if the user uploads thousands of documents over years of usage.
