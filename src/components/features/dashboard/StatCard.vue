<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  change?: number
  icon: string
  prefix?: string
}

defineProps<Props>()

const formatChange = (change: number) => {
  if (change > 0) return `+${change}`
  return change.toString()
}
</script>

<template>
  <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
    <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <span class="material-symbols-outlined text-6xl text-primary">{{ icon }}</span>
    </div>
    <p class="text-text-sub-light dark:text-text-sub-dark font-medium">{{ label }}</p>
    <div class="flex items-baseline gap-2">
      <h2 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">
        {{ prefix }}{{ typeof value === 'number' ? value.toLocaleString() : value }}
      </h2>
      <span 
        v-if="change !== undefined"
        :class="[
          'text-sm font-semibold px-2 py-0.5 rounded-full',
          change >= 0 
            ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
            : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
        ]"
      >
        {{ formatChange(change) }}{{ change >= 0 ? '%' : '%' }}
      </span>
    </div>
  </div>
</template>
