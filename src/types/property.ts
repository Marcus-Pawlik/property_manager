export type PropertyStatus = 'complete' | 'pending' | 'overdue';

export interface PropertyTask {
  completed: number;
  pending: number;
  overdue: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  status: PropertyStatus;
  lastInspection: string;
  nextInspection: string;
  maintenanceScore: number;
  tasks: PropertyTask;
  issues: string[];
}

export interface PropertySummary {
  totalProperties: number;
  completeProperties: number;
  pendingProperties: number;
  overdueProperties: number;
  totalUnits: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
