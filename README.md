# Orientec Frontend V3

Angular standalone application focused initially on the SISAGE-like OS flow.

## Rule-driven behavior
- Login via `/api/v1/auth/login`.
- JWT is attached by an HTTP interceptor.
- OS detail calls `/api/v1/os/{id}/acoes`.
- Action buttons are rendered only from rules returned by the backend.
- The frontend never invents a transition.
- Authorization dialogs are shown only when the backend rule says authorization is required.
- The backend remains authoritative and revalidates permissions, transition and authorization.

## Run

```bash
npm install
npm start
```

The Angular dev server expects the backend at the same origin or a reverse proxy. For local development configure an Angular proxy to `http://localhost:8080` if needed.
