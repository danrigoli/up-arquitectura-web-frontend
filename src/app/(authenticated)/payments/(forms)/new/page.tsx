import * as React from "react"
import loadServerSideCookies from '@/lib/loadServerSideCookies'
import { NewPaymentClient } from './components/client'
import categoryService from '@/services/categories.service'
import companyService from '@/services/companies.service'

export default async function NewPayment() {
  loadServerSideCookies();
  const { data: categories } = await categoryService.getCategories()
  const { data: companies } = await companyService.getCompanies()


  return (
    <NewPaymentClient categories={categories ?? []} companies={companies ?? []} />
  )
}