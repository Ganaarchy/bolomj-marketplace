# Bolomj Marketplace

Public marketplace frontend for published tours from multiple Bolomj tenants.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- lucide-react icons

## Environment

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.bolomj.space
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm run start
```

The app is ready to deploy on Vercel with:

- Domain: `https://bolomj.space`
- API base URL: `https://api.bolomj.space`

## Marketplace Behavior

- Fetches tours from `GET /public/marketplace/tours`.
- Fetches detail from `GET /public/marketplace/tours/:id`.
- Supports API payloads shaped as `Tour[]`, `{ data: Tour[] }`, or `{ data: Tour }`.
- Filters are handled on the frontend for the MVP.
- Compare data is stored in `localStorage`, capped at 3 tours, and rejects duplicates.
- Booking redirects to `https://{tenant_subdomain || tenant_slug}.bolomj.space/tours/{tour.slug}`.
