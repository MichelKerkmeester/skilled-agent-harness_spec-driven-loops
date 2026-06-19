---
title: "Tasks: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)"
description: "Task breakdown for the deep-loop resilience GO cluster: failure-class taxonomy (C1) gates transient/fatal classification (C2) which gates the bounded single-lineage retry (C3); orphan-lineage reset (C4) and recover-vs-fresh gate (C5) are independent resume-time guards. All five resilience candidates are implemented and verified."
trigger_phrases:
  - "fanout failure recovery tasks"
  - "transient fatal retry tasks"
  - "orphan lineage reset tasks"
  - "deep loop resilience tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/003-fanout-failure-recovery"
    last_updated_at: "2026-06-19T12:10:00+02:00"
    last_updated_by: "codex"
    recent_action: "Implemented C1-C5 and updated task evidence"
    next_safe_action: "Ready for handoff"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

**Candidate map**: C1 = DL-failure-class-taxonomy · C2 = Q3-fanout-recovery (transient/fatal classification) · C3 = Q3-fanout-transient-fatal-retry · C4 = DL-orphan-lineage-reset · C5 = DL-recover-vs-fresh-gate. All five are DONE; the prerequisite 030 infra is pre-checked `[x]` with commit evidence.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Prerequisite infra (SHIPPED in 030 — pre-checked, not re-implemented)
- [x] T001 030 Wave-0 Deep-Loop trio shipped: pool gauges (`lag`/`pending`/`failed`) + deterministic merge total-order + graceful-self-stop (`fanout-pool.cjs`, `fanout-merge.cjs`, `fanout-run.cjs`) [commit `46812f12a8`; 58 fanout tests pass; §14 cand 12]
- [x] T002 Confirmed 030 did NOT ship failure-class before this phase: `settleItem` returned `error:{name,message}` only and `buildPoolSummary` emitted no per-class rollup, so C1 and everything gated on it was genuinely pending before implementation [verified current source + commit `46812f12a8` body]
- [x] T003 Source seams re-confirmed against current code: class computed-then-discarded (`fanout-run.cjs:639-654`), dispatch-once pump (`fanout-pool.cjs:171-212`), started-without-terminal ledger (`:82-126`), resume status default `initialized` (`reduce-state.cjs:434`), resumed/restarted-only events (`:344,:393`) [verified — all spec seams accurate]

### Implementation setup
- [x] T004 Capture regression baseline: current deep-loop-runtime fanout test count before any edit — baseline `npm run typecheck` passed and fanout-related runtime suite passed 5 files / 96 tests [15m]
- [x] T005 Read the full settle/pump/summary path before editing: `fanout-pool.cjs:84-258` + `fanout-run.cjs:620-660` (the `{timedOut, exitCode, salvage}` failure object) [20m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C1 — Failure-class taxonomy (the gate) [DONE] (REQ-C1)
- [x] T006 Add a bounded `failure_class ∈ {timeout, exit, salvage_miss}` to `settleItem`'s rejected result, derived from the upstream `timedOut`/`exitCode`/`salvage` it currently discards; additive — preserved existing `error:{name,message}` (`fanout-pool.cjs`) [30m]
- [x] T007 Thread the upstream `{timedOut, exitCode, salvage}` from the lineage worker through to the settle path so the label can be derived without re-deriving (`fanout-run.cjs` → pool) [20m]
- [x] T008 Add a per-class rollup to `buildPoolSummary` (low-cardinality, fixed label set; additive to the existing `total/succeeded/failed/all_failed/gauges` shape) (`fanout-pool.cjs`) [20m]

### C2 — Transient/fatal classification [DONE] (REQ-C2)
- [x] T009 Implement a transient/fatal classifier from `timedOut`/exit-code/salvage signals ONLY (no D2/reliability input); default-conservative: unknown → fatal so a misclassification cannot loop. Sited beside `classifyExitCode` in `lib/cli-guards.cjs` [45m]

### C3 — Bounded single-lineage retry [DONE] (REQ-C3, REQ-C6)
- [x] T010 Re-dispatch a transient-classified lineage ALONE in `runCappedPool` (not all siblings), up to a durable `max_retries` (default 5, config-overridable), with the attempt count read from `orchestration-status.log` `retry_scheduled` rows so a crash does NOT hand a fresh budget [1h]
- [x] T011 Guarantee count-correctness: a retry-success flips the lineage to succeeded and is NOT counted in `summary.failed`; a retry-exhaustion surfaces as a genuine failure with the correct run exit-code [45m]

### C4 — Orphan-lineage reset (resume-time) [DONE] (REQ-C4)
- [x] T012 [P] On resume, detect lineages that started without a terminal event using the started-without-terminal ledger gap, and mark/requeue them (GO half: detect + marker). Auto-redispatch remains lease/heartbeat-gated as planned (`fanout-pool.cjs`, `fanout-run.cjs`) [1h]

### C5 — Recover-vs-fresh gate (resume-time) [DONE] (REQ-C5)
- [x] T013 [P] Add a validate-existing-state resume gate that REFUSES a missing/empty/corrupt expected JSONL state instead of silently fresh-initializing. Implemented as explicit `--require-existing-state` / `requireExistingState`; legitimate fresh reducer path remains unchanged (`reduce-state.cjs`) [1h]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T014 C1: each of timeout / exit / salvage_miss produces the right bounded label; the `buildPoolSummary` per-class rollup counts are correct (`fanout-pool.vitest.ts`) [30m]
- [x] T015 C2: the transient/fatal verdict table — timeout→transient, salvage-miss→transient, recognized-fatal exit→fatal, unknown→fatal (default-conservative) (`fanout-pool.vitest.ts`) [30m]
- [x] T016 C3: retry-success (not counted failed, lineage flips succeeded), retry-exhaustion (counts failed), mixed transient/fatal batch, all-fatal regression-equivalence to today's single-dispatch path (`fanout-pool.vitest.ts`, `fanout-run.vitest.ts`) [45m]
- [x] T017 C3: durable budget — attempt count read from the ledger/audit; a simulated crash-replay does NOT reset `max_retries` (`fanout-pool.vitest.ts`) [30m]
- [x] T018 [P] C4: orphan detection + marker on a started-without-terminal ledger; never silently treated as succeeded or failed (`fanout-pool.vitest.ts`) [30m]
- [x] T019 [P] C5: refuse-on-missing, refuse-on-empty/zero-byte, refuse-on-corrupt; a legitimate first-ever fresh start is unaffected (`deep-research-reduce-state.vitest.ts`) [30m]

### Syntax & Regression
- [x] T020 `node --check` on every touched `.cjs` (`fanout-pool.cjs`, `fanout-run.cjs`, `lib/cli-guards.cjs`, `reduce-state.cjs`) [10m]
- [x] T021 Full deep-loop-runtime fanout suite green vs the T004 baseline; broad related runtime suite passed 49 files / 403 tests after implementation, up from baseline focused 5 files / 96 tests, with original fanout files still green [20m]

### Adversarial & Spec Validation
- [x] T022 External adversarial review seat skipped per user instruction for code + unit tests only; local adversarial tests cover retry-success, retry-exhaustion, fatal no-retry, durable budget, salvage-miss retry, and all-fatal behavior [30m]
- [x] T023 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/003-fanout-failure-recovery --strict` passes with 0 errors / 0 warnings [10m]

### Documentation
- [x] T024 Update spec.md §3 SCOPE status column to DONE per candidate; commit hash intentionally omitted because this run is no-commit by user instruction [15m]
- [x] T025 Complete implementation-summary.md (per-candidate outcome, validation evidence, count-correctness proof) [20m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 acceptance criteria met: REQ-C1, REQ-C2, REQ-C3, REQ-C5 + count-correctness
- [x] REQ-C4 (orphan detect + marker) met; auto-redispatch remains explicitly deferred behind the planned lease/heartbeat gate
- [x] No new dependency on the absent D2 / reliability signal introduced anywhere (SC-003)
- [x] `node --check` + deep-loop-runtime focused tests green vs baseline (SC-004)
- [x] `validate.sh --strict` on this sub-phase passes (SC-004)
- [x] Each candidate is independently reversible by file-level diff; no scoped commits created because user instructed no git commit
- [x] No `[B]` blocked tasks remaining

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent research**: `../research/research.md`; resilience detail in `../research/iterations/iteration-007.md`, `iteration-012.md`, `iteration-013.md`
- **Cross-cutting roadmap / synthesis**: `../../research/roadmap.md`; `../../research/synthesis/01-go-candidates.md` (Deep-Loop recovery/resilience cluster, lines 91-101)
- **Shipped record (Wave-0)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 candidate 12 (commit `46812f12a8` — gauges/merge/graceful-self-stop; explicitly NOT failure-class)

<!-- /ANCHOR:cross-refs -->
