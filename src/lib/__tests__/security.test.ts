import { describe, it, expect } from 'vitest';
import { validatePropertyId, validatePropertyStatus, sanitizeText, sanitizeHtml } from '../security';
import { PropertyIdSchema, PropertyStatusSchema, PropertySchema } from '../validation';

describe('Security Validation', () => {
  describe('validatePropertyId', () => {
    it('should accept valid property IDs', () => {
      const validIds = ['oak-street', 'riverside-complex', 'sunset-manor', 'test123'];
      
      validIds.forEach(id => {
        const result = validatePropertyId(id);
        expect(result.valid).toBe(true);
        expect(result.sanitized).toBe(id);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid property IDs', () => {
      const invalidIds = [
        { id: '', error: 'Property ID is required' },
        { id: 'ab', error: 'Property ID must be 3-50 characters' },
        { id: 'a'.repeat(51), error: 'Property ID must be 3-50 characters' },
        { id: 'Invalid_ID!', error: 'Property ID contains invalid characters' },
        { id: 'test@domain.com', error: 'Property ID contains invalid characters' },
        { id: 'test<script>', error: 'Property ID contains invalid characters' },
      ];

      invalidIds.forEach(({ id, error }) => {
        const result = validatePropertyId(id);
        expect(result.valid).toBe(false);
        expect(result.error).toBe(error);
        expect(result.sanitized).toBeUndefined();
      });
    });

    it('should sanitize and normalize valid IDs', () => {
      const result = validatePropertyId('  OAK-STREET  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('oak-street');
    });
  });

  describe('validatePropertyStatus', () => {
    it('should accept valid status values', () => {
      const validStatuses = ['complete', 'pending', 'overdue'];
      
      validStatuses.forEach(status => {
        const result = validatePropertyStatus(status);
        expect(result.valid).toBe(true);
        expect(result.sanitized).toBe(status);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid status values', () => {
      const invalidStatuses = [
        { status: '', error: 'Status is required' },
        { status: 'invalid', error: 'Status must be complete, pending, or overdue' },
        { status: 'complete<script>', error: 'Status must be complete, pending, or overdue' },
      ];

      invalidStatuses.forEach(({ status, error }) => {
        const result = validatePropertyStatus(status);
        expect(result.valid).toBe(false);
        expect(result.error).toBe(error);
        expect(result.sanitized).toBeUndefined();
      });
    });

    it('should sanitize and normalize valid statuses', () => {
      const result = validatePropertyStatus('  COMPLETE  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('complete');
    });
  });

  describe('sanitizeText', () => {
    it('should sanitize text content', () => {
      expect(sanitizeText('  Normal text  ')).toBe('Normal text');
      expect(sanitizeText('Text\nwith\twhitespace')).toBe('Text with whitespace');
      expect(sanitizeText('Text\x00with\x1Fcontrol\x7Fchars')).toBe('Textwithcontrolchars');
    });

            it('should handle empty and null inputs', () => {
              expect(sanitizeText('')).toBe('');
              expect(sanitizeText(null as unknown as string)).toBe('');
              expect(sanitizeText(undefined as unknown as string)).toBe('');
            });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizeHtml('Normal text')).toBe('Normal text');
      expect(sanitizeHtml('Text & "quotes"')).toBe('Text &amp; &quot;quotes&quot;');
    });

    it('should handle empty inputs', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null as unknown as string)).toBe('');
      expect(sanitizeHtml(undefined as unknown as string)).toBe('');
    });
  });
});

describe('Zod Validation Schemas', () => {
  describe('PropertyIdSchema', () => {
    it('should validate property IDs', () => {
      expect(PropertyIdSchema.parse('oak-street')).toBe('oak-street');
      expect(PropertyIdSchema.parse('test-123')).toBe('test-123');
      
      expect(() => PropertyIdSchema.parse('ab')).toThrow();
      expect(() => PropertyIdSchema.parse('Invalid_ID!')).toThrow();
    });
  });

  describe('PropertyStatusSchema', () => {
    it('should validate property statuses', () => {
      expect(PropertyStatusSchema.parse('complete')).toBe('complete');
      expect(PropertyStatusSchema.parse('pending')).toBe('pending');
      expect(PropertyStatusSchema.parse('overdue')).toBe('overdue');
      
      expect(() => PropertyStatusSchema.parse('invalid')).toThrow();
      expect(() => PropertyStatusSchema.parse('COMPLETE')).toThrow();
    });
  });

  describe('PropertySchema', () => {
    it('should validate complete property objects', () => {
      const validProperty = {
        id: 'test-property',
        name: 'Test Property',
        address: '123 Test Street',
        units: 10,
        status: 'complete' as const,
        lastInspection: 'Oct 1, 2024',
        nextInspection: 'Oct 15, 2024',
        maintenanceScore: 95,
        tasks: {
          completed: 5,
          pending: 1,
          overdue: 0
        },
        issues: ['Test issue']
      };

      expect(() => PropertySchema.parse(validProperty)).not.toThrow();
    });

    it('should reject invalid property objects', () => {
      const invalidProperty = {
        id: 'ab', // Too short
        name: 'Test Property',
        address: '123 Test Street',
        units: 10,
        status: 'invalid', // Invalid status
        lastInspection: 'Oct 1, 2024',
        nextInspection: 'Oct 15, 2024',
        maintenanceScore: 95,
        tasks: {
          completed: 5,
          pending: 1,
          overdue: 0
        },
        issues: ['Test issue']
      };

      expect(() => PropertySchema.parse(invalidProperty)).toThrow();
    });
  });
});
