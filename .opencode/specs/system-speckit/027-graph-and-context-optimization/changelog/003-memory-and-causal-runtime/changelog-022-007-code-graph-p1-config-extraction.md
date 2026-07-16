---
title: "022/007 Code-Graph P1 Config Extraction: CODE_GRAPH_DEFAULTS consolidation with env-var overrides"
description: "Closed 6 P1 audit findings by creating config-defaults.ts with CODE_GRAPH_DEFAULTS, wiring 5 consumer files, shipping a 15-assertion invariant test. Added 5 SPECKIT_CODE_GRAPH_* env-var rows to ENV_REFERENCE.md."
trigger_phrases:
  - "022/007 code-graph config extraction"
  - "CODE_GRAPH_DEFAULTS env-var overrides"
  - "config-defaults.ts code-graph"
  - "SPECKIT_CODE_GRAPH_TTL_MS"
  - "hardcoded default remediation code-graph"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/007-code-graph-p1-config-extraction`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Code-graph had five hardcoded constants scattered across separate consumer files with no env-var overrides. `owner-lease.ts` held `DEFAULT_TTL_MS=60000`. `structural-indexer.ts` held `FIND_FILES_MAX_DEPTH=20`. `apply-orchestrator.ts` held `DEFAULT_QUARANTINE_AGE_DAYS=14`. `budget-allocator.ts` and `indexer-types.ts` each held frozen object constants (`DEFAULT_FLOORS`, `DEFAULT_EDGE_WEIGHTS`). Operators had no mechanism to tune any of these at runtime, which was flagged as 6 P1 audit findings.

A new `config-defaults.ts` module was shipped with a single `CODE_GRAPH_DEFAULTS` typed object covering all five values. Scalar overrides read from `SPECKIT_CODE_GRAPH_TTL_MS`, `SPECKIT_CODE_GRAPH_FIND_FILES_MAX_DEPTH` and `SPECKIT_CODE_GRAPH_QUARANTINE_AGE_DAYS`. Object overrides read from `SPECKIT_CODE_GRAPH_FLOORS_JSON` and `SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON` via JSON partial merge with try/catch and fallback. All five consumer files were rewired to import from the new module. A 15-assertion invariant test covers defaults, env-var overrides, JSON partial merges and shape preservation. `ENV_REFERENCE.md` gained 5 new rows. Typecheck exited 0 and 58 vitest tests passed alongside the new 15/15 invariant suite.

### Added

- `config-defaults.ts` module with `CODE_GRAPH_DEFAULTS` object covering `ttlMs`, `findFilesMaxDepth`, `quarantineAgeDays`, `floors` and `edgeWeights`
- `parsePositiveInt` helper for scalar env-var overrides with NaN-guard fallback
- `config-defaults.vitest.ts` with 15 invariant assertions covering defaults, env-var overrides, JSON partial merges and shape preservation
- Five `SPECKIT_CODE_GRAPH_*` rows in `ENV_REFERENCE.md` under a new `CODE GRAPH` section

### Changed

- `owner-lease.ts`: `DEFAULT_TTL_MS` now assigned from `CODE_GRAPH_DEFAULTS.ttlMs`
- `structural-indexer.ts`: `FIND_FILES_MAX_DEPTH` now assigned from `CODE_GRAPH_DEFAULTS.findFilesMaxDepth`
- `apply-orchestrator.ts`: `DEFAULT_QUARANTINE_AGE_DAYS` now assigned from `CODE_GRAPH_DEFAULTS.quarantineAgeDays`
- `budget-allocator.ts`: `DEFAULT_FLOORS` export now assigned from `CODE_GRAPH_DEFAULTS.floors`
- `indexer-types.ts`: `DEFAULT_EDGE_WEIGHTS` export now assigned from `CODE_GRAPH_DEFAULTS.edgeWeights` with `Readonly<Record<EdgeType, number>>` assertion preserved

### Fixed

- Five hardcoded numeric and object constants in code-graph consumer files were unreachable by operators at runtime. The `CODE_GRAPH_DEFAULTS` consolidation backed by env-var reads closes all 6 P1 findings from the 021 audit.

### Verification

| Check | Result |
|---|---|
| `config-defaults.ts` created with `CODE_GRAPH_DEFAULTS` | PASS |
| 5 consumer files import from `config-defaults.ts` | PASS (11 grep hits: 1 import decl + 10 consumer refs) |
| `ENV_REFERENCE.md` 5 new `SPECKIT_CODE_GRAPH_*` rows | PASS |
| `config-defaults.vitest.ts` invariant test | PASS (15/15 assertions) |
| `vitest` full suite | PASS (58 pass. 1 pre-existing failure in `code-graph-siblings-readiness` confirmed unrelated) |
| `npm run typecheck:root` | exit 0 |
| Bundle gate | PASS |
| `validate.sh --strict` packet 007 | PASS |

### Files Changed

| File | Action |
|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts` (NEW) | Created. `CODE_GRAPH_DEFAULTS` object with 5 fields. `parsePositiveInt` helper. JSON partial-merge with try/catch fallback for object overrides. |
| `.opencode/skills/system-code-graph/mcp_server/tests/config-defaults.vitest.ts` (NEW) | Created. 15 invariant assertions covering defaults, all scalar env-var overrides, JSON partial merges and shape preservation. |
| `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` | Modified. `DEFAULT_TTL_MS` wired to `CODE_GRAPH_DEFAULTS.ttlMs`. |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified. `FIND_FILES_MAX_DEPTH` wired to `CODE_GRAPH_DEFAULTS.findFilesMaxDepth`. |
| `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts` | Modified. `DEFAULT_QUARANTINE_AGE_DAYS` wired to `CODE_GRAPH_DEFAULTS.quarantineAgeDays`. |
| `.opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts` | Modified. `DEFAULT_FLOORS` export wired to `CODE_GRAPH_DEFAULTS.floors`. |
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modified. `DEFAULT_EDGE_WEIGHTS` export wired to `CODE_GRAPH_DEFAULTS.edgeWeights` with type assertion preserved. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified. 5 new `SPECKIT_CODE_GRAPH_*` rows added under new `CODE GRAPH` section. |

### Follow-Ups

- Confirm that `DEFAULT_FLOORS` and `DEFAULT_EDGE_WEIGHTS` named exports continue to satisfy all downstream callers after the indirect assignment via `CODE_GRAPH_DEFAULTS`.
- Ten P2 audit findings were effectively closed by the consolidation pattern but were not individually documented. A follow-on pass should record the closure evidence for each P2 finding.
- Pre-existing `TS6307` errors in `system-code-graph`'s own `tsc` (cross-project reference to `system-spec-kit/shared/embeddings/registry.ts` introduced in phase 005) are unrelated to this phase and do not affect `typecheck:root` or runtime behavior.
