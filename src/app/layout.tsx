import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'RetailX Dashboard',
  description: 'Enterprise admin dashboard for RetailX operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation Header */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    RetailX Dashboard
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Overview
                  </Link>
                  <Link 
                    href="/orders" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Orders
                  </Link>
                  <Link 
                    href="/inventory" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Inventory
                  </Link>
                  <Link 
                    href="/messages" 
                    className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium bg-blue-50"
                  >
                    Messages 🚀
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  RetailX Dashboard - Enterprise Operations Portal
                </div>
                <div className="flex space-x-4">
                  <span>Legacy API: Port 8081</span>
                  <span>•</span>
                  <span>Modern Hub: Port 8084</span>
                  <span>•</span>
                  <span>Orders: Port 8082</span>
                  <span>•</span>
                  <span>Inventory: Port 8083</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
