---
title: "Implementation Summary: Deep Loop Fan-out Determinism + Observability"
description: "Implementation summary for the deep-loop fan-out determinism + observability sub-phase: the Wave-0 trio (deterministic merge total-order, read-derived lag/pending/failed pool gauges, graceful self-stop) shipped in packet 030 (commit 46812f12a8) and re-confirmed against current source, plus the two gated PENDING tail items (the arrival-order/order-invariance property test and the near-duplicate merge dedup) recorded with their gates and not yet built. No dependency on the absent D2 reliability signal."
trigger_phrases:
  - "implementation summary fanout determinism observability"
  - "merge total order pool gauges graceful self-stop shipped"
  - "order invariance property test near-dup dedup tail"
  - "028 deep-loop determinism impl summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/002-fanout-determinism-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 impl-summary for the deep-loop fanout determinism + observability sub-phase"
    next_safe_action: "Author checklist.md, then run validate.sh --strict and fix any remaining structure issues"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-fanout-determinism-observability"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Sort the lineage directories at read time, or rely solely on compareByContentThenId post-merge, to protect the order-invariance property test from the unsorted readdirSync(...).filter at fanout-merge.cjs:398?"
    answered_questions: []
---
# Implementation Summary: Deep Loop Fan-out Determinism + Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/004-deep-loop/002-fanout-determinism-observability` |
| **Completed** | Partial — 3 of the cluster's candidates shipped (the Wave-0 trio); the 2 tail candidates (property test, near-dup dedup) are gated PENDING |
| **Level** | 2 |
| **Actual Effort** | Trio shipped in Wave-0 (commit `46812f12a8`); the order-invariance property test and the near-dup merge dedup not yet built (gated) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop fan-out **determinism + observability** trio shipped in the flat Wave-0 packet (030, commit `46812f12a8`) and is the foundation already in place: the merge now sorts its de-duplicated survivors with a hand-written content-then-id total comparator (`compareByContentThenId`, layered on the first-write-wins `id||title` dedup) so merged output is reproducible across runs; the concurrent pool emits read-derived `lag`/`pending`/`failed` gauges (`buildPoolGauges`, no new state) live per settle and in the final summary; and a SIGINT/SIGTERM during a long run flushes a `stopped` partial summary (idempotent) while an empty no-new-findings tick is treated as valid convergence rather than failure. Two candidates are **PENDING and not built** this sub-phase: the **arrival-order/order-invariance property test** (the verification gate that proves the shipped merge tiebreak is independent of the OS-arbitrary lineage arrival order from the unsorted `readdirSync(...).filter` at `fanout-merge.cjs:398`), and the **near-duplicate merge dedup** (a content-normalized collapse on the research and review merge paths so surface-variant restatements do not inflate the distinct-finding count feeding `sourceDiversity`). This sub-phase records the shipped trio with its commit evidence and carries the tail with explicit gates.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified (Wave-0 `46812f12a8`) | `compareByContentThenId` total comparator on top of the `id||title` dedup; consumed at the three merge sorts |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified (Wave-0 `46812f12a8`) | `buildPoolGauges` read-derived `lag`/`pending`/`failed`; live per settle + final summary |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified (Wave-0 `46812f12a8`) | empty-tick=convergence + `stopped` partial-summary flush on SIGINT/SIGTERM |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified (Wave-0) / Pending (tail) | Wave-0 trio tests; PENDING: the order-invariance property test + the near-dup dedup tests |
| `.opencode/specs/.../002-fanout-determinism-observability/{spec,plan,tasks,implementation-summary,checklist}.md` | Created (this sub-phase) | Level-2 packet docs recording 3 DONE + 2 PENDING-with-gate |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The trio was delivered in Wave-0 using the one-candidate-at-a-time method: a content-then-id total comparator was added (NOT a total order via `id` alone — `finding.id` is not always present, so the comparator layers on top of the `id||title` dedup); the pool gauges were read-derived from existing counters with no new state; the graceful self-stop added a `stopped` partial-summary flush and reclassified the empty no-new-findings tick as convergence. It was committed independently (`46812f12a8`) with `node --check` + 58 fanout tests + a mutation check. This sub-phase was delivered by reading the 028 research (`research.md` + the iter-11 property-test confirmation + `roadmap.md` BROADENING corrections + `synthesis/01`/`03`/`04`), grounding the trio against current source, mapping the two tail candidates to their merge-dedup and merge-read seams, recording the shipped predecessor with its commit and the tail with its gates (verification-gate / content-normalization-gated), and validating the Level-2 folder strict. The cluster was kept disjoint from the sibling resilience sub-phase (`003-fanout-failure-recovery`) and from the D2 reliability-learning cluster.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Merge total-order is a comparator ON TOP of the `id||title` dedup, not a total order via `id` alone | `finding.id` is not always present; the pass-1 "SOLID total-order" billing was corrected to WEAKER — Wave-0 layered `compareByContentThenId` (content → id → full stringify) on the existing dedup (`roadmap.md:221`; `030` §14 cand 12) |
| The order-invariance property test is a pure verification-gate addition, no production code | The merge reads lineages unsorted (`readdirSync(...).filter` at `:398`); the shipped tiebreak is *assumed* order-invariant but no test asserts it — the property test is the regression guard and the one REAL galadriel survivor (iter-11) |
| The near-dup dedup is content-normalization-gated, never a blunt key change | Two distinct findings can share an `id||title`; collapsing on the key alone would drop one — collapse ONLY on a normalized-content match (`contentSortKey`/`normalizeSortText`), keep both when content differs |
| Reuse the shipped `normalizeSortText`/`contentSortKey` for the dedup, don't fork | The normalization basis already exists (`fanout-merge.cjs:126-141`); the near-dup dedup is a content match over it, no new primitive |
| Keep the resilience cluster out (sibling sub-phase) | failure-class/retry/orphan/recover-vs-fresh are a different cluster shipped/scoped elsewhere; the trio's failure-class sibling is upstream in fanout-run, not the pool (`030` §14 cand 12; `synthesis/01:95`) |
| No dependency on D2 reliability | Every input is `r=0.5` today; the cluster is keyed only on content text + read-derived pool counters (`roadmap.md:216`; iter-13) |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Trio order-stability (shipped) | Pass | deep-loop-runtime fan-out suite | 58 fanout tests pass + mutation-checked incl. the merge total-order, gauges, and graceful-self-stop (`46812f12a8`) |
| Order-invariance property test | Not built | — | Gated: a test that shuffles the lineage arrival order and asserts a byte-identical merged registry; the verification gate on the shipped tiebreak |
| Near-dup merge dedup | Not built | — | Gated on a content-normalization decision; must collapse surface-variants and keep two distinct findings that share an `id||title`; re-run the order-invariance test after it lands |
| Strict packet validation | Pass | This sub-phase | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/002-fanout-determinism-observability --strict` |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| `fanout-merge.cjs` / `fanout-pool.cjs` / `fanout-run.cjs` (trio paths) | Covered by the Wave-0 fan-out suite | Covered | Covered |
| order-invariance property test / near-dup dedup | Not built | Not built | Not built |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Merge output reproducible across runs via a hand-written total comparator (not JS `(a,b)=>b-a`) | `compareByContentThenId` is total (content → id → full stringify); shipped Wave-0; the order-invariance property test is the pending guard | Pass (trio) / Pending (property-test guard) |
| NFR-R02 | The near-dup dedup never drops a finding whose content differs | Content-normalization-gated — collapse only on a normalized-content match; pending build | Pending |
| NFR-O01 | Low-cardinality read-derived pool gauges, no new background state | `buildPoolGauges` lag/pending/failed read over existing counters; shipped Wave-0 | Pass |
| NFR-C01 | No schema migration / no new daemon; runtime stays fire-and-exit batch | Trio is in-place; the tail is an additive test + a content-normalization in existing merge maps | Pass |
| NFR-C02 | No new dependency on the absent D2/reliability signal | Cluster keyed only on content text + read-derived pool counters | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The shipped tiebreak is order-invariant by construction but unproven by test** — the merge reads lineages unsorted (`:398`); the first-write-wins survivor still depends on arrival order when two records share a key, so the order-invariance the tiebreak should guarantee is asserted by no test until the property test (REQ-004) lands.
2. **No measured benefit number** — every leverage/effort rating is structural inference; there is no before/after delta for the near-dup dedup's effect on `sourceDiversity` (`roadmap.md` §6; `synthesis/03` §B).
3. **The near-dup dedup changes merge membership** — once built, REQ-004's order-invariance assertion must be re-run, because collapsing surface-variants changes the merged registry the property test compares.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Implement all the cluster's candidates | The trio shipped (Wave-0); the property test + near-dup dedup recorded PENDING | This is a planning-only re-plan; the tail is gated (verification-gate / content-normalization decision), neither built in this sub-phase |
| Treat the merge total-order as a pure total-order win | Recorded it as a total-order comparator ON TOP of the `id||title` dedup | `finding.id` is not always present; the pass-1 "SOLID total-order" billing was corrected to WEAKER (`roadmap.md:221`) |
| Treat near-dup dedup as a one-path change | Recorded it across both the research and review merge paths | The exact-key dedup is duplicated in `findingById` (research) and `findingById`/`resolvedFindingById` (review); one design, two maps |

<!-- /ANCHOR:deviations -->
