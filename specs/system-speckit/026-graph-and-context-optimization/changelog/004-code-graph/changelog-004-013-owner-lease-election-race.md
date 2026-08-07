---
title: "Code Graph Phase 013: Owner-Lease Election Race (OR-R-01) Investigation"
description: "Read-only investigation into OR-R-01, a residual non-atomic launch-election race in the code-graph launcher. Traced the 4-layer election flow to exact line numbers, confirmed two gates are non-atomic and writeLeaseFile runs outside the bootstrap-lock branch. Classified severity as P2 benign-transient. Corruption path is already closed by OR-1-01. Fix options documented and deferred pending an owner risk-decision."
trigger_phrases:
  - "OR-R-01 election race investigation"
  - "owner lease election race launcher"
  - "writeLeaseFile reprobe non-atomic"
  - "launcher 4-layer single-writer election"
  - "code graph P2 benign transient race"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/013-owner-lease-election-race` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph`

### Summary

The code-graph launcher (`mk-code-index-launcher.cjs`) runs a multi-gate election before spawning the daemon, but two of the gates are non-atomic. The owner-lease reclaim (`acquireOwnerLeaseFile`, lines 373-386) and the `writeLeaseFile` reprobe (lines 948-954) both use a read-after-write check that only catches overlapping concurrent writes, not sequential ones. Worse, `writeLeaseFile` executes outside the `if (lockHeld)` bootstrap-lock branch, so both the bootstrap-lock winner and loser reach it. Under two launchers concurrently reclaiming a stale-heartbeat lease, both can reach `launchServer()`. The daemon does not re-elect atomically. It refreshes the owner lease on a timer (interval `TTL/3`) and self-shuts-down when a refresh finds the lease pid is no longer its own (`index.ts:46-55`). This produces a double-daemon window of up to one heartbeat tick, the "~12 s both alive" observed during the OR-1-01 fix.

A read-only investigation traced the full 4-layer election to exact line numbers and ran prosecutor-vs-defender reasoning to a severity verdict. The corruption-grade outcome (concurrent DB migration) is already closed by OR-1-01 via bootstrap-lock gating and `COPYFILE_EXCL`. What remains is a heartbeat-bounded double-daemon window that SQLite WAL tolerates. Severity is P2 benign-transient. Two fix options (Option A: gate launch on the bootstrap lock, Option B: make `writeLeaseFile` exclusive via `O_EXCL`) were documented. Option B is preferred as it is minimal and localized. The fix is deferred pending an owner risk-decision given concurrent launcher work in progress.

### Added

- Investigation packet: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` documenting the root cause analysis, severity verdict and fix options for OR-R-01 (all NEW).

### Changed

- None. Investigation-only packet. No source files were modified.

### Fixed

- None. The investigation concluded the corruption path is already closed by OR-1-01. The residual race is P2 benign-transient and the code fix is deferred.

### Verification

| Check | Result |
|-------|--------|
| Root cause traced to exact lines | PASS. `mk-code-index-launcher.cjs` 347-386, 602-607, 880-955. `index.ts` 34-55 |
| Corruption path still open | PASS (closed). OR-1-01 bootstrap-lock gating plus `COPYFILE_EXCL` confirmed at lines 880-946 |
| Server re-elects atomically | Confirmed NO. `index.ts` imports only `refreshOwnerLease` and self-shuts-down on mismatch (lines 20, 48-51) |
| Empirical 2-launcher repro | NOT RUN. Severity derived from code trace. Investigation workflow failed on a transient dispatch error |
| Code modified | NONE. Investigation only |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `013-owner-lease-election-race/spec.md` (NEW) | Created | Feature spec: problem statement, 4-layer election race description, fix options A and B, open questions |
| `013-owner-lease-election-race/plan.md` (NEW) | Created | Investigation plan with P0 doc task and deferred P1 fix tasks |
| `013-owner-lease-election-race/tasks.md` (NEW) | Created | Task breakdown for the investigation phase |
| `013-owner-lease-election-race/implementation-summary.md` (NEW) | Created | Full root-cause trace with line numbers, severity classification and key decisions |
| `.opencode/bin/mk-code-index-launcher.cjs` | Unchanged | Fix deferred pending owner risk-decision. Options A and B documented in plan.md |

### Follow-Ups

- Land Option B (make `writeLeaseFile` exclusive via `O_EXCL`) after owner decides to accept the medium risk and schedule with operator awareness of concurrent launcher work in progress.
- Add a two-launcher election regression test that exercises the concurrent stale-heartbeat reclaim path and asserts a single launcher reaches `launchServer()`.
- Run the empirical 2-launcher repro as part of the fix validation. The code-trace severity verdict is P2 but has not been confirmed by observation.
- Verify whether the bootstrap-lock loser branch intentionally allows a second launcher to take over an already-built DB. Confirm the fix must preserve that behavior before implementing Option B.
