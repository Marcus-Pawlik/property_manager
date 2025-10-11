import { Property, PropertyStatus } from '@/types/property';

/**
 * Calculate property status based on maintenance score and tasks
 */
export function calculatePropertyStatus(property: Property): PropertyStatus {
  const { maintenanceScore, tasks } = property;

  // If there are overdue tasks, status is overdue
  if (tasks.overdue > 0) {
    return 'overdue';
  }

  // If maintenance score is below 70 or there are many pending tasks, status is pending
  if ((maintenanceScore || 0) < 70 || tasks.pending > 3) {
    return 'pending';
  }

  // Otherwise, status is complete
  return 'complete';
}

/**
 * Calculate maintenance score based on tasks and issues
 */
export function calculateMaintenanceScore(property: Property): number {
  const { tasks, issues } = property;
  const totalTasks = tasks.completed + tasks.pending + tasks.overdue;

  if (totalTasks === 0) return 100;

  // Base score from task completion
  const taskScore = (tasks.completed / totalTasks) * 100;

  // Penalty for overdue tasks
  const overduePenalty = tasks.overdue * 10;

  // Penalty for issues
  const issuePenalty = (issues || []).length * 5;

  // Calculate final score
  const finalScore = Math.max(0, taskScore - overduePenalty - issuePenalty);

  return Math.round(finalScore);
}
