---
title: "Changelog: Deep-Review/Research Skill Contract Fixes"
description: "Two skill-contract bugs fixed: resolveArtifactRoot now places first-run child-phase artifacts flat instead of always wrapping them in a pt-NN subfolder. Synthesis runs auto-stage the full artifact directory so the iteration audit trail is not silently dropped from commits."
trigger_phrases:
  - "deep-review research skill contract fixes"
  - "resolveArtifactRoot flat-first"
  - "synthesis artifact staging"
  - "pt-NN wrapper child phase"
  - "iteration audit trail staging"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/028-deep-review-research-skill-contract-fixes` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

Two contract violations in the deep-review and deep-research skill output were identified and fixed. First, `resolveArtifactRoot` always placed child-phase artifacts under a `{phaseSlug}-pt-01/` wrapper even on first run, producing unnecessary nesting when the parent `review/` or `research/` directory was empty. Second, the synthesis step in all four deep-loop YAML files never staged the iteration audit trail (state.jsonl, strategy file, findings-registry, deltas/, iterations/), so operators who committed only the synthesis report would silently drop the rest. Both bugs were fixed by updating the resolver to return flat on first run and adding a `step_stage_artifact_dir` step to all four YAML files.

### Added

- `step_stage_artifact_dir` step in the synthesis phase of all four deep-loop YAML command files, running `git add {state_paths.artifact_dir}` after synthesis output is written
- Three new vitest cases for flat-first resolver scenarios: first run with empty rootDir. continuation reusing an existing flat artifact. allocation of pt-NN when prior flat content exists for a different target

### Changed

- `resolveArtifactRoot` in `review-research-paths.cjs` rewritten so child phases with an empty `{mode}/` directory return flat (`subfolder: null`, `artifactDir === rootDir`) instead of always allocating a pt-NN packet
- Two existing resolver tests updated to match the new flat-first behavior
- Flat-first convention documented in `deep-review/SKILL.md`, `deep-research/SKILL.md`, `deep-review/references/state/state_format.md`, `deep-research/references/state/state_format.md`. Also updated in `folder_structure.md`.

### Fixed

- Child-phase first-run reviews created unnecessary `pt-01/` nesting even when the parent review directory was empty. Resolver now returns flat for empty rootDir.
- Synthesis completion dropped the full iteration audit trail from git because the YAML files staged only the synthesis report. All four YAML files now run `git add {artifact_dir}` at synthesis end.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run scripts/tests/review-research-paths.vitest.ts` | PASS, 7/7 (root flat, child flat, nested flat, reuse flat, reuse pt-NN, branch on prior pt-NN, branch on flat-different-target) |
| Resolver behavior on first run with empty rootDir | flat, verified by test |
| Resolver behavior on continuation with matching target | reuse flat, verified by test |
| Resolver behavior on conflict with prior different-target content | pt-NN allocated, verified by test |
| `grep step_stage_artifact_dir` across the four YAML files | 4 of 4 files contain the step |
| Doc grep for flat-first prose | 5 of 5 doc files updated |
| `validate.sh --strict` on this packet | PASS, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Modified | `resolveArtifactRoot` rewritten for flat-first on empty rootDir |
| `.opencode/skills/system-spec-kit/scripts/tests/review-research-paths.vitest.ts` | Modified | Updated 2 existing cases, added 3 flat-first scenario cases |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Added `step_stage_artifact_dir` at synthesis end |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Added `step_stage_artifact_dir` at synthesis end |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | Added `step_stage_artifact_dir` at synthesis end |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modified | Added `step_stage_artifact_dir` at synthesis end |
| `.opencode/skills/deep-review/SKILL.md` | Modified | Flat-first convention prose update |
| `.opencode/skills/deep-research/SKILL.md` | Modified | Flat-first convention prose update |
| `.opencode/skills/deep-review/references/state/state_format.md` | Modified | Flat-first convention prose update |
| `.opencode/skills/deep-research/references/state/state_format.md` | Modified | Flat-first convention prose update |
| `.opencode/skills/system-spec-kit/references/structure/folder_structure.md` | Modified | Flat-first convention prose update |

### Follow-Ups

- Existing `pt-01` folders created by previous reviews remain in place. The flat-first convention applies only to new runs. Both shapes are valid at lookup time.
- The `git add {artifact_dir}` step runs unconditionally. Operators can run `git restore --staged {path}` to unstage any files they do not want in the commit.
- Historical missing-iteration folders (for example `001-post-program-doc-and-state-cleanup-pt-01/` from commit `6a8095907`) are not migrated. New runs benefit from the fix.
