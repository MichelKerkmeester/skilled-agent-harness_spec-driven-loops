---
title: "Tasks: Parser Quarantine Recovery (029 Phase 006)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "parser quarantine recovery tasks"
  - "f-runtime-2 tasks"
  - "029 phase 006 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/006-parser-quarantine-recovery"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 006 tasks"
    next_safe_action: "Edit parser module"
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
# Tasks: Parser Quarantine Recovery (029 Phase 006)

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

- [ ] T001 Baseline: tsc build + parser/scan vitest green pre-edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Add `resetParserHealth()` to `mcp_server/lib/tree-sitter-parser.ts`
- [ ] T003 Import + call it on explicit full scan in `mcp_server/handlers/scan.ts`
- [ ] T004 Add recovery test to `mcp_server/tests/parser-skip-list.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 tsc build clean
- [ ] T006 vitest parser-skip-list + code-graph-scan pass
- [ ] T007 verify_alignment_drift.py clean on changed scope
- [ ] T008 (optional) live: restart daemon + confirm quarantine recovery
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked
- [ ] Build + tests + alignment green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
