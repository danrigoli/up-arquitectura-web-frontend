"use client"
import { Company, UpdateCompany } from '@/types/company'
import { EditCompanyForm } from './form'
import companyService from '@/services/companies.service'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditCompanyProps {
  company: Company
}

export function EditCompanyClient({ company }: Readonly<EditCompanyProps>) {

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (updatedCompany: UpdateCompany) => {
    setLoading(true)
    const { data } = await companyService.updateCompany(company.id, updatedCompany)
    setLoading(false)
  
    if (!data) {
      toast({
        title: 'Error al actualizar el pago',
        description: 'Ocurrió un error al actualizar el pago, por favor intenta de nuevo',
        variant: "destructive",
      })
    } else {
      router.back()
      toast({
        title: 'Pago actualizado',
        description: `El pago #${data.id} ha sido actualizado correctamente`,
      })
    }
  }

  return (
    <EditCompanyForm 
      company={company}
      onSave={onSubmit}
      loading={loading}
    />
  )
}