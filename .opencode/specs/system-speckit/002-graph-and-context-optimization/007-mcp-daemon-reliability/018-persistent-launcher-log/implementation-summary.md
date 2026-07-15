---
title: "Implementation Summary: Persistent launcher log"
description: "The mk-spec-memory launcher now keeps a bounded, best-effort durable log so daemon flaps and owner-disposal races are attributable from a file, not just from stderr the host may drop."
trigger_phrases:
  - "persistent launcher log done"
  - "launcher durable log summary"
  - "attributable flap log"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/018-persistent-launcher-log"
    last_updated_at: "2026-06-07T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped the persistent launcher log (28 launcher tests pass)"
    next_safe_action: "Phase 019 dead-socket reap hardening"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-018-persistent-launcher-log"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-persistent-launcher-log |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The launcher now leaves a durable trace. Before this, `log()` wrote only to stderr, which the MCP host captures inconsistently, so a daemon flap or owner-disposal race vanished with no record. Now every logged line is also appended to a bounded file, so the next incident is attributable from disk. This is the foundational item phase 017 deferred: the later reliability changes (reap hardening, code-index proxy, RC-2) are far easier to validate against real logs.

### Durable, bounded, best-effort log

`log()` keeps its exact stderr line and additionally appends a timestamped, pid-stamped line to the log file. The append is best-effort: a stat or write failure is swallowed so logging can never affect the launcher's control flow, and durable-write-unavailable codes (ENOSPC/EDQUOT/EROFS) reuse the existing report-once path. The file is size-bounded — once it crosses the cap it rotates to a single `.prev.log` generation before the next append — so it cannot grow without bound. It defaults on, lives next to the lease in the runtime db dir (gitignored by `*.log`), and is operator-controllable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | `persistLauncherLogLine` + pure helpers (`launcherLogIsEnabled`, `launcherLogMaxBytes`, `resolveLauncherLogPath`, `shouldRotateLauncherLog`); `log()` appends to the durable file; all exported |
| `mcp_server/tests/launcher-persistent-log.vitest.ts` | Created | 8 cases: pure helpers + append/disable/rotate/no-throw integration |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is additive behind the single `log()` sink, so the stderr output stays byte-identical (no log-parse or test regression). The pure helpers take env + base dir as arguments, which let the watchdog-style unit tests assert every branch, and the integration tests drive the real append/rotation/disable paths against a temp file. Verified with `node --check`, a 12-assertion require-time smoke test, and the launcher vitest suite (persistent-log 8/8 + watchdog 20/20). Operators can disable it with `SPECKIT_LAUNCHER_LOG=0` or repoint/resize it with `SPECKIT_LAUNCHER_LOG_PATH` / `SPECKIT_LAUNCHER_LOG_MAX_BYTES`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Append behind `log()`, keep stderr identical | Captures every existing log call without touching call sites or breaking stderr-format expectations |
| Best-effort, swallow all write errors | Logging must never be able to crash or stall the launcher it is meant to observe |
| Bounded with single-generation rotation | A diagnostic log on shared infra must not grow without bound; one `.prev.log` keeps recent history cheaply |
| Pure helpers + export | Matches the launcher's existing testable-predicate pattern so each branch is unit-tested |
| Default-on, db-dir path, `*.log` gitignore | Captures flaps with zero operator setup while keeping runtime state out of version control |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` launcher | PASS |
| require-time helper smoke (12 assertions) | PASS |
| `launcher-persistent-log.vitest.ts` | PASS (8/8) |
| `launcher-watchdog.vitest.ts` (no regression) | PASS (20/20) |
| stderr format unchanged | PASS (byte-identical line) |
| comment-hygiene (durable WHY, no ids/paths) | PASS |
| cross-validation (claude2 + cli-opencode + cli-codex) | found a non-`.log` custom-path rotation no-op -> FIXED (rotate appends `.prev` for any suffix) + regression test |
| `validate.sh --strict` (this packet) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single daemon only.** This logs the `mk-spec-memory` launcher. The `mk-code-index` launcher gets its own observability when its reconnecting proxy lands (phase 020).
2. **Text, not structured.** Lines are human-readable text matching stderr, not JSON. Sufficient for attributing flaps; a structured format is out of scope.
3. **Single-generation rotation.** Only the most recent window plus one `.prev.log` is retained; older history is dropped by design to bound disk use.
<!-- /ANCHOR:limitations -->
