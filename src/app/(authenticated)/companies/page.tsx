import * as React from "react"
import CompaniesTable from './components/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import loadServerSideCookies from '@/lib/loadServerSideCookies'
import paymentService from '@/services/companies.service'

export default async function Companies() {

  loadServerSideCookies();
  const { data: companies } = await paymentService.getCompanies({
    limit: 10,
    offset: 0,
  });
  const { data: count } = await paymentService.getCompaniesCount()

  return (
    <>
    <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-semibold text-primary-800">
        Compañías
      </h1>
      <Link href="/companies/new" className="flex items-center space-x-2">
        <Button variant="default" size="sm" type='button'>
          Generar nueva compañía
        </Button>
      </Link>
    </div>
      <CompaniesTable companies={companies ?? []} total={count?.count ?? 0} />
    </>
  )
}