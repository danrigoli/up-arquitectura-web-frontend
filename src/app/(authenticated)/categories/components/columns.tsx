import { Button } from '@/components/ui/button'
import { Category } from '@/types/category'
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },
    cell: ({ row }) => <div className='px-4'>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className='px-4'>{date.toDateString()}</div>
      )
    }  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return (
        <div className='px-4'>{date.toDateString()}</div>
      )
    }
  },
]