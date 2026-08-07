# Deep Review Strategy — 019-maintenance-grace-daemon-survives-reelection (lineage p019-opus-3)

## Topic
Review of phase 019: a daemon-written `.maintenance-active.json` marker plus launcher
adopt/refuse-respawn guards so a heavy reindex survives launcher re-election. Fan-out lineage,
executor cli-claude-code (claude-opus-4-8), maxIterations=1.

## Review Dimensions
- [x] Correctness — PASS (predicate + both guard sites correct and fail-safe; refcount module race-free)
- [x] Security — PASS (advisory read-only marker, fail-safe JSON parse, DB-dir boundary-constrained)
- [x] Traceability — PARTIAL (REQs resolve to shipped behavior; doc/schema/path drift → F001-F003)
- [x] Maintainability — PASS w/ advisory (architecture drift F004; otherwise self-documenting)

## Completed Dimensions
All four covered in iteration 1 (single-pass). Verdict: PASS with 4 P2 advisories.

## Running Findings
- P0: 0
- P1: 0
- P2: 4 (F001 embedding-queue doc drift, F002 jobId/labels schema drift, F003 Files-to-Change path drift, F004 inline-vs-module arch drift)

## What Worked
- Locating the real source under `.opencode/bin/` after the spec's `mcp_server/bin/` paths missed.
- Cross-checking the shipped `dist/` artifact to confirm the `labels` field and corroborate the build.
- Tracing `beginMaintenance` usages to find the embedding-queue wiring that contradicts the impl-summary.

## What Failed
- `node --check` re-run was permission-blocked in the read-only sandbox; relied on dist artifact + test require as corroborating build evidence instead.

## Exhausted Approaches
- None.

## Ruled-Out Directions
- canonicalizePath vs realpathAllowMissing leaf-missing divergence: only matters for missing-leaf +
  symlinked-parent, which cannot occur while the marker (and thus the dir) exists. Not a live-path defect.

## Next Focus
None for code. Documentation reconciliation only (F001-F004), all advisory.

## Known Context
No prior memory context loaded (fan-out lineage, fresh init). `resource-map.md not present. Skipping
coverage gate` — the target spec folder has no resource-map.md.

## Cross-Reference Status
### Core (hard)
- spec_code: partial — all REQ-001..004 acceptance criteria resolve to correct shipped behavior; partial
  only on descriptive metadata (marker schema field, file paths, stale limitation). No normative
  requirement contradicted, so the hard gate is not failed.
- checklist_evidence: N/A — Level 1 folder, no checklist.md.

### Overlay (advisory)
- feature_catalog_code: N/A — no catalog entry for this daemon-internal fix.

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| lib/storage/maintenance-marker.ts | full | Writer module; refcount correct; emits `labels` not `jobId` (F002) |
| handlers/memory-index.ts | scan IIFE | `beginMaintenance('index_scan')` + phase-boundary refresh |
| lib/providers/retry-manager.ts | embedding job | `beginMaintenance('embedding-queue')` (F001 source) |
| core/config.ts | DB-dir resolution | REQ-004 parity confirmed |
| .opencode/bin/lib/model-server-supervision.cjs | predicate | `shouldAdoptDespiteProbe` fail-safe; 7 branches tested |
| .opencode/bin/mk-spec-memory-launcher.cjs | both guards | dead-socket (820) + stale-reclaim (1688) |
| tests/launcher-maintenance-guard.vitest.ts | full | predicate + reader; fixtures use `jobId` (F002) |
| stress_test/durability/daemon-reelection-adoption-live.vitest.ts | adopt + stale | SC-001 covered |

## Review Boundaries
maxIterations=1, convergenceThreshold=0.10, severityThreshold=P2, observation-only (no code modified),
lineage artifact dir scoped to review/lineages/p019-opus-3.

## Non-Goals
- Re-running the full live reindex (deploy-time check, out of scope per spec §3).
- Modifying any reviewed code (review is observation-only).

## Stop Conditions
maxIterations=1 reached after a single full-dimension pass with no P0/P1.
