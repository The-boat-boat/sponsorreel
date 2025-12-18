import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/SignupPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/signup/operator',
      name: 'signup-operator',
      component: () => import('@/pages/OperatorSignupPage.vue'),
      meta: { requiresGuest: true }
    },
    
    // Protected Operator routes
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { requiresAuth: true, userType: 'operator' }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/pages/EventsListPage.vue'),
      meta: { requiresAuth: true, userType: 'operator' }
    },
    {
      path: '/events/create',
      name: 'event-create',
      component: () => import('@/pages/EventCreatePage.vue'),
      meta: { requiresAuth: true, userType: 'operator' }
    },
    {
      path: '/events/:id',
      name: 'event-detail',
      component: () => import('@/pages/EventDetailPage.vue'),
      meta: { requiresAuth: true, userType: 'operator' }
    },
    {
      path: '/events/:id/edit',
      name: 'event-edit',
      component: () => import('@/pages/EventEditPage.vue'),
      meta: { requiresAuth: true, userType: 'operator' }
    },
    {
      path: '/sponsors',
      name: 'sponsors',
      component: () => import('@/pages/SponsorDiscoveryPage.vue'),
      meta: { requiresAuth: true, userType: 'operator' }
    },
    {
      path: '/sponsors/:id',
      name: 'sponsor-profile',
      component: () => import('@/pages/SponsorProfilePage.vue'),
      meta: { requiresAuth: true, userType: 'operator' }
    },
    
    // Catch all
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
})

// Navigation guards
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }
  
  // Check user type if specified
  if (to.meta.userType && authStore.user?.user_type !== to.meta.userType) {
    next({ name: 'login' })
    return
  }
  
  next()
})

export default router
