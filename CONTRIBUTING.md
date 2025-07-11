# Contributing to Invoice Management System

Thank you for your interest in contributing to the Invoice Management System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** when available
3. **Provide detailed information** including:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - System information (OS, Node.js version, browser)
   - Screenshots or error logs when applicable

### Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing feature requests** first
2. **Provide a clear use case** for the feature
3. **Explain the benefits** to users
4. **Consider the scope** - keep features focused and well-defined

### Code Contributions

#### Prerequisites

- Node.js 16+ and npm
- Git
- Basic knowledge of TypeScript, NestJS (backend), and Vue.js (frontend)

#### Development Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/invoice-management-system.git
   cd invoice-management-system/invoice-app
   ```

3. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines

##### Backend (NestJS)

- Follow **NestJS conventions** and best practices
- Use **TypeScript** strictly with proper types
- Write **unit tests** for services and controllers
- Use **DTOs** for request/response validation
- Follow the **module-based architecture**
- Use **descriptive commit messages**

##### Frontend (Vue.js)

- Follow **Vue 3 Composition API** patterns
- Use **TypeScript** where beneficial
- Follow **Tailwind CSS** utility-first approach
- Create **reusable components**
- Implement **proper error handling**
- Ensure **responsive design**

#### Code Style

- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables, functions, and files
- **Comments**: Add comments for complex logic
- **File Organization**: Keep files focused and well-organized

#### Testing

##### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

##### Frontend Testing
```bash
cd frontend
npm run test          # Component tests
```

#### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Follow the commit message format**:
   ```
   type(scope): description
   
   Examples:
   feat(invoices): add PDF generation feature
   fix(auth): resolve JWT token validation issue
   docs(readme): update installation instructions
   ```

5. **Create a descriptive PR**:
   - Clear title summarizing the change
   - Detailed description of what was changed and why
   - Reference related issues using `Closes #123`
   - Include screenshots for UI changes

6. **Request review** from maintainers

## 📋 Development Standards

### Database Changes

- Use **TypeORM migrations** for schema changes
- Test migrations both up and down
- Consider backward compatibility
- Update entity relationships carefully

### API Changes

- Maintain **backward compatibility** when possible
- Update **Swagger documentation**
- Follow **RESTful conventions**
- Version APIs when breaking changes are necessary

### UI/UX Changes

- Follow the existing **design system**
- Ensure **accessibility** standards
- Test on **multiple screen sizes**
- Maintain **consistent user experience**

## 🐛 Bug Fixing Guidelines

1. **Reproduce the bug** first
2. **Write a test** that fails due to the bug
3. **Fix the bug** with minimal changes
4. **Ensure the test passes**
5. **Verify no regressions** by running all tests

## 📝 Documentation

When contributing:

- Update **README.md** for significant changes
- Update **API documentation** for endpoint changes
- Add **inline comments** for complex code
- Update **changelog** if maintained

## 🔄 Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Testing** in development environment
4. **Final approval** and merge

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: For sensitive security issues

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **Testing**: Improving test coverage
- **Documentation**: Enhancing guides and examples
- **Accessibility**: Making the app more accessible
- **Performance**: Optimizing queries and rendering
- **Internationalization**: Adding new languages
- **Mobile**: Improving mobile experience

## 🚀 Release Process

1. Features are merged to `develop` branch
2. Regular releases from `develop` to `main`
3. Semantic versioning (MAJOR.MINOR.PATCH)
4. Release notes document changes

## 📜 Code of Conduct

- **Be respectful** and inclusive
- **Help others** learn and grow
- **Focus on the issue**, not the person
- **Give constructive feedback**
- **Acknowledge contributions** from others

Thank you for contributing to the Invoice Management System! 🎉 