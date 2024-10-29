"use client"

import * as React from "react"
import { Payment } from '@/types/payment'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { useToast } from '@/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import paymentService from '@/services/payments.service'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const PAGE_SIZE = 10

interface PaymentsTableProps {
  payments: Payment[];
  total: number;
}

export default function PaymentsTable({ payments, total }: Readonly<PaymentsTableProps>) {
  const [data, setData] = useState<Payment[]>(payments)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(total / PAGE_SIZE)
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })
  const [filterState, setFilterState] = useState({
    description: '',
  })

  const [sortingState, setSortingState] = useState({
    columnId: '',
    direction: 'ASC' as 'ASC' | 'DESC',
  })

  const { toast } = useToast()
  const initialRender = React.useRef(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: updatedPayments } = await paymentService.getPayments({
        offset: paginationState.pageIndex * paginationState.pageSize,
        limit: paginationState.pageSize,
        search: filterState.description,
        sort: sortingState.columnId,
        order: sortingState.direction,
      })
      const { data: count } = await paymentService.getPaymentsCount({
        search: filterState.description,
      })
      setData(updatedPayments ?? [])
      setPageCount((count?.count ?? 0) / PAGE_SIZE)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyId = (id: number) => {
    navigator.clipboard.writeText(id.toString())
    toast({
      title: 'ID copiado',
      description: 'El ID del pago ha sido copiado al portapapeles',
    })
  }


  const actionColumn: ColumnDef<Payment> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='text-right mr-2'>
                <Button variant="ghost" className="h-8 w-8 p-0 text-right">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Acciones
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => copyId(payment.id)}
                className='cursor-pointer'
              >
                Copiar ID de pago
              </DropdownMenuItem>
              <Link href={`/payments/${payment.id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                    Ver detalles
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href={`/payments/${payment.id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                    Editar pago
                </DropdownMenuItem>
              </Link>
              <DialogTrigger className='w-full'>
                <DropdownMenuItem className='cursor-pointer'>
                  Eliminar pago
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Eliminar pago
              </DialogTitle>
              <DialogDescription>
                Esta accion no se puede deshacer, se eliminara el pago permanentemente.
              </DialogDescription>
              <DialogFooter>
                <DialogClose>
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="destructive" onClick={() => handleDelete(row.original.id)}>
                    Delete
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
    },
  }


  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState, filterState, sortingState])

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize })
  }

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterState((prev) => ({ ...prev, [columnId]: value }))
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 })) // Reset to first page when filtering
  }

  const handleSortingChange = (columnId: string, direction: 'ASC' | 'DESC') => {
    setSortingState({ columnId, direction })
  }

  const handleDelete = async (id: number) => {
    try {
      await paymentService.deletePayment(id)
      toast({
        title: 'Pago eliminado',
        description: 'El pago ha sido eliminado correctamente',
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast({
        title: 'Error eliminando pago',
        description: 'Hubo un error eliminando el pago, por favor intenta de nuevo',
        variant: "destructive",
      })
    }
  }


  return (
    <DataTable
      columns={[...columns, actionColumn]}
      data={data}
      pageCount={pageCount}
      isLoading={isLoading}
      filterColumn="description"
      filterPlaceholder="Filtrar pagos..."
      onPaginationChange={handlePaginationChange}
      onFilterChange={handleFilterChange}
      onSortingChange={(sort) => handleSortingChange(sort[0].id, sort[0].desc ? 'DESC' : 'ASC')}
    />
  )
}