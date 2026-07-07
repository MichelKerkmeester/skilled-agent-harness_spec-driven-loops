---
title: "Tasks: Orphan Code Graph DB Cleanup"
description: "Task list for deleting stale code-graph artifacts from the system-spec-kit MCP tree, adding the spec-kit-memory launch guard, and validating the cleanup."
trigger_phrases:
  - "008 orphan code graph db cleanup tasks"
  - "stale code graph db cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/022-orphan-code-graph-db-cleanup"
    last_updated_at: "2026-05-14T13:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Completed cleanup tasks"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - ".opencode/bin/spec-kit-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-008-orphan-code-graph-db-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Orphan Code Graph DB Cleanup

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm orphan code-graph SQLite paths under `.opencode/skills/system-spec-kit/`.
- [x] T002 Trace nested DB root cause to stale compiled `dist/system-code-graph` loaded by the old spec-kit-memory process.
- [x] T003 Confirm current `TOOL_DEFINITIONS` exposes no `code_graph_*`, `detect_changes`, or `ccc_*` tools.
- [x] T004 Confirm no live source `mcp_server/code_graph` directory remains under system-spec-kit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Delete six orphan DB files.
- [x] T006 Delete stale `mcp_server/dist/code_graph/`.
- [x] T007 Delete stale `mcp_server/dist/system-code-graph/`.
- [x] T008 Add `SPECKIT_CODE_GRAPH_DB_DIR` guard to `.opencode/bin/spec-kit-memory-launcher.cjs`.
- [x] T009 Remove stale code-graph and CCC input schema entries from `schemas/tool-input-schemas.ts`.
- [x] T010 Generate packet metadata files for 028.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `npx tsc --noEmit` in `.opencode/skills/system-spec-kit/mcp_server`.
- [x] T012 Run targeted `find` checks for orphan DB and stale dist paths.
- [x] T013 Run `validate.sh --strict` on the 028 packet.
- [x] T014 Stage only scoped changes and commit to `main`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
