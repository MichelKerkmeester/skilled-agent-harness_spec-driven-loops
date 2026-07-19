---
title: "Session state hierarchy"
description: "Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids."
trigger_phrases:
  - "session state hierarchy"
  - "session-state-hierarchy.cjs"
  - "create session topic round state"
  - "topic-nnn-slug round-nnn ids"
  - "council session shape validation"
version: 1.4.0.4
---

# Session state hierarchy

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids.

This feature belongs to the council group and is catalogued as F022 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Three-level hierarchy: session contains N topics; each topic contains N rounds; each round contains N seat outputs. Topic ids use stable `topic-NNN-slug` form (3-digit numeric + dash + lowercase-kebab slug); round ids use `round-NNN`. Validator rejects malformed ids, duplicate slugs within a session, and out-of-order round numbering. Schema-conformant state hands off to round-state-jsonl for persistence.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/council/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/council/session-state-hierarchy.cjs` | Runtime | 3-level session/topic/round state constructor + validator with stable ids. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/council/session-state-hierarchy.vitest.ts` | Test | Primary regression coverage for Session state hierarchy. |

---

## 4. SOURCE METADATA

- Group: Council
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F022
- Feature file path: `council/session-state-hierarchy.md`
- Primary sources: `lib/council/session-state-hierarchy.cjs`, `tests/council/session-state-hierarchy.vitest.ts`
Related references:
- [cost-guards.md](../../feature-catalog/council/cost-guards.md) — Cost guards
