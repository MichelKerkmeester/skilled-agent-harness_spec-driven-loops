---
title: "Round-state JSONL"
description: "Appends per-round JSONL records with a lock-file single-writer guard; repairs corrupt trailing JSONL before append; fsyncs writes; exposes round-state readers for resume."
trigger_phrases:
  - "round-state jsonl"
  - "round-state-jsonl.cjs"
  - "append round state"
  - "lock-guarded jsonl append"
  - "council round persistence"
version: 1.4.0.4
---

# Round-state JSONL

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Appends per-round JSONL records with a lock-file single-writer guard; repairs corrupt trailing JSONL before append; fsyncs writes; exposes round-state readers for resume.

This feature belongs to the council group and is catalogued as F019 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Single-writer guard via lockfile in the round's state directory. Before any append, the trailing JSONL is repaired (corrupt last line dropped or recovered per `jsonl-repair` semantics). fsync after every append ensures durability on crash. Reader API returns parsed round state for resume scenarios.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/council/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/council/round-state-jsonl.cjs` | Runtime | Lock-guarded JSONL append + repair + fsync + reader API. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/council/round-state-jsonl.vitest.ts` | Test | Primary regression coverage for Round-state JSONL. |

---

## 4. SOURCE METADATA

- Group: Council
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F019
- Feature file path: `council/round-state-jsonl.md`
- Primary sources: `lib/council/round-state-jsonl.cjs`, `tests/council/round-state-jsonl.vitest.ts`
Related references:
- [multi-seat-dispatch.md](multi_seat_dispatch.md) — Multi-seat dispatch
- [adjudicator-verdict-scoring.md](adjudicator_verdict_scoring.md) — Adjudicator verdict scoring
