---
title: "Tasks: Agent mirror repoint"
description: "Tasks for phase 005 of the deep-loop-workflows merge: Agent mirror repoint."
trigger_phrases:
  - "deep-loop-workflows phase 005"
  - "agent-mirror-repoint"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/005-agent-mirror-repoint"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 005 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-005-agent-mirror-repoint-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Agent mirror repoint

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

- [ ] T001 Confirm phase 001 baseline, phase 003 registry, and phase 004 command repoint are complete before this phase starts. (`.opencode/specs/deep-loops/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/`, `.opencode/specs/deep-loops/029-deep-loop-workflows/003-merged-hub-and-mode-packets/`)
- [ ] T002 Confirm Codex TOML mirrors are hand-maintained for this phase. (`.codex/agents/README.txt`, `.codex/agents/*.toml`)
- [ ] T003 Build exact old-to-new path repoint map for the 15 target files only. (`.opencode/agents/deep-context.md`, `.opencode/agents/deep-research.md`)
- [ ] T004 Repoint deep-context loop-skill ownership to merged skill mode context. (`.opencode/agents/deep-context.md`, `.claude/agents/deep-context.md`)
- [ ] T005 Repoint deep-research protocol path. (`.opencode/agents/deep-research.md`, `.claude/agents/deep-research.md`)
- [ ] T006 Repoint deep-review protocol and reducer paths. (`.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`)
- [ ] T007 Repoint deep-improvement skill ownership row to merged improvement mode family. (`.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md`)
- [ ] T008 Repoint ai-council skill paths in lockstep. (`.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`)
- [ ] T009 Normalize and compare three-way mirror bodies for all five modes. (`.opencode/agents/deep-context.md`, `.opencode/agents/deep-research.md`)
- [ ] T010 Validate Codex TOML syntax and instruction extraction. (`.codex/agents/deep-context.toml`, `.codex/agents/deep-research.toml`)
- [ ] T011 Confirm agent dispatch identities remain unchanged. (`.opencode/agents/deep-context.md`, `.opencode/agents/deep-research.md`)
- [ ] T012 Replay phase-001 artifact parity for all affected modes. (`phase-001 baseline manifest path recorded by completed phase 001`)
- [ ] T013 Validate phase 005 spec folder and record checklist evidence during implementation. (`.opencode/specs/deep-loops/029-deep-loop-workflows/005-agent-mirror-repoint/`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run the parity check: Use the completed phase-001 baseline manifest and replay command. First prove normalized three-way mirror-body parity for each mode after stripping runtime wrapper/frontmatter and whitelisting only the Path Convention line. Then grep the 15 target files for stale .opencode/skills/deep-{context,research,review,improvement,ai-council}/ paths, parse all five Codex TOML files, confirm agent names/config registrations are unchanged, and rerun the phase-001 parity harness for all five modes with the same normalizer. Pass requires byte-identical artifact hashes; if model nondeterminism blocks byte equality, document behavior preservation with normalized body parity plus unchanged permissions, state contracts, and output schemas.
- [ ] T017 `validate.sh --strict` on this phase folder
- [ ] T018 Confirm the phase success criteria in `spec.md` are met

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
