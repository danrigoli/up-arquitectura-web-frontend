'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function PaymentFormLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  return (
    <section className="w-full space-y-4">
      <Button variant="link" className="text-sm px-0" onClick={() => router.back()}>
        <ArrowLeft className="inline-block mr-2 w-4 h-4" />
        Back to payments
      </Button>
      {children}
    </section>
  );
}

export default PaymentFormLayout;
