# RetailX Dashboard

Enterprise admin dashboard for managing RetailX operations including inventory, orders, and system notifications.

## Overview

The RetailX Dashboard is a Next.js TypeScript application that provides a centralized interface for administrators to monitor and manage various aspects of the RetailX ecosystem. It integrates with multiple microservices to provide real-time data and operational insights.

## Dependencies

### External Services
- **retailx-inventory-api** (port 8082) - Inventory management service
- **retailx-orders-api** (port 8081) - Order processing service  
- **foo-legacy-notifications-api** (port 8080) - Legacy notification system
- **retailx-ui-components** - Shared UI component library
- **retailx-core-commons** - Shared Java utilities (indirect dependency)

### Technology Stack
- **Next.js 15.x** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 19.x** - UI library
- **ESLint** - Code linting

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- All dependent APIs running (see External Services above)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API endpoints
```

3. Run the development server:
```bash
npm run dev
```

The dashboard will be available at [http://localhost:3001](http://localhost:3001)

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server on port 3001
- `npm run lint` - Run ESLint

## Features

### Pages

- **/** - Admin welcome page with system overview and quick stats
- **/inventory** - Inventory management interface with real-time stock levels
- **/orders** - Order tracking and management dashboard

### Key Functionality

- Real-time data fetching from multiple APIs
- Responsive design with Tailwind CSS
- Error handling and loading states
- Integration with legacy notification system
- Enterprise-ready dashboard components

## Architecture

```
retailx-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with global styles
│   │   ├── page.tsx            # Dashboard home page
│   │   ├── inventory/
│   │   │   └── page.tsx        # Inventory management page
│   │   ├── orders/
│   │   │   └── page.tsx        # Order management page
│   │   └── globals.css         # Global styles and Tailwind
├── .env.local                  # Environment configuration
├── Dockerfile                  # Container configuration
└── README.md                   # This file
```

## API Integration

The dashboard integrates with the following APIs:

1. **Inventory API** (`/inventory`)
   - GET - Fetch inventory items
   - PUT - Update inventory quantities

2. **Orders API** (`/orders`) 
   - GET - Fetch order list
   - PUT - Update order status

3. **Notifications API** (`/notifications`)
   - GET - Fetch system alerts and notifications

## Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t retailx-dashboard .

# Run the container
docker run -p 3001:3001 retailx-dashboard
```

## TODOs

### High Priority
- [ ] Integrate retailx-ui-components properly for consistent styling
- [ ] Implement proper error handling and retry mechanisms
- [ ] Add authentication and authorization
- [ ] Implement real-time updates with WebSocket connections
- [ ] Add comprehensive loading states and skeleton screens

### Medium Priority  
- [ ] Add filtering and sorting for inventory and orders tables
- [ ] Implement export functionality for reports
- [ ] Add pagination for large datasets
- [ ] Create detailed order and inventory item views
- [ ] Add bulk operations for inventory and order management

### Low Priority
- [ ] Implement dark mode support
- [ ] Add advanced analytics and reporting
- [ ] Create user preference settings
- [ ] Add keyboard shortcuts for power users
- [ ] Implement offline support with service workers

### Technical Debt
- [ ] Add comprehensive unit and integration tests
- [ ] Implement proper TypeScript interfaces for all API responses
- [ ] Add API response caching and optimization
- [ ] Configure proper logging and monitoring
- [ ] Add performance monitoring and analytics

## Development Notes

- The dashboard runs on port 3001 to avoid conflicts with other RetailX services
- All API calls use environment variables for endpoint configuration
- The application follows Next.js App Router conventions
- Tailwind CSS is used for styling with custom dashboard-specific classes
- Error boundaries and loading states are implemented for better UX

## Related Repositories

- `retailx-inventory-api` - Inventory management microservice
- `retailx-orders-api` - Order processing microservice
- `foo-legacy-notifications-api` - Legacy notification system
- `retailx-ui-components` - Shared React component library
- `retailx-core-commons` - Shared Java utilities
- `retailx-web` - Customer-facing web application

## Contributing

1. Follow the existing code style and patterns
2. Add appropriate TODO comments for future enhancements
3. Ensure all new features include proper error handling
4. Test integration with all dependent services
5. Update this README when adding new features or dependencies
