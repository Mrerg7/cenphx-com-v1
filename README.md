# CenPHX.com

Acquisition site for Central Phoenix, Arizona — the compact city-core domain.

**Asking price:** $50,000  
**Inquiries:** [sales@desertrich.com](mailto:sales@desertrich.com)

## Stack

Astro static site with Tailwind CSS, Cloudflare Stream hero video, and Workers Static Assets deploy via Wrangler.

## Local development

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 43123
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Build & deploy

```bash
npm run build
npx wrangler deploy
```

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
