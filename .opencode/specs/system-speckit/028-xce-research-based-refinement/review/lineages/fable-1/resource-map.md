# Resource Map — fable-1 lineage emission

> Emitted at synthesis from review delta evidence (deep-review convergence contract). This is the reviewed-surface inventory for lineage `fanout-fable-1-1781112180955-4japyt`; it also seeds the per-track skeleton missing from the packet-root `resource-map.md` (finding F005).

## Summary

- **Scope**: parent-level audit of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/`
- **Surfaces reviewed**: 24 files read/scanned across 5 iterations + packet-wide pattern scans
- **Status vocabulary**: `OK` (exists, read) · `STALE` (exists, contradicted content) · `GAP` (expected, absent)

## Parent Control Surfaces

| Path | Reviewed In | Status | Note |
|------|-------------|--------|------|
| `spec.md` | iter 1, 4, 5 | STALE | F001 (011 missing), F002 (status cells + :141 note), F007 (continuity) |
| `description.json` | iter 1 | STALE | F001 (children stop at 010) |
| `graph-metadata.json` | iter 1, 3 | OK | children_ids correct (incl. 011); `derived.*` freshness lags but is non-authoritative |
| `resource-map.md` | iter 3 | STALE | F005 (scope-frozen 2026-06-04; omits 002–011) |
| `context-index.md` | iter 3 | STALE | F006 (current-folder column outdated for 003-lifecycle fold) |
| `timeline.md` | iter 5 | OK | `impl` tags are contextType markers (candidate finding refuted); header range prose cosmetic |
| `before-vs-after.md` | iter 5 | OK | Sampled claims match shipped 002 behavior |
| `changelog/README.md` | iter 4, 5 | STALE | F008 (001 and 000 rows vs child statuses) |

## Child Phase Tracks (status verification surfaces)

| Track | Surface read | Disk status evidence | Parent-map claim | Coherent? |
|-------|-------------|----------------------|------------------|-----------|
| 000-release-cleanup | spec.md, description.json, 001 child spec | 8 sub-phases; 001 child `Completed` + impl-summary | "Placeholder" | NO (F002) |
| 001-peck-teachings-adoption | spec.md | `In Progress` | "Phase-parent" | Changelog says shipped (F008) |
| 002-memory-write-safety | spec.md, impl-summary, checklist, tasks, description.json | `Complete (2026-06-10)`, 60 tests | "Spec-scaffolded" | NO (F002, F003) |
| 003-memory-index-causal-lifecycle | spec.md | `phase-parent` (4 children) | "Phase-parent" | yes |
| 004-semantic-trigger-fallback | spec.md | `phase-parent` | "Phase-parent" | yes |
| 005-learning-feedback-reducers | spec.md | `phase-parent` | "Phase-parent" | yes |
| 006-gem-team-adoption | 001 leaf spec | leaf `Implemented` + impl-summary | ":141 note says not implemented" | NO (F002) |
| 007-memclaw-derived-memory-hardening | 001 leaf spec | leaf `Implemented` | ":141 note says not implemented" | NO (F002) |
| 008-openltm-retrieval-observability | spec.md | `Complete` + impl-summary | "Spec-scaffolded" | NO (F002) |
| 009-openltm-continuity-resilience | spec.md | `Complete` + impl-summary | "Spec-scaffolded" | NO (F002) |
| 010-mcp-to-cli-tool-transition | folder listing | 4 lanes + context-index | "Complete" | yes |
| 011-command-presentation-workflow-separation | spec.md, folder listing | `planned`, 4 family children scaffolded | ABSENT from map | NO (F001) |

## Packet-Wide Scans

| Scan | Surfaces | Result |
|------|----------|--------|
| Secret shapes (AWS/GH/Anthropic/Slack keys, JWT, private-key blocks) | all docs (excl. review/) | Clean — only canonical AWS doc example in checklist evidence |
| Credential assignments + emails | all docs (excl. review/) | Clean |
| Home-path disclosure | research logs | F004 (P2, local-only; packet git-untracked) |
| Phase-parent forbidden content | parent spec.md | Clean (discipline comment only) |

## Phase-5 Augmentation

Novel gaps surfaced by review (not represented in the packet-root resource map):

- Phases 002–011 have no resource-map representation at packet root, including shipped implementation surfaces such as `mcp_server/lib/parsing/secret-scrubber.ts` (002) — iteration-003.
- Packet-root map's "last active child" claim contradicts `graph-metadata.json:236` (`last_active_child_id: null`) — iteration-003.
- Shipped 000 children lack the changelogs the index convention promises — iteration-005.
