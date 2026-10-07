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
import { Loader2, Key } from 'lucide-vue-next'

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

const { mutate: changePin } = api.atm.ChangePin.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    if (data.message === 'PIN changed successfully') {
      toast.success('PIN changed successfully')
      emit('done')
    } else if (data.message === 'Invalid current PIN') {
      toast.error('Invalid current PIN')
    } else {
      toast.error('PIN change failed')
    }
  },
  onError: (error) => {
    toast.error(error.message)
  },
  onSettled: loadingOff,
})

const formSchema = toTypedSchema(z.object({
  pin: z.string().min(4, 'Current PIN must be at least 4 digits'),
  newPin: z.string().min(4, 'New PIN must be at least 4 digits'),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  if (!accountNumber) return
  changePin({
    accountNumber,
    pin: Number(values.pin),
    newPin: Number(values.newPin),
  })
})
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-4" id="changepin-form">
      <FormField name="pin" :form="form">
        <FormItem>
          <FormLabel>Current PIN</FormLabel>
          <FormControl>
            <Field name="pin" v-slot="{ field }">
              <Input
                type="password"
                placeholder="Enter current PIN"
                v-bind="field"
                :error="!!form.errors.value?.pin"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="newPin" :form="form">
        <FormItem>
          <FormLabel>New PIN</FormLabel>
          <FormControl>
            <Field name="newPin" v-slot="{ field }">
              <Input
                type="password"
                placeholder="Enter new PIN"
                v-bind="field"
                :error="!!form.errors.value?.newPin"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        type="submit"
        variant="destructive"
        size="lg"
        class="w-full mt-4"
      >
        Change PIN
      </Button>
    </form>
  </div>
</template>