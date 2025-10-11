'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Property, PropertyStatus } from '@/types/property';
import { updatePropertyStatus } from './actions';
import { sanitizeText } from '@/lib/security';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [, startTransition] = useTransition();
  const [currentProperty, setCurrentProperty] = useState(property);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side validation
  function validateStatusUpdate(newStatus: PropertyStatus): boolean {
    if (!newStatus || typeof newStatus !== 'string') {
      setError('Invalid status value');
      return false;
    }

    if (!['complete', 'pending', 'overdue'].includes(newStatus)) {
      setError('Status must be complete, pending, or overdue');
      return false;
    }

    return true;
  }

  function validatePropertyId(id: string): boolean {
    if (!id || typeof id !== 'string') {
      setError('Invalid property ID');
      return false;
    }

    if (id.length < 3 || id.length > 50) {
      setError('Property ID must be 3-50 characters');
      return false;
    }

    if (!/^[a-z0-9-]+$/.test(id)) {
      setError('Property ID contains invalid characters');
      return false;
    }

    return true;
  }

  function getStatusColor(status: PropertyStatus) {
    switch (status) {
      case 'complete':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  }

  function getStatusIcon(status: PropertyStatus) {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  }

  const handleStatusUpdate = (newStatus: PropertyStatus) => {
    if (isUpdating) return;

    // Clear previous errors
    setError(null);

    // Client-side validation
    if (!validateStatusUpdate(newStatus)) {
      return;
    }

    if (!validatePropertyId(currentProperty.id)) {
      return;
    }

    setIsUpdating(true);
    startTransition(async () => {
      try {
        const response = await updatePropertyStatus(
          currentProperty.id,
          newStatus,
        );

        if (response.success && response.data) {
          setCurrentProperty(response.data);
          setError(null);
        } else {
          const errorMessage =
            response.error || 'Failed to update property status';
          setError(errorMessage);
          console.error('Failed to update property status:', errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error updating property status:', error);
      } finally {
        setIsUpdating(false);
      }
    });
  };

  const handleCardClick = () => {
    // Placeholder for future property detail view
    console.log(`View details for ${currentProperty.name}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Card
      className="group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer active:scale-[0.98]"
      role="article"
      aria-labelledby={`property-${currentProperty.id}-title`}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle
              id={`property-${currentProperty.id}-title`}
              className="text-lg leading-tight text-foreground group-hover:text-primary transition-colors"
            >
              {sanitizeText(currentProperty.name)}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {sanitizeText(currentProperty.address)}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {currentProperty.units} units
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Badge
              className={`${getStatusColor(currentProperty.status)} border`}
              aria-label={`Status: ${currentProperty.status}`}
            >
              {getStatusIcon(currentProperty.status)}
              <span className="ml-1 capitalize">{currentProperty.status}</span>
            </Badge>

            {/* Status update buttons */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                onClick={e => {
                  e.stopPropagation();
                  handleStatusUpdate('complete');
                }}
                disabled={isUpdating || currentProperty.status === 'complete'}
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  '✓'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                onClick={e => {
                  e.stopPropagation();
                  handleStatusUpdate('pending');
                }}
                disabled={isUpdating || currentProperty.status === 'pending'}
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  '⏱'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                onClick={e => {
                  e.stopPropagation();
                  handleStatusUpdate('overdue');
                }}
                disabled={isUpdating || currentProperty.status === 'overdue'}
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  '⚠'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Maintenance Score with Progress Bar */}
        <div className="p-3 rounded-lg border bg-muted/30">
          <ProgressBar
            value={currentProperty.maintenanceScore || 0}
            size="md"
            className="w-full"
          />
        </div>

        {/* Task Summary */}
        <div
          className="grid grid-cols-3 gap-2"
          role="group"
          aria-label="Task breakdown"
        >
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-center border border-emerald-200/50 dark:border-emerald-800/30">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-lg">
              {currentProperty.tasks.completed}
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-center border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="font-semibold text-amber-600 dark:text-amber-400 text-lg">
              {currentProperty.tasks.pending}
            </p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg text-center border border-red-200/50 dark:border-red-800/30">
            <p className="text-xs text-muted-foreground">Overdue</p>
            <p className="font-semibold text-red-600 dark:text-red-400 text-lg">
              {currentProperty.tasks.overdue}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="h-4 w-4 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                Update Failed
              </p>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {sanitizeText(error)}
            </p>
          </div>
        )}

        {/* Issues */}
        {currentProperty.issues && currentProperty.issues.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Current Issues:
            </p>
            <div className="space-y-1">
              {currentProperty.issues?.map((issue: string, index: number) => (
                <div
                  key={index}
                  className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-md border border-red-200/50 dark:border-red-800/30"
                >
                  {sanitizeText(issue)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inspection Dates */}
        <div className="pt-2 border-t border-border/50 space-y-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-2" aria-hidden="true" />
            <span>Last: {sanitizeText(currentProperty.lastInspection || '')}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-2" aria-hidden="true" />
            <span>Next: {sanitizeText(currentProperty.nextInspection || '')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
