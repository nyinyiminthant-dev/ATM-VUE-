<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  error?: boolean
  success?: boolean
  'aria-describedby'?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const inputClasses = cn(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-10 w-full min-w-0 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  props.error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
  props.success && 'border-success focus-visible:border-success focus-visible:ring-success/20',
  props.class,
)
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="inputClasses"
    :aria-describedby="props['aria-describedby']"
    :aria-invalid="props.error"
  >
</template>
