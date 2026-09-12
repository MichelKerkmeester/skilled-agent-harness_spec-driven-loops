---
title: "Feature Specification: Shallow evidence claims research"
description: "Ask what would reduce confident-but-unsupported claims, name the four shapes they take, and fix the admitted one at its existing line rather than by adding a rule."
trigger_phrases:
  - "shallow evidence claims research"
  - "confident unsupported claim shapes"
  - "evidence boundary fix"
  - "receipt that confirms a claim"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/003-shallow-evidence-claims"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Research closed: evidence criterion shipped, one row amended in place"
    next_safe_action: "Land the two promotions in the shared table together"
    blockers: []
    key_files:
      - "decisions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Shallow evidence claims research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `022-smart-rule-injection` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 3 |
| **Successor** | None; final phase |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child asks what would reduce confident-but-unsupported claims. It ran ten research iterations with no early convergence on DeepSeek V4.1 Flash at max thinking through `cli-pi`, diagnosed five false confident claims in one session, and admitted one fix that amends an existing standards row instead of adding a rule.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A confident claim is cheap to write and expensive to unwind. Five false confident claims were diagnosed in a single session, and the interesting part is that none of them came from a missing rule: each one came from evidence that would have looked the same whether the claim was true or false.

### Purpose

Name the test that separates a receipt from an alibi, identify the shapes a shallow claim takes so they are recognisable while reading, and fix the admitted one where the boundary is already written.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The evidence criterion: a receipt confirms a claim only if the claim being false would have changed what the receipt showed.
- The four recurring shapes behind the five diagnosed claims.
- The admitted fix and the two locations it lands in.

### Out of Scope

- A new rule file or a new standards row; the fix amends the row that already owns the boundary.
- Builder-side enforcement beyond the amended row and its mirror.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Row 1 of the four-standards table, the confirmed-versus-inferred boundary |
| `repo-rules/evidence-and-proof.md` | Modify | The same criterion at its tier mirror, so the two do not drift |
| `repo-rules/delegation-and-orchestration.md` | Confirm | The self-lens clause; its promotion targets the same table and lands with this fix |
| `AGENTS.md` in the other two repositories | Confirm | The region is line-identical today, so each place is edited or confirmed rather than assumed |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The criterion is stated as a test, not an encouragement | The wording asks whether a false claim would have changed the receipt |
| REQ-002 | The fix amends the existing boundary row | Row 1 of the four-standards table carries the criterion; no new row and no new rule file |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The four shapes are named so they are recognisable while reading | Each shape is stated as a pattern with the claim class it produces |
| REQ-004 | The mirror and the shared-table promotion are coordinated | The tier mirror is named, and both promotions into the table are recorded as landing together |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A receipt confirms a claim only if the claim being false would have changed what the receipt showed.
- **SC-002**: The four shapes are named: a search that never hit, a read that stopped short, a total carried from another analysis, and a match that never checked what the two sides were.
- **SC-003**: The fix lands as an amendment to the existing boundary row plus its tier mirror, not as a new rule.
- **SC-004**: The shared table's second promotion is recorded as coordinated, so the two edits land deliberately rather than by accident.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The criterion is added as a new row beside the boundary it restates | Two rows disagree over the same boundary | Amend the row that owns the boundary; mirror it instead of duplicating it |
| Risk | The two promotions into the shared table land separately | The table's rows drift between repositories | Land both edits together and confirm the line-identical region in all three places |
| Dependency | The three repositories that share the standards region | A partial edit leaves one repository behind | Edit or confirm each place rather than trusting the share |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The propagation across the other two repositories is edit-or-confirm work: the region is line-identical today, so a change in one place must be re-checked in the other two.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Decision record:** `../decisions.md`
- **Predecessor:** `../002-event-triggered-injection/spec.md`
