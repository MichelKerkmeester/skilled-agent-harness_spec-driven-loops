---
title: "Worktree-per-AI-session automation (core built)"
description: "Concurrent AI sessions sharing the main working tree and MCP databases caused session collisions and commit corruption. The core isolation layer (launch wrapper, reaper, guard hook) is now built and verified end to end."
trigger_phrases:
  - "worktree per session automation"
  - "isolate ai sessions git worktree"
  - "launch wrapper child detection guard hook"
  - "worktree session wrapper reaper built"
  - "worktree automation status core built"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/005-worktree-per-session-automation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

Concurrent AI sessions sharing the main working tree and MCP databases caused real collisions, including HEAD moving under an active session twice in minutes. This phase ships three scripts that give each top-level session its own git worktree, branch, and isolated databases, plus a conservative reaper and a guard hook. Per-runtime launch wiring and SessionStart hook entries remain deferred to the operator.

### Added

- A launch wrapper script that isolates each top-level AI session in its own git worktree, branch, and MCP databases while sharing symlinked build dependencies from main.
- A conservative worktree reaper that prunes merged and clean worktrees, removes stale socket directories under the home directory, and reports orphan daemons. Daemon killing is opt-in via the `--reap-daemons` flag to protect live sessions.
- A detect-and-warn guard hook for SessionStart chains that warns when a top-level session runs on shared main or master but stays silent on isolated worktrees, orchestrated children, and non-git directories.
- The `.worktrees/` directory pattern in `.gitignore` so worktree contents never appear as untracked files.

### Changed

- Per-worktree database isolation via `SPEC_KIT_DB_DIR` and `SPECKIT_CODE_GRAPH_DB_DIR` environment variables. Each worktree session gets its own database files while the shared database stays untouched.
- Launch wrapper child detection uses two independent signals. `AI_SESSION_CHILD=1` is the explicit dispatch signal and a structural `git-common-dir` backstop catches sessions already inside a linked worktree. Unknown signals default to isolate for safety.
- The `sk-git` skill document (section 3) documents the launch-wrapper worktree pattern versus the in-session ask-first rule, plus the deliberate symlink-deps override.
- The `bin/README.md` documents the three scripts, the child-injection pattern, and the guard-hook wiring instructions.

### Fixed

- The daemon failed to boot from worktree sessions because its default Unix-domain IPC socket path exceeded the macOS `sun_path` limit (174 characters versus approximately 104). Resolved by introducing `SPECKIT_IPC_SOCKET_DIR` to relocate the socket to a short per-session directory under the home directory. A real `git worktree add` boot with the long database directory and the short socket directory boots cleanly with no errors.

### Verification

| Check | Result |
|-------|--------|
| Step-0 socket-length blocker found | CONFIRMED, 174-character worktree socket path exceeds macOS sun_path ~104, daemon EINVAL on listen() |
| Step-0 fix (SPECKIT_IPC_SOCKET_DIR) end-to-end | PASS, real git worktree add plus boot with long DB dir plus short socket dir: BOOTED=1, EINVAL=0, socket in override dir, worktree and branch removed cleanly |
| DB-dir relocation under override | PASS, daemon boots against SPEC_KIT_DB_DIR, IPC socket relocates, shared DB untouched, clean SIGTERM removes marker |
| SC-001 two-concurrent-session isolation | PASS, distinct branches, DB dirs, and sockets. A commit in session A is independent. Session B and main are unaffected (probe absent in both). Both daemons booted concurrently EINVAL=0. Main HEAD unchanged. Worktrees cleaned. |
| worktree-guard.sh (5 paths) | PASS, top-level-on-main warns and exits 0. Child, GUARD=off, inside-worktree, and non-git all silent and exit 0 |
| Reaper safety dry-run | PASS, prunes nothing with no worktrees. Never touches main or sibling worktrees. |
| bash -n plus shellcheck (3 scripts) | PASS, clean |
| worktree-session.sh bash -n | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/worktree-session.sh` | Created | Launch wrapper that isolates top-level sessions, suppresses children, and applies the socket-dir fix |
| `.opencode/bin/worktree-reaper.sh` | Created | Prunes merged and clean worktrees plus stale socket directories, reports and optionally kills orphan daemons |
| `.opencode/bin/worktree-guard.sh` | Created | Detect-and-warn SessionStart guard for top-level-on-main sessions |
| `.gitignore` | Modified | Ignore .worktrees/ |
| `.opencode/bin/README.md` | Modified | Document the three entrypoints plus child-injection and guard wiring |
| `.opencode/skills/sk-git/SKILL.md` | Modified | Section 3 launch-wrapper worktrees versus the in-session ask-first rule plus deps-override note |
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Modified | Reflect built and tested state |

### Follow-Ups

- Operator-machine wiring (launch aliases per runtime, SessionStart guard-hook entries, and AI_SESSION_CHILD=1 at dispatch sites) is documented in `bin/README.md` and `sk-git` section 3 but deferred to the operator. The wiring is operator-environment-specific and intentionally left as a follow-up.
- Reaper daemon-orphan detection is heuristic. It matches live `context-server.js` processes referencing a `.worktrees/` path via `pgrep` and reports rather than kills by default. A lease-file-based mapping would be more precise.
- Socket-dir override is required, not optional, on this layout. The worktree database path exceeds `sun_path`, so the daemon only boots with `SPECKIT_IPC_SOCKET_DIR` set. The wrapper sets it automatically but any hand-rolled launch into a worktree must do the same.
- Cross-runtime child signal is best-effort. `AI_SESSION_CHILD=1` must be set at each dispatch site. The structural `git-common-dir` backstop catches the common case of a child already inside the parent worktree and unknowns default to isolate.
