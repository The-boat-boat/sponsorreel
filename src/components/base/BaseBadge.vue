<script setup lang="ts">
interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  dot: false
})

const variantClasses = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400'
}

const dotColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-500'
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs'
}
</script>

<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 rounded-full font-semibold',
      variantClasses[variant],
      sizeClasses[size]
    ]"
  >
    <span v-if="dot" :class="['size-1.5 rounded-full', dotColors[variant]]" />
    <slot />
  </span>
</template>
