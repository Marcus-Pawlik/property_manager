'use server';

import { Property, PropertySummary, PropertyStatus, ApiResponse } from '@/types/property';
import { calculatePropertyStatus, calculateMaintenanceScore } from '@/lib/property-helpers';

// Mock data - in a real app, this would come from a database
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
    console.log('[Server Action] getProperties: Fetching all properties');
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Calculate dynamic status based on maintenance score and tasks
    const propertiesWithCalculatedStatus = mockProperties.map(property => ({
      ...property,
      status: calculatePropertyStatus(property),
      maintenanceScore: calculateMaintenanceScore(property)
    }));
    
    console.log(`[Server Action] getProperties: Returning ${propertiesWithCalculatedStatus.length} properties`);
    
    return {
      data: propertiesWithCalculatedStatus,
      success: true
    };
  } catch (error) {
    console.error('[Server Action] getProperties error:', error);
    return {
      data: [],
      success: false,
      error: 'Failed to fetch properties'
    };
  }
}

/**
 * Get a single property by ID
 */
export async function getPropertyById(id: string): Promise<ApiResponse<Property | null>> {
  try {
    console.log(`[Server Action] getPropertyById: Fetching property ${id}`);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const property = mockProperties.find(p => p.id === id);
    
    if (!property) {
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
    
    console.log(`[Server Action] getPropertyById: Found property ${property.name}`);
    
    return {
      data: propertyWithCalculatedData,
      success: true
    };
  } catch (error) {
    console.error(`[Server Action] getPropertyById error for ${id}:`, error);
    return {
      data: null,
      success: false,
      error: 'Failed to fetch property'
    };
  }
}

/**
 * Update property status
 */
export async function updatePropertyStatus(id: string, status: PropertyStatus): Promise<ApiResponse<Property | null>> {
  try {
    console.log(`[Server Action] updatePropertyStatus: Updating ${id} to ${status}`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const propertyIndex = mockProperties.findIndex(p => p.id === id);
    
    if (propertyIndex === -1) {
      return {
        data: null,
        success: false,
        error: 'Property not found'
      };
    }
    
    // Update the property status
    mockProperties[propertyIndex].status = status;
    
    const updatedProperty = {
      ...mockProperties[propertyIndex],
      maintenanceScore: calculateMaintenanceScore(mockProperties[propertyIndex])
    };
    
    console.log(`[Server Action] updatePropertyStatus: Updated ${updatedProperty.name} to ${status}`);
    
    return {
      data: updatedProperty,
      success: true
    };
  } catch (error) {
    console.error(`[Server Action] updatePropertyStatus error for ${id}:`, error);
    return {
      data: null,
      success: false,
      error: 'Failed to update property status'
    };
  }
}

/**
 * Get portfolio summary statistics
 */
export async function getPropertySummary(): Promise<ApiResponse<PropertySummary>> {
  try {
    console.log('[Server Action] getPropertySummary: Calculating portfolio summary');
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const properties = await getProperties();
    
    if (!properties.success) {
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
    
    console.log(`[Server Action] getPropertySummary: ${summary.totalProperties} properties, ${summary.taskCompletionRate}% completion rate`);
    
    return {
      data: summary,
      success: true
    };
  } catch (error) {
    console.error('[Server Action] getPropertySummary error:', error);
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
