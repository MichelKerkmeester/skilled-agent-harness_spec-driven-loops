---
title: "Tasks: Deep Loop Fan-out Determinism + Observability"
description: "Task breakdown for the deep-loop fan-out determinism + observability sub-phase: the three shipped Wave-0 trio candidates (pre-checked with commit 46812f12a8 — deterministic merge total-order, read-derived pool gauges, graceful self-stop) plus the implemented Wave-1 tail (arrival-order/order-invariance tests and default-off near-duplicate merge dedup on both the research and review merge paths), plus verification and Level-2 documentation closeout."
trigger_phrases:
  - "tasks fanout determinism observability"
  - "order invariance property test task breakdown"
  - "near-dup merge dedup tasks"
  - "028 deep-loop determinism tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/002-fanout-determinism-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked implemented Wave-1 tail tasks with verification evidence"
    next_safe_action: "Run strict packet validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-fanout-determinism-observability"
      parent_session_id: null
    completion_pct: 100
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
| `[ ]` | Pending |
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

> Wave-1 tail implemented locally: the order-invariance property tests plus the default-off near-duplicate merge dedup across research and review paths.

- [x] T004 DL-arrival-order-property-test — added research and review property tests that run merges under multiple lineage-order permutations and assert byte-identical merged registries; sorted label dirs and merged metadata arrays close the arrival-order seam in full-registry output [Done locally; evidence: `fanout-merge.vitest.ts`, `npx vitest run ../../deep-loop-runtime/tests/unit --reporter=dot` → 34 files / 343 tests passed].
- [x] T005 DL-near-dup-merge-dedup (research merge) — added default-off normalized-body-content collapse in the research merge, available via `enableNearDuplicateDedup`, `--enable-near-duplicate-dedup`, or `SPECKIT_FANOUT_NEAR_DUP_DEDUP`; distinct same-id different-content records remain conflict variants [Done locally, default-off; evidence: research restatement-collapse + distinct-content tests].
- [x] T006 DL-near-dup-merge-dedup (review merge) — applied the same default-off collapse to review open and resolved findings, preserving strongest-severity survivor selection and distinct-content conflict variants [Done locally, default-off; evidence: review open, review distinct-content, and review resolved variant tests].
- [x] T007 Re-run the order-invariance property test after the near-dup dedup landed — the broad deep-loop-runtime unit suite reran after T005/T006 and passed [Done; evidence: 34 files / 343 tests passed].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-confirm the shipped trio against `030` section 14 candidate 12 (`46812f12a8`) and current source: `compareByContentThenId` at the three merge sorts, `buildPoolGauges` lag/pending/failed, empty-tick=convergence + `stopped` flush.
- [x] T009 Record that this cluster is independent of the absent D2 reliability signal (every input `r=0.5`; keyed only on content text + read-derived pool counters) in `spec.md` + `plan.md`.
- [x] T010 Confirm the resilience cluster (failure-class taxonomy, transient/fatal retry, orphan reset, recover-vs-fresh gate) is recorded as belonging to the sibling `003-fanout-failure-recovery`, not silently merged into this cluster (`spec.md` section 3 Out of Scope).
- [x] T011 Confirm the out-of-scope residuals (D2/D3/Q2 reliability learning, newInfoRatio non-consumption, progress-heartbeat, the REFUTED preserve/recover galadriel candidates) are recorded as NO-GO/needs-benchmark/elsewhere, not silently dropped (`spec.md` section 3 Out of Scope).
- [x] T012 Author `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md` from the system-spec-kit Level-2 templates.
- [x] T013 Run `validate.sh --strict` on this sub-phase and fix structure issues.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 6 candidate rows have a final status in `spec.md` section 11 (3 Wave-0 DONE-with-commit, 3 local DONE rows — near-dup spans two merge-path rows of one candidate).
- [x] The shipped trio traces to Wave-0 commit `46812f12a8`.
- [x] Each former gated tail task names its implementation disposition; near-dup is implemented default-off because it can affect ranking/convergence.
- [x] The order-invariance property tests are built and assert byte-identical merges under shuffled lineage order; the near-dup dedup is built on both merge paths with content-normalization guards, and the order-invariance tests were rerun after it landed.
- [x] Strict validation passes for this sub-phase. Evidence: `validate.sh --strict` passed with 0 errors / 0 warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 11 candidate status.
- **Plan**: `plan.md`.
- **Implementation Summary**: `implementation-summary.md`.
- **Source research**: `../research/research.md`, `../research/iterations/iteration-011.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` + `04`.
- **Sibling sub-phase (resilience cluster, do not duplicate)**: `../003-fanout-failure-recovery/`.
- **Shipped predecessor (historical evidence)**: Wave-0 record.
<!-- /ANCHOR:cross-refs -->
