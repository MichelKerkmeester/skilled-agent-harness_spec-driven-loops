---
title: "OpenCode Bridge Native Route Fix (F4)"
description: "The skill advisor OpenCode plugin bridge failed open to the python route even when the native advisor compatibility module existed. The bridge now imports the compat module directly, restoring native route service."
trigger_phrases:
  - "opencode bridge native route fix"
  - "F4 mk-skill-advisor-bridge"
  - "native advisor route"
  - "skill advisor bridge compat import"
  - "launcher lease staleness"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

The skill advisor OpenCode plugin bridge (mk-skill-advisor-bridge) failed open to the python route even though the native advisor compatibility module existed on disk. A stale launcher lease with a missing IPC (Inter-Process Communication) socket broke the MCP (Model Context Protocol) handshake, and a blanket catch hid the error. The bridge now imports the native advisor compat module directly as its primary path, with the launcher subprocess kept only as a fallback. The probe is gated on reader-usable trustState so a degraded but usable daemon still serves a native route.

### Added
- None.

### Changed
- The bridge loadNativeAdvisorModules function imports the native advisor compat module directly as the primary path, keeping the launcher subprocess as a fallback.
- The probeNativeAdvisor function is gated on reader-usable trustState so a usable-but-degraded daemon still serves a native route.

### Fixed
- None.

### Verification
- Bridge returns route:native plus advisor brief on warm path: pass
- Direct compat import and status succeeds: pass
- Cold-environment daemon-freshness path: residual, can still fall to python, flagged

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modify | Direct compat import, reader-usable trustState gate, launcher fallback |

### Follow-Ups
- Confirm the compat module exports all four required functions for the bridge.
- Fix the launcher so a held lease without a daemon socket is reclaimed instead of emitting an error to MCP stdout.
- Replace the blanket fail-open catch in the bridge with an accurate diagnostic message.
- Close the cold-environment daemon-freshness residual where the bridge can fall to the python route.
