---
title: "Implementation Summary: standalone save second-writer guard"
description: "Step 11.5 now detects a live mk-spec-memory daemon before importing the indexing runtime, skips standalone direct indexing when that daemon is up, and points operators to MCP memory_index_scan."
trigger_phrases:
  - "standalone save second writer summary"
  - "Step 11.5 daemon guard summary"
  - "daemon contention diagnostic summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented standalone save daemon guard"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `013-standalone-save-second-writer-guard` |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
| **Status** | implemented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The standalone save workflow now preserves the daemon-owned SQLite writer boundary. A new `daemon-detect.ts` helper resolves the canonical mk-spec-memory launcher lease, parses `pid`/`ownerPid`, and probes liveness with the same ESRCH-tolerant `process.kill(pid, 0)` behavior that workflow stale-lock cleanup uses. `workflow.ts` imports that shared liveness helper, removes its duplicate local copy, and calls `isSpecMemoryDaemonAlive()` before Step 11.5 imports the indexing API.

When the daemon is alive, Step 11.5 logs a specific skip message naming the second-writer risk and the incident class, then returns without calling `initializeIndexingRuntime()` or `reindexSpecDocs()`. When the daemon is not alive, the existing standalone indexing path remains available. The broad catch now recognizes `embedding_cache` UNIQUE, `SQLITE_BUSY`, and `vector_index is null` as daemon/contention signals and points operators to `memory_index_scan`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts` | Created | Read launcher lease and report daemon PID liveness |
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modified | Share liveness helper, guard Step 11.5, and improve contention diagnostics |
| `.opencode/skills/system-spec-kit/scripts/tests/daemon-detect.vitest.ts` | Created | Verify live PID, dead PID, and missing lease behavior |
| `.opencode/skills/system-spec-kit/scripts/tests/workflow-step115-daemon-guard.vitest.ts` | Created | Verify daemon-up skip and contention fallback warning |
| `.opencode/commands/memory/save.md` | Modified | Add daemon-up/down indexing contract for standalone saves |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/*.md` | Created | Packet documentation and checklist |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is intentionally read-only around the launcher lease. It does not acquire the launcher lock, does not touch `acquireIndexScanLease`, and does not modify the daemon, launcher, sibling packets, DB files, or SQLite pragmas. The Step 11.5 logic was extracted into a small helper so tests can prove the daemon-up path returns before the dynamic indexing import.

The operator contract now matches the runtime behavior: standalone `generate-context.js` may direct-index only when the daemon is down; when the daemon is up, the save finishes its canonical doc writes and freshness is completed through daemon-owned MCP `memory_index_scan`.

**Review fix (P0).** A focused adversarial review caught that the initial `resolveSpecMemoryDaemonLeasePath()` walked a fixed 2 levels up from the compiled `dist/core` location, landing at the nonexistent `scripts/mcp_server/database/` instead of the launcher's `<system-spec-kit>/mcp_server/database/`. The detector therefore always returned `alive:false` and the guard was **dead code** — the exact second-writer bug shipped unfixed. Fixed by anchoring on the `system-spec-kit` ancestor marker (layout-robust across `dist/core` vs `core`), mirroring the launcher's lease derivation, plus a regression test pinning the no-arg resolution to the canonical dir. Verified empirically against the live daemon: the detector now resolves the real lease and returns `{alive:true, pid:73257}` (it returned `{alive:false}` before the fix).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the launcher lease without acquiring it | It is a launcher-vs-launcher PID guard, not an index scan lock |
| Probe `pid` first and `ownerPid` second | The observed lease shape contains both, and either can identify the launcher owner |
| Skip before dynamic importing indexing | Importing and initializing the indexing runtime is the path that opens the standalone DB writer |
| Keep daemon-down direct indexing | Standalone direct indexing is legitimate when no daemon owns the DB |
| Make contention diagnostics specific | Silent generic skips leave canonical docs written but retrieval stale without a clear next step |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` from `.opencode/skills/system-spec-kit/scripts` (tsc) | PASS |
| Focused scripts vitest (daemon-detect + workflow-step115-daemon-guard) | PASS (6 tests, incl. the new no-arg path-resolution regression guard) |
| Empirical live-daemon check (fixed detector vs running daemon pid 73257) | PASS — resolves the real lease, returns `{alive:true, pid:73257}` (was `{alive:false}` pre-fix) |
| Focused adversarial review | 1 P0 (dead-code lease-path) FIXED + empirically confirmed; pid-reuse false-positive accepted (safe: skip + route, not corruption) |
| `validate.sh --strict` on this packet | PASS (0/0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Daemon-up saves intentionally leave the index stale until MCP scan runs.** Canonical docs are already durable on disk before Step 11.5.
2. **The detector is lease-based.** Missing or corrupt leases return `alive:false` and preserve standalone behavior.
3. **This is not a full lease-respect implementation.** Acquiring launcher or in-DB scan leases is explicitly out of scope for this packet.
4. **PID-reuse false-positive (accepted).** If a dead daemon's pid is reused by an unrelated live process, the detector reports `alive:true` and skips standalone indexing (routing to MCP). The failure mode is a deferred-stale index + a routing message, never corruption — strictly safer than letting the second writer through; no `ownerPid`/`startedAt` cross-check is done (parity with the launcher's own pid check).
<!-- /ANCHOR:limitations -->

