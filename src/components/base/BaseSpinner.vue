<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClasses = {
  sm: 'text-[16px]',
  md: 'text-[24px]',
  lg: 'text-[32px]'
}
</script>

<template>
  <span 
    :class="['material-symbols-outlined animate-spin text-primary', sizeClasses[size]]"
  >
    progress_activity
  </span>
</template>
