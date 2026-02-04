// Authentication helpers for admin panel

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

// Hash a password using PBKDF2-SHA256
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await deriveKey(password, salt);
  const keyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', key));

  // Format: base64(salt):base64(hash)
  return `${uint8ToBase64(salt)}:${uint8ToBase64(keyBytes)}`;
}

// Verify a password against a stored hash
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(':');
  if (!saltB64 || !hashB64) return false;

  const salt = base64ToUint8(saltB64);
  const expectedHash = base64ToUint8(hashB64);
  const key = await deriveKey(password, salt);
  const keyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', key));

  // Constant-time comparison
  if (keyBytes.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < keyBytes.length; i++) {
    diff |= keyBytes[i] ^ expectedHash[i];
  }
  return diff === 0;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: KEY_LENGTH * 8 },
    true,
    ['encrypt']
  );
}

function uint8ToBase64(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr));
}

function base64ToUint8(b64: string): Uint8Array {
  const str = atob(b64);
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}

// Generate a secure session token
export function generateSessionId(): string {
  return crypto.randomUUID();
}

// Create a session in D1
export async function createSession(db: D1Database): Promise<string> {
  const id = generateSessionId();
  // Session expires in 24 hours
  await db.prepare(
    "INSERT INTO admin_sessions (id, expires_at) VALUES (?, datetime('now', '+24 hours'))"
  ).bind(id).run();

  // Clean up expired sessions
  await db.prepare(
    "DELETE FROM admin_sessions WHERE expires_at < datetime('now')"
  ).run();

  return id;
}

// Validate a session
export async function validateSession(db: D1Database, sessionId: string): Promise<boolean> {
  const row = await db.prepare(
    "SELECT id FROM admin_sessions WHERE id = ? AND expires_at > datetime('now')"
  ).bind(sessionId).first();
  return !!row;
}

// Delete a session (logout)
export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare('DELETE FROM admin_sessions WHERE id = ?').bind(sessionId).run();
}

// Check brute force protection
export async function checkBruteForce(db: D1Database, ip: string): Promise<boolean> {
  // Clean up old attempts (older than 1 hour)
  await db.prepare(
    "DELETE FROM login_attempts WHERE attempted_at < datetime('now', '-1 hour')"
  ).run();

  // Count recent failed attempts (last 15 minutes)
  const result = await db.prepare(
    "SELECT COUNT(*) as count FROM login_attempts WHERE ip = ? AND success = 0 AND attempted_at > datetime('now', '-15 minutes')"
  ).bind(ip).first<{ count: number }>();

  return (result?.count ?? 0) >= 5;
}

// Record a login attempt
export async function recordLoginAttempt(db: D1Database, ip: string, success: boolean): Promise<void> {
  await db.prepare(
    'INSERT INTO login_attempts (ip, success) VALUES (?, ?)'
  ).bind(ip, success ? 1 : 0).run();
}

// Parse cookies from request
export function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies: Record<string, string> = {};
  for (const pair of cookieHeader.split(';')) {
    const [key, ...rest] = pair.trim().split('=');
    if (key) cookies[key] = rest.join('=');
  }
  return cookies;
}

// Create Set-Cookie header for session
export function sessionCookieHeader(sessionId: string): string {
  return `admin_session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`;
}

// Create Set-Cookie header to clear session
export function clearSessionCookieHeader(): string {
  return `admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}
