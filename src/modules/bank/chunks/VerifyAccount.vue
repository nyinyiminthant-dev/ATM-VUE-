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

const { mutate: verifyAccount } = api.verify.verifyAccount.useMutation({
  onMutate: loadingOn,
  onSuccess: (data) => {
    console.log('Verify Account response:', data);

    if (data.message === "User not found.") {
      toast.error('User not found.');
      return;
    }

    if (data.message === "Invalid OTP.") {
      toast.error('Invalid OTP.');
      return;
    }

    if (data.message === "OTP expired.") {
      toast.error('OTP expired.');
      return;
    }

    toast.success('Verify Account is successful!');
    emit('done');
    router.push('/bank');
  },
  onError: (error) => {
    toast.error('Verify Account failed.');
    console.error('Verify Account error:', error);
  },
  onSettled: () => {
    console.log('Verify Account attempt finished');
    loadingOff();
  },
});

const formSchema = toTypedSchema(
  z.object({
    accountNumber: z.string().min(8, 'Account Number must be at least 8 digits'),
    OTP: z.string().min(6, 'OTP must be 6 digits'),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted:', values);
  verifyAccount({
    accountNumber: values.accountNumber,
    otp: values.OTP,
  },{
      onSuccess: () => {
        emit('done');
      }
    }
);
});
</script>

<template>


  <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">Verify Account</h2>
      <button @click="$emit('done')" class="text-sm text-red-300 hover:underline">Close</button>
    </div>

    <form @submit="onSubmit" class="space-y-4 w-full">
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

      <FormField name="OTP" :form="form">
        <FormItem>
          <FormLabel>OTP</FormLabel>
          <FormControl>
            <Field name="OTP" v-slot="{ field }">
              <Input
                v-bind="field"
                placeholder="Enter your OTP"
                class="bg-white/10 border border-white/30 p-3 rounded-lg text-white"
              />
            </Field>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full mt-4 bg-blue-500 p-3 rounded-lg text-white hover:bg-blue-600">
        Verify
      </Button>
    </form>
  </div>
</template>
