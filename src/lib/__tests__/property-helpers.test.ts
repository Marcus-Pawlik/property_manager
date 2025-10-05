import { describe, it, expect } from 'vitest';
import { calculatePropertyStatus, calculateMaintenanceScore } from "../property-helpers";
import { Property } from '@/types/property';

describe('Property Helper Functions', () => {
  describe('calculatePropertyStatus', () => {
    it('should return "overdue" when there are overdue tasks', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 95,
        tasks: { completed: 5, pending: 2, overdue: 1 },
        issues: []
      };
      
      expect(calculatePropertyStatus(property)).toBe('overdue');
    });

    it('should return "pending" when maintenance score is below 70', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 65,
        tasks: { completed: 3, pending: 2, overdue: 0 },
        issues: []
      };
      
      expect(calculatePropertyStatus(property)).toBe('pending');
    });

    it('should return "pending" when there are many pending tasks', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 85,
        tasks: { completed: 5, pending: 5, overdue: 0 },
        issues: []
      };
      
      expect(calculatePropertyStatus(property)).toBe('pending');
    });

    it('should return "complete" when conditions are met', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'pending',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 85,
        tasks: { completed: 8, pending: 2, overdue: 0 },
        issues: []
      };
      
      expect(calculatePropertyStatus(property)).toBe('complete');
    });
  });

  describe('calculateMaintenanceScore', () => {
    it('should return 100 when there are no tasks', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 0,
        tasks: { completed: 0, pending: 0, overdue: 0 },
        issues: []
      };
      
      expect(calculateMaintenanceScore(property)).toBe(100);
    });

    it('should calculate score based on task completion', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 0,
        tasks: { completed: 8, pending: 2, overdue: 0 },
        issues: []
      };
      
      // 8 completed out of 10 total = 80%
      expect(calculateMaintenanceScore(property)).toBe(80);
    });

    it('should apply penalty for overdue tasks', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 0,
        tasks: { completed: 8, pending: 1, overdue: 1 },
        issues: []
      };
      
      // 8 completed out of 10 total = 80%, minus 10 for overdue task = 70%
      expect(calculateMaintenanceScore(property)).toBe(70);
    });

    it('should apply penalty for issues', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 0,
        tasks: { completed: 8, pending: 2, overdue: 0 },
        issues: ['Issue 1', 'Issue 2']
      };
      
      // 8 completed out of 10 total = 80%, minus 10 for 2 issues = 70%
      expect(calculateMaintenanceScore(property)).toBe(70);
    });

    it('should not return negative scores', () => {
      const property: Property = {
        id: 'test',
        name: 'Test Property',
        address: 'Test Address',
        units: 10,
        status: 'complete',
        lastInspection: '2024-01-01',
        nextInspection: '2024-02-01',
        maintenanceScore: 0,
        tasks: { completed: 1, pending: 1, overdue: 5 },
        issues: ['Issue 1', 'Issue 2', 'Issue 3']
      };
      
      // Should not be negative
      expect(calculateMaintenanceScore(property)).toBe(0);
    });
  });
});
