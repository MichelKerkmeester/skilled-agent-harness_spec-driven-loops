---
title: "Feature Specification: Phase 6: review-lane-advisory-and-strict-config"
description: "The empty-registry advisory reads the registry field of the loop it inspects, so review lanes with open findings no longer misfire, and the fan-out containment schema rejects an unknown key such as the removed worktrees option by name."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: review-lane-advisory-and-strict-config

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
| **Phase** | 13 of 13 |
| **Predecessor** | 012-quarantine-retention-per-pass |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Remediate the deep review findings on the fan-out write containment hardening specification.

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
The empty-registry advisory checked `keyFindings` for every loop type, but a review registry carries `openFindings`, so both lanes of the ten-iteration review, holding 24 and 8 open findings, raised `lineage_registry_empty`. Separately, the containment schema was a plain object, so a config still carrying the removed `worktrees` key passed silently.

### Purpose
The advisory fires only when a lane truly registered nothing, and a stale config key fails loudly with its name.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-loop registry field map: key findings for research, open findings for review
- A strict containment schema, with the failed union branch reported by name so the offending key reaches the message
- Tests for both loops' silence, the research warning, and the rejected key in both config shapes; the two retained review lineages re-checked

### Out of Scope
- The advisory's delta counting - unchanged
- Other schema objects - only containment is strict here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `LINEAGE_REGISTRY_FINDINGS_FIELDS`; `hasLineageRegisteredFindings` reads the loop's field; `findEmptyLineageRegistry` exported for the lineage check |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `containment` is a strict object; a failed union is reported through its closest branch so the key is named |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Two new advisory tests |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Rejected-key test for both config shapes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A review lane with open findings in its registry raises no empty-registry warning; a research lane with delta findings and no key findings still does |
| REQ-002 | A fan-out config carrying `containment.worktrees` is rejected with a message naming the key, in both the legacy and manifest shapes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The two retained review lineages re-check as no-warning |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The review-lane test fails against the unmodified runner and the key test fails against the unmodified schema; both pass after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Strictness rejects a legitimate key | Low | Only the containment object is strict and its keys are enumerated |
| Risk | The union hides the key | Low | The closest-branch normalization names it; tested |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One registry read per settled lane, unchanged

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: A malformed registry still falls through to the delta count
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Review registry with open findings: silent
- Research registry with key findings: silent
- Research lane with deltas and an empty registry: warning

### Error Scenarios
- Unknown containment key in legacy shape: rejected by name
- Unknown containment key in manifest shape: rejected by name

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two runtime files, two test files |
| Risk | 6/25 | Advisory and config parsing |
| Research | 2/20 | Findings located by the review |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


