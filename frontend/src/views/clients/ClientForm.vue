<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Edit Client' : 'New Client' }}</h1>
      <p class="mt-1 text-sm text-gray-600">{{ isEditing ? 'Update client information' : 'Add a new client to your system' }}</p>
    </div>

    <!-- Form -->
    <div class="card">
      <form @submit.prevent="submitForm" class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <!-- Name -->
          <div class="sm:col-span-3">
            <label class="form-label">Name *</label>
            <input 
              type="text" 
              v-model="form.name" 
              class="form-input"
              :class="{ 'border-red-300': errors.name }"
              required 
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div class="sm:col-span-3">
            <label class="form-label">Email *</label>
            <input 
              type="email" 
              v-model="form.email" 
              class="form-input"
              :class="{ 'border-red-300': errors.email }"
              required 
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Phone -->
          <div class="sm:col-span-3">
            <label class="form-label">Phone</label>
            <input 
              type="tel" 
              v-model="form.phone" 
              class="form-input"
            />
          </div>

          <!-- Website -->
          <div class="sm:col-span-3">
            <label class="form-label">Website</label>
            <input 
              type="url" 
              v-model="form.website" 
              class="form-input"
              placeholder="https://"
            />
          </div>

          <!-- Address -->
          <div class="sm:col-span-6">
            <label class="form-label">Address</label>
            <input 
              type="text" 
              v-model="form.address" 
              class="form-input"
            />
          </div>

          <!-- City -->
          <div class="sm:col-span-2">
            <label class="form-label">City</label>
            <input 
              type="text" 
              v-model="form.city" 
              class="form-input"
            />
          </div>

          <!-- State -->
          <div class="sm:col-span-2">
            <label class="form-label">State/Province</label>
            <input 
              type="text" 
              v-model="form.state" 
              class="form-input"
            />
          </div>

          <!-- ZIP Code -->
          <div class="sm:col-span-2">
            <label class="form-label">ZIP/Postal Code</label>
            <input 
              type="text" 
              v-model="form.zipCode" 
              class="form-input"
            />
          </div>

          <!-- Country -->
          <div class="sm:col-span-3">
            <label class="form-label">Country</label>
            <input 
              type="text" 
              v-model="form.country" 
              class="form-input"
            />
          </div>

          <!-- Tax ID -->
          <div class="sm:col-span-3">
            <label class="form-label">Tax ID</label>
            <input 
              type="text" 
              v-model="form.taxId" 
              class="form-input"
            />
          </div>

          <!-- Notes -->
          <div class="sm:col-span-6">
            <label class="form-label">Notes</label>
            <textarea 
              v-model="form.notes" 
              rows="3"
              class="form-input"
              placeholder="Additional notes about this client..."
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end space-x-3">
          <router-link to="/clients" class="btn btn-outline">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ isEditing ? 'Update Client' : 'Create Client' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clientsAPI } from '../../services/api'

export default {
  name: 'ClientForm',
  props: {
    id: String
  },
  setup(props) {
    const router = useRouter()
    const loading = ref(false)
    const errors = ref({})
    
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      website: '',
      notes: ''
    })

    const isEditing = computed(() => !!props.id)

    const loadClient = async () => {
      if (!props.id) return
      
      try {
        const response = await clientsAPI.getById(props.id)
        const client = response.data
        
        Object.keys(form).forEach(key => {
          form[key] = client[key] || ''
        })
      } catch (error) {
        console.error('Error loading client:', error)
        router.push('/clients')
      }
    }

    const validateForm = () => {
      errors.value = {}
      
      if (!form.name.trim()) {
        errors.value.name = 'Name is required'
      }
      
      if (!form.email.trim()) {
        errors.value.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.value.email = 'Email is invalid'
      }
      
      return Object.keys(errors.value).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) return
      
      try {
        loading.value = true
        
        if (isEditing.value) {
          await clientsAPI.update(props.id, form)
        } else {
          await clientsAPI.create(form)
        }
        
        router.push('/clients')
      } catch (error) {
        console.error('Error saving client:', error)
        
        if (error.response?.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            error.response.data.message.forEach(msg => {
              const field = msg.split(' ')[0].toLowerCase()
              if (form.hasOwnProperty(field)) {
                errors.value[field] = msg
              }
            })
          } else {
            alert(error.response.data.message)
          }
        } else {
          alert('Error saving client')
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadClient()
    })

    return {
      form,
      errors,
      loading,
      isEditing,
      submitForm
    }
  }
}
</script> 