"use client"
import { CreateCompany } from '@/types/company'
import { NewCompanyForm } from './components/form'
import companyService from '@/services/companies.service'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCompanyClient() {

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (createdCompany: CreateCompany) => {
    setLoading(true)
    const { data } = await companyService.createCompany(createdCompany)
    setLoading(false)
  
    if (!data) {
      toast({
        title: 'Error al crear la compañía',
        description: 'Ocurrió un error al crear la compañía, por favor intenta de nuevo',
        variant: "destructive",
      })
    } else {
      router.back()
      toast({
        title: 'Compañía creada',
        description: `La compañía #${data.id} ha sido creado correctamente`,
      })
    }
  }

  return (
    <NewCompanyForm 
      onSave={onSubmit}
      loading={loading}
    />
  )
}