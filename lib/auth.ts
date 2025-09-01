import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './schema';
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { redirect } from 'next/navigation';
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
  const cookieStore = cookies();
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
  }
  
  if (user.is_banned) {
    redirect('/banned');
  }
  
  if (role && user.role !== role) {
    redirect('/unauthorized');
  }
  
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  
  if (user.is_banned) {
    throw new Error('Your account has been banned');
  }
  
  const token = await createToken(user.id, user.role);
  return { user, token };
}

export function setAuthCookie(token: string) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearAuthCookie() {
  cookies().delete('token');
}

export async function requireRole(requiredRole: 'ADMIN' | 'COMPANY' | 'TALENT') {
  const user = await requireAuth();
  
  if (user.role !== requiredRole && user.role !== 'ADMIN') {
    redirect('/unauthorized');
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
