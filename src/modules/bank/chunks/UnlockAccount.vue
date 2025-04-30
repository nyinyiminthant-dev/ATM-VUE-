<template>
    <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-semibold"> Unlock Account</h2>
        <button @click="$emit('done')" class="text-sm text-red-300 hover:underline">Close</button>
      </div>

      <form @submit.prevent="unlock" class="grid grid-cols-1 gap-4">
        <input v-model="accountNumber" placeholder="Account Number" class="form-input" required />
        <button type="submit" class="btn-primary">Send Unlock Request</button>
      </form>

      <p v-if="message" class="mt-2" :class="isSuccess ? 'text-green-400' : 'text-red-400'">{{ message }}</p>
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';

  const accountNumber = ref('');
  const message = ref('');
  const isSuccess = ref(false);

  const unlock = async () => {

      const res = await axios.post(`/api/bank/unlock?accountNumber=${accountNumber.value}`);
      message.value = res.data.message || 'Account unlock requested successfully.';
      isSuccess.value = true;


      isSuccess.value = false;

  };
  </script>
