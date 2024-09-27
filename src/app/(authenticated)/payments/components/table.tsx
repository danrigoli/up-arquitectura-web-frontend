"use client"

import * as React from "react"
import { Payment } from '@/types/payment'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useEffect, useState } from 'react'

// This would typically come from an environment variable
const API_URL = 'https://jsonplaceholder.typicode.com/todos/'

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
    email: '',
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: (paginationState.pageIndex + 1).toString(),
        limit: paginationState.pageSize.toString(),
        email: filterState.email,
      })
      const response = await fetch(`${API_URL}?${queryParams}`)
      const result = await response.json()
      // set fake data
      setData(payments.slice(paginationState.pageIndex * paginationState.pageSize, (paginationState.pageIndex + 1) * paginationState.pageSize))
      setPageCount(10)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState, filterState])

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize })
  }

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterState((prev) => ({ ...prev, [columnId]: value }))
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 })) // Reset to first page when filtering
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      isLoading={isLoading}
      filterColumn="email"
      filterPlaceholder="Filtrar por email..."
      onPaginationChange={handlePaginationChange}
      onFilterChange={handleFilterChange}
    />
  )
}