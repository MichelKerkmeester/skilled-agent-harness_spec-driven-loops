---
title: "Feature Specification: Deep Loop Fan-out Determinism + Observability (028/004 determinism cluster)"
description: "Record and complete the deep-loop fan-out determinism + observability cluster: the deterministic merge total-order, the read-derived lag/pending/failed pool gauges, and graceful self-stop (stopped marker + empty-tick=convergence) all SHIPPED in Wave-0 (packet 030, commit 46812f12a8); the order-invariance property test (the verification gate proving the shipped tiebreak is arrival-order-independent) and the near-duplicate merge dedup (exact id||title dedup lets surface-variants inflate distinct counts / sourceDiversity) remain as the gated Wave-1 tail. No dependency on the absent D2 reliability signal."
trigger_phrases:
  - "fanout determinism observability"
  - "deterministic merge total order"
  - "pool gauges lag pending failed"
  - "graceful self stop empty tick"
  - "order invariance property test"
  - "near-dup merge dedup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/002-fanout-determinism-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec"
    next_safe_action: "Author plan.md sequencing the shipped trio vs the PENDING property test + near-dup dedup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-fanout-determinism-observability"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Which content-derived key best protects the order-invariance property test from the unsorted readdirSync(...).filter at fanout-merge.cjs:398 — sort the label dirs at read time, or rely solely on compareByContentThenId post-merge?"
      - "Should near-dup merge dedup collapse surface-variants by normalized content (the normalizeSortText body) or only de-weight them in the sourceDiversity count, given a too-aggressive merge could drop a genuinely distinct finding that shares an id||title?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Deep Loop Fan-out Determinism + Observability (028/004 determinism cluster)

## EXECUTIVE SUMMARY

This sub-phase records the deep-loop fan-out **determinism + observability** cluster — the fan-out-layer group touching `fanout-merge.cjs` / `fanout-pool.cjs` / `fanout-run.cjs` — and completes its gated Wave-1 tail. Three candidates already **shipped** in the flat Wave-0 packet (030, commit `46812f12a8`): the **deterministic merge total-order** (a hand-written `compareByContentThenId` content-then-id total comparator layered on top of the first-write-wins `id||title` dedup), the **read-derived pool gauges** (`lag`/`pending`/`failed`, computed from the pool's `total`/`settled`/`pending`/`failed` counters with no new state), and **graceful self-stop** (a `stopped` partial-summary flush on SIGINT/SIGTERM plus treating an empty no-new-findings tick as valid convergence rather than failure). Two candidates remain **PENDING** as the Wave-1 tail: the **order-invariance property test** — the verification gate that proves the shipped merge tiebreak is independent of the arrival order of the lineage directories (the merge reads `readdirSync(...).filter` with no `.sort()` at `fanout-merge.cjs:398`, so order-invariance is a *property the tiebreak must guarantee but no test asserts*), and the **near-duplicate merge dedup** — the shipped dedup keys on exact `id||title` (`fanout-merge.cjs:187`), so two surface-variant findings (same finding, differently-worded title, or distinct synthetic ids) escape dedup and inflate the distinct-finding count that feeds `sourceDiversity`.

**Key Decisions**: Record-don't-rebuild — the trio shipped in Wave-0 and is re-confirmed here against current source and `030` §14 candidate 12, not re-implemented. The two tail items are kept as gated PENDING work: the property test is a verification-gate addition (no production-code change, protects the shipped tiebreak), and the near-dup dedup is a content-normalization addition (it must NOT drop a genuinely distinct finding that merely shares an `id||title`, so it is content-normalization-gated, not a blunt key change).

**Critical context**: This cluster is **independent of the absent D2 reliability signal** — every input is `r=0.5` today, and nothing here reads or writes `metadata.reliability`. It is pure determinism/observability over the fan-out merge + pool, keyed only on content text and read-derived counters. No candidate in the 200-iteration campaign has a measured before/after number; ship for correctness, reproducibility, and reversibility, not a promised delta.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent research phase** | `028-memory-search-intelligence/004-deep-loop` (Deep Loop — convergence/fan-out/council intelligence) |
| **Source research** | `../research/research.md`; `../../research/roadmap.md`; `../../research/synthesis/01-go-candidates.md` + `03` + `04` |
| **Shipped predecessor** | `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 12 (Deep-Loop trio + graceful-self-stop, commit `46812f12a8`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop fan-out runtime merges per-lineage finding registries and pools concurrent CLI lineages on three modules — `fanout-merge.cjs` (merge + dedup), `fanout-pool.cjs` (concurrent dispatch + gauges + summary), and `fanout-run.cjs` (the lineage worker + signal handling). Before Wave-0 the merge output order was **not reproducible** (the merge read lineage directories in OS-arbitrary order and de-duplicated first-write-wins without a total-order tiebreak), the pool exposed **no live gauges** (failure/pending/lag were only available post-run from the orchestration ledger), and a SIGINT/SIGTERM on a long run **killed children silently** with no partial summary while an empty no-new-findings tick was treated as a *failure* rather than valid convergence. Wave-0 shipped the fixes for all three (commit `46812f12a8`), but left two correctness/verification gaps in the determinism cluster:

1. **The shipped merge tiebreak has no order-invariance test.** `compareByContentThenId` (`fanout-merge.cjs`) is a hand-written content-then-id total comparator consumed at the three merge sorts (`:198`, `:312`, `:314`) — but the merge still reads its lineage directories via `readdirSync(lineagesDir).filter(...)` with **no `.sort()`** at `fanout-merge.cjs:398`, so the *dedup* (first-write-wins on `id||title`) sees lineages in arbitrary OS order even though the final sort is total. The order-invariance the tiebreak is supposed to guarantee (same lineages in, same merged output, regardless of arrival order) is a property NO test asserts. The arrival-order/order-invariance property test is the verification gate that proves the shipped tiebreak is genuinely order-independent and protects it from regression. [CONFIRMED iter-11: `fanout-merge.cjs:335` (now `:398`) has no `.sort()` feeding first-write-wins; blast confined — membership/counts/severity rollup are order-invariant; no order-invariance test exists.]
2. **The merge dedup keys on exact `id||title`, so surface-variants escape dedup and inflate distinct counts.** The research merge sets `const id = finding.id || finding.title` and de-duplicates first-write-wins (`fanout-merge.cjs:187-198`); the review merge keys on `finding.findingId || finding.title` (`:278`, `:302`, `:312-314`). Two lineages that surface the *same* finding with a differently-worded title (or distinct synthetic ids) are NOT merged — they survive as two records, inflating the distinct-finding count that downstream feeds `sourceDiversity` in the convergence blend. The near-dup merge dedup collapses these surface-variants by normalized content so the diversity signal is not inflated by restatement. [CONFIRMED: `fanout-merge.cjs:187,198,278,302,312,314` exact-key dedup; the `normalizeSortText`/`contentSortKey` normalization already exists at `:126-141` and is the natural content basis.]

### Purpose
Record the deep-loop fan-out determinism + observability trio that shipped in Wave-0 (merge total-order, pool gauges, graceful self-stop) with their commit evidence, and complete the gated Wave-1 tail: add the **order-invariance property test** that proves the shipped merge tiebreak is arrival-order-independent (a verification-gate addition, no production-code change), and add the **near-duplicate merge dedup** that collapses surface-variant findings by normalized content so they cannot inflate the distinct-finding count feeding `sourceDiversity` — content-normalization-gated so a genuinely distinct finding sharing an `id||title` is never dropped. All work is determinism/observability only, independent of the absent D2 reliability signal.

### Critical context (from the 028 research, authoritative — supersede pass-1)
- **The "merge total-order" and "failure-class" candidates were CORRECTED to WEAKER than their pass-1 "SOLID" billing.** `finding.id` is not always present; the merge keys on `id||title` with first-write-wins dedup — *that is a dedup, not a total-order tiebreak* (`roadmap.md` §2; `synthesis/01` Deep-Loop trio row). Wave-0 resolved this by *layering* a content-then-id total comparator (`compareByContentThenId`) ON TOP of the `id||title` dedup — but the dedup itself stays exact-key, which is precisely why the near-dup tail remains. [CONFIRMED `roadmap.md:221`; `030` §14 cand 12 "deterministic merge total-order (on top of id||title dedup)".]
- **The order-invariance property test is the genuine Wave-1 survivor of the galadriel-derived candidates.** Of the iter-11 candidates, `DL-arrival-order-property-test` is the one REAL item; `DL-preserve-before-trim` and the recover/preserve candidates were REFUTED (the deep-loop working set is externalized to JSONL registries re-read per merge, so there is no in-context working-set to lose). The property test corroborates the cross-subsystem determinism work (Code Graph D1, Memory D6) and is the test that *protects* the shipped merge-tiebreak GO. [CONFIRMED iter-11: "1 REAL, 2 REFUTED"; `synthesis/01:101` names it the verification gate on the captured merge-tiebreak GO.]
- **This cluster does NOT depend on the absent D2 reliability signal.** D2 (`metadata.reliability`) is wholly absent on both read and write sides — every input is `r=0.5` today (`roadmap.md:216`). The reliability-weighted-learning cluster (D2/D3/Q2) is NO-GO until built and benchmarked and is OUT OF SCOPE here; this cluster is keyed only on content text + read-derived pool counters. [CONFIRMED iter-13 F13-01.]
- **No candidate has a measured before/after benefit number** — every leverage/effort rating is structural inference, never a benchmarked delta (`roadmap.md` §6; `synthesis/03` §B). Ship for correctness/reproducibility/reversibility.
- **Graceful self-stop's sibling (failure-class) is a different cluster.** The Deep-Loop trio's failure-class sibling shipped *upstream in fanout-run*, not in the pool; the resilience cluster (failure-class taxonomy, transient/fatal retry, orphan reset, recover-vs-fresh gate) lives in the sibling sub-phase `003-fanout-failure-recovery`, NOT here. [CONFIRMED `synthesis/01:95`; `030` §14 cand 12 "did NOT duplicate upstream failure-class".]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the determinism + observability cluster (6 candidates: 3 DONE + 1 verification-gate + 2 tail rows for the single near-dup item)

| # | Candidate | One-line change | Seam (file:line) | Eff | Status |
|---|-----------|-----------------|------------------|-----|--------|
| 1 | **DL-merge-tiebreak** | layer a hand-written content-then-id total comparator (`compareByContentThenId`) on top of the first-write-wins `id||title` dedup so merged output order is reproducible across runs (NOT a total order via `id` alone — `finding.id` is not always present) | `fanout-merge.cjs:126-163` (comparator), consumed `:198,:312,:314` | S | **DONE** (Wave-0) |
| 2 | **DL-pool-gauges** | read-derived `lag`/`pending`/`failed` gauges computed from the pool's `total`/`settled`/`pending`/`failed` counters with no new state; emitted live per settle and in the final summary | `fanout-pool.cjs:58-63` (`buildPoolGauges`), live `:184-188`, summary `:240-248` | S | **DONE** (Wave-0) |
| 3 | **DL-graceful-self-stop** | flush a partial summary with a `stopped` marker on SIGINT/SIGTERM (children die silently today) + treat an empty/no-new-findings tick as **valid convergence**, not failure | `fanout-run.cjs:490` (empty-tick=convergence), `:508-524` (stopped flush), `:66-76` (signal handlers) | S | **DONE** (Wave-0) |
| 4 | **DL-arrival-order-property-test** | a property test asserting the merge is independent of lineage arrival order: shuffle/permute the lineage directories and assert the merged registry (membership, dedup result, order, severity rollup) is byte-identical — the verification gate proving the shipped tiebreak is order-invariant | `fanout-merge.cjs:398` (unsorted `readdirSync(...).filter`) + `compareByContentThenId`; new test alongside `tests/unit/fanout-merge.vitest.ts` | S | **PENDING** (verification-gate, no production-code change) |
| 5 | **DL-near-dup-merge-dedup** (research merge) | collapse surface-variant research findings by normalized content (`contentSortKey`/`normalizeSortText`) so a same-finding restatement under a different title/id does not survive as a distinct record and inflate the distinct count feeding `sourceDiversity` | `fanout-merge.cjs:182-198` (`findingById` exact `id||title` dedup) | S | **PENDING** (content-normalization-gated) |
| 6 | **DL-near-dup-merge-dedup** (review merge) | same content-normalized collapse on the review merge's `findingById`/`resolvedFindingById` (keyed on `findingId||title`) so cross-lineage P0/P1 surface-variants are not double-counted in the severity rollup | `fanout-merge.cjs:272-314` (`findingById`/`resolvedFindingById` exact-key dedup) | S | **PENDING** (content-normalization-gated; shares #5's design) |

> Rows 5 and 6 are the **same candidate** (`DL-near-dup-merge-dedup`) applied to the two merge paths (research + review); they share one content-normalization design and are listed separately only because they touch two dedup maps. Build order (dependency-driven): the three DONE rows are already shipped; **#4 (property test) lands first as the verification gate that protects the shipped tiebreak**, then **#5/#6 (near-dup dedup)** — and #4's order-invariance assertion must be re-run after #5/#6 since the dedup changes membership.

### Out of Scope (documented, NOT built this sub-phase)
- **The resilience cluster** — failure-class taxonomy, transient/fatal classification, bounded single-lineage retry, orphan-lineage reset, recover-vs-fresh gate. These live in the sibling sub-phase `003-fanout-failure-recovery`; the Deep-Loop trio's failure-class sibling shipped *upstream in fanout-run*, not in the pool, and is explicitly a different cluster (`030` §14 cand 12; `synthesis/01:95`).
- **Reliability-weighted learning (D2 / D3 / Q2)** — NO-GO until built AND benchmarked. D2 is a wholly-absent net-new build (every input `r=0.5`); D3's cap+gate is unmeasured; Q2-quarantine's "lower-trust side" is undefined without D2. Lives in a separate `004-deep-loop` impl sub-phase, not here (`roadmap.md:216,240`; iter-13).
- **DL-newInfoRatio non-consumption** — the self-graded `newInfoRatio` is computed (`convergence.cjs:285`) but never ingested back into the stop/continue decision; a known structured-module residual, not part of the determinism/observability cluster (`roadmap.md` §5 gap 2).
- **DL-progress-heartbeat / shutdown-summary heartbeat half** — periodic progress WITHIN a long single lineage; NEEDS-BENCHMARK and distinct from graceful-self-stop's `stopped` marker (which is the shutdown-summary half that already shipped) (`synthesis/01:101`; iter-12 E12-04).
- **DL-preserve-before-trim / recover-vs-fresh (galadriel candidates)** — REFUTED: the deep-loop working set is externalized to JSONL registries re-read per merge, so there is no in-context working-set to lose; the recover-vs-fresh misread was corrected (the reducer is a read-only renderer) (`iter-11`). The genuine recover-vs-fresh gate that *did* survive is a resilience-cluster item in the sibling sub-phase, not a determinism item here.
- Modifying packet 030 (the Wave-0 shipped record) or the external reference systems under `028.../external/`.

### Files to Change

| File Path | Change Type | Candidate(s) |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified (Wave-0 `46812f12a8`) for the tiebreak; Modify (PENDING) for near-dup dedup | DL-merge-tiebreak (DONE); DL-near-dup-merge-dedup (PENDING) |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified (Wave-0 `46812f12a8`) | DL-pool-gauges (DONE) |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified (Wave-0 `46812f12a8`) | DL-graceful-self-stop (DONE) |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified (Wave-0) for trio tests; Create/Modify (PENDING) for the order-invariance property test + near-dup dedup tests | DL-arrival-order-property-test (PENDING); DL-near-dup-merge-dedup (PENDING) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The merge output order is reproducible across runs via a hand-written content-then-id total comparator | DONE — `compareByContentThenId` (`fanout-merge.cjs:142-160`) sorts on `contentSortKey` (normalized durable text) then a normalized id key then full stable stringify; consumed at the three merge sorts (`:198`, `:312`, `:314`); layered ON TOP of the `id||title` first-write-wins dedup; `node --check` + 58 fanout tests + mutation-checked (`030` §14 cand 12, commit `46812f12a8`). [research: `roadmap.md:221`; `synthesis/01` Deep-Loop trio] |
| REQ-002 | The pool exposes read-derived `lag`/`pending`/`failed` gauges with no new state | DONE — `buildPoolGauges({ total, settled, pending, failed })` (`fanout-pool.cjs:58-63`) returns `lag = max(0, total-settled)`, `pending`, `failed`; emitted live per settle (`:184-188`) and in the final summary (`:240-248`); decoupled from any reliability signal (`030` §14 cand 12). [research: `synthesis/01` gauges row "gauges are clean"] |
| REQ-003 | Graceful self-stop flushes a `stopped` partial summary on SIGINT/SIGTERM and treats an empty no-new-findings tick as valid convergence | DONE — empty-tick convergence at `fanout-run.cjs:490` (`{ status: 'converged', reason: 'empty_tick', no_new_findings: true }`); `stopped` partial-summary flush at `:508-524` (idempotent via `stoppedSummaryWritten`), SIGINT/SIGTERM handlers `:66-76`; the shutdown-summary half (`030` §14 cand 12). [research: `synthesis/01:95` GO — confirmed clean] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A property test proves the merge is independent of lineage arrival order | PENDING — a test that shuffles/permutes the lineage directories (the merge reads `readdirSync(...).filter` with no `.sort()` at `fanout-merge.cjs:398`) and asserts the merged registry — membership, dedup result, final order, severity rollup — is byte-identical regardless of arrival order; this is the verification gate that proves the shipped `compareByContentThenId` tiebreak is genuinely order-invariant and protects it from regression; no production-code change. [research: iter-11 `DL-arrival-order-property-test` REAL; `synthesis/01:101`] |
| REQ-005 | Surface-variant findings are collapsed by normalized content so they do not inflate the distinct-finding count feeding `sourceDiversity` | PENDING — extend the research-merge `findingById` dedup (`fanout-merge.cjs:182-198`, exact `id||title`) and the review-merge `findingById`/`resolvedFindingById` dedup (`:272-314`, exact `findingId||title`) to collapse records whose normalized content (`contentSortKey`/`normalizeSortText`) matches, so a same-finding restatement under a different title/id is merged not double-counted; content-normalization-gated — a genuinely distinct finding that merely shares an `id||title` MUST NOT be dropped. [research: `fanout-merge.cjs:187,278,302` exact-key dedup; the convergence `sourceDiversity` averages distinct quality_class strings, `coverage-graph-signals.ts:378-416`] |
| REQ-006 | Every PENDING candidate names its gate and nothing in the determinism/observability cluster is silently dropped | PENDING/documented — the property test (verification-gate, no production-code change) and the near-dup dedup (content-normalization-gated) each carry a research-cited gate in section 11; the out-of-scope clusters (resilience → sibling sub-phase; D2/D3/Q2; newInfoRatio; heartbeat) are recorded in section 3 Out of Scope as belonging elsewhere or NO-GO. The order-invariance property test (REQ-004) MUST be re-run after the near-dup dedup (REQ-005) lands, since the dedup changes membership. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shipped trio (merge total-order, pool gauges, graceful self-stop) is re-confirmed against current source and `030` §14 candidate 12 with its commit (`46812f12a8`) — `compareByContentThenId` at the three merge sorts, `buildPoolGauges` lag/pending/failed, and the empty-tick=convergence + `stopped` flush are all present.
- **SC-002**: The order-invariance property test (when built) shuffles the lineage directories and proves the merged registry is byte-identical regardless of arrival order — protecting the shipped tiebreak from the unsorted `readdirSync(...).filter` at `fanout-merge.cjs:398`; no production-code change.
- **SC-003**: The near-dup merge dedup (when built) collapses surface-variant findings by normalized content so the distinct-finding count feeding `sourceDiversity` is not inflated by restatement — without dropping a genuinely distinct finding that shares an `id||title`.
- **SC-004**: No new dependency on the absent D2/reliability signal is introduced anywhere in the cluster; every signal is content text or a read-derived pool counter.
- **SC-005**: Every PENDING candidate (property test, near-dup dedup) has an explicit gate recorded (verification-gate / content-normalization-gated) so nothing is silently dropped, and the order-invariance test is re-run after the dedup lands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The shipped tiebreak is assumed order-invariant but never tested; the merge reads lineages unsorted (`:398`) | Med — a future change to `compareByContentThenId` or the dedup could silently reintroduce arrival-order dependence | REQ-004 property test (shuffle lineages, assert byte-identical merge) is the regression guard; blast is confined — membership/counts/severity rollup are already order-invariant (iter-11) |
| Risk | Near-dup dedup is too aggressive and drops a genuinely distinct finding that shares an `id||title` | High — silent data loss in the merged registry | Content-normalization-gated: collapse ONLY on a normalized-content match (`contentSortKey`), keep both when content differs; add a test asserting two distinct findings sharing an `id||title` both survive |
| Risk | Near-dup dedup is too weak and surface-variants still inflate `sourceDiversity` | Med — convergence STOP is reached on inflated diversity | Normalize on the durable-text body (`normalizeSortText`: trim/lowercase/collapse whitespace) that already drives `contentSortKey`, not just the title; test the restatement case |
| Risk | Changing the merge dedup re-orders or re-counts output and breaks the shipped trio tests | Med — regression in the 58 fanout tests | Re-run the full fanout suite after the dedup; re-run REQ-004 order-invariance after REQ-005 (the dedup changes membership) |
| Dependency | Wave-0 trio (`46812f12a8`) | Internal (shipped) | The property test protects the shipped tiebreak; the near-dup dedup extends the shipped dedup — both build on, do not re-implement, the trio |
| Dependency | `normalizeSortText` / `contentSortKey` normalization (`fanout-merge.cjs:126-141`) | Internal (shipped) | The near-dup dedup reuses this content basis; no new normalization primitive needed |
| Dependency | D2 reliability signal | NONE — explicitly independent | Cluster keyed only on content text + read-derived pool counters |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The merge output is reproducible across runs — `compareByContentThenId` is a hand-written *total* comparator (content key, then id key, then full stable stringify), not a JS `(a,b)=>b-a` subtraction (which is not a total order — NaN/-0 poison it). The order-invariance property test (REQ-004) is the reliability invariant's guard.
- **NFR-R02**: The near-dup dedup is conservative — it collapses only on a normalized-content match and never drops a finding whose content differs, so the merge cannot lose a genuinely distinct finding.

### Observability
- **NFR-O01**: The pool gauges are low-cardinality read-derived counters (`lag`/`pending`/`failed`) computed from existing pool state with no new background state and no unbounded growth — suitable for a live summary gauge.

### Compatibility
- **NFR-C01**: No schema migration; no new background daemon; the runtime stays fire-and-exit batch. The near-dup dedup is an additive content-normalization in the existing merge maps; the property test adds no production code.
- **NFR-C02**: No new dependency on the absent D2/reliability signal — every signal is content text or a read-derived pool counter.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **`finding.id` absent**: the merge falls back to `finding.title` as the dedup key (`fanout-merge.cjs:187`); `compareByContentThenId` falls back from the content key to the id key to a full stable stringify, so the total order holds even when ids are missing — this is exactly why the trio is "merge total-order on top of id||title dedup", not a total order via id alone.
- **Two distinct findings sharing an `id||title`**: the near-dup dedup MUST keep both (their normalized content differs) — the content-normalization gate; a test asserts both survive.
- **Same finding, different title wording, across two lineages**: the near-dup dedup MUST collapse them (normalized content matches) so they are merged with cross-lineage attribution, not double-counted in `sourceDiversity`.
- **Lineage directories in arbitrary OS order**: `readdirSync(...).filter` at `:398` returns them unsorted; the order-invariance property test shuffles them and asserts the merged registry is byte-identical — the first-write-wins dedup must reach the same survivor and the final sort must produce the same order regardless of arrival order.
- **SIGINT vs SIGTERM during a long run**: both flush a `stopped` partial summary (idempotent via `stoppedSummaryWritten` at `fanout-run.cjs:511`) and exit with the signal-appropriate code (130/143); the empty no-new-findings tick is convergence, not failure.
- **Empty merge (zero lineages)**: the gauges report `total=0`/`all_failed=false`; the merge returns an empty registry deterministically; the property test's degenerate case (0 or 1 lineage) is order-invariant trivially.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 3 fan-out modules (`fanout-merge`/`fanout-pool`/`fanout-run`) + 1 test file; LOC: small per candidate; Systems: deep-loop fan-out merge + concurrent pool |
| Risk | 12/25 | Auth: N; API: the merge dedup contract (membership/order) is shared by the merged-registry consumers; Breaking: near-dup dedup must not drop a distinct finding; order-invariance must hold cross-run |
| Research | 11/20 | Investigation done (200-iteration campaign + iter-11 property-test confirmation); trio shipped Wave-0; residue gated on a verification test + a content-normalization decision |
| **Total** | **33/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which content-derived key best protects the order-invariance property test from the unsorted `readdirSync(...).filter` at `fanout-merge.cjs:398` — sort the label directories at read time (cheap, makes the dedup arrival-order-stable directly), or rely solely on `compareByContentThenId` post-merge (the final sort is total, but the first-write-wins *survivor* still depends on arrival order when two records share a key)? **PENDING — decide at REQ-004 implementation time.** The property test must assert order-invariance regardless of the choice.
- Should the near-dup merge dedup collapse surface-variants by normalized content (the `normalizeSortText` durable-text body) or only de-weight them in the `sourceDiversity` count? A content-collapse merges the records (changing membership); a de-weight leaves both records but fixes the diversity signal. **PENDING — decide at REQ-005 implementation time;** the content-normalization gate (never drop a genuinely distinct finding) applies either way (`fanout-merge.cjs:126-141` is the normalization basis).
- Is the near-dup dedup needed on BOTH merge paths (research `findingById` + review `findingById`/`resolvedFindingById`) or is one path's inflation downstream-irrelevant? **PENDING — confirm which merge feeds `sourceDiversity` vs the severity rollup at REQ-005 implementation time** (`fanout-merge.cjs:182-198` research; `:272-314` review).
<!-- /ANCHOR:questions -->

---

## 11. CANDIDATE STATUS

| # | Candidate | Status | Commit | Gate / Notes |
|---|-----------|--------|--------|--------------|
| 1 | DL-merge-tiebreak | **DONE** | `46812f12a8` | `compareByContentThenId` content-then-id total comparator layered on top of the `id||title` first-write-wins dedup; consumed at the three merge sorts (`fanout-merge.cjs:198,312,314`); reproducible across runs; `node --check` + 58 fanout tests + mutation-checked. Corrected from the pass-1 "SOLID total-order" billing — it is a total-order *on top of* a dedup, because `finding.id` is not always present (`roadmap.md:221`; `030` §14 cand 12) |
| 2 | DL-pool-gauges | **DONE** | `46812f12a8` | `buildPoolGauges` read-derived `lag`/`pending`/`failed` (`fanout-pool.cjs:58-63`); live per settle (`:184-188`) + final summary (`:240-248`); no new state; "gauges are clean" was the one un-caveated trio member (`synthesis/01` gauges row; `030` §14 cand 12) |
| 3 | DL-graceful-self-stop | **DONE** | `46812f12a8` | empty-tick=convergence (`fanout-run.cjs:490`) + `stopped` partial-summary flush on SIGINT/SIGTERM (`:508-524`, idempotent `:511`); the shutdown-summary half (distinct from the NEEDS-BENCHMARK progress-heartbeat half); GO — confirmed clean (`synthesis/01:95`; `030` §14 cand 12) |
| 4 | DL-arrival-order-property-test | **PENDING** | — | **Gate: verification-gate (no production-code change)** — a property test that shuffles/permutes the lineage directories (unsorted `readdirSync(...).filter` at `fanout-merge.cjs:398`) and asserts the merged registry (membership, dedup, order, severity rollup) is byte-identical regardless of arrival order; proves the shipped `compareByContentThenId` tiebreak is order-invariant and protects it from regression. The one REAL galadriel-derived survivor (iter-11: "1 REAL, 2 REFUTED"); the verification gate on the captured merge-tiebreak GO (`synthesis/01:101`) |
| 5 | DL-near-dup-merge-dedup (research merge) | **PENDING** | — | **Gate: content-normalization-gated** — collapse surface-variant research findings by normalized content (`contentSortKey`/`normalizeSortText`, `fanout-merge.cjs:126-141`) in the `findingById` dedup (`:182-198`, exact `id||title`) so a same-finding restatement does not survive as a distinct record and inflate the distinct count feeding `sourceDiversity` (`coverage-graph-signals.ts:378-416`); MUST NOT drop a genuinely distinct finding that merely shares an `id||title` |
| 6 | DL-near-dup-merge-dedup (review merge) | **PENDING** | — | **Gate: content-normalization-gated (shares #5's design)** — same content-normalized collapse on the review merge's `findingById`/`resolvedFindingById` (`fanout-merge.cjs:272-314`, exact `findingId||title`) so cross-lineage P0/P1 surface-variants are not double-counted in the severity rollup; same candidate as #5 applied to the review path |

**Determinism/observability status: 3 DONE (merge total-order, pool gauges, graceful self-stop — all shipped in Wave-0 / packet 030, commit `46812f12a8`), 2 PENDING (the order-invariance property test, gated as a verification-gate addition; and the near-dup merge dedup, gated on a content-normalization decision and applied to both the research and review merge paths).** The shipped trio is the foundation already in place; the property test protects it and the near-dup dedup extends it. No schema migration; no dependency on the absent D2 reliability signal; the order-invariance test is re-run after the dedup lands because the dedup changes membership.

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Source research**: `../research/research.md` (Deep Loop external-mining synthesis; the merge-tiebreak/failure-class WEAKER corrections + the fan-out ledger baseline), `../research/iterations/iteration-011.md` (`DL-arrival-order-property-test` REAL, preserve/recover REFUTED); `../../research/roadmap.md` (BROADENING §2 merge-tiebreak/failure-class corrections, §5 newInfoRatio gap, §6 no-measured-number caveat); `../../research/synthesis/01-go-candidates.md` (Deep-Loop trio row + line 95 graceful-self-stop GO + line 101 property-test verification gate) + `03-corrections-caveats-and-residuals.md` + `04-sibling-and-cross-cutting.md`
- **Sibling sub-phase (resilience cluster, do not duplicate)**: `../003-fanout-failure-recovery/` (failure-class taxonomy + transient/fatal retry + orphan reset + recover-vs-fresh gate)
- **Shipped predecessor (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 12 (Deep-Loop trio + graceful-self-stop, commit `46812f12a8`)
<!-- /ANCHOR:related-docs -->
