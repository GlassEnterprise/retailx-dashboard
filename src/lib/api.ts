// API client utilities for RetailX Dashboard
// TODO: Add proper error handling and retry logic
// TODO: Implement request/response interceptors
// TODO: Add authentication headers when auth is implemented

const API_ENDPOINTS = {
  INVENTORY: process.env.NEXT_PUBLIC_INVENTORY_API_URL || 'http://localhost:8083',
  ORDERS: process.env.NEXT_PUBLIC_ORDERS_API_URL || 'http://localhost:8082',
  LEGACY_NOTIFICATIONS: process.env.NEXT_PUBLIC_LEGACY_NOTIFICATIONS_API_URL || 'http://localhost:8081',
  MESSAGING_HUB: process.env.NEXT_PUBLIC_MESSAGING_HUB_API_URL || 'http://localhost:8084'
}

export class ApiClient {
  private static async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Inventory API methods
  static async getInventory() {
    return this.request(`${API_ENDPOINTS.INVENTORY}/api/inventory`)
  }

  static async updateInventoryItem(itemId: string, data: any) {
    return this.request(`${API_ENDPOINTS.INVENTORY}/api/inventory/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Orders API methods
  static async getOrders() {
    return this.request(`${API_ENDPOINTS.ORDERS}/api/orders`)
  }

  static async updateOrderStatus(orderId: string, status: string) {
    return this.request(`${API_ENDPOINTS.ORDERS}/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  static async createOrder(orderData: any) {
    return this.request(`${API_ENDPOINTS.ORDERS}/api/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  // Legacy Notifications API methods
  static async getLegacyNotifications() {
    return this.request(`${API_ENDPOINTS.LEGACY_NOTIFICATIONS}/api/notifications`)
  }

  static async getLegacyNotificationsByType(type: string) {
    return this.request(`${API_ENDPOINTS.LEGACY_NOTIFICATIONS}/api/notifications?type=${type}`)
  }

  // Modern Messaging Hub API methods
  static async getMessages(status?: string, category?: string, page = 0, size = 20) {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (category) params.append('category', category)
    params.append('page', page.toString())
    params.append('size', size.toString())
    
    return this.request(`${API_ENDPOINTS.MESSAGING_HUB}/v2/messages?${params}`)
  }

  static async getMessageById(messageId: string) {
    return this.request(`${API_ENDPOINTS.MESSAGING_HUB}/v2/messages/${messageId}`)
  }

  static async sendMessage(messageData: any) {
    return this.request(`${API_ENDPOINTS.MESSAGING_HUB}/v2/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  // Health check methods
  static async checkServiceHealth() {
    const services = ['INVENTORY', 'ORDERS', 'LEGACY_NOTIFICATIONS', 'MESSAGING_HUB'] as const
    const healthChecks = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const response = await fetch(`${API_ENDPOINTS[service]}/health`, {
            method: 'GET',
            timeout: 5000,
          } as any)
          return { service, healthy: response.ok }
        } catch {
          return { service, healthy: false }
        }
      })
    )

    return healthChecks.map((result, index) => ({
      service: services[index],
      healthy: result.status === 'fulfilled' ? result.value.healthy : false
    }))
  }
}

// TODO: Add request caching layer
// TODO: Implement request deduplication
// TODO: Add request timeout configuration
// TODO: Implement exponential backoff for retries
