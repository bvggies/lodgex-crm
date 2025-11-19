
# Lodgex CRM

Lodgex is a comprehensive Property Management CRM designed for efficiency and scalability. It features booking management, maintenance tracking, financial reporting, and AI-powered insights using Google Gemini.

## Features

- **Dashboard**: Real-time overview of occupancy, revenue, and tasks.
- **Bookings**: Timeline (Gantt) view, drag-and-drop scheduling, and conflict detection.
- **Properties**: detailed property profiles, document management, and unit tracking.
- **Operations**: Kanban boards for Cleaning and Maintenance tasks.
- **Finance**: Revenue/expense tracking with monthly P&L reports.
- **AI Integration**: Automated guest emails and business insights via Gemini API.
- **RBAC**: Role-Based Access Control for Admins, Managers, Cleaners, and Owners.
- **Database**: Persisted data using Neon PostgreSQL.

## Tech Stack

- **Frontend**: React 19 (CRA), TypeScript, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express.
- **Database**: Neon Postgres.
- **AI**: Google Gemini API via `@google/genai`.

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/lodgex-crm.git
    cd lodgex-crm
    ```

2.  **Install Dependencies**:
    
    Frontend:
    ```bash
    npm install
    ```

    Backend:
    ```bash
    cd server
    npm install
    cd ..
    ```

3.  **Database Setup (Neon)**:
    - Create a project at [neon.tech](https://neon.tech).
    - Copy the **Connection String**.
    - Run the SQL from `db/schema.sql` in the Neon SQL Editor to create tables.

4.  **Configure Environment**:
    - Create `server/.env` and add your `DATABASE_URL`.
    - (Optional) Create `.env` in root for frontend API keys if needed.

5.  **Run the App**:
    
    Start Backend (Terminal 1):
    ```bash
    cd server
    node index.js
    ```

    Start Frontend (Terminal 2):
    ```bash
    npm start
    ```

## Deployment

1.  Deploy the **Server** to a service like Render, Railway, or Heroku.
2.  Deploy the **Frontend** to Vercel.
3.  Update `src/services/apiService.ts` or use environment variables to point the frontend to your production backend URL.

## Project Structure

- `src/components`: UI Components (Dashboard, Kanban, Forms).
- `src/services`: Abstractions for external APIs (Storage, Integrations, AI).
- `src/DataContext.tsx`: Global state management.
- `server/`: Node.js Express backend.
- `db/`: Database schema files.

## Testing

Run the test suite with:
```bash
npm test
```
