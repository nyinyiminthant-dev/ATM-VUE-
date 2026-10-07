<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import api from '@/api'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { CreditCard, RefreshCw } from 'lucide-vue-next'
import { defineEmits, defineProps } from 'vue'
import { useLoaderStore } from '@/stores/loaderStore'

const props = defineProps<{
  title?: string
  icon?: any
  iconColor?: string
}>()

const emit = defineEmits(['done'])

const balance = ref<number | null>(null)
const isLoading = ref(false)
const router = useRouter()
const { loadingOn, loadingOff } = useLoaderStore()

const accountNumber = localStorage.getItem('accountNumber')

if (!accountNumber) {
  toast.error('No account number found')
  router.push('/login')
  throw new Error('No account number')
}

const { data, refetch, isError } = api.atm.checkBalance.useQuery(accountNumber)

onMounted(async () => {
  try {
    isLoading.value = true
    loadingOn()
    await refetch()
    if (isError.value || data.value === undefined) {
      toast.error('Failed to fetch balance')
    } else {
      balance.value = Number(data.value)
    }
  } catch (error) {
    toast.error('Failed to fetch balance')
    console.error(error)
  } finally {
    isLoading.value = false
    loadingOff()
  }
})

const handleRefresh = async () => {
  try {
    isLoading.value = true
    loadingOn()
    await refetch()
    if (isError.value || data.value === undefined) {
      toast.error('Failed to fetch balance')
    } else {
      balance.value = Number(data.value)
      toast.success('Balance updated')
    }
  } catch (error) {
    toast.error('Failed to fetch balance')
    console.error(error)
  } finally {
    isLoading.value = false
    loadingOff()
  }
}
</script>

<template>
  <div class="text-center py-8">
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-4">
        <CreditCard class="h-10 w-10" aria-hidden="true" />
      </div>
      <p v-if="balance !== null" class="text-4xl font-bold text-foreground tabular-nums">
        {{ balance.toLocaleString() }} MMK
      </p>
      <p v-else class="text-red-500">Unable to fetch balance.</p>
    </div>
    <Button variant="outline" size="sm" @click="handleRefresh" class="w-full sm:w-auto" :disabled="balance === null || isLoading">
      <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isLoading }" aria-hidden="true" />
      {{ isLoading ? 'Refreshing...' : 'Refresh Balance' }}
    </Button>
  </div>
</template>