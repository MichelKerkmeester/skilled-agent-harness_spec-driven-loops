---
title: "Tasks: Deep Loop Fan-out Determinism + Observability"
description: "Task breakdown for the deep-loop fan-out determinism + observability sub-phase: the three shipped Wave-0 trio candidates (pre-checked with commit 46812f12a8 — deterministic merge total-order, read-derived pool gauges, graceful self-stop) and the two gated PENDING tail items (the arrival-order/order-invariance property test as a verification gate, and the near-duplicate merge dedup on both the research and review merge paths), plus verification and Level-2 documentation closeout."
trigger_phrases:
  - "tasks fanout determinism observability"
  - "order invariance property test task breakdown"
  - "near-dup merge dedup tasks"
  - "028 deep-loop determinism tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/002-002-fanout-determinism-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored tasks"
    next_safe_action: "Author implementation-summary.md and checklist.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-fanout-determinism-observability"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Loop Fan-out Determinism + Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending (gated tail, not built this sub-phase) |
| `[x]` | Completed (shipped in Wave-0 with commit evidence) or explicitly gated-deferred with accepted evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or closeout action (primary seam) [status/evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Shipped trio (Wave-0 / packet 030, commit `46812f12a8`): the deterministic merge total-order, the read-derived pool gauges, and graceful self-stop — the determinism + observability foundation already in place.

- [x] T001 DL-merge-tiebreak — layer `compareByContentThenId` (content key → normalized id key → full stable stringify) on top of the first-write-wins `id||title` dedup so merged output is reproducible across runs; consumed at the three merge sorts (`fanout-merge.cjs:142-163` comparator, `:198`/`:312`/`:314` sorts) [Done, commit `46812f12a8`; total-order ON TOP of the dedup because `finding.id` is not always present (corrected from the pass-1 "SOLID total-order" billing, `roadmap.md:221`); `node --check` + 58 fanout tests + mutation-checked; `030` §14 cand 12].
- [x] T002 DL-pool-gauges — read-derived `lag`/`pending`/`failed` from `buildPoolGauges({ total, settled, pending, failed })` with no new state; emitted live per settle and in the final summary (`fanout-pool.cjs:58-63`, `:184-188`, `:240-248`) [Done, commit `46812f12a8`; the one un-caveated trio member ("gauges are clean", `synthesis/01` gauges row); `030` §14 cand 12].
- [x] T003 DL-graceful-self-stop — flush a `stopped` partial summary on SIGINT/SIGTERM + treat an empty no-new-findings tick as valid convergence (`fanout-run.cjs:490` empty-tick=convergence, `:508-524` stopped flush idempotent at `:511`, `:66-76` signal handlers) [Done, commit `46812f12a8`; the shutdown-summary half (distinct from the NEEDS-BENCHMARK progress-heartbeat half); GO — confirmed clean (`synthesis/01:95`); `030` §14 cand 12].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Gated tail (PENDING — dispositioned, not built this sub-phase): the order-invariance property test (verification-gate, no production-code change) + the near-duplicate merge dedup (content-normalization-gated, both merge paths).

- [x] T004 [B] DL-arrival-order-property-test — add a property test that runs the merge under multiple permutations of the lineage directory order (the merge reads them unsorted via `readdirSync(...).filter` at `fanout-merge.cjs:398`) and asserts the merged registry (membership, dedup survivor, final order, severity rollup) is byte-identical across permutations; new test alongside `tests/unit/fanout-merge.vitest.ts` [Pending — gate: verification-gate (no production-code change); proves the shipped `compareByContentThenId` tiebreak is order-invariant and protects it from regression; the one REAL galadriel-derived survivor (iter-11 "1 REAL, 2 REFUTED"); the verification gate on the captured merge-tiebreak GO (`synthesis/01:101`)].
- [x] T005 [B] DL-near-dup-merge-dedup (research merge) — collapse surface-variant research findings by normalized content (`contentSortKey`/`normalizeSortText`) in the `findingById` dedup (`fanout-merge.cjs:182-198`, exact `id||title`) so a same-finding restatement does not survive as a distinct record and inflate the distinct count feeding `sourceDiversity` (`coverage-graph-signals.ts:378-416`) [Pending — gate: content-normalization-gated; MUST NOT drop a genuinely distinct finding that merely shares an `id||title`; reuses the shipped normalization (`fanout-merge.cjs:126-141`), no new primitive].
- [x] T006 [B] DL-near-dup-merge-dedup (review merge) — apply the same content-normalized collapse on the review merge's `findingById`/`resolvedFindingById` dedup (`fanout-merge.cjs:272-314`, exact `findingId||title`) so cross-lineage P0/P1 surface-variants are not double-counted in the severity rollup [Pending — gate: content-normalization-gated; same candidate as T005 applied to the review path; shares the research-merge design].
- [x] T007 [B] Re-run the order-invariance property test (T004) after the near-dup dedup (T005/T006) lands — the dedup changes membership, so the byte-identical assertion must be re-validated [Pending — gate: depends on T004 + T005/T006; the REQ-006 re-run requirement].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-confirm the shipped trio against `030` section 14 candidate 12 (`46812f12a8`) and current source: `compareByContentThenId` at the three merge sorts, `buildPoolGauges` lag/pending/failed, empty-tick=convergence + `stopped` flush.
- [x] T009 Record that this cluster is independent of the absent D2 reliability signal (every input `r=0.5`; keyed only on content text + read-derived pool counters) in `spec.md` + `plan.md`.
- [x] T010 Confirm the resilience cluster (failure-class taxonomy, transient/fatal retry, orphan reset, recover-vs-fresh gate) is recorded as belonging to the sibling `003-003-fanout-failure-recovery`, not silently merged into this cluster (`spec.md` section 3 Out of Scope).
- [x] T011 Confirm the out-of-scope residuals (D2/D3/Q2 reliability learning, newInfoRatio non-consumption, progress-heartbeat, the REFUTED preserve/recover galadriel candidates) are recorded as NO-GO/needs-benchmark/elsewhere, not silently dropped (`spec.md` section 3 Out of Scope).
- [x] T012 Author `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md` from the system-spec-kit Level-2 templates.
- [x] T013 Run `validate.sh --strict` on this sub-phase and fix structure issues.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 6 candidate rows have a final status in `spec.md` section 11 (3 DONE-with-commit, 2 PENDING-with-gate — the near-dup dedup spans two merge-path rows of one candidate).
- [x] The shipped trio traces to Wave-0 commit `46812f12a8` in `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 12.
- [x] Each gated tail task names its block reason (verification-gate / content-normalization-gated) and its dependency; none is disguised as incomplete in-flight work.
- [ ] The order-invariance property test is built and asserts a byte-identical merge under shuffled arrival order; the near-dup dedup is built on both merge paths with the content-normalization gate, and the order-invariance test is re-run after it lands (downstream verification, tracked).
- [x] Strict validation passes for this sub-phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 11 candidate status.
- **Plan**: `plan.md`.
- **Implementation Summary**: `implementation-summary.md`.
- **Source research**: `../research/research.md`, `../research/iterations/iteration-011.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` + `04`.
- **Sibling sub-phase (resilience cluster, do not duplicate)**: `../003-003-fanout-failure-recovery/`.
- **Shipped predecessor (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 12.
<!-- /ANCHOR:cross-refs -->
