


<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card, CardContent } from '@/components/ui/card';

const router = useRouter();

const goToATM = () => router.push({ name: 'login' });
const goToBank = () => router.push({ name: 'bank' });
</script>



<template>
  <div class="w-screen h-screen bg-gradient-to-br from-[#004a6e] to-[#002f4b] flex flex-col items-center justify-center p-6">
    <!-- Title -->
    <h1 class="text-white text-4xl md:text-5xl font-bold mb-12 drop-shadow-xl">
      Welcome to Nyi Bank
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">

      <Card @click="goToATM" class="group cursor-pointer bg-gradient-to-br from-[#0072a0] to-[#003b5c] text-center text-white p-10 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
        <CardContent>
          <div class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏧</div>
          <h2 class="text-2xl font-semibold mb-2 group-hover:text-[#ffe400] transition-colors duration-300">ATM</h2>
          <p class="text-white/70 group-hover:text-white transition duration-300">Access your account, withdraw cash and more.</p>
        </CardContent>
      </Card>

      <Card @click="goToBank" class="group cursor-pointer bg-gradient-to-br from-[#0072a0] to-[#003b5c] text-center text-white p-10 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
        <CardContent>
          <div class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏦</div>
          <h2 class="text-2xl font-semibold mb-2 group-hover:text-[#ffe400] transition-colors duration-300">Bank</h2>
          <p class="text-white/70 group-hover:text-white transition duration-300">Meet our staff, open accounts, and get support.</p>
        </CardContent>
      </Card>

    </div>
  </div>
</template>

