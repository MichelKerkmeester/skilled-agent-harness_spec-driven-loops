# Iteration 005: cross-runtime-mirror-consistency

**Dimension**: cross-runtime-mirror-consistency  
**Status**: complete  
**Date**: 2026-05-04T00:00:00Z  

## Scope
TS `level-contract-resolver.ts` vs Shell `resolve_level_contract()` parity, manifest path resolution, API surface alignment.

## Findings

### P2-005: TS resolver has caching + dual-path fallback; shell resolver does not — parity gap
- **Severity**: P2
- **Dimension**: cross-runtime-mirror-consistency
- **Evidence**: 
  - TS: `cachedManifest` singleton (line 62), `resolveManifestPath()` tries DIST_MANIFEST_PATH then DEFAULT_MANIFEST_PATH
  - Shell: No caching, single path resolution via `_manifest_template_path(base_templates_dir)`
- **Impact**: If DEFAULT and DIST manifest paths both exist and diverge, TS resolver may use one while shell uses another. This is a latent inconsistency risk, but low-probability since both paths are specified by the same repo structure.
- **Fix**: Either (a) add caching to shell resolver, or (b) remove dual-path from TS resolver, or (c) add a single canonical manifest path resolution shared between both.

### PASS-012: API surface parity — TS `resolveLevelContract()` matches Shell `resolve_level_contract()` output shape
- **Evidence**: Both produce the same `LevelContract`/`SerializedLevelContract` shape: requiredCoreDocs, requiredAddonDocs, lazyAddonDocs, sectionGates, frontmatterMarkerLevel. Shell consumes TS output via `serializeLevelContract()`, ensuring structural parity.
- **Impact**: No format mismatch risk. Shell is a consumer of the TS resolver, not an independent implementation.

### PASS-013: Error message vocabulary parity — both use Level-only vocabulary per ADR-005
- **Evidence**: TS: "Internal template contract could not be resolved for Level {N}". Shell: same message via TS error propagation. No vocabulary leakage in either path.
- **Impact**: ADR-005 consistently enforced across both runtimes.

### PASS-014: Inline-gate-renderer.sh delegates entirely to TS — zero logic duplication
- **Evidence**: `inline-gate-renderer.sh` is 14 lines: `exec node --import "$LOADER" "$RENDERER" "$@"`. No bash-level gate parsing. Complete delegation.
- **Impact**: Impossible for Shell and TS gate rendering to diverge. Ideal cross-runtime consistency.

## Convergent Assessment
This is the 5th iteration. All review dimensions have been covered:
- D1 implementation-spec-alignment: 2 P1, 1 P2
- D2 code-correctness: 1 P1, 1 P2  
- D3 template-rendering-correctness: 1 P2
- D4 validator-coverage: 1 P1
- D5 cross-runtime-mirror-consistency: 1 P2

Total active: 4 P1, 4 P2, 0 P0. No new findings beyond P2 in this iteration (newFindingsRatio approaching convergence threshold).

## Graph Events
```json
[
  {"type": "DIMENSION", "id": "dim-005", "name": "cross-runtime-mirror-consistency", "iteration": 5},
  {"type": "FILE", "id": "file-level-contract-resolver", "name": "mcp_server/lib/templates/level-contract-resolver.ts", "iteration": 5},
  {"type": "FILE", "id": "file-template-utils", "name": "scripts/lib/template-utils.sh", "iteration": 5},
  {"type": "FINDING", "id": "find-p2-005", "name": "TS vs Shell caching/fallback parity gap", "iteration": 5, "severity": "P2"},
  {"type": "EVIDENCE", "id": "evid-014", "name": "Shell delegates entirely to TS renderer", "iteration": 5},
  {"relation": "COVERS", "sourceId": "find-p2-005", "targetId": "file-level-contract-resolver"},
  {"relation": "COVERS", "sourceId": "find-p2-005", "targetId": "file-template-utils"},
  {"relation": "CONFIRMS", "sourceId": "evid-014", "targetId": "dim-005"}
]
```
