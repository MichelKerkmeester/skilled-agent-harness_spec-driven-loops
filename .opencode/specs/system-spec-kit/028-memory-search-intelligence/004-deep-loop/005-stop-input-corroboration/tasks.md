---
title: "Tasks: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster)"
description: "Task breakdown for the deep-loop STOP-input corroboration cluster. C1 through C6 are implemented in deep-loop-runtime with deterministic tests; live benchmark calibration, workflow reported-novelty forwarding and namespace-aware graph-edge persistence remain explicit gates. C7 was already shipped in packet 030."
trigger_phrases:
  - "newInfoRatio corroboration tasks"
  - "graph novelty gate tasks"
  - "lag ceiling enforcement tasks"
  - "deep loop stop hardening tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/005-stop-input-corroboration"
    last_updated_at: "2026-06-19T13:46:00+02:00"
    last_updated_by: "codex"
    recent_action: "Implemented and tested deep-loop-runtime C1-C6 runtime seams"
    next_safe_action: "Calibrate benchmark gates and wire workflow reported-novelty forwarding"
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
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Tasks: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster)

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

**Candidate map**: C1 = DL-newInfoRatio-audit · C2 = DL-newInfoRatio-consumption · C3 = Q4-backpressure-enforcement · C4 = DL-cross-lineage-contradiction (keep-both) · C5 = DL-cross-lineage-contradiction-record · C6 = DL-progress-heartbeat · C7 = DL-shutdown-summary-heartbeat. **C1-C6 are runtime-implemented; benchmark/default-on and workflow/persistence gates remain pending where noted. C7 is DONE** (shipped via 030 graceful-self-stop, commit `46812f12a8`) and its tasks are pre-checked `[x]` with commit evidence.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Prerequisite infra (SHIPPED in 030 — pre-checked, not re-implemented)
- [x] T001 030 Wave-0 Deep-Loop trio shipped: pool gauges (`lag`/`pending`/`failed`) + deterministic merge total-order + graceful-self-stop (`fanout-pool.cjs`, `fanout-merge.cjs`, `fanout-run.cjs`) [commit `46812f12a8`; 58 fanout tests pass; §14 cand 12]
- [x] T002 **C7 DONE — DL-shutdown-summary-heartbeat shipped**: SIGINT/SIGTERM flushes a distinct `stopped`-marked partial summary (`fanout-run.cjs:510-541` — `writeStoppedSummary` emits `event:'stopped'` to the ledger + `writeOrchestrationSummary({stopped:true, status:'partial', ...gauges})`) [commit `46812f12a8`; verified current source]
- [x] T003 Confirmed 030 did NOT ship newInfoRatio consumption: `convergence.cjs:285` STOP reason still reads "pending newInfoRatio agreement" and the decision args (`:298-322`) exclude any novelty input — so C1/C2 are genuinely PENDING [verified current source]
- [x] T004 Source seams re-confirmed against current code: novelty non-consumption (`convergence.cjs:285,298-322,330-331,378-381`; snapshots `:338,390-399`), cost-guards advisory-only no `lag_ceiling` (`cost-guards.cjs:15-20,114-140`), merge first-seen-wins (`fanout-merge.cjs:66-82`), lock-TTL-only heartbeat (`loop-lock.cjs:24-26`) [verified — all spec seams accurate]

### Implementation setup
- [x] T005 Capture regression baseline: current deep-loop-runtime convergence + fanout test counts before any edit (regression-baseline rule). Evidence: baseline `npm run typecheck` failed with missing script; baseline broad related Vitest passed `6 files / 83 tests`. [15m]
- [x] T006 Read the full convergence decision path before editing: `convergence.cjs:280-400` (args, snapshot load/persist, `evaluate*` + `decisionReason`) and the `compute*FromData` emitters in `coverage-graph-signals.ts` [20m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C1 — newInfoRatio-audit (the headline gap) [PENDING] (REQ-C1)
- [x] T007 Implement `computeGraphNoveltyDelta(nodes, edges, snapshots)` = fraction of NEW FINDING/SOURCE/EVIDENCE_FOR nodes+edges since the prior persisted snapshot, from the graph state convergence already loads (never from the self-reported ratio); site it beside the `compute*FromData` emitters (`coverage-graph-signals.ts`) or inline in `convergence.cjs` [45m]
- [x] T008 Scope the delta to FINDING/SOURCE/EVIDENCE_FOR + mirror reduce-state's insight exemptions so legitimate low-novelty bookkeeping iterations are not penalized (`convergence.cjs:338,390-399`) [20m]

### C2 — newInfoRatio-consumption (the STOP gate) [PENDING] (REQ-C2)
- [x] T009 Thread a `--reported-novelty` arg into the decision; compute `effectiveNovelty = max(reportedNovelty, graphNoveltyDelta)` (anti-gaming) (`convergence.cjs:298-322`) [30m]
- [x] T010 Add the BLOCKING guard `novelty_self_report_unverified`: when `STOP_ALLOWED` would fire AND `reportedNovelty < threshold` BUT `graphNoveltyDelta > floor` → `STOP_BLOCKED`; an absent `--reported-novelty` is a strict no-op (byte-identical) (`convergence.cjs:191-223,285,378-381`) [30m]
- [ ] T011 Confirm the orchestrator forwards the reducer's rolling-ratio to `convergence.cjs`; if not, extend `reduce-state.cjs` to pass `--reported-novelty` (OPEN QUESTION — iter-18 WHAT-BREAKS) (`reduce-state.cjs`) [30m]. PENDING gate: runtime arg/guard is implemented; workflow forwarding is outside the requested deep-loop-runtime scope and was left unchanged.

### C3 — Q4-backpressure-enforcement [PENDING] (REQ-C3)
- [x] T012 [P] Add `lag_ceiling` (default 5s, config-overridable) to the guard config and meter it against the SHIPPED oldest-pending-lag gauge; on breach the loop honors the tripwire (warn tier). Preserve the advisory `evaluateCouncilCostGuards` return shape unchanged — additive enforced path only (`cost-guards.cjs:15-20,114-140`; gauges `fanout-pool.cjs:90,108,235-238`). Evidence: cost-guard evaluator plus fanout-pool default-off warning event. [1h]

### C4 — cross-lineage-contradiction keep-both [PENDING] (REQ-C4)
- [x] T013 Replace first-seen-wins dedup with keep-both on a same-id DIFFERENT-content collision; collapse to one on same-id IDENTICAL-content; order the retained pair via the existing content-derived total-comparator `compareByContentThenId` (never arrival order) (`fanout-merge.cjs:28-47,66-82`) [1h]

### C5 — cross-lineage-contradiction-record [PENDING] (REQ-C5)
- [x] T014 BEFORE relying on keep-both, confirm whether the merge or a downstream `upsert.cjs` dedupes by id/content_hash (an overwrite would clobber the kept-both pair) — iter-13 F13-04 unlocated keep-both anchor (`fanout-merge.cjs`, `upsert.cjs`). Evidence: runtime merge now rewrites divergent same-id records to content-derived ids before downstream upsert. [30m]
- [x] T015 Emit a CONTRADICTS / `_conflicts` marker for the kept-both pair. Evidence: runtime merge emits `_conflicts` entries with `relation: 'CONTRADICTS'`; namespace-aware graph-edge persistence remains a separate gate because `fanout-merge.cjs` has no graph namespace inputs. [45m]

### C6 — progress-heartbeat [PENDING] (REQ-C6)
- [x] T016 [P] Add a periodic in-lineage progress event at a configurable cadence (default `0`/disabled until benchmarked) in the `fanout-run.cjs` lineage worker; distinct from the lock-TTL heartbeat and the shutdown `stopped` marker (`fanout-run.cjs` worker, `loop-lock.cjs:24-26`) [45m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit / Fixture Tests
- [x] T017 C1: `computeGraphNoveltyDelta` on synthetic snapshot pairs — new FINDING/SOURCE/EVIDENCE counted; insight-only delta exempted (deep-loop-runtime test suite) [30m]
- [x] T018 C2 fixtures: gaming (high delta + `--reported-novelty 0.01` → NOT STOP_ALLOWED + `novelty_self_report_unverified` blocker); legitimate-low (flat delta + low report → STOP_ALLOWED); no-op (omit `--reported-novelty` → byte-identical); insight-only delta (not spuriously blocked) [45m]
- [x] T019 [P] C3: lag below / at / above `lag_ceiling` resolves deterministically (`>=` vs `>` explicit); the advisory cost-guard return is unchanged [30m]
- [x] T020 [P] C4/C5: same-id different-content keeps both + ordered canonically; same-id identical-content collapses to one (no spurious record); a CONTRADICTS marker is emitted; a downstream dedup does NOT clobber the kept-both pair. Evidence: kept-both records use content-derived ids before any downstream id-scoped upsert. [45m]
- [x] T021 [P] C6: heartbeat fires at cadence on a long lineage; `0` disables (regression-equivalent); a fast lineage emits no spurious heartbeat [30m]

### Syntax & Regression
- [x] T022 `node --check` on every touched `.cjs` (`convergence.cjs`, `cost-guards.cjs`, `fanout-merge.cjs`, `fanout-pool.cjs`, `fanout-run.cjs`) [10m]
- [x] T023 Broad deep-loop-runtime convergence + fanout suite green vs the T005 baseline; the absent-`--reported-novelty` and heartbeat-disabled paths behave identically to today (regression-safe). Evidence: final broad related Vitest passed `7 files / 136 tests`; canonical `npm run typecheck` passed with 0 errors. [20m]

### Adversarial & Spec Validation
- [ ] T024 Adversarial review seat (cli-codex / opus) tries to refute C2's anti-gaming `max()` + backward-safe no-op and C5's keep-both vs a downstream dedup clobber (the two highest-blast hunks) [30m]. PENDING gate: not run in this code+unit-test-only pass.
- [x] T025 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/005-stop-input-corroboration --strict` passes. Evidence: strict validation passed with 0 errors / 0 warnings. [10m]

### Documentation
- [x] T026 Update spec.md §3 SCOPE status column to DONE per candidate as each lands; complete implementation-summary.md (per-candidate outcome, validation evidence, the C2 gaming/no-op proof, C7 already-shipped reconciliation). No commit hash because user requested no git commit. [20m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All runtime P0 acceptance criteria met: REQ-C1, REQ-C2, REQ-C3. Benchmark/default-on gates remain pending.
- [x] Runtime P1 set met (REQ-C4, REQ-C5, REQ-C6). Namespace-aware graph-edge persistence and heartbeat/default calibration remain pending gates.
- [x] C2 is byte-identical with `--reported-novelty` absent (SC-002); the gaming fixture does NOT STOP (SC-003)
- [ ] C7 (shutdown-summary) reconciled as already-shipped (commit `46812f12a8`), NOT re-implemented (SC-005)
- [ ] No new dependency on the absent D2 / reliability signal introduced anywhere (SC-004)
- [x] `node --check` + deep-loop-runtime focused tests green vs baseline (SC-006)
- [x] `validate.sh --strict` on this sub-phase passes (SC-006)
- [ ] Each PENDING candidate in its own scoped, independently revertible commit on the branch (no push without explicit go)
- [ ] No `[B]` blocked tasks remaining

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent research**: `../research/research.md`; STOP-corroboration detail in `../research/iterations/iteration-002.md`, `iteration-007.md`, `iteration-008.md`, `iteration-012.md`, `iteration-013.md`, `iteration-018.md`
- **Cross-cutting roadmap / synthesis**: `../../research/roadmap.md` (§5 item 2 newInfoRatio audit net-new gap); `../../research/synthesis/01-go-candidates.md` (STOP-residuals, lines 99-101); `03-corrections-caveats-and-residuals.md` (line 47 prose-loop-does-consume precision)
- **Sibling impl sub-phase**: `../003-fanout-failure-recovery/` (the resilience cluster complement)
- **Shipped record (Wave-0)**: Wave-0 record (commit `46812f12a8` — gauges/merge/graceful-self-stop; the graceful-self-stop instance is C7 DONE here)

<!-- /ANCHOR:cross-refs -->
