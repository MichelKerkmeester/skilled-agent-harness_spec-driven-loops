---
title: "Tasks: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)"
description: "Task breakdown for the deep-loop resilience GO cluster: failure-class taxonomy (C1) gates transient/fatal classification (C2) which gates the bounded single-lineage retry (C3); orphan-lineage reset (C4) and recover-vs-fresh gate (C5) are independent resume-time guards. Prerequisite 030 infra (gauges/merge/graceful-self-stop, commit 46812f12a8) is pre-checked as shipped; all five resilience candidates are PENDING."
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
    last_updated_at: "2026-06-19T08:10:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown (T001-T025); 5 candidates PENDING"
    next_safe_action: "Begin T004 baseline capture, then T006-T008 (C1 failure-class taxonomy)"
    blockers: []
    completion_pct: 0
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

**Candidate map**: C1 = DL-failure-class-taxonomy · C2 = Q3-fanout-recovery (transient/fatal classification) · C3 = Q3-fanout-transient-fatal-retry · C4 = DL-orphan-lineage-reset · C5 = DL-recover-vs-fresh-gate. All five are PENDING; the prerequisite 030 infra is pre-checked `[x]` with commit evidence.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Prerequisite infra (SHIPPED in 030 — pre-checked, not re-implemented)
- [x] T001 030 Wave-0 Deep-Loop trio shipped: pool gauges (`lag`/`pending`/`failed`) + deterministic merge total-order + graceful-self-stop (`fanout-pool.cjs`, `fanout-merge.cjs`, `fanout-run.cjs`) [commit `46812f12a8`; 58 fanout tests pass; §14 cand 12]
- [x] T002 Confirmed 030 did NOT ship failure-class: `settleItem` still returns `error:{name,message}` only and `buildPoolSummary` emits no per-class rollup (`fanout-pool.cjs:108-126,236-250`) — so C1 and everything gated on it is genuinely PENDING [verified current source + commit `46812f12a8` body]
- [x] T003 Source seams re-confirmed against current code: class computed-then-discarded (`fanout-run.cjs:639-654`), dispatch-once pump (`fanout-pool.cjs:171-212`), started-without-terminal ledger (`:82-126`), resume status default `initialized` (`reduce-state.cjs:434`), resumed/restarted-only events (`:344,:393`) [verified — all spec seams accurate]

### Implementation setup
- [ ] T004 Capture regression baseline: current deep-loop-runtime fanout test count (the 030 note says 58 pass) before any edit (regression-baseline rule) [15m]
- [ ] T005 Read the full settle/pump/summary path before editing: `fanout-pool.cjs:84-258` + `fanout-run.cjs:620-660` (the `{timedOut, exitCode, salvage}` failure object) [20m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C1 — Failure-class taxonomy (the gate) [PENDING] (REQ-C1)
- [ ] T006 Add a bounded `failure_class ∈ {timeout, exit, salvage_miss}` to `settleItem`'s rejected result, derived from the upstream `timedOut`/`exitCode`/`salvage` it currently discards; additive — preserve the existing `error:{name,message}` (`fanout-pool.cjs:108-126`) [30m]
- [ ] T007 Thread the upstream `{timedOut, exitCode, salvage}` from the lineage worker through to the settle path so the label can be derived without re-deriving (`fanout-run.cjs:639-654` → pool) [20m]
- [ ] T008 Add a per-class rollup to `buildPoolSummary` (low-cardinality, fixed label set; additive to the existing `total/succeeded/failed/all_failed/gauges` shape) (`fanout-pool.cjs:236-250`) [20m]

### C2 — Transient/fatal classification [PENDING] (REQ-C2)
- [ ] T009 Implement a transient/fatal classifier from `timedOut`/exit-code/salvage signals ONLY (no D2/reliability input); default-conservative: unknown → fatal so a misclassification cannot loop. Site it beside `classifyExitCode` in `lib/cli-guards.cjs` or as a small pure function in the pool (`fanout-run.cjs:639-654`, `lib/cli-guards.cjs`) [45m]

### C3 — Bounded single-lineage retry [PENDING] (REQ-C3, REQ-C6)
- [ ] T010 Re-dispatch a transient-classified lineage ALONE in `runCappedPool` (not all siblings), up to a durable `max_retries` (default 5, config-overridable), with the attempt count read from the durable ledger/audit so a crash does NOT hand a fresh budget (`fanout-pool.cjs:171-212`, `orchestration-status.log`) [1h]
- [ ] T011 Guarantee REQ-C6 count-correctness: a retry-success flips the lineage to succeeded and is NOT counted in `summary.failed`; a retry-exhaustion surfaces as a genuine failure with the correct run exit-code (`fanout-pool.cjs:236-250`, `fanout-run.cjs` exit path) [45m]

### C4 — Orphan-lineage reset (resume-time) [PENDING] (REQ-C4)
- [ ] T012 [P] On resume, detect lineages that started without a terminal event using the started-without-terminal ledger gap, and mark/requeue them (GO half: detect + marker). Leave auto-redispatch behind a lease/heartbeat (CAUTION — may be deferred per OPEN QUESTION) (`fanout-pool.cjs:82-126`, `reduce-state.cjs:344,393`, `loop-lock.cjs:186-188`) [1h]

### C5 — Recover-vs-fresh gate (resume-time) [PENDING] (REQ-C5)
- [ ] T013 [P] Add a validate-existing-state resume gate that REFUSES a missing/empty/corrupt expected JSONL state instead of silently fresh-initializing (status defaults to `initialized` today). The refusal MUST be distinguishable from a legitimate first-ever fresh start; mode flag vs inferred-from-config is decided at impl time (OPEN QUESTION) (`reduce-state.cjs:434,795`) [1h]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [ ] T014 C1: each of timeout / exit / salvage_miss produces the right bounded label; the `buildPoolSummary` per-class rollup counts are correct (deep-loop-runtime test suite) [30m]
- [ ] T015 C2: the transient/fatal verdict table — timeout→transient, recognized-fatal exit→fatal, unknown→fatal (default-conservative) [30m]
- [ ] T016 C3: retry-success (not counted failed, lineage flips succeeded), retry-exhaustion (counts failed, fatal exit-code), mixed transient/fatal batch, all-fatal regression-equivalence to today's single-dispatch path [45m]
- [ ] T017 C3: durable budget — attempt count read from the ledger/audit; a simulated crash-replay does NOT reset `max_retries` (NFR-R01) [30m]
- [ ] T018 [P] C4: orphan detection + marker on a started-without-terminal ledger; never silently treated as succeeded or failed [30m]
- [ ] T019 [P] C5: refuse-on-missing, refuse-on-empty/zero-byte, refuse-on-corrupt; a legitimate first-ever fresh start is unaffected [30m]

### Syntax & Regression
- [ ] T020 `node --check` on every touched `.cjs` (`fanout-pool.cjs`, `fanout-run.cjs`, `lib/cli-guards.cjs`, `reduce-state.cjs`) [10m]
- [ ] T021 Full deep-loop-runtime fanout suite green vs the T004 baseline; the all-fatal batch behaves identically to today (regression-safe) [20m]

### Adversarial & Spec Validation
- [ ] T022 Adversarial review seat (cli-codex / opus) tries to refute C2/C3 count-correctness and the unknown→fatal default (the iter-13 CAUTION) [30m]
- [ ] T023 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/003-fanout-failure-recovery --strict` passes [10m]

### Documentation
- [ ] T024 Update spec.md §3 SCOPE status column to DONE per candidate as each lands, with its scoped commit hash [15m]
- [ ] T025 Complete implementation-summary.md (per-candidate outcome, validation evidence, count-correctness proof) [20m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 acceptance criteria met: REQ-C1, REQ-C2, REQ-C3, REQ-C5 + REQ-C6 count-correctness
- [ ] REQ-C4 (orphan detect + marker) met, or its auto-redispatch half explicitly deferred with user approval (OPEN QUESTION)
- [ ] No new dependency on the absent D2 / reliability signal introduced anywhere (SC-003)
- [ ] `node --check` + deep-loop-runtime focused tests green vs baseline (SC-004)
- [ ] `validate.sh --strict` on this sub-phase passes (SC-004)
- [ ] Each candidate in its own scoped, independently revertible commit on the branch (no push without explicit go)
- [ ] No `[B]` blocked tasks remaining

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
