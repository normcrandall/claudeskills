---
name: JIRA Integration
description: Imports JIRA tickets (via API or web scraping) and converts them to local story files. Supports single tickets, bulk imports via JQL, and optional dev workflow kickoff. Works with or without API credentials.
---

# JIRA Skill - JIRA Integration & Story Import (API + Web Scraping)

**JIRA Integration Skill**

This skill fetches JIRA tickets (stories, tasks, bugs) and converts them to local story format. Supports **both JIRA API** and **web scraping** for flexibility.

## When to Use This Skill

- Implementing JIRA tickets in your backlog
- Converting JIRA stories/tasks/bugs to local story files
- Starting dev work directly from JIRA tickets
- When you don't have JIRA API access (use web scraping)
- Bulk importing stories from JIRA

## What This Skill Produces

1. **Story Files** - Converted JIRA tickets in `docs/stories/`
2. **Ticket Mapping** - JSON mapping JIRA IDs to local story paths
3. **Optional Dev Kickoff** - Can automatically invoke dev skill

## Skill Instructions

You are now operating as **JIRA Integration Specialist**. Your role is to fetch JIRA tickets (via API or web scraping) and convert them to local story format.

### Core Principles

- **Flexible Access**: Support both API and web scraping
- **Faithful Conversion**: Preserve all JIRA ticket information
- **Traceable**: Maintain link between JIRA ticket and local story
- **Support All Types**: Stories, tasks, bugs, epics
- **Optional Automation**: Can kick off dev workflow automatically

### Execution Workflow

#### Step 1: Determine Access Method

**Ask user which method to use**:

```
How would you like to fetch JIRA tickets?

1. JIRA API (requires credentials)
2. Web Scraping (paste JIRA URL or HTML)
3. Auto-detect (try API, fallback to scraping)
```

**Or auto-detect**:
- Check for JIRA credentials in environment
- If found → Try API
- If not found or API fails → Use web scraping

---

### Method A: JIRA API Access

#### A1. JIRA Authentication

**Check for credentials**:
1. Look for environment variables:
   - `JIRA_BASE_URL` (https://your-company.atlassian.net)
   - `JIRA_EMAIL` (your-email@company.com)
   - `JIRA_API_TOKEN` (get from https://id.atlassian.com/manage-profile/security/api-tokens)
2. If missing, check `.env` or `.env.local`
3. If still missing, ask user to provide

**Validate credentials**:
```bash
curl -u email@example.com:api_token \
  https://your-domain.atlassian.net/rest/api/3/myself
```

#### A2. Fetch Via API

**Input Options**:

**Single Ticket**:
```
Input: JIRA ticket ID (e.g., "SMOKE-123")
API: GET /rest/api/3/issue/SMOKE-123
```

**Multiple Tickets**:
```
Input: ["SMOKE-123", "SMOKE-124", "SMOKE-125"]
API: GET /rest/api/3/issue/{key} for each
```

**JQL Query**:
```
Input: "project = SMOKE AND sprint = 'Sprint 5' AND type = Story"
API: GET /rest/api/3/search?jql={encoded_jql}
```

**Extract from API response**:
```json
{
  "key": "SMOKE-123",
  "fields": {
    "summary": "Add dark mode toggle",
    "description": "Full description...",
    "issuetype": {"name": "Story"},
    "status": {"name": "To Do"},
    "assignee": {"displayName": "John Doe"},
    "reporter": {"displayName": "Jane Smith"},
    "priority": {"name": "High"},
    "labels": ["frontend", "ui"],
    "components": [{"name": "Settings"}],
    "customfield_10001": 5,  // Story points
    "subtasks": [...],
    "comment": {"comments": [...]}
  }
}
```

---

### Method B: Web Scraping

**More flexible, no API credentials needed!**

#### B1. Get JIRA Ticket HTML

**Option 1: User Provides URL**
```
Input: "https://your-company.atlassian.net/browse/SMOKE-123"

Instructions to user:
1. Use WebFetch tool to fetch the URL
2. Extract ticket details from HTML
```

**Option 2: User Provides HTML**
```
Input: User copies full HTML from JIRA page
(Right-click → Inspect → Copy outerHTML of ticket container)
```

**Option 3: User Provides Key Info**
```
Ask user to copy/paste from JIRA:
- Ticket ID:
- Title:
- Description:
- Acceptance Criteria:
- Type:
- Status:
- Priority:
```

#### B2. Parse HTML/Text

**HTML Parsing Strategy**:

JIRA uses consistent CSS classes and data attributes:

```html
<!-- Ticket Key -->
<a id="key-val" data-issue-key="SMOKE-123">SMOKE-123</a>

<!-- Summary/Title -->
<h1 id="summary-val">Add dark mode toggle</h1>

<!-- Description -->
<div class="user-content-block" data-field-name="description">
  <p>Description text...</p>
</div>

<!-- Issue Type -->
<span id="type-val">Story</span>

<!-- Status -->
<span id="status-val">To Do</span>

<!-- Priority -->
<span id="priority-val">High</span>

<!-- Assignee -->
<span id="assignee-val">John Doe</span>

<!-- Reporter -->
<span id="reporter-val">Jane Smith</span>

<!-- Labels -->
<ul class="labels">
  <li>frontend</li>
  <li>ui</li>
</ul>

<!-- Custom fields (Acceptance Criteria often in description or custom field) -->
<div data-field-id="customfield_10002">
  <p>Acceptance criteria...</p>
</div>

<!-- Subtasks -->
<div id="issuedetails" class="subtasks">
  <table>
    <tr data-issue-key="SMOKE-124">...</tr>
  </table>
</div>
```

**Extraction Logic**:

```javascript
// Pseudo-code for extraction
extract_ticket_info(html):
  ticket_key = find text in element with id="key-val"
  summary = find text in h1 with id="summary-val"
  description = find text in div with class="user-content-block"
  issue_type = find text in span with id="type-val"
  status = find text in span with id="status-val"
  priority = find text in span with id="priority-val"
  assignee = find text in span with id="assignee-val"
  reporter = find text in span with id="reporter-val"
  labels = find all li in ul.labels

  // Acceptance criteria often in description or custom field
  ac = extract_acceptance_criteria(description)

  return ticket_info
```

**Text Parsing (Manual Entry)**:

If user just pastes text:
```
Parse format like:
SMOKE-123
Summary: Add dark mode toggle
Type: Story
Status: To Do
Description:
As a user, I want to toggle dark mode...

Acceptance Criteria:
1. Toggle button in settings
2. Theme persists across sessions
3. ...
```

#### B3. WebFetch Integration

**Use WebFetch tool to scrape**:

```
Invoke WebFetch tool:
  URL: {jira_url}
  Prompt: "Extract the following from this JIRA ticket:
    - Ticket ID
    - Summary/Title
    - Description
    - Issue Type
    - Status
    - Priority
    - Assignee
    - Reporter
    - Labels
    - Acceptance Criteria (look in description or custom fields)
    - Subtasks (if any)
    Return as structured JSON"
```

WebFetch will:
1. Fetch the JIRA page HTML
2. Use AI to extract structured data
3. Return JSON with ticket info

---

### Step 2: Convert to Local Story Format

**Same conversion regardless of source (API or scraping)**

Determine story ID and create file at `docs/stories/{epic}.{num}.{slug}.md`:

```markdown
# Story {epic}.{num}: {Summary}

**JIRA Ticket**: [{JIRA-KEY}]({JIRA-URL})
**Type**: {Story|Task|Bug}
**Priority**: {High|Medium|Low}
**Status in JIRA**: {status}

## Status
Draft

## Story

{Parse description into story format}

As a {extract role from description},
I want {extract action},
so that {extract benefit}.

**Original JIRA Description**:
```
{Full description from JIRA}
```

## Acceptance Criteria

{Extract from JIRA - could be in:}
- Custom "Acceptance Criteria" field
- Section in description marked "AC:" or "Acceptance Criteria:"
- Numbered list in description
- Generated from description if not explicit

1. {Criterion 1}
2. {Criterion 2}
3. {Criterion 3}

## Tasks / Subtasks

{If JIRA has subtasks:}
- [ ] {Subtask 1 summary} (JIRA: {subtask-key})
- [ ] {Subtask 2 summary} (JIRA: {subtask-key})

{If no subtasks, generate from ACs:}
- [ ] Task 1: Implement {AC1}
  - [ ] Subtask 1.1
  - [ ] Subtask 1.2
- [ ] Task 2: Test {AC2}
  - [ ] Subtask 2.1

## Dev Notes

**JIRA Context**:
- **Ticket**: [{JIRA-KEY}]({full-url})
- **Reporter**: {reporter}
- **Assignee**: {assignee}
- **Priority**: {priority}
- **Labels**: {labels}
- **Components**: {components}
- **Story Points**: {points if available}

**Technical Details**:
{Extract technical notes from description or comments}

**Related Work**:
{Links to related tickets if mentioned}

### Testing

**Test Requirements** (based on issue type):

{For Stories:}
- Unit tests for new components/functions
- Integration tests for user flows
- E2E tests for critical paths

{For Bugs:}
- Regression test to prevent recurrence
- Verify fix doesn't break related functionality
- Test edge cases mentioned in bug report

{For Tasks:}
- Unit tests for new functionality
- Validation tests per acceptance criteria

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| {today} | 1.0 | Imported from JIRA {JIRA-KEY} | JIRA Skill |

## Dev Agent Record

{Empty - to be filled by dev skill}

## QA Results

{Empty - to be filled by QA agent}

## JIRA Integration

**Ticket ID**: {JIRA-KEY}
**Ticket URL**: {full URL}
**Import Method**: {API|WebScrape|Manual}
**Last Synced**: {timestamp}
```

### Special Handling by Issue Type

**For Bugs**:
```markdown
## Bug Details

**Steps to Reproduce**:
{Extract from description}

**Expected Behavior**:
{Extract from description}

**Actual Behavior**:
{Extract from description}

**Environment**:
{Extract from description or fields}

## Story
As a user, I expect {expected behavior}, but currently {actual behavior occurs}.
```

**For Epics**:
```markdown
# Epic {num}: {Epic Name}

**JIRA Epic**: [{EPIC-KEY}]({url})

## Epic Goal
{Epic description}

## Child Stories
{List of linked stories from JIRA}
- [ ] SMOKE-123: Story title
- [ ] SMOKE-124: Story title

{Can import all child stories automatically}
```

---

### Step 3: Create JIRA Mapping File

Create or update `docs/jira-mapping.json`:

```json
{
  "access_method": "api|webscrape|manual",
  "jira_base_url": "https://your-company.atlassian.net",
  "last_sync": "2024-10-19T18:45:00Z",
  "mappings": [
    {
      "jira_key": "SMOKE-123",
      "jira_url": "https://your-company.atlassian.net/browse/SMOKE-123",
      "story_id": "1.1",
      "story_path": "docs/stories/1.1.dark-mode-toggle.md",
      "type": "Story",
      "jira_status": "To Do",
      "local_status": "Draft",
      "import_method": "webscrape",
      "imported_at": "2024-10-19T18:45:00Z"
    }
  ]
}
```

---

### Step 4: Optional - Kick Off Dev Workflow

**Ask user**:
```
Story imported successfully: docs/stories/1.1.dark-mode-toggle.md

What would you like to do?

1. Start dev workflow now (dev skill → QA skill)
2. Review story first, start dev later
3. Import more tickets
```

**If option 1**:
```
Invoke Skill(command: "dev") with story_path
  → Implementation
Invoke Skill(command: "qa") with story_path
  → Quality validation
```

---

### Step 5: Return Summary

```json
{
  "status": "completed",
  "access_method": "webscrape",
  "tickets_imported": 1,
  "stories_created": [
    {
      "jira_key": "SMOKE-123",
      "jira_url": "https://company.atlassian.net/browse/SMOKE-123",
      "story_id": "1.1",
      "story_path": "docs/stories/1.1.dark-mode-toggle.md",
      "type": "Story",
      "priority": "High",
      "import_method": "webscrape"
    }
  ],
  "mapping_file": "docs/jira-mapping.json",
  "dev_workflow_started": false,
  "summary": "Imported SMOKE-123 via web scraping as story 1.1"
}
```

---

## Usage Examples

### Example 1: Web Scraping (No API Access)

```
User: "Import this JIRA ticket: https://company.atlassian.net/browse/SMOKE-123"

JIRA Skill:
1. Detects no API credentials
2. Uses WebFetch to scrape the URL
3. Extracts ticket details from HTML
4. Creates docs/stories/1.1.dark-mode.md
5. Asks: "Start dev workflow?"

User: "Yes"

JIRA Skill:
6. Invokes dev skill
7. Invokes QA skill
8. Reports completion
```

### Example 2: Manual Text Entry

```
User: "I'll paste the JIRA info"

JIRA Skill: "Please paste the ticket details:"

User:
```
SMOKE-123: Add dark mode toggle
Type: Story
Priority: High

Description:
As a user, I want to toggle between light and dark mode in settings,
so that I can use the app comfortably at night.

Acceptance Criteria:
1. Toggle switch in settings page
2. Theme persists on reload
3. Applies to all pages
```

JIRA Skill:
1. Parses the text
2. Creates story file
3. Asks: "Start dev workflow?"
```

### Example 3: API + Bulk Import

```
User: "Import all stories from Sprint 5"

JIRA Skill:
1. Checks for API credentials (found)
2. Queries: jql=sprint='Sprint 5' AND type=Story
3. Gets 5 stories
4. Creates 5 story files
5. Asks: "Import subtasks too?" → Yes
6. Creates additional story files for subtasks
7. Reports: "7 stories imported"
```

### Example 4: Mixed Methods

```
User: "Try API first, but I'll paste HTML if it doesn't work"

JIRA Skill:
1. Tries API → Fails (no credentials)
2. Falls back to asking for URL or HTML
3. User pastes JIRA URL
4. Uses WebFetch to scrape
5. Success: Story imported
```

---

## Comparison: API vs Web Scraping

| Feature | API | Web Scraping |
|---------|-----|--------------|
| **Setup** | Requires credentials | No setup needed |
| **Bulk Import** | Easy (JQL queries) | Manual (one at a time) |
| **Accuracy** | 100% reliable | 95% reliable |
| **Custom Fields** | Full access | Depends on page |
| **Speed** | Fast | Slower |
| **Permissions** | Respects JIRA permissions | Public tickets only |
| **Offline** | No | HTML can be saved |
| **Best For** | Frequent use, bulk ops | Quick one-off imports |

---

## Web Scraping Strategies

### Strategy 1: WebFetch Tool

**Advantages**:
- Uses Claude's web fetching
- AI extracts structured data
- Handles HTML complexity

**Usage**:
```
WebFetch(
  url: "https://company.atlassian.net/browse/SMOKE-123",
  prompt: "Extract JIRA ticket details as JSON with fields:
    key, summary, description, type, status, priority,
    assignee, reporter, labels, acceptance_criteria, subtasks"
)
```

### Strategy 2: User Provides HTML

**Advantages**:
- Works even behind auth
- User can inspect and copy HTML
- No network requests needed

**Instructions for user**:
```
1. Open JIRA ticket in browser
2. Right-click → Inspect Element
3. Find the main ticket container
4. Right-click on HTML → Copy → Copy outerHTML
5. Paste here
```

### Strategy 3: Structured Text Input

**Advantages**:
- Simplest fallback
- Works for any ticket
- User controls what's shared

**Template**:
```
Ticket ID: SMOKE-123
Title: Add dark mode
Type: Story
Priority: High
Status: To Do

Description:
{paste description}

Acceptance Criteria:
1. {criterion}
2. {criterion}
```

---

## Error Handling

### API Errors

**No Credentials**:
```
ℹ️  No JIRA API credentials found
Options:
1. Provide credentials now
2. Use web scraping instead
```

**Invalid Credentials**:
```
❌ JIRA API authentication failed
Reason: Invalid email or API token

Options:
1. Re-enter credentials
2. Use web scraping instead
```

**Ticket Not Found (API)**:
```
❌ Ticket SMOKE-123 not found via API
Possible reasons:
- Ticket doesn't exist
- You don't have permission
- Ticket is in different project

Options:
1. Check ticket ID
2. Try web scraping (if ticket is public)
```

### Web Scraping Errors

**Fetch Failed**:
```
❌ Failed to fetch JIRA URL
URL: {url}
Reason: {error}

Options:
1. Check URL is accessible
2. Paste HTML manually
3. Paste ticket details as text
```

**Extraction Failed**:
```
⚠️  Could not extract some fields from HTML
Extracted: title, description, type
Missing: acceptance criteria, subtasks

Options:
1. Manually add missing info to story file
2. Provide missing details now
3. Continue anyway (can add later)
```

### Graceful Degradation

```
Priority for extraction:
1. Ticket ID (required - must have)
2. Summary/Title (required)
3. Description (required)
4. Type (default to "Story" if missing)
5. Status (default to "To Do")
6. Priority (default to "Medium")
7. Acceptance Criteria (can generate from description)
8. Everything else (nice to have)

If fields 1-3 extracted → Success
If any missing → Ask user to provide
```

---

## Configuration

Create `.jira-config.json` (optional):

```json
{
  "access_method": "auto",
  "jira_base_url": "https://your-company.atlassian.net",
  "prefer_api": true,
  "fallback_to_scrape": true,
  "auto_start_dev": false,
  "import_subtasks": true,
  "import_comments": false,
  "default_epic": "1",
  "status_mapping": {
    "To Do": "Draft",
    "In Progress": "InProgress",
    "Code Review": "Ready for Review",
    "Done": "Done"
  }
}
```

---

## Best Practices

**For API Access**:
1. Store credentials in `.env.local` (add to .gitignore)
2. Use API for bulk operations
3. Leverage JQL for complex queries

**For Web Scraping**:
1. Use for one-off imports
2. WebFetch for public tickets
3. Manual HTML for auth-protected tickets
4. Text paste as last resort

**General**:
1. Always verify extracted info
2. Review story before starting dev
3. Update JIRA manually if no API access
4. Keep jira-mapping.json for traceability

---

## Future Enhancements

- **GitHub Issues**: Similar skill for GitHub
- **Linear**: For Linear users
- **Chrome Extension**: One-click import from JIRA page
- **Webhook Listener**: Real-time imports
- **Bidirectional Sync**: Update JIRA from local changes (API only)
- **Attachment Download**: Fetch mockups/screenshots
- **Smart Field Detection**: Better custom field handling
- **Template Customization**: Custom story templates per project
