# Nanjil MEP Frontend

Next.js frontend for customers, admins, and technicians.

## Local Setup

```bash
npm ci
```

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_BOOKING_URL=http://localhost:4001/bookings/new
NEXT_PUBLIC_UPI_ID=nanjilmep@upi
NEXT_PUBLIC_UPI_NAME=Nanjil MEP Service
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:4001
```

## Environment Guide

Required:

```text
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

Optional:

```text
NEXT_PUBLIC_BOOKING_URL=https://app.yourdomain.com/bookings/new
NEXT_PUBLIC_UPI_ID=your-upi-id@upi
NEXT_PUBLIC_UPI_NAME=Nanjil MEP Service
```

The backend must allow the frontend origin through `CORS_ORIGIN`.

## Auth Notes

Auth uses backend-set HttpOnly cookies. Axios sends cookies with `withCredentials`.

Protected routes are handled by:

- middleware cookie presence check
- client-side role guard using `/auth/me`

## Build Verification

```bash
npx tsc --noEmit --incremental false
npm run build
```

## Deployment Guide

1. Set frontend environment variables in the hosting platform.
2. Ensure `NEXT_PUBLIC_API_URL` points to the deployed backend `/api/v1`.
3. Ensure backend `CORS_ORIGIN` matches the frontend origin.
4. Build:

```bash
npm ci
npm run build
```

5. Start:

```bash
npm start
```

Docker:

```bash
docker build -t nanjil-mep-frontend .
docker run --env-file .env.production -p 4001:4001 nanjil-mep-frontend
```

## Main Areas

- `/` public landing page
- `/login`, `/register`
- `/dashboard`, `/bookings` for customers
- `/admin/dashboard`, `/admin/bookings`, `/admin/technicians`, `/admin/analytics`
- `/technician/dashboard`, `/technician/jobs`
