#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI is not installed. Installing now..."
  npm install -g vercel
fi

# Build the project
echo "Building the project..."
npm run build

# Check for environment variables
if [ ! -f ".env.local" ]; then
  echo "Error: .env.local file not found. Please create one based on vercel-env.md"
  exit 1
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

# Output deployment information
echo "\nDeployment complete!"
echo "Make sure to set up the following environment variables in your Vercel project:"
echo "- POSTGRES_URL"
echo "- DATABASE_URL"
echo "- NEXTAUTH_SECRET"
echo "- NEXTAUTH_URL"
echo "- JWT_SECRET"

echo "\nYou can manage your environment variables at:"
echo "https://vercel.com/your-username/your-project/settings/environment-variables"
