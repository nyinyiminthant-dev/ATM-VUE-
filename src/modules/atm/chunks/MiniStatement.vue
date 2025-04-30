<template>
  <div>
    <Button class="w-120 h-15" variant="secondary" @click="handleMiniStatement">Mini Statement</Button>

    <Dialog :model-value="showDialog" @update:model-value="showDialog = $event" class="dialog-container">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ dialogIcon }} {{ dialogTitle }}</DialogTitle>
          <DialogDescription>{{ dialogMessage }}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button class="mx-auto" @click="closeDialog">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const dialogIcon = ref('💬')

const handleMiniStatement = () => {
  showInfoDialog('Mini Statement', 'Feature coming soon!')
}

const showInfoDialog = (title: string, message: string) => {
  dialogTitle.value = title
  dialogMessage.value = message
  dialogIcon.value = 'ℹ️'
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}
</script>

<style scoped>
/* Add your scoped styling here */
</style>
