<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';

import Withdraw from './chunks/WithDraw.vue';
import Deposit from './chunks/DepoSit.vue';
import Transfer from './chunks/TransFer.vue';
import MiniStatement from './chunks/MiniStatement.vue';
import ChangePin from './chunks/ChangePin.vue';
import BalanceInquiry from './chunks/BalanceInquiry.vue';




const components = {
  Withdraw,
  Deposit,
  Transfer,
  MiniStatement,
  ChangePin,
  BalanceInquiry
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
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  responseMessage.value = 'You have exited the dashboard.';
  showExitDialog.value = false;
  router.push('/');
};

const cancelExit = () => {
  showExitDialog.value = false;
};
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#005f85] to-[#004a6e] p-6 text-white overflow-auto">
    <Card class="w-full max-w-none p-8 space-y-8 backdrop-blur-lg bg-white/30 rounded-lg">
      <CardHeader class="text-center">
        <CardTitle class="text-3xl drop-shadow-lg">Welcome to ATM</CardTitle>
      </CardHeader>

      <CardContent class="grid grid-cols-2 gap-4 ml-6">
        <div class="space-y-4">
          <Button
            class="w-[500px] h-[50px] ml-10 mt-5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold text-base backdrop-blur transition hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg"
            @click="openComponent('Withdraw')"
          >
            Withdraw
          </Button>
          <Button
            class="w-[500px] h-[50px] ml-10 mt-5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold text-base backdrop-blur transition hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg"
            @click="openComponent('Deposit')"
          >
            Deposit
          </Button>
          <Button
            class="w-[500px] h-[50px] ml-10 mt-5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold text-base backdrop-blur transition hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg"
            @click="openComponent('Transfer')"
          >
            Transfer
          </Button>
        </div>
        <div class="space-y-4">
          <Button
            class="w-[500px] h-[50px] ml-10 mt-5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold text-base backdrop-blur transition hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg"
            @click="openComponent('BalanceInquiry')"
          >
            Check Balance
          </Button>
          <Button
            class="w-[500px] h-[50px] ml-10 mt-5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold text-base backdrop-blur transition hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg"
            @click="openComponent('MiniStatement')"
          >
            Transaction History
          </Button>
          <Button
            class="w-[500px] h-[50px] ml-10 mt-5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold text-base backdrop-blur transition hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg"
            @click="openComponent('ChangePin')"
          >
            Change PIN
          </Button>
        </div>
      </CardContent>

      <div class="flex justify-center mt-4">
        <button
          @click="exitDashboard"
          class="px-6 py-3 bg-red-500/10 border border-red-400 text-white font-semibold rounded-xl transition hover:bg-red-500/20 hover:scale-[1.02] hover:shadow-lg backdrop-blur"
        >
          Exit
        </button>
      </div>

      <div
        v-if="responseMessage"
        class="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4 shadow-md border border-white/20 text-gray-100"
      >
        <h2 class="text-xl font-semibold mb-2">Response</h2>
        <pre class="whitespace-pre-wrap">{{ responseMessage }}</pre>
      </div>

      <component
        :is="activeComponent ? components[activeComponent] : null"
        @done="clearComponent"
        @respond="setResponse"
      />
    </Card>
  </div>

  <div
    v-if="showExitDialog"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div class="bg-white text-black p-6 rounded-xl shadow-lg w-96">
      <h3 class="text-lg font-semibold mb-4">Exit Dashboard</h3>
      <p class="mb-6">Are you sure you want to exit the ATM?</p>
      <div class="flex justify-end gap-4">
        <button
          @click="cancelExit"
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button @click="confirmExit" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Exit</button>
      </div>
    </div>
  </div>
</template>

