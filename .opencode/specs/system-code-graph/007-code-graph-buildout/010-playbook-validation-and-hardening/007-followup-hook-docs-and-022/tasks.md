---
title: "Tasks: Hook-Doc Reconciliation + 022 Re-verify (029 Phase 007)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook doc reconciliation tasks"
  - "022 transitive tasks"
  - "029 phase 007 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 007 tasks"
    next_safe_action: "Edit hook READMEs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Hook-Doc Reconciliation + 022 Re-verify (029 Phase 007)

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

- [ ] T001 Confirm real flat dist artifact path + enumerate the 5 in-scope docs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Fix 4 hook READMEs (claude/codex/gemini/devin): artifact path → `system-spec-kit/mcp_server/dist/hooks/<runtime>/`
- [ ] T003 Fix deferred_decisions.md stale paths + add 2026-05-27 resolution note (migration not realized; F-025-1 repointed)
- [ ] T004 Re-dispatch 022 with a deep-dependency subject → capture transitive vs nontransitive counts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 rg: no active doc cites the non-existent path; devin artifact `test -f` ok
- [ ] T006 Record 022 transitive verdict in evidence-022-rerun.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked
- [ ] Docs reconciled; 022 verdict resolved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
