<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import api from '@/api';
import { useLoaderStore } from '@/stores/loaderStore';
import { useRouter } from 'vue-router';

const balance = ref<number | null>(null);
  const { loadingOn, loadingOff } = useLoaderStore()
const router = useRouter();

const accountNumber =api.getUserAccountNumberFromToken();

if (!accountNumber) {
  toast.error('No account number found');
  router.push('/login');
  throw new Error('No account number');
}

const { data, refetch, isError } = api.atm.checkBalance.useQuery(accountNumber);

onMounted(async () => {
  try {
    loadingOn()
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
    loadingOff();
  }
});
</script>

<template>


  <div class="bg-white/10 p-6 rounded-xl border border-white/20 mt-6 shadow-lg text-white text-center">
    <h2 class="text-xl font-semibold mb-4">Account Balance</h2>
    <p v-if="balance !== null" class="text-2xl font-bold text-green-400">Ks {{ balance.toLocaleString() }}</p>
    <p v-else class="text-red-300">Unable to fetch balance.</p>
  </div>
</template>
