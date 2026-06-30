---
title: "Tasks: P0 MVP — reusable config-driven benchmark framework"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "p0 mvp benchmark framework tasks"
  - "sweep-benchmark tasks"
  - "config-driven benchmark tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/002-p0-mvp-implementation"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored P0 MVP task list"
    next_safe_action: "MVP complete; P1 reliability tier (003) underway"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-001-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: P0 MVP — reusable config-driven benchmark framework

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author `sk-prompt/assets/framework-registry.json` — 5 frameworks (rcaf/race/cidi/tidd-ec/costar) as data (id/description/applies_to/template/slots/output_contract)
  - **Evidence**: `jq` confirms 5 framework ids (rcaf, race, cidi, tidd-ec, costar); consumed by the renderer + sweep
- [x] T002 Author `lib/framework-renderer.cjs` — slot interpolation + required-slot validation (throws a clear error at validate-time on a missing slot)
  - **Evidence**: `node --check` OK; foundation tests assert slot fill + missing-slot rejection
- [x] T003 Author `lib/profile-validator.cjs` — dependency-free enum/required-key/weights-sum validation of additive profile keys (`mode`, `models[]`, `frameworks[]`, `variants[]`, `fixtureSelection`, `scoring{dimensions,correctnessGate}`, `sampling`, `reporting`)
  - **Evidence**: `node --check` OK; foundation tests assert unknown-enum + bad-weights rejection
- [x] T004 Author `lib/sweep-stats.cjs` (`mean/median/mad/quantile/seededRandom` + verdict helper) + T3 fixtures `benchmark-fixtures/{t3-bugfix-in-context,t3-strict-acceptance}.json` (hidden deterministic oracles; ids `t3-lower-bound` / `t3-compare-versions`, tier T3)
  - **Evidence**: `node --check` + `jq` valid; foundation tests assert seeded determinism + the insufficient-n verdict floor
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author `sweep-benchmark.cjs` — matrix expander over `models × variants × frameworks × fixtures × samples` with NO mode-specific branches; dispatch each cell via the existing (unmodified) `dispatch-model.cjs` (mock-capable); score via `lib/code-task-scorer.cjs`
  - **Evidence**: a runtime test strips `mode` from a profile and asserts identical cell count (no mode branch); CLI smoke run produces 30 rows / 10 cells for framework-bakeoff
- [x] T006 Author `lib/correctness-gate.cjs` — gate eligibility on `pass_rate ≥ threshold` (default 1.0), then rank survivors on efficiency/format/reasoning; once correctness saturates, `ranking_key` moves off correctness
  - **Evidence**: a saturation test (correct code for every framework → every group correctness_mean===1) asserts `correctness_saturated===true` and `ranking_key !== 'correctness'`
- [x] T007 Author the example profiles `benchmark-profiles/{framework-bakeoff,model-vs-model.json}` proving the config-only mode switch (bakeoff: 5 frameworks × 1 model; model-vs-model: 1 framework × 3 models) + `lib/code-task-scorer.cjs`
  - **Evidence**: `jq` valid; both profiles run through the same `runSweep`/`expandCells` path with only the multi-value axis differing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Author `lib/sweep-reporter.cjs` — `aggregate.json` (per-groupBy n/mean/median/saturation/top-pair-delta/verdict) + `synthesis.md` with the trust verdict + saturation status BEFORE the leaderboard
  - **Evidence**: the synthesis writes `## Trust verdict` then `## Saturation status` then `## Leaderboard`; an acceptance test asserts the verdict text precedes any leaderboard text
- [x] T009 Author vitest suites `tests/{sweep-foundation,sweep-runtime,sweep-acceptance}.vitest.ts`; assert both modes from config, saturation-cannot-win, verdict-before-leaderboard, and a real trustworthy WINNER on the efficiency axis
  - **Evidence**: saturation test asserts verdict ∈ {TIE, INCONCLUSIVE} (never a correctness WINNER); a real-winner test proves a WINNER on efficiency (margin 60 > noise floor 0, n=3) while correctness stays gated
- [x] T010 Verify: `npx vitest run model-benchmark/tests/` (106 passed / 9 files = 56 Lane B + 50 new); `node --check` on every new `.cjs`; `jq` on every new JSON; CLI smoke run; `validate.sh --strict` on 001; reconcile spec.md Status + continuity
  - **Evidence**: 106 passed (9 files); CLI smoke run produced `results.json` + `aggregate.json` + `synthesis.md` with the verdict before the leaderboard; Lane B's 56 tests stayed green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
