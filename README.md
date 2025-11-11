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

## Firebase (Firestore + Storage) Setup for FeaturedPlaylist

The Featured Playlist section can load tracks from Firestore and play audio files hosted in Firebase Storage.

1) Install dependencies (already in package.json if you pulled latest):

```bash
npm install firebase
```

2) Create `.env.local` in the project root with your Firebase client config (NEXT_PUBLIC_* variables are required on the client):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3) Firestore data model:

- Collection: `tracks`
- Each document may include the following fields:
  - `id` (number) — optional; if missing, an index will be used
  - `title` (string)
  - `duration` (string, e.g. "3:42")
  - `format` (string, e.g. "MP3")
  - `sizeInMB` (number)
  - One of:
    - `downloadUrl` (string) — a direct Firebase Storage download URL
    - `storagePath` (string) — the path in your storage bucket (e.g. `audio/cash-final-2-release.wav`)

If `storagePath` is provided, the app will resolve it to a download URL using Firebase Storage. If `downloadUrl` is present, it will be used directly.

4) Permissions

Ensure your Firebase Storage rules allow read access to the audio files you want to preview, or use authenticated access. For public previews, a common approach is to use token-based download URLs (the default Storage download URLs include an access token).

5) Fallback

If Firebase is not configured, the playlist will fall back to local sample audio files found under `public/audio/`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
