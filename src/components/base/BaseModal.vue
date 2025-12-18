<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  open: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  close: []
}>()

// Prevent body scroll when modal is open
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/50"
          @click="emit('close')"
        />
        
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="open"
            :class="[
              'relative bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg w-full',
              sizeClasses[size]
            ]"
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <slot name="header">
                <h2 class="text-xl font-bold text-text-main-light dark:text-white">{{ title }}</h2>
              </slot>
              <button 
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                @click="emit('close')"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <!-- Body -->
            <div class="p-6">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
