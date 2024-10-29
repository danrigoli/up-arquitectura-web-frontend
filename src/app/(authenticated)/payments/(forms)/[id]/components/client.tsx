"use client"
import { Category } from '@/types/category'
import { Company } from '@/types/company'
import { Payment, UpdatePayment } from '@/types/payment'
import { EditPaymentForm } from './form'
import paymentService from '@/services/payments.service'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditPaymentProps {
  payment: Payment
  categories: Category[]
  companies: Company[]
}

export function EditPaymentClient({ payment, categories, companies }: Readonly<EditPaymentProps>) {

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (updatedPayment: UpdatePayment) => {
    setLoading(true)
    const { data } = await paymentService.updatePayment(payment.id, updatedPayment)
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
    <EditPaymentForm 
      payment={payment}
      categories={categories}
      companies={companies}
      onSave={onSubmit}
      loading={loading}
    />
  )
}