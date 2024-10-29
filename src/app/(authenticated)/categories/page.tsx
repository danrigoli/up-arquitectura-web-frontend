import * as React from "react"
import CategoriesTable from './components/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import loadServerSideCookies from '@/lib/loadServerSideCookies'
import paymentService from '@/services/categories.service'

export default async function Categories() {

  loadServerSideCookies();
  const { data: categories } = await paymentService.getCategories({
    limit: 10,
    offset: 0,
  });
  const { data: count } = await paymentService.getCategoriesCount()

  return (
    <>
    <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-semibold text-primary-800">
        Categorías
      </h1>
      <Link href="/categories/new" className="flex items-center space-x-2">
        <Button variant="default" size="sm" type='button'>
          Generar nueva categoría
        </Button>
      </Link>
    </div>
      <CategoriesTable categories={categories ?? []} total={count?.count ?? 0} />
    </>
  )
}