---
title: "Tasks: Config, checkpoints, vectors, and constitutional verification (032 subtree 008 phase 010)"
description: "This verify-only phase audits the runtime agent directories and adjacent system-spec-kit config, checkpoint, vector, and constitutional surfaces for permitted snake_case filesystem names. The pinned inventory has zero rename candidates in the three runtime agent directories; generated/vector/checkpoint artifacts and tool-mandated names retain their exempt disposition."
trigger_phrases:
  - "system-spec-kit agent directory naming audit"
  - "config checkpoints vectors constitutional verify"
  - "zero agent rename candidates"
  - "system-spec-kit phase 010"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/010-config-checkpoints-vectors-constitutional-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned zero-candidate tasks"
    next_safe_action: "Repeat the scoped zero-candidate scan against the pinned BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Config, checkpoints, vectors, and constitutional verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE and record the exact runtime-agent/support scan roots.
- [ ] T002 Capture the complete inventory and underscore-bearing basename list.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Verify: `.opencode/agents/` has zero permitted rename candidates — evidence: scoped scan report.
- [ ] T004 Verify: `.claude/agents/` has zero permitted rename candidates — evidence: scoped scan report.
- [ ] T005 Verify: `.codex/agents/` has zero permitted rename candidates — evidence: scoped scan report.
- [ ] T006 Classify adjacent config, checkpoint, vector, constitutional, and runtime names — evidence: disposition ledger.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: No unknown candidate or accidental runtime diff remains — evidence: BASE comparison.
- [ ] T008 Hand off the zero-candidate assertion and disposition ledger to phases 011 and 012.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green in the central validation worktree
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
