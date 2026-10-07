<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import api from '@/api'
import { useRouter } from 'vue-router'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useLoaderStore } from '@/stores/loaderStore'
import { Loader2, Shield } from 'lucide-vue-next'

const props = defineProps<{
  title?: string
  icon?: any
  iconColor?: string
}>()

const emit = defineEmits(['done'])

const router = useRouter()
const { loadingOn, loadingOff } = useLoaderStore()

const { mutate: verifyAccount } = api.verify.verifyAccount.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    console.log('Verify Account response:', data)

    if (data.message === "User not found.") {
      toast.error('User not found.')
      return
    }

    if (data.message === "Invalid OTP.") {
      toast.error('Invalid OTP.')
      return
    }

    if (data.message === "OTP expired.") {
      toast.error('OTP expired.')
      return
    }

    toast.success('Account verified successfully!')
    emit('done')
    router.push('/bank')
  },
  onError: (error) => {
    toast.error('Account verification failed.')
    console.error('Verify Account error:', error)
  },
  onSettled: loadingOff,
})

const formSchema = toTypedSchema(
  z.object({
    accountNumber: z.string().min(8, 'Account Number must be at least 8 digits'),
    OTP: z.string().min(6, 'OTP must be 6 digits'),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted:', values)
  verifyAccount({
    accountNumber: values.accountNumber,
    otp: values.OTP,
  })
})
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-4" id="verify-form">
      <FormField name="accountNumber" :form="form">
        <FormItem>
          <FormLabel>Account Number</FormLabel>
          <FormControl>
            <Field name="accountNumber" v-slot="{ field }">
              <Input
                type="text"
                placeholder="Enter your Account Number"
                v-bind="field"
                :error="!!form.errors.value?.accountNumber"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="OTP" :form="form">
        <FormItem>
          <FormLabel>OTP</FormLabel>
          <FormControl>
            <Field name="OTP" v-slot="{ field }">
              <Input
                type="text"
                placeholder="Enter your 6-digit OTP"
                maxlength="6"
                v-bind="field"
                :error="!!form.errors.value?.OTP"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        type="submit"
        variant="success"
        size="lg"
        class="w-full mt-4"
      >
        Verify Account
      </Button>
    </form>
  </div>
</template>