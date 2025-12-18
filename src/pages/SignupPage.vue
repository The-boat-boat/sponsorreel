<script setup lang="ts">
import { useRouter } from 'vue-router'
import { BaseCard } from '@/components/base'

const router = useRouter()

const userTypes = [
  {
    id: 'operator',
    title: "I'm a Cinema Operator",
    description: 'Create events, find sponsors, and manage contracts',
    icon: 'local_movies',
    route: '/signup/operator'
  },
  {
    id: 'sponsor',
    title: "I'm a Local Business",
    description: 'Discover events and sponsor local community screenings',
    icon: 'store',
    route: '/signup/sponsor'
  }
]

const selectUserType = (route: string) => {
  router.push(route)
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
    <div class="w-full max-w-xl">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="size-12 rounded-xl bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-2xl">movie_filter</span>
          </div>
          <h1 class="text-2xl font-bold text-primary dark:text-white">SponsorReel</h1>
        </div>
        <p class="text-text-secondary dark:text-text-secondary-dark">
          Join the community event sponsorship marketplace
        </p>
      </div>
      
      <!-- User Type Selection -->
      <BaseCard>
        <h2 class="text-xl font-bold text-text-main-light dark:text-white mb-2">Create your account</h2>
        <p class="text-text-secondary dark:text-text-secondary-dark mb-6">
          Choose your account type to get started
        </p>
        
        <div class="space-y-4">
          <button
            v-for="type in userTypes"
            :key="type.id"
            class="w-full p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary bg-white dark:bg-gray-800 transition-all text-left group"
            @click="selectUserType(type.route)"
          >
            <div class="flex items-start gap-4">
              <div class="size-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-primary text-2xl">{{ type.icon }}</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-1">
                  {{ type.title }}
                </h3>
                <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                  {{ type.description }}
                </p>
              </div>
              <span class="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </div>
          </button>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p class="text-sm text-text-secondary">
            Already have an account?
            <router-link to="/login" class="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </router-link>
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
