import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Payment } from '@/types/payment'
import { CaretDownIcon, CaretUpIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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
      <div className="text-sm font-medium text-primary-600 ml-2">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },    
    cell: ({ row }) => (
      <Badge variant='default' className='capitalize hover:bg-primary'>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <div className='ml-2 h-4 w-4'>
            {column.getIsSorted() === "asc" && <CaretUpIcon className="w-full" />}
            {column.getIsSorted() === "desc" && <CaretDownIcon className="w-full" />}
          </div>
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
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

      return <div className="font-medium">{formatted}</div>
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
        <div className="text-sm text-muted-foreground text-right">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copiar ID de pago
            </DropdownMenuItem>
            <DropdownMenuItem>
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Editar el pago
            </DropdownMenuItem>
            <DropdownMenuItem>
              Eliminar el pago
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]