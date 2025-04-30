<template>
    <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-semibold"> Update User Info</h2>
        <button @click="$emit('done')" class="text-sm text-red-300 hover:underline">Close</button>
      </div>

      <form @submit.prevent="updateUser" class="grid grid-cols-1 gap-4">
        <input v-model="form.userName" placeholder="Full Name" class="form-input" required />
        <input v-model="form.email" placeholder="Email" class="form-input" required />
        <input v-model="form.password" type="password" placeholder="Password (Leave empty if not changing)" class="form-input" />
        <input v-model="form.pin" type="number" placeholder="PIN" class="form-input" />
        <button type="submit" class="btn-primary">Update</button>
      </form>

      <p v-if="error" class="text-red-400 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-400 mt-2">{{ success }}</p>
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';

  // Form reactive data
  const form = ref({
    userName: '',
    email: '',
    password: '',  // Password is optional
    pin: 0         // PIN is optional
  });

  // Error and success messages
  const error = ref('');
  const success = ref('');

  // Function to update user information
  const updateUser = async () => {
    // Assuming you have a way to get the current user ID (e.g., from a store or passed as prop)
    const userId = 1; // Replace with actual user ID


      const res = await axios.put(`/api/bank/update/${userId}`, form.value);

      if (res.data.IsSuccess) {
        success.value = res.data.Message;
        error.value = '';
        // Optionally, reset the form or perform other actions
      } else {
        success.value = '';
        error.value = res.data.Message || 'Something went wrong.';
      }

  };
  </script>

  <style scoped>
  .form-input {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid #ffffff30;
    padding: 0.75rem;
    border-radius: 0.75rem;
    color: white;
  }
  .btn-primary {
    background-color: #00a6dc;
    padding: 0.75rem;
    font-weight: bold;
    border-radius: 0.75rem;
    color: white;
    transition: all 0.2s;
  }
  .btn-primary:hover {
    background-color: #008ac2;
  }
  </style>
