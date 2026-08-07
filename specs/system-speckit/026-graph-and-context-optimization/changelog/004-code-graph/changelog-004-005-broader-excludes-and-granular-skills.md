---
title: "Code Graph 004-005: Broader Default Excludes plus Granular Skills plus Readiness Fixes"
description: "Five .opencode folders are now excluded from default code-graph scans. Skill inclusion became granular (selected sk-* lists). Three readiness bugs were repaired. Cross-file CALLS edges were fixed. The tree-sitter wasm path silent regression was resolved."
trigger_phrases:
  - "broader default excludes"
  - "granular skill selection code graph"
  - "fingerprint v2 scope"
  - "readiness fix 009 v3"
  - "cross-file calls resolution"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan/005-broader-excludes-and-granular-skills` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan`

### Summary

Packet 009 excluded `.opencode/skills/**` from default code-graph scans. Four adjacent internal-heavy folders (agents, commands, specs, plugins) remained in scope by default, inflating scans with framework internals that operators rarely need. The `includeSkills` argument was also all-or-nothing, which made targeted skill graph work expensive when only one or two `sk-*` folders were relevant.

This phase extended the scope policy to exclude all five `.opencode` folders by default. Maintainers can opt folders back in with per-folder boolean env vars or per-call scan args. Skills can be included as all-or-nothing or as a selected `sk-*` name list. Scope fingerprints moved to a deterministic v2 format that invalidates stored v1 scope and forces a full scan, so read paths never trust stale policy.

Four follow-on bugs discovered during end-to-end verification were also resolved in the same phase: a candidate manifest drift after explicit user scans, a read-time scope mismatch that blocked reads after per-call scans, an env-drift gate that over-fired on per-call probe scope. A cross-file CALLS edge collapse caused by a wrong tree-sitter wasm grammar path from the compiled `dist/` directory was also fixed. The wasm path bug caused 60 to 80 percent of production symbols to be missing from the index before this phase.

### Added

- Five default exclude constants and env vars for `.opencode/agents`, `.opencode/commands`, `.opencode/specs`, `.opencode/plugins` plus `.opencode/skills`
- `includeSkills: boolean | string[]` scan argument with csv env var support for targeted `sk-*` folder inclusion
- V2 scope fingerprint format with sorted include and exclude globs for deterministic serialization
- `doc` language lane in the indexer that persists `md`, `json`, `jsonc`, `yaml`, `yml` plus `toml` files as zero-node rows so opted-in folders appear in the scope record
- Cross-file CALLS edge resolver that rewrites import-proxy targets to their actual exported definitions after scan persistence
- `cross-file-edge-resolver.ts` with stats for resolved, unresolved plus ambiguous CALLS edges (NEW)

### Changed

- Policy resolver extended to parse five folder env vars, per-call booleans, skill lists, csv env values plus labels with v2 fingerprints
- Walker updated to enforce all five default excludes and to filter by selected skill name when a list is provided
- Scope fingerprint parser returns null for v1 fingerprints so read paths require a full scan before trusting older stored scope
- `getDefaultConfig()` now builds exclude globs from the resolved policy fields
- Status payload expanded with `includedSkills`, `includedAgents`, `includedCommands`, `includedSpecs` plus `includedPlugins` fields
- Public schema validator extended to handle property-level unions and string regex so selected skill arrays validate correctly
- `scan.ts` now calls `recordCandidateManifest` after a successful full scan and recovers stored policy from the fingerprint before the inline auto-heal path

### Fixed

- Candidate manifest drift: after an explicit user-triggered scan, `recordCandidateManifest` was never called from the scan handler, so the status immediately reported `freshness:stale` with reason `candidate manifest drift`
- Read-time scope mismatch: inline auto-heal called `getDefaultConfig` with no policy and re-resolved from env vars, which mismatched stored per-call disabled scope and blocked reads
- Env-drift gate over-firing: `detectState` flipped to `stale + full_scan` for `source: 'scan-argument'` stored scope even when the env changed, making read-after-scan unusable for per-call args. The gate now trusts stored `scan-argument` scope regardless of env drift.
- Tree-sitter wasm path: the relative path `../../node_modules/tree-sitter-wasms/out/...` was correct from source but wrong from `dist/code_graph/lib/`. The parser silently fell back to a regex extractor catching only the first three callable nodes per file. Grammar resolution now uses `require.resolve('tree-sitter-wasms/package.json')` which works from both source and compiled locations.
- Cross-file CALLS edges recorded as unresolved when the caller pointed at an import proxy rather than the actual function definition

### Verification

| Check | Result |
|-------|--------|
| Gate A focused Vitest | PASS: 4 files, 174 tests |
| Gate B full code-graph Vitest | PASS: 19 files, 244 tests |
| Gate C workflow-invariance | PASS: 1 file, 2 tests |
| Gate D strict validate 009 + 011 | PASS: 0 errors, 0 warnings |
| FIX-011-FOLLOWUP-2 Gate B | PASS: 254/254 tests |
| FIX-011-FOLLOWUP-3 direct parse probe | Pre-fix: 21 nodes from `indexer-types.ts`. Post-fix: 42 nodes including `getDefaultConfig`. |
| Repository-wide scan edge delta | Pre-fix: 16,549 edges. Post-fix: 37,180 edges (+125%). |

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/code_graph/lib/index-scope-policy.ts` | Scope constants, env parsing, v2 fingerprints. Walker per-skill filtering. |
| `mcp_server/code_graph/lib/indexer-types.ts` | Default config builds exclude globs from all five policy fields. Doc language detection and default include globs. |
| `mcp_server/lib/utils/index-scope.ts` | Walker enforces five folder excludes and filters by selected skill name. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Stored scope returns expanded fields. `GraphEdgeEnrichmentSummary` extended with cross-file CALLS resolver stats. |
| `mcp_server/code_graph/handlers/scan.ts` | New scope args. Calls `recordCandidateManifest` after successful full scan. Runs cross-file edge resolver before post-persist stats. |
| `mcp_server/code_graph/handlers/status.ts` | Expanded active scope payload with per-folder inclusion fields. |
| `mcp_server/tool-schemas.ts` | Public scan schema updated. |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod scan schema with selected skill array validation. |
| `mcp_server/utils/tool-input-schema.ts` | Property union and string regex validation for public schema. |
| `mcp_server/code_graph/lib/ensure-ready.ts` | Exported `recordCandidateManifest`. Stored-scope reuse block added. Both auto-heal call sites pass `storedPolicy`. Env-drift gate honors `source==='scan-argument'`. |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Short-circuits doc-language files before tree-sitter. |
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | Grammar path switched to `createRequire` plus `require.resolve`. Fallback to legacy relative path on resolution failure. |
| `mcp_server/code_graph/lib/cross-file-edge-resolver.ts` (NEW) | Post-persist resolver rewrites import-proxy CALLS targets to their exported definitions. |
| `mcp_server/code_graph/tests/*.vitest.ts` | Scope matrix tests, v2 round-trip, v1 migration, doc detection, 24-cell folder/file-type matrix, cross-file edge resolver coverage. |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Schema acceptance and rejection coverage. |
| `.mcp.json`, `opencode.json` | Five `SPECKIT_CODE_GRAPH_INDEX_*=true` env vars added to the `spec_kit_memory` MCP block. |
| `mcp_server/code_graph/README.md` | Operator docs for broader excludes, selected skills plus env vars. |
| `mcp_server/ENV_REFERENCE.md` | New env vars documented. |

### Follow-Ups

- Per-folder tracked-file counts are not split out. The status `excludedTrackedFiles` field is preserved but separate counters for agents, commands, specs plus plugins were deferred.
- When a function name exists in both a test fixture and production code, the cross-file resolver conservatively skips the rewrite. Queries on ambiguous duplicate names require using `symbolId` directly.
