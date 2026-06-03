---
title: "Scouted Bugfix Batch 1: Verify-First Pipeline — 5 Confirmed Fixes Across 10 Files"
description: "An 8-agent scout surfaced 40 candidates; the top 5 were deep-dived by gpt-5.5-fast (refuting two pre-try lease-leak headlines) then fixed by 5 disjoint-file implement agents: two shell hardenings, one IPC hardening, and two MCP-server bug fixes. All 10 files verified; both MCP builds exit 0."
trigger_phrases:
  - "scouted bugfix batch 1"
  - "worktree reaper eval injection"
  - "setup cp sandbox rmrf guard"
  - "advisor ipc socket hardening"
  - "scan lease heartbeat fix"
  - "verify-first batch fix shipped"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/001-scouted-bugfix-batch-1` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train`

### Summary

A broad codebase scout surfaced 40 candidate defects with no single review having triaged them. The top 5 — carrying the highest risk across two shell scripts, one IPC socket server, and two MCP-server bugs — were put through a verify-first pipeline: an 8-agent scout selected targets, 5 parallel gpt-5.5-fast deep-dives confirmed or refuted each headline against the real code (refuting the two loudest "pre-try lease leak" claims, finding a real lesser defect in each target instead), and 5 disjoint-file implement agents fixed the confirmed defects across 10 files. Three security hardenings (shell command injection, unguarded `rm -rf`, IPC path confinement) and two MCP-server bug fixes (file-watcher `close()` blocking on a non-cancellable backoff, scan lease expiry during multi-batch indexing) landed in full. Both MCP builds exit 0; all targeted verification suites pass.

### Added

- `RetryWaker` wake-coordination class in `file-watcher.ts`: a sticky-after-wakeAll mechanism that wakes any in-flight `withBusyRetry` backoff timer when `close()` is called, so close never blocks on a non-cancellable sleep.
- `validate_sandbox_dir()` function in `setup-cp-sandbox.sh` (3 copies): rejects empty, non-absolute, `..`-containing, or non-`/tmp` sandbox paths before any destructive `rm -rf`.
- Periodic lease heartbeat in `memory-index.ts`: a `setInterval` (expiry/3, min 10 s, `.unref()`) started inside the try block and cleared in finally, keeping the scan lease fresh across multi-batch index runs.
- 4 DR-008 IPC hardening items in `socket-server.ts`: `canonicalizePath` ancestor-realpath, `allowedSocketRoots` configuration, `isWithinAllowedSocketRoot` confinement check, and post-mkdir `stat` uid/group-writable validation — mirroring the existing code-graph socket-server baseline.
- New vitest test `close-mid-retry-sleep` in `file-watcher.vitest.ts` covering the RetryWaker wakeup path.
- New vitest test for the scan lease heartbeat in `handler-memory-index-cooldown.vitest.ts`.
- `file-watcher.vitest.ts` re-enabled in `test:core` (removed the prior `--exclude` flag from `mcp_server/package.json`).

### Changed

- `worktree-reaper.sh`: replaced `eval "$@"` with direct argv-array execution (`"$@"`) at 5 call sites; added `rm -rf -- "$sd"` end-of-options guard; DRY_RUN paths now use `%q` quoting. Kills shell command injection via reaped-worktree path names.
- `setup-cp-sandbox.sh` (3 copies in deep-research, deep-review, and deep-improvement stress-test dirs): REPO_ROOT now derived from `BASH_SOURCE` instead of a hardcoded author-absolute path, making the script location-independent.
- `system-skill-advisor/mcp_server/lib/ipc/socket-server.ts`: ported 4 DR-008 IPC hardening items to align with the code-graph socket-server reference implementation.

### Fixed

- Shell command injection in `worktree-reaper.sh` via hostile directory names containing shell metacharacters — `eval` replaced by argv-array; verified with a LIVE injection test (hostile `$sd` dir name), injection dead, exit-status propagation preserved.
- Unguarded `rm -rf` in `setup-cp-sandbox.sh` when invoked with an unsafe or unexpected path — `validate_sandbox_dir()` now rejects `$HOME` and `/tmp/../etc`; verified with an 11-input unit test plus end-to-end run.
- IPC path-confinement gap in the advisor socket server — it lacked the ancestor-realpath canonicalization and allowed-root confinement that the code-graph socket server already had; ported faithfully.
- `watcher.close()` blocking on a non-cancellable `withBusyRetry` backoff sleep in `file-watcher.ts` — RetryWaker ensures close wakes in-flight retries immediately; file-watcher suite 22/22 including new close-mid-retry-sleep test.
- Missing scan lease heartbeat in `memory-index.ts`: a long multi-batch scan could let the lease expire mid-run, causing a concurrent caller to treat it as stale; heartbeat now keeps the lease current throughout; cooldown suite 9/9 including new heartbeat test.

### Verification

| Check | Result |
|-------|--------|
| Deep-dive confirm/refute for all 5 headlines (REQ-001) | PASS — two pre-try lease-leak headlines REFUTED with code evidence; 5 real lesser defects confirmed |
| Refuted headlines not acted on (REQ-002) | PASS — no "leak fix" applied; each target's confirmed defect fixed instead |
| Only confirmed defect fixed per target (REQ-003) | PASS — edits land in exactly the 10 confirmed-defect files (+ their tests/package.json); 0 scope leaks |
| Fix 1 — worktree-reaper shell hardening | PASS — `bash -n` + shellcheck clean; LIVE injection test: hostile `$sd` injection dead; exit-status preserved |
| Fix 2 — setup-cp-sandbox rm-rf guard (3 copies) | PASS — `bash -n` + 11-input unit test + end-to-end; rejects `$HOME` and `/tmp/../etc`; default `/tmp/...` path still works |
| Fix 3 — advisor IPC DR-008 hardening | PASS — typecheck + build exit 0; faithful to the code-graph DR-008 reference |
| Fix 4 — file-watcher RetryWaker | PASS — typecheck exit 0; file-watcher suite 22/22 including new close-mid-retry-sleep test; re-enabled in test:core |
| Fix 5 — memory-index scan lease heartbeat | PASS — typecheck exit 0; cooldown suite 9/9 including new heartbeat test |
| MCP builds | PASS — system-spec-kit `mcp_server npm run build` exit 0; system-skill-advisor `mcp_server build` exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/worktree-reaper.sh` | Modified | `eval "$@"` → argv-array at 5 call sites; `rm -rf --` end-of-options guard; `%q` DRY_RUN |
| `setup-cp-sandbox.sh` (deep-research `07--command-flow-stress-tests/`) | Modified | BASH_SOURCE REPO_ROOT; `validate_sandbox_dir()` before destructive `rm -rf` |
| `setup-cp-sandbox.sh` (deep-review `07--command-flow-stress-tests/`) | Modified | Same BASH_SOURCE + `validate_sandbox_dir()` guard |
| `setup-cp-sandbox.sh` (deep-improvement `08--agent-discipline-stress-tests/`) | Modified | Same BASH_SOURCE + `validate_sandbox_dir()` guard |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Modified | 4 DR-008 IPC hardening items: canonicalizePath, allowedSocketRoots, isWithinAllowedSocketRoot, post-mkdir stat |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts` | Modified | RetryWaker wake-coordination; `close()` now wakes in-flight retries immediately |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/tests/file-watcher.vitest.ts` | Modified | Added close-mid-retry-sleep test case |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Removed `--exclude` for file-watcher.vitest.ts from test:core |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | `setInterval` scan lease heartbeat (expiry/3, min 10 s, `.unref()`), cleared in finally |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/tests/handler-memory-index-cooldown.vitest.ts` | Modified | Added heartbeat test case |

### Follow-Ups

- Deploy the fixes: orchestrator must recycle the mk-spec-memory daemon and the skill-advisor MCP after commit for Fixes 3, 4, and 5 to take effect. The two shell hardenings (Fixes 1 and 2) need no deploy.
- The remaining 35 scouted candidates from the 40-candidate backlog are deferred to later batches (002-scouted-bugfix-batch-2, 003-scouted-bugfix-batch-3).
- Two pre-existing failures in `handler-memory-index.vitest.ts` remain in the `[deferred - requires DB test fixtures]` describe block; they predate and are unrelated to the heartbeat change. The cooldown suite (9/9) is the relevant gate for Fix 5.
