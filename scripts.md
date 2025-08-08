# Scripts Documentation

## Overview
This document provides comprehensive information about all available npm scripts in the Tinder Optimizer project, including their purposes, parameters, usage examples, and troubleshooting guidance.

## Scripts Reference Table

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `npm run dev` | Starts the development server with hot module replacement for both frontend and backend | None | `npm run dev` | **Port in use**: `npx kill-port 5000` or set `PORT=3000`<br>**Module errors**: Clear `node_modules` and reinstall |
| `npm run build` | Creates optimized production build of the entire application | None | `npm run build` | **Build fails**: Check TypeScript errors with `npx tsc --noEmit`<br>**Memory issues**: Increase Node.js memory `NODE_OPTIONS="--max-old-space-size=4096"` |
| `npm start` | Runs the production build (requires build to be completed first) | None | `npm start` | **Build not found**: Run `npm run build` first<br>**Port conflicts**: Check if port 5000 is available |
| `npm test` | Runs all test suites with Vitest in watch mode | `--run` (no watch)<br>`--coverage` (generate coverage)<br>`--ui` (open UI) | `npm test --coverage` | **Tests fail**: Check `tests/setup.ts` configuration<br>**Module mocks**: Verify mock implementations |
| `npm run test:run` | Executes all tests once without watch mode (ideal for CI/CD) | None | `npm run test:run` | **CI failures**: Ensure all dependencies installed<br>**Timeout issues**: Increase test timeout in config |
| `npm run test:ui` | Opens Vitest UI interface in browser for interactive test management | None | `npm run test:ui` | **UI won't open**: Check if port 51204 is available<br>**Browser issues**: Try different browser |
| `npm run lint` | Runs ESLint to check code quality and style violations | `--fix` (auto-fix issues)<br>`--cache` (use cache) | `npm run lint --fix` | **Lint errors**: Check `.eslintrc.js` configuration<br>**Parser errors**: Verify TypeScript setup |
| `npm run lint:fix` | Automatically fixes ESLint violations where possible | None | `npm run lint:fix` | **Can't auto-fix**: Some issues require manual resolution<br>**Config issues**: Check ESLint configuration files |
| `npm run type-check` | Performs TypeScript compilation check without emitting files | None | `npm run type-check` | **Type errors**: Review `tsconfig.json` settings<br>**Path mapping**: Check alias configurations |
| `npm run preview` | Serves the production build locally for testing before deployment | `--port <number>` (custom port)<br>`--host` (expose to network) | `npm run preview --port 3000` | **Build required**: Run `npm run build` first<br>**Network access**: Use `--host 0.0.0.0` |

## Detailed Script Descriptions

### Development Scripts

#### `npm run dev`
**Purpose**: Primary development command that starts both frontend and backend servers with hot module replacement.

**What it does**:
- Starts Express.js server on port 5000
- Enables Vite development server with React
- Watches for file changes and auto-reloads
- Provides TypeScript compilation on-the-fly
- Serves static assets and API endpoints

**Expected Output**:
```bash
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

6:25:09 PM [express] serving on port 5000
[vite] server connection established
```

**Common Issues**:
- **EADDRINUSE**: Port 5000 already in use
  ```bash
  npx kill-port 5000
  # or
  PORT=3000 npm run dev
  ```

### Build Scripts

#### `npm run build`
**Purpose**: Creates optimized production bundle for deployment.

**Build Process**:
1. TypeScript compilation with type checking
2. Vite bundling with tree shaking
3. CSS minification and optimization
4. Asset optimization and compression
5. Source map generation

**Output Location**: `dist/` directory

**Build Optimization Features**:
- Code splitting for optimal loading
- Dead code elimination
- CSS purging with Tailwind
- Image optimization
- Gzip compression ready

#### `npm start`
**Purpose**: Runs the production server using the built assets.

**Prerequisites**: Must run `npm run build` first

**Production Features**:
- Optimized static file serving
- Production error handling
- Security headers enabled
- Compression middleware

### Testing Scripts

#### `npm test`
**Purpose**: Comprehensive testing with Vitest framework.

**Test Coverage**:
- Unit tests for components and utilities
- Integration tests for API endpoints
- Mock implementations for external services
- Real API contract validation

**Test Files Located**:
- `tests/lib/` - Library and utility tests
- `tests/server/` - Backend API tests
- `tests/integration/` - Integration tests

**Coverage Reports**: Generated in `coverage/` directory

#### `npm run test:ui`
**Purpose**: Interactive test management interface.

**Features**:
- Visual test runner
- Real-time test results
- Coverage visualization
- Test file filtering
- Debug capabilities

**Access**: Opens automatically in default browser at `http://localhost:51204`

### Code Quality Scripts

#### `npm run lint`
**Purpose**: Code quality analysis using ESLint.

**Checks Include**:
- TypeScript best practices
- React hooks rules
- Import/export conventions
- Accessibility guidelines
- Security patterns

**Configuration**: Defined in `.eslintrc.js` and extends:
- `@typescript-eslint/recommended`
- `eslint:recommended`
- `plugin:react-hooks/recommended`

#### `npm run type-check`
**Purpose**: Static type analysis without code emission.

**Benefits**:
- Faster than full compilation
- Identifies type errors early
- Validates type definitions
- Checks import/export types

## Environment-Specific Usage

### Development Environment
```bash
# Start development with specific port
PORT=3000 npm run dev

# Run tests with coverage
npm test -- --coverage

# Lint with auto-fix
npm run lint:fix
```

### Staging Environment
```bash
# Build for staging
NODE_ENV=staging npm run build

# Run staging tests
NODE_ENV=staging npm run test:run

# Preview staging build
npm run preview
```

### Production Environment
```bash
# Production build
NODE_ENV=production npm run build

# Start production server
npm start

# Run production tests
NODE_ENV=production npm run test:run
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: npm ci

- name: Run type check
  run: npm run type-check

- name: Run linting
  run: npm run lint

- name: Run tests
  run: npm run test:run

- name: Build application
  run: npm run build
```

### Performance Optimization

#### Memory Management
```bash
# Increase Node.js memory for large builds
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Enable V8 optimization
NODE_OPTIONS="--optimize-for-size" npm start
```

#### Cache Management
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Clear Vite cache
rm -rf node_modules/.vite

# Clear npm cache
npm cache clean --force
```

## Troubleshooting Guide

### Common Error Patterns

#### Module Resolution Errors
```bash
Error: Cannot resolve module '@/components/ui/button'
```
**Solution**: Check `vite.config.ts` alias configuration and `tsconfig.json` paths.

#### TypeScript Compilation Errors
```bash
Error: Type 'string' is not assignable to type 'never'
```
**Solution**: Review type definitions in `shared/schema.ts` and component prop types.

#### Test Failures
```bash
Error: Cannot read properties of undefined (reading 'ok')
```
**Solution**: Check mock implementations in `tests/setup.ts` and individual test files.

#### Build Optimization Issues
```bash
Warning: Bundle size exceeds recommended limit
```
**Solution**: Analyze bundle with `npm run build -- --analyze` and implement code splitting.

### Performance Monitoring

#### Bundle Analysis
```bash
# Analyze bundle composition
npm run build -- --analyze

# Check bundle size
npx bundlesize

# Audit dependencies
npm audit
```

#### Memory Profiling
```bash
# Profile memory usage
node --inspect npm run dev

# Generate heap snapshot
node --heapsnapshot npm start
```

## Script Customization

### Adding Custom Scripts
```json
{
  "scripts": {
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "analyze": "npm run build && npx webpack-bundle-analyzer dist/stats.json"
  }
}
```

### Environment Variables in Scripts
```json
{
  "scripts": {
    "dev:mock": "MOCK_API=true npm run dev",
    "build:analyze": "ANALYZE=true npm run build",
    "test:integration": "TEST_TYPE=integration npm test"
  }
}
```