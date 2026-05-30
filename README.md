# Centre Expense Tracker

A modern SaaS-style expense management dashboard built for preschool and daycare centres. This project demonstrates full-stack development skills with a focus on UI polish, clean CRUD architecture, and seamless database integration.

## Features
- **Dashboard Analytics**: Visual representation of expenses using Pie, Bar, and Line charts.
- **Expense Management**: Complete CRUD functionality to add, edit, delete, and view expenses.
- **Receipt Uploads**: Direct file uploads (Images & PDFs) via Supabase Storage.
- **Filtering & Search**: Easily find expenses using text search, category filters, and date ranges.
- **Modern UI**: Fully responsive sidebar layout with smooth micro-interactions built with Tailwind CSS.

## Screenshots
*(Add screenshots of your Dashboard, Add Expense Form, and Expenses Table here)*

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS (v4), Recharts
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database & Storage**: Supabase PostgreSQL, Supabase Storage
- **Deployment Strategy**: Vercel (Frontend), Render (Backend)

## Architecture
The project follows a standard decoupled Client-Server monorepo architecture:
- `client/`: Contains the React application.
- `server/`: Contains the Express.js API and Prisma schema.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Supabase Account

### 1. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Configure your `.env` file with your Supabase credentials:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://...pooler.supabase.com:5432/postgres"
   ```
4. Run Prisma migrations: `npx prisma migrate dev --name init`
5. Start the server: `npm run dev` (runs on http://localhost:5000)

### 2. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Configure your `.env` file:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```
4. Start the frontend: `npm run dev`

## Demo Credentials
Since this app uses a dummy authentication flow for demo purposes:
- **Email**: `admin@demo.com`
- **Password**: `password123`
*(Note: Authentication barriers are mocked in the frontend for ease of demonstration).*

## Live Demo Links
- **Frontend**: *(Add Vercel URL)*
- **Backend API**: *(Add Render URL)*
