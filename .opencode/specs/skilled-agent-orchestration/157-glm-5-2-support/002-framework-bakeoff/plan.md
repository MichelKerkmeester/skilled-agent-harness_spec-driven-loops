---
title: "Implementation Plan: Phase 2: framework-bakeoff"
description: "Clone framework-bakeoff.json to glm-5.2 with strict adversarial validators, run /deep:model-benchmark with a non-GLM judge, and capture a verdict + leaderboard."
trigger_phrases:
  - "glm-5.2 framework bakeoff plan"
  - "model-benchmark glm-5.2"
  - "framework bakeoff strict validators"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/002-framework-bakeoff"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan scaffolded; not started"
    next_safe_action: "Create the bakeoff profile, then run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: framework-bakeoff

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON benchmark profile + deep-loop model-benchmark machinery |
| **Framework** | `/deep:model-benchmark` lane (deep-loop-workflows) |
| **Storage** | Run outputs under `sk-prompt-small-model/benchmarks/<run-label>/` |
| **Testing** | The bakeoff IS the test; correctness gate + 5dim scorer + LLM judge |

### Overview
Clone `framework-bakeoff.json` to `glm-5.2-frameworks.json`, retarget it to the live glm-5.2 slug and to **invalid-dominant strict validators** (so frameworks separate instead of saturating, the 149 run-007 lesson), then run `/deep:model-benchmark:auto` with a non-GLM LLM judge over the framework set (CRAFT + COSTAR + RACE + CIDI + TIDD-EC + RCAF). Capture the verdict + per-framework leaderboard for phase 3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 shipped (glm-5.2 registered, live slug confirmed)
- [x] Strict fixtures identified and present on disk
- [x] Non-GLM judge model chosen

### Definition of Done
- [x] Run completes; results.json + aggregate.json + synthesis.md written
- [x] Verdict + leaderboard recorded (or saturation → phase-4 hand-off documented)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Consume the model-benchmark lane as-is. The profile is DATA; the command owns iteration, scoring, judging, and synthesis. Mirror the sibling profiles (`kimi-k2.7-frameworks.json`, MiniMax/MiMo runs).

### Key Components
- **glm-5.2-frameworks.json**: the bakeoff profile (model-under-test, framework set, fixtures, scorer, judge).
- **`/deep:model-benchmark`**: the runner that dispatches each framework × fixture cell and grades them.
- **benchmarks/<run-label>/**: results, aggregate, synthesis.

### Data Flow
1. The profile names the model-under-test (glm-5.2), the framework set, and the strict fixtures.
2. The command dispatches each framework × fixture cell via cli-opencode.
3. The correctness gate + 5dim scorer + non-GLM judge grade each output.
4. Synthesis aggregates into a verdict + per-framework leaderboard.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-verify the live glm-5.2 slug (`opencode models <provider>`)
- [x] Pick the next free benchmark run number/label (`ls sk-prompt-small-model/benchmarks/`)
- [x] Clone `framework-bakeoff.json` → `glm-5.2-frameworks.json`; retarget model + frameworks (incl. `craft`) + strict fixtures

### Phase 2: Run
- [x] Run `/deep:model-benchmark:auto <profile> --spec-folder=<002 folder> --run-label=<next>-glm-5.2-prompt-framework --scorer=5dim --grader=llm --model=openai/gpt-5.5 --iterations=<n>`
- [x] Confirm the correctness gate did not silently saturate

### Phase 3: Verdict
- [x] Record the WINNER/TIE/INCONCLUSIVE verdict + per-framework leaderboard in synthesis.md
- [x] If saturated despite strict validators → document the hand-off to contingency phase 004
- [x] Write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | Per-framework correctness + 5dim | `/deep:model-benchmark` correctness gate + scorer |
| Judge | Non-GLM grading of outputs | `--grader=llm --model=openai/gpt-5.5` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (glm-5.2 registered) | Internal | Pending | No model-under-test to bake off |
| live glm-5.2 slug | External | To confirm | Bakeoff cannot dispatch |
| model-benchmark lane | Internal | Available | No runner |
| non-GLM judge model | External | Available | Self-grading bias risk |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Run misconfigured or judge biased.
- **Procedure**: Delete the run output folder + the profile; re-create and re-run. No production surface is touched by this phase (registry promotion is phase 3).
<!-- /ANCHOR:rollback -->
