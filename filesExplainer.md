# File Structure Documentation

## Project Overview
This is a comprehensive Tinder Optimizer web application built with React, TypeScript, Express.js, and real Tinder API integration. The project follows modern full-stack architecture patterns with proper separation of concerns.

## File Tree Analysis

### Import Complexity Legend
- 🟢 **Low** (0-3 imports): Simple components or utility files
- 🟡 **Medium** (4-7 imports): Standard components with moderate dependencies
- 🔴 **High** (8+ imports): Complex components with many dependencies

```
tinder-optimizer/
├── 🟡 package.json                          # Project dependencies and scripts configuration
├── 🟢 package-lock.json                     # Dependency lock file for reproducible builds
├── 🟢 tsconfig.json                         # TypeScript compiler configuration
├── 🟢 vite.config.ts                        # Vite build tool configuration with aliases
├── 🟡 vitest.config.ts                      # Vitest testing framework configuration
├── 🟢 tailwind.config.ts                    # Tailwind CSS styling configuration
├── 🟢 postcss.config.js                     # PostCSS processing configuration
├── 🟢 components.json                       # shadcn/ui component library configuration
├── 🟢 drizzle.config.ts                     # Drizzle ORM database configuration
├── 🟢 tinder-api-swagger.yaml              # Official Tinder API documentation
├── 🟢 .replit                              # Replit environment configuration
├── 🟢 .gitignore                           # Git ignore patterns
├── 🟡 replit.md                            # Project documentation and architecture notes
├── 🟢 README.md                            # Project overview and setup instructions
│
├── attached_assets/
│   ├── 🟢 Pasted--Tinder-API-documentation...txt  # Tinder API reference documentation
│   └── 🟢 Pasted-You-are-a-technical...txt       # Documentation generation instructions
│
├── shared/
│   └── 🟡 schema.ts                        # Shared database schema and type definitions
│
├── server/
│   ├── 🔴 index.ts                         # Express server entry point with middleware setup
│   ├── 🔴 routes.ts                        # API route handlers for all endpoints
│   ├── 🟡 storage.ts                       # Data storage interface and implementation
│   ├── 🟡 tinder-service.ts               # Tinder API service wrapper and integration
│   └── 🟢 vite.ts                         # Vite development server integration
│
├── client/
│   ├── 🟢 index.html                      # HTML entry point for React application
│   └── src/
│       ├── 🟡 main.tsx                    # React application entry point
│       ├── 🔴 App.tsx                     # Main app component with routing
│       ├── 🟢 index.css                   # Global CSS styles and Tailwind imports
│       │
│       ├── components/
│       │   ├── 🟢 theme-provider.tsx      # Dark/light theme context provider
│       │   │
│       │   ├── dashboard/
│       │   │   ├── 🟡 activity-feed.tsx           # User activity timeline component
│       │   │   ├── 🔴 advanced-analytics.tsx      # Analytics dashboard with charts
│       │   │   ├── 🟡 app-header.tsx              # Application header with navigation
│       │   │   ├── 🔴 auto-swipe-settings.tsx     # Auto-swipe configuration panel
│       │   │   ├── 🟢 floating-action-button.tsx  # Quick action floating button
│       │   │   ├── 🟡 intelligent-auto-swipe.tsx  # Smart swiping algorithm interface
│       │   │   ├── 🟡 profile-optimization.tsx    # Profile improvement suggestions
│       │   │   ├── 🔴 stats-overview.tsx          # Main statistics overview cards
│       │   │   └── 🔴 teaser-unblur.tsx           # Teaser image unblurring feature
│       │   │
│       │   └── ui/
│       │       ├── 🟡 accordion.tsx        # Collapsible content component
│       │       ├── 🟡 alert-dialog.tsx     # Modal dialog for alerts
│       │       ├── 🟡 alert.tsx            # Alert notification component
│       │       ├── 🟢 aspect-ratio.tsx     # Aspect ratio utility component
│       │       ├── 🟡 avatar.tsx           # User avatar display component
│       │       ├── 🟡 badge.tsx            # Status badge component
│       │       ├── 🟡 breadcrumb.tsx       # Navigation breadcrumb component
│       │       ├── 🟡 button.tsx           # Primary button component
│       │       ├── 🔴 calendar.tsx         # Date picker calendar component
│       │       ├── 🟡 card.tsx             # Content card container component
│       │       ├── 🔴 carousel.tsx         # Image carousel component
│       │       ├── 🔴 chart.tsx            # Chart visualization component
│       │       ├── 🟡 checkbox.tsx         # Checkbox input component
│       │       ├── 🟡 collapsible.tsx      # Collapsible content wrapper
│       │       ├── 🔴 command.tsx          # Command palette component
│       │       ├── 🟡 context-menu.tsx     # Right-click context menu
│       │       ├── 🟡 dialog.tsx           # Modal dialog component
│       │       ├── 🟡 drawer.tsx           # Slide-out drawer component
│       │       ├── 🟡 dropdown-menu.tsx    # Dropdown menu component
│       │       ├── 🔴 form.tsx             # Form wrapper with validation
│       │       ├── 🟡 hover-card.tsx       # Hover popup card component
│       │       ├── 🟡 input-otp.tsx        # OTP input field component
│       │       ├── 🟡 input.tsx            # Text input field component
│       │       ├── 🟡 label.tsx            # Form label component
│       │       ├── 🟡 menubar.tsx          # Top menu bar component
│       │       ├── 🟡 navigation-menu.tsx  # Navigation menu component
│       │       ├── 🟡 pagination.tsx       # Page navigation component
│       │       ├── 🟡 popover.tsx          # Popup overlay component
│       │       ├── 🟡 progress.tsx         # Progress bar component
│       │       ├── 🟡 radio-group.tsx      # Radio button group component
│       │       ├── 🟡 resizable.tsx        # Resizable panel component
│       │       ├── 🟡 scroll-area.tsx      # Custom scrollbar component
│       │       ├── 🟡 select.tsx           # Dropdown select component
│       │       ├── 🟡 separator.tsx        # Visual separator line
│       │       ├── 🟡 sheet.tsx            # Side sheet overlay component
│       │       ├── 🔴 sidebar.tsx          # Application sidebar component
│       │       ├── 🟡 skeleton.tsx         # Loading skeleton component
│       │       ├── 🟡 slider.tsx           # Range slider component
│       │       ├── 🟡 switch.tsx           # Toggle switch component
│       │       ├── 🟡 table.tsx            # Data table component
│       │       ├── 🟡 tabs.tsx             # Tab navigation component
│       │       ├── 🟡 textarea.tsx         # Multi-line text input
│       │       ├── 🟡 toast.tsx            # Toast notification component
│       │       ├── 🟡 toaster.tsx          # Toast notification manager
│       │       ├── 🟡 toggle-group.tsx     # Toggle button group component
│       │       ├── 🟡 toggle.tsx           # Single toggle button component
│       │       └── 🟡 tooltip.tsx          # Hover tooltip component
│       │
│       ├── hooks/
│       │   ├── 🟡 use-mobile.tsx           # Mobile device detection hook
│       │   └── 🟡 use-toast.ts             # Toast notification management hook
│       │
│       ├── lib/
│       │   ├── 🔴 auto-swiper.ts           # Automated swiping algorithm implementation
│       │   ├── 🟡 queryClient.ts           # TanStack Query client configuration
│       │   ├── 🔴 tinder-api.ts            # Tinder API client with authentication
│       │   ├── 🟡 tinder-optimizer.ts      # Profile optimization algorithms
│       │   └── 🟡 utils.ts                 # Utility functions and helpers
│       │
│       ├── pages/
│       │   ├── 🔴 dashboard.tsx            # Main dashboard page component
│       │   └── 🟡 not-found.tsx            # 404 error page component
│       │
│       └── types/
│           └── 🔴 tinder.ts                # TypeScript type definitions for Tinder API
│
└── tests/
    ├── 🟡 setup.ts                         # Test environment configuration
    │
    ├── integration/
    │   └── 🔴 tinder-api-integration.test.ts  # Tinder API integration tests
    │
    ├── lib/
    │   ├── 🔴 auto-swiper.test.ts          # Auto-swiper algorithm unit tests
    │   └── 🔴 tinder-api.test.ts           # Tinder API client unit tests
    │
    └── server/
        └── 🔴 routes.test.ts               # API route handler unit tests
```

## Statistics Summary

- **Total Files:** 78
- **Import Complexity Distribution:**
  - 🟢 **Low Complexity (0-3 imports):** 32 files (41%)
  - 🟡 **Medium Complexity (4-7 imports):** 31 files (40%)
  - 🔴 **High Complexity (8+ imports):** 15 files (19%)

## Architecture Highlights

### Frontend Structure
- **React + TypeScript** with Vite for fast development
- **shadcn/ui** component library for consistent UI
- **TanStack Query** for server state management
- **Wouter** for lightweight routing

### Backend Structure
- **Express.js** with TypeScript
- **Real Tinder API integration** with proper authentication
- **Drizzle ORM** for database operations
- **Memory storage** with database-ready schema

### Testing Strategy
- **Vitest** for unit and integration testing
- **Comprehensive test coverage** for API, algorithms, and routes
- **Mock data** for isolated testing environments

### Key Features
- **Auto-Swipe Algorithm:** Intelligent profile filtering and automated swiping
- **Teaser Unblurring:** Real Tinder API integration for revealing blurred images
- **Analytics Dashboard:** Real-time statistics and performance tracking
- **Profile Optimization:** AI-driven suggestions for profile improvement