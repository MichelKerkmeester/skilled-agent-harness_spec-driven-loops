---
title: "Metadata Edge Promoter: Deterministic Packet Lineage as Causal Edges (Schema v33)"
description: "The memory index now promotes authored packet lineage from graph-metadata.json and description.json into generated causal edges during scan indexing. Manual edges are preserved. Schema advances to v33 with confidence and extraction_method provenance columns on causal_edges."
trigger_phrases:
  - "metadata edge promoter"
  - "frontmatter causal edges"
  - "schema v33 provenance columns"
  - "packet lineage causal edges"
  - "027 003 003 changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/003-metadata-edge-promoter` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle`

### Summary

The memory index now promotes authored packet lineage metadata into causal edges during scan indexing. `lib/causal/frontmatter-promoter.ts` handles three validated gaps: `graph-metadata.json.parent_id`, `graph-metadata.json.children_ids`, and `description.json.parentChain`. Already-wired manual metadata links remain on the existing causal-link processor path and are not re-promoted. Parent and parent-chain metadata create `derived_from` edges from the current packet to the ancestor. Child metadata creates `enabled` edges from the current packet to each child. Generated edges write `created_by='auto'`, `extraction_method='frontmatter'`, and `confidence=1.0`. Stale generated edges for removed metadata are routed through the tombstone sweep helper before deletion. The schema advances to v33 with additive `confidence` and `extraction_method` columns that make generated edges auditable without changing existing manual rows.

### Added

- `lib/causal/frontmatter-promoter.ts`: parses graph and description metadata, normalizes packet ids, resolves packet memory rows, and emits deterministic generated causal edges with idempotent re-run behavior
- `mcp_server/tests/frontmatter-promoter.vitest.ts`: 20-test suite covering mappings, idempotency, warnings for unindexed targets, manual edge preservation, and tombstone routing

### Changed

- `lib/storage/causal-edges.ts`: accepts optional generated-edge confidence and extraction method on upsert paths
- `lib/causal/sweep.ts`: captures new provenance fields in tombstone restore metadata
- `lib/search/vector-index-schema.ts`: bumped to v33 with additive `confidence` and `extraction_method` columns on `causal_edges`
- `handlers/memory-index.ts`: invokes the promoter after successful metadata indexing and reports processed, resolved, inserted, skipped-manual, stale-tombstoned, stale-deleted, and warning counts in the scan result
- `tests/vector-index-schema-compatibility.vitest.ts`: minimal schema footprint updated for v33 provenance columns
- `tests/vector-index-schema-incremental-foundation.vitest.ts`: covers incremental foundation behavior on the v33 schema path
- `tests/vector-index-schema-migration-refinements.vitest.ts`: terminal schema version pinned to 33 with v33 migration verified

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS: exited 0 |
| `npx vitest run tests/frontmatter-promoter.vitest.ts tests/vector-index-schema-migration-refinements.vitest.ts tests/vector-index-schema-compatibility.vitest.ts` | PASS: 3 files, 20 tests |
| Extended causal suite (16 files, 330 tests) | PASS |
| Comment hygiene check | PASS for all modified code and test files |
| `validate.sh ... --strict` | PASS: 0 errors, 0 warnings |
| Alignment drift checker | FAIL outside scope: pre-existing `canonical-fingerprint.ts`, `memo.ts`, and `deploy-mcp.sh` not modified by this phase |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/causal/frontmatter-promoter.ts` | Created | Extracts and promotes validated packet metadata relationships as generated causal edges |
| `mcp_server/lib/storage/causal-edges.ts` | Modified | Accepts optional confidence and extraction method on generated edge upsert paths |
| `mcp_server/lib/causal/sweep.ts` | Modified | Captures provenance fields in tombstone restore metadata |
| `mcp_server/lib/search/vector-index-schema.ts` | Modified | v33 additive migration adds confidence and extraction_method to causal_edges |
| `mcp_server/handlers/memory-index.ts` | Modified | Runs metadata promotion after successful indexing with per-packet result counts |
| `mcp_server/tests/frontmatter-promoter.vitest.ts` | Created | Mapping, idempotency, warning, manual preservation, and tombstone coverage |
| `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Modified | Minimal footprint updated for v33 provenance columns |
| `mcp_server/tests/vector-index-schema-incremental-foundation.vitest.ts` | Modified | Incremental foundation behavior verified on v33 schema path |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Modified | Terminal schema version pinned to 33 |

### Follow-Ups

- The promoter resolves packet ids to indexed memory rows. Unindexed targets produce warnings and no partial edge is created; this will self-resolve as those packets are indexed.
- Three pre-existing out-of-scope alignment-verifier defects remain: `canonical-fingerprint.ts`, `memo.ts`, and `deploy-mcp.sh`.
