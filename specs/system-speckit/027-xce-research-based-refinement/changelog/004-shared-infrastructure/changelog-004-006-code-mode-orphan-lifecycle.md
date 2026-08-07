---
title: "Code Mode MCP Orphan Lifecycle: The Server Exits With Its Session"
description: "The mcp-code-mode stdio MCP server had no session-lifetime handling, so hard-killed sessions left permanent PPID-1 orphans (16 accumulated, oldest 11 days). It now exits on stdin EOF, transport close, or reparenting to PID 1; the orphan population was reaped to zero."
trigger_phrases:
  - "004/006 code mode orphan lifecycle changelog"
  - "stdio server exits with session"
  - "ppid orphan reap"
  - "027 004/006 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/006-code-mode-orphan-lifecycle` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The Code Mode MCP server (`mcp-code-mode/mcp_server/index.ts`) connected its stdio transport and never handled session end: no stdin-EOF handler, no transport-close handler, no parent watchdog. A hard-killed opencode session left the server alive forever, reparented to PID 1. Sixteen such orphans (oldest 11 days) had accumulated, degrading shared daemon infrastructure and contributing to new-session bridge-probe timeouts. A new `exitWhenSessionEnds()` now exits the process on stdin end or close (the normal session-end signal), on transport close, and — for hard kills that deliver no EOF — when an unref'd 15-second watchdog observes reparenting to PID 1. Session end exits 0: it is a lifecycle event, not a failure. The accumulated orphans were reaped with operator authorization; live session-attached servers were left to exit with their sessions naturally.

### Added

- `exitWhenSessionEnds(transport)` in the server entrypoint — stdin EOF/close exit, transport-close exit, and the reparent watchdog

### Changed

- `.opencode/skills/mcp-code-mode/mcp_server/index.ts` — `main()` wires the lifecycle handling before connecting the transport; `dist/` rebuilt (gitignored, adopted locally by new sessions)

### Fixed

- Permanent PPID-1 orphan accumulation from hard-killed sessions; the 16 existing orphans were reaped to a zero census.

### Verification

| Check | Result |
|-------|--------|
| Build | PASS: `tsc` clean, dist carries the lifecycle handling |
| stdin EOF smoke | PASS: `node dist/index.js < /dev/null` exits 0 promptly (previously hung indefinitely) |
| Orphan census | PASS: 16 reaped to 0; live session-attached servers untouched |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/mcp-code-mode/mcp_server/index.ts` | Modified |

### Follow-Ups

- A no-EOF hard-kill orphan can live up to the 15-second watchdog interval — bounded, versus forever before.
