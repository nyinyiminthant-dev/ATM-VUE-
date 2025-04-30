<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import api from '@/api';
import { useLoaderStore } from '@/stores/loaderStore';
import { useRouter } from 'vue-router';

const balance = ref<number | null>(null);
const loaderStore = useLoaderStore();
const router = useRouter();

const accountNumber = localStorage.getItem('accountNumber');

if (!accountNumber) {
  toast.error('No account number found');
  router.push('/login');
  throw new Error('No account number');
}

const { data, refetch, isError } = api.atm.checkBalance.useQuery(accountNumber);

onMounted(async () => {
  try {
    loaderStore.startLoading();
    await refetch();
    if (isError.value || data.value === undefined) {
      toast.error('Failed to fetch balance');
    } else {
      balance.value = Number(data.value);

    }
  } catch (error) {
    toast.error('Failed to fetch balance');
    console.error(error);
  } finally {
    loaderStore.stopLoading();
  }
});
</script>

<template>
  <div v-if="loaderStore.isLoading" class="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
    <div class="loader"></div>
  </div>

  <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white text-center">
    <h2 class="text-xl font-semibold mb-4">Account Balance</h2>
    <p v-if="balance !== null" class="text-2xl font-bold text-green-400">Ks {{ balance.toLocaleString() }}</p>
    <p v-else class="text-red-300">Unable to fetch balance.</p>
  </div>
</template>

<style scoped>
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
