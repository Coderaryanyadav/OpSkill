# Opskill - Freelance Job Platform

A modern platform connecting companies with skilled professionals for freelance opportunities.

## 🚀 Features

- User authentication and authorization
- Job posting and management
- Application tracking
- Contract management
- Review system
- Ticket support system

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Vercel Postgres with Drizzle ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)
- Vercel Postgres database

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/opskill.git
   cd opskill
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env.local`
   - Update the variables with your configuration

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔄 Database Migrations

To run database migrations:

```bash
# Generate migration files
npx drizzle-kit generate:pg

# Apply migrations
npx tsx scripts/migrate.ts
```

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## 🚀 Deployment

### Vercel

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to Vercel
3. Set up environment variables in Vercel project settings
4. Deploy!

### Environment Variables

Required environment variables:

```
DATABASE_URL=postgres://user:password@host:port/database
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📄 License

MIT

---

Built with ❤️ by Your Team
