---
title: "Tasks: Command surface repoint"
description: "Tasks for phase 004 of the deep-loop-workflows merge: Command surface repoint."
trigger_phrases:
  - "deep-loop-workflows phase 004"
  - "command-surface-repoint"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/004-command-surface-repoint"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 004 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-004-command-surface-repoint-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Command surface repoint

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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read predecessor continuity and `../research/research.md` for this phase's scope
- [ ] T002 Load the phase-001 parity baseline for the affected modes/surfaces

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Gate phase inputs and freeze the rewrite manifest from mode-registry.json. (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/mode-registry.json`)
- [ ] T002 Repoint context command files. (`.opencode/commands/deep/start-context-loop.md`, `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml`)
- [ ] T003 Repoint research command files. (`.opencode/commands/deep/start-research-loop.md`, `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`)
- [ ] T004 Repoint review command files. (`.opencode/commands/deep/start-review-loop.md`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`)
- [ ] T005 Repoint AI Council command files. (`.opencode/commands/deep/ask-ai-council.md`, `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml`)
- [ ] T006 Repoint improvement Lane A/B YAML-backed command files. (`.opencode/commands/deep/start-agent-improvement-loop.md`, `.opencode/commands/deep/start-model-benchmark-loop.md`)
- [ ] T007 Repoint improvement Lane C/D markdown-only commands. (`.opencode/commands/deep/start-skill-benchmark-loop.md`, `.opencode/commands/deep/start-non-dev-ai-system-loop.md`)
- [ ] T008 Run integration grep and scope guard over the command surface. (`.opencode/commands/deep/**`)
- [ ] T009 Run phase-001 parity harness for all eight commands. (`phase-001 command baseline artifacts`, `temporary parity output outside repo or phase-owned scratch`)
- [ ] T010 Run final phase validation. (`.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/004-command-surface-repoint`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the parity check: Use the phase-001 baseline harness and artifacts for the same eight command scenarios, including Lane D dry-run-only. After repointing, run the identical harness with the same inputs and environment, then byte-compare stdout, stderr, generated config/state/report artifacts, and manifests via cmp or SHA-256; separately require rg to prove stale old skill package paths and old skill keys are gone while deep-loop-runtime references are unchanged.
- [ ] T014 `validate.sh --strict` on this phase folder
- [ ] T015 Confirm the phase success criteria in `spec.md` are met

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Parity check passed against the phase-001 baseline.
- [ ] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence**: `../research/research.md`, `../context/context-report.md`

<!-- /ANCHOR:cross-refs -->
