---
title: "Implementation Plan: Shallow evidence claims research"
description: "Plan for the evidence research round: take the five diagnosed claims, name the criterion and the four shapes, and land the fix on the existing boundary row."
trigger_phrases:
  - "shallow evidence claims plan"
  - "evidence criterion landing plan"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/003-shallow-evidence-claims"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Plan executed: criterion shipped, both promotion sites coordinated"
    next_safe_action: "Land the two shared-table promotions together"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Shallow evidence claims research

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Documentation and evidence only; the fix edits standards prose |
| **Sources** | Five diagnosed claims from one session, the four-standards table, the evidence rule's tier mirror |
| **Driver** | Ten research iterations on DeepSeek V4.1 Flash at max thinking through `cli-pi` |
| **Evidence** | Each diagnosed claim is reproduced with the receipt that failed to confirm it |

### Overview

The round replays the five false claims, extracts the test that would have caught each one, and reduces the result to a single criterion on the boundary row that already owns confirmed-versus-inferred. The four shapes come out of the same replay, and the one coordinated promotion into the shared table is recorded with its landing order.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [x] Five diagnosed claims replayed, each with the receipt that failed to confirm it.
- [x] The criterion stated as a test and applied to all five.
- [x] The fix placed on the existing boundary row plus its tier mirror, with the coordinated promotion recorded.

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Diagnose, reduce, land in place. The five claims are replayed to extract one test; the test is reduced to a criterion; and the criterion lands on the row that already owns the boundary, with the tier mirror carrying the same wording.

### Key Components

- **The criterion**: a receipt confirms a claim only if a false claim would have changed what the receipt showed.
- **The four shapes**: the recurring patterns behind the five claims.
- **The landing sites**: the boundary row, its tier mirror, and the shared table that receives the coordinated promotion.

### Data Flow

Claim to receipt to criterion; the criterion to the boundary row and its mirror; the boundary row to the other two repositories that carry the same region. Both promotions into the shared table are sequenced together so the table never holds one without the other.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Replay
- [x] Reproduce the five false claims and the receipt behind each.

### Phase 2: Reduce
- [x] Extract the criterion and the four shapes from the replay.

### Phase 3: Land
- [x] Place the criterion on the boundary row and its mirror, and coordinate the shared-table promotion.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Evidence standard, applied to every claim in this phase:

| Check | Scope | Rule |
|-------|-------|------|
| Counterfactual | Every receipt cited | State what the receipt would have shown had the claim been false |
| Shape | Every replayed claim | Name which of the four shapes it takes |
| Landing | The edited row | A false claim must have changed the receipt, or the criterion does not bind |
| Propagation | The shared region | Each repository that carries the region is edited or confirmed |

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The four-standards table | Internal | Green | The boundary row is where the criterion must land |
| The tier mirror in the evidence rule | Internal | Green | Without it the two tiers drift |
| The other two repositories | Internal | Yellow | A partial edit leaves one copy behind on a line-identical region |

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The criterion over-blocks or the two promotions land out of order.
- **Procedure**: Revert the boundary row and its tier mirror to the previous wording; the table's other promotion is unaffected because the two are sequenced deliberately.

<!-- /ANCHOR:rollback -->

## RELATED DOCUMENTS

- **Specification:** `spec.md`
- **Tasks:** `tasks.md`
