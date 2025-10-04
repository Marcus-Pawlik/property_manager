import { Hero } from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white relative">
      {/* Architectural grid background for entire page */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '10mm 10mm',
          backgroundPosition: '0 0'
        }}
      />
      {/* Hero Section */}
      <Hero
        title="Transform Property Management with Complete Transparency"
        subtitle="Coming Soon"
        description="A revolutionary monitoring system that brings managers, service providers, and tenants together around shared, time-stamped task logs for complete transparency and accountability."
        primaryAction={{
          label: "Get Early Access",
          href: "#signup"
        }}
        secondaryAction={{
          label: "Learn More",
          href: "#solution"
        }}
      />

      {/* Problem & Audience Section */}
      <section id="problem" className="py-20 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              The Challenge
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Property Managers Struggle with Visibility
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-destructive">
                  The Problem
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Property managers of multi-unit residential buildings struggle to monitor recurring caretaker and gardening work because they lack timely, transparent updates and cannot verify tasks are completed as expected.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  Target Audience
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mid-sized property management firms handling 10–50 residential complexes who need better oversight, cost control, and tenant satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Solution Section */}
      <section id="solution" className="py-20 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Our Solution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Shared Transparency, Better Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple monitoring system that brings managers, service providers, and tenants together around a shared, time-stamped task log.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">✓</span>
                </div>
                <h3 className="font-semibold mb-2">Verify Work</h3>
                <p className="text-sm text-muted-foreground">
                  Confirm tasks are completed as expected with time-stamped logs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Control Costs</h3>
                <p className="text-sm text-muted-foreground">
                  Better oversight leads to more efficient resource allocation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2">Deter Fraud</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent logging reduces opportunities for fraudulent claims
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Justify Decisions</h3>
                <p className="text-sm text-muted-foreground">
                  Clear documentation helps explain actions to property owners
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Call to Action Section */}
      <section id="signup" className="py-20 px-4 bg-white relative">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-8 text-center">
              <Badge variant="default" className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">
                🚀 Early Access
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Be the First to Know
              </h2>
              <p className="text-muted-foreground mb-8">
                Get notified when we launch and receive early access to our property management monitoring platform.
              </p>
              
              <form className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1"
                    required
                    aria-label="Email address"
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    <Mail className="size-4" />
                    Get Early Access
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We respect your privacy. No spam, just updates on our launch.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}