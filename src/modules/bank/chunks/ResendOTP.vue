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
import { Loader2, RotateCcw } from 'lucide-vue-next'

const props = defineProps<{
  title?: string
  icon?: any
  iconColor?: string
}>()

const emit = defineEmits(['done'])

const router = useRouter()
const { loadingOn, loadingOff } = useLoaderStore()

const { mutate: resendOTP } = api.ResentOTP.ResendOTP.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    console.log('Resend OTP response:', data)

    switch (data.message) {
      case "User not found.":
        toast.error("User not found.")
        return
      case "OTP already sent.":
        toast.error("OTP already sent.")
        return
      case "Account already verified.":
        toast.error("Account already verified.")
        return
      case "Account is locked.":
        toast.error("Account is locked.")
        return
    }

    toast.success("OTP has been resent!")
    emit('done')
    router.push('/bank')
  },
  onError: (error) => {
    toast.error("Resend OTP failed.")
    console.error("Resend OTP error:", error)
  },
  onSettled: loadingOff,
})

const formSchema = toTypedSchema(
  z.object({
    accountNumber: z.string().min(8, 'Account Number must be at least 8 digits'),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted:', values)
  resendOTP({ accountNumber: values.accountNumber }, {
    onSuccess: () => emit('done'),
  })
})
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-4" id="resendotp-form">
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

      <Button
        type="submit"
        variant="primary"
        size="lg"
        class="w-full mt-4"
      >
        Resend OTP
      </Button>
    </form>
  </div>
</template>