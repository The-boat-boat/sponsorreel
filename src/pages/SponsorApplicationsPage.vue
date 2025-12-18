<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseCard, BaseButton } from '@/components/base'
import type { SponsorshipApplication } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const applicationsStore = useApplicationsStore()

const filter = ref<'all' | 'pending' | 'accepted' | 'rejected'>('all')

const filteredApplications = computed(() => {
  if (filter.value === 'all') return applicationsStore.applications
  return applicationsStore.applications.filter(app => app.status === filter.value)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    withdrawn: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400'
  }
  return colors[status as keyof typeof colors] || colors.pending
}

const handleWithdraw = async (applicationId: string) => {
  if (!confirm('Are you sure you want to withdraw this application?')) return
  
  const success = await applicationsStore.withdrawApplication(applicationId)
  if (success) {
    // Refresh applications
    if (authStore.user?.id) {
      await applicationsStore.fetchApplicationsBySponsor(authStore.user.id)
    }
  }
}

onMounted(async () => {
  if (authStore.user?.id) {
    await applicationsStore.fetchApplicationsBySponsor(authStore.user.id)
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            My Applications
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark font-medium mt-1">
            Track your sponsorship applications and their status
          </p>
        </div>
        <BaseButton variant="primary" @click="router.push('/sponsor/events')">
          <span class="material-symbols-outlined text-[20px]">search</span>
          Browse Events
        </BaseButton>
      </div>
      
      <!-- Filters -->
      <div class="flex gap-2">
        <button
          v-for="option in [
            { value: 'all', label: 'All Applications' },
            { value: 'pending', label: 'Pending' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' }
          ]"
          :key="option.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === option.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="filter = option.value as typeof filter"
        >
          {{ option.label }}
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="applicationsStore.loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
      
      <!-- Empty State -->
      <BaseCard v-else-if="filteredApplications.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">description</span>
        <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-2">
          {{ filter === 'all' ? 'No applications yet' : `No ${filter} applications` }}
        </h3>
        <p class="text-text-secondary dark:text-text-secondary-dark mb-6">
          {{ filter === 'all' ? 'Start browsing events to submit your first sponsorship application' : 'Try adjusting your filter' }}
        </p>
        <BaseButton v-if="filter === 'all'" variant="primary" @click="router.push('/sponsor/events')">
          Browse Events
        </BaseButton>
      </BaseCard>
      
      <!-- Applications List -->
      <div v-else class="space-y-4">
        <BaseCard
          v-for="app in filteredApplications"
          :key="app.id"
          class="hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col md:flex-row md:items-start gap-4">
            <!-- Event Info -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-1">
                    Application #{{ app.id.slice(0, 8) }}
                  </h3>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    Submitted {{ formatDate(app.submitted_at) }}
                  </p>
                </div>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                    getStatusColor(app.status)
                  ]"
                >
                  {{ app.status }}
                </span>
              </div>
              
              <!-- Event Details (if available) -->
              <div v-if="(app as any).event" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 class="font-semibold text-text-main-light dark:text-white mb-2">
                  {{ (app as any).event.title }}
                </h4>
                <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                  {{ (app as any).event.film_title }}
                </p>
                <p class="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
                  Event Date: {{ new Date((app as any).event.event_date).toLocaleDateString() }}
                </p>
              </div>

              <!-- Tier Info -->
              <div v-if="(app as any).tier" class="mt-3">
                <p class="text-sm font-semibold text-text-main-light dark:text-white">
                  Tier: {{ (app as any).tier.name }}
                </p>
                <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                  Investment: {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(((app as any).tier.price || 0) / 100) }}
                </p>
              </div>

              <!-- Message -->
              <div v-if="app.message" class="mt-4 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                <p class="text-xs font-semibold text-text-secondary dark:text-text-secondary-dark mb-1">Your Message:</p>
                <p class="text-sm text-text-main-light dark:text-white">{{ app.message }}</p>
              </div>

              <!-- Response Message -->
              <div v-if="app.response_message" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-xs font-semibold text-text-secondary dark:text-text-secondary-dark mb-1">Operator Response:</p>
                <p class="text-sm text-text-main-light dark:text-white">{{ app.response_message }}</p>
                <p v-if="app.responded_at" class="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                  Responded {{ formatDate(app.responded_at) }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 md:w-auto">
              <BaseButton
                v-if="app.status === 'pending'"
                variant="secondary"
                size="sm"
                @click="handleWithdraw(app.id)"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
                Withdraw
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                @click="router.push(`/sponsor/events/${app.event_id}`)"
              >
                <span class="material-symbols-outlined text-[18px]">visibility</span>
                View Event
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </DefaultLayout>
</template>
