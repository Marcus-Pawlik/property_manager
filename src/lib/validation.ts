import { z } from 'zod';

// Property ID validation - alphanumeric with hyphens, 3-50 chars
export const PropertyIdSchema = z.string()
  .min(3, 'Property ID must be at least 3 characters')
  .max(50, 'Property ID must be less than 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Property ID can only contain lowercase letters, numbers, and hyphens')
  .trim();

// Property status validation - strict enum
export const PropertyStatusSchema = z.enum(['complete', 'pending', 'overdue'], {
  errorMap: () => ({ message: 'Status must be complete, pending, or overdue' })
});

// Property name validation - safe text with length limits
export const PropertyNameSchema = z.string()
  .min(1, 'Property name is required')
  .max(100, 'Property name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s\-'&.,()]+$/, 'Property name contains invalid characters')
  .trim();

// Property address validation - safe text with length limits
export const PropertyAddressSchema = z.string()
  .min(1, 'Property address is required')
  .max(200, 'Property address must be less than 200 characters')
  .regex(/^[a-zA-Z0-9\s\-'&.,()#]+$/, 'Property address contains invalid characters')
  .trim();

// Units validation - positive integer
export const UnitsSchema = z.number()
  .int('Units must be a whole number')
  .min(1, 'Must have at least 1 unit')
  .max(10000, 'Cannot have more than 10,000 units');

// Maintenance score validation - 0-100
export const MaintenanceScoreSchema = z.number()
  .int('Maintenance score must be a whole number')
  .min(0, 'Maintenance score cannot be negative')
  .max(100, 'Maintenance score cannot exceed 100');

// Task counts validation
export const TaskCountSchema = z.number()
  .int('Task count must be a whole number')
  .min(0, 'Task count cannot be negative')
  .max(1000, 'Task count cannot exceed 1000');

// Property task validation
export const PropertyTaskSchema = z.object({
  completed: TaskCountSchema,
  pending: TaskCountSchema,
  overdue: TaskCountSchema,
});

// Issue validation - safe text array
export const IssueSchema = z.string()
  .min(1, 'Issue description cannot be empty')
  .max(500, 'Issue description must be less than 500 characters')
  .regex(/^[a-zA-Z0-9\s\-'&.,()!?]+$/, 'Issue description contains invalid characters')
  .trim();

// Date validation - simple format check
export const DateStringSchema = z.string()
  .min(1, 'Date is required')
  .max(50, 'Date string too long')
  .regex(/^[a-zA-Z0-9\s,]+$/, 'Date contains invalid characters')
  .trim();

// Complete Property validation schema
export const PropertySchema = z.object({
  id: PropertyIdSchema,
  name: PropertyNameSchema,
  address: PropertyAddressSchema,
  units: UnitsSchema,
  status: PropertyStatusSchema,
  lastInspection: DateStringSchema,
  nextInspection: DateStringSchema,
  maintenanceScore: MaintenanceScoreSchema,
  tasks: PropertyTaskSchema,
  issues: z.array(IssueSchema).max(20, 'Cannot have more than 20 issues'),
});

// Server Action input schemas
export const UpdatePropertyStatusInputSchema = z.object({
  id: PropertyIdSchema,
  status: PropertyStatusSchema,
});

export const GetPropertyByIdInputSchema = z.object({
  id: PropertyIdSchema,
});

// API Response validation
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.object({
  data: dataSchema,
  success: z.boolean(),
  error: z.string().optional(),
});

// Rate limiting schema
export const RateLimitSchema = z.object({
  identifier: z.string().min(1).max(100),
  action: z.string().min(1).max(50),
  timestamp: z.number().int().positive(),
});

// Error types for better error handling
export type ValidationError = {
  field: string;
  message: string;
  code: string;
};

export type SecurityError = {
  type: 'validation' | 'rate_limit' | 'unauthorized' | 'not_found';
  message: string;
  details?: Record<string, unknown>;
};
