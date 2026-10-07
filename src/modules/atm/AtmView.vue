<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  BaseModal,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Withdraw,
  Deposit,
  Transfer,
  MiniStatement,
  ChangePin,
  BalanceInquiry,
} from './chunks'
import { CreditCard, Wallet, ArrowLeftRight, List, Key, LogOut, ChevronLeft, DollarSign } from 'lucide-vue-next'
import { checkBalance } from '@/api/atm'

const router = useRouter()
const queryClient = useQueryClient()

const components = {
  Withdraw,
  Deposit,
  Transfer,
  MiniStatement,
  ChangePin,
  BalanceInquiry,
} as const

type ComponentKey = keyof typeof components

const activeDialog = ref<ComponentKey | null>(null)
const isDialogOpen = ref(false)
const responseMessage = ref('')
const showExitDialog = ref(false)

const balance = ref(localStorage.getItem('balance') || '0')
const accountNumber = computed(() => localStorage.getItem('accountNumber') || '')

const refreshBalance = async () => {
  if (!accountNumber.value) return
  try {
    // Invalidate and refetch
    await queryClient.invalidateQueries({ queryKey: ['ATM', 'CheckBalance', accountNumber.value] })
    await queryClient.refetchQueries({ queryKey: ['ATM', 'CheckBalance', accountNumber.value] })
    
    // Use fetchQuery to get fresh data directly
    const freshData = await queryClient.fetchQuery({
      queryKey: ['ATM', 'CheckBalance', accountNumber.value],
      queryFn: async () => {
        const axios = (await import('axios')).default
        const response = await axios.get(`ATM/CheckBalance?accountNumber=${accountNumber.value}`)
        return response.data.data.amount
      }
    })
    
    if (freshData !== undefined && freshData !== null) {
      const balanceNum = Number(freshData)
      if (!isNaN(balanceNum)) {
        balance.value = balanceNum.toString()
        localStorage.setItem('balance', balanceNum.toString())
      }
    }
  } catch (error) {
    console.error('Failed to refresh balance:', error)
  }
}

const openDialog = (key: ComponentKey) => {
  activeDialog.value = key
  isDialogOpen.value = true
}

const closeDialog = async () => {
  console.log('closeDialog called, refreshing balance...')
  isDialogOpen.value = false
  setTimeout(() => {
    activeDialog.value = null
  }, 200)
  // Refresh balance after any transaction dialog closes
  await refreshBalance()
  console.log('Balance refreshed:', balance.value)
}

const setResponse = (msg: string) => {
  responseMessage.value = msg
}

const cancelExit = () => {
  showExitDialog.value = false
}

const confirmExit = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('accountNumber')
  localStorage.removeItem('balance')
  responseMessage.value = 'You have exited the dashboard.'
  showExitDialog.value = false
  router.push('/')
}

const handleConfirmExit = () => {
  confirmExit()
}

const atmActions = [
  { key: 'Withdraw' as ComponentKey, icon: Wallet, label: 'Withdraw Cash', description: 'Withdraw money from your account', color: 'primary', iconColor: 'text-primary' },
  { key: 'Deposit' as ComponentKey, icon: DollarSign, label: 'Deposit Cash', description: 'Deposit money into your account', color: 'success', iconColor: 'text-success' },
  { key: 'Transfer' as ComponentKey, icon: ArrowLeftRight, label: 'Transfer Funds', description: 'Send money to another account', color: 'warning', iconColor: 'text-warning' },
  { key: 'BalanceInquiry' as ComponentKey, icon: CreditCard, label: 'Check Balance', description: 'View your current balance', color: 'default', iconColor: 'text-primary' },
  { key: 'MiniStatement' as ComponentKey, icon: List, label: 'Mini Statement', description: 'View recent transactions', color: 'default', iconColor: 'text-primary' },
  { key: 'ChangePin' as ComponentKey, icon: Key, label: 'Change PIN', description: 'Update your security PIN', color: 'destructive', iconColor: 'text-destructive' },
] as const

const getActionTitle = (key: ComponentKey) => {
  const action = atmActions.find(a => a.key === key)
  return action?.label || key
}

const getActionIcon = (key: ComponentKey) => {
  const action = atmActions.find(a => a.key === key)
  return action?.icon
}

const getActionIconColor = (key: ComponentKey) => {
  const action = atmActions.find(a => a.key === key)
  return action?.iconColor || 'text-primary'
}

// Initial balance fetch on mount
onMounted(() => {
  refreshBalance()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
    <!-- Header -->
    <header class="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-3">
            <Button variant="ghost" size="icon" @click="$router.push('/')" class="md:hidden">
              <ChevronLeft class="h-5 w-5" aria-hidden="true" />
            </Button>
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CreditCard class="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 class="font-bold text-xl! text-foreground">ATM Services</h1>
              <p class="text-xs text-muted-foreground">Account ending in {{ accountNumber.slice(-4) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Balance Display -->
            <div class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50">
              <Wallet class="h-4 w-4 text-success" aria-hidden="true" />
              <span class="font-mono font-semibold text-foreground">
                {{ Number(balance).toLocaleString() }} MMK
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="outline" size="sm" class="bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20">
                  <LogOut class="mr-2 h-4 w-4" aria-hidden="true" />
                  Exit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Exit ATM</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to exit the ATM? You will be logged out and redirected to the home page.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel @click="cancelExit">Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" @click="handleConfirmExit">Exit</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8 animate-in">
        <Card variant="gradient" padding="lg">
          <CardContent class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-foreground">Welcome back!</h2>
              <p class="text-muted-foreground mt-1">Select an action to continue</p>
            </div>
            <div class="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary">
              <CreditCard class="h-5 w-5" aria-hidden="true" />
              <span class="font-mono text-sm">**** **** **** {{ accountNumber.slice(-4) }}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Action Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card
          v-for="action in atmActions"
          :key="action.key"
          variant="outlined"
          padding="lg"
          class="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:bg-primary/5"
          @click="openDialog(action.key)"
          role="button"
          tabindex="0"
          @keydown.enter="openDialog(action.key)"
          @keydown.space.prevent="openDialog(action.key)"
        >
          <CardContent class="flex flex-col items-center text-center h-full">
            <div class="group-hover:scale-110 transition-transform duration-300 mb-4">
              <div :class="[
                'flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300',
                action.color === 'primary' && 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
                action.color === 'success' && 'bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground',
                action.color === 'warning' && 'bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground',
                action.color === 'default' && 'bg-muted text-muted-foreground group-hover:bg-muted/80',
                action.color === 'destructive' && 'bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground',
              ]">
                <component :is="action.icon" class="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <h3 class="font-semibold text-foreground mb-1">{{ action.label }}</h3>
            <p class="text-sm text-muted-foreground">{{ action.description }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Response Message -->
      <Alert v-if="responseMessage" variant="default" class="mb-6 animate-in">
        <AlertDescription class="text-sm">
          <pre class="whitespace-pre-wrap font-mono text-xs">{{ responseMessage }}</pre>
        </AlertDescription>
      </Alert>

      <!-- Dialog Modals - Centered Popup -->
      <Dialog v-model:open="isDialogOpen" v-if="activeDialog">
        <BaseModal
          :title="getActionTitle(activeDialog)"
          :icon="getActionIcon(activeDialog)"
          :icon-color="getActionIconColor(activeDialog)"
          class="max-w-lg sm:max-w-2xl"
        >
          <component
            :is="components[activeDialog]"
            @done="closeDialog"
            @respond="setResponse"
          />
        </BaseModal>
      </Dialog>
    </main>
  </div>
</template>