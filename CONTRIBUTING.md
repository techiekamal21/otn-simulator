# Contributing to OTN Simulator

Thank you for your interest in contributing to the OTN Simulator! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [License](#license)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Accept responsibility for mistakes
- Prioritize the community's best interests

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/otn-simulator.git
   cd otn-simulator
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original/otn-simulator.git
   ```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards below
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Build the project
npm run build

# Run locally
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

See [Commit Guidelines](#commit-guidelines) below.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill out the PR template
- Submit for review

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

**Example:**
```typescript
// Good
interface SimulationConfig {
  oduLevel: OduLevel;
  enableFec: boolean;
}

// Avoid
let data: any;
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use proper prop types

**Example:**
```typescript
interface ComponentProps {
  title: string;
  onUpdate: (value: string) => void;
}

const Component: React.FC<ComponentProps> = ({ title, onUpdate }) => {
  // Component logic
};
```

### File Organization

```
components/
├── ComponentName.tsx      # Component implementation
├── ComponentName.test.tsx # Tests (if applicable)
└── index.ts              # Exports
```

### Naming Conventions

- **Components**: PascalCase (`SimulationPanel`)
- **Functions**: camelCase (`handleUpdate`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`)
- **Types/Interfaces**: PascalCase (`SimulationConfig`)
- **Files**: PascalCase for components, camelCase for utilities

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use trailing commas in objects/arrays
- Keep lines under 100 characters when possible

### Comments

Add comments for:
- Complex algorithms
- Non-obvious business logic
- Public APIs
- License headers (see below)

**License Header Template:**
```typescript
/**
 * OTN Simulator - [Component/File Description]
 * 
 * Copyright (c) 2025 OTN Simulator Contributors
 * Licensed under the MIT License - see LICENSE file for details
 */
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(simulation): add ODU4 support"

# Bug fix
git commit -m "fix(fec): correct RS(255,239) calculation"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api): redesign configuration API

BREAKING CHANGE: Configuration format has changed"
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Build succeeds (`npm run build`)
- [ ] License headers added to new files

### PR Title

Follow the same format as commit messages:
```
feat(component): add new feature
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

---

## Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's reproducible
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]

**Additional context**
Any other relevant information
```

---

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Mockups, examples, or references
```

---

## Development Tips

### Useful Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

### Debugging

- Use browser DevTools
- Add `console.log` statements (remove before committing)
- Use React DevTools extension

### Performance

- Avoid unnecessary re-renders
- Use `React.memo` for expensive components
- Optimize large lists with virtualization

---

## Documentation

### When to Update Docs

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Improving clarity

### Documentation Files

- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guides
- `CONTRIBUTING.md` - This file
- Code comments - Inline documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

All new files must include the license header:

```typescript
/**
 * OTN Simulator - [Description]
 * 
 * Copyright (c) 2025 OTN Simulator Contributors
 * Licensed under the MIT License - see LICENSE file for details
 */
```

---

## Questions?

- Open an issue for questions
- Join discussions in GitHub Discussions
- Contact maintainers

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing! 🎉
