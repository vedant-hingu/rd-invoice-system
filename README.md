# Simple Invoice System

Production-ready full-stack invoice management app using:
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: Django + Django REST Framework
- DB: SQLite (easy local setup, can be swapped in production)

## Features

- Create invoices with customer details and dynamic line items
- Backend-driven calculations for subtotal, tax, and total
- Invoice list table with sorting and filtering (date/customer)
- Invoice detail page with full breakdown and print/download option
- Invoice status support (`Pending` / `Paid`)
- Validation on both frontend and backend

## Project Structure

```text
backend/
  config/
  invoices/
frontend/
  src/app/
  src/components/
  src/lib/
  src/types/
```

## Run Locally

### 1) Backend (Django REST)

```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend runs on `http://127.0.0.1:8000`.

### 2) Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## API Documentation (Basic)

### POST `/api/invoices/`
Create invoice with customer and line items.

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

Response includes computed:
- `subtotal`
- `tax_amount`
- `total_amount`
- per-item `subtotal`

### GET `/api/invoices/`
Returns all invoices ordered by newest first.

### GET `/api/invoices/{id}/`
Returns a single invoice with customer and all line items.

## Notes for Production

- Move secret/config to env vars (`SECRET_KEY`, DB settings, CORS allowlist)
- Use PostgreSQL and proper migration workflow
- Add authentication/authorization before exposing publicly
- Add tests and CI/CD pipeline
