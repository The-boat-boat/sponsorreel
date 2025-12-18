<script setup lang="ts">
import type { ActivityLogItem } from '@/types'

interface Props {
  activities: ActivityLogItem[]
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  refresh: []
}>()

const getActivityIcon = (actionType: string) => {
  switch (actionType) {
    case 'application_received': return 'description'
    case 'payment_received': return 'payments'
    case 'message_received': return 'mail'
    case 'event_updated': return 'edit'
    case 'contract_signed': return 'task_alt'
    default: return 'notifications'
  }
}

const getActivityIconStyles = (actionType: string) => {
  switch (actionType) {
    case 'application_received': return 'bg-blue-100 dark:bg-blue-900/30 text-primary'
    case 'payment_received': return 'bg-green-100 dark:bg-green-900/30 text-green-600'
    case 'message_received': return 'bg-orange-100 dark:bg-orange-900/30 text-accent'
    case 'event_updated': return 'bg-gray-100 dark:bg-gray-700 text-gray-500'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-500'
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

const getActivityMessage = (activity: ActivityLogItem) => {
  const meta = activity.metadata as Record<string, string>
  
  switch (activity.action_type) {
    case 'application_received':
      return `<span class="font-bold">${meta.sponsor_name}</span> applied to sponsor <span class="font-medium text-primary">${meta.event_title}</span>`
    case 'payment_received':
      return `Payment received from <span class="font-bold">${meta.sponsor_name}</span>`
    case 'message_received':
      return `New message from <span class="font-bold">${meta.sender_name}</span> ${meta.preview}`
    case 'event_updated':
      return `You updated the details for <span class="font-medium text-primary">${meta.event_title}</span>`
    default:
      return 'Activity recorded'
  }
}
</script>

<template>
  <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-auto">
    <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
      <h3 class="text-lg font-bold text-text-main-light dark:text-text-main-dark">Recent Activity</h3>
      <button 
        class="text-gray-400 hover:text-primary transition-colors"
        @click="emit('refresh')"
      >
        <span class="material-symbols-outlined">refresh</span>
      </button>
    </div>
    
    <div class="p-0">
      <ul class="divide-y divide-gray-100 dark:divide-gray-800">
        <li v-if="loading" class="p-8 text-center">
          <span class="material-symbols-outlined animate-spin text-primary">progress_activity</span>
        </li>
        <li v-else-if="activities.length === 0" class="p-8 text-center text-text-secondary">
          No recent activity
        </li>
        <li 
          v-else
          v-for="activity in activities"
          :key="activity.id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex gap-4 items-start"
        >
          <div :class="['p-2 rounded-full shrink-0 flex items-center justify-center size-10', getActivityIconStyles(activity.action_type)]">
            <span class="material-symbols-outlined text-xl">{{ getActivityIcon(activity.action_type) }}</span>
          </div>
          <div>
            <p 
              class="text-sm text-text-main-light dark:text-text-main-dark"
              v-html="getActivityMessage(activity)"
            />
            <p class="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
              {{ formatTimeAgo(activity.created_at) }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    
    <div class="p-3 border-t border-gray-100 dark:border-gray-800 text-center">
      <button class="text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide hover:text-primary transition-colors">
        View All Activity
      </button>
    </div>
  </div>
</template>
