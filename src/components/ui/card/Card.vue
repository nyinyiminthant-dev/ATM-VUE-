<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { type CardVariants, cardVariants } from '.'

const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: CardVariants['variant']
}>()

const { variant = 'default' } = props
</script>

<template>
  <div
    data-slot="card"
    :class="cn(cardVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
