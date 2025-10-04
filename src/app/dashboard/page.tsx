"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Sample property data
const sampleProperties = [
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

function getStatusColor(status: string) {
  switch (status) {
    case "complete":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "complete":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-yellow-600";
  if (score >= 70) return "text-orange-600";
  return "text-red-600";
}

export default function DashboardPage() {
  const totalProperties = sampleProperties.length;
  const completeProperties = sampleProperties.filter(p => p.status === "complete").length;
  const pendingProperties = sampleProperties.filter(p => p.status === "pending").length;
  const overdueProperties = sampleProperties.filter(p => p.status === "overdue").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Property Dashboard</h1>
                <p className="text-sm text-gray-500">Monitor maintenance across your portfolio</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Building2 className="h-3 w-3 mr-1" />
              {totalProperties} Properties
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Complete</p>
                  <p className="text-2xl font-bold text-green-600">{completeProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{overdueProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Units</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {sampleProperties.reduce((sum, p) => sum + p.units, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                    <p className="text-xs text-gray-400 mt-1">{property.units} units</p>
                  </div>
                  <Badge className={`${getStatusColor(property.status)} border`}>
                    {getStatusIcon(property.status)}
                    <span className="ml-1 capitalize">{property.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Maintenance Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Maintenance Score</span>
                    <span className={`font-bold ${getScoreColor(property.maintenanceScore)}`}>
                      {property.maintenanceScore}%
                    </span>
                  </div>

                  {/* Task Summary */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="font-semibold text-green-600">{property.tasks.completed}</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <p className="text-xs text-gray-500">Pending</p>
                      <p className="font-semibold text-yellow-600">{property.tasks.pending}</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <p className="text-xs text-gray-500">Overdue</p>
                      <p className="font-semibold text-red-600">{property.tasks.overdue}</p>
                    </div>
                  </div>

                  {/* Issues */}
                  {property.issues.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Current Issues:</p>
                      <div className="space-y-1">
                        {property.issues.map((issue, index) => (
                          <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            {issue}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Last Inspection */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Last inspection: {property.lastInspection}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Notice */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Demo Dashboard</h3>
              <p className="text-sm text-blue-700">
                This is a demonstration of how property managers would monitor maintenance across their portfolio. 
                All data shown is simulated for demonstration purposes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
