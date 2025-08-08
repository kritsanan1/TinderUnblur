# Pull Request

## 📝 Description
Provide a clear and concise description of what this PR does.

**Related Issue(s):**
- Fixes #(issue number)
- Relates to #(issue number)
- Closes #(issue number)

## 🔧 Type of Change
Please delete options that are not relevant.

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI update (formatting, styling, no functional changes)
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test updates
- [ ] 🔧 Build/CI configuration changes

## 🚀 What Changed
Provide a more detailed explanation of the changes made.

### Frontend Changes
- List specific frontend changes
- Component modifications
- New UI elements
- State management updates

### Backend Changes
- API endpoint changes
- Database modifications
- Service layer updates
- Authentication changes

### Infrastructure Changes
- Build configuration updates
- Dependency changes
- Environment configuration
- CI/CD modifications

## 🧪 How Has This Been Tested?
Describe the tests that you ran to verify your changes.

### Test Scenarios
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing
- [ ] Mobile responsiveness verified

### Testing Steps
1. Step 1
2. Step 2
3. Step 3

**Test Configuration:**
- OS: [e.g. Windows 10, macOS, Ubuntu]
- Browser: [e.g. Chrome 95, Firefox 94, Safari 15]
- Node.js Version: [e.g. 18.0.0]

## 📸 Screenshots/Videos
Add screenshots or videos to demonstrate the changes (especially for UI updates).

### Before
<!-- Add screenshots of the current state -->

### After
<!-- Add screenshots of the new state -->

## 📋 Checklist
Please check all applicable items:

### Code Quality
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

### Frontend Checklist (if applicable)
- [ ] Components are properly typed with TypeScript
- [ ] UI is responsive across different screen sizes
- [ ] Accessibility standards are met (ARIA labels, keyboard navigation)
- [ ] No console errors or warnings
- [ ] Proper error handling and loading states implemented
- [ ] TanStack Query integration follows project patterns

### Backend Checklist (if applicable)
- [ ] API endpoints follow RESTful conventions
- [ ] Input validation is implemented
- [ ] Error handling is comprehensive
- [ ] Authentication/authorization is properly implemented
- [ ] Database operations are optimized
- [ ] API documentation is updated

### Testing Checklist
- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests pass
- [ ] Manual testing scenarios documented
- [ ] Edge cases considered and tested
- [ ] Performance impact assessed

### Security Checklist
- [ ] No sensitive data exposed in logs or responses
- [ ] Input sanitization implemented where needed
- [ ] Authentication tokens handled securely
- [ ] CORS configuration is appropriate
- [ ] Rate limiting considered for new endpoints

## 🔄 Migration Guide (if applicable)
If this is a breaking change, provide migration instructions:

### Database Migrations
```sql
-- Add any required database migration scripts
```

### Configuration Changes
```bash
# Add any required environment variable changes
```

### Code Changes Required
```typescript
// Show examples of how existing code needs to be updated
```

## 📊 Performance Impact
Describe any performance implications:

- Bundle size impact: [increase/decrease/neutral]
- Runtime performance: [improvement/regression/neutral]
- Database performance: [optimized/unchanged/needs monitoring]
- API response times: [faster/same/slower]

## 🔗 Dependencies
List any dependencies that this change has:

- [ ] Requires #(PR number) to be merged first
- [ ] Depends on external service update
- [ ] Requires environment variable updates
- [ ] Needs database migration

## 📚 Documentation Updates
- [ ] README.md updated
- [ ] API documentation updated
- [ ] Component documentation updated
- [ ] Environment variable documentation updated
- [ ] Deployment guide updated

## 🤔 Questions & Concerns
List any questions or concerns about this implementation:

- Question 1?
- Concern about approach X
- Need feedback on implementation Y

## 🎯 Reviewers
Please tag relevant reviewers based on the areas changed:

**Frontend:** @frontend-team
**Backend:** @backend-team
**DevOps:** @devops-team
**Design:** @design-team

## 🏷️ Additional Labels
Add relevant labels to this PR:
- `frontend` - Frontend changes
- `backend` - Backend changes
- `api` - API modifications
- `database` - Database changes
- `ui/ux` - User interface updates
- `performance` - Performance improvements
- `security` - Security-related changes
- `breaking-change` - Breaking changes
- `needs-review` - Requires code review
- `work-in-progress` - Still being developed

## 🚀 Deployment Notes
Any special considerations for deployment:

- [ ] Requires environment variable updates
- [ ] Needs database migration
- [ ] Requires service restart
- [ ] Zero-downtime deployment possible
- [ ] Rollback plan documented

**Rollback Instructions:**
1. Step 1 to rollback
2. Step 2 to rollback

## 📝 Additional Notes
Add any other notes, concerns, or questions for the reviewers here.