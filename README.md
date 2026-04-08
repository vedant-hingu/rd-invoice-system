# Simple Invoice System

A full-stack, modular invoice management web app built with:
- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Django + Django REST Framework
- **Database:** SQLite (local default, production DB can be swapped)

The application is designed with backend-driven business logic, reusable frontend components, and a clean UI focused on real-world usability.

## Highlights

- Create invoices with customer information (name, email, phone, address)
- Add/remove multiple line items dynamically in the UI
- Accurate **backend-driven calculations** for:
  - item subtotal
  - invoice subtotal
  - tax amount
  - final total
- Configurable tax rate (default `18.00%`)
- Invoice status support (`Pending` / `Paid`)
- Invoice list with sorting and filtering (by customer name and date)
- Invoice detail view with full breakdown
- Print-friendly invoice view (`window.print()` / Save as PDF)
- Responsive, modern UI with:
  - gradients and glassmorphism-style cards
  - smooth hover transitions and row interactions
  - subtle entrance animations
- Validation on both frontend and backend

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Django 5
- Django REST Framework
- django-cors-headers

## Project Structure

```text
.
├── backend
│   ├── config                # Django project settings and root urls
│   ├── invoices              # Core invoice app (models, serializers, views, routes)
│   ├── manage.py
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── app               # Next.js routes/pages
│   │   ├── components        # Reusable UI components
│   │   ├── lib               # API client
│   │   └── types             # Shared TypeScript types
│   └── .env.example
└── README.md
```

## Core Modules

### Backend (`backend/invoices`)
- `models.py`
  - `Customer`
  - `Invoice`
  - `InvoiceItem`
- `serializers.py`
  - nested payload validation
  - atomic invoice creation
  - secure server-side amount calculations
- `views.py`
  - DRF `GenericViewSet` with `create`, `list`, `retrieve`
- `urls.py`
  - REST router for invoice endpoints

### Frontend
- `src/components/InvoiceForm.tsx`
  - customer + item form
  - dynamic item rows
  - client-side validation UX
- `src/components/InvoiceTable.tsx`
  - list view
  - filtering and sorting
- `src/components/InvoiceDetailCard.tsx`
  - complete invoice breakdown
  - print/download button
- `src/lib/api.ts`
  - API integration via `fetch`

## API Documentation

Base URL: `http://127.0.0.1:8000/api`

### `POST /api/invoices/`
Create a new invoice.

Request body:
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9999999999",
    "address": "Mumbai, India"
  },
  "items": [
    { "item_name": "Design Service", "quantity": 2, "price": "1500.00" },
    { "item_name": "Hosting", "quantity": 1, "price": "800.00" }
  ],
  "tax_rate": "18.00",
  "status": "Pending"
}
```

Response contains computed values from backend:
- `items[].subtotal`
- `subtotal`
- `tax_amount`
- `total_amount`

### `GET /api/invoices/`
Returns all invoices (newest first), including customer summary and computed totals.

### `GET /api/invoices/{id}/`
Returns full invoice details, including all line items and amounts.

## Local Setup & Run

## Prerequisites
- Python 3.11+ (3.13 works)
- Node.js 20+
- npm 10+

### 1) Run Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend will start at: `http://127.0.0.1:8000`

### 2) Run Frontend

```bash
cd frontend
npm install
```

Create env file from example:

- **Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

- **macOS/Linux:**
```bash
cp .env.example .env.local
```

Start dev server:

```bash
npm run dev
```

Frontend will start at: `http://localhost:3000`

## Useful Commands

### Backend
```bash
python manage.py check
python manage.py createsuperuser
```

### Frontend
```bash
npm run lint
npm run build
```

## Production Notes

- Move secrets and configuration to environment variables:
  - `SECRET_KEY`
  - database configuration
  - CORS allowlist
- Prefer PostgreSQL for production deployments
- Add authentication/authorization for protected operations
- Add automated test coverage (unit + integration + API)
- Add CI/CD pipelines for lint, test, and build checks
