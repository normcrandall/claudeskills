# Quick Start Guide

Get started with the Testing Skill in 5 minutes!

## Step 1: Set Up the Skill

If you haven't already, this skill should be accessible in Claude Code. The skill files are located in:
```
testingSkill/
├── skill.md                          # Main skill prompt
├── README.md                         # Full documentation
├── playwright.config.template.ts     # Config template
├── setup-template.json               # Package setup info
├── examples/                         # Example test files
│   ├── accessibility.spec.ts
│   ├── ux-principles.spec.ts
│   └── functional.spec.ts
└── QUICK_START.md                    # This file
```

## Step 2: Use the Skill in Your Project

Navigate to your web application project and ask Claude:

```
Test my web application with playwright
```

or

```
Set up comprehensive testing with accessibility, UX, and functional tests
```

## Step 3: Let the Skill Guide You

The skill will:

1. ✅ Detect Playwright MCP (uses MCP if available, otherwise falls back to CLI)
2. ✅ Check if Playwright is installed (install if needed, skipped if using MCP)
3. ✅ Analyze your codebase
4. ✅ Ask what you want to test
5. ✅ Run comprehensive tests
6. ✅ Generate reusable test files
7. ✅ Provide detailed report with fixes

**MCP Benefits**: If you have Playwright MCP installed, you'll get real-time browser testing with better integration. The skill automatically detects this!

## Step 4: Review Results

You'll get:

- **Test files** in `/tests` directory
- **Test results** with pass/fail status
- **Accessibility violations** with WCAG references
- **UX issues** with best practice recommendations
- **Functional bugs** with reproduction steps
- **Screenshots/videos** of failures
- **Fix suggestions** with code locations

## Step 5: Run Tests Yourself

After the skill generates tests:

```bash
# Run all tests
npx playwright test

# Run specific category
npm run test:accessibility
npm run test:ux
npm run test:functional

# View report
npm run test:report

# Debug mode
npm run test:debug
```

## Common Use Cases

### Test a Specific Page

```
Test the checkout page for accessibility and UX issues
```

### Test User Flow

```
Create and run tests for the user registration and login flow
```

### Focus on Accessibility

```
Run WCAG 2.1 AA accessibility tests on all pages
```

### Test Responsiveness

```
Test my app on mobile, tablet, and desktop viewports
```

### Generate Tests Only

```
Generate playwright tests for my authentication flow without running them
```

## What Gets Tested

### Accessibility (WCAG 2.1 AA)
- ✅ Keyboard navigation
- ✅ ARIA labels and roles
- ✅ Color contrast
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Alt text on images
- ✅ Form labels

### UX Principles
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Loading states and spinners
- ✅ Error messages and handling
- ✅ Form validation feedback
- ✅ Navigation and links
- ✅ Performance metrics
- ✅ Visual consistency

### Functional Correctness
- ✅ User authentication (signup/login/logout)
- ✅ Form submissions
- ✅ CRUD operations
- ✅ Search and filtering
- ✅ API integrations
- ✅ State management
- ✅ Edge cases

## Tips for Best Results

1. **Be Specific**: Tell Claude which pages or flows to focus on
2. **Have Your App Running**: The skill works best when your dev server is running
3. **Review Generated Tests**: Customize them for your specific needs
4. **Fix Issues Incrementally**: Start with critical accessibility issues
5. **Run in CI**: Add tests to your CI/CD pipeline for continuous quality

## Example Interaction

```
You: "I want to test my e-commerce checkout flow"

Claude (using skill):
- Analyzing your codebase...
- Found checkout flow in /app/checkout
- Installing Playwright...
- Running accessibility tests... ✅ 12 passed, ❌ 3 failed
- Running UX tests... ✅ 8 passed, ❌ 1 failed
- Running functional tests... ✅ 15 passed

Report generated:
- 3 accessibility issues found (missing ARIA labels)
- 1 UX issue (no loading state on payment button)
- All functional tests passed ✅

Generated files:
- tests/checkout-accessibility.spec.ts
- tests/checkout-ux.spec.ts
- tests/checkout-flow.spec.ts

Top priority fixes:
1. Add aria-label to payment button (checkout.tsx:145)
2. Add loading spinner during payment processing
3. Improve error message clarity for failed payments
```

## Troubleshooting

**Q: Skill says Playwright isn't installed**
- A: Let the skill install it, or run `npm install -D @playwright/test @axe-core/playwright`

**Q: Tests are timing out**
- A: Make sure your dev server is running, or increase timeout in config

**Q: Too many accessibility violations**
- A: Start with critical issues first, ask skill to "prioritize critical accessibility fixes"

**Q: Want to test only one page**
- A: Be specific: "Test only the homepage for accessibility issues"

**Q: Tests fail in CI but pass locally**
- A: Check the playwright.config.ts CI settings, ensure browsers are installed

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [examples/](./examples/) for test patterns
- Customize [playwright.config.template.ts](./playwright.config.template.ts)
- Add tests to your CI/CD pipeline
- Run tests regularly during development

## Need Help?

Ask Claude Code:
```
How do I test [specific scenario] with the testing skill?
```

```
Explain the accessibility violation in my test results
```

```
How can I improve my test coverage?
```

---

Ready to ensure your web app is accessible, user-friendly, and bug-free? Let's start testing!
