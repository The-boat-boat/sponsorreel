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
    {
      path: '/signup/sponsor',
      name: 'signup-sponsor',
      component: () => import('@/pages/SponsorSignupPage.vue'),
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
    
    // Protected Sponsor routes
    {
      path: '/sponsor/dashboard',
      name: 'sponsor-dashboard',
      component: () => import('@/pages/SponsorDashboardPage.vue'),
      meta: { requiresAuth: true, userType: 'sponsor' }
    },
    {
      path: '/sponsor/events',
      name: 'sponsor-events',
      component: () => import('@/pages/SponsorEventsPage.vue'),
      meta: { requiresAuth: true, userType: 'sponsor' }
    },
    {
      path: '/sponsor/events/:id',
      name: 'sponsor-event-detail',
      component: () => import('@/pages/SponsorEventDetailPage.vue'),
      meta: { requiresAuth: true, userType: 'sponsor' }
    },
    {
      path: '/sponsor/applications',
      name: 'sponsor-applications',
      component: () => import('@/pages/SponsorApplicationsPage.vue'),
      meta: { requiresAuth: true, userType: 'sponsor' }
    },
    {
      path: '/sponsor/settings',
      name: 'sponsor-settings',
      component: () => import('@/pages/SponsorSettingsPage.vue'),
      meta: { requiresAuth: true, userType: 'sponsor' }
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
    // Redirect to appropriate dashboard based on user type
    if (authStore.user?.user_type === 'sponsor') {
      next({ name: 'sponsor-dashboard' })
    } else {
      next({ name: 'dashboard' })
    }
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
