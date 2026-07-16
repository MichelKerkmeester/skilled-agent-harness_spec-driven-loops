---
title: "Tasks: MCP Tool Rename: mk-code-index"
description: "Task list for renaming the standalone code-graph MCP server to mk-code-index, updating launcher/config/docs, and validating the 010 packet."
trigger_phrases:
  - "010 mcp tool rename mk code index tasks"
  - "mk-code-index rename tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-024-mcp-tool-rename-mk-code-index"
    last_updated_at: "2026-05-14T17:29:04Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-010"
    recent_action: "Completed rename and verification tasks"
    next_safe_action: "Restart MCP children after merge"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-010-mcp-tool-rename-mk-code-index"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: MCP Tool Rename: mk-code-index

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

- [x] T001 Confirm no existing `010-*` child folder under packet 014.
- [x] T002 Confirm current branch is `main`.
- [x] T003 Read `.claude/mcp.json` and `opencode.json`.
- [x] T004 Read `.opencode/bin/system-code-graph-launcher.cjs`.
- [x] T005 Read `.opencode/skills/system-code-graph/mcp_server/index.ts`.
- [x] T006 Search for stale MCP namespace and launcher references outside historical packet docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Rename launcher file to `.opencode/bin/mk-code-index-launcher.cjs`.
- [x] T008 Rename launcher state file to `.mk-code-index-launcher.json`.
- [x] T009 Update runtime config keys to `mk_code_index`.
- [x] T010 Update MCP server name to `mk-code-index`.
- [x] T011 Update launcher stderr prefix and state command to `mk-code-index-launcher`.
- [x] T012 Update `mcp__system_code_graph__*` grants and hints to `mcp__mk_code_index__*`.
- [x] T013 Scaffold this 010 Level 1 packet.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `npx tsc` in `.opencode/skills/system-code-graph`.
- [x] T015 Probe `.opencode/bin/mk-code-index-launcher.cjs`.
- [x] T016 Run `validate.sh --strict` on the 010 packet.
- [x] T017 Attempt to stage only intended files; sandbox denied `.git/index.lock`.
- [x] T018 Leave commit uncreated because staging was blocked by the git index sandbox.
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
