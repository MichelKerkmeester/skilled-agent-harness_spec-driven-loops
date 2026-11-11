---
title: "Phase 2: Fresh Timing Profile"
description: "Every speed estimate rests on a profile taken before the five cuts. This phase times every test file again, so the next cuts can aim at real costs."
trigger_phrases:
  - "fresh timing profile"
  - "phase 2 fresh timing profile"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fresh Timing Profile

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
| **Phase** | 2 of 5 |
| **Predecessor** | 001-five-cuts |
| **Successor** | 003-split-upgrade-legacy |
| **Handoff Criteria** | The tables and the go or no-go are recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the test-cycle speed series.

**Scope Boundary**: measuring only. No code, config or test changes.

**Dependencies**:
- Phase 1, `001-five-cuts`, built and pushed.

**Deliverables**:
- Per-file times for the deep-loop suite and both spec-kit lanes, and per-block times for `upgrade-legacy`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research could not assign seconds to any remaining cost. The only per-file profile came from before the five cuts. It ranked files that have since moved, been split by fixtures or been parallelized.

### Purpose
Phases 3 and 4 act on measured costs, not guesses.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The last full runs, on an 18-core Mac with nothing else running:

```text
deep-loop npm test        504-511 s   173 files, 2873 tests
spec-kit core lane        348-399 s   126 files run
spec-kit cli lane         397-430 s   202 files run
spec-kit validation lanes  82-96 s
```

No run since the cuts recorded a per-file time.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One profiling run of each suite with Vitest's JSON reporter, on a quiet machine.
- A summary table in this phase's `implementation-summary.md`: the 20 slowest files per lane, every serial deep-loop file, and `upgrade-legacy`'s five describe blocks.
- A go or no-go for phases 3 and 4, from those numbers.

### Out of Scope
- Any change to code, configs or tests - this phase only measures.
- Committing the raw JSON reports - they are large and machine-specific.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md` (this phase) | Modify | The timing tables and the go or no-go |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Per-file times for all three lanes | The summary lists the 20 slowest files per lane, each with seconds |
| REQ-002 | The run is clean | Each profiled run passes every test it ran, so no time is from a failure |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A decision for phases 3 and 4 | The summary says go or no-go for each, with the number behind it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three JSON reports exist in the scratchpad and the summary table quotes them.
- **SC-002**: Phase 3 and 4 have a go or no-go with a measured reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Other load on the machine skews the times | Wrong ranking | Check `pgrep -fl vitest` is empty before each run |
| Dependency | The spec-kit build must be current | Validation tests fail and look slow | Run `npm run build` in `S` first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


