/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import { Category } from '@/types/category'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { useToast } from '@/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import categoryService from '@/services/categories.service'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getPageCount } from '@/lib/page-count'

const PAGE_SIZE = 10

interface CategoriesTableProps {
  categories: Category[];
  total: number;
}

export default function CategoriesTable({ categories, total }: Readonly<CategoriesTableProps>) {
  const [data, setData] = useState<Category[]>(categories)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(getPageCount(total, PAGE_SIZE))
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
      const { data: updatedCategories } = await categoryService.getCategories({
        offset: paginationState.pageIndex * paginationState.pageSize,
        limit: paginationState.pageSize,
        search: filterState.name,
        sort: sortingState.columnId,
        order: sortingState.direction,
      })
      const { data: count } = await categoryService.getCategoriesCount({
        search: filterState.name,
      })
      setData(updatedCategories ?? [])
      setPageCount(getPageCount(count?.count, PAGE_SIZE))
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
      description: 'El ID de la categoría ha sido copiado al portapapeles',
    })
  }

  const actionColumn: ColumnDef<Category> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original
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
                onClick={() => copyId(category.id)}
                className='cursor-pointer'
              >
                Copiar ID de categoría
              </DropdownMenuItem>
              <Link href={`/categories/${category.id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                    Ver detalles
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href={`/categories/${category.id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                    Editar categoría
                </DropdownMenuItem>
              </Link>
              <DialogTrigger className='w-full'>
                <DropdownMenuItem className='cursor-pointer'>
                  Eliminar categoría
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Eliminar categoría
              </DialogTitle>
              <DialogDescription>
                Esta accion no se puede deshacer, se eliminara la categoría permanentemente.
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
      await categoryService.deleteCategory(id)
      toast({
        title: 'Categoría eliminada',
        description: 'La categoría ha sido eliminada correctamente',
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: 'Error eliminando categoría',
        description: 'Hubo un error eliminando la categoría, por favor intenta de nuevo',
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
      filterPlaceholder="Filtrar categorías..."
      onPaginationChange={handlePaginationChange}
      onFilterChange={handleFilterChange}
      onSortingChange={(sort) => handleSortingChange(sort[0].id, sort[0].desc ? 'DESC' : 'ASC')}
    />
  )
}