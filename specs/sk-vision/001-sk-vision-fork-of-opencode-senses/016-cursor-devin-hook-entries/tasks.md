---
title: "Tasks: Cursor + Devin hook entries"
description: "Task ledger for surfacing Cursor and Devin under the sk-vision hooks tree."
trigger_phrases:
  - "sk-vision cursor devin hook entries tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries"
    last_updated_at: "2026-08-17T15:17:23.000Z"
    last_updated_by: "claude"
    recent_action: "Added hooks/cursor and hooks/devin plus their hook-hub mirror symlinks."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries/tasks.md"
      - ".devin/mcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-016-cursor-devin-hook-entries"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor + Devin hook entries

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

- [x] T001 Confirm Cursor/Devin are MCP-only and locate their config load paths. Evidence: `.devin/mcp_config.json` dedicated; Cursor via the shared `.claude/mcp.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Create `hooks/devin/mcp_config.json` and `hooks/cursor/mcp.json`. Evidence: both present, valid JSON with `mcpServers.sk-vision`.
- [x] T003 Symlink `.devin/mcp_config.json` to the owned source. Evidence: `readlink` -> `hooks/devin/mcp_config.json`.
- [x] T004 Mirror cursor + devin into the hub at `.opencode/hooks/sk-vision/{cursor,devin}`, then add `hooks/README.md` and update SKILL.md / README host-adapter text; bump to 0.1.3.1. Evidence: both hub symlinks resolve back to the sources; the doc sections name all four hosts and the hub mirrors.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm both hosts are visible. Evidence: `find hooks/` lists `cursor/mcp.json` and `devin/mcp_config.json`.
- [x] T006 Confirm the Devin symlink resolves. Evidence: `test -e .devin/mcp_config.json` true; target is the owned source.
- [x] T007 Confirm the MCP transport is unchanged. Evidence: config-command MCP `tools/list` returned 13.
- [x] T008 Confirm the skill still validates. Evidence: `ci-skill-root-metadata.cjs` `OK [S]`; `validate_skill_package.py --check` PASS.
- [ ] T009 Commit the sk-vision-scoped changes on v4. Evidence: pending the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks marked `[x]`. Evidence: `tasks.md` T001-T008.
- [ ] Commit task T009 complete. Evidence: pending.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [x] Verification passed. Evidence: `implementation-summary.md` Verification table.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
