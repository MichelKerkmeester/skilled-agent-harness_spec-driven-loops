---
title: "Implementation Summary: checkpoint-v2 .needs-rebuild Sentinel"
description: "Shipped-state summary for the post-restore derived-rebuild sentinel. Records the implemented .needs-rebuild marker, shared rebuild helper, boot/pre-scan/scan repair paths, and verification evidence."
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
    last_updated_at: "2026-06-02T10:03:31Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Needs-rebuild sentinel shipped, deployed to main; focused tests green"
    next_safe_action: "None binding; merged and deployed to main"
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
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> Status: **SHIPPED + DEPLOYED** - merged to main and live (dist rebuilt, daemon restarted); focused vitest coverage passes.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-checkpoint-needs-rebuild-sentinel |
| **Completed** | 2026-06-02 - shipped and deployed to main |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet implements a durable `.needs-rebuild` sentinel for degraded checkpoint-v2 post-restore derived rebuilds. The restored base snapshot still reports success, while stale derived artifacts are marked for bounded repair on boot, immediately before the scheduled startup scan, and under the explicit `memory_index_scan` lease.

### Durable post-restore rebuild sentinel

`runPostRestoreRebuilds()` in `mcp_server/lib/storage/checkpoints.ts` now returns a `{completed, failed, skipped}` summary through the exported `runDerivedArtifactRebuilds()` helper. `restoreCheckpointV2()` writes `.needs-rebuild` beside the restore journal when that summary has failed or skipped steps, and still returns success for a valid restored base snapshot.

Boot and pre-scan repair call `repairNeedsRebuildSentinel()` from `mcp_server/context-server.ts`; the helper catches failures, clears the sentinel only on a fully successful rebuild, and leaves it in place for retry on failure. `mcp_server/handlers/memory-index.ts` performs the same repair under the scan lease and reports repair counts in the MCP response. `mcp_server/lib/search/vector-index-store.ts` creates/preserves the marker during swap-done journal recovery, where rebuild evidence is absent.

### Shipped

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/storage/checkpoints.ts` | Modified | Rebuild summary + exported shared helper, `.needs-rebuild` helpers, sentinel write on degraded checkpoint-v2 rebuild, repair wrapper. |
| `mcp_server/context-server.ts` | Modified | Boot + pre-scan sentinel repair using the shared wrapper; non-fatal logging; clear on success. |
| `mcp_server/handlers/memory-index.ts` | Modified | Scan-lease sentinel repair in a distinct early region; response includes repair counts. |
| `mcp_server/lib/search/vector-index-store.ts` | Modified | Swap-done recovery creates or preserves rebuild-needed state before journal finalization. |
| `mcp_server/tests/checkpoints-v2-restore.vitest.ts` | Extended | Restore failure sentinel write and swap-done marker semantics. |
| `mcp_server/tests/checkpoint-needs-rebuild-sentinel.vitest.ts` | Added | Successful repair clears sentinel; failed repair retains sentinel. |
| `mcp_server/tests/handler-memory-index-needs-rebuild.vitest.ts` | Added | Scan response reports repair counts under the lease. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation and focused vitest (throwaway SQLite/temp files) stayed inside an isolated branch. It then merged to main alongside the `004` memory_save enrichment follow-up, the `dist/` was rebuilt, and the daemon was restarted — the sentinel is live.
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
| `npx vitest run tests/checkpoint-needs-rebuild-sentinel.vitest.ts tests/checkpoints-v2-restore.vitest.ts tests/handler-memory-index-needs-rebuild.vitest.ts tests/handler-memory-index-async-scan.vitest.ts tests/handler-memory-index-cooldown.vitest.ts` | PASS - 30 passed / 30 total |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` | PASS - 1475 files scanned, 0 findings |
| Comment hygiene on changed source files and new tests | PASS - no violations reported |
| Raw no-emit typecheck | BLOCKED - `npx tsc --noEmit --pretty false` stops on existing `baseUrl` deprecation; scoped rerun is blocked by existing missing type/module declarations such as `better-sqlite3`, `@spec-kit/shared/*`, and `@modelcontextprotocol/sdk/client/index.js` |
| Forced-failure test: sentinel written + restore returns success | PASS - `checkpoints-v2-restore.vitest.ts` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Best-effort retry without backoff.** A permanently failing rebuild repeats bounded work each boot/scan cycle; bounding retries with a backoff or attempt counter is an open question, not part of this packet.
2. **Typecheck environment remains unresolved.** Focused vitest and alignment verification passed, but no-emit TypeScript checks are blocked by existing project type-resolution/configuration issues.
3. **Deployed.** The change is merged to main and live on the daemon (dist rebuilt, daemon restarted); this was the explicitly-confirmed deploy step.
<!-- /ANCHOR:limitations -->
