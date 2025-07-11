<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Invoice' : 'Create Invoice' }}
        </h1>
        <p class="text-gray-600">
          {{ isEdit ? 'Update invoice details' : 'Create a new invoice for your client' }}
        </p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/invoices" class="btn btn-secondary">
          Cancel
        </router-link>
        <button @click="saveInvoice" :disabled="saving" class="btn btn-primary">
          {{ saving ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Create Invoice') }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveInvoice" class="space-y-6">
      <!-- Basic Information -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Invoice Information</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Invoice Number</label>
              <div class="flex">
                <input
                  v-model="form.invoiceNumber"
                  type="text"
                  class="form-input"
                  placeholder="INV-202412-0001"
                  required
                />
                <button
                  type="button"
                  @click="generateInvoiceNumber"
                  class="ml-2 btn btn-secondary btn-sm"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label class="form-label">Client</label>
              <select v-model="form.clientId" class="form-select" required>
                <option value="">Select a client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="form-label">Issue Date</label>
              <input
                v-model="form.issueDate"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="form-label">Due Date</label>
              <input
                v-model="form.dueDate"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="md:col-span-2">
              <label class="form-label">Description (Optional)</label>
              <textarea
                v-model="form.description"
                class="form-textarea"
                rows="3"
                placeholder="Brief description of the invoice..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Items -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Invoice Items</h2>
          <button
            type="button"
            @click="addItem"
            class="btn btn-secondary btn-sm"
          >
            Add Item
          </button>
        </div>
        <div class="card-body">
          <div v-if="form.items.length === 0" class="text-center py-8 text-gray-500">
            No items added yet. Click "Add Item" to get started.
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50"
            >
              <div class="md:col-span-2">
                <label class="form-label">Description</label>
                <input
                  v-model="item.description"
                  type="text"
                  class="form-input"
                  placeholder="Item description"
                  required
                />
              </div>
              
              <div>
                <label class="form-label">Quantity</label>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-input"
                  @input="calculateItemTotal(item)"
                  required
                />
              </div>
              
              <div>
                <label class="form-label">Unit Price</label>
                <input
                  v-model.number="item.unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-input"
                  @input="calculateItemTotal(item)"
                  required
                />
              </div>
              
              <div class="flex items-end">
                <div class="flex-1">
                  <label class="form-label">Total</label>
                  <div class="form-input bg-gray-100 text-gray-700">
                    ${{ item.total.toFixed(2) }}
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="ml-2 btn-icon btn-danger"
                  title="Remove Item"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Totals and Tax -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Totals</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Tax Rate (%)</label>
              <input
                v-model.number="form.taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                class="form-input"
                @input="calculateTotals"
              />
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-700">Subtotal:</span>
                <span class="font-medium">${{ form.subtotal.toFixed(2) }}</span>
              </div>
              
              <div v-if="form.taxRate > 0" class="flex justify-between">
                <span class="text-gray-700">Tax ({{ form.taxRate }}%):</span>
                <span class="font-medium">${{ form.taxAmount.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${{ form.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Additional Information</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Notes (Optional)</label>
              <textarea
                v-model="form.notes"
                class="form-textarea"
                rows="4"
                placeholder="Any additional notes or instructions..."
              ></textarea>
            </div>
            
            <div>
              <label class="form-label">Terms & Conditions (Optional)</label>
              <textarea
                v-model="form.terms"
                class="form-textarea"
                rows="4"
                placeholder="Payment terms, conditions, etc..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

export default {
  name: 'InvoiceForm',
  props: {
    id: String
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    
    const saving = ref(false)
    const clients = ref([])
    
    const isEdit = computed(() => !!props.id)
    
    const form = reactive({
      invoiceNumber: '',
      clientId: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      description: '',
      items: [],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 0,
      notes: '',
      terms: '',
      status: 'draft'
    })

    const loadClients = async () => {
      try {
        const response = await api.get('/clients')
        clients.value = response.data
      } catch (error) {
        console.error('Error loading clients:', error)
      }
    }

    const loadInvoice = async () => {
      if (!props.id) return
      
      try {
        const response = await api.get(`/invoices/${props.id}`)
        const invoice = response.data
        
        Object.assign(form, {
          ...invoice,
          issueDate: new Date(invoice.issueDate).toISOString().split('T')[0],
          dueDate: new Date(invoice.dueDate).toISOString().split('T')[0]
        })
      } catch (error) {
        console.error('Error loading invoice:', error)
        router.push('/invoices')
      }
    }

    const generateInvoiceNumber = async () => {
      try {
        const response = await api.get('/invoices/generate-number')
        form.invoiceNumber = response.data.invoiceNumber
      } catch (error) {
        console.error('Error generating invoice number:', error)
      }
    }

    const addItem = () => {
      form.items.push({
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      })
    }

    const removeItem = (index) => {
      form.items.splice(index, 1)
      calculateTotals()
    }

    const calculateItemTotal = (item) => {
      item.total = (item.quantity || 0) * (item.unitPrice || 0)
      calculateTotals()
    }

    const calculateTotals = () => {
      form.subtotal = form.items.reduce((sum, item) => sum + (item.total || 0), 0)
      form.taxAmount = form.subtotal * (form.taxRate || 0) / 100
      form.total = form.subtotal + form.taxAmount
    }

    const saveInvoice = async () => {
      if (form.items.length === 0) {
        alert('Please add at least one item to the invoice.')
        return
      }

      try {
        saving.value = true
        
        const invoiceData = {
          ...form,
          issueDate: new Date(form.issueDate).toISOString(),
          dueDate: new Date(form.dueDate).toISOString()
        }

        if (isEdit.value) {
          await api.patch(`/invoices/${props.id}`, invoiceData)
        } else {
          await api.post('/invoices', invoiceData)
        }

        router.push('/invoices')
      } catch (error) {
        console.error('Error saving invoice:', error)
        alert('Error saving invoice. Please try again.')
      } finally {
        saving.value = false
      }
    }

    // Watch for changes in items to recalculate totals
    watch(() => form.items, calculateTotals, { deep: true })

    onMounted(async () => {
      await loadClients()
      
      if (isEdit.value) {
        await loadInvoice()
      } else {
        await generateInvoiceNumber()
        addItem() // Start with one item
      }
    })

    return {
      form,
      clients,
      saving,
      isEdit,
      addItem,
      removeItem,
      calculateItemTotal,
      calculateTotals,
      generateInvoiceNumber,
      saveInvoice
    }
  }
}
</script> 