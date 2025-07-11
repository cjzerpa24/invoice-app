import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Dashboard from '../views/Dashboard.vue'
import ClientList from '../views/clients/ClientList.vue'
import ClientForm from '../views/clients/ClientForm.vue'
import InvoiceList from '../views/invoices/InvoiceList.vue'
import InvoiceForm from '../views/invoices/InvoiceForm.vue'
import PersonalDataForm from '../views/PersonalDataForm.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

const routes = [
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'ClientList',
    component: ClientList,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/new',
    name: 'NewClient',
    component: ClientForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id/edit',
    name: 'EditClient',
    component: ClientForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'InvoiceList',
    component: InvoiceList,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/new',
    name: 'NewInvoice',
    component: InvoiceForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id/edit',
    name: 'EditInvoice',
    component: InvoiceForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/personal-data',
    name: 'PersonalData',
    component: PersonalDataForm,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next('/auth/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    // Redirect to dashboard if user is authenticated and trying to access guest routes
    next('/')
  } else {
    next()
  }
})

export default router 