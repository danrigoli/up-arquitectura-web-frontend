import * as React from "react"
import loadServerSideCookies, { getUserFromCookies } from '@/lib/loadServerSideCookies'
import paymentService from '@/services/payments.service'
import Charts from './components/charts'

export default async function Dashboard() {

  loadServerSideCookies();

  const user = getUserFromCookies();
  const { data: payments } = await paymentService.getPayments({ limit: 999, offset: 0 });


  return (
    <div className='flex flex-col w-full gap-10'>
      <h1 className="text-2xl font-semibold text-primary-800">
        Hola, {user?.firstName ?? 'Usuario'}!
      </h1>
      <Charts payments={payments ?? []} />
    </div>
  )
}