"use client"
import { Category, UpdateCategory } from '@/types/category'
import { EditCategoryForm } from './form'
import categoryService from '@/services/categories.service'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditCategoryProps {
  category: Category
}

export function EditCategoryClient({ category }: Readonly<EditCategoryProps>) {

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (updatedCategory: UpdateCategory) => {
    setLoading(true)
    const { data } = await categoryService.updateCategory(category.id, updatedCategory)
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
    <EditCategoryForm 
      category={category}
      onSave={onSubmit}
      loading={loading}
    />
  )
}