---
title: "Changelog: OpenCode Bridge Native Route Fix (F4)"
description: "The bridge failed open to python even when the native compat module was available. This shipped a direct compat import path so the OpenCode plugin returns route:native with an Advisor brief instead of silent python fail-open."
trigger_phrases:
  - "opencode bridge native route fix"
  - "F4 mk-skill-advisor-bridge"
  - "loadNativeAdvisorModules direct compat"
  - "route native Advisor brief"
  - "launcher lease stale socket"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

The bridge was failing open to the python route even though the native compat module was available, because it spawned a launcher subprocess and a stale lease with a missing IPC socket caused the MCP handshake to fail silently. The bridge now imports `dist/mcp_server/compat/index.js` directly as the primary native path, keeping the launcher subprocess only as a fallback. The probe is gated on a reader-usable trustState so a usable-but-degraded daemon still serves a native route. With this, the OpenCode plugin returns `route:"native"` with an `Advisor:` brief instead of silent python fail-open. A cold-environment residual where the bridge can still fall to python remains flagged for follow-up.

### Added

- None.

### Changed

- Bridge `loadNativeAdvisorModules()` now imports `dist/mcp_server/compat/index.js` directly as the primary native path, with the launcher subprocess kept only as fallback.
- `probeNativeAdvisor` is now gated on a reader-usable `trustState` so a usable-but-degraded daemon still serves a native route instead of failing open to python.

### Fixed

- None.

### Verification

- Bridge returns `route:"native"` with `Advisor:` brief (warm path) - pass
- Direct compat import plus `readAdvisorStatus` succeeds - pass
- Cold-environment daemon-freshness path - RESIDUAL: bridge can still fall to python in cold environments, flagged for follow-up

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modified | Direct compat import as primary path, launcher subprocess retained as fallback, probe gated on reader-usable trustState |

### Follow-Ups

- Close the cold-environment daemon-freshness path so the bridge does not fall to python when the daemon is not yet reader-usable
- Fix the launcher so a held lease without `daemon-ipc.sock` is treated as stale and reclaimable instead of emitting `LEASE_HELD_BY... (no-bridge-socket)` to MCP stdout
- Replace the blanket fail-open catch with an accurate diagnostic
- Confirm compat/index.js exports `probeAdvisorDaemon`, `readAdvisorStatus`, `handleAdvisorRecommend`, and `buildSkillAdvisorBrief`
