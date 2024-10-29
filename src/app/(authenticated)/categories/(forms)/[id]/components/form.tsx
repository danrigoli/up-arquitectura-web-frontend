"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Category, UpdateCategory } from '@/types/category'
import { useEffect } from 'react'

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(255),
  })

type CategoryFormValues = z.infer<typeof formSchema>

interface EditCategoryFormProps {
  category: Category;
  onSave: (category: UpdateCategory) => void;
  loading: boolean;
}

export function EditCategoryForm({ category, onSave, loading }: Readonly<EditCategoryFormProps>) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: category.id,
      name: category.name,
  },
    reValidateMode: "onChange",
    mode: "onBlur",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    onSave(values)
  }

  useEffect(() => {
    form.reset({
      id: category.id,
      name: category.name,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormDescription>
                Enter the category name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoaderCircle className='w-5 h-5 animate-spin' /> : "Update Category"}
        </Button>
      </form>
    </Form>
  )
}