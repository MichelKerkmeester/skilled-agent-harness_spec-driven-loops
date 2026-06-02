---
title: "Implementation Summary: checkpoint-v2 .needs-rebuild Sentinel"
description: "Planning-time stub for the post-restore derived-rebuild sentinel. Records the planned change and will be filled with shipped state and evidence after implementation on a branch."
trigger_phrases:
  - "checkpoint needs-rebuild sentinel"
  - "post-restore derived rebuild failure"
  - "checkpoint sentinel implementation summary"
  - "sentinel shipped state"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Stubbed sentinel impl notes at planning time"
    next_safe_action: "Fill shipped state + evidence after branch implementation"
    blockers: []
    key_files:
      - "mcp_server/lib/storage/checkpoints.ts"
      - "mcp_server/context-server.ts"
      - "mcp_server/handlers/memory-index.ts"
      - "mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-sentinel-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> Status: **PLANNED** - implementation pending on an isolated branch. This is a planning-time stub; it
> will be replaced with shipped state and evidence after implementation.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-checkpoint-needs-rebuild-sentinel |
| **Completed** | PLANNED (not yet implemented) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is planned, not yet implemented. When built, a post-restore derived-rebuild failure will become self-healing: a durable `.needs-rebuild` sentinel guarantees a bounded repair on the next boot and before the startup scan, closing the silent stale-derived window that exists today.

### Durable post-restore rebuild sentinel

The change makes `runPostRestoreRebuilds()` in `mcp_server/lib/storage/checkpoints.ts` return a `{completed, failed, skipped}` summary and exports one shared derived-rebuild helper. `restoreCheckpointV2()` will write a `.needs-rebuild` marker beside the restore-journal artifacts when the rebuild summary reports failed or skipped steps, while still returning success. Boot and the pre-scan checkpoint in `mcp_server/context-server.ts` will probe the sentinel and run the bounded shared helper, clearing it on success; the scan path in `mcp_server/handlers/memory-index.ts` performs the same check under its lease and reports repair counts. Swap-done journal recovery in `mcp_server/lib/search/vector-index-store.ts` preserves or creates rebuild-needed state when post-restore rebuild evidence is absent.

### Shipped (to be filled post-implementation)

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/storage/checkpoints.ts` | Modified (pending) | Rebuild summary + shared helper, `.needs-rebuild` helpers, sentinel write on failed/skipped. |
| `mcp_server/context-server.ts` | Modified (pending) | Boot + pre-scan sentinel check; bounded rebuild; clear on success. |
| `mcp_server/handlers/memory-index.ts` | Modified (pending) | Scan-lease sentinel check + repair count (additive, distinct from packet 004). |
| `mcp_server/lib/search/vector-index-store.ts` | Modified (pending) | Swap-done recovery preserves/creates rebuild-needed state. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery is planned on an isolated branch with unit tests against throwaway DBs only. No `dist/` rebuild, no daemon restart, and no live-DB access occur in this packet; deployment is a separate, explicitly-confirmed step. Verification will run new and affected vitest suites, a scoped typecheck of the touched TypeScript, and `validate.sh --strict` for this packet before any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Wrote a durable sentinel and repair on boot/scan instead of failing the restore | The base snapshot restored fine, so failing a valid restore would lose good data access; the sentinel repairs only the derived gap. |
| Exported one shared derived-rebuild helper | Reusing a single helper across restore, boot, and scan keeps derived artifacts consistent and centralizes idempotency. |
| Retained the sentinel on a failed repair, never blocking boot/scan | A persistently failing rebuild must retry without wedging startup. |
| Kept the `.unclean-shutdown` FTS auto-heal unchanged | The sentinel is a separate, additive trigger, so the existing auto-heal contract is preserved. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` for this packet | PENDING (planning-time stub) |
| New + affected vitest suites | PENDING |
| Scoped typecheck of touched TS | PENDING |
| Forced-failure test: sentinel written + restore returns success | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** This summary is a planning-time stub; shipped state and evidence will replace the PENDING rows after branch implementation.
2. **Best-effort retry without backoff.** A permanently failing rebuild repeats bounded work each boot/scan cycle; bounding retries with a backoff or attempt counter is an open question, not part of this packet.
3. **Deploy is gated.** The change runs on a branch only; applying it to the live daemon is a separate, explicitly-confirmed step.
<!-- /ANCHOR:limitations -->
