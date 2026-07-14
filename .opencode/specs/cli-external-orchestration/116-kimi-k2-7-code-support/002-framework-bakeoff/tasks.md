---
title: "Tasks: Phase 2: framework-bakeoff [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "kimi bakeoff tasks"
  - "model-benchmark task list"
  - "framework bakeoff tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/002-framework-bakeoff"
    last_updated_at: "2026-06-15T11:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks done; bakeoff 006 ran, verdict TIE"
    next_safe_action: "Phase 003 promotes the TIE finding into registry"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-frameworks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: framework-bakeoff

<!-- SPECKIT_LEVEL: 1 -->

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

> **Status: COMPLETE.** Bakeoff `006-kimi-k2.7-prompt-framework` ran via the deep-loop sweep engine; 30/30 real `kimi-for-coding/k2p7` dispatches succeeded. Verdict: **TIE — correctness saturated**. All tasks below are checked with evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-verified the live slug `kimi-for-coding/k2p7` via `opencode models kimi-for-coding`; slug confirmed live for the run
- [x] T002 Confirmed target fixtures exist under `benchmark-fixtures/`; the run used the two T3 coding fixtures the engine reports as `t3-lower-bound` / `t3-compare-versions`
- [x] T003 [P] Read `framework-bakeoff.json` as the clone base (`.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/framework-bakeoff.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Created `kimi-k2.7-frameworks.json` cloned from `framework-bakeoff.json`
- [x] T005 Set `models` to `[{ "executor":"cli-opencode", "provider":"kimi-for-coding", "model_slug":"k2p7", "variant":"default" }]`
- [x] T006 Set `frameworks` to `["rcaf","race","cidi","tidd-ec","costar"]` and pointed `fixtures` at real T3 coding files; all five frameworks ran over both fixtures
- [x] T007 Kept scorer `5dim` + `correctnessGate` threshold 1.0; the JSON parses and the engine consumed it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Ran the bakeoff via the deep-loop **sweep** engine (`sweep-benchmark.cjs`, run-label `006-kimi-k2.7-prompt-framework`), then ran the gpt-5.5 LLM-judge as a standalone secondary pass over Kimi's real generations. **Deviation:** the plan's `--grader=llm` flag is architecturally incompatible with the framework-bakeoff engine (the sweep scores via a deterministic code oracle, no LLM-judge hook; `--grader llm` lives on the loop-host engine that does not sweep frameworks or dispatch the model-under-test — code-verified). Also drove `runSweep` programmatically with the correct `registryPath` to work around a registry-path bug, with no engine edit (scope lock). Both are documented deviations, not silent substitutions
- [x] T009 Confirmed `aggregate.json` / `results.json` / `synthesis.md` exist under `benchmarks/006-kimi-k2.7-prompt-framework/`; the correctness gate did NOT silently saturate — saturation was detected and surfaced (`correctness_saturated: true`), and the engine fell to `efficiency` as the ranking key
- [x] T010 Recorded the verdict (**TIE**, inside the noise floor) plus the per-framework leaderboard; folded the finding and the subjective secondary ranking into the Phase 003 hand-off
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Run output verified: verdict (TIE) + leaderboard present, correctness gate honest (saturation surfaced, not hidden)
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
