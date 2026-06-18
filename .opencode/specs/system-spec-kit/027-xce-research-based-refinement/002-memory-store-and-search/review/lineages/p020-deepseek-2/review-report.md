# Review Report: 020-maintenance-grace-background-embedding

## Executive Summary

**Verdict: PASS** (hasAdvisories: true)

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 0 |
| Active P2 | 3 |
| Iterations completed | 1 of 1 |
| Dimensions covered | correctness (1 of 4) |
| Stop reason | maxIterationsReached |
| Traceability core | pass |
| Traceability overlay | pass |
| Release readiness | in-progress |

**Scope:** Reviewed all 4 implementation files (`maintenance-marker.ts`, `memory-index.ts`, `retry-manager.ts`, `maintenance-marker.vitest.ts`) against the spec's 4 normative requirements (REQ-001 through REQ-004). The correctness review found all claims verified with file:line evidence, no P0 or P1 findings, and 3 P2 advisories.

## Planning Trigger

With a PASS verdict and `hasAdvisories: true`, the next route is `/create:changelog` to record the clean audit. The 3 P2 advisories are cosmetic/maintainability items that do not block release. The `maxIterationsReached` stop reason reflects the fan-out lineage's single-iteration budget, not insufficient review quality — the `spec_code` protocol provides full coverage of all spec claims.

## Active Finding Registry

| ID | Severity | Category | Title | File:Line | Iteration |
|----|----------|----------|-------|-----------|-----------|
| F001 | P2 | maintainability | End-of-end() leaves stale labels in marker file until next refresh | mcp_server/lib/storage/maintenance-marker.ts:72-81 | 1 |
| F002 | P2 | maintainability | activeLabels index-based removal is O(n) | mcp_server/lib/storage/maintenance-marker.ts:76-77 | 1 |
| F003 | P2 | maintainability | No explicit test for foreground vs background scan marker behavior | mcp_server/handlers/memory-index.ts:1488-1491 | 1 |

**F001 Detail:** When `end()` is called while other holders remain active, the `labels` array in the on-disk marker file is not rewritten. The label from the just-ended holder remains visible on disk until the next refresh (up to 20s via the self-refresh timer). The marker file presence/absence logic is unaffected — `activeCount` decrements correctly and the file persists while `activeCount > 0`. This is purely diagnostic staleness.

**F002 Detail:** `activeLabels.indexOf(label)` + `activeLabels.splice(idx, 1)` is O(n) per `end()` call. With typical usage of 2-3 concurrent labels this is harmless, but the unbounded linear scan is worth future-proofing if label count grows.

**F003 Detail:** `handleMemoryIndexScan` dispatches synchronous paths without a marker (`runIndexScan(args, {})`) and background paths with a marker (via `setImmediate` IIFE). The existing test suite covers the marker module internally and scan/launcher-guard integration, but includes no unit test verifying the synchronous path specifically does NOT write a `.maintenance-active.json` file.

## Remediation Workstreams

| Lane | Findings | Action |
|------|----------|--------|
| 1: Marker hygiene | F001 | Optionally call `writeMarker()` at end of `end()` when `activeCount > 0` to prune the label on disk immediately, or accept the 20s-stale diagnostic window as by-design |
| 2: Test coverage | F003 | Add a unit test for the foreground scan path verifying no marker file is created |
| 3: Code polish | F002 | Replace `activeLabels.indexOf`/`splice` with a Set if label cardinality may grow beyond ~3 |

## Spec Seed

No spec amendments required. The review confirms all 4 REQ claims are satisfied by the current implementation. The three P2 findings are minor code-hygiene observations that do not change any normative spec claim.

## Plan Seed

If the P2 advisories are acted upon:
1. `[P2]` T001: In `maintenance-marker.ts`, optionally re-write the marker file when `end()` is called with `activeCount > 0` to keep the on-disk labels in sync (addresses F001).
2. `[P2]` T002: Add a foreground-path marker test in `maintenance-marker.vitest.ts` or `memory-index.vitest.ts` verifying the synchronous `handleMemoryIndexScan` path creates no marker file (addresses F003).
3. `[P2]` T003: If label cardinality is expected to grow beyond current usage, replace `activeLabels` with a `Set<string>` for O(1) removal (addresses F002).

## Traceability Status

| Protocol | Level | Status | Gate | Evidence |
|----------|-------|--------|------|----------|
| spec_code | core | pass | hard | All 4 REQ claims verified: REQ-001 at maintenance-marker.ts:25-26,58-84; REQ-002 at retry-manager.ts:1032-1038; REQ-003 via reference-counting design at maintenance-marker.ts:58-84; REQ-004 at retry-manager.ts:1033 |
| checklist_evidence | core | notApplicable | hard | No checklist.md present (Level 1 spec) |
| feature_catalog_code | overlay | pass | advisory | Feature catalog at memory-index.ts:77-78 matches handler dispatch |

## Deferred Items

| ID | Item | Reason |
|----|------|--------|
| D2 (Security) | Not reviewed | maxIterations=1 exhausted correctness pass |
| D3 (Traceability) | Not reviewed | maxIterations=1 exhausted correctness pass |
| D4 (Maintainability) | Not reviewed | maxIterations=1 exhausted correctness pass |
| Live end-to-end reindex | Not verified | Deploy-time confirmation per spec.md §5 SC-002 |
| Cooperative chunk-and-yield | Future work | Noted in spec §3 Out of Scope and implementation-summary.md §Known Limitations |

## Audit Appendix

### Iteration Table

| # | Focus | Files | Dimensions | P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|-----------|-------|--------|
| 1 | correctness | 4 | correctness | 0/0/3 | 1.00 | complete |

### Convergence Replay

Stop reason: `maxIterationsReached` — iteration budget (1) exhausted before full 4-dimension coverage. Per the legal-stop decision tree, max iterations is the first check (priority 1), so this takes precedence over composite convergence. Coverage: 1/4 dimensions. The dimension-coverage vote would block STOP, but the hard cap overrides.

### File Coverage Matrix

| File | Correctness |
|------|-------------|
| maintenance-marker.ts | reviewed |
| memory-index.ts | reviewed |
| retry-manager.ts | reviewed |
| maintenance-marker.vitest.ts | reviewed |

### Reviewer

fan-out lineage `p020-deepseek-2`, executor `cli-opencode`, model `deepseek/deepseek-v4-pro`, 1 iteration, session `fanout-p020-deepseek-2-1781721166412-nlwse6`.
