import * as React from "react"
import loadServerSideCookies from '@/lib/loadServerSideCookies'
import paymentService from '@/services/payments.service'
import { IdParameters } from '@/types/parameters/id-parameters'
import { EditPaymentClient } from './components/client'
import { notFound } from 'next/navigation'
import categoryService from '@/services/categories.service'
import companyService from '@/services/companies.service'

export default async function EditPayment({ params: { id } }:  Readonly<IdParameters>) {
  loadServerSideCookies();
  const { data: payment } = await paymentService.getPayment(Number(id))
  const { data: categories } = await categoryService.getCategories()
  const { data: companies } = await companyService.getCompanies()

  if (!payment) {
    return notFound()
  }

  return (
    <EditPaymentClient payment={payment} categories={categories ?? []} companies={companies ?? []} />
  )
}