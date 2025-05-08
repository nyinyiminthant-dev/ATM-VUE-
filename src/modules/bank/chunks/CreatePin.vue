<script setup lang="ts">
import { defineEmits } from 'vue';
import { toast } from 'vue-sonner';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { Field, useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import api from '@/api';
import { useLoaderStore } from '@/stores/loaderStore';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const emit = defineEmits(['done']);
const { loadingOn, loadingOff } = useLoaderStore()

const formSchema = toTypedSchema(z.object({
  accountNumber: z.string().min(5, 'Account number must be at least 5 characters'),
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
}));

const form = useForm({
  validationSchema: formSchema,
});

const { mutate: createPin } = api.createPin.createPin.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    if (data.message === 'PIN created successfully!') {
      toast.success(data.message);
      emit('done');
    } else {
      toast.error(data.message || 'Failed to create PIN');
    }
  },
  onError: (error) => {
    toast.error(error.message || 'Something went wrong');
  },
  onSettled: () => {
    loadingOff();
  },
});

const onSubmit = form.handleSubmit((values) => {
  createPin({
    accountNumber: values.accountNumber,
    pin: Number(values.pin)
  });
});
</script>

<template>


  <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">Create PIN</h2>
      <button @click="$emit('done')" class="text-sm text-red-300 hover:underline">Close</button>
    </div>

    <form @submit="onSubmit" class="space-y-4">
      <FormField name="accountNumber" :form="form">
        <FormItem>
          <FormLabel>Account Number</FormLabel>
          <FormControl>
            <Field name="accountNumber" v-slot="{ field }">
              <Input type="text" placeholder="Enter your account number" class="bg-white/10 border border-white/30 p-3 rounded-lg text-white" v-bind="field" />
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
              <Input type="password" placeholder="Enter new PIN" class="bg-white/10 border border-white/30 p-3 rounded-lg text-white" v-bind="field" />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="bg-blue-500 text-white py-3 px-6 font-semibold rounded-lg hover:bg-blue-600 transition-colors">Set PIN</Button>
    </form>
  </div>
</template>
