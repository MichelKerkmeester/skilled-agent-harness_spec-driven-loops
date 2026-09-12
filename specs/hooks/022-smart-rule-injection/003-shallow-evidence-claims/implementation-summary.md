---
title: "Implementation Summary: Shallow evidence claims research"
description: "Closeout record for the evidence research round: the criterion, the four shapes, and the in-place amendment of the boundary row plus its mirror."
trigger_phrases:
  - "shallow evidence claims closeout"
  - "evidence criterion closeout"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/003-shallow-evidence-claims"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Phase 3 closed: criterion shipped on the boundary row and its mirror"
    next_safe_action: "Land the two shared-table promotions together"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: Shallow evidence claims research

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-shallow-evidence-claims |
| **Status** | Complete |
| **Completed** | 2026-09-12 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The confident claim now has a test attached to it. Five false claims from one session were replayed, the receipt behind each was re-read for what it actually showed, and the five collapses reduce to one criterion that shipped into the always-loaded standards and the evidence rule. Nothing was added beside the boundary: the criterion amends the row that already owns it.

### The Criterion

A receipt confirms a claim only if the claim being false would have changed what the receipt showed. A reading that comes out the same either way is inference, and an inferred claim has to say what would confirm it.

### The Four Shapes

A search that never hit, a read that stopped short, a total carried from another analysis, and a match that never checked what the two sides were. Each one produces the same failure — a confident claim resting on a receipt that could not have disconfirmed it.

### The Landing Sites

The boundary row in the four-standards table carries the criterion, and the evidence rule's tier mirror carries the same wording so the two tiers cannot drift. The self-lens clause's promotion targets that same table, so both promotions are recorded as landing deliberately together.

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ten research iterations ran on DeepSeek V4.1 Flash at max thinking through `cli-pi` with no early convergence. The five claims were replayed against their receipts, the counterfactual test was applied to each, and the shapes were extracted from the replay rather than from a taxonomy. The fix was placed on the existing boundary row plus its tier mirror, and the line-identical region was re-checked across the other two repositories rather than trusted to the share.

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Amend the boundary row instead of adding a row | The boundary already has an owner; a second row would disagree with it |
| Mirror the criterion in the evidence rule | Two tiers reading the same boundary drift unless both carry the wording |
| Coordinate the two promotions into the shared table | The self-lens clause lands in the same table, so order matters |
| Edit or confirm each repository that carries the region | The region is line-identical today, so a partial edit leaves a copy behind |
| Record the sentinel mis-fire as a finding | It is fail-open and advisory by design, so it is not a defect of this work |

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Counterfactual test | Applied to all `5` claims; each is caught by the criterion |
| Shapes | `4` patterns extracted from the replay, each with its claim class |
| Landing | Row `1` of the four-standards table amended; no new row and no new rule file |
| Mirror | The same criterion recorded for the evidence rule's tier mirror |
| Propagation | The shared region re-checked in the other two repositories |

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. The shared-table promotion of the delegation self-lens is recorded and coordinated, but it is an operator decision and not landed by this phase.
2. Propagation depends on the edit-or-confirm step in the other two repositories; the region is line-identical today, not shared by construction.
3. The completion sentinel still mis-fires on read-only prose; it is advisory by design, so the finding is recorded rather than fixed.

<!-- /ANCHOR:limitations -->
