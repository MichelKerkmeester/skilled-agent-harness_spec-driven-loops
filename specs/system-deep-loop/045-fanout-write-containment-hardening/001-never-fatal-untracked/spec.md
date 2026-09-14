---
title: "Feature Specification: Under preserve, an out-of-scope untracked path is advisory and never fails the lane, so a neighbour's new file cannot halt a fan-out"
description: "Under preserve, an out-of-scope untracked path is an advisory and never fails a fan-out lane, so a neighbour dropping a new file cannot halt it."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Under preserve, an out-of-scope untracked path is advisory and never fails the lane, so a neighbour's new file cannot halt a fan-out

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
| **Predecessor** | none |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The write-containment guard failed a fan-out iteration whenever an untracked file appeared outside the lane's packet tree, even under the preserve remedy, where nothing is ever rolled back. A neighbouring session dropping one new file anywhere in the checkout therefore halted a lane that had done nothing wrong, and the halt protected nothing because the file was already preserved.

### Purpose
Under preserve, an out-of-scope untracked path is an advisory the ledger records; the lane's own verdict stands.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `violations` versus `advisories` partition in `enforceWriteContainment`, preserve mode only
- Unit coverage for the new partition in both modes
- A runner-level stub-lane test proving the lane settles fulfilled with a ledger advisory

### Out of Scope
- Detection, scope rules, carve-outs and the regenerable-state exemption - frozen by the parent's decision D2
- The restore remedy's partition - it still fails an unrelated untracked write, proving the change is scoped
- In-HEAD breaches and escaping symlinks - their classification is unchanged in both modes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Preserved untracked paths become advisories under preserve; restore keeps the packet-scope partition |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Two new tests for the partition per mode; five existing fatal-untracked tests now opt into restore explicitly |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Stub-lane test: stray untracked file mid-run settles as advisory; graceful self-stop fixture asks for a tree explicitly |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Under preserve (or omitted mode) every path the revert reports as preserved untracked is returned in `advisories`, never in `violations`, unless it escapes the artifact tree through a symlink |
| REQ-002 | Under restore the current partition is unchanged: an untracked path outside the packet tree still fails the iteration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A runner stub lane whose checkout gains a stray untracked file mid-run settles fulfilled, the file is byte-identical, and the status ledger carries a `containment_advisory` event naming it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new preserve-mode unit test fails against the unmodified guard and passes after the change
- **SC-002**: The deep-loop runtime suite exits zero with the change in place
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A genuinely stray lane write outside the packet now passes silently under preserve | Low | It is still preserved, quarantined, logged as an advisory and counted on the ledger; nothing is lost and the operator can see it |
| Dependency | Preserve-by-default remedy from the parent packet | Already shipped | None needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No extra git calls; the partition reuses the revert result already computed

### Security
- **NFR-S01**: An escaping symlink inside the artifact tree stays fatal in both modes

### Reliability
- **NFR-R01**: No file is deleted or rolled back under preserve, before or after this change
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: no detected paths returns the same empty result as before
- Repo-root stray file: advisory under preserve, fatal under restore (no packet relationship)
- Escaping symlink named inside the artifact tree: fatal in both modes

### Error Scenarios
- Git unavailable: the wrapper fails open and the guard reports nothing, unchanged by this phase
- Concurrent access: the neighbour's file is never touched; the advisory names it

### State Transitions
- Partial completion: the lane's own verdict decides; the advisory never overwrites it
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One function, three files, about 180 lines mostly tests |
| Risk | 10/25 | Shared runtime guard; behaviour change gated by remedy mode |
| Research | 4/20 | Root cause already established by the parent's research |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


