<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav v-if="!isAuthPage" class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">Invoice Manager</h1>
            </router-link>
            
            <div v-if="authStore.isAuthenticated" class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/clients"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                :class="{ 'border-b-2 border-primary-500 text-gray-900': $route.path.startsWith('/clients') }"
              >
                Clients
              </router-link>
              
              <router-link
                to="/invoices"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                :class="{ 'border-b-2 border-primary-500 text-gray-900': $route.path.startsWith('/invoices') }"
              >
                Invoices
              </router-link>
              
              <router-link
                to="/personal-data"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                :class="{ 'border-b-2 border-primary-500 text-gray-900': $route.path.startsWith('/personal-data') }"
              >
                Personal Data
              </router-link>
            </div>
          </div>

          <!-- User menu -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ authStore.currentUser?.firstName }}!
            </span>
            <button
              @click="handleLogout"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign out
            </button>
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <router-link
              to="/auth/login"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Sign in
            </router-link>
            <router-link
              to="/auth/register"
              class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main :class="isAuthPage ? '' : 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const isAuthPage = computed(() => route.path.startsWith('/auth'))

    const handleLogout = () => {
      authStore.logout()
      router.push('/auth/login')
    }

    return {
      authStore,
      isAuthPage,
      handleLogout
    }
  }
}
</script> 