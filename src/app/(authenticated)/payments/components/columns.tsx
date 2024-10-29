import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Payment } from '@/types/payment'
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-sm font-medium text-primary-600 px-4">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },    
    cell: ({ row }) => <div className='px-4'>{row.original.company.name}</div>
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },    
    cell: ({ row }) => (
      <Badge variant='default' className='capitalize hover:bg-primary mx-4'>
        {row.original.category.name}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },
    cell: ({ row }) => <div className='px-4'>{row.original.description}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="font-medium px-4">{formatted}</div>
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className='text-right'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <div className='ml-2 h-4 w-4'>
              {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
              {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
            </div>
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))

      return (
        <div className="text-sm text-muted-foreground text-right px-4">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
]