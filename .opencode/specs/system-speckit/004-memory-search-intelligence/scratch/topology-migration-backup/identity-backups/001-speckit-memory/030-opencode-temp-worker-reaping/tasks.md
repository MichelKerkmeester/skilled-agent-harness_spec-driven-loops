---
title: "Tasks: Phase 30: opencode-temp-worker-reaping"
description: "Task Format: T### [P?] Description (file path) [effort]. Layer 0 + Layer 1 shipped this session; activation, sweeper hardening, and the embedder demand-listener fix remain, several blocked on operator approval."
trigger_phrases:
  - "tasks"
  - "opencode temp worker reaping"
  - "daemon reaper"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/030-opencode-temp-worker-reaping"
    last_updated_at: "2026-07-11T09:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Rewrote tasks to Level 2 with per-task effort and shipped/pending split"
    next_safe_action: "Unblock T009/T010 via operator approval, then pick up T011/T012"
    blockers:
      - "T009/T010 blocked on operator dry-run review and launchctl approval"
    key_files:
      - "tasks.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doc-update-030-daemon-reaper"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 30: opencode-temp-worker-reaping

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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Setup for this phase was investigation: tracing both root causes to specific lines before writing any fix.

- [x] T001 Census live `context-server.js` processes; confirm 51 live, start times spanning Jul 8-9 (manual) [~30m]
- [x] T002 Trace root cause A: launcher-lease vitest suite detached daemon + re-election release semantics (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`, `.opencode/bin/mk-spec-memory-launcher.cjs:1539,206-207`) [~45m]
- [x] T003 [P] Trace root cause B: embedder wedge via `hf-model-server` sidecar + demand-listener ownership gap (`.opencode/bin/hf-model-server.cjs`, `.opencode/bin/mk-spec-memory-launcher.cjs:1781`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:501-504,718-785`) [~45m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Shipped this session
- [x] T004 Default `SPECKIT_DAEMON_REELECTION=0` in the `spawnLauncher` test helper (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`) [~20m] - commit `90a2462721`
- [x] T005 Hard-kill each workspace's lease-recorded `childPid`/`modelServerPid` in `afterEach` before temp-root removal (same file) [~20m] - commit `90a2462721`
- [x] T006 Extend `orphan-mcp-sweeper.sh` classification to count `hf-embed.sock` in the busy-preserve rule (`.opencode/scripts/orphan-mcp-sweeper.sh`) [~15m] - commit `d4be07abbc`
- [x] T007 Operational: kill 32 accumulated zombie daemons, confirmed via `ps aux` (manual, this session, not a repo change) [~15m]
- [x] T008 Operational: restart the wedged daemon and rebuild native `better-sqlite3` to the Node-22/MODULE_VERSION-127 ABI (manual, this session) [~20m]

### Remaining, blocked or not started
- [ ] T009 [B] Activate `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=dry-run` then `live` (`.opencode/scripts/session-cleanup.sh:30`) - blocked on operator dry-run log review
- [ ] T010 [B] Install the launchd cron reaper via `launchctl load` (`.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist`, currently `--dry-run`, template-only) - blocked on operator approval
- [ ] T011 Add maintenance-marker respect + singleton rule + pid-reuse re-check to `orphan-mcp-sweeper.sh` (delicate process-killer edit, not started)
- [ ] T012 Re-arm the hf demand listener on daemon adoption + fail-fast in `hf-local.ts` when the socket is absent and there is no live owner lease (recommended as a separate packet, not started)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Re-run `launcher-lease.vitest.ts`; confirm 6/11 -> 10/11, zero stub daemon leaks after the run [~10m]
- [x] T014 Confirm non-regression: unmodified `launcher-lease.vitest.ts` baseline failed 5/11 the same way pre-fix [~10m]
- [x] T015 Run sweeper unit tests: `orphan-sweeper-ipc-preserve.vitest.ts` (3/3), `launcher-stop-hook-orphan-sweep.vitest.ts` (4/4) [~10m]
- [x] T016 Live `--dry-run --verbose` sweep against the real daemon; confirm pid 42293 preserved (`reason=active-ipc-socket-connection`), only genuinely orphaned ~2.4h helpers flagged [~10m]
- [x] T017 Verify DB integrity after daemon rebuild: `PRAGMA integrity_check = ok`, 12,801 memories intact [~5m]
- [x] T018 Update `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` to Level 2, honest In Progress status [~1h] - this pass
- [ ] T019 Verify stop-hook live-mode behavior after activation (pending T009)
- [ ] T020 Verify launchd cron fires and reaps correctly after install (pending T010)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` - **NOT MET**: T009-T012, T019-T020 pending
- [ ] No `[B]` blocked tasks remaining - **NOT MET**: T009, T010 blocked on operator
- [x] This session's shipped layers (Layer 0 + Layer 1) verified and pushed
- [ ] Manual verification of remaining activation/hardening - pending
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task, explicit shipped vs blocked/pending split
- Add L2/L3 addendums for complexity
-->
