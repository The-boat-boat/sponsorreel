<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppMobileHeader from '@/components/layout/AppMobileHeader.vue'
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar (Desktop) -->
    <AppSidebar />
    
    <!-- Main Content -->
    <main class="flex-1 h-full overflow-y-auto relative">
      <!-- Mobile Header -->
      <AppMobileHeader />
      
      <!-- Page Content -->
      <div class="max-w-7xl mx-auto p-4 md:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
