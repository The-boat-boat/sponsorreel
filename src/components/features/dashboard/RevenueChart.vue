<script setup lang="ts">
import { computed } from 'vue'
import type { RevenueData } from '@/types'

interface Props {
  data: RevenueData[]
  total?: number
  change?: number
}

const props = defineProps<Props>()

const maxAmount = computed(() => {
  return Math.max(...props.data.map(d => d.amount))
})

const getBarHeight = (amount: number) => {
  return (amount / maxAmount.value) * 100
}

const getBarOpacity = (amount: number) => {
  const ratio = amount / maxAmount.value
  if (ratio >= 0.9) return 'bg-primary dark:bg-primary'
  if (ratio >= 0.7) return 'bg-primary/40 dark:bg-primary/30'
  if (ratio >= 0.5) return 'bg-primary/30 dark:bg-primary/20'
  return 'bg-primary/20 dark:bg-primary/10'
}

const isHighest = (amount: number) => {
  return amount === maxAmount.value
}
</script>

<template>
  <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
    <div class="flex justify-between items-end mb-6">
      <div>
        <h3 class="text-lg font-bold text-text-main-light dark:text-text-main-dark">Sponsorship Revenue</h3>
        <p class="text-sm text-text-sub-light dark:text-text-sub-dark">Last 6 Months</p>
      </div>
      <div class="text-right" v-if="total !== undefined">
        <p class="text-2xl font-bold text-primary">${{ total.toLocaleString() }}</p>
        <p v-if="change !== undefined" class="text-xs text-green-600 font-medium">
          +{{ change }}% vs last period
        </p>
      </div>
    </div>
    
    <!-- Bar Chart -->
    <div class="w-full h-48 flex items-end justify-between gap-2 sm:gap-4">
      <div 
        v-for="item in data" 
        :key="item.month"
        class="group flex flex-col items-center flex-1 h-full justify-end gap-2"
      >
        <div 
          :class="[
            'w-full max-w-[40px] rounded-t-sm relative group-hover:opacity-90 transition-all',
            getBarOpacity(item.amount),
            isHighest(item.amount) ? 'shadow-lg shadow-primary/20' : ''
          ]"
          :style="{ height: `${getBarHeight(item.amount)}%` }"
        >
          <div 
            class="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
          >
            ${{ (item.amount / 100).toFixed(0) }}k
          </div>
        </div>
        <span 
          :class="[
            'text-xs font-medium',
            isHighest(item.amount) 
              ? 'font-bold text-primary dark:text-white' 
              : 'text-text-sub-light dark:text-text-sub-dark'
          ]"
        >
          {{ item.month }}
        </span>
      </div>
    </div>
  </div>
</template>
