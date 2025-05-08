<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner'
import { Loader } from './components/ui/loaders';




</script>
<template>
  <Toaster />
  <RouterView />
  <Loader />
</template>
