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
import { useRouter } from 'vue-router';
import { FormField } from '@/components/ui/form';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';

const emit = defineEmits(['done']);

const router = useRouter();
const loaderStore = useLoaderStore();

const { mutate: resendOTP } = api.ResentOTP.ResendOTP.useMutation({
  onMutate: () => loaderStore.startLoading(),

  onSuccess: (data) => {
    console.log('Resend OTP response:', data);

    switch (data.message) {
      case "User not found.":
        toast.error("User not found.");
        return;
      case "OTP already sent.":
        toast.error("OTP already sent.");
        return;
      case "Account already verified.":
        toast.error("Account already verified.");
        return;
      case "Account is locked.":
        toast.error("Account is locked.");
        return;
    }



    toast.success("OTP has been resent!");
    emit('done');
    router.push('/bank');
  },

  onError: (error) => {
    toast.error("Resend OTP failed.");
    console.error("Resend OTP error:", error);
  },

  onSettled: () => loaderStore.stopLoading(),
});

const formSchema = toTypedSchema(
  z.object({
    accountNumber: z.string().min(8, 'Account Number must be at least 8 digits'),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted:', values);
  resendOTP({ accountNumber: values.accountNumber }, {
    onSuccess: () => emit('done'),
  });
});
</script>

<template>
  <div v-if="loaderStore.isLoading" class="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
    <div class="loader"></div>
  </div>

  <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">Resend OTP</h2>
      <button @click="$emit('done')" class="text-sm text-red-300 hover:underline">Close</button>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4 w-full">
      <FormField name="accountNumber" :form="form">
        <FormItem>
          <FormLabel>Account Number</FormLabel>
          <FormControl>
            <Field name="accountNumber" v-slot="{ field }">
              <Input
                v-bind="field"
                placeholder="Enter your Account Number"
                class="shadcn-input"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full mt-4">Resend OTP</Button>
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
