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
import { Company, UpdateCompany } from '@/types/company'
import { useEffect } from 'react'

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  })

type CompanyFormValues = z.infer<typeof formSchema>

interface EditCompanyFormProps {
  company: Company;
  onSave: (company: UpdateCompany) => void;
  loading: boolean;
}

export function EditCompanyForm({ company, onSave, loading }: Readonly<EditCompanyFormProps>) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: company.id,
      name: company.name,
  },
    reValidateMode: "onChange",
    mode: "onBlur",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    onSave(values)
  }

  useEffect(() => {
    form.reset({
      id: company.id,
      name: company.name,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company])

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
                Enter the company name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormDescription>
                Enter the company address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoaderCircle className='w-5 h-5 animate-spin' /> : "Update Company"}
        </Button>
      </form>
    </Form>
  )
}