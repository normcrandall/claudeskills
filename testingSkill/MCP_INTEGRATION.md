# MCP Integration Guide

This document explains how the Testing Skill integrates with Playwright MCP (Model Context Protocol) servers.

## What is MCP?

MCP (Model Context Protocol) is a standard for connecting Claude to external tools and services. When a Playwright MCP server is installed, it provides specialized tools that allow Claude to directly control a browser for testing.

## Automatic Detection

The skill automatically detects if Playwright MCP tools are available by checking for tools with these prefixes:
- `mcp__playwright_*`
- `mcp__browser_*`

## Testing Approach Selection

### With MCP (Preferred)

When MCP tools are detected, the skill:

1. **Direct Browser Control**: Uses MCP tools to navigate, interact, and test in real-time
2. **Immediate Feedback**: Get instant results without waiting for test runs
3. **Visual Testing**: Take screenshots and videos directly through MCP
4. **Still Generates Tests**: Creates test files for CI/CD even when using MCP

**Advantages**:
- Faster iteration during development
- Better integration with Claude Code
- Real-time debugging capabilities
- No need to install Playwright locally (browser is managed by MCP server)

**Example Flow**:
```
User: "Test the login page"
Skill: Detects MCP → Uses MCP to navigate to /login
      → Interacts with form using MCP tools
      → Takes screenshot if issues found
      → Generates test file for future CI runs
```

### Without MCP (Fallback)

When MCP is not available, the skill:

1. **Install Playwright**: Ensures `@playwright/test` is installed
2. **Generate Test Files**: Creates comprehensive test files
3. **Run CLI Tests**: Executes tests via `npx playwright test`
4. **Parse Results**: Reads test output and reports findings

**Advantages**:
- Works in any environment
- Tests can run in CI/CD immediately
- Standard Playwright features available
- No additional MCP setup needed

**Example Flow**:
```
User: "Test the login page"
Skill: No MCP detected → Checks for Playwright installation
      → Generates login.spec.ts
      → Runs: npx playwright test login.spec.ts
      → Parses output and reports results
```

## MCP Tools Used

When Playwright MCP is available, the skill may use tools like:

- **Navigation**: `mcp__playwright_navigate`, `mcp__browser_goto`
- **Interaction**: `mcp__playwright_click`, `mcp__browser_type`
- **Assertions**: `mcp__playwright_expect`, `mcp__browser_wait`
- **Screenshots**: `mcp__playwright_screenshot`, `mcp__browser_screenshot`
- **Accessibility**: `mcp__playwright_accessibility`, `mcp__axe_analyze`

(Exact tool names depend on the specific MCP server implementation)

## How the Skill Decides

```
┌─────────────────────────────────────┐
│   Skill Invoked                     │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│   Check for MCP Tools               │
│   (mcp__playwright_* or             │
│    mcp__browser_*)                  │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
    [Found]         [Not Found]
       │                │
       v                v
┌──────────────┐  ┌──────────────┐
│ Use MCP      │  │ Use CLI      │
│ Approach     │  │ Approach     │
└──────────────┘  └──────────────┘
       │                │
       v                v
┌──────────────┐  ┌──────────────┐
│ Direct       │  │ Generate &   │
│ Browser      │  │ Run Tests    │
│ Testing      │  │ via npx      │
└──────────────┘  └──────────────┘
       │                │
       └────────┬───────┘
                │
                v
┌─────────────────────────────────────┐
│   Generate Test Files               │
│   (for future CI/CD use)            │
└─────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────┐
│   Report Results to User            │
└─────────────────────────────────────┘
```

## Installing Playwright MCP

To get MCP support, you need to configure a Playwright MCP server in Claude Code settings.

### Option 1: Official Playwright MCP (if available)
Check the MCP registry for official Playwright servers:
```bash
# Example - check actual MCP documentation
npx @anthropic-ai/mcp install playwright
```

### Option 2: Community MCP Servers
Search for community-built Playwright MCP servers that provide browser automation tools.

### Option 3: Build Your Own
You can create a custom MCP server that provides Playwright tools. See the MCP SDK documentation.

## Configuration Example

In your Claude Code settings (example):
```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "command": "npx",
        "args": ["playwright-mcp-server"],
        "env": {}
      }
    }
  }
}
```

## Skill Behavior

### Announcement

The skill will always announce which approach it's using:

**With MCP**:
```
✅ Playwright MCP detected! Using direct browser automation for testing.
   Benefits: Real-time feedback, better integration, faster iteration.
   Note: Test files will still be generated for CI/CD use.
```

**Without MCP**:
```
ℹ️ No Playwright MCP found. Using traditional Playwright CLI approach.
   Checking for Playwright installation...
```

### Dual Mode Benefits

Even when using MCP, the skill generates test files because:

1. **CI/CD Integration**: Your CI pipeline can run the generated tests
2. **Documentation**: Tests serve as living documentation
3. **Portability**: Tests work anywhere, not just with MCP
4. **Version Control**: Tests can be committed and tracked

## Best Practices

### With MCP
- Use for rapid development and debugging
- Iterate quickly on test scenarios
- Get immediate visual feedback
- Still commit generated test files

### Without MCP
- Use for production CI/CD pipelines
- Run tests in headless mode
- Integrate with test runners
- Generate HTML reports

## Troubleshooting

### MCP Not Detected

If you have MCP installed but the skill doesn't detect it:

1. Check your Claude Code MCP configuration
2. Restart Claude Code after installing MCP
3. Verify MCP server is running: Check Claude Code logs
4. Confirm MCP tools are listed when you run a test command

### MCP Connection Issues

If MCP tools fail during testing:

1. The skill will automatically fall back to CLI mode
2. Check MCP server logs for errors
3. Ensure the browser automation server is accessible
4. Try restarting the MCP server

## Future Enhancements

Potential improvements for MCP integration:

- [ ] Automatic MCP server installation if user confirms
- [ ] Support for multiple MCP browser automation providers
- [ ] Real-time streaming of test results
- [ ] Interactive test debugging through MCP
- [ ] Visual test recorder using MCP tools

## Contributing

If you build or improve MCP integration:

1. Document the MCP tools you're using
2. Add error handling for MCP failures
3. Maintain fallback to CLI mode
4. Test both MCP and non-MCP scenarios

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Playwright Documentation](https://playwright.dev)
- [Claude Code MCP Guide](https://docs.claude.com/claude-code)

---

**Note**: MCP is optional but recommended for the best testing experience. The skill works great with or without it!
