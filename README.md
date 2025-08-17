# [Mini Seller Console]()

![stacks](https://img.shields.io/badge/React-v19.1.1-brightgreen) ![stacks](https://img.shields.io/badge/TailwindCSS-v4.1.12-brightgreen) ![stacks](https://img.shields.io/badge/TanStack%20Virtual-v3.13.12-brightgreen) ![stacks](https://img.shields.io/badge/Stack-Typescript-blue) ![GitHub](https://img.shields.io/github/license/legeannd/mini-seller-console)

A lightweight, client-side React application designed for sales representatives to efficiently manage leads and convert them into opportunities. Built with modern React patterns and optimized for performance with up to 100 lead records.

## ✨ Features

### 📋 Lead Management

- **Comprehensive Lead List**: View all leads with essential information (name, company, email, source, score, status)
- **Real-time Search**: Debounced search across lead names and companies
- **Smart Filtering**: Filter leads by status (New, Contacted, Qualified, Converted)
- **Intelligent Sorting**: Sort leads by score in descending order
- **Responsive Design**: Mobile-optimized cards and desktop table views

### 🔍 Lead Detail & Editing

- **Slide-over Panel**: Non-intrusive lead detail view that preserves context
- **Inline Editing**: Direct editing of status and email fields
- **Form Validation**: Real-time email validation with user feedback
- **Optimistic Updates**: Instant UI updates with rollback on failures
- **Error Handling**: Toast notifications for all user actions

### 🎯 Lead Conversion

- **Smart Conversion**: Convert qualified leads to opportunities with validation
- **Deal Value Tracking**: Optional amount field with currency formatting
- **Visual Distinction**: Converted leads highlighted in the main list
- **Opportunity Pipeline**: Dedicated opportunities table for tracking conversions
- **Status Integration**: Automatic status updates during conversion process

### 📱 Mobile Experience

- **Responsive Cards**: Touch-optimized mobile cards for lead browsing
- **Adaptive UI**: Seamless experience across all device sizes
- **Performance Optimized**: Virtualized scrolling maintains smooth performance
- **Mobile-First Design**: Carefully crafted mobile interactions

## 🛠️ Technology Stack

### Core Framework

- **React 19** - Latest React with modern patterns and improved performance
- **TypeScript** - Full type safety with strict mode enabled
- **Vite** - Fast development server and optimized builds

### UI & Styling

- **Tailwind CSS v4** - Utility-first CSS with modern features
- **ShadCN/UI** - High-quality, accessible component library
- **Radix UI** - Headless components for complex interactions
- **Lucide React** - Beautiful, consistent iconography

### Performance & Utilities

- **TanStack Virtual** - Efficient virtualized scrolling for large lists
- **Sonner** - Elegant toast notifications

## 🏗️ Architecture

### State Management Strategy

The application implements a **centralized state management pattern** using React's built-in tools:

- **Global AppContext**: Provides state and dispatch functions throughout the app
- **useReducer**: Handles complex business logic with actions like `LEADS_LOADED`, `LEAD_UPDATED`, `LEAD_CONVERTED`
- **Local useState**: Reserved for simple UI state (form inputs, loading indicators)
- **No External Dependencies**: Lightweight approach using only React built-ins

### Component Architecture

```
src/
├── components/
│   ├── LeadsList.tsx              # Virtualized leads table with mobile cards
│   ├── LeadDetail/
│   │   ├── index.tsx              # Main slide-over panel component
│   │   ├── LeadForm.tsx           # Editable lead form with validation
│   │   └── ConversionPanel.tsx    # Lead conversion interface
│   ├── OpportunitiesList.tsx      # Opportunities display table
│   ├── SearchAndFilters.tsx       # Search and filter controls
│   └── ui/                        # ShadCN UI component library
├── context/
│   ├── AppContext.tsx             # React context provider component
│   ├── context.ts                 # Context definition and types
│   └── reducer.ts                 # State reducer with business logic
├── hooks/
│   ├── useAppContext.ts           # Type-safe context access hook
│   ├── useDebounce.ts             # Search input debouncing
│   ├── useAsync.ts                # Async action management
│   ├── useLeadConversion.ts       # Lead conversion business logic
│   ├── useMediaQuery.ts           # Responsive breakpoint detection
│   └── usePersistence.ts          # Local storage persistence
├── services/
│   └── api.ts                     # Simulated API with network delays
├── types/
│   └── index.ts                   # TypeScript type definitions
├── utils/
│   ├── validation.ts              # Form validation utilities
│   └── currency.ts                # Currency formatting helpers
└── pages/
    └── MainPage.tsx               # Main application layout
```

### Key Design Patterns

1. **Single Responsibility**: Each component handles one clear concern
2. **Separation of Concerns**: Business logic in custom hooks, UI logic in components
3. **Optimistic Updates**: Instant UI feedback with error rollback
4. **Performance Optimization**: Memoization, virtualization, and debouncing
5. **Type Safety**: Comprehensive TypeScript coverage with strict typing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended package manager)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd mini-seller-console

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

### Development Workflow

1. **Development Server**: `pnpm dev` starts Vite dev server with hot reload
2. **Type Checking**: TypeScript compilation happens alongside Vite building
3. **Linting**: ESLint with React hooks and TypeScript rules
4. **Building**: Optimized production build with code splitting

## 📊 Data & Persistence

### Sample Data

- **Leads**: 100+ realistic sample leads with varying statuses and scores
- **Sources**: Multiple lead sources (Website, Referral, Cold Call, Email Campaign, etc.)
- **Statuses**: Complete lead lifecycle (New → Contacted → Qualified → Converted)

### Persistence Strategy

- **Opportunities**: Persisted to localStorage for session continuity
- **UI Preferences**: Search, filter, and sort preferences saved locally
- **Error Recovery**: Graceful fallbacks for storage failures
- **Data Reconciliation**: Automatic status sync between leads and opportunities

## ⚡ Performance Features

### Optimization Techniques

- **Virtual Scrolling**: Smooth performance with large datasets using TanStack Virtual
- **Component Memoization**: Strategic use of `React.memo` for expensive components
- **Hook Optimization**: `useCallback` and `useMemo` for derived state and handlers
- **Debounced Search**: Prevents excessive re-renders during user input
- **Code Splitting**: Optimized bundle sizes with dynamic imports

### Mobile Performance

- **Responsive Virtualization**: Adaptive item sizes for mobile and desktop
- **Touch Optimization**: Mobile-first interaction patterns
- **Efficient Rendering**: Minimal re-renders with proper dependency management

## 🎨 User Experience

### Interaction Design

- **Intuitive Navigation**: Clear visual hierarchy and familiar patterns
- **Immediate Feedback**: Loading states, success confirmations, error messages
- **Visual Consistency**: Cohesive design language throughout the application

### Error Handling

- **User-Friendly Messages**: Clear, actionable error descriptions
- **Graceful Degradation**: Application remains functional during failures
- **Retry Mechanisms**: Users can easily retry failed operations
- **Validation Feedback**: Real-time form validation with helpful hints

## 🔧 Configuration

### Environment Setup

- **Client-Side Only**: No backend dependencies, runs entirely in the browser
- **Local Data**: Uses `public/leads.json` for sample data
- **Configurable Failure Rate**: Adjustable API failure simulation for testing

## 📚 Architecture Decisions

For detailed architectural decisions and rationale, see:

- **[ADR.md](./ADR.md)** - State management strategy and technical decisions
- **[PRD.md](./PRD.md)** - Complete product requirements and user stories

---

###### Developed by [Gean Lucas](https://www.linkedin.com/in/geanlucaas/) :rocket:.
