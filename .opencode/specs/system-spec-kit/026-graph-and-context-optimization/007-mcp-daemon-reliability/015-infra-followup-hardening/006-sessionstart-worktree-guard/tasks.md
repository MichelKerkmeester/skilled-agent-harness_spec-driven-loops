---
title: "Tasks: Wire worktree-guard into the Claude SessionStart hook chain"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sessionstart worktree guard tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/006-sessionstart-worktree-guard"
    last_updated_at: "2026-05-31T00:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored tasks to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".claude/settings.local.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003662"
      session_id: "036-006-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Wire worktree-guard into the Claude SessionStart hook chain

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

- [x] T001 Confirm worktree-guard.sh present + non-fatal; map existing SessionStart structure (one session-prime hook)
- [x] T002 Confirm settings.local.json clean + valid JSON before editing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Append worktree-guard.sh as a 2nd SessionStart hook step (timeout 3), keeping session-prime first (delegated to cli-opencode worker)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 node require() parses (valid JSON); SessionStart inner hooks length == 2; guard is the second entry
- [x] T005 Confirm only the SessionStart inner array changed (no other key touched); strict-validate the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] SessionStart runs session-prime then worktree-guard.sh
- [x] Valid JSON; additive change only
- [x] Packet strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Guard script**: `.opencode/bin/worktree-guard.sh`
- **Contract source**: `.opencode/bin/README.md` → "Worktree session isolation" (Backstop warning)
<!-- /ANCHOR:cross-refs -->
