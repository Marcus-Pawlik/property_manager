import { NextRequest } from 'next/server';
import { ValidationError, SecurityError } from './validation';

// HTML sanitization - basic implementation
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Text sanitization for display
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters but preserve \t, \n, \r
    .replace(/\s+/g, ' '); // Normalize whitespace
}

// URL sanitization
export function sanitizeUrl(input: string): string {
  if (!input) return '';
  
  try {
    const url = new URL(input);
    // Only allow http/https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
    return url.toString();
  } catch {
    return '';
  }
}

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  action: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = `${identifier}:${action}`;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < windowStart) {
    // New window or expired
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }
  
  current.count++;
  return { allowed: true, remaining: maxRequests - current.count, resetTime: current.resetTime };
}

// Get client IP for rate limiting
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

// Secure error logging
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
  level: 'info' | 'warn' | 'error' = 'info'
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    level,
    details: {
      ...details,
      // Remove sensitive data
      password: '[REDACTED]',
      token: '[REDACTED]',
      secret: '[REDACTED]',
    },
  };
  
  console.log(`[SECURITY ${level.toUpperCase()}]`, JSON.stringify(logEntry));
}

// Input validation helper
export function validateInput<T>(
  schema: any,
  input: unknown,
  context: string
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  try {
    const result = schema.safeParse(input);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    const errors: ValidationError[] = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));
    
    logSecurityEvent('validation_failed', {
      context,
      errors: errors.length,
      fields: errors.map(e => e.field),
    }, 'warn');
    
    return { success: false, errors };
  } catch (error) {
    logSecurityEvent('validation_error', {
      context,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 'error');
    
    return {
      success: false,
      errors: [{
        field: 'unknown',
        message: 'Validation failed',
        code: 'validation_error',
      }],
    };
  }
}

// Safe property ID validation
export function validatePropertyId(id: string): { valid: boolean; sanitized?: string; error?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'Property ID is required' };
  }
  
  const sanitized = sanitizeText(id).toLowerCase();
  
  if (sanitized.length < 3 || sanitized.length > 50) {
    return { valid: false, error: 'Property ID must be 3-50 characters' };
  }
  
  if (!/^[a-z0-9-]+$/.test(sanitized)) {
    return { valid: false, error: 'Property ID contains invalid characters' };
  }
  
  return { valid: true, sanitized };
}

// Safe property status validation
export function validatePropertyStatus(status: string): { valid: boolean; sanitized?: string; error?: string } {
  if (!status || typeof status !== 'string') {
    return { valid: false, error: 'Status is required' };
  }
  
  const sanitized = sanitizeText(status).toLowerCase();
  
  if (!['complete', 'pending', 'overdue'].includes(sanitized)) {
    return { valid: false, error: 'Status must be complete, pending, or overdue' };
  }
  
  return { valid: true, sanitized };
}

// Content Security Policy helper
export function getCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}
