<script setup lang="ts">
import { toast } from 'vue-sonner'
import AtmTable from '../../../components/ui/data-table/AtmTable.vue'
import { columns } from '../../../components/ui/data-table/Columns'
import api from '@/api'
import { List } from 'lucide-vue-next'
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  title?: string
  icon?: any
  iconColor?: string
}>()

defineEmits(['done'])

const accountNumber = localStorage.getItem('accountNumber')

if (!accountNumber) {
  toast.error('No Account Number Found')
  throw new Error('No account number')
}

const { data: datas } = api.atm.history.useQuery(accountNumber)
</script>

<template>
  <AtmTable :columns="columns" :data="datas ?? []" />
</template>