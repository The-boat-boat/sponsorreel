<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
  hover: false
})

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}
</script>

<template>
  <div 
    :class="[
      'bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm',
      paddingClasses[padding],
      { 'hover:shadow-lg hover:border-primary/30 transition-all duration-300': hover }
    ]"
  >
    <slot />
  </div>
</template>
