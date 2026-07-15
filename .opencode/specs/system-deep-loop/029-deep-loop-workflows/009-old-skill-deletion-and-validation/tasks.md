---
title: "Tasks: Old-skill deletion and full-surface validation"
description: "Tasks for phase 009 of the deep-loop-workflows merge: Old-skill deletion and full-surface validation."
trigger_phrases:
  - "deep-loop-workflows phase 009"
  - "old-skill-deletion-and-validation"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/009-old-skill-deletion-and-validation"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 009 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-009-old-skill-deletion-and-validation-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Old-skill deletion and full-surface validation

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

- [ ] T001 Confirm phase 001 baseline evidence and phase 008 green handoff before starting finalization. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/**`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/008-framework-docs-sweep/**`)
- [ ] T002 Verify merged hub shape and recursive graph-metadata invariant. (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/mode-registry.json`)
- [ ] T003 Run pre-delete stale old-skill reference scan. (`**/*`)
- [ ] T004 Extend /doctor deep-loop to cover council-graph.sqlite as well as deep-loop-graph.sqlite. (`.opencode/commands/doctor/assets/doctor_deep-loop.yaml`, `.opencode/commands/doctor/_routes.yaml`)
- [ ] T005 Validate existing runtime council CLI support used by /doctor. (`.opencode/skills/deep-loop-runtime/scripts/{status.cjs,query.cjs,convergence.cjs}`, `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`)
- [ ] T006 Delete exactly the five old deep-loop workflow skill directories. (`.opencode/skills/deep-ai-council/`, `.opencode/skills/deep-context/`)
- [ ] T007 Rebuild advisor skill graph after deletion. (`.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`)
- [ ] T008 Run advisor routing validation for skill plus mode output. (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`)
- [ ] T009 Verify native agent mirror parity after deletion. (`.opencode/agents/{deep-context,deep-research,deep-review,deep-improvement,deep-ai-council}.md`, `.claude/agents/{deep-context,deep-research,deep-review,deep-improvement,deep-ai-council}.md`)
- [ ] T010 Rerun phase-001 parity harness after deletion. (`.opencode/commands/deep*.md`, `.opencode/commands/deep*/**`)
- [ ] T011 Verify discriminator and frozen backend invariants. (`.opencode/skills/deep-loop-workflows/mode-registry.json`, `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`)
- [ ] T012 Record final evidence and run strict spec validation. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/009-old-skill-deletion-and-validation/checklist.md`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/009-old-skill-deletion-and-validation/implementation-summary.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the parity check: After deletion, consume the phase-001 baseline manifest and rerun the same single-executor normalized capture for all five modes and seven /deep:* commands. Require byte-identical normalized artifact hashes for modes and commands; advisor parity is behavior-preservation with skill=deep-loop-workflows plus concrete mode, rejectedEdges=0, and no old skill winners.
- [ ] T016 `validate.sh --strict` on this phase folder
- [ ] T017 Confirm the phase success criteria in `spec.md` are met

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
