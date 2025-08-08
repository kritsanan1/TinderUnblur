# Tinder Optimizer

## Overview

A comprehensive web application designed to enhance Tinder profiles through automated optimization features. The system provides analytics, auto-swiping capabilities, teaser unblurring, and profile improvement suggestions to maximize match rates and user engagement on the Tinder platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider with dark/light mode support
- **Component Structure**: Modular dashboard components for different features (stats, teaser unblur, auto-swipe settings, profile optimization, activity feed)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints following REST conventions
- **Storage**: In-memory storage implementation with interface abstraction for easy database migration
- **Development**: Hot module replacement via Vite integration for seamless development experience

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (Neon database integration)
- **Schema**: Structured tables for users, preferences, analytics, teasers, and activities
- **Migrations**: Drizzle Kit for database schema management
- **Current Implementation**: Memory-based storage with database-ready schema definitions

### Authentication and Authorization
- **Session Management**: Prepared for PostgreSQL session storage using connect-pg-simple
- **User System**: Basic user management with username/password authentication structure
- **Token Handling**: Tinder API token storage and management for external service integration

### External Service Integrations
- **Tinder API**: Direct integration for fetching teasers, profile data, and performing swipe actions
- **Platform Support**: Configured for Android platform interactions
- **API Abstraction**: Custom TinderAPI class for handling external service communication

### Key Features Architecture
1. **Analytics Dashboard**: Real-time statistics tracking for matches, profile views, and swipe metrics
2. **Auto-Swipe System**: Configurable automated swiping with user-defined preferences and limits
3. **Teaser Unblur**: Integration with Tinder API to reveal blurred teaser images
4. **Profile Optimization**: AI-driven suggestions for profile improvement based on performance metrics
5. **Activity Tracking**: Comprehensive logging of user actions and system activities

### Development Environment
- **Build System**: Vite with TypeScript support and React plugin
- **Development Tools**: Runtime error overlay and cartographer integration for Replit
- **Code Quality**: Strict TypeScript configuration with comprehensive type checking
- **Hot Reload**: Full-stack hot module replacement for rapid development