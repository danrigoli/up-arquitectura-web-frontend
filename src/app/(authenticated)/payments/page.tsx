"use client"

import * as React from "react"
import { Payment } from '@/types/payment'
import PaymentsTable from './components/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Payments() {

  const paymentGenerator = (quantity: number) => {
    const payments: Payment[] = []
    for (let i = 0; i < quantity; i++) {
      payments.push({
        id: `id-${i}`,
        amount: Math.floor(Math.random() * 1000),
        status: ["pending", "processing", "success", "failed"][Math.floor(Math.random() * 4)] as Payment["status"],
        email: `carmella@hotmail.com`,
        createdAt: new Date(),
      })
    }
    return payments
  }

  return (
    <>
    <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-semibold text-primary-800">
        Pagos
      </h1>
      <Link href="/payments/new" className="flex items-center space-x-2">
        <Button variant="default" size="sm" type='button'>
          Generar nuevo pago
        </Button>
      </Link>
    </div>
      <PaymentsTable payments={paymentGenerator(10)} total={100} />
    </>
  )
}