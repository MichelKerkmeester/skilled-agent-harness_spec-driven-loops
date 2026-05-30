---
title: "Tasks: Worktree child-marker dispatch documentation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "worktree child-marker dispatch tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/003-worktree-child-marker-dispatch"
    last_updated_at: "2026-05-30T23:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored tasks to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003622"
      session_id: "036-003-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Worktree child-marker dispatch documentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm bin/README "Worktree session isolation" contract present (035, c657219dd9) and both cli-* skills clean vs HEAD
- [x] T002 Map ALWAYS-rule structure: cli-codex ends at rule 12, cli-opencode at rule 14 (add 13 / 15 respectively before the NEVER header)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add cli-codex ALWAYS rule 13: set AI_SESSION_CHILD=1 on `codex exec` dispatch, cross-ref bin/README
- [x] T004 Add cli-opencode ALWAYS rule 15: set AI_SESSION_CHILD=1 on `opencode run` dispatch, cross-ref bin/README
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 grep both present (AI_SESSION_CHILD=1 + bin/README ref); confirm one-hunk additive diff per file (+2/-1)
- [x] T006 Comment-hygiene 0 violations on both skills; strict-validate the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Both cli-* skills carry the dispatch rule
- [x] Doc-only, additive, hygiene-clean
- [x] Packet strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Contract source**: `.opencode/bin/README.md` → "Worktree session isolation"; wrapper `.opencode/bin/worktree-session.sh`
<!-- /ANCHOR:cross-refs -->
