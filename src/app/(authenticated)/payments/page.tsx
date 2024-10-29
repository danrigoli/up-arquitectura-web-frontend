import * as React from "react"
import PaymentsTable from './components/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import loadServerSideCookies from '@/lib/loadServerSideCookies'
import paymentService from '@/services/payments.service'

export default async function Payments() {

  loadServerSideCookies();
  const { data: payments } = await paymentService.getPayments({
    limit: 10,
    offset: 0,
  });
  const { data: count } = await paymentService.getPaymentsCount()

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
      <PaymentsTable payments={payments ?? []} total={count?.count ?? 0} />
    </>
  )
}