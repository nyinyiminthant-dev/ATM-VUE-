
<script setup lang="ts">
import { ref } from 'vue';
import RegisterUser from './chunks/RegisterUser.vue';
import VerifyAccount from './chunks/VerifyAccount.vue';
import UnlockAccount from './chunks/UnlockAccount.vue';
import Createpin from './chunks/CreatePin.vue';
import UpdateUserForm from './chunks/UpdateUserForm.vue';
import router from '@/router';
import Button from '@/components/ui/button/Button.vue';

const components = {
  RegisterUser,
  VerifyAccount,
  UnlockAccount,
  Createpin,
  UpdateUserForm
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
      <Button class="bank-action-btn" @click="openComponent('RegisterUser')">
        Register
      </Button>
      <!-- <Button class="bank-action-btn" @click="openComponent('UpdateUserForm')">
         Update User
      </Button> -->
      <Button class="bank-action-btn" @click="openComponent('VerifyAccount')">
        Verify Account
      </Button>
      <!-- <Button class="bank-action-btn" @click="openComponent('UnlockAccount')">
         Unlock Account
      </Button> -->
      <Button class="bank-action-btn" @click="openComponent('Createpin')">
         Create PIN
      </Button>
    </div>

    <div class="flex justify-center mt-6">
      <button class="exit-btn" @click="exitDashboard">
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


<style scoped>
.bank-action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  text-align: center;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bank-action-btn i {
  margin-right: 8px;
  font-size: 1.2rem;
}

.bank-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.exit-btn {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  text-align: center;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exit-btn:hover {
  background: rgba(255, 0, 0, 0.2);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
</style>
