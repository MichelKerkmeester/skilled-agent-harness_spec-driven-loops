---
title: "Feature Specification: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)"
description: "Implement the deep-loop resilience GO cluster from packet 028's Deep Loop research: a bounded failure-class taxonomy, transient/fatal-keyed bounded retry of a single failed lineage, resume-time orphan-lineage reset and a recover-vs-fresh resume gate. None depend on the absent D2 reliability signal. Reliability-weighted learning (D2/D3/Q2) is explicitly out of scope and NO-GO until built and benchmarked."
trigger_phrases:
  - "fan out recovery"
  - "fanout failure recovery"
  - "transient fatal retry"
  - "orphan lineage reset"
  - "deep loop resilience"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/003-fanout-failure-recovery"
    last_updated_at: "2026-06-19T12:10:00+02:00"
    last_updated_by: "codex"
    recent_action: "Implemented fan-out failure recovery C1-C5 with unit coverage"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-003-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent research phase** | `system-deep-loop/029-deep-loop-runtime` (Deep Loop, convergence/fan-out/council intelligence) |
| **Source research** | `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` + `04` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop fan-out runtime (`.opencode/skills/deep-loop-runtime/scripts/`) is a fire-and-exit BATCH orchestrator [CONFIRMED iter-12: `fanout-run.cjs` `process.exit` per run]. Its failure and recovery surface has four confirmed resilience gaps, all of which leave computed information discarded or in-flight work silently abandoned:

1. **Failure class is computed then discarded.** `fanout-run.cjs:639-658` distinguishes `timedOut` (SIGTERM) vs `exitCode` and carries a salvage flag on a `failure` object (`.exitCode/.timedOut/.salvage`), but `settleItem` (`fanout-pool.cjs:108-126`) FLATTENS the error to `{name, message}`, so the class survives only as a message substring and salvage-miss is never a label. [CONFIRMED iter-12 E12-03. Verified current: `settleItem` still returns `error:{name,message}` only.]
2. **Every failed lineage dispatches exactly once.** `runCappedPool` advances `nextIndex` with no requeue (`fanout-pool.cjs:171-212`). A failed lineage is never re-dispatched, and there is NO transient/fatal split and NO durable per-branch retry budget. Recovery today is post-hoc file salvage only (`runSalvageSweep`, `fanout-run.cjs:637`). [CONFIRMED iter-2 F1-4, iter-13 F13-03.]
3. **Resume-time orphans are never reset.** A lineage that started without a terminal event (orphaned in-flight after a crash) is detectable (`fanout-pool.cjs:82-108` started-without-terminal ledger, `loop-lock.cjs:186-188` staleness primitives) but NOTHING resets or requeues it, and `reduce-state.cjs` carries only `resumed`/`restarted` events, no started-without-terminal sweep. [CONFIRMED iter-7 DL-orphan-lineage-reset.]
4. **Resume silently fresh-inits on missing/corrupt state.** A resume that should validate existing JSONL state instead defaults `status` to `initialized` when the expected state is absent/empty (`reduce-state.cjs:434`), so a missing or corrupt resume state is silently fresh-started rather than refused. [CONFIRMED-detect / INFERRED-gate iter-7 DL-recover-vs-fresh-gate.]

### Purpose

Land the deep-loop **resilience GO cluster**, the cleanest reliability group still open after the 030 Wave-0 pass, as small, independently reversible, tested changes. The cluster's spine: the **failure-class taxonomy** (surface the upstream-computed timeout/exit/salvage class as a bounded low-cardinality label) GATES the **bounded transient/fatal retry** (re-dispatch the FAILED lineage alone with a durable budget, not all siblings). The **orphan-lineage reset** handles resume-time in-flight orphans, and the **recover-vs-fresh gate** refuses a missing/corrupt resume state.

### Critical context (from the 028 research, authoritative)

- **This cluster does NOT depend on the absent D2 reliability signal.** D2 (`metadata.reliability`) is wholly absent on both read and write sides, every input is `r=0.5` today [CONFIRMED iter-13 F13-01]. The reliability-weighted-learning cluster (D2/D3/Q2) is therefore NO-GO until built and benchmarked, and is OUT OF SCOPE here. This cluster is resilience/recovery, keyed only on exit-code/timeout/ledger state.
- **030 did NOT ship failure-class.** The 030 Wave-0 "Deep-Loop trio" (commit `46812f12a8`) shipped pool gauges (`lag`/`pending`/`failed`), the deterministic merge total-order and graceful-self-stop, and both its commit body and §14 note explicitly state it "does NOT duplicate the upstream failure classification." So the failure-class taxonomy and everything gated on it remain open. [CONFIRMED against `030/spec.md` §14 candidate 12, commit `46812f12a8` body, and current `fanout-pool.cjs:108-126`, which still returns `error:{name,message}` only, and `buildPoolSummary:236-250`, which emits no per-class rollup.]
  - **Disambiguation:** synthesis `01-go-candidates.md:95` phrases the DL-graceful-self-stop GO as if "its sibling failure-class-taxonomy already shipped in the Deep-Loop trio." That phrasing was imprecise against the authoritative pre-implementation code: what shipped (`46812f12a8`) was only the UPSTREAM computation of `timedOut`/`exitCode`/`salvage` in `fanout-run.cjs:639-654`. The pool still discarded that class. This sub-phase implements the bounded label + rollup. [Logic-Sync resolved against `030/spec.md` §14, the commit body and current source.]
- **No candidate has a measured before/after benefit number.** All leverage/effort are structural inference. Ship for correctness/reversibility, not a promised delta.
- The transient/fatal retry is the iteration-13 **CAUTION** item: the re-dispatch is net-new pool logic that MUST NOT double-count `summary.failed` nor mask a retry-success. [CONFIRMED iter-13 F13-03.]
- Orphan auto-redispatch is **CAUTION pending a lease/heartbeat**. The GO half is detect + marker. [CONFIRMED synthesis `01` Deep-Loop recovery cluster.]

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, the resilience GO cluster (5 candidates)

| # | Candidate | One-line | Seam (file:line) | Eff | Status |
|---|-----------|----------|------------------|-----|--------|
| C1 | **DL-failure-class-taxonomy** | stop discarding the upstream failure class, surface a bounded {timeout, exit, salvage-miss} low-cardinality label in `settleItem`'s error shape + a class rollup in `buildPoolSummary` | `fanout-pool.cjs:108-126` (settle), `:236-251` (summary), class computed at `fanout-run.cjs:639-658` | S | DONE |
| C2 | **Q3-fanout-recovery** | consume the pool's `failed` ledger events as resumable state + a transient/fatal classification keyed on `timedOut`/exit-code (the classification basis for the retry) | `fanout-run.cjs:639-658`, `fanout-pool.cjs:171-212,108-126,236-251` | M | DONE |
| C3 | **Q3-fanout-transient-fatal-retry** | re-dispatch the FAILED lineage ALONE with a durable bounded per-branch retry budget (aionforge `max_retries=5`, count-from-audit so a crash does not hand a fresh budget), transient → retry, fatal → no retry | `fanout-run.cjs:639-658`, `fanout-pool.cjs:171-212` | M | DONE |
| C4 | **DL-orphan-lineage-reset** | on resume, detect lineages that started without a terminal event and mark/requeue them (GO: detect + marker, CAUTION: auto-redispatch pending a lease/heartbeat) | `fanout-pool.cjs:82-108` (detect), reset GAP, `loop-lock.cjs:186-188`, `reduce-state.cjs:344,393` | M | DONE (detect + marker, auto-redispatch still lease-gated) |
| C5 | **DL-recover-vs-fresh-gate** | a resume that should validate existing JSONL state must REFUSE a missing/empty/corrupt expected state rather than silently fresh-init (status defaults to `initialized` today) | `reduce-state.cjs:434`, `:795` | M | DONE |

> Build order (dependency-driven): **C1 → C2 → C3** (the taxonomy gates the classification, which gates the retry), then **C4** and **C5** (independent resume-time gates). See `plan.md`.

### Out of Scope (documented, NOT built this sub-phase)

- **Reliability-weighted learning (D2 / D3 / Q2)**, NO-GO until built AND benchmarked. D2 is a wholly-absent net-new build (every input `r=0.5`). Q2-quarantine's "lower-trust side" is undefined without D2, and D3's cap+gate is unmeasured. [CONFIRMED iter-13.] Lives in a sibling impl sub-phase of `004-deep-loop`, not here.
- **DL-progress-heartbeat** (periodic progress WITHIN a long single lineage), NEEDS-BENCHMARK. The shutdown-summary half already shipped via 030 graceful-self-stop. [CONFIRMED iter-12 E12-04.]
- **DL-idempotent-self-resume**, NO-GO, wrong substrate (the runtime is fire-and-exit batch, not a self-prompting daemon). [CONFIRMED iter-12 E12-01.]
- **DL-graceful-self-stop**, **pool gauges**, **deterministic merge total-order**, already SHIPPED in 030 (commit `46812f12a8`), not re-implemented here.
- **DL-newInfoRatio non-consumption**, a known structured-module residual, not part of the resilience cluster.
- Modifying the external reference systems under `028.../external/`.

### Files to Change

| File Path | Change Type | Candidate(s) |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modify | C1, C2, C3, C4 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | C1, C2, C3 |
| `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | Possibly extend (transient/fatal classifier helper) | C2 |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify | C4, C5 |
| Tests alongside each change (deep-loop-runtime test suite) | Create/Modify | all |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C1 | Surface the failure class as a bounded label | `settleItem` retains a low-cardinality `failure_class ∈ {timeout, exit, salvage_miss}` (derived from the upstream `timedOut`/`exitCode`/`salvage` it currently discards), and `buildPoolSummary` emits a per-class rollup. Cardinality is bounded, with no free-form text in the label. [research: iter-12 E12-03, seam `fanout-pool.cjs:108-126,236-251`] |
| REQ-C2 | Classify transient vs fatal from confirmed signals | A transient/fatal verdict is derived ONLY from `timedOut`/exit-code/salvage signals already present (no new D2/reliability input). Default-conservative: unknown → fatal (no retry) so a misclassification cannot loop. [research: iter-13 F13-03] |
| REQ-C3 | Retry the failed lineage alone with a durable bounded budget | A transient-classified lineage is re-dispatched ALONE (not all siblings) up to a durable per-branch `max_retries` (default 5, aionforge), with the attempt count read from the durable ledger/audit so a crash does NOT hand a fresh budget. A retry-success MUST NOT be double-counted in `summary.failed`, and a retry-success MUST flip the lineage to succeeded. [research: iter-2 F1-4, iter-13 F13-03] |
| REQ-C5 | Refuse a missing/corrupt resume state | A resume invoked in a validate-existing-state mode REFUSES (does not silently fresh-init) when the expected JSONL state is missing/empty/corrupt, and the refusal is distinguishable from a legitimate fresh start. [research: iter-7 DL-recover-vs-fresh-gate, seam `reduce-state.cjs:434`] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C4 | Detect + mark resume-time orphan lineages | On resume, lineages that started without a terminal event are detected and marked/requeued. The GO scope is detect + marker, and auto-redispatch is gated behind a lease/heartbeat and may be deferred. [research: iter-7 DL-orphan-lineage-reset, seam `fanout-pool.cjs:82-108`] |
| REQ-C6 | No double-count / no masked failure | Across C2/C3, the orchestration summary's `failed` count and exit-code MUST remain correct: a retried-and-succeeded lineage is not counted failed, and a retry that exhausts the budget surfaces as a real failure. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each candidate is independently reversible and unit-tested.
- **SC-002**: `summary.failed` and the run exit-code are correct under retry-success, retry-exhaustion and mixed transient/fatal batches (REQ-C6).
- **SC-003**: No new dependency on the absent D2/reliability signal is introduced anywhere in the cluster.
- **SC-004**: `node --check` on the touched `.cjs`, the deep-loop-runtime focused tests and `validate.sh --strict` on this sub-phase all pass.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Retry re-dispatch double-counts `summary.failed` or masks a real failure | Wrong exit-code / silent data loss | REQ-C6 explicit count tests for retry-success, retry-exhaustion, mixed batch (iter-13 CAUTION) |
| Risk | Transient/fatal misclassification loops forever | Runaway retries | Default-conservative: unknown → fatal, durable `max_retries=5` read from audit (crash ≠ fresh budget) |
| Risk | `settleItem` error-shape change touches the shared settle contract | Other pool consumers break | Additive field only, existing `{name,message}` preserved, full fanout test suite green |
| Risk | Orphan auto-redispatch without a lease re-runs live work | Duplicate dispatch | Scope C4 to detect + marker (GO), defer auto-redispatch behind a lease/heartbeat (CAUTION) |
| Risk | recover-vs-fresh gate refuses a legitimate fresh start | Resume regressions | Gate applies ONLY in validate-existing-state mode, fresh start path unchanged |
| Dependency | 030 pool gauges + graceful-self-stop (`46812f12a8`) | C1 builds on the same `buildPoolSummary` | Confirmed shipped, this sub-phase extends, does not re-implement |
| Dependency | D2 reliability signal | NONE, explicitly independent | Cluster keyed on exit-code/timeout/ledger only |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Durable retry budget, the attempt count is read from the durable ledger/audit, so a crash-replay does not reset it (aionforge `consolidation.md:61-68`).
- **NFR-R02**: Default-conservative classification, any unrecognized failure signal is treated as fatal (no retry), so a classification gap cannot cause a loop.

### Compatibility
- **NFR-C01**: `settleItem`'s existing `error:{name,message}` shape is preserved, and the failure-class label is an additive field.
- **NFR-C02**: No schema migration, no new background daemon, the runtime stays fire-and-exit batch.

### Observability
- **NFR-O01**: The bounded failure-class rollup is low-cardinality (fixed label set), suitable for a summary gauge without unbounded growth.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Salvage-miss**: a non-zero exit whose salvage sweep recovered nothing must be a distinct `salvage_miss` label, not folded into `exit`.
- **Timeout vs exit collision**: a lineage killed by SIGTERM (`timedOut`) must classify as `timeout` even though it also carries a non-zero exit code (timeout takes precedence, `fanout-run.cjs:640` already derives `timedOut` from `signal === 'SIGTERM'`).
- **Retry-success**: a lineage that fails then succeeds on retry must NOT appear in `summary.failed`, and the run exit-code must reflect the final success.
- **Retry-exhaustion**: a transient lineage that exhausts `max_retries` surfaces as a genuine failure (counts toward `failed`, fatal exit-code path).
- **Empty/zero-byte resume state**: must hit the recover-vs-fresh REFUSE path, distinguishable from a first-ever run (which legitimately fresh-inits).
- **Orphan with no terminal event after crash**: detected on resume and marked, never silently treated as either succeeded or failed.
- **All-fatal batch**: no retries attempted, behaves identically to today's single-dispatch path (regression-safe).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 5 candidates across 3 `.cjs` files (`fanout-pool`, `fanout-run`, `reduce-state`), additive + surgical, no new module required |
| Risk | 14/25 | C3 retry count-correctness (REQ-C6) and C5 refuse-vs-fresh are the higher-blast hunks, mitigated by per-candidate revert + adversarial verify |
| Research | 8/20 | Seams confirmed [CONFIRMED] against current source, no candidate has a measured before/after, all leverage is structural inference |
| **Total** | **34/70** | **Level 2**, 100-499 LOC band, each candidate independently small, risk (not LOC) drives the verify gate |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Does any workflow persist a per-lineage in-flight marker durably enough for the orphan-reset sweep to run BEFORE re-dispatch, or is the only durable in-flight signal the `fanout-pool` started-without-terminal ledger gap? **Answered:** implementation uses the durable `orchestration-status.log` started-without-terminal gap and appends an `orphan_requeued` marker. Auto-redispatch remains gated behind a future lease/heartbeat.
- Should the recover-vs-fresh gate be a new explicit mode flag on `reduce-state.cjs`, or inferred from the presence of a non-empty config/state pair? **Answered:** explicit `--require-existing-state` / `requireExistingState` flag, so legitimate fresh starts remain unchanged.
- Is `max_retries=5` (aionforge default) right for the deep-loop CLI cost profile, or should it be smaller given each lineage is a full CLI dispatch? **Answered:** default remains 5 and is config-overridable through `fanout.maxRetries`, and direct pool callers remain no-retry unless they opt in.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Parent research**: `../research/research.md` (Deep Loop external-mining synthesis), resilience cluster detail in `../research/iterations/iteration-007.md`, `iteration-009.md`, `iteration-012.md`, `iteration-013.md` + `../research/deltas/iter-007.jsonl`, `iter-012.jsonl`.
- **Cross-cutting roadmap**: `../../research/roadmap.md` (Graceful Degradation + Idempotent Async Consolidation spines), `../../research/synthesis/01-go-candidates.md` (Deep-Loop recovery/resilience cluster), `03-corrections-caveats-and-residuals.md`, `04-sibling-and-cross-cutting.md`.
- **Shipped record (Wave-0)**: Wave-0 record (commit `46812f12a8`, gauges/merge/graceful-self-stop, explicitly NOT failure-class).

<!-- /ANCHOR:related-docs -->
