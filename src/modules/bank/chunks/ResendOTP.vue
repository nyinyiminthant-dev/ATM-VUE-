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
const { loadingOn, loadingOff } = useLoaderStore()

const { mutate: resendOTP } = api.ResentOTP.ResendOTP.useMutation({
  onMutate: loadingOn,

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

  onSettled: () => loadingOff(),
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
                class="bg-white/10 border border-white/30 p-3 rounded-lg text-white"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full mt-4 bg-blue-500 p-3 rounded-lg text-white hover:bg-blue-400">Resend OTP</Button>
    </form>
  </div>
</template>
