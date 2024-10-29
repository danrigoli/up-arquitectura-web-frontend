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
import { CreateCompany } from '@/types/company'

const formSchema = z.object({
  name: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
})

type CompanyFormValues = z.infer<typeof formSchema>

interface NewCompanyFormProps {
  onSave: (company: CreateCompany) => void;
  loading: boolean;
}

export function NewCompanyForm({ onSave, loading }: Readonly<NewCompanyFormProps>) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onBlur",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    onSave(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
          name="address"
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
          {loading ? <LoaderCircle className='w-5 h-5 animate-spin' /> : "Create Company"}
        </Button>
      </form>
    </Form>
  )
}