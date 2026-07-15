---
title: "Tasks: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli child marker propagation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/004-cli-child-marker-propagation"
    last_updated_at: "2026-05-30T23:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored tasks to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003642"
      session_id: "036-004-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills

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

- [x] T001 Confirm bin/README contract present + the three cli-* skills clean vs HEAD
- [x] T002 Map ALWAYS-rule structure: claude-code ends rule 10, gemini ends rule 10, devin ends rule 15 (add 11/11/16 before each NEVER header)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] cli-claude-code ALWAYS rule 11: `claude -p` pattern, cross-ref bin/README (delegated to cli-opencode worker)
- [x] T004 [P] cli-gemini ALWAYS rule 11: `gemini` pattern, cross-ref bin/README
- [x] T005 [P] cli-devin ALWAYS rule 16: `devin` pattern, cross-ref bin/README
- [x] T006 SessionStart hook + settings change covered by sibling child 006 (not this packet)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 grep each present (AI_SESSION_CHILD=1 + bin/README ref); confirm +1/-0 additive diff per file
- [x] T008 Comment-hygiene 0 violations on all three skills; confirm worker touched no out-of-scope files; strict-validate the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All three remaining cli-* skills carry the dispatch rule
- [x] Doc-only, additive, hygiene-clean
- [x] Packet strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../003-worktree-child-marker-dispatch/` (cli-codex + cli-opencode)
- **Contract source**: `.opencode/bin/README.md` → "Worktree session isolation"
<!-- /ANCHOR:cross-refs -->
