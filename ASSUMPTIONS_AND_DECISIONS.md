# Assumptions and Design Decisions

## 📋 Assignment Assumptions

### Time Constraints
- **Total Time Allocated**: 8-12 hours as suggested
- **Actual Time Spent**: ~10 hours over busy weekdays
- **Working Method**: Local development due to busy schedule, not Git-managed initially

### Business Context
- **Target Users**: Executives and managers need clear, actionable emission insights
- **Primary Use Case**: Carbon tax planning and compliance monitoring
- **Data Scope**: Multi-company, multi-country emission tracking

## 🎯 Key Design Decisions

### 1. Technology Stack Choices

#### Next.js 14 with App Router
**Decision**: Use Next.js 14 App Router instead of Pages Router
**Reasoning**:
- Modern React patterns with Server Components
- Better performance with streaming and Suspense
- Future-proof architecture aligned with React direction

#### Styled Components over Tailwind
**Decision**: Chose Styled Components as primary styling solution
**Reasoning**:
- Component-scoped styling prevents global conflicts
- Dynamic theming capabilities for dark/light mode
- Better TypeScript integration for theme typing
- Easier maintenance for complex component states

#### Jotai for State Management
**Decision**: Selected Jotai over Redux/Zustand/Context
**Reasoning**:
- Atomic state management reduces unnecessary re-renders
- Bottom-up approach perfect for dashboard filtering
- Derived atoms automatically handle complex calculations
- Minimal boilerplate compared to Redux

#### Recharts for Visualization
**Decision**: Used Recharts instead of D3 or Chart.js
**Reasoning**:
- React-native declarative API
- Built-in responsive containers
- TypeScript support out of the box
- Good balance between features and bundle size

### 2. Architecture Decisions

#### State Management Strategy
```
Data Layer (lib/api.ts)
    ↓
Jotai Atoms (store/)
    ↓
React Components (components/)
    ↓
User Interface
```

**Decision**: Separated data, state, and UI layers
**Reasoning**:
- Clear separation of concerns
- Easy testing and maintenance
- Scalable for future features

#### Component Structure
```
Layout Components (Sidebar, Header)
    ↓
Page Components (Dashboard)
    ↓
Feature Components (Charts, Cards)
    ↓
Base Components (Button, Card)
```

**Decision**: Hierarchical component organization
**Reasoning**:
- Reusability across different pages
- Easy to locate and modify components
- Consistent design system implementation

### 3. User Experience Decisions

#### Dashboard Layout
**Decision**: Sidebar navigation with main content area
**Reasoning**:
- Standard enterprise dashboard pattern
- Efficient space utilization
- Easy to add new navigation items

#### Chart Selection
**Decision**: Multiple chart types (Line, Bar, Area, Pie)
**Reasoning**:
- Different data requires different visualization
- Line charts for trends over time
- Pie charts for composition analysis
- Bar charts for comparison

#### Filtering System
**Decision**: Multiple independent filters (Company, Country, Source)
**Reasoning**:
- Executives need to drill down into specific data
- Independent filters allow complex analysis
- Clear visual feedback for active filters

#### Theme System
**Decision**: Dark/Light theme toggle
**Reasoning**:
- Modern user expectation
- Better accessibility in different lighting
- Professional appearance options

### 4. Performance Decisions

#### Data Processing
**Decision**: Client-side data aggregation with useMemo
**Reasoning**:
- Fast response times for filtering
- Reduces server load
- Good user experience with immediate feedback

#### Component Optimization
**Decision**: React.memo and useCallback for expensive components
**Reasoning**:
- Charts are expensive to re-render
- Filtering should not re-render all components
- Smooth user interactions

#### Bundle Optimization
**Decision**: Dynamic imports for heavy components
**Reasoning**:
- Faster initial page load
- Progressive enhancement
- Better Core Web Vitals scores

### 5. Data Model Assumptions

#### Time Period
**Assumption**: Focus on 2024 data for demonstration
**Reasoning**: Current year data is most relevant for tax planning

#### Emission Sources
**Assumption**: Limited to common sources (gasoline, diesel, electricity, natural gas)
**Reasoning**: Simplified demo scope while covering major emission sources

#### Company Scale
**Assumption**: 6-8 companies for meaningful comparison
**Reasoning**: Enough data for patterns while keeping demo manageable

#### Geographic Scope
**Assumption**: International companies (US, DE, CA, JP, KR, GB)
**Reasoning**: Shows global capability while demonstrating regional differences

### 6. API Design Assumptions

#### Network Simulation
**Decision**: 200-800ms latency with 15% failure rate
**Reasoning**:
- Realistic network conditions
- Tests loading states and error handling
- Demonstrates resilience patterns

#### In-Memory Storage
**Decision**: Client-side data persistence
**Reasoning**:
- Simplified demo without backend setup
- Focus on frontend capabilities
- Easy to modify and test

## 🚨 Limitations and Trade-offs

### Due to Time Constraints
1. **Testing**: Limited unit tests (would add Jest + Testing Library)
2. **Accessibility**: Basic ARIA support (would enhance keyboard navigation)
3. **Internationalization**: English only (would add i18n)
4. **Data Validation**: Basic TypeScript typing (would add runtime validation)

### Due to Demo Scope
1. **Authentication**: No user management (would add role-based access)
2. **Real-time**: Simulated data updates (would add WebSocket)
3. **Export**: No data export features (would add CSV/PDF export)
4. **Advanced Analytics**: Basic calculations only (would add forecasting)

## 🔮 Future Considerations

### Scalability
- Virtual scrolling for large datasets
- Server-side filtering and pagination
- Caching strategies for computed data

### Security
- Input validation and sanitization
- API authentication and authorization
- Data encryption for sensitive information

### User Experience
- Progressive Web App capabilities
- Offline functionality
- Advanced filtering with query builder

### Analytics
- Machine learning for emission predictions
- Anomaly detection for unusual patterns
- Automated insights and recommendations

## 📊 Development Process

### Day 1: Foundation (3 hours)
- Project setup and configuration
- Data model and API design
- Basic component structure

### Day 2: Core Features (4 hours)
- Dashboard layout and navigation
- Chart implementation
- State management setup

### Day 3: Polish (2 hours)
- Styling and theming
- Responsive design
- Performance optimization

### Day 4: Testing (1 hour)
- Build verification
- Manual testing
- Documentation

## 💡 Lessons Learned

1. **Jotai's Learning Curve**: Initially complex but very powerful for complex state
2. **Recharts Customization**: Required custom styling for consistent design
3. **TypeScript Benefits**: Caught many potential runtime errors early
4. **Component Composition**: Smaller components easier to test and maintain

## 🎯 Meeting Assignment Criteria

### Creativity and Critical Thinking (25%)
- Novel use of atomic state management
- Creative chart combinations for different insights
- Thoughtful error handling and loading states

### UI/UX Design (25%)
- Modern, clean interface design
- Consistent color palette and spacing
- Intuitive navigation and filtering

### UI Engineering (20%)
- Responsive layout across devices
- Proper loading and error states
- Clean separation of concerns

### Software Engineering (20%)
- Modular component architecture
- TypeScript for type safety
- Performance optimizations

### Code Quality (10%)
- Readable, well-structured code
- Consistent naming conventions
- Proper separation of concerns