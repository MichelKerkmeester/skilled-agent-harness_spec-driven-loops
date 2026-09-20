---
title: "Feature Specification: Phase 5: confirm-variant-parity"
description: "The confirm variants of deep-research and deep-review either match their auto twins or carry an in-file reason for every step they omit, so an interactive run is no longer a quietly weaker run."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: confirm-variant-parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 005-catalog-and-readme-truth |
| **Successor** | 007-ledger-stem-producers |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Remediate the alignment review findings specification.

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
The review measured seven divergences between the confirm and auto variants of the two deep commands. The line-one config record took four different shapes, research-confirm rendered 55 of its auto twin's 73 steps, the gateway-only state write mandated by all four prompt packs was wired by none, the fan-out resource-map emission existed only in the research variant, the unstaged-artifacts invariant was review-auto only, the mechanical post-dispatch gate was invoked once by review-auto and never by either confirm, and a session-id token was declared twice and bound nowhere. An operator choosing the interactive surface silently lost enforcement the unattended surface had.

### Purpose
Every step an auto variant runs is either present in its confirm twin or named in that twin's own census with the reason the interactive surface differs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The seven measured divergences, closed in the confirm variants
- Three further functional holes the close-out exposed: the missing mechanical post-dispatch gate, the unenforced minimum-iterations floor with its convergence-off branch, and the missing snapshot flag on the convergence call
- Auto-side corrections where the auto variant was the wrong one, not the confirm
- A machine-checked parity census written into each confirm file
- Regeneration of the two compiled command contracts the edits stale

### Out of Scope
- The deep-ai-council pair - the review measured no divergence there and its contract was already fresh
- The prompt packs themselves - they already mandate the behaviour; the YAML was what failed to wire it
- Runtime library code - this phase is command-asset only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ``.opencode/commands/deep/assets/deep-review-confirm.yaml`` | Modify | Seven steps restored, config and line-one record brought to parity, gateway wiring and the mechanical gate restored, census added |
| ``.opencode/commands/deep/assets/deep-research-confirm.yaml`` | Modify | Eight steps plus the minimum-iterations floor machinery restored, lineage identity bound, census added |
| ``.opencode/commands/deep/assets/deep-review-auto.yaml`` | Modify | Two auto-side errors corrected: lineage fields read against a flat config, and artifacts left unstaged |
| ``.opencode/commands/deep/assets/deep-research-auto.yaml`` | Modify | Session-id token bound so its pinned fallback resolves |
| ``.opencode/commands/deep/assets/compiled/deep-review.contract.md`` | Modify | Regenerated |
| ``.opencode/commands/deep/assets/compiled/deep-research.contract.md`` | Modify | Regenerated |
| ``.opencode/commands/deep/assets/legacy/README.md`` | Modify | Contract count corrected from four to three, and the reference checker's scope stated truthfully |
| ``.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts`` | Modify | Four tests that fail if a future auto step is added without a confirm step or a census entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the seven measured divergences is closed in the confirm variant, or carries a reason in that file at the point of divergence |
| REQ-002 | No auto step is absent from its confirm twin without a census entry naming why the interactive surface differs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Where the auto variant held the defect rather than the confirm, the auto variant is corrected instead of copied |
| REQ-004 | A test fails if a future edit reopens the gap |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Auto-only steps with no census entry: zero in both pairs
- **SC-002**: Confirm-only steps: zero in both pairs
- **SC-003**: Contract drift check and the whole deep-loop suite exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A restored step is unreachable on the interactive path | Handled | Restored only where the interactive flow reaches it; the divergent-pivot step was censused rather than restored for exactly this reason |
| Risk | Copying auto into confirm propagates an auto-side defect | Handled | Three auto-side errors were corrected rather than mirrored |
| Risk | The census decays into a place to hide new gaps | Handled | A test asserts census integrity, not just its presence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: Restoring the mechanical post-dispatch gate reinstates route-proof verification on the interactive surface

### Reliability
- **NFR-R01**: The interactive surface now enforces the same iteration floor, gateway writes and dispatch verification as the unattended one
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A step with no interactive counterpart: censused with its reason, not restored
- A step whose interactive equivalent is inlined elsewhere: census names the inlining site

### Error Scenarios
- Convergence mode off: the branch now exists on both research surfaces
- A dispatch that fails route proof: both confirm variants now redispatch once

### State Transitions
- Restart versus resume: the interactive surface classifies the session itself, which is why the auto lifecycle pre-step stays censused
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Four workflow files plus two compiled contracts and one test file |
| Risk | 12/25 | Command assets drive live runs; a wrong restore changes execution |
| Research | 10/20 | Ten divergences measured and dispositioned individually |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


