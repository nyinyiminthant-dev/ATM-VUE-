<script setup lang="ts">
import { toast } from 'vue-sonner';
import AtmTable from '../../../components/ui/data-table/AtmTable.vue';
import {columns} from '../../../components/ui/data-table/Columns';
import api from '@/api';

const accountNumber =api.getUserAccountNumberFromToken();

if(!accountNumber) {
  toast({ variant: 'destructive', title: 'No Account Number Found' });
  throw new Error('No account number');
}

const { data: datas } = api.atm.history.useQuery(accountNumber)

</script>

<template>
  <AtmTable :columns="columns" :data="datas ?? [] "/>
</template>

