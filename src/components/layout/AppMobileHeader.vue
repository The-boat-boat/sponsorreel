<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMenuOpen = ref(false)

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

const navigateTo = (path: string) => {
  router.push(path)
  isMenuOpen.value = false
}

const handleLogout = async () => {
  isMenuOpen.value = false
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="md:hidden">
    <!-- Header Bar -->
    <div class="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-2 text-primary font-bold">
        <span class="material-symbols-outlined">movie_filter</span>
        SponsorReel
      </div>
      <button 
        class="text-gray-500 p-2 -mr-2"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="material-symbols-outlined">{{ isMenuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isMenuOpen"
        class="fixed inset-0 z-40 bg-black/50"
        @click="isMenuOpen = false"
      />
    </Transition>
    
    <!-- Mobile Menu Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div 
        v-if="isMenuOpen"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-surface-light dark:bg-surface-dark shadow-xl flex flex-col"
      >
        <!-- Menu Header -->
        <div class="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
          <div class="size-10 rounded-xl bg-primary flex items-center justify-center">
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
          <button
            v-for="item in navItems"
            :key="item.route"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
              isActive(item.route)
                ? 'bg-primary/10 text-primary dark:text-white dark:bg-primary/20'
                : 'text-text-sub-light dark:text-text-sub-dark hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
            @click="navigateTo(item.route)"
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
          </button>
        </nav>
        
        <!-- User Section -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3 p-2 mb-2">
            <div 
              class="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold"
            >
              {{ authStore.user?.company_name?.charAt(0) || 'U' }}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-sm font-bold truncate text-text-main-light dark:text-white">
                {{ authStore.user?.company_name || 'User' }}
              </p>
              <p class="text-xs text-text-sub-light dark:text-text-sub-dark truncate">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined">logout</span>
            <span class="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
