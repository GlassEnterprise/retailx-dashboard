// Type definitions for RetailX Dashboard
// TODO: Keep these types in sync with API response schemas
// TODO: Add validation schemas using zod or similar library

export interface InventoryItem {
  id: string
  productName: string
  sku: string
  quantity: number
  price: number
  category: string
  lastUpdated: string
  // TODO: Add more fields like supplier, location, etc.
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  orderDate: string
  shippingAddress: string
  // TODO: Add tracking information, payment details
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  // TODO: Add SKU, category, etc.
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: string
  // TODO: Add priority, category, action buttons
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success'

export interface DashboardStats {
  totalOrders: number
  totalInventoryItems: number
  pendingNotifications: number
  systemStatus: SystemStatus
  // TODO: Add more metrics like revenue, conversion rates, etc.
}

export type SystemStatus = 'healthy' | 'warning' | 'error'

export interface ServiceHealth {
  service: string
  healthy: boolean
  lastChecked?: string
  // TODO: Add response time, error rate metrics
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  // TODO: Add pagination metadata
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

// Form types
export interface UpdateInventoryRequest {
  quantity: number
  // TODO: Add more updatable fields
}

export interface CreateOrderRequest {
  customerId: string
  items: {
    productId: string
    quantity: number
  }[]
  shippingAddress: string
  // TODO: Add payment information, special instructions
}

// Error types
export interface ApiError {
  message: string
  code?: string
  details?: any
}

// TODO: Add user authentication types
// TODO: Add audit log types
// TODO: Add report/analytics types
