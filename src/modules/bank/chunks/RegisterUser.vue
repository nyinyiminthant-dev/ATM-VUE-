<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import api from '@/api'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useRouter } from 'vue-router'
import { useLoaderStore } from '@/stores/loaderStore'
import { Loader2, UserPlus } from 'lucide-vue-next'

const props = defineProps<{
  title?: string
  icon?: any
  iconColor?: string
}>()

const emit = defineEmits(['done'])

const router = useRouter()
const { loadingOn, loadingOff } = useLoaderStore()

const { mutate: registerUser } = api.register.register.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    if (data.message === 'User registered successfully') {
      toast.success('User registered successfully')
      emit('done')
    } else if (data.message === 'User already exists') {
      toast.error('User already exists')
    } else if (data.message === 'Invalid email') {
      toast.error('Invalid email')
    } else if (data.message === 'Invalid wallet amount') {
      toast.error('Invalid wallet amount')
    } else if (data.message === 'Password too weak') {
      toast.error('Password too weak')
    } else if (data.message === 'User registration failed') {
      toast.error('User registration failed')
    }
    router.push('/bank')
  },
  onError: (error) => {
    toast.error(error.message)
  },
  onSettled: loadingOff,
})

const formSchema = toTypedSchema(
  z.object({
    userName: z.string().min(2, 'Full name is required and must be at least 2 characters long.'),
    email: z.string().email('Please provide a valid email.'),
    wallet: z.number().int().min(1000, 'Please provide a valid wallet amount (at least 1,000).'),
    password: z.string().min(3, 'Password must be at least 3 characters long.')
  })
)

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Submitting registration with:', values)
  registerUser(
    {
      userName: values.userName,
      email: values.email,
      wallet: values.wallet,
      password: values.password
    },
    {
      onSuccess: () => {
        emit('done')
      }
    }
  )
})
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-4" id="register-form">
      <FormField name="userName" :form="form">
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Field name="userName" v-slot="{ field }">
              <Input
                type="text"
                placeholder="Enter your full name"
                v-bind="field"
                :error="!!form.errors.value?.userName"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="email" :form="form">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Field name="email" v-slot="{ field }">
              <Input
                type="email"
                placeholder="Enter your email"
                v-bind="field"
                :error="!!form.errors.value?.email"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="wallet" :form="form">
        <FormItem>
          <FormLabel>Wallet Amount</FormLabel>
          <FormControl>
            <Field name="wallet" v-slot="{ field }">
              <Input
                type="number"
                placeholder="Enter wallet amount (min 1,000 MMK)"
                class="text-lg"
                v-bind="field"
                :error="!!form.errors.value?.wallet"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="password" :form="form">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Field name="password" v-slot="{ field }">
              <Input
                type="password"
                placeholder="Enter your password"
                v-bind="field"
                :error="!!form.errors.value?.password"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        class="w-full mt-4"
      >
        Register User
      </Button>
    </form>
  </div>
</template>