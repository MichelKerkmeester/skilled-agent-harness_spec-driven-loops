---
title: "Boot Integrity-Check + Retention Durability + Probe Liveness Fix"
description: "Three durability and liveness guards shipped: a detect-only boot FTS integrity-check gated on an unclean-shutdown crash marker, a durable retention sweep that reclaims space after deletes, plus a liveness probe that requires a JSON-RPC initialize reply before bridging so a hung daemon is reaped and respawned."
trigger_phrases:
  - "boot FTS integrity check"
  - "unclean shutdown crash marker"
  - "retention sweep durability"
  - "deepProbe reap fix"
  - "launcher-ipc-bridge probe timeout"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

After packet 010 made the at-rest WAL durable, three gaps remained. A daemon killed mid-write could leave the FTS5 index torn with no detection at the next boot. The retention sweep committed its delete transaction but never reclaimed space or truncated the WAL. The launcher liveness probe could be satisfied by a bare socket connect, meaning a hung daemon that accepted connections but never answered JSON-RPC would be bridged into rather than reaped.

Three guards landed to close these gaps. First, `vector-index-store.ts` now writes a `.unclean-shutdown` crash marker on DB open and deletes it on clean close after the WAL TRUNCATE. On boot, when the marker is present, `context-server.ts` runs an async-after-ready FTS5 `integrity-check`. On failure, health is set to `corrupt` and a loud banner is logged with the committed runbook referenced. The marker path is derived from `vectorIndex.getDbPath()` so it tracks the actually-opened DB under `MEMORY_DB_PATH`. No auto rebuild or index swap is attempted. The check is detect-only.

Second, `memory-retention-sweep.ts` now runs best-effort FTS `optimize`, a guarded `incremental_vacuum` (only when `auto_vacuum == INCREMENTAL`) and `wal_checkpoint(TRUNCATE)` after a delete transaction commits. Each step runs in its own try/catch outside the transaction so a durability failure cannot abort the committed delete.

Third, `launcher-ipc-bridge.cjs` raises `DEFAULT_PROBE_TIMEOUT_MS` from 2500 to 5000 (configurable via `SPECKIT_PROBE_TIMEOUT_MS`, clamped strictly below the 7000ms launcher grace). The bridge decision now requires a JSON-RPC initialize reply from `deepProbe` rather than a bare socket connect.

### Added

- Detect-only boot FTS5 `integrity-check` in `context-server.ts`, gated on the crash marker, running async-after-ready with health `corrupt` plus banner and runbook pointer on failure
- `.unclean-shutdown` crash marker lifecycle in `vector-index-store.ts` written on DB open, deleted on clean close after the WAL TRUNCATE, with path derived from `vectorIndex.getDbPath()`
- Post-delete best-effort durability block in `memory-retention-sweep.ts` covering FTS `optimize`, guarded `incremental_vacuum` and `wal_checkpoint(TRUNCATE)`, all outside the transaction
- Regression vitest coverage for the boot integrity-check, deepProbe-required reap and retention durability behaviors

### Changed

- `DEFAULT_PROBE_TIMEOUT_MS` in `launcher-ipc-bridge.cjs` raised from 2500 to 5000, with `SPECKIT_PROBE_TIMEOUT_MS` env override clamped strictly below 7000ms
- Reap decision on the `maybeBridgeLeaseHolder` path now requires a JSON-RPC initialize reply via `deepProbe: true` rather than accepting a bare connect-ok

### Fixed

- Hung daemon behavior: a daemon that accepted a socket but never replied to JSON-RPC initialize was previously bridged and never respawned. The deepProbe requirement now reaps and respawns it instead.
- Crash marker path divergence: the marker path diverged from the opened DB directory when `MEMORY_DB_PATH` was set. Deriving the path from `getDbPath()` keeps the marker beside the correct DB.
- False-reap under short probe timeout: a busy-but-responsive daemon could be false-reaped under the prior 2500ms probe timeout. The raised 5000ms timeout prevents this while keeping the launcher 7000ms grace intact.

### Verification

- `npm run build --workspace=@spec-kit/mcp-server` (tsc): PASS
- Targeted vitest suites (context-server, launcher-ipc-bridge-probe, memory-retention-sweep, lifecycle-shutdown, vector-index-store): PASS (385+ green)
- Boot integrity-check gated on marker presence: PASS
- deepProbe required on reap decision with probe timeout clamped below 7000ms: PASS
- Focused adversarial review: 1 P1 (probe connect-ok regression, FIXED) + 2 LOW (marker-dir divergence FIXED / marker lingers after fatal boot loop DOCUMENTED)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Marker-gated detect-only boot FTS integrity-check with marker path from `vectorIndex.getDbPath()` and health `corrupt` + banner + runbook pointer on failure |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified | Write `.unclean-shutdown` crash marker on DB open and delete it on clean close after the WAL TRUNCATE |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Post-delete best-effort FTS `optimize` + guarded `incremental_vacuum` + `wal_checkpoint(TRUNCATE)` outside the transaction |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | Probe timeout raised to 5000ms with env override clamped below 7000ms. deepProbe JSON-RPC reply required on the reap decision. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Regression assertions for marker-gated boot integrity-check behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Modified | Regression assertions for deepProbe-required reap and probe timeout clamp |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | Regression assertions for post-delete durability work and the guarded `incremental_vacuum` |

### Follow-Ups

- Auto-recover is intentionally deferred. This packet ships detect-only. An automatic rebuild or index swap on a corrupt verdict is a follow-on with its own failure modes.
- The crash marker can persist after a fatal dimension-mismatch boot loop. It survives until a clean close, costing one extra cheap read-only integrity-check per boot. Bounded and self-clearing with no false `corrupt` verdict.
