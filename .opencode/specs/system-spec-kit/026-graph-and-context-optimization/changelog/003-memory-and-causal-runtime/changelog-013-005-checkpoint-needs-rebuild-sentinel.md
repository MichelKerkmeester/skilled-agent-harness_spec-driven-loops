---
title: "013/005 Checkpoint-v2 .needs-rebuild Sentinel: durable post-restore self-heal"
description: "A checkpoint-v2 restore that hits a failed/skipped derived rebuild now writes a durable .needs-rebuild sentinel and repairs it on boot/scan, instead of reporting success with stale FTS/community/graph artifacts. Implemented via parallel gpt-5.5-fast xhigh, integrated, and deployed."
trigger_phrases:
  - "checkpoint needs-rebuild sentinel changelog"
  - "post-restore derived rebuild self-heal"
  - "checkpoint v2 restore stale derived"
  - "boot scan rebuild repair"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation`

### Summary

Shipped and **deployed** the second deferred follow-up. After a checkpoint-v2 restore, `runPostRestoreRebuilds()` rebuilds derived artifacts (FTS, communities, derived graph) best-effort and **catches** failures — so a failed/skipped rebuild left the restore reporting success with stale derived state and no repair signal (the existing `.unclean-shutdown` boot auto-heal does not cover checkpoint-restore rebuild failures). This packet adds a durable `.needs-rebuild` sentinel written on that path and a bounded, non-fatal boot/scan repair that clears it on success. The restore itself still succeeds — the source snapshot is valid. Implemented via `cli-opencode gpt-5.5-fast --variant xhigh`, integrated with 004, and deployed.

### Added

- `.needs-rebuild` sentinel path/write/clear helpers in `lib/storage/checkpoints.ts` (near the restore-journal helpers).
- One exported, shared derived-rebuild helper reused by restore, boot, and scan (avoids divergent rebuild implementations); `runPostRestoreRebuilds()` now returns a `{completed, failed, skipped}` summary.
- Boot/scan sentinel checks in `context-server.ts` (after DB init + before the scheduled startup scan) and under the scan lease in `handlers/memory-index.ts` (repair counts surfaced); swap-done journal-recovery rebuild-needed handling in `lib/search/vector-index-store.ts`.
- vitest: forced-rebuild-failure writes the sentinel and the restore still succeeds; a successful repair clears it; a failed repair leaves it (non-blocking); swap-done journal recovery handles the sentinel semantics.

### Changed

- `restoreCheckpointV2()` writes the sentinel when the rebuild summary has failed/skipped steps (restore still returns success).
- Boot + scan paths run the bounded, non-fatal shared rebuild helper and clear the sentinel only on success (never block boot or the scan on a rebuild failure).

### Fixed

- The silent stale-derived window after a post-restore rebuild failure: derived artifacts are now repaired on the next boot or scan via the durable sentinel, rather than waiting for an unrelated full scan.

### Verification

- 20 core vitest pass in isolation; 45/45 in the integrated branch with 004.
- `validate.sh --strict`: 0 errors.
- Integration testing caught and fixed one real cross-feature bug: 004's `SCHEMA_VERSION` 29→30 bump invalidated this packet's "refuses manifests from a newer schema version" test (it hardcoded `schemaVersion: 30` as "future"); fixed to a far-future value (`9999`), production downgrade-guard unchanged.
- **Deployed** with 004 (shared dist rebuild + daemon restart); daemon healthy on the new dist, schema durable.

### Files Changed

| File | Change |
|------|--------|
| `mcp_server/lib/storage/checkpoints.ts` | Modify — rebuild summary, shared derived-rebuild helper, `.needs-rebuild` write/clear, sentinel on restore failure |
| `mcp_server/context-server.ts` | Modify — boot + pre-scan sentinel check → bounded non-fatal repair → clear |
| `mcp_server/handlers/memory-index.ts` | Modify — sentinel check under scan lease + reported repair counts |
| `mcp_server/lib/search/vector-index-store.ts` | Modify — swap-done journal recovery preserves rebuild-needed state |
| `mcp_server/tests/checkpoint-needs-rebuild-sentinel.vitest.ts` (+ handler-memory-index-needs-rebuild, checkpoints-v2-restore, handler-memory-index, async-scan, context-server) | Create/extend — coverage incl. the cross-feature schema-version fix |

### Follow-Ups

- None required. The `.needs-rebuild` sentinel self-clears on the next successful boot/scan rebuild after a checkpoint restore.
