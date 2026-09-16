---
title: "Feature Specification: Phase 1: review-confirmed-findings"
description: "The six findings the post-work review confirmed, including one this session first refuted and an independent pass overturned."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: review-confirmed-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-post-work-review |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the close what the post-work review confirmed specification.

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
A ten-iteration review of the program found seven defects in work every phase had already called verified. Five held on inspection, one was refuted, and a fresh model checking the refutation showed it wrong and the finding understated by more than double. The common shape in all of them is a claim checked against the mechanism that produced it rather than against the tree: a guard read its own green, a sweep read its own grep, a census was read from the file it was written into.

### Purpose
Every confirmed finding is closed, and the guard that missed them can no longer pass on a prose mention.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The stem checker's blindness to interpolated emissions, and the seven-stem census error it hid
- Forty-three playbook citations missing a path segment, first wrongly refuted
- A feature catalog citing a file an earlier refactor deleted
- A stress scenario whose prose contradicted its own command block, twice
- A parity census asymmetric between two command variants
- The resolver's own false positive, found by the verification pass

### Out of Scope
- A registry glossary the concurrent session fixed and committed independently
- Per-site rather than per-file crediting in the resolver, which needs a parser and changes no answer today

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ``.opencode/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs`` | Modify | Resolves interpolated emissions through the two shapes a call site names an event with |
| ``.opencode/skills/system-deep-loop/runtime/lib/*-ledger-schema/*-ledger-types.ts`` | Modify | Seven stems moved from reserved to spoken with their real producers |
| ``.opencode/skills/sk-code/manual-testing-playbook/`` | Modify | Fifty-two citations across seventeen files gain the path segment they were missing |
| ``.opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md`` | Modify | The deleted validator citation removed |
| ``.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/proposal-only-boundary.md`` | Modify | Both stale prose counts corrected to match the command block |
| ``.opencode/commands/deep/assets/deep-research-confirm.yaml`` | Modify | The auto-only gateway sites enumerated, as its twin already did |
| ``.opencode/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts`` | Modify | Pins the corrected census and the twelve spoken stems |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every registered stem a producer emits is declared spoken, whether written whole or built from a prefix |
| REQ-002 | The resolver credits a stem only from a call site that names the event, never from prose |
| REQ-003 | Every playbook citation resolves against the root its own playbook declares |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No catalog cites a file the tree does not have |
| REQ-005 | A scenario's prose agrees with the command block beneath it |
| REQ-006 | Both confirm variants enumerate their auto-only gateway sites |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The census reports twelve spoken and forty-nine reserved with zero violations, where it reported five and fifty-six
- **SC-002**: No stem is credited through a prose mention
- **SC-003**: Zero unprefixed citations remain, and the whole suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The resolver over-credits and a real gap hides behind a false positive | Handled | It matches only a positional argument or a structured event key, which the verification pass proved excludes the prose case |
| Risk | The citation rewrite double-prefixes or catches an already-correct path | Handled | Zero double prefixes, and all four targets resolve from the declared root |
| Risk | Changing the census breaks a test that pinned the old numbers | Handled | The test pinned them and was corrected with its comment |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: A registered event can no longer be emitted while the census calls it unspoken

### Reliability
- **NFR-R01**: The guard that passed clean over seven real emissions now fails on them
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A stem named only in prose: never credited
- A citation already carrying its segment: left alone

### Error Scenarios
- A file with two interpolating helpers: both credited with either one's names, documented as over-reporting in the safe direction

### State Transitions
- A stem moving from reserved to spoken: needs a named producer file, which the checker then holds it to
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | A checker, two schemas, seventeen playbook files, a catalog, a scenario, a workflow and a test |
| Risk | 12/25 | The checker gates a release-governing census |
| Research | 14/20 | Six findings, one of them overturning this session's own conclusion |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


