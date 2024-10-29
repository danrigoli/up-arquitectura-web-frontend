import * as React from "react"
import loadServerSideCookies from '@/lib/loadServerSideCookies'
import { IdParameters } from '@/types/parameters/id-parameters'
import { EditCompanyClient } from './components/client'
import { notFound } from 'next/navigation'
import companyService from '@/services/companies.service'

export default async function EditCompany({ params: { id } }:  Readonly<IdParameters>) {
  loadServerSideCookies();
  const { data: company } = await companyService.getCompany(Number(id))

  if (!company) {
    return notFound()
  }

  return (
    <EditCompanyClient company={company} />
  )
}