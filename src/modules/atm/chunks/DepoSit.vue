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
import { Loader2, DollarSign } from 'lucide-vue-next'

const props = defineProps<{
  title?: string
  icon?: any
  iconColor?: string
}>()

const emit = defineEmits(['done'])

const router = useRouter()
const { loadingOn, loadingOff } = useLoaderStore()
const accountNumber = localStorage.getItem('accountNumber')

if (!accountNumber) {
  toast.error('Account number not found')
  emit('done')
  router.push('/login')
  throw new Error('No account number')
}

const { mutate: depositMoney } = api.atm.deposite.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    if (data.message === 'Deposit successful') {
      toast.success('Deposit successful')
      emit('done')
    } else if (data.message === 'Invalid amount') {
      toast.error('Invalid deposit amount')
    } else {
      toast.error('Deposit failed')
    }
  },
  onError: (error) => {
    toast.error(error.message)
  },
  onSettled: loadingOff,
})

const formSchema = toTypedSchema(z.object({
  amount: z.number().min(1000, 'Minimum deposit amount is 1000'),
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  if (!accountNumber) return
  depositMoney({
    accountNumber,
    amount: Number(values.amount),
    pin: Number(values.pin),
  })
})
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-4" id="deposit-form">
      <FormField name="amount" :form="form">
        <FormItem>
          <FormLabel>Deposit Amount</FormLabel>
          <FormControl>
            <Field name="amount" v-slot="{ field }">
              <Input
                type="number"
                placeholder="Enter amount (min 1,000 MMK)"
                class="text-lg"
                v-bind="field"
                :error="!!form.errors.value?.amount"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="pin" :form="form">
        <FormItem>
          <FormLabel>PIN</FormLabel>
          <FormControl>
            <Field name="pin" v-slot="{ field }">
              <Input
                type="password"
                placeholder="Enter your 4-digit PIN"
                v-bind="field"
                :error="!!form.errors.value?.pin"
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
        Deposit
      </Button>
    </form>
  </div>
</template>