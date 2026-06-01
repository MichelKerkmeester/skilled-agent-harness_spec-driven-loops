---
title: "Track 002 Phase 003: Resource map deep-loop integration"
description: "Taught sk-deep-review and sk-deep-research to emit a filled resource-map.md at convergence from evidence they already capture. Review maps carry P0/P1/P2 findings counts. Research maps carry per-iteration citation counts. Zero new scan cost."
trigger_phrases:
  - "track 002 phase 003 changelog"
  - "resource map deep loop integration"
  - "convergence time resource map emission"
  - "extract-from-evidence extractor"
  - "deep loop resource map autorelease"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-26

> Spec folder: `system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration` (Level 2)
> Parent packet: `system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix`

### Summary

Before this phase, autonomous deep-loop runs produced rich evidence across 5 to 15 iterations, but the output surface was split between iteration markdown files and narrative synthesis docs. Reviewers still had no flat, scannable view of "what did this loop actually touch." Running the path audit manually after every loop was repetitive.

This phase built a shared evidence extractor under `scripts/resource-map/extract-from-evidence.cjs` that ingests per-iteration delta arrays and emits a filled `resource-map.md` string. The review shape includes per-file findings counts (P0/P1/P2). The research shape includes deduplicated per-iteration citation counts. Both shapes share the same ten-category skeleton. The extractor was wired into both `reduce-state.cjs` scripts at convergence and into all four YAML workflow assets with an opt-out flag (`--no-resource-map` / `emit: false`).

### Added

- Shared evidence extractor `scripts/resource-map/extract-from-evidence.cjs` that handles both review and research delta shapes. Pure string/JSON. No network, no shell-outs, no file-system scans outside the packet's own deltas directory.
- `scripts/resource-map/README.md` documenting the input/output contract and fallback behavior.
- Vitest snapshot coverage `scripts/tests/resource-map-extractor.vitest.ts` for both evidence shapes.
- Feature catalog entries for both sk-deep-review and sk-deep-research under their respective `feature_catalog/` trees.
- Manual testing playbook entries for both skills under their respective `manual_testing_playbook/` trees.

### Changed

- `sk-deep-review/scripts/reduce-state.cjs`: convergence branch calls the extractor and writes to `{artifact_dir}/resource-map.md` when `--emit-resource-map` is passed.
- `sk-deep-research/scripts/reduce-state.cjs`: same convergence-time hook.
- All four YAML workflow assets (deep-research auto/confirm, deep-review auto/confirm): `resource_map.emit` config flag (default true) plus post-convergence emission step.
- `sk-deep-review/SKILL.md`: documents the new output surface and `--no-resource-map` opt-out.
- `sk-deep-research/SKILL.md`: same documentation.
- `command/spec_kit/deep-review.md` and `deep-research.md`: brief mention of the convergence-time artifact.
- `sk-deep-review/references/convergence.md` and `sk-deep-research/references/convergence.md`: note the new emission step.

### Fixed

- No bugs fixed. This was an additive feature built on the phase 001 local-owner contract and phase 002 template shape.

### Verification

- Typecheck (`npm run typecheck` inside mcp_server/): exit 0.
- Review-shape extractor dry run: output contained READMEs, Skills categories plus findings notes (P0=0 P1=1 P2=0).
- Research-shape extractor dry run: output contained Commands, Skills categories plus citation notes (Citations=3; Iterations=3).
- Opt-out path: reducer returned `resourceMapSkipped: true` and wrote no file.
- Zero/max iteration edge cases: dry run returned correct zero-state and max-citation markers.
- Malformed-row degradation: dry run returned `degraded: true` without crashing.
- Grep coverage across all ten required surfaces: all confirmed.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` (NEW) | Shared extractor and renderer for review and research maps. |
| `.opencode/skills/system-spec-kit/scripts/resource-map/README.md` (NEW) | Extractor input/output contract. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` (NEW) | Vitest snapshot coverage for both evidence shapes. |
| `.opencode/skills/sk-deep-review/scripts/reduce-state.cjs` | Modified: `--emit-resource-map` + opt-out. |
| `.opencode/skills/sk-deep-research/scripts/reduce-state.cjs` | Modified: `--emit-resource-map` + opt-out. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified: resource_map config + emission step. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified: same pattern. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified: resource_map config + emission step. |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modified: same pattern. |
| `.opencode/skills/sk-deep-review/SKILL.md` | Modified: emitted output and opt-out documentation. |
| `.opencode/skills/sk-deep-research/SKILL.md` | Modified: emitted output and opt-out documentation. |
| `.opencode/commands/deep/start-review-loop.md` | Modified: brief mention of resource-map artifact. |
| `.opencode/commands/deep/start-research-loop.md` | Modified: brief mention of resource-map artifact. |
| `.opencode/skills/sk-deep-review/references/convergence.md` | Modified: notes synthesis-time emission step. |
| `.opencode/skills/sk-deep-research/references/convergence.md` | Modified: notes synthesis-time emission step. |
| `.opencode/skills/sk-deep-review/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` (NEW) | Review-side catalog entry. |
| `.opencode/skills/sk-deep-research/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` (NEW) | Research-side catalog entry. |
| `.opencode/skills/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md` (NEW) | Review-side playbook scenario. |
| `.opencode/skills/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/027-resource-map-emission.md` (NEW) | Research-side playbook scenario. |

Commits: `083f74c814` (test playbooks), `79ea13374c` (bulk WIP commit).

### Follow-Ups

- T035 strict validator was deferred due to pre-existing packet-doc integrity drift in spec.md/plan.md plus an uncited line in research/research.md. These issues are outside the packet's implementation scope and do not block the feature.
