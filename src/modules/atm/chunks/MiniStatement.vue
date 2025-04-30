<script setup lang="ts">
import { ref, watch, watchEffect, computed } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import api from '@/api';

const emit = defineEmits(['done']); // to emit close event

type Transaction = {
  accountNumber: string;
  date: string;
  type: string;
  amount: number;
};

const accountNumber = localStorage.getItem('accountNumber');

if (!accountNumber) {
  toast({ variant: 'destructive', title: 'No Account Number Found' });
  throw new Error('No account number');
}

const { data, isFetching, isError, refetch } = api.atm.history.useQuery(accountNumber);

const isStillFetching = ref(false);
watch(isFetching, (fetching) => {
  isStillFetching.value = fetching;
});

const transactions = ref<Transaction[]>([]);

watchEffect(() => {
  if (data.value) {
    transactions.value = [...data.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
});

const currentPage = ref(1);
const itemsPerPage = 5;

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return transactions.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(transactions.value.length / itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-white">Transaction History</h2>
      <button @click="emit('done')" class="text-sm text-red-300 hover:underline">Close</button> <!-- Close button -->
      <Button @click="refetch" :disabled="isStillFetching">Refresh</Button>
    </div>

    <div v-if="isStillFetching" class="text-white">Loading...</div>
    <div v-else-if="isError" class="text-red-400">Failed to fetch transaction history.</div>

    <div v-else>
      <div v-if="transactions.length === 0" class="text-gray-400 text-center">
        No transactions found.
      </div>

      <Table
        v-else
        class="bg-white/10 text-white text-sm rounded-lg border border-white/20 shadow"
      >
        <TableHeader class="bg-white/10 uppercase text-xs text-gray-300">
          <TableRow>
            <TableHead>Account Num</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount (Ks)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="txn in paginatedTransactions"
            :key="txn.accountNumber + txn.date"
            class="border-b border-white/10 hover:bg-white/5"
          >
            <TableCell>{{ txn.accountNumber }}</TableCell>
            <TableCell>{{ new Date(txn.date).toLocaleString() }}</TableCell>
            <TableCell>{{ txn.type }}</TableCell>
            <TableCell class="text-green-400 font-semibold">
              {{ typeof txn.amount === 'number' ? txn.amount.toLocaleString() : '0' }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="flex justify-between items-center mt-4 text-white">
        <Button @click="prevPage" :disabled="currentPage === 1">Previous</Button>
        <div>Page {{ currentPage }} of {{ totalPages }}</div>
        <Button @click="nextPage" :disabled="currentPage === totalPages">Next</Button>
      </div>
    </div>
  </div>
</template>
