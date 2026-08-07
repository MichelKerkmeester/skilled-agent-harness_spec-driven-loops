# Review Resource Map - gpt-1

## Summary

- Artifact root: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/lineages/gpt-1`.
- Source resource map present at init: yes.
- Resource-map coverage verdict: FAIL.
- Entries touched: parent `spec.md`, `description.json`, `graph-metadata.json`, `resource-map.md`, `context-index.md`, child 011 spec, child 010 implementation summary, child 002 implementation summary, child 001 peck spec.

## Entries Touched

| Path | Iterations | Coverage Result |
|------|------------|-----------------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md` | 001,003,004,005 | Reviewed; active P1 metadata/continuity drift. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json` | 001,005 | Reviewed; active P1 child-list drift. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json` | 001,003,005 | Reviewed; evidence for 011 mismatch. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md` | 003,005 | Reviewed; active P1 coverage drift. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md` | 003,004,005 | Reviewed; P2 stale migration notes. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md` | 001,003 | Reviewed; evidence for omitted live child. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/004-release-and-program-cleanup/implementation-summary.md` | 001,004 | Reviewed; P2 stale 028 metadata. |

## Entries Not Touched

| Path Group | Classification | Reason |
|------------|----------------|--------|
| Full nested child implementation corpus | expected-by-scope | Fanout lineage focused on parent-level registry and traceability consistency, not exhaustive code audit of every child. |
| `.opencode/skills/system-spec-kit/**` beyond sampled 009 implementation files | expected-by-scope | Security pass sampled relevant sensitive surfaces only. |

## Implementation Paths Absent From Source Map

| Path | Gap |
|------|-----|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/` | Current parent child not represented in source `resource-map.md`. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/` | Current parent child not represented in source `resource-map.md` except historical context. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/` | Present in graph metadata and on disk, absent from parent `spec.md`, `description.json`, and source `resource-map.md`. |

## Phase-5 Augmentation

Novel logic gaps found by this lineage:

- Parent child membership has no single current source of truth.
- Parent resource map is present but stale enough to fail as a coverage gate input.
- Continuity and migration bridge prose lag current child completion/adoption state.
