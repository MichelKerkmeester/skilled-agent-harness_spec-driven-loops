---
title: "Cost guards"
description: "Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, max_topics_per_session, saturation_threshold, and seats_per_round; computes upper-bound seat-output budgets."
trigger_phrases:
  - "cost guards"
  - "cost-guards.cjs"
  - "enforce session caps"
  - "seat-output budget"
  - "saturation threshold enforcement"
version: 1.4.0.4
---

# Cost guards

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, max_topics_per_session, saturation_threshold, and seats_per_round; computes upper-bound seat-output budgets.

This feature belongs to the council group and is catalogued as F021 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

ADR-004 default normalization at session start: max_rounds_per_topic (default 5), max_topics_per_session (default 8), saturation_threshold (default 0.85), seats_per_round (default 3). Upper-bound seat-output budget = seats_per_round × max_rounds_per_topic × max_topics_per_session × avg_seat_output_chars. Guards reject session configs that exceed any cap; runtime aborts on threshold breach.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/council/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/council/cost-guards.cjs` | Runtime | ADR-004 default normalizer + cap enforcer + budget calculator. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/council/cost-guards.vitest.ts` | Test | Primary regression coverage for Cost guards. |

---

## 4. SOURCE METADATA

- Group: Council
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F021
- Feature file path: `council/cost-guards.md`
- Primary sources: `lib/council/cost-guards.cjs`, `tests/council/cost-guards.vitest.ts`
Related references:
- [adjudicator-verdict-scoring.md](adjudicator_verdict_scoring.md) — Adjudicator verdict scoring
- [session-state-hierarchy.md](session_state_hierarchy.md) — Session state hierarchy
