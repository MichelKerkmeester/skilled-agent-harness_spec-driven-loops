---
title: "Code Graph Phase 003: Backend Resilience Implementation"
description: "Five backend resilience streams land as concrete TypeScript patches: hash-aware staleness predicate, resolver upgrades with path-alias support, edge-weight tuning plus drift detection, self-healing observability, plus the gold-battery code_graph_verify MCP tool. All 15 tasks shipped with build passing after every task and 501 targeted tests green."
trigger_phrases:
  - "code graph backend resilience implementation"
  - "code_graph_verify MCP tool"
  - "hash-aware staleness predicate"
  - "edge drift detection code graph"
  - "gold battery verifier code graph"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/003-code-graph-backend-resilience-implementation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor`

### Summary

The code-graph backend had five concrete resilience gaps identified in the upstream research packet. `isFileStale()` relied on mtime alone and missed edits that preserved timestamps. The resolver did not capture import kind or path aliases so cross-file edges were incomplete. Edge weights were hard-coded with no operator override path. Self-healing operations left no observable trail in `ReadyResult`. The gold-query battery in `assets/code-graph-gold-queries.json` had no runtime to execute against.

All five gaps were closed via 15 sequential TypeScript tasks dispatched through a cli-codex orchestrator. The hash-aware staleness predicate compares content hashes when mtime matches, catching timestamp-preserving edits. The resolver now captures `moduleSpecifier`, `importKind` plus `exportKind`, resolves tsconfig path aliases, then emits cross-file `IMPORTS` edges. Edge-weight overrides are opt-in via `IndexerConfig.edgeWeights`. Drift detection (PSI, JSD, share drift) surfaces on every status call. `ReadyResult` carries `selfHealAttempted`, `selfHealResult`, `verificationGate` plus `lastSelfHealAt` fields so operators can see what the self-heal path did. The new `code_graph_verify` MCP tool runs the 28-query battery, persists the result in `code_graph_metadata`, then blocks on a stale graph by default.

Build passed after every task. Three test files needed a post-run fix-up. Targeted re-run returned 501 of 501 green.

### Added

- `getCodeGraphMetadata` and `setCodeGraphMetadata` helpers in `code-graph-db.ts` backed by the existing `code_graph_metadata` table
- `gold-query-verifier.ts` library that loads `assets/code-graph-gold-queries.json`, derives v1 outline probes, runs them via `handleCodeGraphQuery`, then aggregates per-query plus overall pass rates
- `edge-drift.ts` module exporting `computeEdgeShare`, `computePSI` plus `computeJSD` for distribution drift computation
- `handlers/verify.ts` implementing the `code_graph_verify` MCP tool with readiness blocking, battery execution, result persistence plus `allowInlineIndex:false` default
- `code-graph-verify.vitest.ts` test suite covering blocking behavior and missing-symbol detection
- `selfHealAttempted`, `selfHealResult`, `verificationGate` plus `lastSelfHealAt` fields on `ReadyResult` in `ensure-ready.ts`

### Changed

- `isFileStale()` and `ensureFreshFiles()` in `code-graph-db.ts` now compare stored `content_hash` against the live file when mtime matches, falling back to mtime-only when the stored hash is null
- `RawCapture` in `structural-indexer.ts` extended with `moduleSpecifier`, `importKind` plus `exportKind` fields captured by the tree-sitter parser on every import and export
- `structural-indexer.ts` cross-file resolver reads `tsconfig.json` once per scan, normalizes `paths` aliases, then emits cross-file edges to resolved targets
- `IndexerConfig` in `indexer-types.ts` gains optional `tsconfigPath`, `baseUrl`, `pathAliases` plus `edgeWeights` fields
- `scan.ts` propagates the `ParseResult.contentHash` to `isFileStale`, persists edge-distribution baseline on full scan, then accepts an opt-in `verify` flag to run the gold battery after persistence
- `status.ts` surfaces `lastGoldVerification`, `goldVerificationTrust`, `verificationPassPolicy` plus `edgeDriftSummary` from metadata

### Fixed

- `isFileStale()` returned false for files edited with a preserved mtime. The hash-compare fallback now catches this case.
- Cross-file `IMPORTS` edges were missing for imports resolved through tsconfig `paths` aliases. The new path-alias resolver emits edges to the resolved target files.
- Type-only imports were not distinguishable from value imports in edge metadata. The `importKind:"type"` field and weight cap of 0.5 now differentiate them.
- `detect_changes` hard block at `handlers/detect-changes.ts` was untested. New test cases assert `status:"blocked"` is preserved on stale graph and verification failure without inline mutation.

### Verification

| Check | Result |
|-------|--------|
| All 15 tasks complete with evidence | PASS. See `tasks.md` and `scratch/runner.log`. |
| `npm run build` in `mcp_server` | PASS after every task. Final state clean. |
| Targeted test re-run after fix-up | PASS. `context-server.vitest.ts`, `layer-definitions.vitest.ts`, `crash-recovery.vitest.ts` returned 501 of 501. |
| `code_graph_verify` MCP tool reachable | PASS. Registered in `tool-schemas.ts`, exported from `handlers/index.ts`, dispatched through `code-graph-tools.ts`. |
| `code_graph_verify` blocks on stale graph | PASS. `ensureCodeGraphReady` called with `allowInlineIndex:false` and `allowInlineFullScan:false`. |
| `detect_changes` hard block preserved | PASS. Covered by new test cases in `detect-changes.test.ts`. |
| Hash predicate distinguishes same-mtime different-content | PASS. Covered by `code-graph-indexer.vitest.ts`. |
| Edge-weight overrides resolve correctly | PASS. Defaults preserved when `IndexerConfig.edgeWeights` is unset. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Metadata helpers. Hash-aware stale predicates. |
| `system-code-graph/mcp_server/lib/gold-query-verifier.ts` | Created (NEW) | Gold battery loader and probe executor. |
| `system-code-graph/mcp_server/lib/edge-drift.ts` | Created (NEW) | PSI, JSD, share drift computation. |
| `system-code-graph/mcp_server/lib/ensure-ready.ts` | Modified | Self-heal observability fields on `ReadyResult`. |
| `system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | Resolver capture, cross-file resolver, edge-weight config. |
| `system-code-graph/mcp_server/lib/tree-sitter-parser.ts` | Modified | Captures `importKind`, `exportKind`, `moduleSpecifier` on import/export nodes. |
| `system-code-graph/mcp_server/lib/indexer-types.ts` | Modified | `IndexerConfig` extended with `tsconfigPath`, `baseUrl`, `pathAliases`, `edgeWeights`. |
| `system-code-graph/mcp_server/handlers/verify.ts` | Created (NEW) | `code_graph_verify` MCP handler. |
| `system-code-graph/mcp_server/handlers/scan.ts` | Modified | Hash propagation, drift baseline persistence, opt-in verify flag. |
| `system-code-graph/mcp_server/handlers/status.ts` | Modified | Surfaces verification result, drift summary, pass policy. |
| `system-code-graph/mcp_server/handlers/index.ts` | Modified | Exports `handleCodeGraphVerify`. |
| `system-code-graph/mcp_server/handlers/detect-changes.ts` | Modified | New test coverage for the hard block. Production logic preserved verbatim. |
| `system-code-graph/mcp_server/tools/code-graph-tools.ts` | Modified | Dispatches `code_graph_verify`. |
| `system-code-graph/mcp_server/tool-schemas.ts` | Modified | Registers `VerifySchema` and exports. |
| `system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | Modified | Adds `code_graph_verify` (L7) and `detect_changes` (L6) to `TOOL_LAYER_MAP`. |
| `system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts` | Created (NEW) | Verifier test suite. |

### Follow-Ups

- Address pre-existing test failures outside this packet's scope. The full vitest run surfaced roughly 20 failures in `copilot-hook-wiring`, `codex-prompt-wrapper`, `checkpoints-extended`, `exclusion-ssot-unification` and `graph-payload-validator`. None touch the code-graph subsystem changed here.
- Add support for two-level tsconfig `extends` chains. The resolver walks `extends` once. Deeply-nested chains fall back silently. This is a known gap. Address it when real repos hit it.
- Implement gold battery v2 schema dispatch. The verifier loads v1 entries and warns on v2 `probe` fields without acting. v2 dispatch deferred until the asset migrates.
- Parallelize `code_graph_verify` probe execution. The 28-query battery runs serially. Parallelization is straightforward and deferred.
- Automate drift baseline rotation. Operators currently set a baseline manually by passing `persistBaseline:true` on a canonical scan. Automatic aging or rotation is not yet implemented.
