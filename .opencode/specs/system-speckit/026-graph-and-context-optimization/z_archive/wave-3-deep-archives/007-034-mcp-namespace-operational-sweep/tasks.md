---
title: "Tasks: 020 MCP Namespace Operational Sweep"
description: "Task tracking for the 3-file mcp namespace sweep."
trigger_phrases:
  - "020 tasks"
  - "mcp namespace operational sweep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-034-mcp-namespace-operational-sweep"
    last_updated_at: "2026-05-14T21:55:00Z"
    last_updated_by: "orchestrator-mcp-sweep"
    recent_action: "All tasks complete"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "020-mcp-namespace-operational-sweep-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 020 MCP Namespace Operational Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` Completed
- `[ ]` Pending
- `[B]` Blocked
- `[D]` Deferred
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 [P0] Audit operational tree for stale `mcp__system_code_graph__` refs
- [x] T002 [P0] Confirm 3 operational files (doctor _routes.yaml, doctor update.md, system-spec-kit tool-schemas.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T003 [P1] `sed` sweep on `.opencode/commands/doctor/_routes.yaml` — 9 replacements
- [x] T004 [P1] `sed` sweep on `.opencode/commands/doctor/update.md` — 7 replacements (frontmatter allowed-tools)
- [x] T005 [P1] `sed` sweep on `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` — 3 replacements (descriptions + historical comment)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T006 [P0] Per-file grep — 0 remaining `mcp__system_code_graph__` refs
- [x] T007 [P0] Cross-tree grep — operational tree clean (historical .md docs in 007, 010, 011, 014 packets retained as documentation)
- [x] T008 [P0] Launcher startup smoke — `[mk-code-index-launcher]` prefix
- [x] T009 [P0] validate.sh --strict on 020
- [x] T010 [P0] Stage scoped changes + commit on main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] 3 operational files swept
- [x] 0 operational stale refs remain
- [x] Launcher still starts cleanly
- [x] validate.sh --strict PASSES
- [x] Commit lands on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Detailed change manifest**: See `implementation-summary.md`
- **Origin of the rename**: `010-mcp-tool-rename-mk-code-index/`
<!-- /ANCHOR:cross-refs -->
