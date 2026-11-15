---
title: "Implementation Plan: Phase 18: research-duration-check"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "research duration check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: research-duration-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets |
| **Framework** | The deep-loop runtime |
| **Storage** | JSONL state logs |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
Move one step block in the deep-research loop so the duration check sits inside the part of the loop every pass runs. DeepSeek V4.1 Flash `--thinking max` makes the move in one dispatch; the conductor proves it is a pure move and runs the checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `(cd .skilled/skills/system-deep-loop/runtime && npm test)` shows no failure `scratch/baseline.txt` lacks
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The loop re-enters at `step_read_state`, so every per-pass check belongs after it.

### Key Components
- **`step_check_max_duration`**: reads the config's `createdAt` and `maxDurationMinutes`, and on a reached limit jumps to `phase_synthesis`.
- **`step_loop_decision`**: returns to `step_read_state` after each pass.

### Data Flow
Each pass reads state, checks the clock, then handles run-now, pause and convergence before dispatch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, move and recompile, then verify.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Duration step placement and command | `workflow-max-duration.vitest.ts` |
| Integration | Full runtime suite, contract drift | Existing suites and checkers |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 017 on origin/main | Internal | Green | None; the same pattern |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a research run stops early or skips a step it needs.
- **Procedure**: `git revert <sha>` on the 018 commit.
<!-- /ANCHOR:rollback -->

---
