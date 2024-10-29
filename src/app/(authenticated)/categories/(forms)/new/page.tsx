"use client"
import { CreateCategory } from '@/types/category'
import { NewCategoryForm } from './components/form'
import categoryService from '@/services/categories.service'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCategoryClient() {

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (createdCategory: CreateCategory) => {
    setLoading(true)
    const { data } = await categoryService.createCategory(createdCategory)
    setLoading(false)
  
    if (!data) {
      toast({
        title: 'Error al crear la categoría',
        description: 'Ocurrió un error al crear la categoría, por favor intenta de nuevo',
        variant: "destructive",
      })
    } else {
      router.back()
      toast({
        title: 'Categoría creada',
        description: `La categoría #${data.id} ha sido creado correctamente`,
      })
    }
  }

  return (
    <NewCategoryForm 
      onSave={onSubmit}
      loading={loading}
    />
  )
}