---
title: "Phase 5: CI Runner Timing"
description: "Every timing so far comes from an 18-core Mac. This phase reads how long both suites take on GitHub's runner and sets a worker cap only if the numbers call for one."
trigger_phrases:
  - "ci runner timing"
  - "phase 5 ci runner timing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: CI Runner Timing

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/340-local-test-scope` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-split-fanout-run |
| **Successor** | None |
| **Handoff Criteria** | CI times recorded and the cap decided |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the test-cycle speed series.

**Scope Boundary**: reading CI run times, and a worker cap only if one is needed.

**Dependencies**:
- Phase 1 pushed, so CI has run the parallel configs.

**Deliverables**:
- The CI step times for both suites, and a decision on a worker cap.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The suites now run files in parallel. GitHub's `ubuntu-latest` runner has far fewer cores than the Mac the cuts were measured on. Parallel files there could gain little, or cause the load failures seen locally at high worker counts.

### Purpose
Know what the cuts did in CI, and cap workers there only if the runs show a need.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

N/A: no CI step time has been read yet, because reading them is this phase's work.

No CI timing has been read since the cuts were pushed. `spec-kit-check.yml` and `deep-loop-runtime.yml` both run on `ubuntu-latest`, with job timeouts of 51 and 34 minutes.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the step times of the CI runs before and after the cuts, with `gh run view` and the Actions API. This is read-only.
- Record any test that failed or timed out in CI since the cuts.
- Add a worker cap to a config only if the CI runs fail under load or run slower than before.

### Out of Scope
- A CI job matrix or job split - the research found no evidence it pays.
- New workflow triggers or manual runs - the existing push runs are the data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md` (this phase) | Modify | The CI timings and the decision |
| `D/vitest.config.ts`, `S/vitest.config.ts` | Modify, only if needed | A worker cap for CI |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Before and after CI times | The summary gives each suite's step time from at least two runs on each side of the cuts |
| REQ-002 | CI failures since the cuts are known | The summary lists every failed or timed-out test, or says there were none |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A cap only when needed | A cap is added only with a failing or slower CI run as its reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The summary has before and after CI step times for both suites.
- **SC-002**: The decision on a cap names the run behind it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `gh` account that can read Actions | No data | Use the account that pushed, then switch back |
| Risk | Too few runs since the cuts | A noisy comparison | Wait for at least two runs on each side |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


