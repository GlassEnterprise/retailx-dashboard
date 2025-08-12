'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// TODO: Import UI components from retailx-ui-components once properly configured
// import { Card, Button, Header } from 'retailx-ui-components'

interface DashboardStats {
  totalOrders: number
  totalInventoryItems: number
  pendingNotifications: number
  systemStatus: 'healthy' | 'warning' | 'error'
}

interface Notification {
  id: string
  message: string
  type: 'info' | 'warning' | 'error'
  timestamp: string
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalInventoryItems: 0,
    pendingNotifications: 0,
    systemStatus: 'healthy'
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implement proper error handling and retry logic
    // TODO: Add loading states for better UX
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch data from all APIs in parallel
      const [ordersResponse, inventoryResponse, notificationsResponse] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_ORDERS_API_URL}/api/orders`),
        fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/inventory`),
        fetch(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/notifications`)
      ])

      // Process orders data
      let totalOrders = 0
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value.ok) {
        const ordersData = await ordersResponse.value.json()
        totalOrders = Array.isArray(ordersData) ? ordersData.length : 0
      }

      // Process inventory data
      let totalInventoryItems = 0
      if (inventoryResponse.status === 'fulfilled' && inventoryResponse.value.ok) {
        const inventoryData = await inventoryResponse.value.json()
        totalInventoryItems = Array.isArray(inventoryData) ? inventoryData.length : 0
      }

      // Process notifications data
      let pendingNotifications = 0
      let latestNotifications: Notification[] = []
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.ok) {
        const notificationsData = await notificationsResponse.value.json()
        if (Array.isArray(notificationsData)) {
          latestNotifications = notificationsData.slice(0, 5).map((notif: any) => ({
            id: notif.id || Math.random().toString(),
            message: notif.message || 'No message',
            type: notif.type || 'info',
            timestamp: notif.timestamp || new Date().toISOString()
          }))
          pendingNotifications = notificationsData.length
        }
      }

      setStats({
        totalOrders,
        totalInventoryItems,
        pendingNotifications,
        systemStatus: 'healthy' // TODO: Implement proper health check logic
      })
      setNotifications(latestNotifications)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // TODO: Implement proper error handling UI
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          RetailX Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to the enterprise operations center
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/inventory" className="dashboard-card hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inventory Management
          </h3>
          <p className="text-gray-600 mb-4">
            View and manage product inventory levels
          </p>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalInventoryItems} items
          </div>
        </Link>

        <Link href="/orders" className="dashboard-card hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Management
          </h3>
          <p className="text-gray-600 mb-4">
            Track and process customer orders
          </p>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalOrders} orders
          </div>
        </Link>

        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            System Status
          </h3>
          <p className="text-gray-600 mb-4">
            Overall system health and alerts
          </p>
          <div className={`text-2xl font-bold ${
            stats.systemStatus === 'healthy' ? 'text-green-600' : 
            stats.systemStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stats.systemStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="dashboard-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Notifications ({stats.pendingNotifications})
        </h2>
        {notifications.length > 0 ? (
          <div className="space-y-3">
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
        ) : (
          <p className="text-gray-500">No recent notifications</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link 
          href="/inventory" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Manage Inventory
        </Link>
        <Link 
          href="/orders" 
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          View Orders
        </Link>
        {/* TODO: Add more quick action buttons */}
        {/* TODO: Implement refresh data functionality */}
      </div>
    </div>
  )
}
