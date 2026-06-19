---
title: "Implementation Plan: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster)"
description: "Approach and sequencing for the deep-loop STOP-input corroboration cluster: the graph-novelty audit produces the delta the consumption guard ingests; the lag_ceiling tripwire enforces against the already-shipped gauges; keep-both gates the contradiction record; the progress heartbeat is an independent observability emitter; the shutdown-summary half is already shipped. No dependency on the absent D2 reliability signal."
trigger_phrases:
  - "newInfoRatio corroboration plan"
  - "graph novelty gate sequencing"
  - "lag ceiling enforcement plan"
  - "deep loop stop hardening plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/005-005-stop-input-corroboration"
    last_updated_at: "2026-06-19T10:30:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored implementation plan for the STOP-input corroboration cluster"
    next_safe_action: "Begin C1 graph-novelty delta after capturing the convergence and fanout baseline"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-005-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster)

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) scripts + TypeScript (`.ts`) coverage-graph lib, deep-loop-runtime |
| **Runtime shape** | Fire-and-exit BATCH orchestrator (`fanout-run.cjs` `process.exit` per run) — NOT a daemon [CONFIRMED iter-12] |
| **Storage** | Coverage-graph DB nodes/edges + per-iteration snapshots; `orchestration-status.log` JSONL ledger; no DB schema change |
| **Testing** | deep-loop-runtime vitest/contract tests; `node --check` on touched `.cjs`; fixture tests for the novelty gate |

### Overview

This sub-phase implements the 028/004 **STOP-input corroboration cluster** — the convergence-hardening and fan-out-observability residuals that survive after 030's Wave-0 pass, and that are independent of the absent D2 reliability signal. The headline work fixes a self-assessment that is computed-and-named but never consumed by the structured STOP decision (`newInfoRatio`); it then adds an enforced lag tripwire on shipped gauges, a keep-both-with-record for same-id cross-lineage collisions, and a periodic in-lineage progress heartbeat. The shutdown-summary half already shipped (030 graceful-self-stop) and is recorded DONE.

The cluster has one strict internal dependency chain (the novelty audit → its consumption gate), one keep-both → record pair, and two independent additions:

```
C1 newInfoRatio-audit  (independent graph-novelty delta from the graph state already loaded)
        │  feeds
        ▼
C2 newInfoRatio-consumption  (blocking STOP guard; effectiveNovelty = max(reported, graphDelta); no-op when absent)

C3 Q4-backpressure-enforcement  (lag_ceiling tripwire on the SHIPPED lag/pending/failed gauges)   [independent]

C4 cross-lineage-contradiction keep-both  (retain both same-id records, canonical content order)
        │  gates
        ▼
C5 cross-lineage-contradiction-record  (CONTRADICTS/_conflicts marker; confirm no downstream dedup clobber)

C6 progress-heartbeat  (periodic in-lineage liveness event; default 0/configurable until benchmarked)   [independent]

C7 shutdown-summary-heartbeat  ── ALREADY SHIPPED (030 graceful-self-stop, 46812f12a8) — NOT re-built
```

All PENDING candidates are **NEEDS-BENCHMARK** (the floor/tolerance, the `lag_ceiling`, the keep-both leverage, the heartbeat cadence all need calibration). All effort/leverage tags are **structural inference, never benchmarked** (per the 028 honesty layer). Ship for correctness and reversibility behind default-conservative / default-off guards.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and each candidate's seam cited to research file:line
- [x] Scope frozen: the 7-candidate STOP-corroboration cluster (6 PENDING + 1 DONE); D2/D3/Q2 + the resilience cluster explicitly out
- [x] Dependencies identified (C1→C2 chain; C4→C5 pair; C3/C6 independent; C7 shipped)
- [x] Per-candidate DONE/PENDING status confirmed against current source + 030 §14

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-C1/C2/C3) + the P1 set (REQ-C4/C5/C6) or a user-approved deferral
- [ ] Each PENDING candidate has its own unit/fixture test and its own scoped commit
- [ ] C2 backward-safe no-op fixture is byte-identical; the gaming fixture does NOT STOP
- [ ] `node --check` + deep-loop-runtime focused tests green
- [ ] `validate.sh --strict` on this sub-phase passes
- [ ] C7 reconciled as already-shipped (commit `46812f12a8`), not re-implemented

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive, surgical edits to the existing convergence / cost-guards / fan-out merge+run modules, plus one new pure helper (`computeGraphNoveltyDelta`). No new module is required; the novelty helper may live beside the existing `compute*FromData` emitters in `coverage-graph-signals.ts` or inline in `convergence.cjs`. Every new argument is optional with a backward-safe default so an unforwarded invocation is byte-identical.

### Key Components (existing seams)

- **`convergence.cjs`** — `main()` loads `db.getNodes(ns)`/`db.getEdges(ns)` (`:330-331`), computes signals via `compute*FromData` (`:359-363`), runs `computeCompositeScore` (`:89` region) and the `evaluate*` decision (`:378-381`), and emits `decisionReason` (`:280-290`) whose `STOP_ALLOWED` text already reads "pending newInfoRatio agreement" (`:285`). Snapshots are loaded (`:338`) and persisted per-iteration (`:390-399`) — the substrate the novelty delta reads. The decision args (`:298-322`) currently exclude any novelty input.
- **`coverage-graph-signals.ts`** — the research signal emitters (`computeResearch*FromData`); a `computeGraphNoveltyDelta(nodes, edges, snapshots)` is a natural sibling here (NEW FINDING/SOURCE/EVIDENCE_FOR node+edge fraction since the prior snapshot).
- **`cost-guards.cjs`** — `DEFAULT_COUNCIL_COST_GUARDS` (`:15-20`, no `lag_ceiling` today), `evaluateCouncilCostGuards` (`:114-140`, advisory-only return). The enforced lag path is additive — keep the advisory tuple unchanged, add a `lag_ceiling` field + a meter against the shipped oldest-pending-lag gauge.
- **`fanout-merge.cjs`** — `findingById` `Map` keyed on `finding.id || finding.title` with first-write-wins (`:66-82`); `sortByContentThenId` / `compareByContentThenId` (`:28-47`) is the existing content-derived total-comparator the keep-both ordering reuses.
- **`fanout-run.cjs`** — the lineage worker; the per-lineage progress emitter (C6) sits here, cadenced; the shutdown `writeStoppedSummary` (`:510-541`, C7) is already present.
- **`reduce-state.cjs`** (deep-research) — the rolling-ratio source; C2 may extend it to forward `--reported-novelty` to `convergence.cjs`.

### Data Flow (target)

1. **C1**: `convergence.cjs` computes `graphNoveltyDelta` from the nodes/edges/snapshots it already loads (no new model call, no reliability input).
2. **C2**: the orchestrator forwards the reducer rolling-ratio as `--reported-novelty`; the decision computes `effectiveNovelty = max(reported, graphNoveltyDelta)`; if `STOP_ALLOWED` would fire but `reported < threshold` AND `graphNoveltyDelta > floor`, it becomes `STOP_BLOCKED` with `novelty_self_report_unverified`. Absent `--reported-novelty` → no-op.
3. **C3**: the loop meters the shipped oldest-pending-lag gauge against `lag_ceiling`; on breach it honors the tripwire (warn first), advisory cost-guard return unchanged.
4. **C4**: a same-id same-content collision collapses to one; a same-id different-content collision retains both in canonical content-derived order.
5. **C5**: the kept-both pair emits a CONTRADICTS/`_conflicts` marker (after confirming no downstream id/content_hash dedup clobbers it).
6. **C6**: a long lineage emits a periodic progress event at the configured cadence (`0` disables).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: newInfoRatio corroboration (the headline gap) — C1, C2
- [ ] Read `convergence.cjs:280-400` (decision path, args, snapshots) and the `compute*FromData` emitters
- [ ] C1: implement `computeGraphNoveltyDelta(nodes, edges, snapshots)` scoped to NEW FINDING/SOURCE/EVIDENCE_FOR nodes+edges since the prior snapshot; unit test the delta on synthetic snapshot pairs
- [ ] C2: thread `--reported-novelty` into the decision; add `effectiveNovelty = max(reported, graphDelta)` + the `novelty_self_report_unverified` blocking guard; confirm the orchestrator/`reduce-state.cjs` forwards the rolling-ratio (extend if needed)
- [ ] Fixtures: gaming (high delta + `--reported-novelty 0.01` → NOT STOP + blocker); legitimate-low (flat delta + low report → STOP_ALLOWED); no-op (omit → byte-identical); insight-only delta (not spuriously blocked)

### Phase 2: backpressure enforcement — C3
- [ ] Read `cost-guards.cjs:15-20,114-140` + the shipped gauge emitter (`fanout-pool.cjs:90,108,235-238`)
- [ ] Add `lag_ceiling` (default 5s, config-overridable) to the guard config; meter the shipped oldest-pending-lag gauge against it; honor the tripwire (warn tier)
- [ ] Preserve the advisory `evaluateCouncilCostGuards` return unchanged; the enforced path is additive
- [ ] Unit test: lag below/at/above ceiling resolves deterministically; advisory return is unchanged

### Phase 3: cross-lineage contradiction keep-both + record — C4, C5
- [ ] Read `fanout-merge.cjs:28-47` (comparator) + `:66-82` (first-seen-wins dedup)
- [ ] C4: retain both on same-id different-content; collapse on same-id identical-content; canonical content-derived order (reuse the existing comparator)
- [ ] C5: BEFORE relying on keep-both, confirm whether the merge or a downstream `upsert.cjs` dedupes by id/content_hash; then emit a CONTRADICTS/`_conflicts` marker via `coverage-graph-query.ts:221`
- [ ] Unit tests: keep-both pair retained + ordered; identical-content collapses; record emitted; no clobber by downstream dedup

### Phase 4: progress heartbeat — C6
- [ ] Add a periodic in-lineage progress event at a configurable cadence (default `0`/disabled until benchmarked) in the `fanout-run.cjs` worker; distinct from the lock-TTL heartbeat and the shutdown `stopped` marker
- [ ] Unit test: heartbeat fires at cadence on a long lineage; `0` disables (regression-equivalent); a fast lineage emits no spurious heartbeat

### Phase 5: Verification + DONE reconciliation
- [ ] Reconcile C7 (shutdown-summary) as already shipped (commit `46812f12a8`, `fanout-run.cjs:510-541`) — record evidence, do NOT re-implement
- [ ] `node --check` on every touched `.cjs`
- [ ] deep-loop-runtime focused test suite green (capture baseline first per regression-baseline rule)
- [ ] `validate.sh --strict` on this sub-phase
- [ ] Adversarial review pass on C2 (gaming/backward-safety) and C5 (dedup-clobber) — the two highest-blast hunks

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/Fixture | graph-novelty delta; STOP gate (gaming / legitimate-low / no-op / insight-only); lag tripwire boundary; keep-both retain+order+collapse; contradiction record; heartbeat cadence + disable | deep-loop-runtime vitest / fixtures |
| Syntax | every touched `.cjs` parses | `node --check` |
| Regression | full convergence + fanout suite green vs captured baseline; absent-novelty path byte-identical; heartbeat-disabled behaves as today | existing suite |
| Adversarial | independent seat tries to refute C2's anti-gaming `max()` + backward-safe no-op, and C5's keep-both vs a downstream dedup clobber | cli-codex/opus review seat |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 030 pool gauges (`46812f12a8`) | Internal (shipped) | Green | C3 enforces against the shipped `lag`/`pending`/`failed` gauges; confirmed present |
| 030 graceful-self-stop (`46812f12a8`) | Internal (shipped) | Green | C7 IS this work — recorded DONE, not re-built (`fanout-run.cjs:510-541`) |
| `convergence.cjs` snapshot load/persist (`:338,:390-399`) | Internal | Green | C1's delta substrate; confirmed present |
| 001 total-comparator + content-derived-id discipline | Internal | INFERRED call site | C4 ordering; confirm the exact 001 helper before the tie-break |
| `coverage-graph-query.ts:221` CONTRADICTS primitive | Internal | Green | C5's write primitive; confirmed real |
| Orchestrator rolling-ratio forwarding | Internal | UNKNOWN | C2 may need `reduce-state.cjs` extended to pass `--reported-novelty` (open Q) |
| D2 reliability signal | None | N/A | Cluster is explicitly independent — no block |

### Shared-infra note
The graph-novelty corroboration (C1/C2) is a **STOP-gating analogue** of the convergence-hardening spine, but it is NOT the Beta-posterior anti-flood (D2/D1) — that anti-flood primitive is shared with Skill Advisor C4 and is OUT OF SCOPE here. The content-derived total-comparator (C4) is the SAME shared determinism discipline the sibling resilience sub-phase and the 030 merge total-order use (roadmap §4 shared-infra). This sub-phase does NOT build a shared module — each seam differs — but reuses the existing `compareByContentThenId` (`fanout-merge.cjs:28-47`) rather than forking a new comparator.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: C2 false-blocks a legitimate STOP, the lag tripwire fires spuriously, keep-both is clobbered/duplicates a record, or the heartbeat floods the ledger.
- **Procedure**: each PENDING candidate is a separate scoped commit on the branch (never pushed to main without explicit go); `git revert` the offending candidate's commit. C1 (helper-only) and C6 (default-off emitter) are the lowest-blast and revert cleanly; C2 (STOP gate) and C5 (record/dedup) are the higher-blast hunks and revert independently of C1/C3/C4/C6. C7 has nothing to revert (already shipped in 030).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (C1 audit ──> C2 consumption)
Phase 2 (C3 backpressure enforcement)          [independent]
Phase 3 (C4 keep-both ──> C5 record)
Phase 4 (C6 progress heartbeat)                [independent]
        │  all feed
        ▼
Phase 5 (Verify + C7 DONE reconciliation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 (C1 → C2) | snapshot substrate (shipped) | 5 |
| 2 (C3) | 030 gauges (shipped) | 5 |
| 3 (C4 → C5) | content-comparator (present), CONTRADICTS primitive (present) | 5 |
| 4 (C6) | None | 5 |
| 5 (Verify) | 1, 2, 3, 4 | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Research effort tag | Note |
|-----------|---------------------|------|
| C1 newInfoRatio-audit | M | net-new graph-novelty delta from already-loaded state; the headline gap |
| C2 newInfoRatio-consumption | M | net-new blocking STOP guard; anti-gaming `max()`; backward-safe no-op (the higher-blast hunk) |
| C3 Q4-backpressure-enforcement | M | additive `lag_ceiling` tripwire on shipped gauges; advisory return preserved |
| C4 cross-lineage-contradiction (keep-both) | M | reuse the existing content-comparator; retain both vs first-seen-wins |
| C5 cross-lineage-contradiction-record | M | CONTRADICTS marker; unlocated keep-both anchor / dedup-clobber confirm first |
| C6 progress-heartbeat | S | thin periodic emitter; default-off until benchmarked |
| C7 shutdown-summary-heartbeat | S | **already shipped** (`46812f12a8`) — zero new effort |

> Effort tags are structural inference; all PENDING candidates are NEEDS-BENCHMARK (the floor/tolerance, `lag_ceiling`, keep-both leverage, and heartbeat cadence need calibration). The cluster is Level 2 (100-499 LOC band) but each candidate is independently small; the risk on C2 (STOP-gate correctness) and C5 (dedup-clobber) is the reason for the adversarial verify gate, not LOC.

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured: current deep-loop-runtime convergence + fanout test counts (regression-baseline rule)
- [ ] Branch-only; nothing pushed/deployed without explicit user go
- [ ] Each PENDING candidate in its own scoped commit
- [ ] Floor/tolerance, `lag_ceiling`, and heartbeat cadence start at conservative / disabled defaults (no live behavior change until benchmarked)

### Rollback Procedure
1. Identify the offending candidate's commit (one candidate per commit)
2. `git revert <commit>` — C1/C6 are additive/default-off and revert cleanly; C2/C5 revert independently
3. Re-run `node --check` + the convergence/fanout suite to confirm baseline restored
4. No data migration to reverse (graph snapshots + JSONL ledgers + config only; no DB schema change)

<!-- /ANCHOR:enhanced-rollback -->
