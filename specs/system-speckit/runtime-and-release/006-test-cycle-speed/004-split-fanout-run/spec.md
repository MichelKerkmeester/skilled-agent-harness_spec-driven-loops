---
title: "Phase 4: Split fanout-run"
description: "fanout-run is the largest of the twelve deep-loop files that run one at a time. Splitting it and moving safe pieces into the parallel group could shorten the serial tail."
trigger_phrases:
  - "split fanout run"
  - "phase 4 split fanout run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Split fanout-run

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/340-local-test-scope` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-split-upgrade-legacy |
| **Successor** | 005-ci-runner-timing |
| **Handoff Criteria** | Three passing full-suite runs, the same test count and a faster suite |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the test-cycle speed series.

**Scope Boundary**: `fanout-run.vitest.ts` and the deep-loop Vitest config's serial list.

**Dependencies**:
- Phase 2 says go, with `fanout-run` still a large share of the serial tail.

**Deliverables**:
- `fanout-run` split into pieces, and each piece placed in the group its own runs support.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Twelve deep-loop files run one at a time after the rest, for about 265 s. `fanout-run` is the largest. It has no elapsed-time upper bound, but two of its tests failed when every file ran in parallel at the default worker count: one on a null exit code and one on a churn check sampled per heartbeat.

### Purpose
Move whatever part of `fanout-run` is provably safe into the parallel group, and keep the rest serial.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
deep-loop npm test   504-511 s
serial group         about 265 s, 12 files
fanout-run           157 s alone, before the cuts
```

In the run with every file parallel at the default worker count, `fanout-run` failed two tests. Neither has been retried at 8 workers.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split `fanout-run.vitest.ts` into pieces along its describe blocks, balanced by phase 2's measured seconds.
- Move one piece at a time into the parallel group. A piece stays only after three full-suite runs pass.
- Keep the churn and process-exit tests serial unless their own runs prove otherwise.

### Out of Scope
- Loosening any timeout, heartbeat or assertion to make a piece pass.
- The other eleven serial files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `D/tests/unit/fanout-run.vitest.ts` | Modify | Split into pieces |
| `D/tests/unit/fanout-run-*.vitest.ts` | Create | The pieces |
| `D/vitest.config.ts` | Modify | The serial list names only the pieces that need it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No test is lost | `vitest list` in `D` counts the same tests before and after |
| REQ-002 | No assertion or limit changes | `git diff` shows tests moved, not edited |
| REQ-003 | Every moved piece is stable | Three full-suite runs pass after each move |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The suite is faster | The deep-loop median falls by at least 10%, or the moves are reverted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three passing full-suite runs with the test count unchanged.
- **SC-002**: The deep-loop median is at least 10% under 504 to 511 s.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A moved piece fails under load | A flaky suite | Return that piece to the serial list at the first failure |
| Risk | The split saves nothing | Wasted work | Phase 2 decides go only if `fanout-run` is a large share of the serial tail |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


