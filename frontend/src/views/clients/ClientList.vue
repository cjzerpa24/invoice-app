<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
        <p class="mt-1 text-sm text-gray-600">Manage your client information</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/clients/new" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Client
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Clients Table -->
    <div v-else-if="clients.length > 0" class="card">
      <div class="overflow-x-auto">
        <table class="table-auto">
          <thead>
            <tr>
              <th class="table-header">Name</th>
              <th class="table-header">Email</th>
              <th class="table-header">Phone</th>
              <th class="table-header">Location</th>
              <th class="table-header">Invoices</th>
              <th class="table-header">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in clients" :key="client.id">
              <td class="table-cell">
                <div class="font-medium">{{ client.name }}</div>
              </td>
              <td class="table-cell">
                <div class="text-gray-500">{{ client.email }}</div>
              </td>
              <td class="table-cell">
                <div class="text-gray-500">{{ client.phone || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-gray-500">
                  {{ formatLocation(client) }}
                </div>
              </td>
              <td class="table-cell">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ client.invoices?.length || 0 }} invoices
                </span>
              </td>
              <td class="table-cell">
                <div class="flex space-x-2">
                  <router-link 
                    :to="`/clients/${client.id}/edit`" 
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </router-link>
                  <button 
                    @click="deleteClient(client)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No clients</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new client.</p>
      <div class="mt-6">
        <router-link to="/clients/new" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Client
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { clientsAPI } from '../../services/api'

export default {
  name: 'ClientList',
  setup() {
    const clients = ref([])
    const loading = ref(true)

    const loadClients = async () => {
      try {
        loading.value = true
        const response = await clientsAPI.getAll()
        clients.value = response.data
      } catch (error) {
        console.error('Error loading clients:', error)
      } finally {
        loading.value = false
      }
    }

    const deleteClient = async (client) => {
      if (confirm(`Are you sure you want to delete ${client.name}?`)) {
        try {
          await clientsAPI.delete(client.id)
          await loadClients()
        } catch (error) {
          console.error('Error deleting client:', error)
          alert('Error deleting client')
        }
      }
    }

    const formatLocation = (client) => {
      const parts = [client.city, client.state, client.country].filter(Boolean)
      return parts.length > 0 ? parts.join(', ') : '-'
    }

    onMounted(() => {
      loadClients()
    })

    return {
      clients,
      loading,
      deleteClient,
      formatLocation
    }
  }
}
</script> 