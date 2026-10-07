<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  RegisterUser,
  VerifyAccount,
  CreatePin,
  ResendOTP,
} from './chunks'
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
import { UserPlus, UserCheck, Key, RotateCcw, LogOut, Building2, ChevronLeft } from 'lucide-vue-next'

const router = useRouter()

const components = {
  RegisterUser,
  VerifyAccount,
  CreatePin,
  ResendOTP,
} as const

type ComponentKey = keyof typeof components

const activeDialog = ref<ComponentKey | null>(null)
const isDialogOpen = ref(false)
const responseMessage = ref('')
const showExitDialog = ref(false)

const openDialog = (key: ComponentKey) => {
  activeDialog.value = key
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  setTimeout(() => {
    activeDialog.value = null
  }, 200)
}

const setResponse = (msg: string) => {
  responseMessage.value = msg
}

const confirmExit = () => {
  activeDialog.value = null
  responseMessage.value = 'You have exited the dashboard.'
  router.push('/')
  showExitDialog.value = false
}

const cancelExit = () => {
  showExitDialog.value = false
}

const actionCards = [
  { key: 'RegisterUser' as ComponentKey, icon: UserPlus, label: 'Register User', description: 'Create new user accounts', color: 'primary', iconColor: 'text-primary' },
  { key: 'VerifyAccount' as ComponentKey, icon: UserCheck, label: 'Verify Account', description: 'Verify user accounts with OTP', color: 'success', iconColor: 'text-success' },
  { key: 'CreatePin' as ComponentKey, icon: Key, label: 'Create PIN', description: 'Generate new PIN for users', color: 'warning', iconColor: 'text-warning' },
  { key: 'ResendOTP' as ComponentKey, icon: RotateCcw, label: 'Resend OTP', description: 'Resend verification codes', color: 'default', iconColor: 'text-primary' },
] as const

const getActionTitle = (key: ComponentKey) => {
  const action = actionCards.find(a => a.key === key)
  return action?.label || key
}

const getActionIcon = (key: ComponentKey) => {
  const action = actionCards.find(a => a.key === key)
  return action?.icon
}

const getActionIconColor = (key: ComponentKey) => {
  const action = actionCards.find(a => a.key === key)
  return action?.iconColor || 'text-primary'
}
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
              <Building2 class="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 class="font-bold text-xl! text-foreground">Nyi Bank Dashboard</h1>
              <p class="text-xs text-muted-foreground">Bank Operations</p>
            </div>
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
                <AlertDialogTitle>Exit Dashboard</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to exit the bank dashboard? You will be redirected to the home page.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel @click="cancelExit">Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" @click="confirmExit">Exit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8 animate-in">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-3xl font-bold text-foreground">Welcome to Bank Operations</h2>
            <p class="text-muted-foreground mt-1">Manage user accounts and banking operations</p>
          </div>
          <div class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 text-sm text-muted-foreground">
            <Building2 class="h-4 w-4" aria-hidden="true" />
            <span>Bank Mode Active</span>
          </div>
        </div>
      </div>

      <!-- Action Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          v-for="action in actionCards"
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