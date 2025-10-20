# Testing Skill for Claude Code

A comprehensive Claude Code skill for testing web applications with Playwright, focusing on accessibility, UX principles, and functional correctness.

## Overview

This skill enables Claude to:

- **Accessibility Testing**: Ensure WCAG 2.1 AA compliance using axe-core
- **UX Principles Testing**: Validate responsiveness, loading states, error handling, and user feedback
- **Functional Testing**: Verify application works according to codebase specifications
- **Test Generation**: Create reusable Playwright test files for CI/CD integration
- **Comprehensive Reporting**: Generate detailed reports with screenshots, videos, and fix suggestions

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A web application to test

### MCP Support (Recommended)

**This skill automatically detects and uses the Playwright MCP server if installed!**

If you have a Playwright MCP server configured in Claude Code, the skill will:
- Use MCP tools for direct browser automation (faster, better integration)
- Provide real-time testing feedback
- Still generate test files for future CI/CD use

To check if you have Playwright MCP installed:
- MCP servers are configured in your Claude Code settings
- Look for `mcp__playwright_*` or `mcp__browser_*` tools
- The skill will automatically detect and announce which approach it's using

**No MCP? No problem!** The skill automatically falls back to traditional Playwright CLI.

### Setup in Your Project

1. **Copy this skill to your Claude Code skills directory**:
   ```bash
   cp -r testingSkill ~/.claude/skills/
   ```

2. **Install Playwright in your project** (or let the skill do it automatically):
   ```bash
   npm install -D @playwright/test @axe-core/playwright
   npx playwright install
   ```

## Usage

### Invoking the Skill

In Claude Code, you can invoke the testing skill in several ways:

```
Test my web application with playwright
```

```
Run accessibility and UX tests on my app
```

```
Create playwright tests for my project and run them
```

### What the Skill Does

When invoked, the skill will:

1. **Setup Phase**:
   - Check if Playwright is installed (offer to install if not)
   - Verify or create `playwright.config.ts`
   - Analyze your codebase to understand the app structure
   - Ask which pages/features you want to test

2. **Analysis Phase**:
   - Identify web framework (Next.js, Remix, React, etc.)
   - Find routing structure and key components
   - Understand user flows and critical paths

3. **Testing Phase**:
   - Run accessibility tests (WCAG 2.1 AA compliance)
   - Test UX principles (responsiveness, loading states, etc.)
   - Perform functional tests (user flows, forms, CRUD operations)
   - Capture screenshots and videos on failures

4. **Generation Phase**:
   - Create reusable test files in `/tests` directory
   - Generate comprehensive test results report
   - Provide prioritized fix suggestions with code locations

5. **Reporting Phase**:
   - Summary of all tests run (passed/failed)
   - Accessibility violations with severity levels
   - UX issues and recommendations
   - Functional bugs with reproduction steps
   - Visual evidence (screenshots/videos)

## Example Output

After running the skill, you'll get:

### Test Files Generated

```
tests/
  ├── accessibility.spec.ts
  ├── ux-principles.spec.ts
  ├── user-authentication.spec.ts
  ├── checkout-flow.spec.ts
  └── homepage.spec.ts
```

### Test Results Report

```markdown
# Test Results for My App

## Summary
- Tests Run: 45
- Passed: 38
- Failed: 7
- Duration: 12.5s

## Accessibility Issues (4 found)

### Critical
- Missing alt text on product images in ProductCard.tsx:23
  Fix: Add alt={product.name} to <img> tag

### High
- Form inputs missing labels in ContactForm.tsx:45
  Fix: Add <label htmlFor="email">Email</label>

## UX Issues (2 found)
- No loading indicator on checkout button (Checkout.tsx:89)
- Form validation errors not announced to screen readers

## Functional Issues (1 found)
- Login fails with valid credentials on mobile viewport
  Steps to reproduce: ...

## Generated Screenshots
- test-results/checkout-failure.png
- test-results/accessibility-violation.png
```

## Configuration

### Playwright Configuration

The skill uses the template in `playwright.config.template.ts`. Customize it for your project:

```typescript
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000', // Your app URL
  },
  webServer: {
    command: 'npm run dev', // Your dev server command
    url: 'http://localhost:3000',
  },
});
```

### Customizing Test Scope

You can guide the skill by:

- Specifying which pages to test: "Test the checkout flow"
- Focusing on specific areas: "Run accessibility tests only"
- Testing critical paths: "Test user authentication and payment"

## Example Test Files

The `examples/` directory contains sample test files demonstrating:

### accessibility.spec.ts
- WCAG 2.1 AA compliance testing
- Keyboard navigation validation
- ARIA label verification
- Color contrast checks
- Focus indicator testing

### ux-principles.spec.ts
- Responsive design testing
- Loading state verification
- Error handling validation
- User feedback testing
- Performance metrics

### functional.spec.ts
- User authentication flows
- Form handling and validation
- CRUD operations
- Search and filtering
- API integration testing
- State management
- Edge cases

## Best Practices

### When to Use This Skill

- Before deploying to production
- After adding new features
- When refactoring UI components
- During code reviews
- As part of CI/CD pipeline

### Test Coverage Recommendations

**Critical Paths** (Must test):
- User authentication
- Payment/checkout flows
- Data submission forms
- Account management

**Important Features** (Should test):
- Search functionality
- Filtering and sorting
- Navigation and routing
- Profile settings

**Nice to Have** (Can test):
- Marketing pages
- Static content
- Footer links

## Troubleshooting

### Common Issues

**Issue**: Playwright not installed
- **Solution**: Run `npm install -D @playwright/test` or let the skill install it

**Issue**: Tests timing out
- **Solution**: Increase timeout in playwright.config.ts or check if dev server is running

**Issue**: Accessibility tests failing
- **Solution**: Review violations in report and fix ARIA issues, missing labels, etc.

**Issue**: Tests failing on CI
- **Solution**: Use the CI-specific config with retries and headless mode

## Advanced Usage

### Running Tests Manually

After the skill generates test files, you can run them manually:

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/accessibility.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Generate HTML report
npx playwright test --reporter=html
```

### Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Extending Tests

You can extend the generated tests:

```typescript
// Add custom assertions
test('should handle my specific use case', async ({ page }) => {
  // Your custom test logic
});

// Use page objects for complex apps
import { HomePage } from './pages/HomePage';

test('should navigate using page object', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickLoginButton();
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Testing Best Practices](https://web.dev/testing/)

## Contributing

To improve this skill:

1. Add more test patterns to examples/
2. Enhance the skill.md prompt with new testing strategies
3. Update playwright.config.template.ts with better defaults
4. Share your improvements with the community

## License

This skill is provided as-is for use with Claude Code. Modify and extend as needed for your projects.

## Support

For issues or questions:
- Review the examples/ directory for test patterns
- Check Playwright documentation
- Consult WCAG guidelines for accessibility questions
- Ask Claude Code for help: "How do I test [specific scenario]?"

---

**Happy Testing!** Make your web applications accessible, user-friendly, and robust.
