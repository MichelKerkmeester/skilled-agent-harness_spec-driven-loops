---
title: "Tasks: Framework documentation sweep"
description: "Tasks for phase 008 of the deep-loop-workflows merge: Framework documentation sweep."
trigger_phrases:
  - "deep-loop-workflows phase 008"
  - "framework-docs-sweep"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/008-framework-docs-sweep"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 008 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-008-framework-docs-sweep-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Framework documentation sweep

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

- [ ] T001 Preflight phase 007 completion and verify deep-loop-workflows hub metadata exists with no nested mode graph metadata. (`.opencode/specs/deep-loops/029-deep-loop-workflows/007-governance-consolidation/checklist.md`, `.opencode/specs/deep-loops/029-deep-loop-workflows/007-governance-consolidation/implementation-summary.md`)
- [ ] T002 Rewrite root Deep Loop sections and customization table to the two-skill architecture. (`README.md`)
- [ ] T003 Update the skills catalog counts and deep-loop family rows. (`.opencode/skills/README.md`)
- [ ] T004 Mirror-update framework policy docs for the new deep-loop workflow architecture. (`CLAUDE.md`, `AGENTS.md`)
- [ ] T005 Rewrite runtime README from five consumer skills to one workflow skill with modes. (`.opencode/skills/deep-loop-runtime/README.md`)
- [ ] T006 Update constitutional deep workflow rule to name the merged workflow skill and preserved commands. (`.opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md`)
- [ ] T007 Update sibling related-skill and protocol-link docs for system-spec-kit and cli-opencode. (`.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/README.md`)
- [ ] T008 Stamp the merged hub v1.0.0 and preserve mode changelog history. (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`)
- [ ] T009 Handle Lane-D SYNC.md and optional loop.py doc/comment surfaces if present. (`SYNC.md`, `loop.py`)
- [ ] T010 Run final stale-reference, validation, and parity gates. (`README.md`, `.opencode/skills/README.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the parity check: Use the phase-001 baseline manifest and harness to rerun all five mode artifact checks and eight /deep:* command-output checks before and after phase-008 edits; hashes must match byte-for-byte. Also prove the diff is documentation-only by restricting changed files to the phase-008 doc list and excluding command YAML, agents, runtime scripts/lib, advisor code, Barter contracts, description.json, and nested mode graph-metadata.json. Finally run stale skill-path grep for .opencode/skills/deep-{research,review,context,ai-council,improvement}/ across the phase-008 target docs, excluding approved changelog history.
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
