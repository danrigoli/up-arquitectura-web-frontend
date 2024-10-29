"use client"
import { Category } from '@/types/category'
import { Company } from '@/types/company'
import { UpdatePayment } from '@/types/payment'
import { NewPaymentForm } from './form'
import paymentService from '@/services/payments.service'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NewPaymentProps {
  categories: Category[]
  companies: Company[]
}

export function NewPaymentClient({ categories, companies }: Readonly<NewPaymentProps>) {

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (createdPayment: UpdatePayment) => {
    setLoading(true)
    const { data } = await paymentService.createPayment(createdPayment)
    setLoading(false)
  
    if (!data) {
      toast({
        title: 'Error al crear el pago',
        description: 'Ocurrió un error al crear el pago, por favor intenta de nuevo',
        variant: "destructive",
      })
    } else {
      router.back()
      toast({
        title: 'Pago creado',
        description: `El pago #${data.id} ha sido creado correctamente`,
      })
    }
  }

  return (
    <NewPaymentForm 
      categories={categories}
      companies={companies}
      onSave={onSubmit}
      loading={loading}
    />
  )
}