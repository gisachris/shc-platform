# Deployment Guide

This guide shows how to deploy the Smart Hybrid Conference and Event Management Platform locally and on a production host.

## 1. Prerequisites

- Node.js 20+
- npm 10+
- MongoDB instance
- Optional: Docker and Docker Compose
- Optional: a domain name and HTTPS certificate for production

## 2. Environment setup

### Backend

Copy the example file and update the values:

```bash
cd backend
cp .env.example .env
```

Minimum values to configure:

```env
MONGO_URI=mongodb://127.0.0.1:27017/event_mgmt
JWT_SECRET=replace-with-a-long-random-secret
PORT=5050
CLIENT_URL=http://localhost:5173
```

For production, also set:

```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM="Your App <no-reply@yourdomain.com>"
```

### Frontend

```bash
cd Frontendd
cp .env.example .env
```

Set the API target for production:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_SITE_URL=https://yourdomain.com
```

## 3. Run locally

Install dependencies for both apps:

```bash
cd /workspaces/shc-platform
npm run install:all
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend:

```bash
npm run dev:frontend
```

The app should be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5050

## 4. Production deployment options

### Option A: Docker Compose

From the frontend folder:

```bash
cd Frontendd
docker compose up --build -d
```

This builds the Vite frontend and serves it through Nginx on port 8080.

### Option B: VPS / cloud host

1. Build the frontend:

```bash
cd Frontendd
npm install
npm run build
```

2. Serve the generated dist folder with Nginx or any static host.
3. Deploy the backend as a Node.js service, ideally behind a reverse proxy.
4. Point the frontend environment to the deployed backend URL.

### Recommended reverse proxy setup

Use Nginx or Caddy to route:

- /api/* → backend service
- /* → frontend build output

Example backend service URL:

```text
https://api.yourdomain.com
```

## 5. Recommended production checklist

- Use a managed MongoDB service.
- Configure HTTPS and a real domain.
- Keep JWT secrets in a secrets manager or environment vault.
- Set the backend CORS origin to your production frontend domain.
- Enable SMTP for registration and notification emails.
- Mount uploads or use cloud storage for event posters.

## 6. Health check

Confirm that the backend is reachable:

```bash
curl http://localhost:5050/api/health
```

Expected response:

```json
{ "status": "ok" }
```
