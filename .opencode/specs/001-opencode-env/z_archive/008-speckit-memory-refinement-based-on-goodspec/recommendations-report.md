# Recommendations Report: System-Spec-Kit Improvements

> **Date:** February 4, 2026
> **Source:** Analysis of Goodspec framework and Reddit community insights
> **Target Systems:** system-spec-kit, spec_kit commands, memory commands, agents

---

## Executive Summary

Based on comprehensive analysis of the Goodspec framework (12 agents, 20 commands, 33 skills) and community feedback, this report provides **8 prioritized recommendations** for enhancing our System-Spec-Kit implementation. The recommendations balance adopting proven UX patterns from Goodspec while preserving our advanced technical innovations (hybrid search, constitutional tier, FSRS decay, causal graph, session deduplication).

**Strategy:** Adopt Goodspec's simplicity and user experience patterns while retaining our technical depth.

---

## Priority Classification

| Priority             | Criteria                                          | Timeline  |
| -------------------- | ------------------------------------------------- | --------- |
| **P0 (Critical)**    | High impact, low effort, addresses major friction | Immediate |
| **P1 (High)**        | Significant improvement, moderate effort          | Near-term |
| **P2 (Medium)**      | Nice-to-have, enhances experience                 | Mid-term  |
| **P3 (Enhancement)** | Future consideration, lower urgency               | Later     |

---

## P0: Critical Improvements

### 1. Contract Gates System

**Problem:** Our system uses gate scoring thresholds but lacks explicit user confirmation points. Users report unclear boundaries between planning and execution. The current flow moves from planning to implementation without a clear "handshake" moment where scope is formally agreed upon.

**Goodspec Pattern:**
- SPECIFY GATE: User types "confirm" to lock spec
- ACCEPT GATE: User types "accept" to approve completion
- Clear state transitions visible to user
- Prevents scope creep by making boundaries explicit

**Recommendation:**
Add explicit confirmation checkpoints that create formal agreements between user and agent.

#### Gate Definitions

```markdown
## Contract Gates for System-Spec-Kit

### SPECIFY GATE (After /spec_kit:plan completion)

**Trigger:** Plan.md is complete and ready for review

**Display:**
┌────────────────────────────────────────────────────────────────┐
│ 📋 SPECIFICATION READY                                         │
│                                                                │
│ Scope: [brief summary from spec.md]                            │
│ Tasks: [count] items across [wave count] waves                 │
│ Level: [1/2/3/3+]                                              │
│                                                                │
│ Type 'confirm' to lock scope and begin implementation          │
│ Type 'revise' to continue editing the plan                     │
│ Type 'questions' to discuss before confirming                  │
└────────────────────────────────────────────────────────────────┘

**Behavior on 'confirm':**
1. Record confirmation timestamp in spec.md frontmatter:
   ```yaml
   confirmed_at: 2026-02-04T14:30:00Z
   confirmed_scope_hash: abc123  # SHA of scope section
   ```
2. Set spec state to LOCKED
3. Create scope snapshot for drift detection
4. Enable amendment tracking (any changes now require /spec_kit:amend)
5. Proceed to implementation phase

**Behavior on 'revise':**
1. Return to planning mode
2. User can modify spec.md/plan.md/tasks.md
3. Re-present SPECIFY GATE when ready

### ACCEPT GATE (After /spec_kit:complete verification)

**Trigger:** All P0/P1 tasks complete, verification passed

**Display:**
┌────────────────────────────────────────────────────────────────┐
│ ✅ WORK COMPLETE                                               │
│                                                                │
│ Completed: [X]/[Y] tasks                                       │
│ Deferred: [Z] P2 items (documented)                            │
│ Verification: PASSED                                           │
│                                                                │
│ Deliverables:                                                  │
│   • [file1.js] - [description]                                 │
│   • [file2.js] - [description]                                 │
│                                                                │
│ Type 'accept' to approve delivery and close spec               │
│ Type 'issues' to report problems before accepting              │
│ Type 'extend' to add follow-up work                            │
└────────────────────────────────────────────────────────────────┘

**Behavior on 'accept':**
1. Mark spec folder state as COMPLETED
2. Generate implementation-summary.md (if not exists)
3. Archive to memory with importance: high
4. Record acceptance timestamp
5. Trigger memory distillation (if @distiller enabled)
6. Display completion summary with links to artifacts

**Behavior on 'issues':**
1. Collect issue description
2. Classify: bug vs missed requirement vs new scope
3. If bug: fix within current spec
4. If missed: add to tasks, continue implementation
5. If new scope: suggest amendment or new spec folder

**Behavior on 'extend':**
1. Suggest creating sub-folder (e.g., 001-followup/)
2. Or suggest /spec_kit:amend for minor additions
```

#### State Machine

```
┌─────────┐    plan     ┌──────────┐   confirm   ┌────────┐
│ CREATED │───complete──▶│ PLANNED  │────────────▶│ LOCKED │
└─────────┘             └──────────┘             └────────┘
                              │                       │
                           revise                 implement
                              │                       │
                              ▼                       ▼
                        ┌──────────┐            ┌──────────────┐
                        │ PLANNING │            │ IMPLEMENTING │
                        └──────────┘            └──────────────┘
                                                      │
                                                   verify
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │ VERIFYING │
                                                └───────────┘
                                                      │
                                                   accept
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │ COMPLETED │
                                                └───────────┘
```

#### Integration with Existing Gates

Contract Gates complement (don't replace) existing Gate 1-3:
- **Gate 1** (Spec Folder Question): Entry point, determines documentation level
- **Gate 2** (Understanding + Context): Ensures agent comprehends task
- **Gate 3** (Skill Routing): Routes to appropriate skill
- **SPECIFY GATE**: Locks scope after planning (NEW)
- **ACCEPT GATE**: Confirms completion (NEW)

**Implementation Location:**
- `.opencode/command/spec_kit/plan.md` - Add Step 7: SPECIFY GATE presentation
- `.opencode/command/spec_kit/complete.md` - Add Step 9: ACCEPT GATE presentation
- `.opencode/skill/system-spec-kit/SKILL.md` - Document gate system in workflow section
- `.opencode/skill/system-spec-kit/references/workflow/contract-gates.md` - Full reference
- `AGENTS.md` - Add to Gate section (after Gate 3)

**Effort:** Low-Medium (2-3 days)
**Impact:** High (clear boundaries, user control, reduced scope creep)

---

### 2. Status Dashboard Command

**Problem:** No quick way to see current state, progress, or next steps. Users must read spec folder files manually. Context recovery after breaks requires parsing multiple files. No unified view of where work stands.

**Goodspec Pattern:**
- `/goop-status` shows dashboard with current phase, tasks, memory activity
- Single command gives complete orientation
- Includes actionable next-step suggestions

**Recommendation:**
Add `/spec_kit:status` command providing a unified view of current work state.

#### Command Definition

```markdown
## /spec_kit:status Command

### Purpose
Provide instant orientation on current spec folder state, progress, and recommended next actions.

### Usage
/spec_kit:status              # Full dashboard for active spec
/spec_kit:status tasks        # Task-focused view
/spec_kit:status memory       # Memory activity view
/spec_kit:status timeline     # Session history view
/spec_kit:status [spec-path]  # Dashboard for specific spec folder
```

#### Output Formats

**Full Dashboard (default):**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 SPEC-KIT STATUS                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Active Spec: specs/003-memory-and-spec-kit/086-speckit-memory-refinement    │
│ State: IMPLEMENTING (confirmed 2h ago)                                      │
│ Level: 3+ (Complex/Multi-agent)                                             │
│ Contract: LOCKED at 2026-02-04 12:30                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ TASKS                                                                       │
│ ══════════════════════════════════════════════════════════════════          │
│ Progress: ████████████░░░░░░░░ 12/20 (60%)                                  │
│                                                                             │
│   Wave 1 (Foundation):  ████████████████████ 5/5 ✅                         │
│   Wave 2 (Core):        ████████████░░░░░░░░ 6/10 🔄                        │
│   Wave 3 (Integration): ░░░░░░░░░░░░░░░░░░░░ 0/3 ⏸️                         │
│   Wave 4 (Polish):      ░░░░░░░░░░░░░░░░░░░░ 0/2 ⏸️                         │
│                                                                             │
│   P0: ✅ 8/8 Complete                                                       │
│   P1: 🔄 4/9 In Progress                                                    │
│   P2: ⏸️ 0/3 Deferred                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ MEMORY                                                                      │
│ ══════════════════════════════════════════════════════════════════          │
│ Last Save: 45 minutes ago                                                   │
│ Memories This Session: 3                                                    │
│ Related Memories Found: 7                                                   │
│ ⚠️  Suggestion: Save context before break (45m since last save)             │
├─────────────────────────────────────────────────────────────────────────────┤
│ SESSION                                                                     │
│ ══════════════════════════════════════════════════════════════════          │
│ Duration: 1h 23m                                                            │
│ Files Modified: 8                                                           │
│ Amendments: 1 (approved)                                                    │
│ Deviations: 2 (R1: bug fix, R3: import)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ NEXT ACTIONS                                                                │
│ ══════════════════════════════════════════════════════════════════          │
│ 1. Continue Wave 2 task: "Implement contract gates in plan.md"              │
│ 2. Review: 2 P1 tasks ready for verification                                │
│ 3. Suggested: /memory:save (45m since last save)                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Task View (`/spec_kit:status tasks`):**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📋 TASKS: 086-speckit-memory-refinement                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ WAVE 1: Foundation ✅ COMPLETE                                              │
│ ─────────────────────────────────────────────────────────────────────────── │
│ [x] P0 Create analysis-report.md structure                                  │
│ [x] P0 Research goodspec agent architecture                                 │
│ [x] P0 Research goodspec memory system                                      │
│ [x] P1 Compare command structures                                           │
│ [x] P1 Document template differences                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ WAVE 2: Core 🔄 IN PROGRESS                                                 │
│ ─────────────────────────────────────────────────────────────────────────── │
│ [x] P0 Write executive summary                                              │
│ [x] P0 Complete philosophy comparison                                       │
│ [x] P1 Architecture comparison section                                      │
│ [ ] P1 Command comparison section ← CURRENT                                 │
│ [ ] P1 Template comparison section                                          │
│ [ ] P1 Quality gates comparison                                             │
│ [ ] P1 UX comparison section                                                │
│ [ ] P2 Metrics table                                                        │
│ [ ] P2 Add diagrams                                                         │
│ [ ] P2 Cross-reference citations                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ WAVE 3: Integration ⏸️ BLOCKED (requires Wave 2)                            │
│ ─────────────────────────────────────────────────────────────────────────── │
│ [ ] P1 Create recommendations-report.md                                     │
│ [ ] P1 Prioritize recommendations                                           │
│ [ ] P1 Create implementation roadmap                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ WAVE 4: Polish ⏸️ BLOCKED (requires Wave 3)                                 │
│ ─────────────────────────────────────────────────────────────────────────── │
│ [ ] P2 Final review and formatting                                          │
│ [ ] P2 Save context to memory                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Memory View (`/spec_kit:status memory`):**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🧠 MEMORY: 086-speckit-memory-refinement                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ SESSION MEMORIES (This Session)                                             │
│ ─────────────────────────────────────────────────────────────────────────── │
│ • 14:30 decision: "Use wave-based task organization"                        │
│ • 15:15 insight: "Goodspec's contract gates reduce scope creep"             │
│ • 15:45 note: "Memory distiller could automate /memory:learn"               │
├─────────────────────────────────────────────────────────────────────────────┤
│ RELATED MEMORIES (From Index)                                               │
│ ─────────────────────────────────────────────────────────────────────────── │
│ • 085-memory-consolidation (3 days ago) - 89% relevance                     │
│ • 082-spec-kit-templates (1 week ago) - 76% relevance                       │
│ • 079-command-refactor (2 weeks ago) - 71% relevance                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ MEMORY HEALTH                                                               │
│ ─────────────────────────────────────────────────────────────────────────── │
│ Last Index Update: 2 hours ago                                              │
│ Total Indexed: 254 memories                                                 │
│ Constitutional: 12 active                                                   │
│ Decay Queue: 3 memories approaching deprecation                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Timeline View (`/spec_kit:status timeline`):**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⏱️ TIMELINE: 086-speckit-memory-refinement                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ TODAY                                                                       │
│ ─────────────────────────────────────────────────────────────────────────── │
│ 16:15 ← NOW                                                                 │
│ 15:45   Memory saved: note about distiller                                  │
│ 15:30   Completed: Architecture comparison section                          │
│ 15:15   Memory saved: insight about contract gates                          │
│ 15:00   Amendment #1 approved: Add wave execution recommendation            │
│ 14:45   Deviation R1: Fixed typo in template reference                      │
│ 14:30   SPECIFY GATE: Scope confirmed                                       │
│ 14:00   Plan complete: 20 tasks across 4 waves                              │
│ 13:30   Spec folder created (Level 3+)                                      │
│ 13:00   Session started                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PREVIOUS SESSIONS                                                           │
│ ─────────────────────────────────────────────────────────────────────────── │
│ Feb 3   Research phase completed (085-memory-consolidation)                 │
│ Feb 1   Template updates merged (082-spec-kit-templates)                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Data Sources

The status command aggregates data from:

| Source | Data Extracted |
|--------|---------------|
| `spec.md` | Scope summary, level, state, confirmation timestamp |
| `tasks.md` | Task counts, wave progress, current task |
| `plan.md` | Phase, wave structure |
| `memory/*.md` | Recent saves, session memories |
| Memory index | Related memories, health stats |
| Git (optional) | Files modified, session duration estimate |
| `metadata.json` | Amendments, deviations, timestamps |

#### Implementation Architecture

```javascript
// .opencode/command/spec_kit/status.md workflow

Step 1: Detect active spec folder
  - Check AGENTS.md context for current spec
  - Or use provided path argument
  - Or list recent specs and ask user

Step 2: Load spec folder metadata
  - Parse spec.md frontmatter (state, level, timestamps)
  - Parse tasks.md (counts, waves, checkboxes)
  - Parse plan.md (phase, structure)

Step 3: Load memory context
  - Scan memory/ folder for session files
  - Query memory index for related memories
  - Calculate time since last save

Step 4: Calculate derived metrics
  - Progress percentages
  - Wave completion status
  - P-level breakdown
  - Health indicators

Step 5: Generate appropriate view
  - Default: full dashboard
  - tasks: task-focused view
  - memory: memory-focused view
  - timeline: chronological view

Step 6: Add actionable suggestions
  - Next task recommendation
  - Memory save reminder (if >30min)
  - Blocked wave notifications
  - Amendment suggestions
```

**Implementation Location:**
- Create `.opencode/command/spec_kit/status.md` - Command definition
- Create `.opencode/skill/system-spec-kit/scripts/status/` - Status generation scripts
  - `parse-spec-folder.js` - Extract spec folder metadata
  - `calculate-progress.js` - Compute progress metrics
  - `render-dashboard.js` - Format output displays
- Update `AGENTS.md` Quick Reference table with status command

**Effort:** Medium (3-4 days)
**Impact:** High (instant orientation, reduced context recovery time)

---

## P1: High Priority Improvements

### 3. Four-Rule Deviation System

**Problem:** Our HALT conditions stop work but lack guidance on when to auto-fix vs ask. This creates inconsistent behavior—sometimes the agent stops for trivial issues, other times it makes changes that should have been flagged. Users are unsure what to expect.

**Goodspec Pattern:**
| Rule | Condition                           | Action             |
| ---- | ----------------------------------- | ------------------ |
| 1    | Bug found during execution          | Auto-fix, document |
| 2    | Missing critical (auth, validation) | Auto-add, document |
| 3    | Blocking issue encountered          | Auto-fix, document |
| 4    | Architectural decision needed       | STOP, ask user     |

**Current State:**
Our HALT conditions are binary: continue or stop. No classification of deviation severity. No guidance on what can be auto-fixed vs what requires user input.

**Recommendation:**
Add a deviation classification system that provides clear autonomy boundaries during execution.

#### Rule Definitions

```markdown
## Deviation Rules (During Execution)

When encountering an issue not explicitly covered by the spec, classify it before acting:

### Rule 1: Auto-Fix Bugs (R1)
**Trigger:** Bug discovered in code within spec scope
**Action:** Fix immediately, document in tasks.md deviation log
**Examples:**
- Null/undefined check missing
- Typo in variable name
- Off-by-one error
- Missing return statement
- Incorrect operator

**Documentation format:**
```
### Deviation Log
- [R1] 14:30 - Fixed null check in parseConfig() - was causing runtime error
```

**Boundary:** Bug must be in files explicitly listed in spec scope. If bug is in adjacent file, escalate to R3.

### Rule 2: Auto-Add Critical (R2)
**Trigger:** Missing security or validation that's clearly necessary
**Action:** Add immediately, document in tasks.md deviation log
**Examples:**
- Input sanitization missing (XSS, SQL injection vectors)
- Authentication check missing on protected route
- Validation missing on user input
- Error boundary missing around async operation
- Rate limiting missing on public endpoint

**Documentation format:**
```
### Deviation Log
- [R2] 15:00 - Added input sanitization to userInput field - XSS vector
```

**Boundary:** Must be objectively critical (security, data integrity). Opinion-based "improvements" don't qualify.

### Rule 3: Auto-Fix Blocking (R3)
**Trigger:** Cannot proceed without fixing adjacent code
**Action:** Fix minimal necessary, document deviation in spec.md amendments
**Examples:**
- Import statement missing
- Type definition incomplete
- Dependency not exported
- Interface mismatch between modules
- Configuration missing required field

**Documentation format (in spec.md):**
```
## Deviations
### R3 - Blocking Fix
- **File:** utils/config.ts (out of scope)
- **Change:** Added missing export for ConfigType
- **Reason:** Cannot import in target file without this
- **Impact:** Minimal (1 line, additive only)
```

**Boundary:** Must be minimal (< 10 lines). Must be additive (no refactoring). If larger change needed, escalate to R4.

### Rule 4: STOP for Architectural (R4)
**Trigger:** Any of these conditions:
- Scope expansion beyond spec boundary
- New pattern or approach not in spec
- New dependency introduction
- Structural change to existing code
- Decision with multiple valid approaches
- Change affecting > 3 files not in scope

**Action:** HALT immediately, present options to user
**Format:**
```
⚠️ ARCHITECTURAL DECISION REQUIRED (R4)

I've encountered a situation requiring your input:

**Context:** [What I was doing when this arose]

**Issue:** [What the decision point is]

**Options:**
A) [Option with trade-offs]
B) [Option with trade-offs]
C) [Continue without addressing - document as known limitation]

**My recommendation:** [If I have one, with reasoning]

Which approach should I take?
```

**Examples requiring R4:**
- "Should we use Redis or in-memory caching?"
- "This would work better with a different data structure"
- "I need to refactor the base class to support this"
- "This requires adding a new npm package"

### Classification Prompt (Agent Self-Check)

Before any deviation from spec, ask:
1. Is this a bug in scope code? → R1
2. Is this a critical security/validation gap? → R2
3. Is this blocking progress with minimal fix? → R3
4. Is this architectural or scope expansion? → R4

If uncertain between R3 and R4, choose R4 (ask user).
```

#### Integration with Existing HALT Conditions

Current HALT conditions remain. Deviation rules add classification BEFORE halting:

```
Issue Detected
     │
     ▼
Classify: R1/R2/R3/R4?
     │
     ├─── R1 (Bug) ──────────▶ Auto-fix, document, continue
     │
     ├─── R2 (Critical) ─────▶ Auto-add, document, continue
     │
     ├─── R3 (Blocking) ─────▶ Fix minimal, document in amendments, continue
     │
     └─── R4 (Architectural) ─▶ HALT, present options, wait for user
                                     │
                                     ▼
                              Existing HALT behavior
```

#### Deviation Tracking

Add deviation section to spec folder:

```markdown
<!-- In tasks.md -->

## Deviation Log

| Time  | Rule | Description | Impact |
|-------|------|-------------|--------|
| 14:30 | R1   | Fixed null check in parseConfig() | None |
| 15:00 | R2   | Added XSS sanitization to input | None |
| 15:30 | R3   | Added export to utils/config.ts | 1 line, out of scope |
| 16:00 | R4   | Asked: caching approach | User chose: in-memory |
```

**Implementation Location:**
- Update `AGENTS.md` Section 1 - Add deviation rules after HALT conditions
- Create `.opencode/skill/system-spec-kit/references/workflow/deviation-rules.md` - Full reference
- Update tasks.md template - Add deviation log section
- Update spec.md template - Add deviations section for R3 documentation

**Effort:** Low (1-2 days)
**Impact:** High (consistent autonomy, predictable behavior)

---

### 4. Wave-Based Task Execution

**Problem:** Our tasks.md is a flat list. No organization by phase or dependency wave. This causes:
- Unclear execution order
- Difficulty parallelizing independent tasks
- No visibility into phase completion
- Harder to resume after breaks

**Goodspec Pattern:**
Organizes tasks into sequential waves where:
- Tasks within a wave can run in parallel
- Waves execute sequentially
- Each wave has clear entry/exit criteria

**Recommendation:**
Update tasks.md to support wave-based organization with clear dependencies and execution guidance.

#### Wave Structure

```markdown
## tasks.md Wave Structure

<!-- SPECKIT_EXECUTION: wave -->
<!-- SPECKIT_PARALLEL: within-wave -->

## Overview
Total Tasks: 20
Waves: 4
Current Wave: 2 (Core)
Progress: 12/20 (60%)

---

## Wave 1: Foundation
**Status:** ✅ COMPLETE
**Dependencies:** None
**Execution:** Parallel within wave
**Entry Criteria:** Spec confirmed (SPECIFY GATE passed)
**Exit Criteria:** All P0 tasks complete, base structure exists

### Tasks
- [x] P0 Set up project structure
- [x] P0 Create base configuration
- [x] P0 Initialize type definitions
- [x] P1 Set up development environment
- [x] P1 Configure linting rules

**Completed:** 2026-02-04 14:45

---

## Wave 2: Core
**Status:** 🔄 IN PROGRESS
**Dependencies:** Wave 1 complete
**Execution:** Sequential by P-level, parallel within P-level
**Entry Criteria:** Foundation complete, types defined
**Exit Criteria:** Core functionality working, can demonstrate value

### Tasks
- [x] P0 Implement main handler
- [x] P0 Add error handling
- [ ] P0 Connect to data layer ← CURRENT
- [ ] P1 Add validation logic
- [ ] P1 Implement business rules
- [ ] P1 Add logging
- [ ] P2 Performance optimization
- [ ] P2 Add metrics collection

**Blocked Tasks:**
- None currently

**Notes:**
- Data layer connection requires R3 fix to config export

---

## Wave 3: Integration
**Status:** ⏸️ BLOCKED
**Dependencies:** Wave 2 complete
**Execution:** Parallel within wave
**Entry Criteria:** Core functionality complete
**Exit Criteria:** All components connected, end-to-end flow works

### Tasks
- [ ] P1 Connect frontend to API
- [ ] P1 Wire up authentication
- [ ] P1 Integrate error boundaries
- [ ] P2 Add loading states

**Blocked By:** Wave 2 incomplete

---

## Wave 4: Polish
**Status:** ⏸️ BLOCKED
**Dependencies:** Wave 3 complete
**Execution:** Parallel within wave
**Entry Criteria:** Integration complete, system functional
**Exit Criteria:** Production-ready, all P0/P1 complete

### Tasks
- [ ] P1 Add comprehensive tests
- [ ] P1 Documentation
- [ ] P2 Performance tuning
- [ ] P2 Accessibility audit

**Blocked By:** Wave 3 incomplete

---

## Deviation Log
[Deviations tracked per Rule 4 system]

---

## Deferred (Post-MVP)
- [ ] P3 Advanced caching
- [ ] P3 Analytics integration
```

#### Wave Execution Logic

```
Wave Entry Check
     │
     ▼
Dependencies met? ─── No ──▶ Status: BLOCKED
     │
    Yes
     │
     ▼
Get P0 tasks in wave
     │
     ▼
Any P0 incomplete? ─── Yes ──▶ Execute P0 (parallel if independent)
     │                              │
    No                              └──▶ Loop until P0 complete
     │
     ▼
Get P1 tasks in wave
     │
     ▼
Any P1 incomplete? ─── Yes ──▶ Execute P1 (parallel if independent)
     │                              │
    No                              └──▶ Loop until P1 complete
     │
     ▼
Wave exit criteria met? ─── No ──▶ Address blockers
     │
    Yes
     │
     ▼
Status: COMPLETE
     │
     ▼
Unlock next wave
```

#### Typical Wave Categories

| Wave | Name | Purpose | Typical Tasks |
|------|------|---------|---------------|
| 1 | Foundation | Setup, structure | Config, types, scaffolding |
| 2 | Core | Main functionality | Handlers, logic, data |
| 3 | Integration | Connect components | APIs, auth, errors |
| 4 | Polish | Production readiness | Tests, docs, perf |

#### Benefits

1. **Parallel Execution:** Tasks within a wave can be dispatched to multiple agents
2. **Clear Progress:** Easy to see which phase you're in
3. **Resume Friendly:** After break, start at current wave
4. **Scope Control:** Waves provide natural checkpoints
5. **Resource Planning:** Know what's needed for each phase

**Implementation Location:**
- Update `.opencode/skill/system-spec-kit/templates/tasks.md` - New wave-based template
- Create `.opencode/skill/system-spec-kit/references/workflow/wave-execution.md` - Wave reference
- Update validation scripts to detect wave structure
- Update `/spec_kit:status` to show wave progress

**Effort:** Medium (2-3 days)
**Impact:** Medium-High (better organization, parallelization, clarity)

---

### 5. Amend Command for Scope Changes

**Problem:** No formal process for changing scope after spec is locked. Users edit spec.md directly, losing amendment history. This causes:
- No audit trail of what changed
- No impact analysis before changes
- Difficulty understanding why scope evolved
- Potential scope creep without visibility

**Goodspec Pattern:**
- `/goop-amend` formally proposes scope change
- Impact analysis runs automatically
- Amendment history preserved
- Re-confirmation required if significant

**Recommendation:**
Add `/spec_kit:amend` command for formal scope change management.

#### Command Definition

```markdown
## /spec_kit:amend Command

### Purpose
Formally propose and track scope changes after SPECIFY GATE confirmation.

### Prerequisites
- Spec must be in LOCKED or IMPLEMENTING state
- SPECIFY GATE must have been passed

### Usage
/spec_kit:amend "Add rate limiting to API endpoints"
/spec_kit:amend --revert 1  # Revert amendment #1
/spec_kit:amend --history   # Show amendment history
```

#### Workflow

```
/spec_kit:amend "[description]"
           │
           ▼
    Validate spec state
    (must be LOCKED or IMPLEMENTING)
           │
           ▼
    Parse amendment request
           │
           ▼
    Analyze impact ──────────────────────────────┐
    • New tasks required                         │
    • Files affected                             │
    • Effort estimate (S/M/L)                    │
    • Risk assessment (Low/Medium/High)          │
    • Dependencies affected                      │
           │                                     │
           ▼                                     │
    Calculate scope change percentage            │
           │                                     │
           ├─── < 10% ──▶ Minor amendment        │
           │              (approve inline)        │
           │                                     │
           ├─── 10-30% ─▶ Moderate amendment     │
           │              (require confirm)       │
           │                                     │
           └─── > 30% ──▶ Significant change     │
                         (suggest new spec)      │
                                                 │
                         ◀───────────────────────┘
           │
           ▼
    Present amendment summary
           │
           ▼
    User: confirm/reject/revise
           │
           ├─── confirm ──▶ Apply amendment
           │                • Update spec.md
           │                • Add tasks to tasks.md
           │                • Record in amendment history
           │                • Update scope hash
           │
           ├─── reject ───▶ Discard, continue as-is
           │
           └─── revise ───▶ Modify description, re-analyze
```

#### Amendment Record Format

```markdown
<!-- In spec.md -->

## Amendments

### Amendment #1 - 2026-02-04 15:00
**Request:** Add rate limiting to API endpoints
**Impact Analysis:**
- New Tasks: +3
- Files Affected: 4 (api/handlers/*.ts, middleware/rateLimit.ts)
- Effort: Medium
- Risk: Low (additive, non-breaking)
- Scope Change: 8% (minor)

**Tasks Added:**
- [ ] P1 Create rate limiting middleware
- [ ] P1 Apply to public endpoints
- [ ] P2 Add rate limit configuration

**Confirmed By:** User at 15:02
**Applied To:** tasks.md Wave 2

---

### Amendment #2 - 2026-02-04 16:30
**Request:** Change authentication from sessions to JWT
**Impact Analysis:**
- New Tasks: +8
- Files Affected: 12
- Effort: Large
- Risk: High (breaking change to existing auth)
- Scope Change: 35% (significant)

**Recommendation:** This is a significant scope change. Consider:
A) Create new spec folder: `087-jwt-migration`
B) Proceed with amendment (extends timeline significantly)
C) Defer to future work

**User Decision:** A - Created 087-jwt-migration
**Status:** REDIRECTED (not applied to this spec)
```

#### Impact Analysis Details

The impact analysis examines:

| Factor | Method | Output |
|--------|--------|--------|
| Tasks | Parse request, estimate work items | Count, P-levels |
| Files | Search codebase for affected areas | List, in/out scope |
| Effort | Heuristic based on task count + complexity | S/M/L |
| Risk | Breaking changes, dependencies, complexity | Low/Med/High |
| Scope % | (new tasks / original tasks) * 100 | Percentage |

#### Integration with Contract Gates

Amendment resets confirmation status if significant:

```
Amendment < 10%: Scope hash updated, no re-confirmation
Amendment 10-30%: Scope hash updated, SPECIFY GATE re-presented
Amendment > 30%: Recommend new spec folder
```

**Implementation Location:**
- Create `.opencode/command/spec_kit/amend.md` - Command definition
- Update spec.md template - Add amendments section
- Create `.opencode/skill/system-spec-kit/scripts/amend/` - Amendment processing
  - `analyze-impact.js` - Impact analysis logic
  - `apply-amendment.js` - Apply changes to spec folder
- Update `AGENTS.md` - Add amend to command quick reference

**Effort:** Medium (3-4 days)
**Impact:** Medium-High (scope management, audit trail, change control)

---

## P2: Medium Priority Improvements

### 6. Inline Memory Save Prefixes

**Problem:** Memory saves require explicit commands (`/memory:save`). No inline shortcuts during conversation. This creates friction—good insights get lost because saving requires context switching.

**Goodspec Pattern:**
- `decision: Use JWT for auth` → Auto-saves as decision type
- `note: Consider caching later` → Auto-saves as note
- `todo: Add tests for edge case` → Auto-saves as todo

**Recommendation:**
Detect inline save patterns in user messages and auto-save to memory without interrupting flow.

#### Prefix Definitions

```markdown
## Inline Save Prefixes

### Supported Prefixes

| Prefix | Memory Type | Importance | Example |
|--------|-------------|------------|---------|
| `decision:` | decision | high | "decision: Use WebSockets for real-time" |
| `note:` | observation | medium | "note: Consider caching later" |
| `todo:` | task | high | "todo: Add tests for edge cases" |
| `remember:` | note | medium | "remember: User prefers verbose logging" |
| `insight:` | learning | high | "insight: Contract gates reduce scope creep" |
| `caveat:` | constraint | high | "caveat: Must support IE11" |
| `blocker:` | blocker | critical | "blocker: Waiting on API access" |

### Detection Rules

1. Prefix must be at start of message or on its own line
2. Colon is required after prefix word
3. Content follows immediately after colon
4. Case-insensitive matching

### Examples

**User message:**
"decision: We'll use in-memory caching for this phase. Redis can be added later."

**System behavior:**
1. Detect `decision:` prefix
2. Extract: "We'll use in-memory caching for this phase. Redis can be added later."
3. Save to current spec folder memory:
   ```json
   {
     "type": "decision",
     "content": "We'll use in-memory caching for this phase. Redis can be added later.",
     "importance": "high",
     "timestamp": "2026-02-04T15:30:00Z",
     "specFolder": "086-speckit-memory-refinement",
     "savedVia": "inline-prefix"
   }
   ```
4. Display confirmation: `💾 Saved decision`
5. Continue responding to rest of message normally

### Multi-Prefix Messages

User can include multiple prefixes in one message:

"I've been thinking about this more.

decision: Use PostgreSQL for primary storage
note: Consider read replicas if we scale
todo: Research connection pooling options

Let's proceed with the implementation."

**Result:** 3 separate memory entries created, confirmation shown once:
`💾 Saved: 1 decision, 1 note, 1 todo`
```

#### Implementation Architecture

```javascript
// Detection flow in message processing

function processUserMessage(message) {
  const prefixes = detectInlinePrefixes(message);

  if (prefixes.length > 0) {
    const activeSpec = getCurrentSpecFolder();

    for (const prefix of prefixes) {
      await saveToMemory({
        type: prefix.type,
        content: prefix.content,
        importance: prefix.importance,
        specFolder: activeSpec,
        savedVia: 'inline-prefix'
      });
    }

    // Show subtle confirmation
    displaySaveConfirmation(prefixes);
  }

  // Continue normal message processing
  return processRemainingContent(message);
}

function detectInlinePrefixes(message) {
  const patterns = [
    { regex: /^decision:\s*(.+)$/gim, type: 'decision', importance: 'high' },
    { regex: /^note:\s*(.+)$/gim, type: 'observation', importance: 'medium' },
    { regex: /^todo:\s*(.+)$/gim, type: 'task', importance: 'high' },
    { regex: /^remember:\s*(.+)$/gim, type: 'note', importance: 'medium' },
    { regex: /^insight:\s*(.+)$/gim, type: 'learning', importance: 'high' },
    { regex: /^caveat:\s*(.+)$/gim, type: 'constraint', importance: 'high' },
    { regex: /^blocker:\s*(.+)$/gim, type: 'blocker', importance: 'critical' }
  ];

  const found = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.regex.exec(message)) !== null) {
      found.push({
        type: pattern.type,
        content: match[1].trim(),
        importance: pattern.importance
      });
    }
  }

  return found;
}
```

#### Confirmation Display

Subtle, non-intrusive confirmation:

```
💾 Saved decision                          # Single item
💾 Saved: 2 decisions, 1 note              # Multiple items
💾 Saved insight → linked to 3 memories    # With auto-linking
```

#### Auto-Linking

When saving, check for related memories and create causal links:

```
insight: "Contract gates reduce scope creep"
     │
     ▼
Search memory for related entries
     │
     ▼
Found: "decision: Implement contract gates" (85% relevance)
     │
     ▼
Create causal link: insight ──supports──▶ decision
     │
     ▼
Display: "💾 Saved insight → linked to 1 decision"
```

#### Edge Cases

| Scenario | Behavior |
|----------|----------|
| No active spec folder | Save to general memory, warn user |
| Prefix in code block | Ignore (don't save) |
| Prefix in quote | Ignore (don't save) |
| Empty content after prefix | Ignore, no save |
| Very long content (>500 chars) | Save but truncate display confirmation |

**Implementation Location:**
- Add detection to `AGENTS.md` message processing guidance
- Create `.opencode/skill/system-spec-kit/references/memory/inline-prefixes.md` - Reference doc
- Update memory save handler to support inline source
- Add to `/memory:context` retrieval (surface inline saves)

**Effort:** Medium (2-3 days)
**Impact:** Medium (reduced friction, better capture rate)

---

### 7. Memory Distiller Agent

**Problem:** Knowledge extraction requires manual `/memory:learn`. No automatic distillation of patterns. Valuable learnings get lost when users forget to explicitly save them.

**Goodspec Pattern:**
- `memory-distiller` agent runs post-session
- Extracts atomic facts from conversation
- Identifies recurring patterns
- Suggests concept tags
- Creates summary entries

**Recommendation:**
Add `@distiller` agent for automatic knowledge extraction from completed work.

#### Agent Definition

```markdown
## @distiller Agent

### Purpose
Automatically extract and preserve valuable knowledge from completed spec folders.

### Characteristics
- **Trigger:** Post-completion (after ACCEPT GATE)
- **Mode:** Background processing
- **Output:** Memory entries with high importance
- **Focus:** Patterns, decisions, pitfalls, conventions

### Invocation

**Automatic (recommended):**
Triggered after `/spec_kit:complete` when user types 'accept'

**Manual:**
```
/memory:distill                    # Distill current spec folder
/memory:distill [spec-path]        # Distill specific folder
/memory:distill --all-recent       # Distill last 5 completed specs
```

### Extraction Workflow

```
Spec Folder Completed
         │
         ▼
Load conversation history
Load spec folder artifacts
         │
         ▼
Extract Phase 1: Facts
• Identify concrete decisions made
• Extract specific choices (tech, patterns, approaches)
• Note explicit trade-offs discussed
         │
         ▼
Extract Phase 2: Patterns
• Compare to previous spec folders
• Identify repeated solutions
• Note deviations from past approaches
         │
         ▼
Extract Phase 3: Pitfalls
• Find error → resolution sequences
• Extract debugging insights
• Note "if I had known X" moments
         │
         ▼
Extract Phase 4: Conventions
• Identify project-specific standards
• Note naming patterns
• Extract style preferences
         │
         ▼
Generate Distillation Entry
         │
         ▼
Index to Memory System
         │
         ▼
Link to Related Memories
```

### Output Format

```markdown
<!-- Memory entry created by @distiller -->

# Distillation: 086-speckit-memory-refinement

**Source:** specs/003-memory-and-spec-kit/086-speckit-memory-refinement
**Completed:** 2026-02-04
**Distilled:** 2026-02-04 17:00

## Key Decisions
1. **Contract gates over threshold scoring**
   - Why: Explicit user confirmation reduces ambiguity
   - Trade-off: Slightly more user interaction required
   - Confidence: High (based on Goodspec success patterns)

2. **Wave-based task organization**
   - Why: Enables parallel execution, clearer progress
   - Trade-off: More upfront planning required
   - Confidence: High (proven in multiple frameworks)

## Patterns Identified
1. **Research-first approach for framework comparisons**
   - 30 parallel agents analyzed both systems
   - Consolidated findings before recommendations
   - Applicable to: Future framework evaluations

2. **Prioritized recommendations structure**
   - P0/P1/P2/P3 with clear criteria
   - Effort/Impact estimates for each
   - Applicable to: Technical recommendation documents

## Pitfalls Avoided
1. **Not losing existing technical advantages**
   - Initially tempted to adopt Goodspec wholesale
   - Identified our unique strengths (FSRS, causal graph)
   - Learning: Evaluate before adopting, don't discard working features

## Conventions Established
1. **Amendment tracking in spec.md**
   - Separate section for scope changes
   - Impact analysis required before approval

## Concept Tags
#spec-kit #memory-system #framework-comparison #contract-gates #wave-execution

## Related Memories
- 085-memory-consolidation (prerequisites)
- 082-spec-kit-templates (related templates)
```

### Distillation Triggers

| Trigger | Condition | Behavior |
|---------|-----------|----------|
| Auto | ACCEPT GATE passed | Run distillation in background |
| Manual | `/memory:distill` command | Run immediately |
| Scheduled | Every 5 completed specs | Batch distillation |
| Recovery | Spec marked complete without distillation | Catch-up run |

### Quality Metrics

Distillation quality is measured by:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Facts extracted | 3-10 per spec | Count of concrete decisions |
| Patterns identified | 1-3 per spec | Recurring solutions |
| Future retrievals | Used in 2+ future specs | Memory hit rate |
| Accuracy | 90%+ | User correction rate |

### Integration Points

1. **With `/spec_kit:complete`:** Auto-trigger after acceptance
2. **With memory index:** Distillations get high importance tier
3. **With `/memory:context`:** Distillations surface for similar work
4. **With `/spec_kit:research`:** Past distillations inform new research
```

#### Agent Implementation

```markdown
# .opencode/agent/distiller.md

## Identity
Name: Memory Distiller
Role: Knowledge extraction specialist
Model: haiku (cost-efficient for extraction)

## Capabilities
- Read spec folder artifacts
- Analyze conversation patterns
- Extract atomic facts
- Identify recurring themes
- Create structured memory entries

## Constraints
- Read-only access to spec folders
- Cannot modify original artifacts
- Must cite sources for all extractions
- Maximum 10 facts per distillation

## Workflow
1. Receive spec folder path
2. Load all artifacts (spec.md, tasks.md, plan.md, memory/*)
3. Load conversation history for spec
4. Run extraction pipeline (facts → patterns → pitfalls → conventions)
5. Generate distillation entry
6. Save to memory with high importance
7. Create causal links to related memories
8. Report completion with summary

## Output Schema
{
  "type": "distillation",
  "source": "spec-folder-path",
  "completedAt": "ISO timestamp",
  "decisions": [...],
  "patterns": [...],
  "pitfalls": [...],
  "conventions": [...],
  "tags": [...],
  "relatedMemories": [...]
}
```

**Implementation Location:**
- Create `.opencode/agent/distiller.md` - Agent definition
- Create `/memory:distill` command (or add as subcommand to `/memory:manage`)
- Add auto-trigger to `/spec_kit:complete` workflow
- Update memory index to handle distillation type

**Effort:** High (4-5 days)
**Impact:** Medium-High (long-term knowledge capture, reduced manual /memory:learn)

---

### 8. AGENTS.md Alignment Review

**Problem:** Our AGENTS.md (project root) provides guidelines for AI agents but may not incorporate best practices discovered in the Goodspec analysis. The Goodspec AGENTS.md demonstrates a clean, focused structure with memory-first principles, UI patterns (Clack), and clear coding conventions.

**Goodspec Pattern (from `context/goodspec-repo/AGENTS.md`):**
- **Memory-First Principle:** "Always check memory/state before action. Persist learnings after."
- **Interactive UI:** Use Clack helpers for all user interaction, never raw console.log
- **Graceful Degradation:** Never crash the plugin, return fallback results
- **Co-located Tests:** Test files next to implementation
- **ESM Imports:** Always use .js extension for local imports
- **Explicit Types:** Avoid `any`, define interfaces in core/types.ts
- **Minimal Comments:** Only document non-obvious logic
- **Atomic Commits:** Keep changes focused and small

**Current State (our AGENTS.md):**
Our AGENTS.md focuses on behavioral framework, gates, and workflows but lacks some of the concrete coding patterns from Goodspec. It includes:
- Critical Rules (Four Laws)
- Mandatory Gates
- Conversation Documentation
- Confidence Framework
- Request Analysis
- Agent Routing
- Tool System
- Skills System

**Review Checklist:**

| Goodspec Pattern | Our AGENTS.md | Action |
|-----------------|---------------|--------|
| Memory-First principle | Partially covered (Memory MCP) | Consider explicit rule |
| Interactive UI (Clack) | Not mentioned | Evaluate relevance |
| Graceful degradation | HALT conditions exist | Compare approaches |
| Co-located tests | Not covered | Document if applicable |
| Import patterns | Not covered | Document if applicable |
| Type discipline | Not covered | Document if applicable |
| Coding lenses | Yes (Section 5) | Keep/enhance |
| Anti-patterns | Yes (Section 2) | Keep/enhance |

**Recommendation:**
Review AGENTS.md and consider adding:

1. **Memory-First Rule (if not explicit):**
   ```markdown
   **MEMORY-FIRST PRINCIPLE:**
   Always check memory/state before action. When completing a task:
   - Search existing memories for related context
   - Persist learnings and decisions after action
   - Link new memories to related existing entries
   ```

2. **Graceful Degradation Expansion:**
   Expand HALT conditions to include graceful degradation guidance for recoverable errors.

3. **Coding Anti-Patterns Update:**
   Review if Goodspec's "Key Rules" section has patterns worth adding:
   - Raw console.log vs structured logging
   - Test file co-location
   - Explicit type discipline

**Decision Required:**
- [ ] Add Memory-First as explicit rule
- [ ] Expand graceful degradation guidance
- [ ] Add coding convention section (if applicable to our use case)
- [ ] Skip UI patterns (not applicable to our Webflow context)

**Effort:** Low (1-2 hours review + edits)
**Impact:** Low-Medium (consistency, clarity)

---

## P3: Future Enhancements

### 9. Quick Keywords

**Gap:** No natural language triggers like "spec it" or "finish it".

**Goodspec Pattern:**
- "spec it" → Starts /goop-plan
- "finish it" → Runs completion workflow
- "save this" → Quick memory save

**Current Assessment:**
Our command system (`/spec_kit:*`, `/memory:*`) is explicit and clear. Quick keywords add convenience but may cause accidental triggers. Lower priority given our explicit command approach works well.

**Recommendation:** Defer. Monitor user feedback. If frequently requested, implement as opt-in feature.

**Potential Implementation (if needed later):**
```markdown
## Quick Keywords (Opt-In)

Enable in .speckit.json:
{
  "quickKeywords": true
}

Supported keywords:
- "spec it" / "plan this" → /spec_kit:plan
- "finish it" / "wrap up" → /spec_kit:complete
- "save this" / "remember this" → /memory:save
- "what's next" / "status" → /spec_kit:status
```

---

## Implementation Roadmap

### Phase 1: Foundations (Week 1-2)
- [ ] **P0.1: Contract Gates System**
  - Update plan.md command with SPECIFY GATE
  - Update complete.md command with ACCEPT GATE
  - Add state machine to spec folder metadata
  - Document in SKILL.md

- [ ] **P1.3: Four-Rule Deviation System**
  - Add deviation rules to AGENTS.md
  - Create deviation-rules.md reference
  - Update tasks.md template with deviation log
  - Update spec.md template with deviations section

### Phase 2: Visibility (Week 3-4)
- [ ] **P0.2: Status Dashboard Command**
  - Create status.md command definition
  - Implement spec folder parsing scripts
  - Build dashboard rendering logic
  - Add subcommand views (tasks, memory, timeline)

- [ ] **P1.4: Wave-Based Task Execution**
  - Update tasks.md template with wave structure
  - Add wave detection to validation
  - Update status command for wave display
  - Create wave-execution.md reference

### Phase 3: Change Management (Week 5-6)
- [ ] **P1.5: Amend Command**
  - Create amend.md command definition
  - Implement impact analysis logic
  - Update spec.md template with amendments section
  - Add scope hash tracking

- [ ] **P2.6: Inline Memory Save Prefixes**
  - Add prefix detection to message processing
  - Create inline-prefixes.md reference
  - Implement auto-save handler
  - Add confirmation display

### Phase 4: Knowledge Extraction (Week 7-8)
- [ ] **P2.7: Memory Distiller Agent**
  - Create distiller.md agent definition
  - Implement extraction pipeline
  - Add auto-trigger to complete workflow
  - Create /memory:distill command

### Phase 5: Polish (Week 9+)
- [ ] Integration testing across all features
- [ ] Documentation updates
- [ ] User feedback collection
- [ ] P3 evaluation based on usage data

---

## Metrics for Success

| Improvement | Metric | Target | Measurement Method |
|-------------|--------|--------|-------------------|
| Contract Gates | Scope creep incidents | -50% | User-reported scope changes |
| Status Dashboard | Context recovery time | -60% | Time from session start to first action |
| Deviation Rules | Inconsistent behavior reports | -70% | User confusion reports |
| Wave Execution | Multi-agent efficiency | +40% | Parallel task completion rate |
| Amend Command | Untracked scope changes | -80% | Spec folders with no amendment history |
| Inline Saves | Memory coverage | +50% | Memories per spec folder |
| Memory Distiller | Manual /memory:learn usage | -60% | Command invocation count |

---

## Preservation List

**DO NOT REMOVE these unique System-Spec-Kit features:**

1. **Hybrid Search** - 3-way fusion (vector + BM25 + graph) with RRF
2. **Constitutional Tier** - Always-surface critical rules
3. **FSRS Decay Model** - Cognitive science-backed memory
4. **Causal Memory Graph** - 6 relationship types
5. **Session Deduplication** - 50% token savings
6. **ANCHOR Retrieval** - 93% token savings
7. **Circuit Breaker Pattern** - Failure isolation
8. **Saga Compensation** - Rollback capability
9. **Handover Agent** - Dedicated session continuation
10. **Learning Capture** - Corrections with stability penalties

---

## Conclusion

This recommendations report identifies **9 improvements** across 4 priority levels:

| Priority | Count | Items |
|----------|-------|-------|
| **P0** | 2 | Contract gates, status dashboard |
| **P1** | 3 | Deviation rules, wave execution, amend command |
| **P2** | 3 | Inline save prefixes, memory distiller, AGENTS.md alignment review |
| **P3** | 1 | Quick keywords (deferred) |

The implementation roadmap spans **8 weeks** for core improvements:
- **Weeks 1-2:** Foundations (gates + deviations)
- **Weeks 3-4:** Visibility (status + waves)
- **Weeks 5-6:** Change Management (amend + inline saves)
- **Weeks 7-8:** Knowledge Extraction (distiller)

All recommendations preserve our unique technical innovations while adopting Goodspec's proven UX patterns for explicit confirmation, better visibility, and reduced friction.

**Next Steps:**
1. Review recommendations with stakeholders
2. Create spec folders for Phase 1 items (P0.1, P1.3)
3. Begin implementation

---

**Report Confidence:** HIGH
**Evidence Grade:** A (Direct analysis of both systems)
**Research Method:** 30 parallel Opus agents
