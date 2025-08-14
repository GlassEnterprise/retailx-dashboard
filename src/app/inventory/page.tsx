'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ApiClient } from '@/lib/api'
import { InventoryItem, Notification } from '@/types'

// TODO: Import UI components from retailx-ui-components
// import { Card, Button } from 'retailx-ui-components'

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch inventory data and notifications in parallel using ApiClient
      const [inventoryResult, notificationsResult] = await Promise.allSettled([
        ApiClient.getInventory(),
        ApiClient.getLegacyNotifications()
      ])

      // Process inventory data
      if (inventoryResult.status === 'fulfilled') {
        const inventoryData = inventoryResult.value
        setInventory(Array.isArray(inventoryData) ? inventoryData : [])
      } else {
        console.error('Failed to fetch inventory data:', inventoryResult.reason)
        setError('Failed to load inventory data. Please try again.')
      }

      // Process notifications data
      if (notificationsResult.status === 'fulfilled') {
        const notificationsData = notificationsResult.value
        if (Array.isArray(notificationsData)) {
          const inventoryAlerts = notificationsData
            .filter((notif: any) => notif.message?.toLowerCase().includes('inventory'))
            .slice(0, 3)
            .map((notif: any) => ({
              id: notif.id || Math.random().toString(),
              message: notif.message || 'No message',
              type: notif.type || 'info',
              timestamp: notif.timestamp || new Date().toISOString()
            }))
          setNotifications(inventoryAlerts)
        }
      } else {
        console.warn('Failed to fetch notifications:', notificationsResult.reason)
        // Don't set error for notifications failure, just log it
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error)
      setError('Failed to load inventory data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInventory = async (itemId: string, newQuantity: number) => {
    try {
      await ApiClient.updateInventoryItem(itemId, { quantity: newQuantity })
      // Refresh inventory data after successful update
      fetchInventoryData()
    } catch (error) {
      console.error('Error updating inventory:', error)
      setError('Failed to update inventory item. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg">Loading inventory data...</div>
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
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage product inventory levels
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
            onClick={fetchInventoryData}
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Inventory Alerts */}
      {notifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Inventory Alerts
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

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Items</h3>
          <div className="text-3xl font-bold text-blue-600">{inventory.length}</div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Stock Items</h3>
          <div className="text-3xl font-bold text-red-600">
            {inventory.filter(item => item.quantity < 10).length}
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Value</h3>
          <div className="text-3xl font-bold text-green-600">
            ${inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="dashboard-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Inventory Items
        </h2>
        {inventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${item.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.quantity === 0 ? 'bg-red-100 text-red-800' :
                        item.quantity < 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.quantity === 0 ? 'Out of Stock' :
                         item.quantity < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No inventory items found</p>
            <button 
              onClick={fetchInventoryData}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>

      {/* TODO: Add inventory management actions (add, edit, delete items) */}
      {/* TODO: Implement filtering and sorting functionality */}
      {/* TODO: Add export functionality for inventory reports */}
    </div>
  )
}
