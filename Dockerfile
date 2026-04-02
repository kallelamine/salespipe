# Vite inlines VITE_* into static JS at build time (expected for SPAs).
# Use the Supabase anon/publishable key only — never the service_role key.
# Docker may warn about ARG/ENV: the anon key is public by design with RLS.

FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

RUN npm run build

# --- Serve static files ---
FROM nginx:1.27-alpine AS runner

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
