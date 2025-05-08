<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import api from '@/api'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useLoaderStore } from '@/stores/loaderStore';

const router = useRouter()
const loginAttempts = ref(0)
const { loadingOn, loadingOff } = useLoaderStore();

const { mutate } = api.login.login.useMutation({
  onMutate: loadingOn,

  onSuccess: (data) => {
    console.log('Login response:', data)

    if (data.message === 'Invalid username or password.') {
      toast.error('Invalid username or password.')
      return
    }

    const innerData = data.data

    if (innerData?.passwordStatus === false && innerData?.accountStatus === true) {
      loginAttempts.value++
      toast.error(`Incorrect password. Attempt ${loginAttempts.value}/3`)
      if (loginAttempts.value >= 3) {
        toast.error('Too many failed login attempts. Restarting...')
        setTimeout(() => location.reload(), 1500)
      }
      return
    }

    localStorage.setItem('token', innerData.token)
    localStorage.setItem('accountNumber', innerData.accountNumber)
    localStorage.setItem('balance', innerData.balance.toString())

    toast.success('Login successful!')
    router.push('/atm')
  },
  onError: (error) => {
    toast.error('Login failed. Check console for details.')
    console.error('Login error:', error)
  },
  onSettled: () => {
    console.log('Login attempt finished')
    loadingOff();
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





  <div class="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-6">
    <div class="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6">
      <h1 class="text-3xl font-bold text-blue-900">ATM Login</h1>

      <div class="bg-blue-600 p-3 rounded-full">
        <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 2a4 4 0 00-4 4v4H7a3 3 0 00-3 3v8a3 3 0 003 3h14a3 3 0 003-3v-8a3 3 0 00-3-3h-1V6a4 4 0 00-4-4zM10 6a2 2 0 114 0v4H10V6z" />
        </svg>
      </div>

      <form @submit="onSubmit" class="space-y-4 w-full">
        <FormField v-slot="{ componentField }" name="accountNumber">
          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter your Account Number"
                class="w-full rounded-md px-4 py-2 text-sm bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="password"
                placeholder="Enter your password"
                class="w-full rounded-md px-4 py-2 text-sm bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 rounded-md shadow-md transition duration-300"
        >
          Login
        </Button>
      </form>
    </div>
  </div>
</template>
