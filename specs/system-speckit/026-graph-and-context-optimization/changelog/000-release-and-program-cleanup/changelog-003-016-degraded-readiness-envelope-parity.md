---
title: "Degraded-readiness envelope parity: context and status handler alignment"
description: "P1 remediation that aligns code_graph_context and code_graph_status with the shared degraded-readiness vocabulary from code_graph_query. Both handlers now emit structured readiness fields and an rg recovery signal on crash paths."
trigger_phrases:
  - "degraded readiness envelope parity"
  - "code_graph_context readiness crash fix"
  - "code_graph_status DB unavailable snapshot"
  - "F-001 F-003 remediation"
  - "rg fallback handler parity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/016-degraded-readiness-envelope-parity` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

A 10-iteration cli-codex deep-review of the 012-015 integrated implementation returned a CONDITIONAL verdict with two P1 findings. `code_graph_context` (F-001) fell through to `buildContext()` on a readiness probe crash and returned a generic error envelope that dropped every structured readiness field operators rely on. `code_graph_status` (F-003) read `graphDb.getStats()` before `getGraphReadinessSnapshot()`, so a locked or corrupted DB caused the snapshot helper to never run and silenced the action-level readiness signal that packet 014 had introduced.

This packet closed both P1 findings alongside three P2 items (F-002, F-008, F-009) as a single coherent unit. All three code-graph handlers now emit the same degraded-readiness vocabulary on crash paths: `readiness`, `canonicalReadiness`, `trustState`, `graphAnswersOmitted` plus a `fallbackDecision` pointing to `rg`. Operators see one consistent envelope. Downstream callers route to one consistent recovery action.

### Added

- `buildContextFallbackDecision()` helper in `context.ts` mirroring `query.ts:buildFallbackDecision()` shape. Returns `{ nextTool: 'rg', reason }` for a crash path and `{ nextTool: 'code_graph_scan', reason: 'full_scan_required' }` for the full-scan path.
- New test file `code-graph-degraded-readiness-envelope-parity.vitest.ts` with 7 tests across three describe blocks: F-001 contract (3 tests), F-003 contract (3 tests), cross-handler vocabulary parity (1 test).
- 4 new fixtures in `readiness-contract.vitest.ts` pinning `error` to `missing` (canonicalReadiness) and `unavailable` (trustState), plus `buildQueryGraphMetadata` short-circuit on `error` (F-009).
- ADR-001 in `decision-record.md` documenting the shared-vocabulary and handler-local-payload split.
- ADR-002 in `decision-record.md` documenting the snapshot-first and isolate-stats defense-in-depth ordering.

### Changed

- `context.ts:shouldBlockReadPath()` extended to return `true` when `readiness.freshness === 'error'`. The blocked-envelope branch now differentiates crash (`message: 'code_graph_not_ready: ...'`, `requiredAction: 'rg'`, `blockReason: 'readiness_check_crashed'`) from the full-scan-required path. `graphDb.getStats()` access inside the blocked envelope wrapped in `try/catch` for defense in depth.
- `status.ts:handleCodeGraphStatus()` reordered to call `getGraphReadinessSnapshot()` before `graphDb.getStats()`. Stats call wrapped in `try/catch`. On failure the handler short-circuits to a structured `status: 'error'` payload that retains `data.readiness`, `data.canonicalReadiness`, `data.trustState` plus `data.fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' }`. Post-stats catch updated to do the same with `reason: 'status_path_failed'`.

### Fixed

- `code_graph_context` no longer drops structured readiness fields on a probe crash. The response is `status: 'blocked'` with the full envelope rather than a bare `status: 'error'` string (F-001).
- `code_graph_status` no longer silences the readiness snapshot when `getStats()` throws. The snapshot runs first and is preserved in both catch paths (F-003).
- `readiness-contract.vitest.ts` no longer omits the `error` freshness projection. The suite now covers the full set of freshness values including the crash case (F-009).

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` in `mcp_server/` | PASS (no errors) |
| `npx vitest run tests/readiness-contract.vitest.ts` | PASS. 1 file, 19 tests passed (was 13) |
| `npx vitest run tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` | PASS. 1 file, 7 tests passed |
| `npx vitest run tests/code-graph-status-readiness-snapshot.vitest.ts` | PASS. 1 file, 10 tests passed (packet 014 invariant) |
| `npx vitest run tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | PASS (packet 015 invariant) |
| `npx vitest run tests/code-graph-query-fallback-decision.vitest.ts` | PASS. Query handler vocabulary unchanged |
| Combined regression (`vitest.stress.config.ts`, 7 files) | PASS. 60 tests passed |
| `npx vitest run tests/file-watcher.vitest.ts` | PASS. 21 of 21 (`DEFAULT_DEBOUNCE_MS=2000` unchanged) |
| F-001 contract: context readiness-crash returns blocked envelope | PASS. `status: 'blocked'`, full envelope shape verified |
| F-001 defense in depth: stats throws during envelope assembly | PASS. Envelope ships with `lastPersistedAt: null` |
| F-003 contract: stats throws, snapshot preserved | PASS. `data.fallbackDecision.nextTool === 'rg'`, `blockReason === 'stats_unavailable'` |
| F-003 both snapshot crash and stats throw | PASS. `trustState === 'unavailable'` (not `'absent'`) |
| F-003 healthy-path regression | PASS. `status: 'ok'`, no degraded markers |
| Cross-handler parity sweep (F-008) | PASS. Context and status crash agree on `canonicalReadiness: 'missing'`, `trustState: 'unavailable'`, `fallbackDecision.nextTool: 'rg'` |
| Live MCP probe under induced DB lock | DEFERRED. Requires daemon restart per packet 008 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modified (+50 / -3 lines) | Block read path on `freshness === 'error'`. Emit shared degraded envelope with rg fallback (F-001). |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modified (+72 / -10 lines) | Snapshot-first ordering. Isolated stats try/catch. Preserved snapshot on stats and post-stats failure (F-003). |
| `.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts` | Modified (+42 / -2 lines) | 4 new fixtures pinning `error` to `missing` and `unavailable`, plus `buildQueryGraphMetadata` short-circuit (F-009). |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` (NEW) | Added (~387 lines) | F-001 and F-003 contract tests plus cross-handler parity sweep (F-008 proof). |

### Follow-Ups

- Run a live `code_graph_status` and `code_graph_context` probe under induced DB lock after daemon restart to confirm the rebuilt `dist` loaded. Deferred per packet 008 dependency.
- Update catalog and playbook docs to note that `fallbackDecision` is now emitted by `context` as well as `query`. Deferred to Packet C (018).
- Callers that switch on `requiredAction` must add an arm for `'rg'` alongside the existing `'code_graph_scan'` arm. No shipped caller is known to rely exclusively on the old value.
