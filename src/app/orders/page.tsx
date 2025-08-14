'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// TODO: Import UI components from retailx-ui-components
// import { Card, Button } from 'retailx-ui-components'

interface Order {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  shippingAddress: string
}

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface Notification {
  id: string
  message: string
  type: 'info' | 'warning' | 'error'
  timestamp: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrdersData()
  }, [])

  const fetchOrdersData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch orders data and notifications in parallel
      const [ordersResponse, notificationsResponse] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_ORDERS_API_URL}/orders`),
        fetch(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/notifications`)
      ])

      // Process orders data
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value.ok) {
        const ordersData = await ordersResponse.value.json()
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } else {
        console.error('Failed to fetch orders data')
        // TODO: Implement proper error handling
      }

      // Process notifications data for order-related alerts
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.ok) {
        const notificationsData = await notificationsResponse.value.json()
        if (Array.isArray(notificationsData)) {
          const orderAlerts = notificationsData
            .filter((notif: any) => 
              notif.message?.toLowerCase().includes('order') || 
              notif.message?.toLowerCase().includes('shipping')
            )
            .slice(0, 3)
            .map((notif: any) => ({
              id: notif.id || Math.random().toString(),
              message: notif.message || 'No message',
              type: notif.type || 'info',
              timestamp: notif.timestamp || new Date().toISOString()
            }))
          setNotifications(orderAlerts)
        }
      }
    } catch (error) {
      console.error('Error fetching orders data:', error)
      setError('Failed to load orders data. Please try again.')
      // TODO: Implement retry mechanism
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // TODO: Implement order status update functionality
      const response = await fetch(`${process.env.NEXT_PUBLIC_ORDERS_API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh orders data
        fetchOrdersData()
      } else {
        console.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg">Loading orders data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Track and process customer orders
          </p>
        </div>
        <Link 
          href="/" 
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert-banner error mb-6">
          <p>{error}</p>
          <button 
            onClick={fetchOrdersData}
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Order Alerts */}
      {notifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Order Alerts
          </h2>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`alert-banner ${notification.type === 'error' ? 'error' : 
                  notification.type === 'warning' ? '' : 'success'}`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
          <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <div className="text-3xl font-bold text-yellow-600">
            {orders.filter(order => order.status === 'pending').length}
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing</h3>
          <div className="text-3xl font-bold text-blue-600">
            {orders.filter(order => order.status === 'processing').length}
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <div className="text-3xl font-bold text-green-600">
            ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="dashboard-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Orders
        </h2>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-gray-500">ID: {order.customerId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
            <button 
              onClick={fetchOrdersData}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>

      {/* TODO: Add order management actions (update status, view details, cancel orders) */}
      {/* TODO: Implement filtering by status, date range, customer */}
      {/* TODO: Add export functionality for order reports */}
      {/* TODO: Integrate with shipping providers for tracking updates */}
    </div>
  )
}
