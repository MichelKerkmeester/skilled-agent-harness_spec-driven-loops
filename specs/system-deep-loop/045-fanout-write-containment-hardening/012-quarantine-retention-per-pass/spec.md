---
title: "Feature Specification: Phase 5: quarantine-retention-per-pass"
description: "Each containment pass keeps its own quarantine directory keyed by iteration and attempt, every quarantine and patch file is created exclusively, and a later pass never overwrites an earlier pass's evidence."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: quarantine-retention-per-pass

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
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 011-restore-never-through-symlink |
| **Successor** | 013-review-lane-advisory-and-strict-config |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Remediate the deep review findings on the fan-out write containment hardening specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The quarantine writer targeted one fixed directory per lane and its docs said a later pass replaces the manifest and named files. A retried attempt or a second iteration therefore overwrote the evidence of the first, which weakened auditability and replay diagnosis. The deep review rated it P1.

### Purpose
Every containment pass leaves its own manifest, content copies and patches on disk, and the result names the directory of the pass that wrote it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A pass segment from iteration and attempt in the quarantine and patch paths
- Exclusive file creation so an existing file is reported, never replaced
- The combined revert patch moved under the same pass directory, still keyed by remedy
- Tests for two passes and for two attempts of one pass; existing path assertions re-pointed

### Out of Scope
- The runner - it already passes the attempt as the iteration and forwards the returned paths verbatim
- Reclaiming old passes - retention is the point

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | `passSegment`; quarantine tree under `containment/quarantine/<pass>/`; patch under the same pass directory; exclusive creation; patch destination through the canonicality refusal; `attempt` on the enforce input |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Two new tests; ten path assertions re-pointed, including the two symlink-refusal cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The quarantine directory and patch file names carry the pass identity (iteration, and attempt when given); two passes on one lane leave two manifests and two patch sets with distinct paths |
| REQ-002 | Every quarantine and patch write creates its file exclusively; an existing file is reported on the result, never overwritten |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The returned quarantine path and recovery hint name the directory of the pass that wrote them |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The retention test fails against the unmodified writer (one manifest survives two passes) and passes after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Docs still name the fixed path | Low | The protocol line and the parent plan are updated in the same change and the compiled contract regenerated |
| Risk | Disk growth across many passes | Low | Bounded by the quarantine size bound already in place |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One exclusive open per written file; no extra git calls

### Security
- **NFR-S01**: The patch destination now passes the same canonicality refusal as every other quarantine write

### Reliability
- **NFR-R01**: A pass directory that already exists is reused; only files are claimed exclusively, so a pass never discards its own manifest
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Two iterations: two directories, both retained
- Two attempts of one iteration: `3-attempt-1` and `3-attempt-2`
- Missing iteration: `unknown` segment

### Error Scenarios
- Existing file at a destination: reported, not replaced
- Symlink at the pass directory: refused, as for every other write

### State Transitions
- Partial completion: earlier passes stay intact
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One module, one test file, ten assertions re-pointed |
| Risk | 10/25 | Every quarantine path shape changes |
| Research | 3/20 | Finding located by the review |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


