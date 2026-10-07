<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import api from '@/api'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Field } from 'vee-validate'
import { Loader2, Lock, User, Building2 } from 'lucide-vue-next'
import { useLoaderStore } from '@/stores/loaderStore'

const router = useRouter()
const loginAttempts = ref(0)
const { loadingOn, loadingOff } = useLoaderStore()

const { mutate } = api.login.login.useMutation({
  onMutate: loadingOn,

  onSuccess: (data: { message?: string; data?: { token?: string; accountNumber?: string; balance?: number; passwordStatus?: boolean } }) => {
    console.log('Login response:', data)

    if (!data || data.message === 'Invalid username or password.') {
      toast.error('Invalid username or password.')
      return
    }

    const innerData = data?.data

    if (!innerData) {
      toast.error('No data received from server.')
      return
    }

    if (innerData.passwordStatus === false) {
      loginAttempts.value++
      toast.error(`Incorrect password. Attempt ${loginAttempts.value}/3`)
      if (loginAttempts.value >= 3) {
        toast.error('Too many failed login attempts. Restarting...')
        setTimeout(() => location.reload(), 1500)
      }
      return
    }

    if (innerData.token) {
      localStorage.setItem('token', innerData.token)
      localStorage.setItem('accountNumber', innerData.accountNumber || '')
      localStorage.setItem('balance', (innerData.balance ?? 0).toString())

      console.log('Saved to LocalStorage:', {
        token: localStorage.getItem('token'),
        accountNumber: localStorage.getItem('accountNumber')
      })

      toast.success('Login successful!')
      router.push('/atm')
    } else {
      toast.error('Token is missing in response!')
    }
  },
  onError: (error) => {
    toast.error('Login failed. Check console for details.')
    console.error('Login error:', error)
  },
  onSettled: () => {
    console.log('Login attempt finished')
    loadingOff()
  }
})

const formSchema = toTypedSchema(z.object({
  accountNumber: z.string().min(6, 'Account Number must be at least 6 digits'),
  password: z.string().min(3, 'Password must be at least 4 characters'),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Submitting login with:', values)
  mutate({
    accountNumber: values.accountNumber,
    password: values.password,
  })
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6">
    <div class="w-full max-w-md mx-auto animate-in">
      <Card variant="elevated" class="overflow-hidden">
        <CardHeader class="text-center pb-4 border-b border-border/50">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 class="h-7 w-7" aria-hidden="true" />
          </div>
          <CardTitle class="text-2xl font-bold">Welcome Back</CardTitle>
          <p class="text-muted-foreground mt-1">Sign in to your Nyi Bank account</p>
        </CardHeader>

        <CardContent class="space-y-4">
          <form @submit.prevent="onSubmit" class="space-y-4">
            <FormField name="accountNumber" :form="form">
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <div class="relative">
                    <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Field name="accountNumber" v-slot="{ field }">
                      <Input
                        type="text"
                        placeholder="Enter your account number"
                        class="pl-10"
                        :error="!!form.errors.value?.accountNumber"
                        v-bind="field"
                      />
                    </Field>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="password" :form="form">
              <FormItem>
                <div class="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                </div>
                <FormControl>
                  <div class="relative">
                    <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Field name="password" v-slot="{ field }">
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        class="pl-10 pr-10"
                        :error="!!form.errors.value?.password"
                        v-bind="field"
                      />
                    </Field>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button
              type="submit"
              variant="banking"
              size="lg"
              class="w-full"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter class="border-t border-border/50 pt-4">
          <p class="text-center text-sm text-muted-foreground">
            &copy; 2026 Nyi Bank. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>