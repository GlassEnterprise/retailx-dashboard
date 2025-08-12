'use client'

import { useState, useEffect } from 'react'
import { ApiClient } from '@/lib/api'

interface Message {
  messageId: string
  recipients: string[]
  content: string
  channels: string[]
  status: string
  priority: string
  category: string
  createdAt: string
  deliveredAt?: string
  channelStatus: Record<string, {
    channel: string
    status: string
    deliveredAt?: string
    attempts: number
    errorMessage?: string
  }>
  analytics: {
    totalRecipients: number
    delivered: number
    failed: number
    pending: number
    deliveryRate: number
  }
  mockData: boolean
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Demo message form state
  const [showSendForm, setShowSendForm] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [newMessage, setNewMessage] = useState({
    recipients: ['demo@retailx.com'],
    content: 'Your order has been processed successfully!',
    channels: ['email', 'push'],
    priority: 'medium',
    category: 'order_updates'
  })

  useEffect(() => {
    fetchMessages()
  }, [statusFilter, categoryFilter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiClient.getMessages(statusFilter, categoryFilter)
      setMessages(data as Message[])
    } catch (err) {
      setError('Failed to fetch messages. Using mock data for demo.')
      // Provide mock data for demo purposes
      setMessages([
        {
          messageId: 'msg_demo_001',
          recipients: ['customer@example.com'],
          content: 'Your order #12345 has been shipped!',
          channels: ['email', 'push'],
          status: 'delivered',
          priority: 'high',
          category: 'order_updates',
          createdAt: '2024-01-15T10:30:00',
          deliveredAt: '2024-01-15T10:30:05',
          channelStatus: {
            email: { channel: 'email', status: 'delivered', deliveredAt: '2024-01-15T10:30:05', attempts: 1 },
            push: { channel: 'push', status: 'delivered', deliveredAt: '2024-01-15T10:30:03', attempts: 1 }
          },
          analytics: { totalRecipients: 2, delivered: 2, failed: 0, pending: 0, deliveryRate: 100.0 },
          mockData: true
        },
        {
          messageId: 'msg_demo_002',
          recipients: ['admin@retailx.com'],
          content: 'Low inventory alert: Product SKU-789 is running low',
          channels: ['email', 'sms'],
          status: 'partially_delivered',
          priority: 'medium',
          category: 'inventory_alerts',
          createdAt: '2024-01-15T09:15:00',
          deliveredAt: '2024-01-15T09:15:02',
          channelStatus: {
            email: { channel: 'email', status: 'delivered', deliveredAt: '2024-01-15T09:15:02', attempts: 1 },
            sms: { channel: 'sms', status: 'failed', attempts: 2, errorMessage: 'Mock delivery failure for demo' }
          },
          analytics: { totalRecipients: 2, delivered: 1, failed: 1, pending: 0, deliveryRate: 50.0 },
          mockData: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const sendDemoMessage = async () => {
    try {
      setSendingMessage(true)
      const response = await ApiClient.sendMessage({
        ...newMessage,
        demoMode: true
      })
      
      // Add the new message to the list
      setMessages(prev => [response as Message, ...prev])
      setShowSendForm(false)
      
      // Reset form
      setNewMessage({
        recipients: ['demo@retailx.com'],
        content: 'Your order has been processed successfully!',
        channels: ['email', 'push'],
        priority: 'medium',
        category: 'order_updates'
      })
    } catch (err) {
      setError('Failed to send message. This is expected in demo mode.')
    } finally {
      setSendingMessage(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'partially_delivered': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Modern Messaging Hub</h1>
          <p className="text-gray-600">
            Advanced multi-channel messaging with delivery analytics and tracking
          </p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="partially_delivered">Partially Delivered</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="order_updates">Order Updates</option>
            <option value="inventory_alerts">Inventory Alerts</option>
            <option value="promotions">Promotions</option>
            <option value="system_alerts">System Alerts</option>
          </select>

          <button
            onClick={() => setShowSendForm(!showSendForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showSendForm ? 'Cancel' : 'Send Demo Message'}
          </button>

          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Refresh
          </button>
        </div>

        {/* Send Message Form */}
        {showSendForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Send Demo Message</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <input
                  type="text"
                  value={newMessage.recipients.join(', ')}
                  onChange={(e) => setNewMessage({...newMessage, recipients: e.target.value.split(', ')})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                <input
                  type="text"
                  value={newMessage.channels.join(', ')}
                  onChange={(e) => setNewMessage({...newMessage, channels: e.target.value.split(', ')})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newMessage.priority}
                  onChange={(e) => setNewMessage({...newMessage, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newMessage.category}
                  onChange={(e) => setNewMessage({...newMessage, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="order_updates">Order Updates</option>
                  <option value="inventory_alerts">Inventory Alerts</option>
                  <option value="promotions">Promotions</option>
                  <option value="system_alerts">System Alerts</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={sendDemoMessage}
                disabled={sendingMessage}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages found. Try sending a demo message!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.messageId} className="bg-white rounded-lg shadow-md border p-6">
                {/* Message Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {message.messageId}
                      {message.mockData && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          DEMO DATA
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(message.status)}`}>
                      {message.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                      {message.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-4">
                  <p className="text-gray-800 mb-2">{message.content}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span>Recipients: {message.recipients.join(', ')}</span>
                    <span>•</span>
                    <span>Category: {message.category}</span>
                    <span>•</span>
                    <span>Channels: {message.channels.join(', ')}</span>
                  </div>
                </div>

                {/* Channel Status */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Channel Delivery Status:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.values(message.channelStatus).map((channel) => (
                      <div key={channel.channel} className="p-3 bg-gray-50 rounded border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{channel.channel.toUpperCase()}</span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(channel.status)}`}>
                            {channel.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div>Attempts: {channel.attempts}</div>
                          {channel.deliveredAt && (
                            <div>Delivered: {new Date(channel.deliveredAt).toLocaleTimeString()}</div>
                          )}
                          {channel.errorMessage && (
                            <div className="text-red-600 mt-1">{channel.errorMessage}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Analytics:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{message.analytics.totalRecipients}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{message.analytics.delivered}</div>
                      <div className="text-xs text-gray-600">Delivered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{message.analytics.failed}</div>
                      <div className="text-xs text-gray-600">Failed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{message.analytics.pending}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{message.analytics.deliveryRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modern Features Notice */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🚀 Modern Messaging Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-1">Enhanced Capabilities:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Multi-channel delivery (email, SMS, push, in-app, webhook)</li>
                <li>Template support with variable substitution</li>
                <li>Scheduled message delivery</li>
                <li>Priority levels and delivery preferences</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Advanced Analytics:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Per-channel delivery tracking</li>
                <li>Retry attempt monitoring</li>
                <li>Delivery success rates and metrics</li>
                <li>Real-time status updates</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-xs text-blue-700">
            <strong>Migration Note:</strong> This modern service replaces the legacy foo-notifications-api 
            with enhanced features, better error handling, and comprehensive analytics.
          </div>
        </div>
      </div>
    </div>
  )
}
