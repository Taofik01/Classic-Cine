This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Movie Library Application

This is a responsive and dynamic movie library application built using **Next.js**, **TypeScript**, and **Tailwind CSS**. It integrates the TMDb API for fetching movie data.

## Features
- Display popular movies with infinite scrolling.
- Search movies by title.
- View detailed information about each movie.
- Add movies to your favorites list.
- Responsive design with Tailwind CSS.
- Server-Side Rendering (SSR) for improved SEO.
- Skeleton loader for enhanced user experience.

## Design Decisions

### Tailwind CSS for Styling
- **Why**: Lightweight and highly customizable for responsive design.
- **Trade-Off**: Requires learning Tailwind's utility classes but simplifies complex styling needs.

### Infinite Scrolling
- **Why**: Enhances user experience by loading movies dynamically.
- **Trade-Off**: Increased API calls, which can affect performance.

### LocalStorage for Favorites
- **Why**: Simple and effective for persisting data without backend dependencies.
- **Trade-Off**: Data is browser-specific and cannot sync across devices.

### Server-Side Rendering (SSR)
- **Why**: Improves initial load times and SEO by pre-rendering the homepage.
- **Trade-Off**: Slightly increased server load during requests.

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



## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.


# movie-library ClassicCine
