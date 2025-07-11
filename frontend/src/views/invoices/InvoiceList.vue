<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Invoices</h1>
        <p class="text-gray-600">Manage your invoices and payments</p>
      </div>
      <router-link
        to="/invoices/new"
        class="btn btn-primary"
      >
        Create Invoice
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search invoices..."
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- Invoices Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="spinner mx-auto"></div>
        <p class="text-gray-600 mt-2">Loading invoices...</p>
      </div>
      
      <div v-else-if="filteredInvoices.length === 0" class="p-8 text-center">
        <p class="text-gray-600">No invoices found.</p>
      </div>

      <table v-else class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="table-header">Invoice #</th>
            <th class="table-header">Client</th>
            <th class="table-header">Issue Date</th>
            <th class="table-header">Due Date</th>
            <th class="table-header">Amount</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
            <td class="table-cell">
              <div class="font-medium text-gray-900">{{ invoice.invoiceNumber }}</div>
              <div v-if="invoice.description" class="text-sm text-gray-500">{{ invoice.description }}</div>
            </td>
            <td class="table-cell">
              <div class="font-medium text-gray-900">{{ invoice.client?.name }}</div>
              <div class="text-sm text-gray-500">{{ invoice.client?.email }}</div>
            </td>
            <td class="table-cell">{{ formatDate(invoice.issueDate) }}</td>
            <td class="table-cell">{{ formatDate(invoice.dueDate) }}</td>
            <td class="table-cell">
              <div class="font-medium">${{ invoice.total.toFixed(2) }}</div>
            </td>
            <td class="table-cell">
              <select
                :value="invoice.status"
                @change="updateStatus(invoice.id, $event.target.value)"
                class="status-select"
                :class="getStatusClass(invoice.status)"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td class="table-cell">
              <div class="flex space-x-2">
                <button
                  @click="previewInvoice(invoice)"
                  class="btn-icon btn-secondary"
                  title="Preview Invoice"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                
                <!-- PDF Download Dropdown -->
                <div class="relative inline-block text-left">
                  <button
                    @click="toggleDropdown(invoice.id)"
                    class="btn-icon btn-secondary"
                    title="Download PDF"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <div
                    v-if="activeDropdown === invoice.id"
                    class="absolute right-0 z-10 mt-1 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    @click.stop
                  >
                    <div class="py-1">
                      <button
                        @click="downloadPdf(invoice, 'en')"
                        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        English PDF
                      </button>
                      <button
                        @click="downloadPdf(invoice, 'es')"
                        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Español PDF
                      </button>
                    </div>
                  </div>
                </div>
                
                <router-link
                  :to="`/invoices/${invoice.id}/edit`"
                  class="btn-icon btn-secondary"
                  title="Edit Invoice"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </router-link>
                <button
                  @click="deleteInvoice(invoice.id)"
                  class="btn-icon btn-danger"
                  title="Delete Invoice"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PDF Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreview">
      <div class="modal-content max-w-4xl w-full" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold">Invoice Preview</h3>
          <div class="flex items-center space-x-4">
            <!-- Language Selector -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Language:</label>
              <select v-model="selectedLanguage" @change="updatePreview" class="form-select text-sm">
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <button @click="closePreview" class="btn-icon">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="modal-body">
          <div v-if="previewLoading" class="text-center py-8">
            <div class="spinner mx-auto"></div>
            <p class="text-gray-600 mt-2">Loading preview...</p>
          </div>
          
          <div v-else-if="previewHtml" class="border rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Invoice Preview ({{ selectedLanguage === 'en' ? 'English' : 'Español' }})</span>
              <div class="space-x-2">
                <button
                  @click="downloadPdf(currentPreviewInvoice, selectedLanguage)"
                  class="btn btn-primary btn-sm"
                >
                  Download PDF
                </button>
              </div>
            </div>
            <div class="bg-white" style="height: 600px; overflow-y: auto;">
              <iframe
                :srcdoc="previewHtml"
                class="w-full h-full"
                frameborder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns'
import api from '../../services/api'

export default {
  name: 'InvoiceList',
  setup() {
    const invoices = ref([])
    const loading = ref(true)
    const statusFilter = ref('')
    const searchQuery = ref('')
    const showPreviewModal = ref(false)
    const previewHtml = ref('')
    const previewLoading = ref(false)
    const currentPreviewInvoice = ref(null)
    const selectedLanguage = ref('en') // Default to English
    const activeDropdown = ref(null) // To track which dropdown is open

    const filteredInvoices = computed(() => {
      let filtered = invoices.value

      if (statusFilter.value) {
        filtered = filtered.filter(invoice => invoice.status === statusFilter.value)
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(invoice => 
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.client?.name.toLowerCase().includes(query) ||
          invoice.client?.email.toLowerCase().includes(query) ||
          (invoice.description && invoice.description.toLowerCase().includes(query))
        )
      }

      return filtered
    })

    const loadInvoices = async () => {
      try {
        loading.value = true
        const response = await api.get('/invoices')
        invoices.value = response.data
      } catch (error) {
        console.error('Error loading invoices:', error)
      } finally {
        loading.value = false
      }
    }

    const updateStatus = async (id, status) => {
      try {
        await api.patch(`/invoices/${id}/status`, { status })
        const invoice = invoices.value.find(inv => inv.id === id)
        if (invoice) {
          invoice.status = status
        }
      } catch (error) {
        console.error('Error updating status:', error)
      }
    }

    const previewInvoice = async (invoice) => {
      try {
        showPreviewModal.value = true
        previewLoading.value = true
        currentPreviewInvoice.value = invoice
        
        const response = await api.get(`/invoices/${invoice.id}/preview`, {
          params: { lang: selectedLanguage.value }
        })
        previewHtml.value = response.data.html
      } catch (error) {
        console.error('Error loading preview:', error)
        alert('Error loading invoice preview')
      } finally {
        previewLoading.value = false
      }
    }

    const downloadPdf = async (invoice, language = 'en') => {
      try {
        console.log('Downloading PDF for invoice:', invoice)
        const response = await api.get(`/invoices/${invoice.id}/pdf`, {
          params: { lang: language },
          responseType: 'blob'
        })
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `invoice-${invoice.invoiceNumber}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        // Close dropdown after download
        activeDropdown.value = null
      } catch (error) {
        console.error('Error downloading PDF:', error)
        alert('Error downloading PDF')
      }
    }

    const closePreview = () => {
      showPreviewModal.value = false
      previewHtml.value = ''
      currentPreviewInvoice.value = null
    }

    const deleteInvoice = async (id) => {
      if (confirm('Are you sure you want to delete this invoice?')) {
        try {
          await api.delete(`/invoices/${id}`)
          invoices.value = invoices.value.filter(invoice => invoice.id !== id)
        } catch (error) {
          console.error('Error deleting invoice:', error)
        }
      }
    }

    const formatDate = (date) => {
      return format(new Date(date), 'MMM dd, yyyy')
    }

    const getStatusClass = (status) => {
      const classes = {
        draft: 'status-draft',
        sent: 'status-sent', 
        paid: 'status-paid',
        overdue: 'status-overdue',
        cancelled: 'status-cancelled'
      }
      return classes[status] || 'status-draft'
    }

    const updatePreview = () => {
      // This function is called when the language selector changes.
      // It will trigger a re-preview of the current invoice with the new language.
      if (currentPreviewInvoice.value) {
        previewInvoice(currentPreviewInvoice.value)
      }
    }

    const toggleDropdown = (invoiceId) => {
      activeDropdown.value = activeDropdown.value === invoiceId ? null : invoiceId
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative.inline-block.text-left')) {
        activeDropdown.value = null
      }
    }

    onMounted(() => {
      loadInvoices()
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      invoices,
      loading,
      statusFilter,
      searchQuery,
      filteredInvoices,
      showPreviewModal,
      previewHtml,
      previewLoading,
      currentPreviewInvoice,
      selectedLanguage,
      updateStatus,
      previewInvoice,
      downloadPdf,
      closePreview,
      deleteInvoice,
      formatDate,
      getStatusClass,
      updatePreview,
      activeDropdown,
      toggleDropdown,
      handleClickOutside
    }
  }
}
</script> 