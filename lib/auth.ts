import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, type User as DbUser } from './schema';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '30d';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createToken(userId: number, role: string): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  return await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ userId: number; role: string } | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    if (typeof payload.userId !== 'number' || typeof payload.role !== 'string') {
      return null;
    }
    
    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return null;
  }
  
  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }
  
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, payload.userId),
  });
  
  return user || null;
}

export async function requireAuth(role?: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
    // This return is unreachable due to redirect, but satisfies TypeScript
    return null as never;
  }
  
  if (user.is_banned) {
    redirect('/banned');
    return null as never;
  }
  
  if (role && user.role !== role) {
    redirect('/unauthorized');
    return null as never;
  }
  
  return user;
}

interface User {
  id: number;
  email: string;
  role: string;
  is_banned: boolean | null;
  password: string;
  // Add other user properties as needed
  [key: string]: unknown;
}

interface LoginResult {
  user: Omit<User, 'password'>;
  token: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  }) as User | undefined;
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }
  
  if (user.is_banned) {
    throw new Error('Your account has been banned');
  }
  
  const token = await createToken(user.id, user.role);
  
  // Omit password from the returned user object
  const { password: _, ...userWithoutPassword } = user;
  
  return { 
    user: userWithoutPassword, 
    token 
  };
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}

export async function requireRole(requiredRole: 'ADMIN' | 'COMPANY' | 'TALENT') {
  const user = await requireAuth();
  
  if (user.role !== requiredRole && user.role !== 'ADMIN') {
    redirect('/unauthorized');
    return null as never;
  }
  
  return user;
}

export async function requireAdmin() {
  return requireRole('ADMIN');
}

export async function requireCompany() {
  return requireRole('COMPANY');
}

export async function requireTalent() {
  return requireRole('TALENT');
}
