# Review Resource Map

## Scope

Lineage-local map emitted from review evidence for `codex-3`.

## Evidence Surfaces

| Surface | Files Reviewed | Findings |
|---------|----------------|----------|
| Program control docs | `spec.md`, `graph-metadata.json`, `context-index.md`, `timeline.md`, `resource-map.md` | F001, F003, F004 |
| Changelog rollups | `changelog/README.md`, sampled top rollups for 000, 003, 006, 007 | F002, F004, F005 |
| Security sample | changelog README, analytics remediation entry, resource map | none |

## Resource Map Coverage Gate

The target root `resource-map.md` existed at init, so coverage was required. The audit found that the map is explicitly stale and still carries `OK` status rows for pre-reorg paths. This is tracked as F003.

## Generated Findings

| Finding | Evidence Path |
|---------|---------------|
| F001 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/graph-metadata.json:50` |
| F002 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md:21` |
| F003 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62` |
| F004 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:14` |
| F005 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:44` |
