# Apartment Rental Dashboard — 183 rue du Rouet, Marseille

## Project Overview
A full-stack apartment rental application dashboard. Tenants submit a "Dossier de location" on the public page; the landlord reviews applications on a protected admin dashboard.

---

## Architecture

```
Site location/
├── frontend/          # React + Vite + TypeScript + Tailwind + Shadcn UI
├── backend/           # Node.js + Express.js + Multer + Supabase + PDFKit
└── CLAUDE.md
```

---

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI     |
| Routing    | React Router v6                                         |
| HTTP       | Axios                                                   |
| i18n       | react-i18next (EN / FR toggle)                          |
| Backend    | Node.js, Express.js                                     |
| File upload| Multer (memory storage → Supabase Storage)              |
| Database   | Supabase (PostgreSQL)                                   |
| File store | Supabase Storage                                        |
| PDF gen    | PDFKit                                                  |

---

## Terminal Commands

### 1. Backend Setup
```bash
cd backend
npm init -y
npm install express cors multer dotenv @supabase/supabase-js pdfkit uuid
npm install -D typescript ts-node @types/express @types/multer @types/node @types/cors @types/uuid nodemon
npx tsc --init
```
DONE

### 2. Frontend Setup
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom axios react-i18next i18next
# Shadcn UI init (run after tailwind config)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card badge dialog table
```

---

## Supabase Database Schema

Run this SQL in your Supabase project's SQL Editor:

```sql
-- Applications table
CREATE TABLE applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  income      NUMERIC(10,2) NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Pending',   -- Pending | Approved | Rejected

  -- File URLs stored in Supabase Storage
  id_card_url          TEXT,
  employment_contract_url TEXT,
  payslip1_url         TEXT,
  payslip2_url         TEXT,
  payslip3_url         TEXT,
  tax_return_url       TEXT,
  lease_pdf_url        TEXT
);

-- Enable Row Level Security (but allow all for now — tighten for production)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON applications FOR ALL USING (true);
```

### Supabase Storage Buckets
Create two buckets in Supabase Storage UI (or via SQL):
- `rental-documents`  (private)
- `lease-agreements`  (private)

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('rental-documents', 'rental-documents', false),
  ('lease-agreements', 'lease-agreements', false);
```

---

## Environment Variables

### backend/.env
```
PORT=4000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
```

### frontend/.env
```
VITE_API_URL=http://localhost:4000
```

---

## API Endpoints

| Method | Path                         | Description                          |
|--------|------------------------------|--------------------------------------|
| POST   | /api/applications            | Submit rental application (multipart)|
| GET    | /api/applications            | Fetch all applications (admin)       |
| PATCH  | /api/applications/:id/approve| Approve + generate lease PDF         |

---

## Protected Admin Route
- Path: `/admin`
- Hardcoded password: `landlord2024` (stored in frontend env or hardcoded for scope)
- Auth state kept in `localStorage` via `AuthContext`

---

## Key Files

### Backend
- `backend/src/index.ts` — Express entry point
- `backend/src/routes/applications.ts` — All API routes
- `backend/src/lib/supabase.ts` — Supabase client (service role)
- `backend/src/lib/pdfGenerator.ts` — PDFKit lease generator

### Frontend
- `frontend/src/main.tsx` — App entry, i18n init, Router
- `frontend/src/App.tsx` — Route definitions
- `frontend/src/context/AuthContext.tsx` — Admin auth context
- `frontend/src/i18n/` — EN/FR translation files
- `frontend/src/pages/LandingPage.tsx` — Public page with rental form
- `frontend/src/pages/AdminDashboard.tsx` — Protected dashboard
- `frontend/src/pages/LoginPage.tsx` — Admin login
- `frontend/src/components/ApplicationForm.tsx` — Multipart form
- `frontend/src/components/ApplicationsTable.tsx` — Admin table

---

## Running the Project

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173
Backend:  http://localhost:4000
