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
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span class="text-gray-700 mr-2">
                  Welcome, {{ authStore.currentUser?.firstName }}!
                </span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <router-link
                  to="/auth/change-password"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Change Password
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const showUserMenu = ref(false)

    const isAuthPage = computed(() => route.path.startsWith('/auth'))

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/auth/login')
    }

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        showUserMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      authStore,
      isAuthPage,
      showUserMenu,
      toggleUserMenu,
      handleLogout
    }
  }
}
</script> 