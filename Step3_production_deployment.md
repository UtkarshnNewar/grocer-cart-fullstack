# Step 3: Production Optimization & Nginx Proxy

This document covers the steps taken to transform the development setup into a robust, memory-efficient production deployment.

## 1. Nginx Reverse Proxy
To serve the application on standard HTTP Port 80 and elegantly handle API requests, we implemented an Nginx Reverse Proxy.

- Created `nginx/nginx.conf` to map `/` to the Next.js frontend (port 3000) and `/api/` to the Express backend (port 5000).
- Added the `nginx` service to `docker-compose.yml` to expose port 80 to the public.

## 2. Fixing Hardcoded API URLs
In development, the frontend communicated directly with `http://localhost:5000`. In a production environment, this fails because the user's browser attempts to reach `localhost` on their own laptop instead of the AWS server.

- Updated all `fetch()` calls in the Next.js pages (`page.tsx`, `login/page.tsx`, `signup/page.tsx`, `checkout/page.tsx`).
- Replaced absolute URLs with relative paths (e.g., `/api/products`). This allows the browser to send requests to Nginx, which then routes them seamlessly to the backend container.

## 3. Production Builds (Fixing Hydration & Memory Crashes)
The `t2.micro` / `t3.micro` EC2 instances have very limited RAM (1GB). Running Next.js in development mode (`npm run dev`) requires heavy background processes like Hot Module Replacement (HMR), causing memory exhaustion, failed websocket connections, and React hydration crashes in the browser.

To fix this:
- Modified `myapp/Dockerfile` to use `npm run build` and `npm start`.
- Modified `docker-compose.yml` to change `NODE_ENV` to `production`.
- Removed local development volume mounts (`./myapp:/app`) from `docker-compose.yml` so Docker builds immutable, pre-compiled production images.

## 4. Seeding the Production Database
Because the AWS database was fresh, it needed to be seeded with initial grocery products.

- Ran the seed command inside the AWS terminal to trigger the backend seed logic:
  ```bash
  curl -X POST http://localhost/api/seed
  ```

## 5. Applying the Changes
All of the above changes were pushed to GitHub, pulled onto the AWS server, and deployed using the production build flag:

```bash
git pull
sudo docker compose down
sudo docker compose build --no-cache frontend backend
sudo docker compose up -d
```
