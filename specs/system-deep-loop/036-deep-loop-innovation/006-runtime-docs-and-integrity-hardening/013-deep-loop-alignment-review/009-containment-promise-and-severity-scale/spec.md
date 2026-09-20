---
title: "Feature Specification: Phase 8: containment-promise-and-severity-scale"
description: "The containment promise says what the runner does, the verdict check says what it checks, and a severity outside the scale is reported instead of silently ranking below everything."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: containment-promise-and-severity-scale

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
| **Phase** | 9 of 9 |
| **Predecessor** | 008-agent-mirror-parity |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Remediate the alignment review findings specification.

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
Two governed domains each had two authorities pronouncing and nothing reconciling them. The containment comments promised a revert, a violation event and a loudly failed iteration, while the runner preserves by default: it diffs, records and quarantines, then leaves the bytes on disk. The verdict parser checks that the final line has the right shape and nothing else, so a PASS stated over three active blocking findings passes it. And a finding rated outside the three-tier scale fell through the merge's rank lookup to a zero default, ranking below the lowest real tier, which made it invisible to the one rollup that turns a blocker into a failed verdict.

### Purpose
Each domain has one authority, and every losing site points at it rather than restating it differently.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The containment promise sites: both auto variants' comments, both confirm variants' notes, and the guard's own docstring
- The verdict check's shape-only contract, stated at the check, the hub SKILL.md and the rendered prompt pack
- The out-of-scale severity fallthrough in the merge
- The collapse rule for a rating outside the scale, written where a rater reads it
- The two compiled command contracts the edits stale

### Out of Scope
- The containment default itself - changing preserve to restore is a destructive behaviour change on shared checkouts, not a comment fix
- The rank semantics for an out-of-scale value - re-ranking a tier the scale does not have would guess
- The executor tables in the runner and the reducer's severity normalizer, both recorded as adjacent defects another surface owns
- Everything under specs/ - the packet record is written outside the dispatch

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ``.opencode/commands/deep/assets/deep-review-auto.yaml`` | Modify | The containment comment describes what the runner does and names the remedy authority |
| ``.opencode/commands/deep/assets/deep-research-auto.yaml`` | Modify | Same correction |
| ``.opencode/commands/deep/assets/deep-review-confirm.yaml`` | Modify | The notes entry drops its revert-and-fail-closed claim |
| ``.opencode/commands/deep/assets/deep-research-confirm.yaml`` | Modify | Same correction |
| ``.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`` | Modify | The guard docstring stops asserting a caller obligation no caller meets |
| ``.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`` | Modify | The check states that it validates format only and names the authoritative rollup |
| ``.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`` | Modify | An out-of-scale severity is reported per lineage, finding and value through the existing mismatch channel |
| ``.opencode/skills/system-deep-loop/deep-review/SKILL.md`` | Modify | The severity table carries the collapse rule and the verdict contract |
| ``.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`` | Modify | The rater's rendered prompt carries the same two statements |
| ``.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts`` | Modify | The report, the duplicate collapse and an in-scale value still deciding the verdict |
| ``.opencode/commands/deep/assets/compiled/*.contract.md`` | Modify | Regenerated, refused as stale by a digest test until they were |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every containment promise site describes what the runner does, and none claims a revert the default mode never performs |
| REQ-002 | The verdict check's contract says plainly that it validates format only, and names the rollup that governs release |
| REQ-003 | A severity outside the three-tier scale is reported rather than silently ranked below every real tier |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The collapse rule for an out-of-scale rating is written where a rater reads it, not left as an unwritten convention |
| REQ-005 | The deep-loop suite exits zero with this change set in place |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No promise site claims a revert or a loud failure the default mode does not perform
- **SC-002**: A registry carrying an out-of-scale severity produces a warning where the pre-change module produced none
- **SC-003**: The whole deep-loop suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Correcting the promise reads as weakening the guarantee | Handled | The guarantee was never implemented; the comment described a mode nothing selects, and the remedy authority is now named |
| Risk | Reporting an out-of-scale severity floods a normal run | Handled | Reported once per lineage, finding and value, through the channel registry-shape mismatches already use |
| Risk | Documenting a shape-only check reads as accepting a weak gate | Handled | The statement names where the governing verdict is actually computed, which nothing said before |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One extra pass over each lineage's findings at merge time

### Security
- **NFR-S01**: A blocking finding can no longer disappear from the rollup by carrying a rating outside the scale

### Reliability
- **NFR-R01**: No runtime behaviour changes except the added report; the containment default is untouched
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A finding with no severity at all: left to the registry-shape warnings that already cover a missing field
- The same out-of-scale value on the same finding in one lineage: reported once

### Error Scenarios
- A registry carrying only out-of-scale severities: every one reported, ranking unchanged
- An in-scale blocking finding alongside an out-of-scale one: the in-scale one still decides the verdict

### State Transitions
- A second writer trips the containment latch: preserve is locked permanently, which is why a restore default would not hold
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Eleven source files across command assets, runtime and hub docs |
| Risk | 12/25 | Containment and merge are release-governing paths |
| Research | 12/20 | Four measurements checked against the tree, four of them found wrong |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


