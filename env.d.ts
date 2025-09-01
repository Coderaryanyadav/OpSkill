/// <reference types="@vercel/edge-config" />
/// <reference types="@vercel/postgres" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    readonly POSTGRES_URL: string;
    readonly POSTGRES_URL_NON_POOLING?: string;
    
    // Authentication
    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_URL: string;
    
    // App
    readonly NEXT_PUBLIC_APP_URL: string;
    
    // Environment
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}
