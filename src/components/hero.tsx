"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function Hero({
  title = "Property Management Made Simple",
  subtitle = "Coming Soon",
  description = "A transparent monitoring system for property managers, service providers, and tenants. Track work, verify tasks, and build trust through shared visibility.",
  primaryAction = {
    label: "Get Notified",
    href: "#notify"
  },
  secondaryAction = {
    label: "Learn More",
    href: "#learn"
  }
}: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Architectural grid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '10mm 10mm',
          backgroundPosition: '0 0'
        }}
      />
      
      {/* Content exclusion zones */}
      <div className="absolute inset-0">
        {/* Hero content exclusion zone */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-white" />
        
        {/* Additional exclusion zones for better readability */}
        <div className="absolute top-0 left-0 w-full h-32 bg-white" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-white" />
        <div className="absolute top-1/2 left-0 w-32 h-96 bg-white transform -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-32 h-96 bg-white transform -translate-y-1/2" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-6">
            {subtitle}
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => {
              const element = document.getElementById('signup');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Mail className="size-4" />
            {primaryAction.label}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => {
              const element = document.getElementById('solution');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {secondaryAction.label}
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
