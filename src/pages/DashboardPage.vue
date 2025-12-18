<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { dashboardService } from '@/services/supabase/dashboardService'
import type { DashboardStats, RevenueData, ActivityLogItem } from '@/types'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { 
  StatCard, 
  EventsTable, 
  RevenueChart, 
  ActivityFeed, 
  MiniCalendar, 
  QuickActions 
} from '@/components/features/dashboard'

const authStore = useAuthStore()
const eventsStore = useEventsStore()

const stats = ref<DashboardStats | null>(null)
const revenueData = ref<RevenueData[]>([])
const activities = ref<ActivityLogItem[]>([])
const loading = ref(true)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

const totalRevenue = computed(() => {
  return revenueData.value.reduce((sum, d) => sum + d.amount, 0)
})

const fetchDashboardData = async () => {
  if (!authStore.user?.id) return
  
  loading.value = true
  
  try {
    const [statsData, revenue, activityData] = await Promise.all([
      dashboardService.getStats(authStore.user.id),
      dashboardService.getRevenueData(authStore.user.id),
      dashboardService.getActivityLog(authStore.user.id)
    ])
    
    stats.value = statsData
    revenueData.value = revenue
    activities.value = activityData
    
    // Also fetch events
    await eventsStore.fetchEvents(authStore.user.id)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const refreshActivity = async () => {
  if (!authStore.user?.id) return
  activities.value = await dashboardService.getActivityLog(authStore.user.id)
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <DefaultLayout>
    <div class="space-y-8">
      <!-- Page Heading -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            {{ greeting }}, <span class="text-primary">{{ authStore.user?.company_name || 'Operator' }}</span>
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark font-medium flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">calendar_month</span>
            Today is {{ todayFormatted }}
          </p>
        </div>
        <!-- Notification Bell -->
        <button class="hidden md:flex relative p-2 text-text-sub-light hover:bg-gray-100 dark:text-text-sub-dark dark:hover:bg-surface-dark rounded-full transition-colors">
          <span class="material-symbols-outlined">notifications</span>
          <span class="absolute top-2 right-2 size-2 bg-accent rounded-full border-2 border-background-light dark:border-background-dark"></span>
        </button>
      </header>
      
      <!-- Stats Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Revenue YTD"
          :value="stats?.revenueYTD || 0"
          :change="stats?.revenueChange"
          icon="monitoring"
          prefix="$"
        />
        <StatCard
          label="Active Events"
          :value="stats?.activeEvents || 0"
          :change="stats?.activeEventsChange"
          icon="confirmation_number"
        />
        <StatCard
          label="Pending Requests"
          :value="stats?.pendingRequests || 0"
          :change="stats?.pendingRequestsChange"
          icon="pending_actions"
        />
      </section>
      
      <!-- Dashboard Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Chart & Table (66%) -->
        <div class="lg:col-span-2 space-y-8">
          <EventsTable 
            :events="eventsStore.upcomingEvents.slice(0, 5)" 
            :loading="eventsStore.loading"
          />
          
          <RevenueChart 
            :data="revenueData"
            :total="totalRevenue"
            :change="8.2"
          />
        </div>
        
        <!-- Right Column: Actions & Feed (33%) -->
        <div class="lg:col-span-1 space-y-6">
          <QuickActions />
          
          <ActivityFeed 
            :activities="activities"
            :loading="loading"
            @refresh="refreshActivity"
          />
          
          <MiniCalendar :events="eventsStore.events" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
