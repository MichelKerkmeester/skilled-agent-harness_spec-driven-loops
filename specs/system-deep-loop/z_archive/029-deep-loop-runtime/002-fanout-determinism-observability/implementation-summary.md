---
title: "Implementation Summary: Deep Loop Fan-out Determinism + Observability"
description: "Implementation summary for the deep-loop fan-out determinism + observability sub-phase: the Wave-0 trio (deterministic merge total-order, read-derived lag/pending/failed pool gauges, graceful self-stop) shipped in packet 030 (commit 46812f12a8) and re-confirmed against current source, plus the locally implemented Wave-1 tail (arrival-order/order-invariance tests and default-off near-duplicate merge dedup). No dependency on the absent D2 reliability signal."
trigger_phrases:
  - "implementation summary fanout determinism observability"
  - "merge total order pool gauges graceful self-stop shipped"
  - "order invariance property test near-dup dedup tail"
  - "028 deep-loop determinism impl summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/002-fanout-determinism-observability"
    last_updated_at: "2026-07-06T16:24:26.523Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wave-1 tail implemented"
    next_safe_action: "Run strict validation and mark tasks validation checkbox"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-fanout-determinism-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Lineage labels and merged metadata arrays are sorted to make full-registry order-invariance byte-stable."
      - "Near-duplicate dedup is implemented default-off behind an option, CLI flag and environment variable."
---
# Implementation Summary: Deep Loop Fan-out Determinism + Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-deep-loop/029-deep-loop-runtime/002-fanout-determinism-observability` |
| **Status** | complete |
| **Level** | 2 |
| **Actual Effort** | Trio shipped in Wave-0 (commit `46812f12a8`). Wave-1 tail with 9 new unit tests implemented locally, uncommitted per instruction (order-invariance tests, label/metadata sorting, default-off near-dup dedup) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop fan-out **determinism + observability** trio shipped in the flat Wave-0 implementation record (030, commit `46812f12a8`) and is the foundation already in place: the merge sorts its de-duplicated survivors with a hand-written content-then-id total comparator (`compareByContentThenId`, layered on the first-write-wins `id||title` dedup), the concurrent pool emits read-derived `lag`/`pending`/`failed` gauges (`buildPoolGauges`, no new state) and a SIGINT/SIGTERM during a long run flushes a `stopped` partial summary while an empty no-new-findings tick is valid convergence. This worktree now implements the Wave-1 tail: research and review order-invariance tests assert byte-identical merged registries across lineage-order permutations, `fanout-merge.cjs` sorts lineage labels and merged metadata arrays to close the full-registry arrival-order seam and a default-off near-duplicate dedup option collapses normalized body-content restatements across research, review open and review resolved findings.

Status detail: the sub-phase is complete. The 3 Wave-0 candidates shipped in packet 030 (commit `46812f12a8`) and the 3 Wave-1 rows are implemented locally in this worktree. The near-duplicate dedup ships default-off behind an explicit option, CLI flag and environment variable so default merge membership stays byte-compatible, and it is opt-in only because no candidate carries a measured before/after benchmark number. The resilience cluster and the D2/D3/Q2 reliability-learning cluster are recorded as out of scope (sibling sub-phase or NO-GO), not silently dropped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | Wave-0 comparator remains, Wave-1 adds deterministic label/metadata ordering and default-off normalized-body-content dedup |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified (Wave-0 `46812f12a8`) | `buildPoolGauges` read-derived `lag`/`pending`/`failed`, live per settle + final summary |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified (Wave-0 `46812f12a8`) | empty-tick=convergence + `stopped` partial-summary flush on SIGINT/SIGTERM |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified | Added 9 tests for order-invariance, default-off near-dup collapse, distinct-content survival and resolved review variants |
| `.opencode/specs/.../002-fanout-determinism-observability/{spec,plan,tasks,implementation-summary,checklist}.md` | Modified | Level-2 packet docs reconciled to 3 Wave-0 DONE rows plus 3 local Wave-1 DONE rows |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The trio was delivered in Wave-0 using the one-candidate-at-a-time method: a content-then-id total comparator was added (NOT a total order via `id` alone - `finding.id` is not always present, so the comparator layers on top of the `id||title` dedup), the pool gauges were read-derived from existing counters with no new state, the graceful self-stop added a `stopped` partial-summary flush and reclassified the empty no-new-findings tick as convergence. It was committed independently (`46812f12a8`) with `node --check` + 58 fanout tests + a mutation check. This Wave-1 tail was delivered by adding the missing order-invariance tests, sorting full-registry observability metadata and implementing a default-off normalized-body-content bucket index that preserves exact-key conflict behavior for distinct content. The cluster stayed disjoint from the sibling resilience sub-phase (`003-fanout-failure-recovery`) and from the D2 reliability-learning cluster.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Merge total-order is a comparator ON TOP of the `id||title` dedup, not a total order via `id` alone | `finding.id` is not always present, the pass-1 "SOLID total-order" billing was corrected to WEAKER - Wave-0 layered `compareByContentThenId` (content → id → full stringify) on the existing dedup (`roadmap.md:221`, `030` §14 cand 12) |
| The order-invariance property test needed a small production tightening | Full-registry byte identity includes `mergedFrom`, open/resolved questions and ruled-out directions, sorting those read-derived arrays closes the arrival-order seam rather than testing only a projection |
| The near-dup dedup is content-normalization-gated, never a blunt key change | Two distinct findings can share an `id||title`, collapsing on the key alone would drop one - collapse only on normalized body content, keep both when content differs |
| Keep near-dup default-off | It changes merge membership and can affect downstream ranking/convergence signals, so default behavior remains byte-compatible unless explicitly enabled |
| Keep the resilience cluster out (sibling sub-phase) | failure-class/retry/orphan/recover-vs-fresh are a different cluster shipped/scoped elsewhere, the trio's failure-class sibling is upstream in fanout-run, not the pool (`030` §14 cand 12, `synthesis/01:95`) |
| No dependency on D2 reliability | Every input is `r=0.5` today, the cluster is keyed only on content text + read-derived pool counters (`roadmap.md:216`, iter-13) |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Baseline typecheck | Pass | system-spec-kit workspace | `npm run typecheck` → 0 errors before edits |
| Baseline broad unit suite | Pass | deep-loop-runtime unit tests | 34 files / 334 tests passed before edits |
| Syntax | Pass | touched CJS script | `node --check .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` |
| Comment hygiene | Pass | touched code/test files | `check-comment-hygiene.sh` returned 0 violations |
| Targeted merge tests | Pass | touched merge suite | `fanout-merge.vitest.ts` → 27 tests passed |
| Final typecheck | Pass | system-spec-kit workspace | `npm run typecheck` → 0 errors after edits |
| Final broad unit suite | Pass | deep-loop-runtime unit tests | 34 files / 343 tests passed after edits |
| Strict packet validation | Pass | This sub-phase | `validate.sh --strict` → 0 errors / 0 warnings |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| `fanout-merge.cjs` / `fanout-pool.cjs` / `fanout-run.cjs` (trio paths) | Covered by the Wave-0 fan-out suite and final broad unit suite | Covered | Covered |
| order-invariance property test / near-dup dedup | Covered by 9 new unit tests | Covered | Covered |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Merge output reproducible across runs via a hand-written total comparator (not JS `(a,b)=>b-a`) | `compareByContentThenId` remains total, order-invariance tests now verify byte-identical research/review registries across lineage permutations | Pass |
| NFR-R02 | The near-dup dedup never drops a finding whose content differs | Default-off content-normalized collapse keeps same-id different-content records as conflict variants, tests cover research and review | Pass |
| NFR-O01 | Low-cardinality read-derived pool gauges, no new background state | `buildPoolGauges` lag/pending/failed read over existing counters, shipped Wave-0 | Pass |
| NFR-C01 | No schema migration / no new daemon, runtime stays fire-and-exit batch | Trio is in-place, the tail is an additive test + a content-normalization in existing merge maps | Pass |
| NFR-C02 | No new dependency on the absent D2/reliability signal | Cluster keyed only on content text + read-derived pool counters | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No measured benefit number** - every leverage/effort rating is structural inference, there is no before/after delta for the near-dup dedup's effect on `sourceDiversity` (`roadmap.md` §6, `synthesis/03` §B).
2. **The near-dup dedup changes merge membership when enabled** - it remains default-off until a caller deliberately opts in with the option, CLI flag or environment variable.
3. **No live benchmark or reindex was run** - per instruction, verification stayed at code, typecheck and unit-test level.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Property test as no-production-code change | Added tests plus deterministic label/metadata sorting | Full-registry byte identity includes observability arrays, sorting them is the smallest code change that makes the property real instead of projection-only |
| Near-dup dedup as always-on content collapse | Implemented default-off | It changes merge membership and can affect ranking/convergence signals, so it follows the default-off flag rule |
| Treat the merge total-order as a pure total-order win | Recorded it as a total-order comparator ON TOP of the `id||title` dedup | `finding.id` is not always present, the pass-1 "SOLID total-order" billing was corrected to WEAKER (`roadmap.md:221`) |
| Treat near-dup dedup as a one-path change | Recorded it across both the research and review merge paths | The exact-key dedup is duplicated in `findingById` (research) and `findingById`/`resolvedFindingById` (review), one design, two maps |

<!-- /ANCHOR:deviations -->
