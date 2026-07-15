---
title: "Phase 001: Reverse Parent Research/Review Folder Placement"
description: "Rolled back the parent-root deep-loop placement policy so child phases and sub-phases keep their own local research/ and review/ folders again. 135 misplaced child packets were migrated repo-wide across two passes using a heuristic script and a manual owner-map script."
trigger_phrases:
  - "reverse parent research review folders"
  - "local owner artifact rollback"
  - "deep loop folder placement rollback"
  - "migrate misplaced child packets"
  - "review-research-paths rollback"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix`

### Summary

The deep-loop artifact placement policy introduced during `007-deep-review-remediation/006-integrity-parity-closure` had routed child-phase research and review packets under ancestor root folders, breaking local ownership and scattering child history away from the owning phase. Reducers, prompts, docs plus tests were forced to coordinate through a parent root instead of the actual target spec.

The shared resolver `review-research-paths.cjs` was rolled back to the local-owner contract: root specs resolve directly to their own `research/` or `review/` folders, while child and sub-phase specs resolve packets inside their own local `research/{packet}/` or `review/{packet}/` folders with reuse of an existing packet on rerun. Both deep-loop reducers were updated to write only to the resolver-provided `artifactDir`. Command YAMLs, docs, references, dashboards plus parity tests were rebased onto the restored contract.

A heuristic migration script discovered and moved 86 misplaced child-owned packets, rewrote 131 live canonical references with 0 conflicts. A follow-up manual owner-map pass moved 49 additional residual root packets, rewrote 24 more references with 0 conflicts, then cleared the remaining root `research/` or `review/` packet directories under `002-graph-and-context-optimization`. Across both passes, 135 child-owned packets were restored to owner-local folders with 155 live canonical references rewritten.

### Added

- `migrate-deep-loop-local-owner.cjs` heuristic migration script for repo-wide child packet discovery plus move plus live-reference rewrite (NEW)
- `migrate-deep-loop-legacy-owner-map.cjs` explicit owner-map migration script for residual root packets that the heuristic pass did not classify (NEW)
- Rerun packet reuse logic in the resolver so an existing packet for the same target spec is reused instead of allocating a sibling directory

### Changed

- `review-research-paths.cjs` resolver: child and sub-phase specs now resolve to their own local `research/{packet}/` or `review/{packet}/` folders instead of an ancestor root
- `deep-research/scripts/reduce-state.cjs`: writes only to the resolver-provided `artifactDir` instead of deriving a path from a coordination root
- `deep-review/scripts/reduce-state.cjs`: writes only to the resolver-provided `artifactDir` instead of deriving a path from a coordination root
- `deep_start-research-loop_auto.yaml` and `deep_start-review-loop_auto.yaml`: prompts and packet artifacts kept inside the resolved local-owner packet root
- Deep-research and deep-review READMEs, SKILL docs, references, dashboards plus parity tests updated to describe local-owner packet placement for child runs

### Fixed

- Child-phase deep-loop artifacts were landing under ancestor root `research/` or `review/` folders instead of the owning phase's own local folder. The resolver rollback fixed this at the source.
- 135 already-misplaced child packets were left under ancestor roots by prior runs. Both migration passes moved them to their owner-local folders without renaming packet directories.
- Phase `003-resource-map-deep-loop-integration` was depending on the old parent-root assumption. It was rebased to emit `resource-map.md` beside the resolved local-owner packet artifacts.

### Verification

| Check | Result |
|-------|--------|
| `node migrate-deep-loop-local-owner.cjs --json` | PASS: discovered 86 misplaced child packets, moved 86, conflicts 0, rewritten live files 131, remaining misplaced packets 0 |
| `node migrate-deep-loop-local-owner.cjs --dry-run --json` | PASS: post-migration scan found 0 misplaced child packets and 0 additional rewrites |
| `node migrate-deep-loop-legacy-owner-map.cjs` | PASS: moved 49 residual root packets, conflicts 0, rewritten live files 24, remaining root research 0, remaining root review 0 |
| Direct Node assertions against resolver, migration reports, reducers, YAMLs, docs plus phase 002 packet | PASS: verified root, child, nested plus rerun reuse cases with owner-local contract surfaces |
| `bash validate.sh [packet] --strict` | PASS: Errors 0, Warnings 0 after metadata refresh and packet-shape fixes |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Modified | Restores the root-local vs owner-local resolver contract and rerun packet reuse. |
| `.opencode/skills/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs` | Created (NEW) | Migrates misplaced child packets repo-wide and rewrites live canonical references. |
| `.opencode/skills/system-spec-kit/scripts/migrate-deep-loop-legacy-owner-map.cjs` | Created (NEW) | Manually maps residual root packet directories to their correct owning phases when legacy metadata shapes defeat heuristic discovery. |
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Modified | Binds deep-research writes to the resolver-provided `artifactDir`. |
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Modified | Binds deep-review writes to the resolver-provided `artifactDir`. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | Keeps prompts and packet artifacts inside the resolved research packet root. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Keeps prompts and packet artifacts inside the resolved review packet root. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/**` | Modified/Moved | Relocated 135 child-owned packets back to their owner-local folders across a heuristic pass and a manual owner-map cleanup, then rebased phase 002 docs. |

### Follow-Ups

- Direct Node assertions replaced vitest for this packet. The workspace could not load `vitest/config` from the system-spec-kit config path, so executable verification used inline Node assertions instead of the committed `*.vitest.ts` files. A follow-up should wire the resolver tests into the standard vitest suite once the config path is resolved.
- Migration reporting lives outside the repo. The applied and post-scan JSON reports were captured in `/tmp/` paths for verification but were not committed as packet artifacts. Consider committing the final migration summary as a packet artifact for audit permanence.
