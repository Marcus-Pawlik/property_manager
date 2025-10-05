"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, CheckCircle, AlertCircle, Clock, ArrowLeft, TrendingUp, Users, AlertTriangle } from "lucide-react";
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
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30";
    case "overdue":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30";
    default:
      return "bg-muted text-muted-foreground border-border";
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
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 80) return "text-amber-600 dark:text-amber-400";
  if (score >= 70) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}


export default function DashboardPage() {
  const totalProperties = sampleProperties.length;
  const completeProperties = sampleProperties.filter(p => p.status === "complete").length;
  const pendingProperties = sampleProperties.filter(p => p.status === "pending").length;
  const overdueProperties = sampleProperties.filter(p => p.status === "overdue").length;
  
  // Calculate total tasks for portfolio overview
  const totalTasks = sampleProperties.reduce((sum, p) => 
    sum + p.tasks.completed + p.tasks.pending + p.tasks.overdue, 0
  );
  const completedTasks = sampleProperties.reduce((sum, p) => sum + p.tasks.completed, 0);
  const pendingTasks = sampleProperties.reduce((sum, p) => sum + p.tasks.pending + p.tasks.overdue, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="transition-colors hover:bg-accent">
                  <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Property Dashboard</h1>
                <p className="text-sm text-muted-foreground">Monitor maintenance across your portfolio</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              <Building2 className="h-3 w-3 mr-1" aria-hidden="true" />
              {totalProperties} Properties
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <section aria-label="Portfolio Summary" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Complete</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completeProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-bold text-primary">
                    {sampleProperties.reduce((sum, p) => sum + p.units, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Task Completion</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round((completedTasks / totalTasks) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Properties Grid */}
        <section aria-label="Property Portfolio" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProperties.map((property) => (
            <Card 
              key={property.id} 
              className="group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer active:scale-[0.98]"
              role="article"
              aria-labelledby={`property-${property.id}-title`}
              tabIndex={0}
              onClick={() => {
                // Placeholder for future property detail view
                console.log(`View details for ${property.name}`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  console.log(`View details for ${property.name}`);
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle 
                      id={`property-${property.id}-title`}
                      className="text-lg leading-tight text-foreground group-hover:text-primary transition-colors"
                    >
                      {property.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{property.address}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{property.units} units</p>
                  </div>
                  <Badge 
                    className={`${getStatusColor(property.status)} border shrink-0`}
                    aria-label={`Status: ${property.status}`}
                  >
                    {getStatusIcon(property.status)}
                    <span className="ml-1 capitalize">{property.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                {/* Maintenance Score */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">Maintenance Score</span>
                  </div>
                  <span className={`font-bold text-lg ${getScoreColor(property.maintenanceScore)}`}>
                    {property.maintenanceScore}%
                  </span>
                </div>

                {/* Task Summary */}
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Task breakdown">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-center border border-emerald-200/50 dark:border-emerald-800/30">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-lg">{property.tasks.completed}</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-center border border-amber-200/50 dark:border-amber-800/30">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400 text-lg">{property.tasks.pending}</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg text-center border border-red-200/50 dark:border-red-800/30">
                    <p className="text-xs text-muted-foreground">Overdue</p>
                    <p className="font-semibold text-red-600 dark:text-red-400 text-lg">{property.tasks.overdue}</p>
                  </div>
                </div>

                {/* Issues */}
                {property.issues.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      Current Issues:
                    </p>
                    <div className="space-y-1">
                      {property.issues.map((issue, index) => (
                        <div 
                          key={index} 
                          className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-md border border-red-200/50 dark:border-red-800/30"
                        >
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inspection Dates */}
                <div className="pt-2 border-t border-border/50 space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" aria-hidden="true" />
                    <span>Last: {property.lastInspection}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" aria-hidden="true" />
                    <span>Next: {property.nextInspection}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Demo Notice */}
        <aside className="mt-12 text-center" role="complementary" aria-label="Demo information">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Demo Dashboard
              </h3>
              <p className="text-sm text-muted-foreground">
                This is a demonstration of how property managers would monitor maintenance across their portfolio. 
                All data shown is simulated for demonstration purposes.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
