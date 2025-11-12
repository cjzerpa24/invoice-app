<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            Change Password
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Update your password to keep your account secure.
          </p>
        </div>
        
        <form @submit.prevent="handleChangePassword" class="space-y-6">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              name="currentPassword"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              v-model="form.newPassword"
              name="newPassword"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Enter your new password"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Confirm your new password"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {{ success }}
          </div>

          <div class="flex items-center justify-between">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </span>
              {{ loading ? 'Changing...' : 'Change Password' }}
            </button>

            <router-link 
              to="/" 
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'ChangePassword',
  setup() {
    const authStore = useAuthStore()
    
    const form = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const isFormValid = computed(() => {
      return form.currentPassword.length > 0 && 
             form.newPassword.length >= 6 && 
             form.newPassword === form.confirmPassword
    })

    const handleChangePassword = async () => {
      if (!isFormValid.value) {
        error.value = 'Please fill all fields correctly. New password must be at least 6 characters and passwords must match.'
        return
      }

      try {
        loading.value = true
        error.value = ''
        success.value = ''
        
        const result = await authStore.changePassword(form.currentPassword, form.newPassword)
        
        if (result.success) {
          success.value = result.data.message
          // Clear form
          form.currentPassword = ''
          form.newPassword = ''
          form.confirmPassword = ''
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
      handleChangePassword
    }
  }
}
</script> 