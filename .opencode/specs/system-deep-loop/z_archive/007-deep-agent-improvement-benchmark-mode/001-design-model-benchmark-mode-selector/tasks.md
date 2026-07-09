---
title: "Tasks: deep-agent-improvement model-benchmark mode (build)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "benchmark mode build tasks"
  - "mode selector tasks"
  - "port rig tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/001-design-model-benchmark-mode-selector"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored build task list (for the follow-on)"
    next_safe_action: "Execute in a follow-on build packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/121-deep-agent-improvement-benchmark-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Design: add a model/prompt-framework benchmark mode to deep-agent-improvement (port the 120/003 rig behind a mode selector)

<!-- SPECKIT_LEVEL: 3 -->

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
> These tasks are for the follow-on BUILD packet; this packet only authors them.

## Phase 1: Setup

- [ ] T001 Port `eval-rig/` (fixtures + deterministic checks + grader) from 120/003 into `deep-agent-improvement/`
- [ ] T002 Generalize `dispatch-minimax.cjs` → `deep-agent-improvement/scripts/dispatch-model.cjs` (executor + model + args)
- [ ] T003 [P] Port `render-variant.cjs` + variant templates as the model-benchmark candidate source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `mode` + `modelBenchmarkConfig` to `improvement_config.json` (default `agent-improvement`)
- [ ] T005 Add the seam factory to `loop.cjs` (resolve candidate-source / dispatcher / scorer from `mode`)
- [ ] T006 Wire the model-benchmark scorer (port `score-variant.cjs` + the task-output rubric)
- [ ] T007 Extend `/deep:start-agent-improvement-loop` with `--mode=model-benchmark --executor= --model=` flags
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Regression-test the existing agent-improvement path (no change with `mode` unset)
- [ ] T009 Seam unit tests + one live model-benchmark smoke run on a small fixture subset
- [ ] T010 Update deep-agent-improvement SKILL.md identity + changelog; strict-validate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

