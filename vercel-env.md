# Vercel Environment Variables

## Required Environment Variables

### Database
```
POSTGRES_URL=postgresql://user:password@host:port/database
DATABASE_URL=postgresql://user:password@host:port/database
```

### Authentication
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-vercel-app.vercel.app
JWT_SECRET=your-jwt-secret-here
```

### Optional (for production)
```
NODE_ENV=production
ENABLE_ANALYTICS=true
SENTRY_DSN=your-sentry-dsn
```

## How to Set Up
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each of the required variables
4. Deploy your application

## Development Setup
For local development, create a `.env.local` file in the root directory with the same variables.
