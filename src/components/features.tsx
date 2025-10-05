"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          {icon && (
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                {icon}
              </div>
            </div>
          )}
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: Array<{
    icon?: React.ReactNode;
    title: string;
    description: string;
  }>;
}

export function FeaturesSection({
  title = "Key Features",
  subtitle = "Everything you need for transparent property management",
  features = [
    {
      title: "Real-time Monitoring",
      description: "Track caretaker and gardening work with time-stamped logs for complete transparency."
    },
    {
      title: "Multi-stakeholder Access",
      description: "Managers, service providers, and tenants all have visibility into work progress."
    },
    {
      title: "Cost Control",
      description: "Monitor expenses and verify work completion to prevent fraud and optimize budgets."
    },
    {
      title: "Documentation",
      description: "Generate reports and maintain records to justify decisions to property owners."
    }
  ]
}: FeaturesSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}








