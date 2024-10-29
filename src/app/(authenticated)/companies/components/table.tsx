/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import { Company } from '@/types/company'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { useToast } from '@/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import companyService from '@/services/companies.service'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const PAGE_SIZE = 10

interface CompaniesTableProps {
  companies: Company[];
  total: number;
}

export default function CompaniesTable({ companies, total }: Readonly<CompaniesTableProps>) {
  const [data, setData] = useState<Company[]>(companies)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(total / PAGE_SIZE)
  const [sortingState, setSortingState] = useState({
    columnId: '',
    direction: 'ASC' as 'ASC' | 'DESC',
  })
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })
  const [filterState, setFilterState] = useState({
    name: '',
  })
  const { toast } = useToast()
  const initialRenders = React.useRef(0)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: updatedCompanies } = await companyService.getCompanies({
        offset: paginationState.pageIndex * paginationState.pageSize,
        limit: paginationState.pageSize,
        search: filterState.name,
        sort: sortingState.columnId,
        order: sortingState.direction,
      })
      const { data: count } = await companyService.getCompaniesCount({
        search: filterState.name,
      })
      setData(updatedCompanies ?? [])
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
      description: 'El ID de la compañía ha sido copiado al portapapeles',
    })
  }

  const actionColumn: ColumnDef<Company> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const company = row.original
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
                onClick={() => copyId(company.id)}
                className='cursor-pointer'
              >
                Copiar ID de compañía
              </DropdownMenuItem>
              <Link href={`/companies/${company.id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                    Ver detalles
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href={`/companies/${company.id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                    Editar compañía
                </DropdownMenuItem>
              </Link>
              <DialogTrigger className='w-full'>
                <DropdownMenuItem className='cursor-pointer'>
                  Eliminar compañía
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Eliminar compañía
              </DialogTitle>
              <DialogDescription>
                Esta accion no se puede deshacer, se eliminara la compañía permanentemente.
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
    if (initialRenders.current < 2) {
      initialRenders.current += 1
      return
    }
    fetchData()
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
      await companyService.deleteCompany(id)
      toast({
        title: 'Compañía eliminada',
        description: 'La compañía ha sido eliminada correctamente',
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting company:', error)
      toast({
        title: 'Error eliminando compañía',
        description: 'Hubo un error eliminando la compañía, por favor intenta de nuevo',
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
      filterColumn="name"
      filterPlaceholder="Filtrar compañías..."
      onPaginationChange={handlePaginationChange}
      onFilterChange={handleFilterChange}
      onSortingChange={(sort) => handleSortingChange(sort[0].id, sort[0].desc ? 'DESC' : 'ASC')}
    />
  )
}