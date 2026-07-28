---
title: "Feature Specification: Silent Test Discovery"
description: "Thirty-seven test files were silently never run by any harness; this packet gives them a discovery runner and a pre-push gate, and records what the silence hid."
trigger_phrases:
  - "silent tests"
  - "test discovery runner"
  - "tests never run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-silent-test-discovery"
    last_updated_at: "2026-07-28T08:20:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Built the runner and wired the report-only pre-push gate"
    next_safe_action: "Spec-kit repairs completion-state; then flip the gate to enforce"
    blockers: []
    key_files:
      - "spec.md"
      - "../../scripts/run-node-tests.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "When does completion-state get repaired so the gate can enforce?"
    answered_questions:
      - "The two vitest-dialect files were doubly silent: wrong extension convention and outside every vitest config glob."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Silent Test Discovery

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `sk-git/0113-016-advisory-hook-build` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Thirty-seven `*.test.mjs` files exist in the live codebase and nothing ran any of them: no CI, no hook, no npm script, and the sole vitest config globs only `bin/**/*.vitest.ts`. Three instances were found one at a time across recent sessions before anyone counted. A test that never runs is worse than none — it stands as evidence of coverage that does not exist.

Discovery proved the point immediately: one live suite is genuinely broken (9 of 65 tests failing), and two files are unrunnable under the harness their extension promises because they import vitest.

### Purpose

Make the suites run, make silence visible, and make a broken suite unable to hide again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A discovery runner covering the live-code roots, partitioned by test dialect.
- A pre-push gate, report-only by default, enforceable by flag.
- Recording what the silence hid.

### Out of Scope
- Fixing the failing `completion-state` suite. That is spec-kit's surface and its failures need spec-kit's judgement, not a drive-by patch from this packet.
- Vendored and archived suites under the spec tree. They fail for environmental reasons that say nothing about the runtime.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/run-node-tests.mjs` | Create | Discovery, dialect partition, honest exit codes |
| `.opencode/scripts/git-hooks/pre-push` | Modify | Third independent gate, report-only default |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every live test file is discovered and hosted by its own dialect | 35 node:test + 2 vitest, none crash-failing under the wrong harness |
| REQ-002 | The runner cannot report a false green | Empty discovery and unparseable summaries exit non-zero |
| REQ-003 | The gate cannot take pushes hostage on pre-existing rot | Report-only default; enforcement is an explicit flag |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The gate is independently bypassable like its siblings | Skip flag honoured without touching the other gates |
| REQ-005 | What the silence hid is recorded | The broken suite and the dialect mismatches are named with numbers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/scripts/run-node-tests.mjs` reports per-dialect results and exits non-zero on any failure.
- **SC-002**: Pushes surface the test state on every run without blocking on pre-existing failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | ~50s added to every push | Med | Pushes are rare relative to commits; skip flag exists |
| Risk | Report-only becomes permanent | Med | The enforce flag and the open question keep it visible |
| Risk | Worktrees without built dist fail environmentally | Med | Known: 8 suites need dist; run the gate from a built tree |
| Dependency | Spec-kit repairing completion-state | Gates enforcement | Recorded as the open question |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- When does `completion-state` get repaired so the gate can flip to enforce?
<!-- /ANCHOR:questions -->
