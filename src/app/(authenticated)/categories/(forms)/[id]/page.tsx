import * as React from "react"
import loadServerSideCookies from '@/lib/loadServerSideCookies'
import { IdParameters } from '@/types/parameters/id-parameters'
import { EditCategoryClient } from './components/client'
import { notFound } from 'next/navigation'
import categoryService from '@/services/categories.service'

export default async function EditCategory({ params: { id } }:  Readonly<IdParameters>) {
  loadServerSideCookies();
  const { data: category } = await categoryService.getCategory(Number(id))

  if (!category) {
    return notFound()
  }

  return (
    <EditCategoryClient category={category} />
  )
}