---
title: "Implementation Plan: Deep Loop Fan-out Determinism + Observability"
description: "Plan for the deep-loop fan-out determinism + observability sub-phase: the shipped Wave-0 trio (deterministic merge total-order, read-derived lag/pending/failed pool gauges, graceful self-stop, commit 46812f12a8) recorded as DONE, plus the locally implemented Wave-1 tail, the arrival-order/order-invariance property tests and the default-off near-duplicate merge dedup on both the research and review merge paths, with no schema migration and no dependency on the absent D2 reliability signal."
trigger_phrases:
  - "fanout determinism observability plan"
  - "order invariance property test sequencing"
  - "near-dup merge dedup plan"
  - "028 deep-loop determinism impl"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/002-fanout-determinism-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Updated plan for implemented order-invariance tests and default-off near-duplicate dedup"
    next_safe_action: "Run strict validation after packet doc reconciliation"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../research/research.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-fanout-determinism-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Loop Fan-out Determinism + Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), deep-loop-runtime fan-out scripts |
| **Runtime shape** | Fire-and-exit BATCH orchestrator (`fanout-run.cjs` `process.exit` per run), NOT a daemon [CONFIRMED iter-12] |
| **Storage** | Per-lineage JSONL registries re-read per merge (externalized working set), `orchestration-status.log` ledger, no DB schema |
| **Testing** | deep-loop-runtime vitest (`tests/unit/fanout-merge.vitest.ts`, `fanout-pool.vitest.ts`, `fanout-run.vitest.ts`), `node --check` on touched `.cjs`, `validate.sh --strict` |

### Overview
This sub-phase records the deep-loop fan-out **determinism + observability** trio that shipped in the flat Wave-0 implementation record (030, commit `46812f12a8`) and completes its gated Wave-1 tail. The trio, the deterministic merge total-order (`compareByContentThenId` layered on the `id||title` first-write-wins dedup), the read-derived `lag`/`pending`/`failed` pool gauges (no new state) and graceful self-stop (`stopped` partial-summary flush on SIGINT/SIGTERM + empty-tick=convergence), is DONE and re-confirmed against current source. Two candidates remain: the **arrival-order/order-invariance property test** (the verification gate proving the shipped merge tiebreak is independent of the OS-arbitrary lineage arrival order from the unsorted `readdirSync(...).filter` at `fanout-merge.cjs:398`), and the **near-duplicate merge dedup** (collapse surface-variant findings by normalized content on both the research and review merge paths so restatements do not inflate the distinct-finding count feeding `sourceDiversity`).

The discipline is the one Wave-0 and the sibling sub-phases encode: ship only what is additive, deterministic and reversible. Reuse the existing content-normalization (`normalizeSortText`) rather than authoring a new dedup primitive. Make full-registry ordering deterministic where the verification gate needs byte-identical output. Keep the near-dup dedup default-off because it changes membership and can affect downstream ranking/convergence signals. Nothing here depends on the absent D2 reliability signal. Every input is `r=0.5` today and the cluster is keyed only on content text and read-derived pool counters.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 028 research treated as roadmap input, not implementation authority. Evidence: `spec.md` sections 2 and 11 cite `research.md` / `roadmap.md` / `synthesis` + the iter-11 property-test confirmation per candidate.
- [x] Scope limited to the fan-out merge/pool/run determinism + observability seam. The resilience cluster (failure-class/retry/orphan/recover-vs-fresh) is excluded to the sibling `003-fanout-failure-recovery`, and D2/D3/Q2 + newInfoRatio + heartbeat are excluded. Evidence: `spec.md` section 3 Out of Scope.
- [x] Candidate seams identified from `../research/research.md` + the roadmap/synthesis corrections (merge-tiebreak is total-order-ON-TOP-of-dedup not pure total-order. The property test is the one REAL galadriel survivor. The dedup keys exact `id||title`) before any edit.
- [x] Former pending candidates name a concrete implementation disposition (property-test done, near-dup done default-off). Evidence: `spec.md` section 11.

### Definition of Done
- [x] All 6 candidate rows have a final status (Wave-0 DONE-with-commit or local DONE-with-evidence). Evidence: `spec.md` section 11.
- [x] The shipped trio traces to Wave-0 commit `46812f12a8`.
- [x] The arrival-order/order-invariance property tests are built and assert byte-identical research and review merges under shuffled lineage arrival order.
- [x] The near-dup merge dedup is built on both the research and review merge paths with a content-normalization gate, default-off flagging and order-invariance coverage after the dedup landed.
- [x] Level-2 packet docs use the system-spec-kit templates and pass strict validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A set of determinism + observability improvements on the existing fan-out modules. No schema migration, no new daemon, no change to the fire-and-exit batch topology, no new edge type. The two tail items are an additive verification test (property test, no production code) and a conservative content-normalization in the existing merge dedup maps. The cluster reuses the shipped content-normalization keystone (`normalizeSortText`/`contentSortKey`) rather than forking a dedup primitive, and it does NOT touch the resilience cluster (failure-class/retry/orphan) which lives in the sibling sub-phase.

### Key Components
- **Deterministic merge total-order (shipped)**: `compareByContentThenId` + `sortByContentThenId` in `fanout-merge.cjs:142-163`, sorting on `contentSortKey` (normalized durable text: title/summary/description/finding/question/direction/severity/status joined), then a normalized id key, then a full stable stringify. Consumed at the research merge (`:198`), the review resolved/open merges (`:312`, `:314`). Layered ON TOP of the `id||title` first-write-wins dedup (`:187-198`), a total order, because `finding.id` is not always present.
- **Read-derived pool gauges (shipped)**: `buildPoolGauges({ total, settled, pending, failed })` in `fanout-pool.cjs:58-63` returns `lag = max(0, total-settled)`, `pending`, `failed`. Emitted live per settle (`:184-188`) and in the final summary (`:240-248`). No new state, pure read over the pool's existing counters.
- **Graceful self-stop (shipped)**: empty-tick=convergence at `fanout-run.cjs:490` (`{ status: 'converged', reason: 'empty_tick', no_new_findings: true }`). The `stopped` partial-summary flush at `:508-524` (idempotent via `stoppedSummaryWritten` at `:511`), wired to the SIGINT/SIGTERM handlers at `:66-76` (exit 130/143).
- **Order-invariance property test (tail)**: a new test alongside `tests/unit/fanout-merge.vitest.ts` that builds N lineage registries, runs the merge under multiple permutations of the lineage directory order (the merge reads them unsorted via `readdirSync(...).filter` at `:398`) and asserts the merged registry (membership, dedup survivor, final order, severity rollup) is byte-identical across permutations. No production-code change. It protects the shipped `compareByContentThenId` tiebreak from regression.
- **Near-dup merge dedup (tail)**: a content-normalized collapse in the merge dedup maps (research `findingById` at `:182-198` and review `findingById`/`resolvedFindingById` at `:272-314`) that merges records whose normalized content (`contentSortKey`/`normalizeSortText`) matches even when their `id||title` differs, so a surface-variant restatement does not survive as a distinct record. Conservative: collapse only on a content match, keep both when content differs.

### Data Flow
Each fan-out run dispatches N lineages through the capped pool (`runCappedPool`), which emits `started`/`completed`/`failed` events with the read-derived gauges and writes a final summary. On convergence (or an empty no-new-findings tick or a SIGINT/SIGTERM `stopped` flush) the merge reads every lineage's externalized JSONL registry (in OS-arbitrary order, `readdirSync(...).filter` at `:398`), de-duplicates first-write-wins on `id||title` and sorts the survivors with `compareByContentThenId` for a reproducible merged registry. Today the dedup is exact-key, so surface-variants survive and inflate the distinct count. After the near-dup dedup lands, content-matching variants collapse. The order-invariance property test asserts the whole pipeline (dedup survivor + final sort + severity rollup) is the same regardless of the lineage arrival order, and must be re-run after the dedup changes membership.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shipped trio (Wave-0 / packet 030, commit `46812f12a8`)
- [x] DL-merge-tiebreak - `compareByContentThenId` content-then-id total comparator on top of the `id||title` dedup. Consumed at the three merge sorts (`fanout-merge.cjs:198,312,314`). Reproducible across runs.
- [x] DL-pool-gauges - read-derived `lag`/`pending`/`failed` from `buildPoolGauges` (`fanout-pool.cjs:58-63`). Live per settle + final summary. No new state.
- [x] DL-graceful-self-stop - empty-tick=convergence (`fanout-run.cjs:490`) + `stopped` partial-summary flush on SIGINT/SIGTERM (`:508-524`).

### Phase 2: Order-invariance property test (DONE)
- [x] DL-arrival-order-property-test - tests run research and review merges under multiple lineage-order permutations and assert byte-identical merged registries. The implementation also sorts lineage labels and merged metadata arrays so byte-level observability is stable, not only finding order. Gate satisfied.

### Phase 3: Near-dup merge dedup (DONE, default-off)
- [x] DL-near-dup-merge-dedup (research merge) - default-off normalized-body-content collapse in the research merge so same-finding restatements can merge without changing default behavior. Distinct same-id different-content records remain conflict variants.
- [x] DL-near-dup-merge-dedup (review merge) - the same default-off collapse on review open and resolved findings. Active collapsed findings preserve strongest-severity semantics.
- [x] Re-run the order-invariance property tests after the dedup landed, covered by the broad deep-loop-runtime unit suite after implementation.

### Phase 4: Docs + verification
- [x] Author Level-2 packet docs from the system-spec-kit templates.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Every touched `.cjs` parses | `node --check` |
| Order-stability (shipped) | The trio: merge total-order, gauges, graceful self-stop | deep-loop-runtime vitest (58 fanout tests pass, mutation-checked, `46812f12a8`) |
| Order-invariance (tail) | Same lineages, shuffled arrival order ⇒ byte-identical merged registry (membership/dedup survivor/final order/severity rollup) | `fanout-merge.vitest.ts` research + review property tests |
| Near-dup dedup (tail) | Surface-variant restatement collapses when enabled. Two distinct findings sharing an `id||title` both survive | `fanout-merge.vitest.ts` research/review/resolved dedup tests |
| Regression | Full fan-out pool/run/merge suite green after any dedup change. Re-run order-invariance after the dedup changes membership | existing deep-loop-runtime suite (baseline captured first) |
| Packet docs | Level-2 structure, anchors, frontmatter, required files | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Wave-0 trio (`46812f12a8`) | Internal (shipped) | Green | The property test protects the shipped tiebreak. The near-dup dedup extends the shipped dedup |
| `normalizeSortText` / `contentSortKey` normalization (`fanout-merge.cjs:126-141`) | Internal (shipped) | Green | The near-dup dedup reuses this content basis. No new normalization primitive |
| `readdirSync(...).filter` unsorted lineage read (`fanout-merge.cjs:398`) | Internal | Green | The arrival-order surface the property test exercises |
| Sibling `003-fanout-failure-recovery` (resilience cluster) | Internal (sibling) | Independent | Disjoint cluster, failure-class/retry/orphan are NOT in this sub-phase. No shared seam beyond the same three files |
| D2 reliability signal | None | N/A | Cluster is explicitly independent, keyed only on content text + read-derived pool counters |

### Shared-infra note
The content-normalization basis (`normalizeSortText`/`contentSortKey`) the near-dup dedup reuses is the same determinism-spine shape Code Graph's content-derived tiebreak and Memory's C5-B content-hash tiebreak use (roadmap §4 "Total-comparator + content-derived-id module"). This sub-phase does NOT build a shared module, each subsystem's merge/dedup differs, but the hand-written-total-comparator discipline (JS `(a,b)=>b-a` is not a total order) is the common contract: the shipped `compareByContentThenId` already follows it, and the near-dup dedup must collapse only on a normalized-content match, never a blunt key change.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of three failures. The near-dup dedup drops a genuinely distinct finding that shares an `id||title`. The dedup re-orders or re-counts the merged registry and breaks the shipped trio tests. The property test reveals the shipped tiebreak is NOT order-invariant (a latent Wave-0 defect).
- **Procedure**: Each tail candidate is a separate scoped commit on the branch (never pushed to main without explicit go). `git revert` the offending candidate's commit. The property test is pure-additive (safe to revert with zero production impact). The near-dup dedup reverts to the exact `id||title` first-write-wins dedup. The shipped trio is `46812f12a8` and is not rolled back here.
- **Data reversal**: None, no candidate adds a schema migration or touches a write path beyond the in-memory merge maps and a JSONL registry re-read. Rollback is code + test revert only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Shipped trio (Phase 1) | Per-lineage externalized JSONL registries, the pool counters | The property test + the near-dup dedup |
| Order-invariance property test (Phase 2) | The shipped `compareByContentThenId` tiebreak | A regression guard on the merge determinism |
| Near-dup merge dedup (Phase 3) | The shipped `normalizeSortText`/`contentSortKey` normalization | A non-inflated `sourceDiversity` signal. Requires re-running Phase 2 |
| Docs + verification (Phase 4) | Shipped-commit evidence + gated tail | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Research effort tag | Note |
|-----------|---------------------|------|
| DL-merge-tiebreak | S | Shipped `46812f12a8`, total comparator on top of the dedup |
| DL-pool-gauges | S | Shipped `46812f12a8`, read-derived counters, no new state |
| DL-graceful-self-stop | S | Shipped `46812f12a8`, `stopped` flush + empty-tick=convergence |
| DL-arrival-order-property-test | S | Done, tests plus deterministic lineage/read metadata ordering |
| DL-near-dup-merge-dedup (research + review) | S | Done default-off, one normalized-body-content design across research, review open and review resolved maps |
| Docs + verification | M | Completed |

> Effort tags are structural inference, never benchmarked (per the 028 honesty layer). The cluster is Level 2 (100-499 LOC band) but each candidate is independently small. The risk on the near-dup dedup (never drop a distinct finding) is the reason for the content-normalization gate + the re-run of the order-invariance test, not LOC.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Candidate | Rollback |
|-----------|----------|
| DL-merge-tiebreak | Revert `46812f12a8` (restores the pre-Wave-0 merge order). Not rolled back here. |
| DL-pool-gauges | Revert `46812f12a8` (drops the read-derived gauges). Not rolled back here. |
| DL-graceful-self-stop | Revert `46812f12a8` (children die silently again, empty-tick reverts to failure). Not rolled back here. |
| DL-arrival-order-property-test | Revert the test additions and deterministic label/metadata sorting if full-registry order tightening causes unexpected consumer drift. |
| DL-near-dup-merge-dedup | Disable by default by leaving the flag unset. Full rollback removes the bucket-index option and restores exact `id||title` / `findingId||title` only. Re-run the fan-out suite after rollback. |
<!-- /ANCHOR:enhanced-rollback -->
