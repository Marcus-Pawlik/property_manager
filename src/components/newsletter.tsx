'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export function Newsletter({
  title = 'Stay Updated',
  description = 'Get notified when we launch and receive early access to our property management platform.',
  placeholder = 'Enter your email address',
  buttonText = 'Notify Me',
}: NewsletterProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="border-2">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
              <p className="text-muted-foreground mb-6">{description}</p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Input
                  type="email"
                  placeholder={placeholder}
                  className="flex-1"
                />
                <Button className="w-full sm:w-auto">{buttonText}</Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
