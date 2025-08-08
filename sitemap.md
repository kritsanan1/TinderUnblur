# Site Navigation Map

## Overview
This document provides a comprehensive map of all routes, pages, and navigation paths within the Tinder Optimizer application, including user journey flows and feature accessibility.

## Application Sitemap

### 🏠 Main Application Structure

```
Tinder Optimizer Web Application
├── / (Root/Dashboard)
│   ├── Header Navigation
│   │   ├── Logo/Brand
│   │   ├── Theme Toggle (Dark/Light)
│   │   └── User Menu
│   │
│   ├── Main Dashboard Content
│   │   ├── Stats Overview Cards
│   │   │   ├── Total Matches
│   │   │   ├── Profile Views
│   │   │   ├── Match Rate
│   │   │   └── Profile Score
│   │   │
│   │   ├── Feature Tabs
│   │   │   ├── 📊 Analytics
│   │   │   ├── 🤖 Auto-Swipe
│   │   │   ├── 🔍 Teaser Unblur
│   │   │   ├── ⚡ Profile Optimization
│   │   │   └── 📱 Activity Feed
│   │   │
│   │   └── Floating Action Button
│   │       ├── Quick Settings
│   │       ├── Sync Data
│   │       └── Help/Support
│   │
│   └── Footer
│       ├── Copyright Info
│       ├── Legal Links
│       └── Version Info
│
└── /404 (Not Found Page)
    ├── Error Message
    ├── Navigation Suggestions
    └── Return to Dashboard Link
```

## 📍 Route Definitions

### Primary Routes

| Route | Component | Description | Access Level |
|-------|-----------|-------------|--------------|
| `/` | Dashboard | Main application dashboard with all features | Public |
| `/*` | NotFound | 404 error page for invalid routes | Public |

### Feature Sections (Tab-based Navigation)

| Section | Key | Description | Components |
|---------|-----|-------------|------------|
| **Analytics** | `analytics` | Real-time performance metrics and insights | StatsOverview, AdvancedAnalytics |
| **Auto-Swipe** | `auto-swipe` | Automated swiping configuration and controls | AutoSwipeSettings, IntelligentAutoSwipe |
| **Teaser Unblur** | `teaser-unblur` | Reveal blurred teaser images functionality | TeaserUnblur |
| **Profile Optimization** | `profile-optimization` | AI-driven profile improvement suggestions | ProfileOptimization |
| **Activity Feed** | `activity-feed` | User activity timeline and history | ActivityFeed |

## 🗺️ User Journey Flows

### First-Time User Journey
```
1. Landing on Dashboard
   ↓
2. View Default Analytics Data
   ↓
3. Explore Auto-Swipe Settings
   ↓
4. Configure Preferences
   ↓
5. Test Teaser Unblur (with token)
   ↓
6. Review Profile Optimization Suggestions
   ↓
7. Monitor Activity Feed
```

### Returning User Journey
```
1. Dashboard Load
   ↓
2. Check Updated Analytics
   ↓
3. Review Activity Feed
   ↓
4. Adjust Auto-Swipe Settings
   ↓
5. Use Teaser Unblur Features
   ↓
6. Implement Profile Optimizations
```

### Power User Workflow
```
1. Quick Analytics Review
   ↓
2. Batch Teaser Unblurring
   ↓
3. Fine-tune Auto-Swipe Algorithm
   ↓
4. Monitor Real-time Activity
   ↓
5. Optimize Based on Performance Data
```

## 🧭 Navigation Patterns

### Tab-Based Navigation
The application uses a centralized tab system for feature switching:

```typescript
// Navigation structure in Dashboard component
const tabs = [
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'auto-swipe', label: 'Auto-Swipe', icon: Zap },
  { key: 'teaser-unblur', label: 'Unblur', icon: Eye },
  { key: 'profile-optimization', label: 'Optimize', icon: TrendingUp },
  { key: 'activity-feed', label: 'Activity', icon: Activity }
]
```

### State Management
- **Active Tab**: Managed via React state
- **URL Sync**: Tab state synchronized with URL hash
- **Persistence**: Last viewed tab remembered across sessions

## 📱 Mobile Navigation Patterns

### Responsive Design
- **Desktop**: Full tab bar with labels and icons
- **Tablet**: Condensed tab bar with icons and abbreviated labels
- **Mobile**: Bottom navigation with icon-only tabs

### Mobile-Specific Features
- **Swipe Gestures**: Swipe between tabs on mobile devices
- **Touch Targets**: Optimized touch areas for mobile interaction
- **Collapsible Sections**: Auto-collapse sections on small screens

## 🔗 Deep Linking Support

### URL Structure
```
Base URL: https://tinder-optimizer.app/

Routes:
- /                    # Dashboard (default: analytics tab)
- /#analytics          # Analytics tab
- /#auto-swipe         # Auto-Swipe tab
- /#teaser-unblur      # Teaser Unblur tab
- /#profile-optimization # Profile Optimization tab
- /#activity-feed      # Activity Feed tab
```

### Shareable Links
Users can share direct links to specific features:
- Analytics dashboard: `/#analytics`
- Auto-swipe settings: `/#auto-swipe`
- Teaser unblur tool: `/#teaser-unblur`

## 🎯 Feature Accessibility

### Analytics Dashboard
**Path**: Dashboard → Analytics Tab
**Features**:
- Real-time statistics display
- Performance charts and graphs
- Trend analysis
- Export capabilities

### Auto-Swipe Configuration
**Path**: Dashboard → Auto-Swipe Tab
**Features**:
- Preference settings
- Algorithm configuration
- Manual override controls
- Performance monitoring

### Teaser Unblur Tool
**Path**: Dashboard → Teaser Unblur Tab
**Features**:
- Batch unblur operations
- Individual teaser management
- Success/failure tracking
- API integration status

### Profile Optimization
**Path**: Dashboard → Profile Optimization Tab
**Features**:
- AI-powered suggestions
- Photo analysis
- Bio recommendations
- A/B testing guidance

### Activity Feed
**Path**: Dashboard → Activity Feed Tab
**Features**:
- Chronological activity timeline
- Filter and search capabilities
- Activity categorization
- Export functionality

## 🚀 Quick Actions & Shortcuts

### Floating Action Button (FAB)
**Location**: Bottom-right corner of dashboard
**Quick Actions**:
- Sync Analytics Data
- Emergency Stop Auto-Swipe
- Quick Settings Access
- Help & Support

### Keyboard Shortcuts
```
Navigation:
- Tab: Focus next interactive element
- Shift+Tab: Focus previous interactive element
- Enter/Space: Activate focused element

Feature Shortcuts:
- 1-5: Switch between tabs (Analytics, Auto-Swipe, etc.)
- S: Open settings
- H: Open help
- Esc: Close modals/overlays
```

## 🔄 State Persistence

### Session Storage
- Active tab preference
- Form input values
- Temporary settings

### Local Storage
- Theme preference (dark/light)
- User preferences
- API tokens (if configured)

### URL State
- Current active tab
- Modal states
- Filter preferences

## 🎨 Visual Navigation Cues

### Active State Indicators
- **Active Tab**: Highlighted background and underline
- **Current Section**: Bold text and accent color
- **Interactive Elements**: Hover states and focus rings

### Loading States
- **Tab Loading**: Shimmer effect during data fetch
- **Action Loading**: Spinner icons on buttons
- **Global Loading**: Top progress bar for page transitions

### Error States
- **Tab Errors**: Error badges on tabs with issues
- **Form Errors**: Inline validation messages
- **Global Errors**: Toast notifications for critical issues

## 📊 Analytics & Tracking

### Navigation Analytics
- **Tab Switching**: Track most/least used features
- **User Flow**: Monitor navigation patterns
- **Time Spent**: Measure engagement per section
- **Exit Points**: Identify where users leave

### Performance Metrics
- **Load Times**: Monitor tab switching speed
- **Error Rates**: Track navigation failures
- **User Satisfaction**: Measure navigation ease

## 🔧 Development Navigation Notes

### Route Registration
```typescript
// Main routing in App.tsx
<Router>
  <Route path="/" component={Dashboard} />
  <Route path="/*" component={NotFound} />
</Router>
```

### Tab Management
```typescript
// Tab switching logic in Dashboard
const [activeTab, setActiveTab] = useState('analytics')

// URL synchronization
useEffect(() => {
  const hash = window.location.hash.slice(1)
  if (hash && tabs.find(tab => tab.key === hash)) {
    setActiveTab(hash)
  }
}, [])
```

### Navigation Testing
- **Unit Tests**: Tab switching functionality
- **Integration Tests**: End-to-end navigation flows
- **Accessibility Tests**: Keyboard navigation and screen readers
- **Mobile Tests**: Touch and gesture navigation

## 🎯 Future Navigation Enhancements

### Planned Features
- **Breadcrumb Navigation**: For complex multi-step processes
- **Progressive Web App**: Native-like navigation patterns
- **Voice Navigation**: Voice commands for accessibility
- **Gesture Controls**: Advanced touch gestures

### Accessibility Improvements
- **Screen Reader**: Enhanced ARIA labels and landmarks
- **High Contrast**: Better visual indicators
- **Reduced Motion**: Respect user motion preferences
- **Focus Management**: Improved keyboard navigation flow