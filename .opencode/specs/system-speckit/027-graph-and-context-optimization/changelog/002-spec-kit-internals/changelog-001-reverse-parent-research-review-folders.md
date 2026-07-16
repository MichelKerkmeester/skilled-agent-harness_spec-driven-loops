---
title: "Track 002 Phase 001: Reverse parent research/review folder placement"
description: "Rolled back the centralized parent-root deep-loop placement policy so child phases keep their own local research/ and review/ folders. Repo-wide migration moved 135 misplaced child packets and rewrote 155 live canonical references."
trigger_phrases:
  - "track 002 phase 001 changelog"
  - "reverse parent research review folders"
  - "local owner artifact rollback"
  - "deep loop packet migration"
  - "review-research-paths rollback"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders` (Level 2)
> Parent packet: `system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix`

### Summary

Before this phase, child-phase deep-research and deep-review artifacts landed under ancestor root folders. That scattered packet history away from the owning phase and forced downstream consumers to reason through a parent coordination root. Root specs were fine. Everything else was misplaced.

This phase restored the local-owner contract in three passes. The shared resolver `review-research-paths.cjs` was rolled back so child specs resolve packet directories inside their own `research/` or `review/` folder. Both deep-loop reducers and all four YAML workflow assets were updated to write only to the resolved `{artifact_dir}`. A heuristic migration pass discovered and moved 86 misplaced child packets. A second explicit owner-map pass moved 49 more legacy-shaped packets. Across both passes, 135 child-owned packets were restored to owner-local folders and 155 live canonical references were rewritten. Zero conflicts were hit. Root-owned packets stayed in place.

### Added

- New migration utility `migrate-deep-loop-local-owner.cjs` that discovers misplaced child packets, derives ownership from stored `specFolder` metadata, and moves them to the owning phase folder.
- New migration utility `migrate-deep-loop-legacy-owner-map.cjs` that handles residual root-packet directories whose metadata shapes defeat heuristic discovery.
- New `resource-map.md` rollback ledger for this packet documenting the historical origin and all surfaces touched.
- Focused path-resolution and contract-parity verification coverage under `scripts/tests/`.

### Changed

- `review-research-paths.cjs` now resolves child specs to `{spec_folder}/{mode}/{packet}` instead of deriving paths from an ancestor root.
- Both `reduce-state.cjs` scripts (deep-review, deep-research) write only to the resolver-provided `artifactDir`.
- All four YAML workflow assets (auto + confirm for each skill) carry the resolved packet path through prompts, state, deltas, and synthesis.
- Deep-research and deep-review SKILL.md docs, references, dashboards, and folder-structure docs describe the restored local-owner contract.
- Phase 003 packet docs now depend on this phase and emit beside resolved local-owner paths.
- 135 child-owned packets relocated repo-wide under `.opencode/specs/**/research/` and `review/`.

### Fixed

- Child-phase deep-loop artifacts no longer scatter under ancestor root folders.
- Rerun resolution no longer creates sibling packet directories. Existing packets for the same target spec are reused.
- Root-owned packets are never moved during migration.

### Verification

- Heuristic migration pass: discovered 86 misplaced child packets, moved 86, conflicts 0, rewritten references 131.
- Post-migration scan: 0 remaining misplaced child packets, 0 additional rewrites.
- Legacy owner-map pass: moved 49 residual root packets, conflicts 0, rewritten references 24, remaining root research 0, remaining root review 0.
- Direct Node assertion pass against resolver, reducers, YAMLs, docs, and phase 003 packet: all cases passed (root, child, nested, rerun reuse, owner-local contract surfaces).
- Strict packet validation: exit 0, errors 0, warnings 0.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Modified: local-owner resolution + rerun packet reuse. |
| `.opencode/skills/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs` (NEW) | Heuristic packet discovery and migration utility. |
| `.opencode/skills/system-spec-kit/scripts/migrate-deep-loop-legacy-owner-map.cjs` (NEW) | Explicit owner-map migration for legacy metadata shapes. |
| `.opencode/skills/sk-deep-research/scripts/reduce-state.cjs` | Modified: uses resolver-provided `artifactDir` only. |
| `.opencode/skills/sk-deep-review/scripts/reduce-state.cjs` | Modified: uses resolver-provided `artifactDir` only. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified: resolved packet path in prompts and state. |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modified: same pattern. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified: resolved packet path in prompts and state. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified: same pattern. |
| `.opencode/skills/sk-deep-research/**` | Modified: docs, references, dashboards rebased to local-owner contract. |
| `.opencode/skills/sk-deep-review/**` | Modified: docs, references, dashboards, review contract assets rebased. |
| `.opencode/skills/system-spec-kit/scripts/tests/*.vitest.ts` | Modified/created: resolver coverage + contract parity. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/**` | Moved/modified: 135 child packets relocated, 155 references rewritten, phase 003 rebased. |

Commits: `79e97aec92` (scaffold sweep), `30024e3bed` (fleet marker + validation), `083f74c814` (test playbooks), `79ea13374c` (bulk WIP commit).

### Follow-Ups

- None. The rollback contract, migration, and rebase are complete.
