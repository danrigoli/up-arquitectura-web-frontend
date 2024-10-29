'use client';
import { Skeleton } from '@/components/ui/skeleton';

function PaymentFormLoading() {
  return (
    <section className="w-full space-y-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </section>
  );
}

export default PaymentFormLoading;
