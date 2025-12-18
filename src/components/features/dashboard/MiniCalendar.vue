<script setup lang="ts">
import { computed } from 'vue'
import type { Event } from '@/types'

interface Props {
  events?: Event[]
}

const props = withDefaults(defineProps<Props>(), {
  events: () => []
})

const today = new Date()
const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const currentDay = today.getDate()

// Generate calendar days
const calendarDays = computed(() => {
  const year = today.getFullYear()
  const month = today.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)
  
  // Day of week for the first day (0 = Sunday, adjust for Monday start)
  let startDayOfWeek = firstDay.getDay()
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 // Convert to Monday start
  
  const days: { day: number; isCurrentMonth: boolean; isToday: boolean; hasEvent: boolean }[] = []
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: false
    })
  }
  
  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const hasEvent = props.events.some(e => e.event_date === dateStr)
    
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: i === currentDay,
      hasEvent
    })
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - days.length // 6 rows x 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: false
    })
  }
  
  return days.slice(0, 35) // 5 rows
})

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
</script>

<template>
  <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 hidden lg:block">
    <h3 class="text-lg font-bold mb-4 text-text-main-light dark:text-text-main-dark">{{ currentMonth }}</h3>
    
    <div class="grid grid-cols-7 gap-1 text-center text-sm">
      <!-- Week day headers -->
      <div 
        v-for="day in weekDays" 
        :key="day"
        class="text-text-sub-light dark:text-text-sub-dark text-xs font-semibold py-2"
      >
        {{ day }}
      </div>
      
      <!-- Calendar days -->
      <div 
        v-for="(item, index) in calendarDays" 
        :key="index"
        :class="[
          'p-2 rounded-full cursor-pointer relative transition-colors',
          item.isCurrentMonth 
            ? 'text-text-main-light dark:text-text-main-dark hover:bg-gray-100 dark:hover:bg-gray-800' 
            : 'text-gray-400',
          item.isToday 
            ? 'bg-primary text-white font-bold shadow-md shadow-primary/30 hover:bg-primary' 
            : '',
          item.hasEvent && !item.isToday 
            ? 'text-primary font-bold bg-primary/10' 
            : ''
        ]"
      >
        {{ item.day }}
        <span 
          v-if="item.hasEvent && !item.isToday"
          class="absolute top-1 right-1 size-1.5 bg-accent rounded-full"
        />
      </div>
    </div>
  </div>
</template>
