# Contributing to Tinder Optimizer

Welcome to the Tinder Optimizer project! We're excited that you're interested in contributing. This document provides guidelines and information to help you contribute effectively.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Pull Request Process](#pull-request-process)
- [Review Process](#review-process)
- [Community](#community)

## 🤝 Code of Conduct

### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@tinderoptimizer.app. All complaints will be reviewed and investigated promptly and fairly.

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- **Node.js** (v18.0 or higher)
- **npm** (v8.0 or higher)
- **Git** (latest stable version)
- **Modern code editor** (VS Code recommended)

### First Contribution
1. **Star the repository** to show your support
2. **Fork the repository** to your GitHub account
3. **Clone your fork** locally
4. **Read the documentation** thoroughly
5. **Look for good first issues** labeled with `good-first-issue`

## 🛠 Development Setup

### Initial Setup
```bash
# 1. Clone your fork
git clone https://github.com/YOUR-USERNAME/tinder-optimizer.git
cd tinder-optimizer

# 2. Add upstream remote
git remote add upstream https://github.com/original-owner/tinder-optimizer.git

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env
# Edit .env with appropriate values

# 5. Start development server
npm run dev

# 6. Run tests to ensure everything works
npm run test
```

### Development Environment
```bash
# Verify your setup
npm run type-check  # TypeScript compilation
npm run lint        # Code quality checks
npm run test        # Test suite
npm run build       # Production build
```

### IDE Configuration

#### VS Code (Recommended)
Install the following extensions:
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **Tailwind CSS IntelliSense**
- **Vitest**

#### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🔄 Contribution Workflow

### Branch Naming Convention
```bash
# Format: [type]/[ticket-number]-[brief-description]

# Feature branches
feature/TR-123-add-profile-analytics
feature/TR-456-implement-auto-swipe

# Bug fix branches
bugfix/TR-789-fix-teaser-unblur-error
bugfix/TR-101-resolve-mobile-layout

# Hotfix branches (urgent fixes)
hotfix/TR-202-critical-api-fix

# Documentation branches
docs/TR-303-update-api-documentation

# Chore branches (maintenance)
chore/TR-404-update-dependencies
```

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic changes)
- **refactor**: Code refactoring (no feature changes)
- **test**: Adding or modifying tests
- **chore**: Maintenance tasks, dependency updates

#### Scopes
- **api**: Backend API changes
- **ui**: Frontend UI components
- **auth**: Authentication related
- **analytics**: Analytics features
- **auto-swipe**: Auto-swipe functionality
- **teaser**: Teaser unblur features
- **profile**: Profile optimization
- **tests**: Test-related changes

#### Examples
```bash
feat(api): add Tinder API integration for real-time data
fix(ui): resolve mobile responsiveness issues in dashboard
docs(readme): update installation instructions
test(auto-swipe): add unit tests for swipe algorithm
refactor(analytics): optimize data fetching performance
chore(deps): update React to version 18.2.0
```

### Development Process

#### 1. Sync with Upstream
```bash
# Before starting work, sync with upstream
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

#### 2. Create Feature Branch
```bash
# Create and switch to feature branch
git checkout -b feature/TR-123-add-new-feature

# Make your changes
# ... code, test, commit ...

# Push branch to your fork
git push origin feature/TR-123-add-new-feature
```

#### 3. Keep Branch Updated
```bash
# Regularly sync with upstream
git fetch upstream
git rebase upstream/main

# If conflicts occur, resolve them and continue
git add .
git rebase --continue
```

## 📏 Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good: Use explicit types
interface UserPreferences {
  autoSwipeEnabled: boolean
  dailyLimit: number
  ageRange: [number, number]
}

// ✅ Good: Use type guards
function isValidUser(user: unknown): user is TinderUser {
  return typeof user === 'object' && user !== null && '_id' in user
}

// ❌ Avoid: Using 'any' type
function processData(data: any) {
  return data.someProperty
}

// ✅ Better: Use proper typing
function processData(data: AnalyticsData): ProcessedData {
  return {
    matches: data.matches,
    views: data.profileViews
  }
}
```

### React Component Guidelines
```typescript
// ✅ Good: Functional components with proper typing
interface StatsCardProps {
  title: string
  value: number
  trend?: 'up' | 'down' | 'neutral'
  loading?: boolean
}

export function StatsCard({ title, value, trend = 'neutral', loading = false }: StatsCardProps) {
  if (loading) {
    return <StatsCardSkeleton />
  }

  return (
    <Card className="stats-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <TrendIndicator trend={trend} />
      </CardContent>
    </Card>
  )
}

// ✅ Good: Custom hooks for business logic
export function useAnalytics(userId: string) {
  return useQuery({
    queryKey: ['analytics', userId],
    queryFn: () => analyticsApi.getAnalytics(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### API Route Guidelines
```typescript
// ✅ Good: Proper error handling and validation
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    // Validate input
    const userId = z.string().uuid().parse(params.userId)
    
    // Business logic
    const analytics = await analyticsService.getAnalytics(userId)
    
    // Return response
    return Response.json(analytics)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid user ID' }, { status: 400 })
    }
    
    console.error('Analytics fetch error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### CSS/Styling Guidelines
```css
/* ✅ Good: Use Tailwind utility classes */
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Analytics Dashboard
  </h2>
</div>

/* ✅ Good: Custom CSS with CSS variables */
.stats-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
  transition: box-shadow 0.2s ease-in-out;
}

.stats-card:hover {
  @apply shadow-md;
}

/* ❌ Avoid: Hardcoded colors */
.bad-component {
  background-color: #ffffff;
  color: #000000;
}
```

## 🧪 Testing Guidelines

### Testing Philosophy
- **Write tests for all new features**
- **Maintain high test coverage** (aim for 80%+)
- **Test behavior, not implementation details**
- **Write tests that are maintainable and readable**

### Unit Testing
```typescript
// ✅ Good: Test component behavior
import { render, screen, fireEvent } from '@testing-library/react'
import { StatsCard } from '@/components/StatsCard'

describe('StatsCard', () => {
  it('displays loading state when loading prop is true', () => {
    render(<StatsCard title="Matches" value={100} loading={true} />)
    
    expect(screen.getByTestId('stats-card-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('Matches')).not.toBeInTheDocument()
  })

  it('displays value and trend when loaded', () => {
    render(<StatsCard title="Matches" value={100} trend="up" />)
    
    expect(screen.getByText('Matches')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByTestId('trend-up')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<StatsCard title="Matches" value={100} onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Integration Testing
```typescript
// ✅ Good: Test API integration
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TinderAPI } from '@/lib/tinder-api'

describe('TinderAPI Integration', () => {
  let tinderAPI: TinderAPI
  
  beforeEach(() => {
    global.fetch = vi.fn()
    tinderAPI = new TinderAPI('test-token')
  })

  it('fetches recommendations successfully', async () => {
    const mockResponse = {
      data: { results: [{ user: { _id: 'user123' } }] }
    }
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response)

    const result = await tinderAPI.getRecommendations()
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.gotinder.com/v2/recs/core?locale=en',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Auth-Token': 'test-token'
        })
      })
    )
    expect(result).toEqual(mockResponse)
  })
})
```

### Test Coverage Requirements
- **New features**: 90%+ coverage
- **Bug fixes**: Include regression tests
- **Refactoring**: Maintain existing coverage
- **Critical paths**: 100% coverage (auth, payments, data integrity)

## 📚 Documentation

### Code Documentation
```typescript
/**
 * Calculates the match rate percentage based on matches and total swipes.
 * 
 * @param matches - Total number of matches
 * @param totalSwipes - Total number of swipes performed
 * @returns Match rate as a percentage (0-100)
 * 
 * @example
 * ```typescript
 * const rate = calculateMatchRate(25, 100)
 * console.log(rate) // 25
 * ```
 */
export function calculateMatchRate(matches: number, totalSwipes: number): number {
  if (totalSwipes === 0) return 0
  return Math.round((matches / totalSwipes) * 100)
}
```

### API Documentation
```typescript
/**
 * @api {get} /api/analytics/:userId Get User Analytics
 * @apiName GetAnalytics
 * @apiGroup Analytics
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves comprehensive analytics data for a specific user.
 * 
 * @apiParam {String} userId Unique identifier for the user
 * 
 * @apiSuccess {Object} analytics User analytics data
 * @apiSuccess {Number} analytics.matches Total number of matches
 * @apiSuccess {Number} analytics.profileViews Total profile views
 * @apiSuccess {Number} analytics.matchRate Match rate percentage
 * 
 * @apiSuccessExample {json} Success Response:
 * {
 *   "userId": "user123",
 *   "matches": 47,
 *   "profileViews": 892,
 *   "matchRate": 24.6
 * }
 * 
 * @apiError UserNotFound The user was not found
 * @apiError InternalError Internal server error
 */
```

### README Updates
When adding new features, update the README.md with:
- Feature description
- Usage examples
- Configuration options
- Troubleshooting information

## 🐛 Issue Reporting

### Before Creating an Issue
1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for known solutions
3. **Test with the latest version** if possible
4. **Gather relevant information** (logs, screenshots, environment)

### Issue Templates
Use the provided templates for:
- **Bug Reports**: Follow the bug report template
- **Feature Requests**: Follow the feature request template
- **Questions**: Use discussions for general questions

### Issue Quality Guidelines
- **Clear, descriptive titles**
- **Detailed reproduction steps**
- **Expected vs actual behavior**
- **Environment information**
- **Relevant code snippets or screenshots**

## 📝 Pull Request Process

### Before Submitting
```bash
# Ensure your branch is up to date
git fetch upstream
git rebase upstream/main

# Run the full test suite
npm run test

# Check code quality
npm run lint
npm run type-check

# Build to ensure no build errors
npm run build
```

### PR Checklist
- [ ] **Branch naming** follows convention
- [ ] **Commits** follow conventional commit format
- [ ] **Tests** are added for new functionality
- [ ] **Documentation** is updated as needed
- [ ] **No merge conflicts** with main branch
- [ ] **All checks pass** (tests, linting, type checking)
- [ ] **Description** clearly explains the changes

### PR Description Template
```markdown
## Summary
Brief description of what this PR does.

## Changes Made
- List of specific changes
- Another change
- One more change

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Breaking Changes
- None / List any breaking changes

## Screenshots
Add screenshots for UI changes

## Related Issues
Fixes #123
Relates to #456
```

## 👥 Review Process

### For Reviewers
- **Be constructive and respectful**
- **Focus on code quality, not personal preferences**
- **Explain the reasoning** behind suggestions
- **Approve when ready**, don't delay unnecessarily
- **Use GitHub's review features** (approve, request changes, comment)

### Review Criteria
- **Functionality**: Does it work as intended?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Any performance implications?
- **Security**: Are there security concerns?
- **Testing**: Adequate test coverage?
- **Documentation**: Is documentation updated?

### For Contributors
- **Respond promptly** to review feedback
- **Ask questions** if feedback is unclear
- **Make requested changes** or explain why not
- **Be patient** with the review process
- **Learn from feedback** to improve future contributions

## 🎯 Contribution Areas

### High-Priority Areas
- **Tinder API Integration**: Enhance real API integration
- **Performance Optimization**: Improve app performance
- **Mobile Responsiveness**: Better mobile experience
- **Accessibility**: Improve accessibility features
- **Testing**: Increase test coverage

### Good First Issues
Look for issues labeled:
- `good-first-issue`: Perfect for newcomers
- `help-wanted`: Need community assistance
- `documentation`: Documentation improvements
- `frontend`: UI/UX improvements
- `backend`: API enhancements

### Skill-Based Contributions
- **Frontend Developers**: React components, UI/UX improvements
- **Backend Developers**: API endpoints, database optimization
- **DevOps Engineers**: CI/CD, deployment improvements
- **Designers**: UI/UX design, user experience
- **Technical Writers**: Documentation improvements
- **QA Engineers**: Testing, bug finding

## 🌟 Recognition

### Contributors
All contributors will be:
- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes** for significant contributions
- **Given appropriate GitHub repository roles**
- **Invited to contributor discussions**

### Contribution Levels
- **First-time contributors**: Welcome package and mentoring
- **Regular contributors**: Collaborator access and recognition
- **Core contributors**: Maintainer status and decision-making involvement

## 💬 Community

### Communication Channels
- **GitHub Discussions**: General questions and discussions
- **GitHub Issues**: Bug reports and feature requests
- **Discord Server**: Real-time chat and collaboration
- **Email**: conduct@tinderoptimizer.app for sensitive issues

### Getting Help
- **Documentation**: Check README and docs first
- **Discussions**: Ask questions in GitHub Discussions
- **Discord**: Join our Discord for real-time help
- **Mentoring**: Request a mentor for larger contributions

### Community Guidelines
- **Be inclusive and welcoming**
- **Help newcomers**
- **Share knowledge and experience**
- **Provide constructive feedback**
- **Celebrate successes together**

## 📄 License

By contributing to Tinder Optimizer, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for contributing to Tinder Optimizer! Your efforts help make this project better for everyone. 🚀