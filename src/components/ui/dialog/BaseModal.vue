<script setup lang="ts">
import { cn } from '@/lib/utils'
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

interface Props extends DialogContentProps {
  title?: string
  icon?: any
  iconColor?: string
  description?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, title, icon, iconColor, description, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      data-slot="dialog-overlay"
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
    />
    <DialogContent
      data-slot="dialog-content"
      v-bind="forwarded"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200 p-0',
          props.class,
        )"
    >
      <div class="flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div class="flex items-center gap-2">
            <component
              v-if="icon"
              :is="icon"
              :class="['h-5 w-5', iconColor || 'text-primary']"
              aria-hidden="true"
            />
            <DialogTitle class="text-lg font-semibold">{{ title }}</DialogTitle>
          </div>
          <DialogClose
            class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </div>

        <div class="px-6 py-4" v-if="description">
          <DialogDescription class="text-sm text-muted-foreground">{{ description }}</DialogDescription>
        </div>

        <div class="flex-1 px-6 pb-6 overflow-auto">
          <slot />
        </div>

        <div class="px-6 py-4 border-t border-border/50" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </DialogContent>
  </DialogPortal>
</template>