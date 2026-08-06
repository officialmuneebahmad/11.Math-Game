# MathStreak SEO Strategy

## 1. On-Page SEO
- **Semantic HTML:** The application uses semantic HTML5 (`<header>`, `<main>`, `<footer>`, `<section>`) to define structure clearly.
- **Headings & Hierarchy:** Strict adherence to H1, H2, H3 hierarchy on all pages. The main H1 on the homepage is clear: "Train Your Brain. 5 Minutes a Day."
- **Meta Tags:** Each core route (though currently an SPA) should ideally push dynamic title and meta descriptions. The base `index.html` includes a strong descriptive title, meta description, and keywords.
- **Performance:** Optimized with lazy loading where applicable, Vite code-splitting, and CSS minification for high Core Web Vitals scores.

## 2. Technical SEO
- **Sitemap & Robots:** For production, generate an `xml` sitemap for the main entry points (e.g., `/`, `/game/easy`, `/game/medium`, `/game/hard`).
- **Structured Data:** Implement `SoftwareApplication`, `Game`, and `FAQPage` JSON-LD schema on the homepage.
- **Mobile-First:** Fully responsive using Tailwind CSS and tested on mobile viewpoints.
- **HTTPS & Clean URLs:** The router uses clean, descriptive paths.

## 3. Off-Page SEO Strategy
- **Launch Platforms:** Product Hunt, Hacker News, and BetaList.
- **Community Engagement:** Subreddits like r/math, r/learnmath, r/education, and r/teachers.
- **Facebook Groups:** Share in Homeschooling and Math Teacher resource groups.

## 4. AI SEO (GEO)
- **Answer-Engine Optimization:** The `documentation.md` and (future) FAQ sections are written in clear, concise, "Question-Answer" formats.
- **Quotable Content:** Structuring the benefits of "5-minute daily math practice" clearly so AI assistants (ChatGPT, Perplexity) can easily parse and summarize the app's value proposition.

## 5. Backlink SEO
- **Outreach Target:** Math education blogs, homeschooling resource lists, and "Tools for Teachers" directories.
- **Widget Strategy:** Create a small, embeddable "Play Daily Math" widget that bloggers can put on their site, which links back to MathStreak with a `dofollow` link.