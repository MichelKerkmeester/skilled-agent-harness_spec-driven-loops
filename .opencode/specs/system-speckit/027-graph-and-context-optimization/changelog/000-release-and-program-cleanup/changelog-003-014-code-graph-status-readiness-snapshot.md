---
title: "code_graph_status read-only readiness snapshot [003-fix-mcp-runtime-stress-findings/014-code-graph-status-readiness-snapshot]"
description: "Adds a non-mutating getGraphReadinessSnapshot() helper and wires it into the code_graph_status handler so readiness.action surfaces full_scan / selective_reindex / none instead of always emitting none. Closes the observability gap from the v1.0.2 stress-test 4-hour staleness drift finding."
trigger_phrases:
  - "code graph status readiness snapshot"
  - "getGraphReadinessSnapshot helper"
  - "read-only readiness probe status handler"
  - "readiness action full_scan selective_reindex"
  - "014 code graph status readiness snapshot"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/014-code-graph-status-readiness-snapshot`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The v1.0.2 stress test surfaced a 4-hour staleness drift on the live code graph. The root cause was not the watcher but the status handler: `code_graph_status` collapsed readiness-action to `"none"` unconditionally, even though `ensure-ready.ts` already distinguished fresh / selective-reindex / full-scan states internally. Operators had no way to learn whether a graph was stale without invoking the mutating `code_graph_scan` tool.

A read-only `getGraphReadinessSnapshot()` helper was added to `ensure-ready.ts`, extracting only the `detectState()` branch without inheriting the cache or cleanup or inline-indexer logic from `ensureCodeGraphReady`. The `code_graph_status` handler was patched to call the helper and surface its `action` and `reason` on the readiness block. Nine vitest tests covering criteria A to E plus trust-state and error-path regressions all pass. The `DEFAULT_DEBOUNCE_MS=2000` value was left unchanged per research §5.3, which rejected lowering it as the first fix.

### Added

- `GraphReadinessSnapshot` interface with `{ freshness, action, reason }` shape in `ensure-ready.ts`
- `getGraphReadinessSnapshot(rootDir)` export that calls the read-only `detectState()` branch and returns `{ freshness: 'error', action: 'none', reason }` on probe crash instead of throwing
- `tests/code-graph-status-readiness-snapshot.vitest.ts` (NEW, roughly 270 lines) covering criteria A to E plus trust-state mapping and the error path

### Changed

- `code_graph_status` handler now calls `getGraphReadinessSnapshot()` and surfaces `snapshot.action` and `snapshot.reason` on the readiness block. Hard-coded `action: 'none'` replaced with the snapshot-derived value. A fallback to the canonical state string applies when `snapshot.reason` is empty.

### Fixed

- `readiness.action` on `code_graph_status` responses previously returned `"none"` regardless of actual graph state. It now returns `"full_scan"` / `"selective_reindex"` / `"none"` matching the true graph state.

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` in `mcp_server` | PASS. No compile errors. |
| `npx vitest run tests/code-graph-status-readiness-snapshot.vitest.ts` | PASS. 1 file, 9 tests passed. |
| Test A (fresh state) | PASS. `readiness.action === "none"`, `reason === "all tracked files are up-to-date"`. |
| Test B (empty graph) | PASS. `readiness.action === "full_scan"`, `reason` matches `/empty/i`. |
| Test C (broad stale) | PASS. `readiness.action === "full_scan"`, `reason` matches `/exceed selective threshold/`. |
| Test D (bounded stale) | PASS. `readiness.action === "selective_reindex"`, `reason` matches `/newer mtime/`. |
| Test E (side-effect freedom) | PASS. No call to any of the 12 data-mutating `code-graph-db` exports. No call to `ensureCodeGraphReady`. `getGraphReadinessSnapshot` invoked with `process.cwd()`. |
| Trust-state mapping (empty to missing/absent) | PASS. `data.canonicalReadiness === "missing"`, `data.trustState === "absent"`. |
| Error path (probe crash) | PASS. Returns `freshness: "error"`, `action: "none"`, `reason: "readiness probe crashed: ..."`. |
| `npx vitest run tests/file-watcher.vitest.ts` | PASS. 21 tests passed. `DEFAULT_DEBOUNCE_MS=2000` confirmed unchanged. |
| `npx vitest run tests/code-graph-query-fallback-decision.vitest.ts tests/readiness-contract.vitest.ts` | PASS. 2 files, 21 tests passed. No regressions on related handlers. |
| `validate.sh --strict` on packet folder | DEFERRED. To be run by the driver after daemon restart. |
| Live `code_graph_status` probe | DEFERRED. Requires daemon restart per packet 008 protocol. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` | Modified (+58 lines) | Added `GraphReadinessSnapshot` interface and `getGraphReadinessSnapshot()` export |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts` | Modified (+12 / -5 lines) | Use snapshot helper. Surface `action` and `reason` on readiness block. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | Added (NEW, ~270 lines) | Coverage for criteria A to E plus trust-state regression and error path |

### Follow-Ups

- Run `validate.sh --strict` on the packet folder and record the result before final sign-off.
- Restart the MCP daemon and run a live `code_graph_status` probe to confirm the rebuilt `dist` loads the new helper (per packet 008 protocol).
- Consider surfacing the readiness snapshot in other handlers (query, scan, context) if operators report value after the status change lands.
