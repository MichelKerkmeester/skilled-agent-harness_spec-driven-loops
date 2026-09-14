---
title: "Feature Specification: Remove the per-lineage worktree mechanism, its modules, wiring, tests and plan, now that attribution is not a requirement"
description: "The per-lineage worktree mechanism is removed from the deep-loop fan-out runtime: every lineage runs in the shared checkout and preserve-by-default containment is the only guard."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove the per-lineage worktree mechanism, its modules, wiring, tests and plan, now that attribution is not a requirement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `../spec.md` |
| **Predecessor** | `../006-reducer-ordered-lists/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The per-lineage worktree mechanism cost 1.6 GB and about 22 seconds per lane, existed only to make write attribution exact, and attribution is not a requirement: the operator's need is that a lane never halts on a neighbour's write and that no output is lost, which preserve-by-default plus the never-fatal untracked rule already meet. Left dormant behind a flag, five modules and their wiring would keep drifting from a runner nobody exercised them with.

### Purpose
One code path: lanes write, spawn and are inspected in the shared checkout, and nothing in the runtime knows what a lineage worktree was.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deleting the five worktree modules and their five tests
- Removing the worktree wiring, flag, config field, ledger events and isolation summary from the runner and its tests
- Removing the worktree option from the deep-loop feature catalog and playbooks
- Verifying the launch-wrapper tests still pass and running a live two-lane fan-out on this checkout with a neighbour writing mid-run

### Out of Scope
- The launch wrapper's split-link provisioning - it serves the operator's own session worktrees, a different mechanism (D1 amended)
- Containment detection - untouched
- Run-keyed lineage directory names - kept, they are what keeps concurrent runs apart on one checkout

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lease.ts, worktree-lifecycle.ts, worktree-paths.ts, worktree-publish.ts, worktree-reclaim.ts` | Delete | The five isolation modules |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/worktree-*.vitest.ts` | Delete | Their five tests |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Imports, option parsing, lane setup, settle, ledger events and summary blocks removed; 4222 to 3638 lines |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `containment.worktrees` removed |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Worktree cases removed; the cumulative churn case made deterministic by disabling the per-window arm |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Worktree default test removed |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs, .opencode/skills/system-deep-loop/runtime/lib/README.md` | Modify | Two comments that named per-lineage worktrees |
| `.opencode/skills/system-deep-loop/feature-catalog/*, manual-testing-playbook/*` | Modify/Delete | Worktree option removed; the isolated-run playbook deleted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No file under `runtime/lib/deep-loop` matches `worktree-*`, and no flag or config key named `worktrees` remains in the runtime or the command YAMLs |
| REQ-002 | The deep-loop suite and the launch-wrapper tests exit zero after removal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A live two-lane fan-out on this checkout, with a neighbour dropping and editing files outside the packet during the run, settles every lane fulfilled with every out-of-scope file preserved |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite exits zero at 151 files
- **SC-002**: The live run's ledger shows advisories for the neighbour's files and no failed lane
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A caller still passes the removed flag | Low | The argument parser rejects unknown keys only where a schema reads them; the YAMLs never carried it |
| Risk | Concurrent runs collide on one checkout | Low | Lineage directories stay run-keyed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No per-lane checkout cost; a lane starts in the shared checkout immediately

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: The containment guard watches the checkout itself for every lane
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Two lanes in one run: distinct run-keyed lineage directories
- A neighbour's untracked file: advisory under preserve, never fatal

### Error Scenarios
- Removed modules imported elsewhere: typecheck and the suite would fail; both pass

### State Transitions
- Partial completion: a lane's directory stays in the checkout under its run-keyed name
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Twenty-two files, 5,800 lines removed |
| Risk | 12/25 | Runner spine touched; every containment call site reads the repo root |
| Research | 4/20 | Decision settled by the parent's research |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


