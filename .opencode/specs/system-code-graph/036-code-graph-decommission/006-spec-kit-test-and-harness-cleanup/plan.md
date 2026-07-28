---
title: "Implementation Plan: Phase 6: spec-kit-test-and-harness-cleanup"
description: "Retired the spec-kit test files that existed only to cover the removed code-graph coupling: 4 graph-only test files deleted first, mock/import strips across 10 more, and 2 whole suites deleted later when every case proved graph-subject, leaving 418 tests green."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/006-spec-kit-test-and-harness-cleanup"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-006-spec-kit-test-and-harness-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: spec-kit-test-and-harness-cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest) |
| **Framework** | system-spec-kit test suite |
| **Storage** | None |
| **Testing** | vitest — 418 tests green after cleanup |

### Overview
Retired the spec-kit tests that existed only to cover the removed code-graph coupling. Four graph-only test files were deleted first, mock and import strips were applied across 10 more files, and two whole suites were deleted later when every case in them proved graph-subject. The suite ended at 418 tests green with no skipped or deleted-module test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phased test retirement: delete graph-only files first, strip mocks/imports from mixed files, then delete whole suites when every case proves graph-subject.

### Key Components
- **Graph-only test files**: 4 files deleted first (existed solely to test the launcher lifecycle and boundary proxy)
- **Mixed test files**: 10 files with mock/import strips (surviving behavior kept, graph assertions removed)
- **Graph-subject suites**: 2 whole suites deleted later (`session-health.vitest.ts`, `session-bootstrap.vitest.ts`)
- **Smoke matrices**: graph tool templates removed from matrix runners

### Data Flow
Each test file was classified before deletion: graph-only (delete), mixed (strip graph cases, keep surviving behavior), or graph-subject (delete whole when every case asserted removed graph sections). The suite ran green at 418 tests after each pass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a fix_bug finding. This phase is a test cleanup, not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Graph-only test files | Covered removed launcher/boundary | Deleted (4 files) | No unresolved import in the suite |
| Mixed test files | Covered surviving behavior plus graph assertions | Mock/import stripped (10 files) | Surviving assertions still pass |
| Graph-subject suites | Every case asserted removed graph sections | Deleted whole (2 suites) | 418 tests green |
| Smoke matrices | Included graph tool templates | Templates and manifest rows removed | Matrix manifest internally consistent |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phase 005 removed the production coupling these tests cover
- [x] Classified each test file as graph-only, mixed, or graph-subject

### Phase 2: Core Implementation
- [x] Deleted 4 graph-only test files (launcher lifecycle and boundary proxy)
- [x] Stripped mocks and imports across 10 mixed test files (surviving behavior kept)
- [x] Deleted `session-health.vitest.ts` whole (every case proved graph-subject)
- [x] Deleted `session-bootstrap.vitest.ts` whole (every case proved graph-subject)
- [x] Removed individual graph cases from `session-resume` and `context-metrics` tests
- [x] Removed graph tool templates and manifest rows from matrix runners
- [x] Removed smoke matrices (commit `fef098b6b2`)

### Phase 3: Verification
- [x] Full spec-kit suite passes at 418 tests green (commit `607ba8cdf6`)
- [x] No test imports a deleted module
- [x] No test is skipped to make the run pass
- [x] Dropped coverage enumerated explicitly
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Full spec-kit suite | vitest |
| Validation | No unresolved imports | vitest collection phase |
| Manual | Dropped coverage enumeration | Summary review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 | Internal | Green | Production coupling must be removed before test cleanup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A deleted test covered surviving behavior that was missed (not expected; each case was classified before deletion).
- **Procedure**: Restore the test file from git history (commit `607ba8cdf6` predecessor) and re-add the graph assertions if the coupling is also restored.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
