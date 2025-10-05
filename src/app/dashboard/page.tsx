import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, Clock, ArrowLeft, TrendingUp, Users, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary, DefaultErrorFallback } from "@/components/error-boundary";
import { getProperties, getPropertySummary } from "./actions";

// Client component for interactive property cards
import { PropertyCard } from "./property-card";

// Server component for summary statistics
async function SummaryCards() {
  const summaryResponse = await getPropertySummary();
  
  if (!summaryResponse.success) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">Failed to load summary data</p>
        </CardContent>
      </Card>
    );
  }
  
  const summary = summaryResponse.data;
  
  return (
    <section aria-label="Portfolio Summary" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Complete</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{summary.completeProperties}</p>
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
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{summary.pendingProperties}</p>
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
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.overdueProperties}</p>
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
              <p className="text-2xl font-bold text-primary">{summary.totalUnits}</p>
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
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.taskCompletionRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// Loading component for summary cards
function SummaryCardsLoading() {
  return (
    <section aria-label="Portfolio Summary" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-muted rounded-xl">
                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Loading...</p>
                <p className="text-2xl font-bold text-muted-foreground">--</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

// Server component for properties grid
async function PropertiesGrid() {
  const propertiesResponse = await getProperties();
  
  if (!propertiesResponse.success) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">Failed to load properties</p>
          <p className="text-xs text-muted-foreground mt-1">{propertiesResponse.error}</p>
        </CardContent>
      </Card>
    );
  }
  
  const properties = propertiesResponse.data;
  
  return (
    <section aria-label="Property Portfolio" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <ErrorBoundary key={property.id} fallback={DefaultErrorFallback}>
          <PropertyCard property={property} />
        </ErrorBoundary>
      ))}
    </section>
  );
}

// Loading component for properties grid
function PropertiesGridLoading() {
  return (
    <section aria-label="Property Portfolio" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="h-12 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
            <div className="h-8 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

// Main dashboard page component
export default function DashboardPage() {
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
              <Suspense fallback={<span>Loading...</span>}>
                <PropertyCount />
              </Suspense>
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <Suspense fallback={<SummaryCardsLoading />}>
          <SummaryCards />
        </Suspense>

        {/* Properties Grid */}
        <Suspense fallback={<PropertiesGridLoading />}>
          <PropertiesGrid />
        </Suspense>

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

// Component to show property count
async function PropertyCount() {
  const summaryResponse = await getPropertySummary();
  
  if (!summaryResponse.success) {
    return <span>-- Properties</span>;
  }
  
  return <span>{summaryResponse.data.totalProperties} Properties</span>;
}