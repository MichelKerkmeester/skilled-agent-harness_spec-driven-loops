---
title: "Cross-Session Kill Scoping, Post-Crash Integrity Gate, and an Index Salvage"
description: "session-cleanup.sh now requires session identity and re-proves ancestry before every kill; dirty-shutdown boots run a whole-DB quick_check and refuse to serve corruption; the live context-index was salvaged at 9,888 of 9,890 rows after the probe found real b-tree damage."
trigger_phrases:
  - "016 cross session kill scoping changelog"
  - "session cleanup ancestry guard shipped"
  - "post crash integrity gate shipped"
  - "context index salvage shipped"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/016-cross-session-kill-scoping` (Level 1)

### Summary

Forensics traced the recurring mid-session MCP transport losses to `session-cleanup.sh`: when `CLAUDE_SESSION_PID` was unset it fell back to the hook's PPID, which under a shared terminal ancestor turned one ending session's "clean up my descendants" into a SIGTERM sweep of every live session's MCP launchers. The cascade — dead launcher, dirty daemon exit, stale socket, `ECONNREFUSED`, torn WAL — also produced the recurring "database disk image is malformed" warnings. The cleanup is now identity-required and ancestry-proofed, dirty boots probe whole-database integrity before serving, and the already-damaged live index was salvaged and swapped in reversibly.

### Fixed

- `session-cleanup.sh`: no PPID fallback (missing identity → deliberate no-op); each kill re-proves the candidate's ppid chain reaches the session pid; log lines carry `matched_by=` / `ancestor_ok=` for incident attribution
- `vector-index-store.ts`: when the `.unclean-shutdown` marker is present at open, `PRAGMA quick_check(1)` runs; on failure a corruption-variant `.needs-rebuild` sentinel is written atomically and startup fails fast instead of serving a malformed database; clean shutdowns skip the probe

### Changed

- Live `context-index.sqlite` replaced with a `sqlite3 .recover` salvage after the probe confirmed structural corruption (invalid page numbers, double-referenced pages; no checkpoint existed): candidate verified `quick_check: ok`, 9,888/9,890 `memory_index` rows, 368 orphans parked in `lost_and_found`; original preserved as `.corrupt-20260606`
- Docs aligned: orphan-sweeper catalog entry, mcp_server README runtime-behavior rows, root README boot-integrity section

### Verification

- Scoping drills ×3 (scratch process trees): no-identity no-op; foreign-session target survives; own-session kill logs `ancestor_ok=yes`
- Integrity drills ×2 (scratch DBs): structural corruption + marker → FATAL + sentinel + refusal; clean DB + marker → normal init
- `tsc --build` clean; dist rebuilt; post-swap live probe `quick_check: ok`
- Verified-already-shipped (no change): launcher childPid-in-lease, stale bootstrap-lockdir reclaim
- vitest runner could not start in this sandbox (environmental); suite rerun owed to the next dev session
