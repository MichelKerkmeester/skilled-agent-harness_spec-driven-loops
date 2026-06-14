---
title: "IPC Client Cap Hardening: 8 to 64, and the Bridge Banner Goes Silent"
description: "The daemon IPC socket server capped concurrent clients at 8 and refused extras by accept-then-close, so session fan-outs made every fresh probe fail instantly with exit 75, and the plugin's stderr skip banner rendered into the opencode input field. Cap raised to 64 everywhere; banner debug-gated."
trigger_phrases:
  - "004/007 ipc client cap hardening changelog"
  - "max secondary clients 64"
  - "bridge skipped banner silenced"
  - "027 004/007 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/007-ipc-client-cap-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

A fresh Fable 5 debug seat empirically root-caused the persistent `[mk-code-graph] Bridge skipped (exit=75)` banner: the shared daemon IPC socket server capped concurrent clients at 8 and refused excess connections by accepting then immediately closing them. Each live session's launcher holds one persistent slot, so a multi-seat fan-out saturated the cap and every fresh short-lived connection (the plugin's warm probe, the inner CLI call) died with EPIPE in about 2ms — measured directly as 1 served reply and 9 instant EPIPEs across 10 parallel connections at saturation, with the daemon healthy throughout. An at-cap refusal is also byte-for-byte indistinguishable from a dead daemon to probes, so a healthy daemon could be falsely reaped. The default cap is now 64 in both real module copies (the canonical shared one consumed by spec-memory and the advisor via re-export shims, and the code-graph local copy), pinned as `SPECKIT_MAX_SECONDARY_CLIENTS=64` in all nine daemon env blocks across the three runtime configs. Separately, the plugin wrote its skip diagnostic to raw stderr while the opencode TUI was active, which renders into the user's input field; the emitter is now silent by default, re-enabled by `MK_CODE_GRAPH_DEBUG=1`, with the diagnostic still inspectable via the plugin's status tool.

### Added

- None. The knob (`SPECKIT_MAX_SECONDARY_CLIENTS`) already existed; this phase changes its default and pins it.

### Changed

- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` — default cap 8 to 64 with the durable rationale
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` — same bump in the local copy
- `.opencode/plugins/mk-code-graph.js` — bridge-skip diagnostic debug-gated instead of unconditional stderr
- `opencode.json`, `.claude/mcp.json`, `.codex/config.toml` — knob pinned to 64 for all three daemons
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` — knob row updated with the new default and reasoning

### Fixed

- New-session bridge probes no longer fail instantly under session fan-out once daemons respawn with the new cap.
- The skip banner can no longer pollute the opencode input field, regardless of bridge outcome.

### Verification

| Check | Result |
|-------|--------|
| Root cause | PASS: empirical slot-cap experiment (1 reply + 9 instant EPIPEs at cap), lease fresh, socket paths matched, daemon healthy |
| Sources and dists | PASS: both module copies and both compiled (gitignored) dists carry 64 |
| Config knobs | PASS: 3 occurrences in each of the three runtime configs |
| Banner | PASS: present in pre-fix session stderr captures, silent after the gate |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Modified |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modified |
| `.opencode/plugins/mk-code-graph.js` | Modified |
| `opencode.json` | Modified |
| `.claude/mcp.json` | Modified |
| `.codex/config.toml` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified |

### Follow-Ups

- Refused connections should receive a one-line "busy" JSON-RPC error before close so probes can distinguish an at-cap daemon from a dead one (prevents false reaping of healthy daemons under fan-out).
- The plugin bridge's warm-probe budget is hardcoded at 100ms and under-provisioned under load; it should accept a probe-budget flag.
- Live daemons adopt the new cap on their next natural respawn.
