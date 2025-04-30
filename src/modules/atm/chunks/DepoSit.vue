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
const loaderStore = useLoaderStore();
const accountNumber = localStorage.getItem('accountNumber');

if (!accountNumber) {
  toast.error('Account number not found');
  emit('done');
  router.push('/login');
  throw new Error('No account number');
}

const { mutate: depositMoney } = api.atm.deposite.useMutation({
  onMutate: () => loaderStore.startLoading(),
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
  onSettled: () => loaderStore.stopLoading(),
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
  <div v-if="loaderStore.isLoading" class="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
    <div class="loader"></div>
  </div>

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
              <Input type="number" placeholder="Enter amount (min 1000)" class="shadcn-input" v-bind="field" />
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
              <Input type="password" placeholder="Enter PIN" class="shadcn-input" v-bind="field" />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="shadcn-btn-primary">Deposit</Button>
    </form>
  </div>
</template>

<style scoped>
.shadcn-input {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffffff30;
  padding: 0.75rem;
  border-radius: 0.75rem;
  color: white;
}

.shadcn-btn-primary {
  background-color: #00a6dc;
  padding: 0.75rem;
  font-weight: bold;
  border-radius: 0.75rem;
  color: white;
  transition: all 0.2s;
}

.shadcn-btn-primary:hover {
  background-color: #008ac2;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #159157;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
