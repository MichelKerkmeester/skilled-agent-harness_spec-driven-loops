---
title: "Tasks: sk-vision MCP server process-lifecycle guards"
description: "Task ledger for adding self-termination guards to the sk-vision MCP stdio server and proving them with tests and a rebuild."
trigger_phrases:
  - "sk-vision mcp process lifecycle guards tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/021-mcp-server-process-lifecycle"
    last_updated_at: "2026-08-18T17:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Hardened the sk-vision MCP stdio server with idempotent multi-path shutdown guards; tests green."
    next_safe_action: "Commit the source fix on v4 once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/021-mcp-server-process-lifecycle/tasks.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-021-mcp-server-process-lifecycle"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision MCP server process-lifecycle guards

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

- [x] T001 Add exported `installMcpLifecycleGuards` with injectable `exit`/`getParentPid`/`watchIntervalMs` (`vision-runtime/src/mcp/server.ts`). Evidence: helper wires onclose, stdin end/close, three signals, and an `unref()`'d reparent watchdog.
- [x] T002 Replace the bare `onclose` in `runSkVisionMcpServer` with the helper call (`vision-runtime/src/mcp/server.ts`). Evidence: `server.ts` review; old single-line `onclose` gone.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add three `bun:test` cases — stdin-end shutdown, idempotency, reparent watchdog — that inject `exit` and never call real `process.exit` (`vision-runtime/src/mcp/server.test.ts`). Evidence: cases present; existing transport test retained.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Typecheck + run the server test suite. Evidence: `tsc --noEmit` exit 0; `bun test src/mcp/server.test.ts` 4 pass / 0 fail.
- [x] T005 Rebuild the gitignored artifact and confirm the guards landed. Evidence: `bun run build` exit 0; 8 guard-symbol hits in `dist/mcp-server.js`.
- [ ] T006 Commit on v4. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Guard implemented, wired, and tested. Evidence: T001-T005 above.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [ ] Commit task T006 complete. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
