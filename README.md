# Portfolio

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · next-themes

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Make it yours

| What | Where |
| --- | --- |
| Name, role, headline, email, socials, projects, jobs, skills, stats, testimonials | `lib/data.ts` |
| Resume download | replace `public/resume.pdf` |
| Project screenshots | drop images in `public/projects/` and set `image: "/projects/x.png"` on a project (otherwise an abstract mockup is drawn) |
| Bento card size | `size: "feature" \| "wide" \| "tall" \| "base"` per project |
| Accent color / surfaces | `@theme` tokens in `app/globals.css` |
| Favicon | `app/icon.svg` |
| Contact form delivery | `app/api/contact/route.ts` — validates server-side; plug in Resend/Postmark/etc. at the TODO |

## Structure

```
app/            layout, page, global styles, /api/contact
components/     Navbar, Hero, About, Experience, Projects (+ ProjectMockup), TechStack, Contact, Footer, Toast, ui
lib/            data.ts (content), validation.ts (shared form rules)
```
