
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

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

import { useRouter } from 'vue-router';

const emit = defineEmits(['done']);

const router = useRouter();
const loaderStore = useLoaderStore();


  const {mutate : registerUser} = api.register.register.useMutation(

    {
      onMutate: () => {
        loaderStore.startLoading();
      },
      onSuccess: (data) => {
        toast.success('User registered successfully');
    if(data.message === 'User registered successfully') {
      toast.success('User registered successfully');
      emit('done');
    }

        else if(data.message === 'User already exists') {
            toast.error('User already exists');
      }
        else if(data.message === 'Invalid email') {
            toast.error('Invalid email');
      }
        else if(data.message === 'Invalid wallet amount') {
            toast.error('Invalid wallet amount');
      }
        else if(data.message === 'Password too weak') {
            toast.error('Password too weak');
      }
        else if(data.message === 'User registration failed') {
            toast.error('User registration failed');
      }

      router.push('/bank');
      },
      onSettled: () => {
        console.log('Registration attempt finished');
        loaderStore.stopLoading();
    },
      onError: (error) => {
        error.message = error.message;
        toast.error(error.message);
      }
    }
  );



  const formSchema = toTypedSchema(z.object({
    userName: z.string().min(2, 'Full name is required and must be at least 2 characters long.'),
    email: z.string().email('Please provide a valid email.'),
    wallet: z.number().int().positive('Please provide a valid positive wallet amount and at least 1000.'),
    password: z.string().min(3, 'Password must be at least 3 characters long.')
  })) ;


  const form = useForm({
  validationSchema: formSchema,
})



const onSubmit = form.handleSubmit((values) => {
  console.log('Submitting registration with:', values)
   registerUser({
      userName: values.userName,
      email: values.email,
      wallet: values.wallet,
      password: values.password
    }, {
      onSuccess: () => {
        emit('done');
      }
    });
})



</script>


<template>



  <div v-if="loaderStore.isLoading" class="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
  <div class="loader"></div>
</div>




  <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold"> Register New User</h2>
      <button @click="$emit('done')" class="text-sm text-red-300 hover:underline">Close</button>
    </div>

    <form @submit="onSubmit" class="space-y-4">

<FormField name="userName" :form="form">
  <FormItem>
    <FormLabel>Full Name</FormLabel>
    <FormControl>
      <Field name="userName" v-slot="{ field }">
        <Input type="text" placeholder="Enter your full name" class="shadcn-input" v-bind="field" />
      </Field>
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>

<FormField name="email" :form="form">
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <Field name="email" v-slot="{ field }">
        <Input type="email" placeholder="Enter your email" class="shadcn-input" v-bind="field" />
      </Field>
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>

<FormField name="wallet" :form="form">
  <FormItem>
    <FormLabel>Wallet Amount</FormLabel>
    <FormControl>
      <Field name="wallet" v-slot="{ field }">
        <Input type="number" placeholder="Enter wallet amount (min 1000)" class="shadcn-input" v-bind="field" />
      </Field>
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>

<FormField name="password" :form="form">
  <FormItem>
    <FormLabel>Password</FormLabel>
    <FormControl>
      <Field name="password" v-slot="{ field }">
        <Input type="password" placeholder="Enter your password" class="shadcn-input" v-bind="field" />
      </Field>
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>

<Button type="submit" class="shadcn-btn-primary">Register</Button>

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
