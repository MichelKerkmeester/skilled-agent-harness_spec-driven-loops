---
title: "Resource Map Deep Loop Integration: Convergence-Time Emission for deep-review and deep-research"
description: "Shared extractor and workflow wiring that auto-emit a filled resource-map.md at convergence for every deep-review and deep-research run. Review maps carry per-file findings counts. Research maps carry per-file citation counts. Zero extra scan cost. Clean opt-out path via config flag."
trigger_phrases:
  - "resource map deep loop integration"
  - "convergence-time resource map emission"
  - "deep-review resource map"
  - "deep-research resource map"
  - "extract-from-evidence cjs"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix`

### Summary

Autonomous deep-loop runs produced rich per-iteration evidence but offered no flat, scannable view of what the loop actually touched. Reviewers had to replay iteration markdown files or the narrative synthesis to assess blast radius and coverage. The phase-002 resource-map template was available but unfilled.

A shared extractor (`extract-from-evidence.cjs`) was created under `.opencode/skills/system-spec-kit/scripts/resource-map/`. It ingests per-iteration delta JSON for either evidence shape, classifies paths into the ten-category skeleton from phase-002 then renders a ready-to-write `resource-map.md`. Review maps carry `Findings (P0/P1/P2)` counts per file. Research maps carry `Citations` counts per file. Both shapes share the same four-column template contract.

The reducers for both deep-loop skills gained an explicit `--emit-resource-map` path so convergence-time synthesis owns the final write without touching per-iteration reducer refreshes. All four YAML workflows (auto plus confirm variants for both loops) were updated to call that path during synthesis, guarded by a `config.resource_map.emit` flag that defaults to true. A clean opt-out is available via `--no-resource-map`. Skill docs, command entrypoints, convergence references, feature-catalog entries plus manual-testing playbooks all describe the new output surface.

### Added

- Shared extractor `extract-from-evidence.cjs` under `.opencode/skills/system-spec-kit/scripts/resource-map/` handling both review and research evidence shapes
- Extractor README documenting the input/output contract and fallback behavior
- Focused Vitest coverage in `mcp_server/scripts/tests/resource-map-extractor.vitest.ts` for both evidence shapes with snapshot assertions
- Feature catalog entries in `deep-review/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md` and `deep-research/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md` (NEW)
- Manual testing playbook scenarios in `deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md` and `deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/035-resource-map-emission.md` (NEW)

### Changed

- `deep-review/scripts/reduce-state.cjs` now supports `--emit-resource-map` and `config.resource_map.emit === false` opt-out
- `deep-research/scripts/reduce-state.cjs` now supports `--emit-resource-map` and `config.resource_map.emit === false` opt-out
- All four deep-loop YAML workflows gained a post-convergence emission step with `resource_map.emit` config guard
- `deep-review/SKILL.md` and `deep-research/SKILL.md` document the new output surface and opt-out flag
- `commands/deep/start-review-loop.md` and `commands/deep/start-research-loop.md` mention the convergence-time artifact and `--no-resource-map`
- Convergence reference docs in both skills note the new emission step in the convergence sequence

### Fixed

- Deep-loop runs produced no flat coverage artifact at convergence. Reviewers now get a filled `resource-map.md` beside the narrative output with zero additional scan cost.
- Malformed or missing delta files are handled defensively with per-delta try/catch. Bad deltas are skipped and a `degraded: true` marker is added to the emitted map rather than failing convergence.

### Verification

| Check | Result |
|-------|--------|
| `T030: npx vitest run scripts/tests/resource-map-extractor.vitest.ts` (from `mcp_server/`) | FAIL (exit 1). `No test files found` because `vitest.config.ts` roots `scripts/tests/**` at the skill root, not `mcp_server/scripts/tests/**`. Config mismatch is pre-existing. |
| `T030 follow-up: npx vitest run --config vitest.config.ts --root . scripts/tests/resource-map-extractor.vitest.ts` | PASS (exit 0). All assertions pass when Vitest is rooted inside `mcp_server/`. |
| `T031: npm run typecheck` (from `mcp_server/`) | PASS (exit 0). No stderr. |
| `T032: review-shape dry run` | PASS (exit 0). Output contained `## 1. READMEs`, `## 5. Skills`, review note `Findings P0=0 P1=1 P2=0`. |
| `T033: research-shape dry run` | PASS (exit 0). Output contained `## 3. Commands`, `## 5. Skills`, citation note `Citations=3, Iterations=3`. |
| `T034: opt-out path` | PASS (exit 0). Reducer returned `resourceMapSkipped: true` and no file was written. |
| `T035: validate.sh --strict on packet` | FAIL (exit 2). Pre-existing packet-doc integrity drift in `spec.md` and `plan.md`, plus an uncited line in `research/research.md`. Unrelated to this packet's implementation scope. |
| `T036: grep -rn "resource-map" across ten required surfaces` | PASS (exit 0). All ten surfaces confirmed present. |
| Zero/max edge cases dry run | PASS (exit 0). `zeroTotal=0`, `zeroHasCategoryHeadings=false`, `maxCitationNote=true`. |
| Malformed-row degradation dry run | PASS (exit 0). `degraded=true`, `degradedRows=true`. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` (NEW) | Shared extractor and renderer for both review and research resource maps. |
| `.opencode/skills/system-spec-kit/scripts/resource-map/README.md` (NEW) | Input/output contract and fallback behavior documentation. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` (NEW) | Vitest coverage for both evidence shapes with snapshot assertions. |
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Added `--emit-resource-map` flag handling and opt-out path. |
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Added `--emit-resource-map` flag handling and opt-out path. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Added resource-map config/output state and synthesis emission step. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Added resource-map config/output state and synthesis emission step. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Added resource-map config/output state and synthesis emission step. |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Added resource-map config/output state and synthesis emission step. |
| `.opencode/skills/deep-review/SKILL.md` | Documents review-side emitted output and opt-out flag. |
| `.opencode/skills/deep-research/SKILL.md` | Documents research-side emitted output and opt-out flag. |
| `.opencode/commands/deep/start-review-loop.md` | Mentions emitted artifact and `--no-resource-map`. |
| `.opencode/commands/deep/start-research-loop.md` | Mentions emitted artifact and `--no-resource-map`. |
| `.opencode/skills/deep-review/references/convergence/convergence.md` | Notes synthesis-time emission in the convergence sequence. |
| `.opencode/skills/deep-research/references/convergence/convergence.md` | Notes synthesis-time emission in the convergence sequence. |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md` (NEW) | Review-side feature catalog entry for resource-map emission. |
| `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md` (NEW) | Research-side feature catalog entry for resource-map emission. |
| `.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md` (NEW) | Review-side manual validation scenario. |
| `.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/035-resource-map-emission.md` (NEW) | Research-side manual validation scenario. |

### Follow-Ups

- Run `validate.sh --strict` clean pass on this packet after fixing pre-existing packet-doc integrity drift in `spec.md` plus `plan.md` plus the uncited line in `research/research.md`.
- Investigate aligning `mcp_server/vitest.config.ts` to discover `mcp_server/scripts/tests/**` directly so the T030 command works without an explicit `--root .` override.
- Consider adding interim per-iteration emission behind an `emit_interim: true` flag (P2 defer from spec REQ-011).
