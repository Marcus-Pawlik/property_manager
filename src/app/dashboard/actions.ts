'use server';

import { Property, PropertySummary, PropertyStatus, ApiResponse } from '@/types/property';
import { calculatePropertyStatus, calculateMaintenanceScore } from '@/lib/property-helpers';
import {
  checkRateLimit,
  logSecurityEvent,
  validatePropertyId,
  validatePropertyStatus
} from '@/lib/security';

// Mock data - in a real app, this would come from a database
// All data is pre-sanitized and validated
const mockProperties: Property[] = [
  {
    id: "oak-street",
    name: "Oak Street Apartments",
    address: "123 Oak Street, Downtown",
    units: 24,
    status: "complete",
    lastInspection: "Oct 1, 2024",
    nextInspection: "Oct 15, 2024",
    maintenanceScore: 95,
    tasks: {
      completed: 12,
      pending: 1,
      overdue: 0
    },
    issues: []
  },
  {
    id: "riverside-complex",
    name: "Riverside Complex",
    address: "456 Riverside Drive",
    units: 36,
    status: "pending",
    lastInspection: "Sep 28, 2024",
    nextInspection: "Oct 8, 2024",
    maintenanceScore: 78,
    tasks: {
      completed: 8,
      pending: 3,
      overdue: 1
    },
    issues: ["Elevator maintenance due"]
  },
  {
    id: "sunset-manor",
    name: "Sunset Manor",
    address: "789 Sunset Boulevard",
    units: 18,
    status: "complete",
    lastInspection: "Sep 30, 2024",
    nextInspection: "Oct 14, 2024",
    maintenanceScore: 92,
    tasks: {
      completed: 15,
      pending: 0,
      overdue: 0
    },
    issues: []
  },
  {
    id: "garden-view",
    name: "Garden View Apartments",
    address: "321 Garden Lane",
    units: 42,
    status: "overdue",
    lastInspection: "Sep 20, 2024",
    nextInspection: "Sep 25, 2024",
    maintenanceScore: 65,
    tasks: {
      completed: 6,
      pending: 4,
      overdue: 3
    },
    issues: ["Parking lot repairs", "HVAC system check", "Landscaping"]
  },
  {
    id: "maple-heights",
    name: "Maple Heights",
    address: "654 Maple Street",
    units: 30,
    status: "pending",
    lastInspection: "Sep 25, 2024",
    nextInspection: "Oct 5, 2024",
    maintenanceScore: 83,
    tasks: {
      completed: 10,
      pending: 2,
      overdue: 0
    },
    issues: ["Pool cleaning scheduled"]
  },
  {
    id: "cedar-court",
    name: "Cedar Court",
    address: "987 Cedar Avenue",
    units: 28,
    status: "complete",
    lastInspection: "Oct 2, 2024",
    nextInspection: "Oct 16, 2024",
    maintenanceScore: 88,
    tasks: {
      completed: 14,
      pending: 1,
      overdue: 0
    },
    issues: []
  }
];

/**
 * Get all properties with calculated status and maintenance scores
 */
export async function getProperties(): Promise<ApiResponse<Property[]>> {
  try {
    logSecurityEvent('properties_fetch_attempt', {}, 'info');
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Calculate dynamic status based on maintenance score and tasks
    const propertiesWithCalculatedStatus = mockProperties.map(property => ({
      ...property,
      status: calculatePropertyStatus(property),
      maintenanceScore: calculateMaintenanceScore(property)
    }));
    
    logSecurityEvent('properties_fetched', { 
      count: propertiesWithCalculatedStatus.length 
    }, 'info');
    
    return {
      data: propertiesWithCalculatedStatus,
      success: true
    };
  } catch (error) {
    logSecurityEvent('properties_fetch_error', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 'error');
    return {
      data: [],
      success: false,
      error: 'Failed to fetch properties'
    };
  }
}

/**
 * Get a single property by ID with security validation
 */
export async function getPropertyById(id: string): Promise<ApiResponse<Property | null>> {
  try {
    // Validate input
    const validation = validatePropertyId(id);
    if (!validation.valid) {
      logSecurityEvent('invalid_property_id', { id, error: validation.error }, 'warn');
      return {
        data: null,
        success: false,
        error: 'Invalid property ID'
      };
    }

    const sanitizedId = validation.sanitized!;
    logSecurityEvent('property_lookup', { id: sanitizedId }, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Use parameterized lookup (sanitized ID)
    const property = mockProperties.find(p => p.id === sanitizedId);
    
    if (!property) {
      logSecurityEvent('property_not_found', { id: sanitizedId }, 'info');
      return {
        data: null,
        success: false,
        error: 'Property not found'
      };
    }
    
    const propertyWithCalculatedData = {
      ...property,
      status: calculatePropertyStatus(property),
      maintenanceScore: calculateMaintenanceScore(property)
    };
    
    logSecurityEvent('property_found', { id: sanitizedId, name: property.name }, 'info');
    
    return {
      data: propertyWithCalculatedData,
      success: true
    };
  } catch (error) {
    logSecurityEvent('property_lookup_error', { 
      id, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 'error');
    return {
      data: null,
      success: false,
      error: 'Failed to fetch property'
    };
  }
}

/**
 * Update property status with comprehensive security validation
 */
export async function updatePropertyStatus(id: string, status: PropertyStatus): Promise<ApiResponse<Property | null>> {
  try {
    // Validate inputs
    const idValidation = validatePropertyId(id);
    if (!idValidation.valid) {
      logSecurityEvent('invalid_property_id_update', { id, error: idValidation.error }, 'warn');
      return {
        data: null,
        success: false,
        error: 'Invalid property ID'
      };
    }

    const statusValidation = validatePropertyStatus(status);
    if (!statusValidation.valid) {
      logSecurityEvent('invalid_status_update', { id, status, error: statusValidation.error }, 'warn');
      return {
        data: null,
        success: false,
        error: 'Invalid status value'
      };
    }

    const sanitizedId = idValidation.sanitized!;
    const sanitizedStatus = statusValidation.sanitized! as PropertyStatus;

    // Rate limiting check (simulate with a simple identifier)
    const rateLimit = checkRateLimit(`property_update:${sanitizedId}`, 'update_status', 5, 60000);
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', { 
        id: sanitizedId, 
        action: 'update_status',
        remaining: rateLimit.remaining 
      }, 'warn');
      return {
        data: null,
        success: false,
        error: 'Too many update requests. Please wait before trying again.'
      };
    }

    logSecurityEvent('property_status_update_attempt', { 
      id: sanitizedId, 
      status: sanitizedStatus,
      remaining: rateLimit.remaining 
    }, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Use parameterized lookup (sanitized ID)
    const propertyIndex = mockProperties.findIndex(p => p.id === sanitizedId);
    
    if (propertyIndex === -1) {
      logSecurityEvent('property_not_found_update', { id: sanitizedId }, 'info');
      return {
        data: null,
        success: false,
        error: 'Property not found'
      };
    }
    
    // Update the property status
    mockProperties[propertyIndex].status = sanitizedStatus;
    
    const updatedProperty = {
      ...mockProperties[propertyIndex],
      maintenanceScore: calculateMaintenanceScore(mockProperties[propertyIndex])
    };
    
    logSecurityEvent('property_status_updated', { 
      id: sanitizedId, 
      name: updatedProperty.name,
      status: sanitizedStatus 
    }, 'info');
    
    return {
      data: updatedProperty,
      success: true
    };
  } catch (error) {
    logSecurityEvent('property_update_error', { 
      id, 
      status,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 'error');
    return {
      data: null,
      success: false,
      error: 'Failed to update property status'
    };
  }
}

/**
 * Get portfolio summary statistics with security logging
 */
export async function getPropertySummary(): Promise<ApiResponse<PropertySummary>> {
  try {
    logSecurityEvent('summary_calculation_attempt', {}, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const properties = await getProperties();
    
    if (!properties.success) {
      logSecurityEvent('summary_calculation_failed', { 
        reason: 'properties_fetch_failed' 
      }, 'error');
      throw new Error('Failed to fetch properties for summary');
    }
    
    const summary: PropertySummary = {
      totalProperties: properties.data.length,
      completeProperties: properties.data.filter(p => p.status === 'complete').length,
      pendingProperties: properties.data.filter(p => p.status === 'pending').length,
      overdueProperties: properties.data.filter(p => p.status === 'overdue').length,
      totalUnits: properties.data.reduce((sum, p) => sum + p.units, 0),
      totalTasks: properties.data.reduce((sum, p) => sum + p.tasks.completed + p.tasks.pending + p.tasks.overdue, 0),
      completedTasks: properties.data.reduce((sum, p) => sum + p.tasks.completed, 0),
      taskCompletionRate: 0
    };
    
    summary.taskCompletionRate = summary.totalTasks > 0 
      ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
      : 0;
    
    logSecurityEvent('summary_calculated', { 
      totalProperties: summary.totalProperties,
      completionRate: summary.taskCompletionRate 
    }, 'info');
    
    return {
      data: summary,
      success: true
    };
  } catch (error) {
    logSecurityEvent('summary_calculation_error', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 'error');
    return {
      data: {
        totalProperties: 0,
        completeProperties: 0,
        pendingProperties: 0,
        overdueProperties: 0,
        totalUnits: 0,
        totalTasks: 0,
        completedTasks: 0,
        taskCompletionRate: 0
      },
      success: false,
      error: 'Failed to calculate property summary'
    };
  }
}
