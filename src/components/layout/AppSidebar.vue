<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = computed(() => {
  if (authStore.user?.user_type === 'sponsor') {
    return [
      { name: 'Dashboard', icon: 'dashboard', route: '/sponsor/dashboard' },
      { name: 'Browse Events', icon: 'search', route: '/sponsor/events' },
      { name: 'My Applications', icon: 'description', route: '/sponsor/applications' },
      { name: 'Settings', icon: 'settings', route: '/sponsor/settings' }
    ]
  }
  return [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Events', icon: 'calendar_today', route: '/events' },
    { name: 'Sponsors', icon: 'handshake', route: '/sponsors' },
    { name: 'Payments', icon: 'payments', route: '/payments' },
    { name: 'Settings', icon: 'settings', route: '/settings' }
  ]
})

const isActive = (path: string) => {
  if (path === '/dashboard' || path === '/sponsor/dashboard') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between hidden md:flex shrink-0 z-20 transition-colors duration-200">
    <div class="flex flex-col h-full">
      <!-- Brand -->
      <div class="p-6 flex items-center gap-3">
        <div class="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-white text-2xl">movie_filter</span>
        </div>
        <div>
          <h1 class="text-lg font-bold leading-tight text-primary dark:text-white">SponsorReel</h1>
          <p class="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
            {{ authStore.user?.user_type === 'sponsor' ? 'Sponsor Console' : 'Operator Console' }}
          </p>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.route"
          :to="item.route"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors',
            isActive(item.route)
              ? 'bg-primary/10 text-primary dark:text-white dark:bg-primary/20'
              : 'text-text-sub-light dark:text-text-sub-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white'
          ]"
        >
          <span 
            class="material-symbols-outlined"
            :class="{ 'filled': isActive(item.route) }"
          >
            {{ item.icon }}
          </span>
          <span :class="['text-sm', isActive(item.route) ? 'font-semibold' : 'font-medium']">
            {{ item.name }}
          </span>
        </router-link>
      </nav>
      
      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors group relative">
          <div 
            class="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700"
            :style="authStore.user?.company_logo_url 
              ? { backgroundImage: `url(${authStore.user.company_logo_url})` }
              : { backgroundColor: '#1e6d8a' }"
          >
            <div v-if="!authStore.user?.company_logo_url" class="w-full h-full flex items-center justify-center text-white font-bold">
              {{ authStore.user?.company_name?.charAt(0) || 'U' }}
            </div>
          </div>
          <div class="flex flex-col overflow-hidden flex-1">
            <p class="text-sm font-bold truncate text-text-main-light dark:text-white">
              {{ authStore.user?.company_name || 'User' }}
            </p>
            <p class="text-xs text-text-sub-light dark:text-text-sub-dark truncate capitalize">
              {{ authStore.user?.subscription_tier || 'Free' }} Account
            </p>
          </div>
          
          <!-- Dropdown trigger -->
          <button 
            class="text-gray-400 hover:text-primary transition-colors"
            @click.stop="handleLogout"
            title="Logout"
          >
            <span class="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
