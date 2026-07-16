---
title: "Implementation Plan: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)"
description: "Approach and sequencing for the deep-loop resilience GO cluster: failure-class taxonomy gates the transient/fatal classification, which gates the bounded single-lineage retry. Orphan-lineage reset and recover-vs-fresh gate are independent resume-time guards. No dependency on the absent D2 reliability signal."
trigger_phrases:
  - "fanout failure recovery plan"
  - "transient fatal retry sequencing"
  - "deep loop resilience plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/003-fanout-failure-recovery"
    last_updated_at: "2026-06-19T12:10:00+02:00"
    last_updated_by: "codex"
    recent_action: "Implemented the 5-candidate resilience sequence"
    next_safe_action: "Ready for handoff"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), deep-loop-runtime scripts |
| **Runtime shape** | Fire-and-exit BATCH orchestrator (`fanout-run.cjs` `process.exit` per run), NOT a daemon [CONFIRMED iter-12] |
| **Storage** | JSONL ledgers (`orchestration-status.log`), `reduce-state` config/state files, no DB schema |
| **Testing** | deep-loop-runtime vitest/contract tests, `node --check` on touched `.cjs` |

### Overview

This sub-phase implements the 028/004 **resilience GO cluster**, the cleanest reliability group still open after 030's Wave-0 pass, and the one cluster that does NOT depend on the absent D2 reliability signal. The work fixes information that is computed-then-discarded (failure class) and in-flight work that is silently abandoned (no retry, orphan lineages, silent fresh-init).

The cluster has a strict internal dependency chain on the failure side and two independent resume-time guards:

```
C1 failure-class-taxonomy  (un-flatten the discarded class → bounded label)
        │  gates
        ▼
C2 transient/fatal classification  (verdict from timedOut/exit/salvage only)
        │  gates
        ▼
C3 bounded single-lineage retry  (re-dispatch the failed lineage alone, durable budget)

C4 orphan-lineage reset  (resume-time: detect started-without-terminal; mark/requeue)   [independent]
C5 recover-vs-fresh gate (resume-time: refuse missing/empty/corrupt state)               [independent]
```

All effort/leverage tags are **structural inference, never benchmarked** (per the 028 honesty layer). Ship for correctness and reversibility.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and each candidate's seam cited to research file:line
- [x] Scope frozen: the 5-candidate resilience cluster, D2/D3/Q2 explicitly out
- [x] Dependencies identified (C1→C2→C3 chain, 030 gauges already shipped)
- [x] Per-candidate DONE/PENDING status confirmed against current source + 030 §14

### Definition of Done
- [x] All P0 acceptance criteria met (REQ-C1/C2/C3/C5) + count-correctness
- [x] Each candidate has deterministic unit coverage and an independently reversible diff, no commits created per user instruction
- [x] `node --check` + deep-loop-runtime focused tests green
- [x] `validate.sh --strict` on this sub-phase passes
- [x] checklist.md items verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive, surgical edits to the existing fan-out pool / run / reduce-state modules. No new module is required unless a transient/fatal classifier helper is cleaner as a small pure function (candidate location: `lib/cli-guards.cjs`, beside the existing `classifyExitCode`).

### Key Components (existing seams)

- **`fanout-pool.cjs`**: `settleItem` (`:84-127`, the never-throws per-item settler that currently flattens errors to `{name,message}`), `runCappedPool` (`:146-` dispatch-once pump, `nextIndex` advance with no requeue), `buildPoolSummary` (`:236-251`, emits `total/succeeded/failed/all_failed/gauges`), `buildPoolGauges` (`:58-`, the 030-shipped `lag/pending/failed`).
- **`fanout-run.cjs`**: the lineage worker (`:540-660`) that computes `timedOut` (`:640`, `signal==='SIGTERM'`), `exitCode` (`:639`), `salvage` (`:637`), and builds a `failure` object with `.exitCode/.timedOut/.salvage` (`:647-654`) that is currently passed to the pool and flattened.
- **`lib/cli-guards.cjs`**: existing `classifyExitCode` (`:116`, a process-exit mapper 3/2/1, NOT a transient/fatal lineage classifier, the new classifier is net-new, may live beside it).
- **`reduce-state.cjs`** (deep-research): the resume status resolver (`:434`, `status` defaults to `initialized` when config is absent) and `:795` state region, carries `resumed`/`restarted` events (`:344,:393`) but no started-without-terminal sweep.

### Data Flow (target)

1. A lineage worker fails → `fanout-run.cjs` derives `{timedOut, exitCode, salvage}` (unchanged).
2. **C1**: the pool's `settleItem` retains a bounded `failure_class` label derived from those fields, and `buildPoolSummary` rolls the classes up.
3. **C2**: a transient/fatal verdict is computed from the same fields (default-conservative: unknown → fatal).
4. **C3**: transient lineages are re-dispatched ALONE up to a durable `max_retries` (count read from the ledger/audit), and summary counts reflect the final per-lineage outcome.
5. **C4** (resume): started-without-terminal lineages in the ledger are detected and marked/requeued.
6. **C5** (resume): a validate-existing-state resume refuses a missing/empty/corrupt state instead of fresh-init.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Failure-class taxonomy (the gate), C1
- [x] Read `fanout-pool.cjs:84-127` (settle) + `:236-251` (summary) and `fanout-run.cjs:639-658` (where the class is computed)
- [x] Add a bounded `failure_class ∈ {timeout, exit, salvage_miss}` to `settleItem`'s rejected result (additive, preserve `{name,message}`)
- [x] Add a per-class rollup to `buildPoolSummary`
- [x] Unit test: each of timeout/exit/salvage_miss produces the right label, rollup counts correct

### Phase 2: Transient/fatal classification + bounded retry, C2, C3
- [x] C2: implement a transient/fatal classifier from `timedOut`/exit-code/salvage (default-conservative unknown→fatal), unit test the verdict table
- [x] C3: re-dispatch a transient lineage ALONE in `runCappedPool` with a durable `max_retries` (default 5, config-overridable), attempt count read from the ledger/audit
- [x] C3: guarantee count-correctness, retry-success does not inflate `summary.failed`, retry-exhaustion surfaces as a real failure, correct run exit-code
- [x] Unit tests: retry-success, retry-exhaustion, mixed transient/fatal batch, all-fatal regression-equivalence

### Phase 3: Resume-time guards, C4, C5
- [x] C4: detect started-without-terminal lineages on resume (`fanout-pool.cjs:82-108` ledger), mark/requeue (GO half), leave auto-redispatch behind a lease/heartbeat
- [x] C5: add a validate-existing-state resume gate to `reduce-state.cjs:434` that REFUSES missing/empty/corrupt state, distinguishable from a legitimate fresh start
- [x] Unit tests: orphan detection + marker, refuse-on-missing/empty/corrupt, legitimate-fresh-start unaffected

### Phase 4: Verification
- [x] `node --check` on every touched `.cjs`
- [x] deep-loop-runtime broad related test suite green (capture baseline first per regression-baseline rule)
- [x] `validate.sh --strict` on this sub-phase
- [x] Adversarial review pass covered by deterministic local unit cases per user instruction for code + unit tests only

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | failure-class labels + rollup, transient/fatal verdict table, retry count-correctness, orphan detection, recover-vs-fresh refuse | deep-loop-runtime vitest / contract tests |
| Syntax | every touched `.cjs` parses | `node --check` |
| Regression | full fanout pool/run suite green vs captured baseline, all-fatal batch behaves as today | existing suite |
| Adversarial | independent seat tries to refute C2/C3 count-correctness and the unknown→fatal default | cli-codex/opus review seat |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 030 pool gauges + graceful-self-stop (`46812f12a8`) | Internal (shipped) | Green | C1 extends the same `buildPoolSummary`, confirmed present |
| `classifyExitCode` / `cli-guards.cjs` | Internal | Green | C2 may site its classifier beside it (or stand alone) |
| D2 reliability signal | None | N/A | Cluster is explicitly independent, no block |
| `reduce-state.cjs` resume resolver (`:434`) | Internal | Green | C4/C5 seam, confirmed present |
| Durable ledger (`orchestration-status.log`) | Internal | Green | C3 reads attempt count from it, C4 reads started-without-terminal from it |

### Shared-infra note
The transient/fatal + durable-retry pattern here is the **same shape** as Code Graph's Q2-C1 parser transient/fatal split and Memory's enrichment retry-budget/dead-letter (roadmap spine 6, Idempotent Async Consolidation + Crash-Safe Recovery). This sub-phase does NOT build a shared module, since each subsystem's seam differs, but the `max_retries`-from-durable-audit discipline (aionforge `consolidation.md:61-68`) is the common contract to keep consistent.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a retry loop double-counts `failed`, masks a real failure or re-dispatches live work, or the recover-vs-fresh gate refuses a legitimate fresh start.
- **Procedure**: each candidate is isolated in a small diff hunk and can be reverted file-by-file. No scoped commits were created because this run is explicitly no-commit. C1 is purely additive (safe), and C3 (retry) and C5 (gate) are the higher-blast hunks and revert independently of C1/C4.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (C1 taxonomy) ──> Phase 2 (C2 classify ──> C3 retry)
                                                        │
Phase 3 (C4 orphan reset, C5 recover-gate) ─────────────┤ (independent of the C1→C3 chain)
                                                        ▼
                                                  Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 (C1) | None (extends shipped 030 summary) | 2 |
| 2 (C2, C3) | 1 | 4 |
| 3 (C4, C5) | None | 4 |
| 4 (Verify) | 2, 3 | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Research effort tag | Note |
|-----------|---------------------|------|
| C1 failure-class-taxonomy | S | un-flatten computed-then-discarded data, additive label + rollup |
| C2 transient/fatal classify | M | net-new verdict logic, default-conservative |
| C3 bounded single-lineage retry | M | net-new pool logic, the iter-13 CAUTION (count-correctness) |
| C4 orphan-lineage reset | M | detect+marker GO, auto-redispatch CAUTION (lease-gated) |
| C5 recover-vs-fresh gate | M | refuse missing/corrupt state, mode-flag vs inferred (open Q) |

> Effort tags are structural inference. The cluster is Level 2 (100-499 LOC band) but each candidate is independently small. Risk on C3 (retry count-correctness) and C5 (refuse-vs-fresh) is the reason for the adversarial verify gate, not LOC.

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Baseline captured: current deep-loop-runtime test counts (regression-baseline rule)
- [x] Branch-only, nothing pushed/deployed without explicit user go
- [x] Each candidate isolated in an independently reversible diff, no commits created per user instruction

### Rollback Procedure
1. Identify the offending candidate's diff hunk/file.
2. Revert that hunk or file-level change. C1/C4 are additive and revert cleanly, while C3/C5 revert independently.
3. Re-run `node --check` + the fanout suite to confirm baseline restored.
4. No data migration to reverse (JSONL ledgers + config only, no DB schema change).

<!-- /ANCHOR:enhanced-rollback -->
