# Proactive Intelligence

## 1. The Expiration Engine
*   **Continuous Monitoring:** The system constantly checks the current date against the `expiration_date` column in the database for all stored documents.
*   **Severity Thresholds:** Expirations are bucketed into urgency levels:
    *   🔴 **Critical:** Expires in < 14 days (or already expired).
    *   🟠 **Warning:** Expires in 15 - 60 days.
    *   🟢 **Healthy:** Expires in > 60 days.

## 2. Alerts & Dashboard Widgets
*   **Attention Center:** The top of the dashboard features a dedicated "Action Required" section that surfaces the most urgent documents immediately upon logging in.
*   **Toast Notifications:** When a user opens the app, a sleek toast notification summarizes actionable items (e.g., "You have 2 documents expiring this month").
*   **Visual Indicators:** Documents in the grid/list view have colored badges or glowing borders corresponding to their expiration severity (Red/Orange).

## 3. Action Recommendations (Future/Stretch Goal)
*   **Contextual Actions:** Instead of just saying "Passport Expiring", the UI can offer a button to "Mark as Renewed" which archives the old document and prompts for the upload of the new one.
*   **Actionable Summaries:** For contracts, the AI might highlight "Notice period is 30 days before termination," helping the user act before a contract auto-renews.

## 4. Personal Insights
*   **Document Health Score:** A gamified "health score" showing what percentage of the user's documents are up-to-date versus expired.
*   **Spending Summaries:** If the user uploads many receipts, the dashboard could optionally display a mini-chart aggregating the `Total Amount` extracted over the current month.
