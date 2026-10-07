# AI-Powered Processing

## 1. Automatic Categorization & Taxonomy
The AI analyzes the raw content of the document and classifies it into a predefined taxonomy without human intervention. 
*   **Supported Categories:** 
    *   *Identity:* Passport, ID Card, Driver's License, Visa.
    *   *Financial:* Bank Statement, Tax Return, Invoice, Receipt.
    *   *Legal/Property:* Rental Agreement, Employment Contract, Insurance Policy.
    *   *Academic/Medical:* Degree Certificate, Medical Record.
    *   *Other:* Uncategorized (for documents the AI cannot confidently classify).

## 2. Type-Specific Intelligent Metadata Extraction
Instead of a generic text dump, the AI extracts structured JSON tailored to the document category:
*   **For Receipts/Invoices:** Extracts `Merchant Name`, `Total Amount`, `Tax Amount`, `Date of Purchase`.
*   **For Passports/IDs:** Extracts `Full Name`, `Document Number`, `Nationality`, `Issue Date`, `Expiration Date`.
*   **For Contracts:** Extracts `Parties Involved`, `Effective Date`, `Termination Date`, `Key Clauses` (summarized).

## 3. Date Recognition & Normalization
*   **Contextual Understanding:** The AI distinguishes between a "Date of Birth" and an "Expiration Date", ensuring only actionable dates trigger alerts.
*   **Standardization:** All extracted dates (e.g., "Oct 4th, 2025", "04/10/2025") are normalized into standard ISO format (`YYYY-MM-DD`) before saving to the SQLite database.

## 4. Error Handling, Fallbacks & Confidence Scores
*   **AI Confidence:** The AI can optionally return a confidence score. If the score is low, the document is flagged for "Manual Review" in the dashboard.
*   **Manual Overrides:** Users always have the final say. If the AI hallucinates a date or gets the category wrong, the user can easily edit the metadata via the UI.
*   **Asynchronous Processing:** If processing a 50-page PDF takes 10 seconds, the UI does not freeze. The document goes into a "Processing..." state, and the UI updates dynamically when the AI returns the data.
