<script setup lang="ts">
import { useRouter } from 'vue-router'
import { BaseButton } from '@/components/base'

const router = useRouter()
</script>

<template>
  <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
    <h3 class="text-lg font-bold mb-4 text-text-main-light dark:text-text-main-dark">Quick Actions</h3>
    <div class="flex flex-col gap-3">
      <BaseButton 
        variant="primary" 
        size="lg" 
        full-width
        @click="router.push('/events/create')"
      >
        <span class="material-symbols-outlined">add</span>
        Create New Event
      </BaseButton>
      <BaseButton 
        variant="secondary" 
        size="lg" 
        full-width
        @click="router.push('/sponsors')"
      >
        <span class="material-symbols-outlined">search</span>
        Find Sponsors
      </BaseButton>
    </div>
  </div>
</template>
