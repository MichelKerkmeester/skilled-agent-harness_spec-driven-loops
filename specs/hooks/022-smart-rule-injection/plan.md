---
title: "Implementation Plan: Smart rule injection via hooks"
description: "Plan for the packet's three research lineages and its synthesis: what prompt-time and event-keyed injection refuse, and which evidence fix lands instead."
trigger_phrases:
  - "smart rule injection plan"
  - "three injection research lineages"
  - "refusal and admission ledger"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Plan executed: three lineages closed, decision record written"
    next_safe_action: "Land the two shared-table promotions together"
    blockers: []
    key_files:
      - "spec.md"
      - "decisions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Smart rule injection via hooks

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Documentation and evidence; the only runtime-touching fix is a transport repair already shipped |
| **Structure** | Three research phase children under this parent, ten iterations each |
| **Driver** | DeepSeek V4.1 Flash at max thinking through `cli-pi` |
| **Evidence** | A citation per claim; every refusal names the test that produced it |

### Overview

The packet answers one question twice and then a third time. Phase 1 asks whether rules should be injected at prompt time, keyed on what the user typed. Phase 2 asks what to inject at an event, keyed on what just happened. Phase 3 asks what would reduce confident-but-unsupported claims, and lands the one fix the repository admitted. The synthesis carries the refused set, the admitted fixes, the two closed items, and the standing fleet-wide finding into the decision record.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [x] Three lineages closed with ten iterations each and no early convergence.
- [x] Every refusal recorded with the test that produced it.
- [x] Admitted fixes landed where an existing row or envelope already owns the behavior.
- [x] The standing finding stated once, as a pattern rather than as small bugs.

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One bar, applied from three directions. A rule earns an injection slot only by naming a specific prohibition a gate enforces; an event earns a trigger only when it reaches rules and its frequency is read from its log; a claim earns confidence only when a false claim would have changed what the receipt showed.

### Key Components

- **The bar** (phase 1): the prompt-time slot test, and the refusal set it produced.
- **The measurement rule** (phase 2): an event's frequency comes from its state log, never from reasoning about its shape.
- **The criterion** (phase 3): the counterfactual test on a receipt, landed on the boundary row that already owns it.
- **The synthesis**: `decisions.md`, carrying the refusals, the admissions, the closed items, and the standing finding.

### Data Flow

Each child runs its own iterations, records refusals and admissions, and hands the parent one line per outcome. The parent folds the three lineages into the decision record, names the coordinated promotions into the shared table, and leaves the operator-owned promotion as a decision rather than a build step.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Frame
- [x] Scaffold the packet and name the prompt-keyed question for `001-deep-research`.

### Phase 2: Prompt-keyed lineage
- [x] Test eighteen candidates against the injection bar and record the refusals.

### Phase 3: Event-keyed lineage
- [x] Refuse both operator ideas structurally and measure the strongest new candidate.

### Phase 4: Evidence lineage
- [x] Diagnose five false confident claims and land the criterion on the boundary row.

### Phase 5: Synthesis
- [x] Fold the three lineages into the decision record and state the standing finding.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Rule |
|-------|-------|------|
| Refusal | Every refused candidate | The deciding test is stated, not implied |
| Measurement | Every frequency claim | The rate is read from a state log |
| Counterfactual | Every cited receipt | State what the receipt would have shown had the claim been false |
| Landing | Every admitted fix | The change amends the row or envelope that already owns the behavior |
| Synthesis | The decision record | No claim rests on a reading that would look the same if it were false |

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The gate corpus and the resident-layer document | Internal | Green | The prompt-time bar cannot be applied without both texts |
| Event state logs | Internal | Green | No measured rate, so no event candidate survives on rarity |
| The four-standards table and its tier mirror | Internal | Green | The evidence criterion has nowhere to land |
| The other two repositories that share the region | Internal | Yellow | A partial edit leaves one copy behind |

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A refused candidate is shown to name a gate prohibition, or the amended boundary row over-blocks.
- **Procedure**: No hook was built. Revert the boundary row and its tier mirror to their previous wording, re-open the affected refusal record, and restate the finding in the decision record. The sentinel's shipped behavior is untouched.

<!-- /ANCHOR:rollback -->

## RELATED DOCUMENTS

- **Specification:** `spec.md`
- **Tasks:** `tasks.md`
- **Decision record:** `decisions.md`
