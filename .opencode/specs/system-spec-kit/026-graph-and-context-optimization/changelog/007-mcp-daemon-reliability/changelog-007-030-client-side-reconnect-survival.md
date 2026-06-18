---
title: "Changelog: Phase 30: Client-Side MCP Reconnect Survival [007-mcp-daemon-reliability/030-client-side-reconnect-survival]"
description: "Chronological changelog for the Phase 30: Client-Side MCP Reconnect Survival phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/030-client-side-reconnect-survival` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

Status: NOT STARTED. This phase is a planning artifact, not shipped work. It was opened from an investigation into why Claude Code still needs a manual /mcp after a client-side MCP transport drop, even though v3.5.0.4 made the daemon survive session disposal. The investigation found the daemon and launcher stay alive; only Claude's client↔launcher stdio link drops, and stdio servers get no client-side auto-reconnect.

### Added

- None. This phase is a planning artifact, not shipped work.

### Changed

- Status: NOT STARTED. Opened from an investigation into why Claude Code still needs a manual /mcp after a client-side MCP transport drop, even though the daemon now survives session disposal. The investigation found the daemon and launcher stay alive; only the client-to-launcher stdio link drops, and stdio servers get no client-side auto-reconnect.

### Fixed

- None.

### Verification

- validate.sh --strict on this packet - PASS, Errors: 0 (structural validation of the planning docs)
- Implementation - NOT RUN (planning artifact; no code shipped yet)

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Add frontend stdin-EOF, end, and close logging with timestamp and pid in mk-spec-memory-launcher.cjs to attribute the next client disconnect
- Add stdout EPIPE and write-error logging on the serving pipe in mk-spec-memory-launcher.cjs
- Mirror the same instrumentation in the code-index launcher (mk-code-index-launcher.cjs)
- Capture and classify one real disconnect from the launcher log (idle-reap vs transport error vs orphan-exit)
- If idle-reap confirmed: flag-gated default-off keepalive notification emitter in launcher-session-proxy.cjs
- Confirm stdout hygiene: trace writeLeaseHeldDiagnostic reachability on the serving path and reroute to stderr if reachable
