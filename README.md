# Claude Code Skills - Autonomous Feature Delivery System

This directory contains a complete skill-based workflow system for autonomous feature delivery, from requirements to production-ready code.

## Skills Overview

### Individual Skills

| Skill | Purpose | Outputs |
|-------|---------|---------|
| **jira** | Imports JIRA tickets (via API or web scraping) and converts to local stories | `docs/stories/*.md`, `docs/jira-mapping.json` |
| **architecture** | Analyzes existing architecture OR designs architecture for new projects | `docs/architecture.md` |
| **standards** | Analyzes codebase to document coding standards and conventions | `docs/coding-standards.md` |
| **pm** | Creates PRDs with user stories for brownfield enhancements | `docs/prd.md`, `docs/stories/*.md` |
| **dev** | Implements user stories following standards and architecture | Code files, tests, updated story files |
| **sdet** | Creates e2e tests, evaluates test coverage, identifies gaps, builds test infrastructure | E2E tests, test utilities, coverage reports |
| **qa** | Tests implementation and creates quality gate decisions | `docs/qa-gates/*.yml`, updated story files |
| **feature-delivery** | Orchestrates complete workflow: architecture → standards → PM → dev → QA | All above + delivery report |

### Testing Skills

The **testing** skill was created separately and is used by the QA skill to execute tests. It lives in the parent directory structure and handles test execution and reporting.

The **sdet** skill focuses on building comprehensive test automation infrastructure, creating end-to-end tests, evaluating test coverage, and identifying testing gaps. It complements the QA skill by building the test suites that QA executes.

## How It Works

### Full Workflow (feature-delivery skill)

```
User Request: "Add dark mode to the app"
         ↓
┌────────────────────────────────────────────┐
│  Feature Delivery Skill (Orchestrator)    │
└────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│  Phase 0: Pre-Flight                       │
│  - Check for docs/architecture.md          │
│  - Check for docs/coding-standards.md      │
│  - Run architecture/standards skills if    │
│    needed                                  │
└────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│  Phase 1: Requirements (PM Skill)          │
│  - Analyzes existing project               │
│  - Creates PRD with requirements           │
│  - Generates user stories                  │
│  Output: PRD + 3 stories                   │
└────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│  Phase 2: Implementation (Dev Skill)       │
│  For each story:                           │
│  - Reads coding standards                  │
│  - Implements tasks                        │
│  - Writes tests                            │
│  - Updates story file                      │
│  Output: Implemented code + tests          │
└────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│  Phase 3: Quality Assurance (QA Skill)     │
│  For each story:                           │
│  - Runs testing skill                      │
│  - Reviews against standards               │
│  - Checks architecture compliance          │
│  - Creates quality gate                    │
│  Output: QA gates, updated stories         │
└────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│  Phase 4: Delivery Report                  │
│  - Comprehensive report                    │
│  - Metrics and summaries                   │
│  - Next steps                              │
│  Output: docs/delivery-reports/*.md        │
└────────────────────────────────────────────┘
```

## Usage Examples

### 1. Full Feature Delivery (Recommended)

Autonomous end-to-end delivery:

```bash
# Claude Code will invoke the feature-delivery skill
# which orchestrates everything

User: "I want to add dark mode toggle to the app settings"

# The feature-delivery skill will:
# 1. Check/create architecture and standards docs
# 2. Create PRD with user stories
# 3. Implement each story
# 4. Run QA on each story
# 5. Generate delivery report
```

### 2. Individual Skill Usage

Use skills independently:

**Document Architecture (First Time)**:
```bash
# Analyzes existing codebase and creates architecture.md
Skill(command: "architecture")
```

**Document Standards (First Time)**:
```bash
# Analyzes codebase and creates coding-standards.md
Skill(command: "standards")
```

**Import from JIRA**:
```bash
# Option 1: With JIRA API access
Skill(command: "jira")
# Provide JIRA ticket ID (e.g., SMOKE-123)
# Output: Story file + optional dev workflow

# Option 2: Web scraping (no API needed)
Skill(command: "jira")
# Provide JIRA URL or paste HTML
# Output: Story file

# Option 3: Import multiple tickets
Skill(command: "jira")
# Provide JQL query or list of ticket IDs
# Output: Multiple story files
```

**Create Requirements & Stories**:
```bash
Skill(command: "pm")
# Provide feature description
# Output: PRD + user stories
```

**Implement a Story**:
```bash
Skill(command: "dev")
# Provide story file path
# Output: Implemented code + tests
```

**Create E2E Tests & Evaluate Coverage**:
```bash
Skill(command: "sdet")
# Analyzes codebase and creates comprehensive test suites
# Output: E2E tests, coverage report, test infrastructure
```

**QA Validation**:
```bash
Skill(command: "qa")
# Provide story file path
# Output: Quality gate decision
```

### 3. Workflow Variations

**New Project (No Existing Code)**:
```bash
1. Skill(command: "architecture")  # Design mode
2. Skill(command: "pm")             # Create PRD/stories
3. Skill(command: "dev")            # Implement
4. Skill(command: "standards")      # Document what was created
5. Skill(command: "qa")             # Validate
```

**Existing Project (First Time)**:
```bash
1. Skill(command: "architecture")  # Analyze and document
2. Skill(command: "standards")     # Analyze and document
3. Skill(command: "feature-delivery") # Then use for features
```

**Existing Project (Already Documented)**:
```bash
# Just use feature-delivery, it will use existing docs
Skill(command: "feature-delivery")
```

**JIRA-Driven Development**:
```bash
# Import JIRA tickets and auto-start dev workflow
1. Skill(command: "jira")         # Import ticket (API or scrape)
   # Outputs: docs/stories/1.1.story.md
2. Auto-invokes dev skill          # Implement story
3. Auto-invokes qa skill           # Validate and test
4. Optionally sync back to JIRA    # Update ticket status

# Or import sprint backlog
1. Skill(command: "jira")         # JQL: sprint='Sprint 5'
   # Outputs: Multiple story files
2. Review stories
3. Selectively start dev on stories
```

**Test-First Development with SDET**:
```bash
# Build comprehensive test suite before or after feature implementation
1. Skill(command: "sdet")         # Analyze app and create test strategy
   # Outputs: Test coverage report, identifies gaps
2. Skill(command: "sdet")         # Create e2e tests for critical flows
   # Outputs: E2E test suites, page objects, test utilities
3. Skill(command: "dev")          # Implement features
4. Skill(command: "qa")           # Run tests and validate
   # Uses tests created by SDET

# Or evaluate existing test coverage
1. Skill(command: "sdet")         # Analyze current test coverage
   # Outputs: Coverage report with gap analysis
2. Review recommendations
3. Skill(command: "sdet")         # Create tests for identified gaps
```

## Outputs & Artifacts

### Directory Structure Created

```
docs/
├── architecture.md              # From architecture skill
├── coding-standards.md          # From standards skill
├── prd.md                       # From PM skill
├── jira-mapping.json            # From JIRA skill (if used)
├── test-coverage-report.md      # From SDET skill
├── test-strategy.md             # From SDET skill
├── test-maintenance.md          # From SDET skill
├── stories/                     # From PM or JIRA skill
│   ├── 1.1.dark-mode-toggle.md
│   ├── 1.2.theme-persistence.md
│   └── 1.3.theme-styles.md
├── qa-gates/                    # From QA skill
│   ├── 1.1-dark-mode-toggle.yml
│   ├── 1.2-theme-persistence.yml
│   └── 1.3-theme-styles.yml
├── sdet-reports/                # From SDET skill
│   └── 2024-10-19-test-report.md
└── delivery-reports/            # From feature-delivery skill
    └── dark-mode-2024-10-19.md
```

### Source Code

```
src/                             # From dev skill
├── components/
│   ├── ThemeToggle.tsx         # New
│   ├── ThemeToggle.test.tsx    # New (unit tests)
│   └── Settings.tsx            # Modified
├── hooks/
│   ├── useTheme.ts             # New
│   └── useTheme.test.ts        # New (unit tests)
└── context/
    └── ThemeContext.tsx        # New

tests/                           # From SDET skill
├── e2e/
│   ├── theme-toggle.spec.ts    # New (e2e tests)
│   └── settings-flow.spec.ts   # New (e2e tests)
├── integration/
│   └── api/theme.test.ts       # New (API tests)
├── pages/
│   ├── SettingsPage.ts         # New (page objects)
│   └── ThemePage.ts            # New (page objects)
└── helpers/
    └── test-utils.ts           # New (test utilities)
```

## Key Features

### 🚀 Autonomous Execution
- Minimal user intervention required
- Skills invoke other skills as needed
- Intelligent error handling and recovery

### 📚 BMad-Inspired, Not BMad-Dependent
- Based on BMad methodology (if you have it)
- Fully self-contained skills
- No BMad installation required
- Works in any project

### 🎯 Portable & Adaptable
- No hard-coded standards
- Standards skill learns from YOUR codebase
- Architecture skill adapts to YOUR patterns
- Works with any tech stack

### 🔄 Context Passing
- Skills communicate via file outputs
- JSON summaries for programmatic consumption
- Clean separation of concerns

### ✅ Quality Built-In
- Every story gets QA validation
- Testing skill integration
- Standards compliance checking
- Architecture validation

### 📊 Comprehensive Reporting
- Delivery reports with metrics
- Quality gate decisions
- Issue tracking and recommendations
- Clear next steps

## Skill Dependencies

```
feature-delivery (orchestrator)
    ├── architecture (optional, if docs missing)
    ├── standards (optional, if docs missing)
    ├── pm (required)
    │   └── reads: architecture.md (if exists)
    ├── dev (required, per story)
    │   ├── reads: coding-standards.md
    │   ├── reads: architecture.md
    │   └── reads: story.md
    └── qa (required, per story)
        ├── reads: coding-standards.md
        ├── reads: architecture.md
        ├── reads: story.md
        └── invokes: testing skill
```

## Best Practices

### First Time in a Project

1. **Run architecture skill** - Document the system
2. **Run standards skill** - Document the conventions
3. **Review the generated docs** - Ensure accuracy
4. **Then use feature-delivery** - For new features

### Ongoing Development

1. **Use feature-delivery** for complete features
2. **Use individual skills** for specific tasks
3. **Update architecture.md** when architecture changes
4. **Re-run standards skill** if conventions evolve

### Quality Assurance

- QA skill is **advisory, not blocking**
- PASS = Ready for production
- CONCERNS = Deploy with monitoring
- FAIL = Significant issues, fix before deploying
- WAIVED = Known issues accepted

### Error Handling

Skills are designed to:
- **Report failures clearly**
- **Provide partial results** when possible
- **Suggest remediation** steps
- **Allow retry or skip** decisions

## Comparison with BMad

| Feature | BMad System | These Skills |
|---------|-------------|--------------|
| **Installation** | Requires BMad setup | No dependencies |
| **Templates** | Uses .bmad-core templates | Self-contained |
| **Interactivity** | Interactive elicitation | Autonomous (with checkpoints) |
| **Personas** | Agent personas (PM, Dev, QA) | Skill-based (same roles) |
| **Standards** | Manual configuration | Auto-discovered from codebase |
| **Portability** | Project-specific | Works anywhere |
| **Use Case** | Large, structured projects | Any project, any size |

## Extending the System

### Adding New Skills

Create a new directory:
```bash
mkdir .claude/skills/my-skill
```

Create `skill.md` with:
- Skill overview and purpose
- When to use this skill
- What it produces
- Detailed instructions for execution
- JSON output format for chaining

### Modifying Existing Skills

Skills are markdown files - just edit them:
- Add new capabilities
- Adjust standards
- Change output formats
- Update instructions

### Chaining Skills

Skills can invoke other skills using:
```
Invoke Skill(command: "skill-name") with {inputs}
Wait for results
Process output
Continue workflow
```

## Troubleshooting

### "Coding standards document not found"
```bash
# Run standards skill first
Skill(command: "standards")
```

### "Architecture document missing critical info"
```bash
# Re-run architecture skill
Skill(command: "architecture")
```

### "Tests are failing"
```bash
# The dev skill runs tests - review the output
# Fix implementation
# Re-run dev skill on that story
```

### "QA gate is FAIL"
```bash
# Review the QA gate file in docs/qa-gates/
# See specific issues
# Re-run dev skill to fix
# Re-run QA skill to validate
```

## Future Enhancements

Potential additions:
- **Parallel story execution** - Implement multiple stories simultaneously
- **Git integration** - Auto-commit after each story
- **PR creation** - Auto-create PRs after QA passes
- **Rollback capability** - Undo changes if needed
- **Performance skill** - Performance testing and optimization
- **Security skill** - Security scanning and validation
- **Documentation skill** - API docs, user docs generation
- **Deployment skill** - Deploy to staging/production

## Credits

- Inspired by **BMad (Business Methodology for AI Development)**
- Designed for **Claude Code** by Anthropic
- Created for autonomous feature delivery workflows

---

**Ready to deliver features autonomously? Start with:**

```bash
Skill(command: "feature-delivery")
```

Then describe your feature and let the system do the rest! 🚀
