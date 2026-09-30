This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Contentful read API

Set the public site URL so Open Graph and Twitter image URLs resolve correctly:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Use an `https://` URL in deployed environments. `SITE_URL` is also supported for
server-only deployments; `VERCEL_URL` is used as a fallback on Vercel.

The read-only endpoint is available at `/api/contentful`. Add `?content_type=yourContentType` to filter entries by content type. Keep the Contentful token server-side; do not prefix it with `NEXT_PUBLIC_`.

Use either the environment-specific names below or the generic names. Vercel uses `VERCEL_ENV` to choose production; local development uses the development values.

```bash
CONTENTFUL_SPACE_ID_DEV=your_dev_space_id
CONTENTFUL_ACCESS_TOKEN_DEV=your_dev_delivery_token
CONTENTFUL_ENVIRONMENT_DEV=master

CONTENTFUL_SPACE_ID_PROD=your_prod_space_id
CONTENTFUL_ACCESS_TOKEN_PROD=your_prod_delivery_token
CONTENTFUL_ENVIRONMENT_PROD=master
```

For separate deployment settings, `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` are also supported.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
