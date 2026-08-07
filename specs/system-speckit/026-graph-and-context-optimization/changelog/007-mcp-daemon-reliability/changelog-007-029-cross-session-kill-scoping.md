---
title: "Changelog: Cross-Session Kill Scoping + Post-Crash Integrity Gate [007-mcp-daemon-reliability/029-cross-session-kill-scoping]"
description: "Chronological changelog for the Cross-Session Kill Scoping + Post-Crash Integrity Gate phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/029-cross-session-kill-scoping` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

Two fixes and one rescue. session-cleanup.sh no longer guesses its identity: without CLAUDE_SESSION_PID it does nothing, and before every kill it re-proves the candidate's ancestor chain reaches this session's pid — a sibling session's launcher can never satisfy that, which closes the cross-session kill path behind today's mid-session MCP losses. The vector-index store gained a post-crash integrity gate: when the dirty-shutdown marker is present at open, it runs PRAGMA quick_check(1), and on failure writes the checkpoint needs-rebuild sentinel and refuses to serve, mirroring the dimension-mismatch fail-fast shape. The probe found the live index already structurally corrupted (invalid page numbers, double-referenced pages — the source of the "database disk image is malformed" warnings); with no checkpoint available, sqlite3 .recover salvaged a clean candidate that was verified and swapped in, with the corrupted original preserved beside it.

### Added

- Kill-time ancestry re-proof in `session-cleanup.sh`: before every kill the script re-verifies the candidate's ancestor chain reaches this session's pid, replacing the removed PPID fallback. Attributable log fields (`matched_by`, `ancestor_ok`) added for post-mortem traceability.
- Post-crash integrity gate in `vector-index-store.ts`: when the dirty-shutdown marker is present at open, the store runs `PRAGMA quick_check(1)` and on failure writes the `needs-rebuild` sentinel and refuses to serve, mirroring the existing dimension-mismatch fail-fast shape.

### Changed

- Forensics analysis of MCP disconnect root causes from logs and source confirmed that the launcher childPid lease and stale bootstrap-lockdir reclaim already shipped in prior reliability phases; no reimplementation needed.
- Salvaged the live vector-index store using `sqlite3 .recover`, producing a verified clean candidate swapped in with the corrupted original preserved as `.corrupt-20260606`.
- Ran three scoping drills (no-identity no-op, foreign-session isolation, own-session kill with ancestor chain validation) and two integrity drills (structural corruption with marker triggers FATAL + sentinel + throw; clean DB with marker initializes normally).
- Post-swap probe confirmed `quick_check` ok with 9,888 of 9,890 rows recovered and 368 orphans parked in `lost_and_found`.

### Fixed

- Removed the PPID fallback from `session-cleanup.sh`: under a shared terminal the PPID resolves to a common ancestor, turning scoped cleanup into a fleet kill. Missing `CLAUDE_SESSION_PID` now produces a no-op instead of a dangerous fallback.
- Closed the cross-session kill path where a sibling session's launcher process could match the cleanup regex and be killed, causing mid-session MCP losses.

### Verification

- Scoping drill: no identity - PASS — action=skip reason=no-session-pid, zero kills
- Scoping drill: foreign session - PASS — sibling tree's matching process survived
- Scoping drill: own session - PASS — kill with matched_by=name ancestor_ok=yes
- Integrity drill: corrupted + marker - PASS — FATAL logged, sentinel written with probe verdict, init throws
- Integrity drill: clean + marker - PASS — normal initialization
- tsc + dist build - PASS (exit 0 both)
- Live index post-swap - PASS — quick_check ok; 9,888/9,890 rows; 368 orphans in lost_and_found
- vitest suite - NOT RUN — the runner's vite server fails to start in this sandbox (environmental); typecheck + behavioral drills carry verification; suite rerun owed to the next dev session

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/scripts/session-cleanup.sh` | Modified | Identity-required + ancestry-proofed kills + attributable logging |
| `mcp_server/lib/search/vector-index-store.ts` | Modified | Marker-gated quick_check + corruption sentinel writer |
| `mcp_server/database/context-index.sqlite` | Replaced | Salvaged index (original kept as .corrupt-20260606) |

### Follow-Ups

- The recovered index lost 2 rows and parked 368 orphans in lost_and_found — an embedding reconcile / index scan pass re-derives drift from canonical docs; not yet run.
- The shared-daemon owner-shutdown question (one session legitimately stopping the daemon others share) remains with the watchdog/respawn phases.
- The new integrity gate takes effect from the next daemon start (dist rebuilt; daemon was down at ship time).
