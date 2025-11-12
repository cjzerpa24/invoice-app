<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <div>
            <label for="password" class="sr-only">New password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="New password"
            />
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">Confirm new password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {{ success }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
            {{ loading ? 'Resetting...' : 'Reset password' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
            Back to login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'ResetPassword',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const form = reactive({
      password: '',
      confirmPassword: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const isFormValid = computed(() => {
      return form.password.length >= 6 && form.password === form.confirmPassword
    })

    const handleResetPassword = async () => {
      if (!isFormValid.value) {
        error.value = 'Passwords must match and be at least 6 characters long'
        return
      }

      try {
        loading.value = true
        error.value = ''
        success.value = ''
        
        const token = route.query.token
        if (!token) {
          error.value = 'Reset token is missing'
          return
        }
        
        const result = await authStore.resetPassword(token, form.password)
        
        if (result.success) {
          success.value = result.data.message
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/auth/login')
          }, 2000)
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = 'An unexpected error occurred'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      success,
      isFormValid,
      handleResetPassword
    }
  }
}
</script> 