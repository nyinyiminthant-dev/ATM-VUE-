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
import { useLoaderStore } from '@/stores/loaderStore'
import { Loader2, Key } from 'lucide-vue-next'

const props = defineProps<{
  title?: string
  icon?: any
  iconColor?: string
}>()

const emit = defineEmits(['done'])
const { loadingOn, loadingOff } = useLoaderStore()

const formSchema = toTypedSchema(z.object({
  accountNumber: z.string().min(5, 'Account number must be at least 5 characters'),
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
}))

const form = useForm({
  validationSchema: formSchema,
})

const { mutate: createPin } = api.createPin.createPin.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    if (data.message === 'PIN created successfully!') {
      toast.success(data.message)
      emit('done')
    } else {
      toast.error(data.message || 'Failed to create PIN')
    }
  },
  onError: (error) => {
    toast.error(error.message || 'Something went wrong')
  },
  onSettled: loadingOff,
})

const onSubmit = form.handleSubmit((values) => {
  createPin({
    accountNumber: values.accountNumber,
    pin: Number(values.pin)
  })
})
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-4" id="createpin-form">
      <FormField name="accountNumber" :form="form">
        <FormItem>
          <FormLabel>Account Number</FormLabel>
          <FormControl>
            <Field name="accountNumber" v-slot="{ field }">
              <Input
                type="text"
                placeholder="Enter your account number"
                v-bind="field"
                :error="!!form.errors.value?.accountNumber"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="pin" :form="form">
        <FormItem>
          <FormLabel>New PIN</FormLabel>
          <FormControl>
            <Field name="pin" v-slot="{ field }">
              <Input
                type="password"
                placeholder="Enter new 4-digit PIN"
                maxlength="4"
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
        variant="warning"
        size="lg"
        class="w-full mt-4"
      >
        Set PIN
      </Button>
    </form>
  </div>
</template>