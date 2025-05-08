import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'

export const columns: ColumnDef<Transaction>[] = [

  {
    accessorKey: 'accountNumber',
    header: () => h('div', { class: 'text-right text-white' }, 'AccountNumber'),
    cell: ({ row }) => {
      const accountNumber = row.getValue('accountNumber')
      return h('div', { class: 'text-right font-medium text-white' }, String(accountNumber))
    }
  },


  {
    accessorKey: 'date',
    header: () => h('div', { class: 'text-right text-white'}, 'Date'),
    cell: ({ row }) => {
      const rawDate = row.getValue('date')
      const parsedDate = Date.parse(String(rawDate))
      const formattedDate = isNaN(parsedDate)
        ? ''
        : new Date(parsedDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })

      return h('div', { class: 'text-right font-medium text-white' }, formattedDate)
    },
  },

  {
    accessorKey: 'type',
    header: () => h('div', { class: 'text-right text-white' }, 'Type'),
    cell: ({ row }) => {
      const type = row.getValue('type')
      return h('div', { class: 'text-right font-medium text-white' }, String(type))
    }
  },





  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right text-white' }, 'Amount'),
    cell: ({ row }) => {
      const rawAmount = row.getValue('amount')
      const amount = Number.parseFloat(String(rawAmount))
      const formatted = isNaN(amount)
        ? ''
        : new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(amount) + ' MMK'

      return h('div', { class: 'text-right font-medium text-green-400 font-semibold ' }, formatted)
    }
  }


]
