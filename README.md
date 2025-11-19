
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

## Tech Stack

- **Frontend**: React 19 (CRA), TypeScript, Tailwind CSS, Framer Motion, Recharts.
- **Backend (Simulated)**: Logic contained in React Context (`DataContext`) for this demo, ready for migration to Node/Express.
- **Database (Simulated)**: In-memory mock data with architecture ready for Neon Postgres.
- **AI**: Google Gemini API via `@google/genai`.

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/lodgex-crm.git
    cd lodgex-crm
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Copy `.env.example` to `.env` and add your API keys.
    ```bash
    cp .env.example .env
    ```
    *Note: You must add a valid `API_KEY` for Google Gemini features to work.*

4.  **Run Locally**:
    ```bash
    npm start
    ```
    The app will launch at `http://localhost:3000`.

## Deployment

This project is optimized for deployment on Vercel.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the Environment Variables (specifically `API_KEY`) in the Vercel dashboard.
4.  Deploy.

## Project Structure

- `src/components`: UI Components (Dashboard, Kanban, Forms).
- `src/services`: Abstractions for external APIs (Storage, Integrations, AI).
- `src/DataContext.tsx`: Global state management and business logic.
- `src/types.ts`: TypeScript interfaces and Enums.

## Testing

Run the test suite with:
```bash
npm test
```
