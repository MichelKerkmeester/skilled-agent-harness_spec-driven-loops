---
title: "Tasks: sk-vision Cursor + Devin MCP adapters"
description: "Task ledger for porting the sk-vision MCP server and wiring the Cursor and Devin configs."
trigger_phrases:
  - "sk-vision cursor devin tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters"
    last_updated_at: "2026-08-17T12:10:09.000Z"
    last_updated_by: "claude"
    recent_action: "Ported the MCP server to v4 and wired the Cursor and Devin MCP configs."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters/tasks.md"
      - ".devin/mcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-014-cursor-devin-mcp-adapters"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision Cursor + Devin MCP adapters

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm Cursor and Devin are MCP-only and locate the tested server. Evidence: PR #34 worktree `vision-runtime/src/mcp/server.ts` + `server.test.ts`; v4 had none.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Port `server.ts` + `server.test.ts` into v4 `vision-runtime/src/mcp/`. Evidence: files present on v4, unchanged.
- [x] T003 Add the `sk-vision-mcp` bin. Evidence: `vision-runtime/package.json` `bin.sk-vision-mcp`.
- [x] T004 Add the MCP-server build entry. Evidence: `build.ts` emits `dist/mcp-server.js`.
- [x] T005 Add the Cursor entry to `.claude/mcp.json`. Evidence: `mcpServers.sk-vision` present; reached via the `.cursor/mcp.json` chain.
- [x] T006 Create `.devin/mcp_config.json`. Evidence: valid JSON with `mcpServers.sk-vision`.
- [x] T007 Document Cursor/Devin in SKILL.md and README. Evidence: `SKILL.md` §3 and `README.md` §7 host-adapter sections.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Build the server. Evidence: `bun run build` emits `dist/mcp-server.js`.
- [x] T009 Prove 13 tools over MCP. Evidence: `bun test` MCP client asserts 13 tools; live `tools/list` probe returned 13.
- [x] T010 Prove status without model weights. Evidence: `server.test.ts` status assertion passes (`loaded: false`).
- [x] T011 Runtime regression. Evidence: `bun test` → 9 pass / 0 fail.
- [ ] T012 Commit the sk-vision-scoped changes on v4. Evidence: pending the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks marked `[x]`. Evidence: `tasks.md` T001-T011.
- [ ] Commit task T012 complete. Evidence: pending.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [x] Verification passed. Evidence: `implementation-summary.md` Verification table.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
