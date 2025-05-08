
<script setup lang="ts">
import { ref } from 'vue';
import RegisterUser from './chunks/RegisterUser.vue';
import VerifyAccount from './chunks/VerifyAccount.vue';
import Createpin from './chunks/CreatePin.vue';
import ResendOTP from './chunks/ResendOTP.vue';
import router from '@/router';
import Button from '@/components/ui/button/Button.vue';

const components = {
  RegisterUser,
  VerifyAccount,
  Createpin,
  ResendOTP
} as const;

type ComponentKey = keyof typeof components;

const activeComponent = ref<ComponentKey | null>(null);
const responseMessage = ref('');
const showExitDialog = ref(false);

const openComponent = (key: ComponentKey) => {
  activeComponent.value = key;
};

const clearComponent = () => {
  activeComponent.value = null;
};

const setResponse = (msg: string) => {
  responseMessage.value = msg;
};

const exitDashboard = () => {
  showExitDialog.value = true;
};

const confirmExit = () => {
  activeComponent.value = null;
  responseMessage.value = 'You have exited the dashboard.';
  router.push('/');
  showExitDialog.value = false;
};

const cancelExit = () => {
  showExitDialog.value = false;
};


</script>



<template>
  <div class="w-full h-screen bg-gradient-to-br from-[#004a6e] to-[#002f4b] p-6 text-white overflow-auto">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold drop-shadow-lg">🏦 Welcome To Nyi Dashboard</h1>
      <p class="text-gray-200 mt-2">Request user accounts and banking operations</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
      <Button
        class="bg-white/10 border border-white/30 px-6 py-4 rounded-2xl font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 hover:scale-105 shadow-md flex justify-center items-center"
        @click="openComponent('RegisterUser')"
      >
        Register
      </Button>

      <Button
        class="bg-white/10 border border-white/30 px-6 py-4 rounded-2xl font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 hover:scale-105 shadow-md flex justify-center items-center"
        @click="openComponent('VerifyAccount')"
      >
        Verify Account
      </Button>

      <Button
        class="bg-white/10 border border-white/30 px-6 py-4 rounded-2xl font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 hover:scale-105 shadow-md flex justify-center items-center"
        @click="openComponent('Createpin')"
      >
        Create PIN
      </Button>

      <Button
        class="bg-white/10 border border-white/30 px-6 py-4 rounded-2xl font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 hover:scale-105 shadow-md flex justify-center items-center"
        @click="openComponent('ResendOTP')"
      >
        Resend OTP
      </Button>
    </div>

    <div class="flex justify-center mt-6">
      <button
        @click="exitDashboard"
        class="bg-red-500/10 border border-red-500/30 px-6 py-4 rounded-2xl font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-red-500/20 hover:-translate-y-0.5 hover:scale-105 shadow-md flex justify-center items-center"
      >
        Exit
      </button>
    </div>

    <div v-if="responseMessage" class="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4 shadow-md border border-white/20">
      <h2 class="text-xl font-semibold mb-2">Response</h2>
      <pre class="whitespace-pre-wrap text-gray-200">{{ responseMessage }}</pre>
    </div>

    <component
      :is="activeComponent ? components[activeComponent] : null"
      @done="clearComponent"
      @respond="setResponse"
    />
  </div>

  <div v-if="showExitDialog" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white text-black p-6 rounded-xl shadow-lg w-96">
      <h3 class="text-lg font-semibold mb-4">Exit Dashboard</h3>
      <p class="mb-6">Are you sure you want to exit the dashboard?</p>
      <div class="flex justify-end gap-4">
        <button @click="cancelExit" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button @click="confirmExit" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Exit</button>
      </div>
    </div>
  </div>
</template>

