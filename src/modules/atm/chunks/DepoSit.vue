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
import { useRouter } from 'vue-router';

const emit = defineEmits(['done']);

const router = useRouter();
const { loadingOn, loadingOff } = useLoaderStore()
const accountNumber =api.getUserAccountNumberFromToken();

if (!accountNumber) {
  toast.error('Account number not found');
  emit('done');
  router.push('/login');
  throw new Error('No account number');
}

const { mutate: depositMoney } = api.atm.deposite.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    if (data.message === 'Deposit successful') {
      toast.success('Deposit successful');
    } else if (data.message === 'Invalid amount') {
      toast.error('Invalid deposit amount');
    } else {
      toast.error('Deposit failed');
    }
  },
  onError: (error) => {
    toast.error(error.message);
  },
  onSettled: () => loadingOff(),
});

const formSchema = toTypedSchema(z.object({
  amount: z.number().min(1000, 'Minimum deposit amount is 1000'),
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
}));

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  if (!accountNumber) return;
  depositMoney({
    accountNumber,
    amount: Number(values.amount),
    pin: Number(values.pin),
  });
});
</script>

<template>


  <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">Deposit</h2>
      <button @click="$emit('done')" class="text-sm text-red-300 hover:underline">Close</button>
    </div>

    <form @submit="onSubmit" class="space-y-4">
      <FormField name="amount" :form="form">
        <FormItem>
          <FormLabel>Deposit Amount</FormLabel>
          <FormControl>
            <Field name="amount" v-slot="{ field }">
              <Input type="number" placeholder="Enter amount (min 1000)" class="bg-white/10 border border-white/30 text-white p-3 rounded-lg w-full" v-bind="field" />
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
              <Input type="password" placeholder="Enter PIN" class="bg-white/10 border border-white/30 text-white p-3 rounded-lg w-full" v-bind="field" />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="bg-blue-500 p-3 font-bold text-white rounded-lg hover:bg-blue-600 transition-colors">Deposit</Button>
    </form>
  </div>
</template>
