# EasySLR Assignment Submission By Gouransh Sachdeva

# 🛠️ Project Management Tool

A Kanban-style project management application built using the **T3 Stack** (Next.js + tRPC + Prisma + TailwindCSS), with support for email/password authentication via **NextAuth** and Supabase storage integration for profile uploads. Inspired by tools like Jira and Trello.

---

## 🚀 Tech Stack

- **Frontend**: Next.js with TypeScript, React, TailwindCSS, ShadCN, Lucide
- **Backend**: tRPC, Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js (Email + Password via Credentials Provider)
- **Storage**: Supabase (for user profile pictures)
- **State & Data Fetching**: React Query, Context API
- **Drag & Drop**: DnD Kit (for Kanban board)
- **Form Validation**: Zod, React Hook Form
- **Notifications**: Sonner Toasts

---

## 📦 Features

- 🔐 User authentication via **NextAuth (email/password)**
- 🧑 User profile with **bio, profile picture**, and editable info
- 📁 CRUD for **Projects**, with creator-based access control
- ✅ Each Project has **statuses** (To Do, In Progress, Done) — Kanban-style
- 📝 Create/edit/delete **Tasks**, assign them to users
- 🧩 Drag & drop Tasks between Statuses
- 📊 Task metadata includes: `title`, `description`, `priority`, `tag`, `deadline`, `assignee`
- 🔄 Optimistic updates for moving tasks across statuses
- ⚠️ Route protection via session checks in client layout
- 📤 Profile picture upload using **Supabase Storage**

---

## 🏗️ Project Structure

```
/
├── prisma/                   # Prisma schema and migrations
├── src/
│   ├── pages/               # Page Router structure
│   ├── server/
│   │   └── api/             # tRPC routers
│   ├── components/          # UI Components (Navbar, Sidebar, Breadcrumbs, etc.)
│   ├── utils/               # API utils, helper functions
│   ├── features/            # Feature-specific UI like TaskForm, ProjectForm
├── public/                  # Static assets
├── styles/                  # Tailwind styles
├── .env                     # Environment variables
├── next.config.js
└── README.md
```

---

## 🧪 Testing Strategy

> Basic integration tested via manual QA for now. End-to-end testing and unit tests can be added with Playwright or Vitest in the future.

**Manual QA:**

- ✅ Auth flow (register, login, logout)
- ✅ CRUD operations for projects and tasks
- ✅ Drag & drop with visual updates
- ✅ Profile updates including image upload

---

## 🛡️ Route Protection (Client-Side)

- Protected routes (like `/dashboard`) use session checks inside layouts.
- If a user is unauthenticated, they are redirected to `/`.

```tsx
useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/');
  }
}, [status]);
```

> Note: Middleware-based protection was explored but avoided due to Page Router limitations and redirect issues.

---

## 🧪 Prisma Schema Overview

- `User`: Auth & profile data
- `Project`: Has multiple `Status`, created by `User`
- `Status`: Kanban column, belongs to one `Project`
- `Task`: Belongs to one `Project` and one `Status`, with full metadata
- Auth-related models: `Account`, `Session`, `VerificationToken` (for NextAuth)

---

## 🧑‍💻 Developer Setup

1. **Clone the Repo**


2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup .env**
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000
   SUPABASE_PROJECT_URL=https://xyz.supabase.co
   SUPABASE_ANON_KEY=your-public-anon-key
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the App**
   ```bash
   npm run dev
   ```

---

## 🧩 Deployment Instructions

We recommend deploying on **Vercel**:

1. Connect the GitHub repo
2. Set environment variables in the dashboard
3. Add your **PostgreSQL** and **Supabase** credentials
4. Set the `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.
5. Deploy!

**Other Options**:
- Railway or Render for backend DB
- Supabase for storage
- Cloudflare Images for CDN

---

## 🧠 Future Improvements

- ✅ Server-side redirects via middleware (once App Router is adopted)
- 🔄 Reordering within same column (DnD sortable)
- 🔍 Filters for assignees, priority, tag
- 📆 Calendar view for task deadlines
- 📊 Dashboard metrics and charts
- 🔔 Email notifications

---

## 🤝 Thanks, Looking forward for your review.


