import { nanoid } from 'nanoid';

/**
 * Generate a secure session ID for guest orders
 */
export function generateSessionId(): string {
  return `session_${nanoid(32)}`;
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  return /^session_[A-Za-z0-9_-]{32}$/.test(sessionId);
}
