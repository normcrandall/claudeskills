---
name: feature-delivery-orchestration
description: Orchestrates complete end-to-end feature delivery workflow from requirements to production-ready code. Chains architecture-documentation, coding-standards, product-manager, development-implementation and quality-assurance skills automatically with comprehensive reporting.
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
    { "path": "/path/to/story1.md", "id": "1.1" },
    { "path": "/path/to/story2.md", "id": "1.2" }
  ]
}
```

**After PM Skill**:

- Report PRD created
- Report stories created
- Show story list to user
- Ask if should proceed with implementation

#### Phase 2: Implementation (Dev Skill - Wave-Based or Sequential)

**Check for Parallelization Manifest**:

```typescript
const parallelizationPath = `${projectRoot}/docs/PARALLELIZATION.md`;
const pmOutput = {JSON from Phase 1};

let executionMode = 'sequential'; // default
let waveStructure = null;

// Check PM output first
if (pmOutput.parallelization?.enabled) {
  console.log(`📊 Parallelization Enabled (from PM skill)`);
  console.log(`   Manifest: ${pmOutput.parallelization.manifest_path}`);
  console.log(`   Waves: ${pmOutput.parallelization.waves}`);
  console.log(`   Max Parallel: ${pmOutput.parallelization.max_parallel} agents`);
  console.log(`   Est. Duration: ${pmOutput.parallelization.estimated_duration_parallel} (parallel)`);
  console.log(`   Time Savings: ${pmOutput.parallelization.time_savings_percent}%`);

  executionMode = 'parallel';
  waveStructure = parseParallelizationManifest(pmOutput.parallelization.manifest_path);

} else if (fileExists(parallelizationPath)) {
  // Fallback: Check for manually created manifest
  console.log(`📊 Parallelization Manifest Detected: ${parallelizationPath}`);

  executionMode = 'parallel';
  waveStructure = parseParallelizationManifest(parallelizationPath);

  console.log(`   Waves: ${waveStructure.waves.length}`);
  console.log(`   Max Parallel: ${waveStructure.maxParallel} agents`);

} else {
  console.log(`📌 No parallelization detected`);
  console.log(`   Using sequential execution (one story at a time)`);
  console.log(`   To enable parallel execution:`);
  console.log(`   1. PM skill will auto-generate PARALLELIZATION.md (4+ stories)`);
  console.log(`   2. Or manually create docs/PARALLELIZATION.md`);
}
```

**Parse Parallelization Manifest Function**:

```typescript
function parseParallelizationManifest(path: string): WaveStructure {
  // Read the PARALLELIZATION.md file
  const content = readFile(path);

  // Parse wave tables from markdown
  const waves = [];
  const waveRegex =
    /## Wave (\d+):([^\n]+)\n[\s\S]*?\| Story.*?\n\|([\s\S]*?)(?=\n##|\n\*\*|$)/g;

  let match;
  while ((match = waveRegex.exec(content)) !== null) {
    const waveNumber = parseInt(match[1]);
    const waveName = match[2].trim();
    const tableContent = match[3];

    // Parse table rows
    const stories = [];
    const rowRegex =
      /\|\s*(\d+\.\d+)\s*\|.*?\|\s*([\d.,\s]*?)\s*\|\s*([\d.,\s]*?)\s*\|/g;

    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const storyId = rowMatch[1].trim();
      const dependsOn = rowMatch[2]
        .trim()
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && s !== 'None');
      const parallelWith = rowMatch[3]
        .trim()
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      stories.push({
        id: storyId,
        dependsOn: dependsOn,
        parallelWith: parallelWith,
      });
    }

    waves.push({
      number: waveNumber,
      name: waveName,
      stories: stories,
      maxParallel: stories.length,
    });
  }

  return {
    waves: waves,
    maxParallel: Math.max(...waves.map((w) => w.maxParallel)),
  };
}
```

**Execution: Parallel Mode (Wave-Based)**

If `executionMode === 'parallel'`:

```typescript
for (const wave of waveStructure.waves) {
  console.log(`\n🌊 Wave ${wave.number}: ${wave.name}`);
  console.log(
    `   Stories: ${wave.stories.length} (max ${wave.maxParallel} in parallel)`
  );
  console.log(`   Story IDs: ${wave.stories.map((s) => s.id).join(', ')}`);

  // Pull latest from main before starting wave (includes merged PRs from previous wave)
  if (wave.number > 1) {
    console.log(`\n⬇️  Pulling latest changes from main...`);
    await execCommand('git pull origin main');
    console.log(
      `   ✅ Main branch updated with Wave ${wave.number - 1} changes`
    );
  }

  // PARALLEL INVOCATION: Launch all dev agents for this wave simultaneously
  console.log(`\n📝 Starting Development for Wave ${wave.number}...`);

  const devResults = await Promise.all(
    wave.stories.map((story) => {
      // Find story path from PM output
      const storyData = pmOutput.stories.find((s) => s.id === story.id);
      const storyPath = storyData.path;

      console.log(`   🔄 Launching Dev agent for Story ${story.id}...`);

      // Invoke dev skill as subagent
      return invokeDevelopmentSkill(storyPath, {
        agentId: `dev-wave${wave.number}-story${story.id}`,
      });
    })
  );

  console.log(`\n✅ Wave ${wave.number} Development Complete!`);
  console.log(
    `   Stories implemented: ${devResults.filter((r) => r.status === 'completed').length}/${devResults.length}`
  );

  // Show individual results
  devResults.forEach((result, idx) => {
    const story = wave.stories[idx];
    if (result.status === 'completed') {
      console.log(`   ✅ Story ${story.id}: ${result.summary}`);
    } else {
      console.log(`   ❌ Story ${story.id}: ${result.error || 'Failed'}`);
    }
  });

  // PARALLEL QA: Run QA for all implemented stories in this wave
  console.log(`\n🧪 Starting QA for Wave ${wave.number}...`);

  const qaResults = await Promise.all(
    devResults.map((devResult, idx) => {
      const story = wave.stories[idx];

      if (devResult.status !== 'completed') {
        console.log(`   ⏭️  Skipping QA for failed story ${story.id}`);
        return { status: 'skipped', story: { id: story.id } };
      }

      console.log(`   🔄 Launching QA agent for Story ${story.id}...`);

      const storyData = pmOutput.stories.find((s) => s.id === story.id);
      return invokeQASkill(storyData.path, {
        agentId: `qa-wave${wave.number}-story${story.id}`,
      });
    })
  );

  console.log(`\n✅ Wave ${wave.number} QA Complete!`);
  const passCount = qaResults.filter(
    (r) => r.gate_decision?.gate === 'PASS'
  ).length;
  const concernCount = qaResults.filter(
    (r) => r.gate_decision?.gate === 'CONCERNS'
  ).length;
  const failCount = qaResults.filter(
    (r) => r.gate_decision?.gate === 'FAIL'
  ).length;

  console.log(`   ✅ Passed: ${passCount}`);
  console.log(`   ⚠️  Concerns: ${concernCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  // Show individual QA results
  qaResults.forEach((result, idx) => {
    const story = wave.stories[idx];
    if (result.status === 'skipped') {
      console.log(`   ⏭️  Story ${story.id}: Skipped (dev failed)`);
    } else if (result.gate_decision) {
      const gate = result.gate_decision.gate;
      const emoji = gate === 'PASS' ? '✅' : gate === 'CONCERNS' ? '⚠️' : '❌';
      console.log(`   ${emoji} Story ${story.id}: ${gate}`);
    }
  });

  // Wave completion checkpoint
  const waveSuccess = qaResults.filter(
    (r) => r.gate_decision?.gate !== 'FAIL'
  ).length;
  console.log(
    `\n📊 Wave ${wave.number} Summary: ${waveSuccess}/${wave.stories.length} stories ready`
  );

  // Collect PR URLs from dev results (if in parallel mode)
  const prs = devResults
    .filter((r) => r.git?.pr_url)
    .map((r) => ({
      story: r.story.id,
      pr_url: r.git.pr_url,
      pr_number: r.git.pr_number,
      branch: r.git.branch,
    }));

  if (prs.length > 0) {
    console.log(`\n🔀 Pull Requests Created (${prs.length}):`);
    prs.forEach((pr) => {
      console.log(`   - Story ${pr.story}: ${pr.pr_url}`);
    });

    console.log(`\n📋 PR Management Options:`);
    console.log(`   1. Review PRs individually and merge manually`);
    console.log(`   2. Auto-merge approved PRs (if QA passed)`);
    console.log(`   3. Wait for all wave PRs before proceeding`);
    console.log(
      `\n💡 Recommendation: Review and merge PRs before starting Wave ${wave.number + 1}`
    );
  }

  // Ask user if should proceed to next wave (except for last wave)
  if (wave.number < waveStructure.waves.length) {
    console.log(
      `\n⏸️  Wave ${wave.number} complete. Ready to proceed to Wave ${wave.number + 1}?`
    );
    console.log(
      `   Note: Next wave depends on Wave ${wave.number} being merged into main`
    );
    // User can review results and decide to proceed
  }
}
```

**Execution: Sequential Mode (Fallback)**

If `executionMode === 'sequential'`:

```typescript
// Original sequential logic (one story at a time)
for (const story of pmOutput.stories) {
  console.log(`\n📝 Implementing Story ${story.id}...`);

  // Invoke Dev Skill
  const devResult = await invokeDevelopmentSkill(story.path);

  // Report story completion
  console.log(`✅ Story ${story.id} implemented`);

  // Invoke QA Skill
  console.log(`🧪 Running QA for Story ${story.id}...`);
  const qaResult = await invokeQASkill(story.path);

  console.log(
    `✅ Story ${story.id} QA complete: ${qaResult.gate_decision.gate}`
  );
}
```

**Error Handling (Parallel Mode)**:

- If entire wave fails:
  - Report which stories failed
  - Ask user: retry failed stories | skip wave | abort delivery
  - Log for final report

- If some stories in wave fail:
  - Report failed stories
  - Ask user: retry failed | continue with successful | abort
  - Successful stories proceed to QA

**After Each Story** (Sequential Mode):

- Report story completion
- Show implementation summary
- Proceed to QA for this story

**Error Handling** (Sequential Mode):

- If dev skill fails:
  - Report which story failed
  - Report failure reason
  - Ask user how to proceed (retry|skip|abort)
  - Log failure for final report

#### Phase 3: Quality Assurance (QA Skill - Integrated in Phase 2)

**Note**: In parallel mode, QA runs automatically after each wave's development completes (see Phase 2).

**In sequential mode**, QA runs after each story:

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
- If CONCERNS: ⚠️ Story approved with concerns
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
**Execution Mode**: {Parallel (Wave-Based)|Sequential}

## Summary

**PRD**: `{prd_path}`
**Stories Delivered**: {completed}/{total}
**Overall Status**: {all passed|some concerns|some failed}

{If parallel mode:}
**Parallelization**:

- Waves: {N}
- Max Parallel: {M} agents
- Actual Duration: {X} days
- Estimated Sequential: {Y} days
- Time Savings: {Z}%

## Phase Results

### Phase 0: Pre-Flight

- Architecture doc: {created|existed|skipped}
- Standards doc: {created|existed|skipped}

### Phase 1: Requirements

- ✅ PRD created: `{path}`
- ✅ Stories created: {count}
- 📊 Parallelization: {enabled|disabled}

### Phase 2: Implementation

{If parallel mode, group by waves:}

#### Wave 1: {wave name}

- Duration: {X} days
- Stories: {N} (max {M} in parallel)
- Status: ✅ {successful}/{total} stories completed

**Story 1.1**: {title}

- Status: ✅ Implemented
- Files: {N} created, {M} modified
- Tests: {X} passing
- Coverage: {Y}%

**Story 1.2**: {title}

- Status: ✅ Implemented
- Files: {N} created, {M} modified
- Tests: {X} passing
- Coverage: {Y}%

#### Wave 2: {wave name}

- Duration: {X} days
- Stories: {N} (max {M} in parallel)
- Status: ⚠️ {successful}/{total} stories completed (1 concern)

**Story 1.3**: {title}

- Status: ✅ Implemented
- Files: {N} created, {M} modified
- Tests: {X} passing
- Coverage: {Y}%

{If sequential mode, list all stories flat:}

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

{If parallel mode, group by waves:}

#### Wave 1 QA Results

- ✅ Passed: {N}
- ⚠️ Concerns: {M}
- ❌ Failed: {P}

**Story 1.1**: {title}

- Gate: ✅ PASS
- Issues: {count} ({high}/{medium}/{low})
- Recommendations: {count}

**Story 1.2**: {title}

- Gate: ✅ PASS
- Issues: 0
- Recommendations: 0

#### Wave 2 QA Results

- ✅ Passed: 0
- ⚠️ Concerns: 1
- ❌ Failed: 0

**Story 1.3**: {title}

- Gate: ⚠️ CONCERNS
- Issues: 2 (0/1/1)
- Recommendations: 1 must-fix, 1 nice-to-have

{If sequential mode, list QA results flat:}

#### Story 1.1: {title}

- Gate: ✅ PASS
- Issues: {count} ({high}/{medium}/{low})
- Recommendations: {count}

#### Story 1.2: {title}

- Gate: ⚠️ CONCERNS
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

_Generated by Feature Delivery Skill_
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
    "preflight": { "status": "completed", "docs_created": 2 },
    "requirements": { "status": "completed", "prd_path": "...", "stories": 3 },
    "implementation": { "status": "completed", "stories_implemented": 3 },
    "qa": { "status": "completed", "passed": 2, "concerns": 1, "failed": 0 }
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

**Parallel Execution** (Implemented):

- ✅ Wave-based parallel execution via PARALLELIZATION.md
- ✅ Uses git worktrees to avoid conflicts between agents
- ✅ Each agent works in isolated directory on separate branch
- ✅ PRs created automatically for each story
- ✅ Checkpoint between waves for PR review/merge

**Rollback** (Future Enhancement):

- Currently forward-only
- Could add checkpoints for rollback
- Would need git integration

### Git Worktree Workflow (Parallel Mode)

When running in parallel mode, each development agent uses git worktrees to avoid conflicts:

**Per-Story Workflow**:

1. **Agent creates worktree**: `../project-story-1.1/` with branch `story/1-1-title`
2. **Agent implements** story in isolated directory
3. **Agent commits** all changes with story-specific message
4. **Agent pushes** branch to remote
5. **Agent creates PR** with comprehensive description
6. **Agent cleans up** worktree (directory removed, branch remains on remote)
7. **Agent returns** PR URL in JSON output

**Wave Completion**:

- All agents complete → All PRs created
- Orchestrator displays PR list
- User reviews PRs (or auto-merge if QA passed)
- User merges PRs before starting next wave
- Next wave pulls from main (includes all merged changes)

**Benefits**:

- ✅ No git conflicts between parallel agents
- ✅ Each story gets isolated review via PR
- ✅ Clean separation of changes
- ✅ Easy rollback (don't merge problematic PR)
- ✅ Maintains git history clarity

**PR Review Workflow**:

```bash
# After Wave 1 completes with 2 PRs
🔀 Pull Requests Created (2):
   - Story 1.1: https://github.com/user/repo/pull/101
   - Story 1.2: https://github.com/user/repo/pull/102

# User can:
1. Review PRs on GitHub
2. Merge individually: gh pr merge 101 --squash
3. Or merge all: gh pr merge 101 102 --squash
4. Then proceed to Wave 2

# Wave 2 agents will:
- Pull latest main (includes merged Wave 1 changes)
- Create new worktrees with fresh codebase
- Build on top of Wave 1 work
```

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
