---
title: "Changelog: Persistent launcher log [007-mcp-daemon-reliability/018-persistent-launcher-log]"
description: "Chronological changelog for the Persistent launcher log phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/018-persistent-launcher-log` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The launcher now leaves a durable trace. Before this, log() wrote only to stderr, which the MCP host captures inconsistently, so a daemon flap or owner-disposal race vanished with no record. Now every logged line is also appended to a bounded file, so the next incident is attributable from disk. This is the foundational item phase 017 deferred: the later reliability changes (reap hardening, code-index proxy, RC-2) are far easier to validate against real logs.

### Added

- Pure helpers launcherLogIsEnabled, launcherLogMaxBytes, resolveLauncherLogPath, and shouldRotateLauncherLog in mk-spec-memory-launcher.cjs for testable log configuration
- persistLauncherLogLine with best-effort append and single-generation rotation, called from the existing log() function in mk-spec-memory-launcher.cjs
- launcher-persistent-log.vitest.ts with 8 cases covering pure helpers, append, disable, rotate, and no-throw paths

### Changed

- Confirmed log() is the sole stderr sink and reused the durable-write-unavailable guard for the new file append
- Verified *.log gitignore covers the default db-dir path so runtime state stays out of version control
- Exported the helpers and writer from mk-spec-memory-launcher.cjs for test access
- Ran node --check and a require-time helper smoke test (12 assertions pass)

### Fixed

- Non-`.log` custom-path rotation was a no-op; fixed to append `.prev` for any suffix, with a regression test added (found during cross-validation)

### Verification

- node --check launcher - PASS
- require-time helper smoke (12 assertions) - PASS
- launcher-persistent-log.vitest.ts - PASS (8/8)
- launcher-watchdog.vitest.ts (no regression) - PASS (20/20)
- stderr format unchanged - PASS (byte-identical line)
- comment-hygiene (durable WHY, no ids/paths) - PASS
- cross-validation (claude2 + cli-opencode + cli-codex) - found a non-`.log` custom-path rotation no-op -> FIXED (rotate appends `.prev` for any suffix) + regression test
- validate.sh --strict (this packet) - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | persistLauncherLogLine + pure helpers (launcherLogIsEnabled, launcherLogMaxBytes, resolveLauncherLogPath, shouldRotateLauncherLog); log() appends to the durable file; all exported |
| `mcp_server/tests/launcher-persistent-log.vitest.ts` | Created | 8 cases: pure helpers + append/disable/rotate/no-throw integration |

### Follow-Ups

- Single daemon only. This logs the mk-spec-memory launcher. The mk-code-index launcher gets its own observability when its reconnecting proxy lands.
- Text, not structured. Lines are human-readable text matching stderr, not JSON. Sufficient for attributing flaps; a structured format is out of scope.
- Single-generation rotation. Only the most recent window plus one .prev.log is retained; older history is dropped by design to bound disk use.
