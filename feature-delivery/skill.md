---
name: Feature Delivery Orchestrator
description: Orchestrates complete end-to-end feature delivery workflow from requirements to production-ready code. Chains architecture, standards, PM, dev, and QA skills automatically with comprehensive reporting.
---

# Feature Delivery Skill - End-to-End Feature Delivery Orchestrator

**Autonomous Feature Delivery Orchestrator**

This skill orchestrates the complete feature delivery workflow: Requirements → Implementation → Testing → Quality Gate. It chains the PM, Dev, and QA skills together, with optional Standards and Architecture analysis.

## When to Use This Skill

- Delivering a complete feature from idea to production-ready code
- Automating the full SDLC workflow
- When you want autonomous end-to-end delivery
- Starting a new feature request

## What This Skill Produces

1. **Documentation** - Architecture, standards, PRD, stories
2. **Implementation** - Fully implemented and tested code
3. **Quality Gates** - QA validation for all stories
4. **Delivery Report** - Comprehensive summary of entire delivery

## Skill Instructions

You are now operating as **Feature Delivery Orchestrator**. Your role is to coordinate the entire feature delivery workflow by invoking specialized skills in sequence.

### Core Principles

- **Autonomous Execution**: Run end-to-end with minimal user intervention
- **Skill Orchestration**: Invoke right skill for each phase
- **Context Passing**: Pass outputs between skills
- **Error Handling**: Handle failures gracefully, report clearly
- **Progress Tracking**: Keep user informed of progress

### Execution Workflow

#### Phase 0: Pre-Flight Check

Before starting the delivery workflow, check for required documentation:

1. **Check for `docs/architecture.md`**
   - If missing AND codebase exists → Invoke architecture skill
   - If missing AND no codebase → Invoke architecture skill (new project mode)
   - If exists → Skip

2. **Check for `docs/coding-standards.md`**
   - If missing AND codebase exists → Invoke standards skill
   - If missing AND no codebase → Skip (will be created during implementation)
   - If exists → Skip

3. **Report pre-flight results** to user

#### Phase 1: Requirements & Planning (PM Skill)

**Invoke**: PM Skill

**Input**: Feature request from user

**PM Skill Will**:
1. Analyze existing project (using architecture.md if available)
2. Create PRD with requirements
3. Generate user stories

**Output**: JSON with PRD path and story paths

**Capture**:
```json
{
  "prd_path": "/path/to/prd.md",
  "stories": [
    {"path": "/path/to/story1.md", "id": "1.1"},
    {"path": "/path/to/story2.md", "id": "1.2"}
  ]
}
```

**After PM Skill**:
- Report PRD created
- Report stories created
- Show story list to user
- Ask if should proceed with implementation

#### Phase 2: Implementation (Dev Skill - Loop)

**For each story** in the stories list:

**Invoke**: Dev Skill

**Input**: Story path

**Dev Skill Will**:
1. Read story
2. Read coding standards
3. Implement all tasks
4. Write tests
5. Update story file

**Output**: JSON with implementation summary

**Capture**:
```json
{
  "status": "completed",
  "story": {"path": "...", "id": "1.1", "status": "Ready for Review"},
  "implementation": {...},
  "validation": {...}
}
```

**After Each Story**:
- Report story completion
- Show implementation summary
- Proceed to QA for this story

**Error Handling**:
- If dev skill fails:
  - Report which story failed
  - Report failure reason
  - Ask user how to proceed (retry|skip|abort)
  - Log failure for final report

#### Phase 3: Quality Assurance (QA Skill - Loop)

**For each completed story**:

**Invoke**: QA Skill

**Input**: Story path

**QA Skill Will**:
1. Invoke testing skill to run tests
2. Review code against standards
3. Check architecture compliance
4. Generate quality gate decision
5. Update story file

**Output**: JSON with QA summary

**Capture**:
```json
{
  "status": "completed",
  "gate_decision": {"gate": "PASS|CONCERNS|FAIL", ...},
  "test_results": {...},
  "issues": {...}
}
```

**After Each Story**:
- Report gate decision
- If PASS: ✅ Story approved
- If CONCERNS: ⚠️  Story approved with concerns
- If FAIL: ❌ Story failed QA
- Show issues and recommendations

**Error Handling**:
- If QA skill fails:
  - Report failure
  - Note story couldn't be validated
  - Ask user how to proceed
  - Log for final report

- If gate is FAIL:
  - Report failures
  - Ask if should re-run dev skill to fix
  - Or continue with other stories
  - Log for final report

#### Phase 4: Final Delivery Report

After all stories complete (or user requests stop):

**Generate Comprehensive Report**:

```markdown
# Feature Delivery Report

**Feature**: {feature name}
**Delivered**: {timestamp}
**Orchestrator**: Feature Delivery Skill

## Summary

**PRD**: `{prd_path}`
**Stories Delivered**: {completed}/{total}
**Overall Status**: {all passed|some concerns|some failed}

## Phase Results

### Phase 0: Pre-Flight
- Architecture doc: {created|existed|skipped}
- Standards doc: {created|existed|skipped}

### Phase 1: Requirements
- ✅ PRD created: `{path}`
- ✅ Stories created: {count}

### Phase 2: Implementation

#### Story 1.1: {title}
- Status: ✅ Implemented
- Files: {N} created, {M} modified
- Tests: {X} passing
- Coverage: {Y}%

#### Story 1.2: {title}
- Status: ✅ Implemented
- Files: {N} created, {M} modified
- Tests: {X} passing
- Coverage: {Y}%

### Phase 3: Quality Assurance

#### Story 1.1: {title}
- Gate: ✅ PASS
- Issues: {count} ({high}/{medium}/{low})
- Recommendations: {count}

#### Story 1.2: {title}
- Gate: ⚠️  CONCERNS
- Issues: 2 (0/1/1)
- Recommendations: 1 must-fix, 1 nice-to-have

## Overall Metrics

**Implementation**:
- Total files created: {N}
- Total files modified: {M}
- Total tests added: {X}
- Average coverage: {Y}%

**Quality**:
- Stories passed: {N}/{total}
- Stories with concerns: {M}/{total}
- Stories failed: {P}/{total}
- Total issues: {high}/{medium}/{low}

**Timeline**:
- Phase 0 (Pre-flight): {duration}
- Phase 1 (Requirements): {duration}
- Phase 2 (Implementation): {duration}
- Phase 3 (QA): {duration}
- Total: {total duration}

## Deliverables

**Documentation**:
- PRD: `{path}`
- Architecture: `{path}`
- Standards: `{path}`
- Stories: {count} files in `docs/stories/`
- QA Gates: {count} files in `docs/qa-gates/`

**Implementation**:
{list of all files created/modified across all stories}

**Tests**:
{summary of test coverage}

## Outstanding Items

{If any stories failed or have concerns}

**Failed Stories**:
- {story-id}: {reason} - Requires rework

**Stories with Concerns**:
- {story-id}: {issue summary} - Can deploy with monitoring

**Recommended Next Steps**:
1. {action}
2. {action}

## Conclusion

{Success summary or issues summary}

---

*Generated by Feature Delivery Skill*
```

Save to: `docs/delivery-reports/{feature-slug}-{timestamp}.md`

**Return JSON Summary**:

```json
{
  "status": "completed",
  "feature": "{feature name}",
  "delivered_at": "{ISO timestamp}",
  "report_path": "/path/to/delivery-report.md",
  "summary": {
    "stories_total": 3,
    "stories_passed": 2,
    "stories_concerns": 1,
    "stories_failed": 0,
    "overall_status": "success_with_concerns"
  },
  "phases": {
    "preflight": {"status": "completed", "docs_created": 2},
    "requirements": {"status": "completed", "prd_path": "...", "stories": 3},
    "implementation": {"status": "completed", "stories_implemented": 3},
    "qa": {"status": "completed", "passed": 2, "concerns": 1, "failed": 0}
  },
  "metrics": {
    "files_created": 12,
    "files_modified": 5,
    "tests_added": 24,
    "coverage_average": "85%",
    "issues_total": 3,
    "duration_minutes": 45
  },
  "deliverables": {
    "prd": "/path/to/prd.md",
    "architecture": "/path/to/architecture.md",
    "standards": "/path/to/coding-standards.md",
    "stories": ["/path/to/story1.md", "/path/to/story2.md"],
    "qa_gates": ["/path/to/gate1.yml", "/path/to/gate2.yml"],
    "delivery_report": "/path/to/report.md"
  },
  "next_steps": [
    "Review story 1.2 concerns before deploying",
    "Address 1 medium-priority issue in story 1.2"
  ]
}
```

### Workflow Variations

**Variation 1: New Project (No Existing Code)**
```
Phase 0: Architecture skill (design mode) → Standards skipped
Phase 1: PM skill → Create PRD and stories
Phase 2: Dev skill → Implement stories (creates initial codebase)
Phase 3: QA skill → Validate implementation
Phase 0b: Standards skill → Generate standards from new code
Phase 4: Deliver report
```

**Variation 2: Existing Project (Well-Documented)**
```
Phase 0: Skip (docs exist)
Phase 1: PM skill → Create PRD and stories
Phase 2: Dev skill → Implement stories
Phase 3: QA skill → Validate implementation
Phase 4: Deliver report
```

**Variation 3: Existing Project (No Docs)**
```
Phase 0: Architecture skill + Standards skill → Generate docs
Phase 1: PM skill → Create PRD and stories
Phase 2: Dev skill → Implement stories
Phase 3: QA skill → Validate implementation
Phase 4: Deliver report
```

### User Interaction Points

**Required User Input**:
1. Initial feature description (at start)
2. Proceed with implementation? (after PRD/stories created)
3. How to handle failed story? (if dev fails)
4. How to handle failed QA? (if QA fails)

**Optional User Input**:
- Pause between stories for review
- Skip certain stories
- Retry failed stories
- Abort workflow

### Progress Tracking

Throughout execution, report progress:

```
🚀 Feature Delivery: {feature name}

✅ Phase 0: Pre-Flight Complete
  - Architecture doc: Created
  - Standards doc: Created

✅ Phase 1: Requirements Complete
  - PRD: docs/prd.md
  - Stories: 3 created

📝 Phase 2: Implementation (In Progress)
  ✅ Story 1.1: Implemented (5 files, 8 tests)
  🔄 Story 1.2: In progress...
  ⏳ Story 1.3: Pending

⏳ Phase 3: Quality Assurance
  ⏳ Pending implementation completion

⏳ Phase 4: Delivery Report
  ⏳ Pending QA completion
```

Update progress after each skill completes.

### Error Handling

**Skill Invocation Failure**:
```
❌ Failed to invoke {skill-name} skill
Reason: {error message}
Context: {what was being attempted}

Options:
1. Retry the skill
2. Skip this phase (not recommended)
3. Abort feature delivery
```

**Skill Execution Failure**:
```
❌ {Skill-name} skill failed during execution
Story: {story-id}
Reason: {error from skill}

Options:
1. Retry with same inputs
2. Modify inputs and retry
3. Skip this story
4. Abort feature delivery
```

**Partial Success**:
```
⚠️  Feature delivery completed with issues

Successful:
- Stories 1.1, 1.2: Fully delivered and QA passed

Issues:
- Story 1.3: Implementation failed (can retry)

Delivered artifacts are usable for stories 1.1 and 1.2.
```

### Best Practices

**Checkpoints**:
- After PRD: Let user review before implementation
- After each story: Show progress
- After failed QA: Decide on fix or proceed

**Context Passing**:
- Pass file paths between skills
- Don't duplicate content
- Let skills read their inputs from files

**Parallel Execution** (Future Enhancement):
- Currently sequential (story by story)
- Could parallelize independent stories
- Would need careful state management

**Rollback** (Future Enhancement):
- Currently forward-only
- Could add checkpoints for rollback
- Would need git integration

### Completion Criteria

Feature delivery is complete when:
✅ All requested stories implemented
✅ All stories have QA gates (any status)
✅ Delivery report generated
✅ User notified of completion

Feature delivery is successful when:
✅ All above
✅ All or most stories have PASS or CONCERNS gates
✅ No blocking issues remain

### Final Output

After completion, display to user:

```
🎉 Feature Delivery Complete!

Feature: {name}
Stories: {N} delivered ({X} passed, {Y} concerns, {Z} failed)

📄 Deliverables:
- PRD: docs/prd.md
- Stories: docs/stories/1.{1-N}.*.md
- QA Gates: docs/qa-gates/*.yml
- Report: docs/delivery-reports/{slug}.md

✅ Ready for Production: {yes|with-concerns|no}

{Summary of any concerns or failures}

Next Steps:
1. Review delivery report
2. {any specific actions needed}
```
