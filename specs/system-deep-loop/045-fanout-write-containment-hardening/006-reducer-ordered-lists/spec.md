---
title: "Feature Specification: Make the lineage reducer extract numbered findings and flag a fulfilled lane whose registry stays empty"
description: "The deep-research reducer writes the findings registry even when a leaf-authored strategy file lacks the anchor markers, and a fulfilled lane whose registry is empty while its deltas hold findings is flagged on the fan-out ledger."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Make the lineage reducer extract numbered findings and flag a fulfilled lane whose registry stays empty

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
| **Predecessor** | `../005-churn-cumulative-arm/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retained SWE-2 lineage finished three iterations with 25 finding records in its deltas and numbered findings in its iteration files, yet its registry held no findings. The reducer had already built the registry when it threw on the lineage's strategy file, which the Devin leaf wrote without the machine-owned anchor markers, and the throw came before the registry write. Nothing on the ledger said the lane had registered nothing.

### Purpose
A registry the reducer has built is always written, and a lane that fulfilled without registering its findings is named on the ledger.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The reducer's strategy rewrite degrading to a warning when an anchor is missing, with the registry and dashboard still written
- A `lineage_registry_empty` ledger warning at fulfilled settle when deltas hold findings and the registry holds none
- Tests for both, plus the existing list-extraction cases staying green

### Out of Scope
- List extraction - the reducer already reads bullets and numbered items; the goal's original premise was corrected in D1
- Rewriting a strategy file without anchors - the leaf's bytes stay untouched
- The lane verdict - the warning never changes it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | Missing-anchor throws carry a code; `reduceResearchState` catches that code, records `strategyWarnings`, skips the strategy write and still writes registry and dashboard |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Counts delta finding rows and checks the lane registry at fulfilled settle; appends `lineage_registry_empty` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modify | Anchor-less strategy fixture |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Fulfilled lane with deltas and no registry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When the strategy file lacks an anchor section, the reducer leaves it byte-identical, records the message in `registry.strategyWarnings`, and writes the registry and dashboard |
| REQ-002 | Any other reducer error still propagates as before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | At fulfilled settle, a lane whose deltas hold at least one finding record and whose registry has no `keyFindings` gets a `lineage_registry_empty` ledger warning with the label and the delta finding count |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The retained SWE-2 lineage re-reduces to a registry with 27 key findings and one strategy warning
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A partially rewritten strategy file | Low | The whole rewrite is skipped on a missing anchor, never applied partially |
| Dependency | Reducer error code contract | Green | Only the two anchor throws carry the code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One read of the lane's delta files at settle; no extra git calls

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: A malformed delta or unreadable registry never throws at settle; the advisory counts what it can read
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Strategy file with all anchors: rewritten exactly as before
- No deltas directory: no warning
- Registry present with findings: no warning

### Error Scenarios
- Reducer error other than a missing anchor: propagates
- Unreadable registry: the delta count alone decides

### State Transitions
- Partial completion: the warning is evaluated only on the fulfilled path
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Reducer, runner, two test files |
| Risk | 8/25 | Reducer write path and the fulfilled settle path |
| Research | 6/20 | Root cause found by reproduction, not by the stated premise |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


