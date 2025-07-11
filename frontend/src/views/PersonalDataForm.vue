<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Personal Data</h1>
      <p class="mt-1 text-sm text-gray-600">Manage your business information and settings</p>
    </div>

    <!-- Form -->
    <div class="card">
      <form @submit.prevent="submitForm" class="px-4 py-5 sm:p-6">
        <!-- Basic Information -->
        <div class="mb-8">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Information</h3>
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Full Name -->
            <div class="sm:col-span-3">
              <label class="form-label">Full Name *</label>
              <input 
                type="text" 
                v-model="form.fullName" 
                class="form-input"
                :class="{ 'border-red-300': errors.fullName }"
                required 
              />
              <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
            </div>

            <!-- Business Name -->
            <div class="sm:col-span-3">
              <label class="form-label">Business Name *</label>
              <input 
                type="text" 
                v-model="form.businessName" 
                class="form-input"
                :class="{ 'border-red-300': errors.businessName }"
                required 
              />
              <p v-if="errors.businessName" class="mt-1 text-sm text-red-600">{{ errors.businessName }}</p>
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

            <!-- Business Registration Number -->
            <div class="sm:col-span-3">
              <label class="form-label">Business Registration Number</label>
              <input 
                type="text" 
                v-model="form.businessRegNumber" 
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="mb-8">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Address Information</h3>
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
              <label class="form-label">Tax ID/VAT Number</label>
              <input 
                type="text" 
                v-model="form.taxId" 
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Business Assets -->
        <div class="mb-8">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Business Assets</h3>
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <!-- Logo -->
            <div>
              <label class="form-label">Logo URL</label>
              <input 
                type="url" 
                v-model="form.logo" 
                class="form-input"
                placeholder="https://example.com/logo.png"
              />
              <p class="mt-1 text-sm text-gray-500">URL to your business logo image</p>
            </div>

            <!-- Signature -->
            <div>
              <label class="form-label">Digital Signature URL</label>
              <input 
                type="url" 
                v-model="form.signature" 
                class="form-input"
                placeholder="https://example.com/signature.png"
              />
              <p class="mt-1 text-sm text-gray-500">URL to your digital signature image</p>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="mb-8">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Payment Information</h3>
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
            <!-- Bank Details -->
            <div>
              <label class="form-label">Bank Account Details</label>
              <textarea 
                v-model="form.bankDetails" 
                rows="3"
                class="form-input"
                placeholder="Bank name, account number, routing number, etc."
              ></textarea>
            </div>

            <!-- Payment Instructions -->
            <div>
              <label class="form-label">Payment Instructions</label>
              <textarea 
                v-model="form.paymentInstructions" 
                rows="3"
                class="form-input"
                placeholder="Instructions for clients on how to make payments..."
              ></textarea>
            </div>

            <!-- Default Invoice Terms -->
            <div>
              <label class="form-label">Default Invoice Terms</label>
              <textarea 
                v-model="form.defaultInvoiceTerms" 
                rows="4"
                class="form-input"
                placeholder="Default terms and conditions for invoices..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <button type="button" @click="loadDefault" class="btn btn-outline" :disabled="loading">
            Reset to Default
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Save Personal Data
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { personalDataAPI } from '../services/api'

export default {
  name: 'PersonalDataForm',
  setup() {
    const loading = ref(false)
    const errors = ref({})
    
    const form = reactive({
      fullName: '',
      businessName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      businessRegNumber: '',
      website: '',
      logo: '',
      bankDetails: '',
      paymentInstructions: '',
      defaultInvoiceTerms: '',
      signature: ''
    })

    const loadDefault = async () => {
      try {
        const response = await personalDataAPI.getDefault()
        if (response.data) {
          const data = response.data
          Object.keys(form).forEach(key => {
            form[key] = data[key] || ''
          })
        }
      } catch (error) {
        console.error('Error loading personal data:', error)
        // Reset form if no data found
        Object.keys(form).forEach(key => {
          form[key] = ''
        })
      }
    }

    const validateForm = () => {
      errors.value = {}
      
      if (!form.fullName.trim()) {
        errors.value.fullName = 'Full name is required'
      }
      
      if (!form.businessName.trim()) {
        errors.value.businessName = 'Business name is required'
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
        await personalDataAPI.createOrUpdate(form)
        alert('Personal data saved successfully!')
      } catch (error) {
        console.error('Error saving personal data:', error)
        
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
          alert('Error saving personal data')
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadDefault()
    })

    return {
      form,
      errors,
      loading,
      loadDefault,
      submitForm
    }
  }
}
</script> 