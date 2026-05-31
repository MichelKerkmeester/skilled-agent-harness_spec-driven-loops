# Changelog — 005: worktree-per-session automation

**Shipped**: 2026-05-29 (90% — operator-machine wiring remains)
**Commit**: `(see git history)`

## What Changed

- `.opencode/bin/worktree-session.sh`: new launch wrapper that auto-creates a git worktree + branch + isolated MCP DBs for each top-level AI session, while orchestrated children share the parent's worktree
- `.opencode/bin/worktree-reaper.sh`: new conservative worktree prune
- `.opencode/bin/worktree-guard.sh`: new detect-and-warn guard
- `.opencode/bin/README.md`: documented worktree session isolation

## Why

Concurrent AI sessions contended over one working tree and shared MCP DBs, causing HEAD-moved-under-me and daemon-churn hazards. Per-session worktrees with isolated DBs remove that contention while keeping orchestrated child sessions in the parent's tree.

## Verification

- Step-0 socket-length blocker fixed (`SPECKIT_IPC_SOCKET_DIR`): PASS
- Worktree wrapper + reaper + guard built: PASS
- SC-001 green: PASS
- Known limitation: operator-machine wiring (launch aliases, SessionStart hook entries) deferred
