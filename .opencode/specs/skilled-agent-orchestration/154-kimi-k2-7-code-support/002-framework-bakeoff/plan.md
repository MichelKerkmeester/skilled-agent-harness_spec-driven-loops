---
title: "Implementation Plan: Phase 2: framework-bakeoff [template:level_1/plan.md]"
description: "Clone the canonical framework-bakeoff profile, retarget it to kimi-k2.7-code and real fixtures, then run the model-benchmark lane with an LLM judge to produce a verdict."
trigger_phrases:
  - "kimi bakeoff plan"
  - "model-benchmark profile clone"
  - "framework bakeoff execution"
  - "run 006 plan"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-kimi-k2-7-code-support/002-framework-bakeoff"
    last_updated_at: "2026-06-15T11:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan executed; bakeoff 006 ran, verdict TIE"
    next_safe_action: "Phase 003 promotes the TIE finding into registry"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/framework-bakeoff.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: framework-bakeoff

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON profile config + deep-loop model-benchmark lane (Node/TypeScript) |
| **Framework** | `/deep:model-benchmark` command over `deep-loop-workflows` deep-improvement |
| **Storage** | Run outputs under `.opencode/skills/sk-prompt-small-model/benchmarks/006-kimi-k2.7-prompt-framework/` |
| **Testing** | 5-dim scorer with LLM judge + correctness gate; verdict in `synthesis.md` |

### Overview
Clone the canonical `framework-bakeoff.json` into a kimi-specific profile, retarget its `models` to `kimi-for-coding/k2p7` and its `fixtures` to files that actually exist under `benchmark-fixtures/`, then run the model-benchmark lane with the full five-framework set, a 5-dim scorer, and a non-Kimi LLM judge. The model-under-test only GENERATES candidate outputs (read-only generation); the command owns dispatch, scoring, and state. Output is a per-framework leaderboard and a WINNER/TIE/INCONCLUSIVE verdict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 complete: `kimi-k2.7-code` present in `model-profiles.json` with `default-unverified` RCAF
- [x] `kimi-for-coding/k2p7` slug re-verified via `opencode models kimi-for-coding`
- [x] Target fixtures confirmed to exist under `benchmark-fixtures/`

### Definition of Done
- [x] Profile created and points only at real fixtures
- [x] Run `006-kimi-k2.7-prompt-framework` completed with `aggregate.json` / `results.json` / `synthesis.md`
- [x] Verdict (TIE) + leaderboard recorded; correctness gate not silently saturated (saturation surfaced explicitly)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-driven benchmark sweep: one profile JSON drives a framework bakeoff over a single model across multiple fixtures, scored per-dimension by an LLM judge gated on correctness.

### Key Components
- **`kimi-k2.7-frameworks.json`**: The bakeoff profile - sets `models` (kimi only), `frameworks` (all five), `fixtures` (real), `scoring` (5dim + correctness gate).
- **`/deep:model-benchmark:auto`**: The command lane that materializes fixtures, dispatches the model-under-test to generate candidates, grades with the LLM judge, records state, and writes outputs.
- **LLM judge (`openai/gpt-5.5`)**: Non-Kimi grader that scores generated candidates 5-dim, avoiding self-grading bias.

### Data Flow
The profile selects fixtures and frameworks; the command renders each fixture under each framework, dispatches `kimi-for-coding/k2p7` to generate a candidate per cell, passes candidates to the LLM judge for 5-dim scoring behind the correctness gate, then aggregates into a leaderboard and verdict under the run output folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase is a benchmark execution, not a bug fix or a deep-review remediation. It creates one new profile file and consumes the model-benchmark lane unchanged; it touches no security, path-handling, env-precedence, schema-boundary, persistence, public-response, or shared-policy surface. The only write outside the run output folder is the new profile `kimi-k2.7-frameworks.json`, which adds a config and changes no existing behavior. Registry and reference-doc edits are deferred to Phase 003 and are out of scope here.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-verified the live slug with `opencode models kimi-for-coding`
- [x] Confirmed target fixtures exist under `benchmark-fixtures/`
- [x] Read `framework-bakeoff.json` as the clone base

### Phase 2: Core Implementation
- [x] Created `kimi-k2.7-frameworks.json` cloned from `framework-bakeoff.json`
- [x] Set `models` to `[{ "executor":"cli-opencode", "provider":"kimi-for-coding", "model_slug":"k2p7", "variant":"default" }]`
- [x] Set `frameworks` to `["rcaf","race","cidi","tidd-ec","costar"]` and `fixtures` to real files only

### Phase 3: Verification
- [x] Ran the bakeoff via the deep-loop **sweep** engine, run-label `006-kimi-k2.7-prompt-framework`, plus a standalone gpt-5.5 LLM-judge secondary pass. **Deviation:** the plan's `--grader=llm` flag is incompatible with the sweep engine (deterministic oracle, no LLM-judge hook; `--grader llm` lives on a different engine that does not sweep frameworks) — code-verified, documented
- [x] Confirmed `aggregate.json` / `results.json` / `synthesis.md` exist; the correctness gate did NOT silently saturate (saturation surfaced; ranked on efficiency)
- [x] Recorded the verdict (TIE) + per-framework leaderboard for Phase 003
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Correctness gate | Per-fixture assertion pass before scoring counts | `correctnessGate` threshold 1.0 in the profile |
| Scoring | 5-dimension graded scoring per framework per fixture | `5dim` scorer + `openai/gpt-5.5` LLM judge |
| Aggregate verdict | Per-framework leaderboard + WINNER/TIE/INCONCLUSIVE | `aggregate.json` + `synthesis.md` from the run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `kimi-for-coding/k2p7` slug + pool | External | Green (smoke-tested 2026-06-15) | No model-under-test to generate candidates |
| `/deep:model-benchmark` lane | Internal | Green | No bakeoff execution path |
| `framework-bakeoff.json` clone base | Internal | Green | No canonical profile to clone |
| Non-Kimi LLM judge (`openai/gpt-5.5`) | External | Green | Self-grading bias or no scoring |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The bakeoff fails to dispatch, the correctness gate saturates without a discriminator, or the run cannot complete five iterations.
- **Procedure**: Delete the run output folder `006-kimi-k2.7-prompt-framework/` and the new profile if it is broken; the registry is untouched (Phase 003 owns it), so no production guidance changes. Re-verify the slug and fixtures, then re-run.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
