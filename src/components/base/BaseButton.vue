<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'

const variantClasses = {
  primary: 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20',
  secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-main-light dark:text-text-main-dark border border-transparent dark:border-gray-700',
  outline: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700',
  text: 'text-primary hover:text-primary/80 hover:bg-primary/10',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
}

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      { 'w-full': fullWidth }
    ]"
    @click="handleClick"
  >
    <span v-if="loading" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
    <slot />
  </button>
</template>
