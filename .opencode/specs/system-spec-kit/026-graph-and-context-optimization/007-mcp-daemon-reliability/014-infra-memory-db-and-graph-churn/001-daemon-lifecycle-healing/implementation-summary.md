---
title: "Implementation Summary: Daemon-lifecycle healing (F1/F2/F3)"
description: "The memory DB now self-heals: a daemon that inherits a dirty FTS5 shadow rebuilds it at boot, the launcher logs unclean handoffs, and the substrate stress test reflects the real single-daemon runner."
trigger_phrases:
  - "daemon lifecycle healing summary"
  - "boot fts rebuild summary"
  - "substrate test fix summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/032-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing"
    last_updated_at: "2026-05-30T18:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested F1/F2/F3; docs rewritten to manifest scaffold"
    next_safe_action: "Commit atomically with scoped pathspecs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000325"
      session_id: "032-001-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F3 needed a FAIL-only diagnostic assertion: the live runner emits an informational runner:mk-spec-memory connection row plus Code-Graph SKIPs that must be tolerated."
---
# Implementation Summary: Daemon-lifecycle healing (F1/F2/F3)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/032-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing |
| **Completed** | 2026-05-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The recurring `SQLITE_CONSTRAINT_PRIMARYKEY` write failure now heals itself. The 032 deep-research loop traced it to one production root cause (SQ4): the `mk-spec-memory` launcher could respawn over an unresponsive incumbent daemon without verifying the database closed cleanly, leaving the FTS5 shadow divergent so the next write aborted. Three fixes close it.

### F1 - Boot FTS auto-heal
When a daemon boots and finds the `.unclean-shutdown` marker, it runs the cheap FTS5 integrity-check. If that fails, it now rebuilds the shadow (`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`), re-verifies, and marks health `'repaired'`. The FTS5 shadow is fully derivable from `memory_index`, so the rebuild is non-destructive - the same command `memory_health autoRepair` already uses. A rebuild failure or `SPECKIT_BOOT_FTS_AUTOHEAL=0` falls back to the original detect-only path with the corruption banner and runbook intact.

### F2 - Launcher clean-close barrier
The reap path now tells whether a reaped `context-server` child handed off the database cleanly. After the reap it computes `cleanCloseAfterReap({killed, markerPresent})` - clean only when the child exited on SIGTERM (not SIGKILL) and the marker is gone - and logs the unclean case loudly, making the corruption window visible. It never blocks respawn: a missing daemon is worse than a self-healing one, and F1 repairs the shadow on the replacement's boot.

### F3 - Substrate stress test correctness
The test asserted exactly 4 rows all-PASS through "two real MCP daemons". Reality: the promoted runner starts only the memory daemon, so it prepends a `runner:*` diagnostic row and the Code-Graph scenarios legitimately SKIP. The test now separates diagnostic from scenario rows, rejects connection FAILs and scenario FAILs, tolerates SKIP/PARTIAL, and requires the memory scenario (410) to actually run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/context-server.ts` | Modified | F1 boot FTS auto-heal + `'repaired'` health |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | F2 clean-close barrier + exported helpers |
| `mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modified | F3 assertion correctness |
| `mcp_server/tests/context-server.vitest.ts` | Modified | T56c updated for the auto-heal contract |
| `mcp_server/tests/launcher-clean-close-barrier.vitest.ts` | Created | F2 unit test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented F1/F3 first (lowest risk, fully testable), then F2 (launcher, highest blast radius), then tests, then verification. The FTS rebuild reuses the proven `memory_health` command, so the highest-risk change is non-destructive by construction. Verification ran the build, `node --check`, and every affected vitest suite against the real daemon before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| F2 observes and logs, never blocks respawn | Blocking on an unclean close would leave no daemon at all; F1 does the actual repair on the replacement's boot |
| Reuse the `memory_health` FTS `rebuild` verb at boot | It is the proven, non-destructive repair; the shadow is derivable from `memory_index` |
| Env opt-out `SPECKIT_BOOT_FTS_AUTOHEAL=0` | Gives a runtime kill-switch on the highest-blast-radius surface without a redeploy |
| F3 tolerates SKIP, rejects FAIL | The single-daemon runner makes Code-Graph SKIP legitimate; only connection/scenario FAIL is a real substrate failure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (shared + mcp-server) | PASS (exit 0) |
| `node --check` launcher | PASS |
| `context-server.vitest.ts` | PASS, 378/378 (T56c asserts auto-heal) |
| `launcher-clean-close-barrier.vitest.ts` | PASS, 4/4 |
| substrate stress (vs real daemon) | PASS, 1/1 (410 ran; runner + Code-Graph SKIP tolerated) |
| `launcher-watchdog.vitest.ts isRespawnLockStale` | FAIL - pre-existing, fails on HEAD too without this change; unrelated |
| Comment-hygiene audit | PASS, 0 ephemeral-pointer violations |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live two-launcher integration is not exercised end-to-end.** F2's decision logic and marker resolution are unit-tested; the live respawn path is covered at syntax + behavior level only. This is the same gap packet 031/009 left open.
2. **The durable systemic fix is deferred.** F4 (worktree-per-session isolation, packet 035) removes the concurrent-launcher contention that triggers this in the first place; it is intentionally out of scope here.
3. **Pre-existing unrelated test failure.** `launcher-watchdog.vitest.ts > isRespawnLockStale` fails on HEAD independently of this change and is not addressed here.
<!-- /ANCHOR:limitations -->
