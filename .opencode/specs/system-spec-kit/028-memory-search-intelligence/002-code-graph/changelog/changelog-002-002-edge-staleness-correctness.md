---
title: "Changelog: Code-Graph Edge-Staleness Correctness (dependency-transitivity + rename SUPERSEDES) [002-code-graph/002-edge-staleness-correctness]"
description: "Chronological changelog for the Code-Graph Edge-Staleness Correctness (dependency-transitivity + rename SUPERSEDES) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/002-edge-staleness-correctness` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

The edge-staleness repair is implemented behind default-off gates. Incremental scans can now snapshot changed dependencies, expand to their importers before node replacement and force-parse those importers so cross-file edges rebind to the dependency's new symbol ids. Rename lineage is also preserved through a tombstone-gated `SUPERSEDES` edge keyed on matching content hash. The fan-in benchmark remains pending before any default-on decision.

### Added

- `queryImportersOf(stalePaths)` beside the existing full-table reverse-dependency query.
- A default-off force-parse path that lets changed dependencies pull their importers back into the parse batch.
- Tombstone-gated rename lineage through `SUPERSEDES` edges keyed by matching content hash.
- Focused coverage for re-derived imports, body-edit controls, ordering and tombstone-gated lineage.

### Changed

- The scan loop captures reverse-dependents before persistence, while the old read-path query remains available for query handlers.
- `forceParse` overrides the fresh-file skip only for importer files pulled in by the dependency-transitive repair.
- `SCHEMA_VERSION` stays unchanged because rename lineage uses the existing edge table and tombstone substrate.

### Fixed

- A dependency refactor no longer silently deletes import edges until the importer changes.
- Body-only edits avoid unnecessary importer re-parsing when symbol ids remain stable.
- Rename and move lineage can be retained without changing the schema or default read behavior.

### Verification

- Skip seam and content-hash staleness gate - PASS
- Reverse-dependency re-derive tests - PASS
- Body-edit control test - PASS
- Rename lineage and absent-edge parity tests - PASS
- Typecheck and focused code-graph suite - PASS
- Strict phase validation - PASS
- Fan-in re-parse benchmark - NOT RUN, default-on remains gated

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | Adds the default-off force-parse path for importer files |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Adds path-filtered importer lookup and tombstone-gated `SUPERSEDES` lineage |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modified | Carries forced importer files through persistence |
| `.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts` | Added | Covers reverse-dependency repair, controls, ordering and lineage parity |

### Follow-Ups

- Benchmark fan-in re-parse cost on a hot high-importer file before any default-on flip.
- Keep the repair default-off until the benchmark proves the scan cost is acceptable.
- No measured benefit number exists yet. The current claim is correctness and reversibility, not ranking lift.
