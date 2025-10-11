export type PropertyStatus = 'complete' | 'pending' | 'overdue';

export interface Property {
  id: string;
  name: string;
  address: string;
  status: PropertyStatus;
  units: number;
  tasks: {
    completed: number;
    pending: number;
    overdue: number;
  };
  issues?: string[];
  maintenanceScore?: number;
  lastInspection?: string;
  nextInspection?: string;
  notes?: string;
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
  message?: string;
  error?: string;
}
