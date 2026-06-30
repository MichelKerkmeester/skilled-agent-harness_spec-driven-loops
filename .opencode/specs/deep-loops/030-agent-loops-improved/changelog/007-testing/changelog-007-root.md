---
title: "Changelog: Subsystem: Testing — Hermetic Isolation and Record-Replay [007-testing/root]"
description: "Chronological changelog for the Subsystem: Testing — Hermetic Isolation and Record-Replay spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/007-testing` (Level 2)

### Summary

Phase 008 shipped hermetic deep-loop-runtime test isolation and record-replay cassette helpers. Runtime tests now avoid real HOME and database paths, while parity and fanout regressions pin script behavior through reusable record and replay utilities.

### Before vs After

**Before**

Deep-loop-runtime tests could write to the real HOME or runtime database directory and lock, state and fanout tests could cross-contaminate through shared real paths. Script-run regressions also lacked the shipped record and replay helpers pinned into parity and fanout tests.

**After**

The deep-loop-runtime tests now run fully in parallel without writing to the real HOME or runtime database directory. The packet also shipped `recordScriptRun` and `replayScriptRun` helpers in the spawn utility, with cassette regressions pinned in the convergence parity test and the fanout-run test. Parity, tests, typecheck, hygiene and drift checks were green for the phase.

**Impact**

The wired suite is now less dependent on local machine state and less likely to hide interference between tests. Record-replay coverage gives the runtime a stable way to pin script behavior without depending on live execution every time.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-hermetic-test-isolation` | Complete | Deep-loop-runtime tests can now run fully in parallel without writing to the real HOME or runtime database/ directory. Previously the lock/state/fan-out tests shared real paths and could cross-contaminate; this removes that hazard for the wired suite. |
| `002-record-replay-cassette-harness` | Complete | recordScriptRun/replayScriptRun helpers in spawn-cjs.ts + a cassette regression pinned in the convergence parity test and the fanout-run test. Parity + tests green; typecheck/hygiene/drift clean. |

### Added

- No new additions recorded.

### Changed

- This is Phase 7 of the 123-agent-loops-improved subsystem groups.

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
