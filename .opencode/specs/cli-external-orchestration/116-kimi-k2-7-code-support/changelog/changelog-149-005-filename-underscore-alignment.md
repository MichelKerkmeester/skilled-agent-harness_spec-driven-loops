---
title: "Changelog: Phase 5: filename-underscore-alignment [149-kimi-k2-7-code-support/005-filename-underscore-alignment]"
description: "Chronological changelog for aligning sk-prompt-models filenames to the underscore convention."
trigger_phrases:
  - "phase changelog"
  - "filename alignment"
  - "underscore filenames"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/005-filename-underscore-alignment` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support`

### Summary

The Kimi support work exposed a naming drift in `sk-prompt-models`: house files used dash names while the house convention preferred underscores. This phase renamed the seven documentation and asset targets, repaired every live inbound reference and left the four model-profile files dashed on purpose. Those model files mirror external model ids, and the pre-commit drift guard derives their paths from the dashed ids.

### Added

- None.

### Changed

- Mapped the seven rename targets and every live inbound reference.
- Confirmed `check-prompt-quality-card-sync.sh` couples model-profile filenames to the dashed model id.
- Renamed the five markdown files from dash to underscore under `sk-prompt-models` assets and references.
- Renamed the two JSON assets to `model_profiles.json` and `per_model_budgets.json`.
- Replaced the six unique filenames across the live file list with extension-anchored matches.
- Used a path-qualified replace for `sk-prompt-models/references/context-budget.md`.
- Made two targeted same-skill link edits in `SKILL.md` and `pattern_index.md`.
- Left `cli-opencode`'s own `context-budget.md` file dashed.
- Updated the functional drift-guard `json.load` path to `model_profiles.json` in `check-prompt-quality-card-sync.sh`.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Rename coverage | PASS: all seven targets renamed and history preserved, with `git status --short` showing `R` or `RM` for all seven. |
| Drift guard | PASS: `check-prompt-quality-card-sync.sh .` returned `GUARD PASS`, exit 0, and loaded the renamed registry while resolving all four model profiles. |
| Stale live references | PASS: live-wiring grep returned 0 hits for the six unique old dash names. |
| Intentional dash keep | PASS: remaining dashed `context-budget.md` references were four references, all pointing at `cli-opencode`'s own file. |
| JSON parse and profile refs | PASS: `python3 json.load` validated both renamed JSON files, and four `profile_ref` lines stayed unchanged. |
| Dashed model profiles | PASS: four model profile files plus `_index.md` remained present under `references/models/`. |
| Strict validation | PASS: `validate.sh <this phase> --strict` exited 0. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `sk-prompt-models/assets/ + references/ (7 targets)` | Renamed | Dash to underscore through `git mv`. |
| `sk-prompt-models/{SKILL.md,README.md,description.json,graph-metadata.json}` | Updated | Inbound references repointed. |
| `sk-prompt-models/references/** (renamed + _index.md + 4 model profiles)` | Updated | Cross-links repointed to new names. |
| `cli-opencode/** (SKILL.md, references, assets, playbooks)` | Updated | Cross-skill references repointed, with path-qualified handling for the `context-budget` collision. |
| `cli-claude-code/SKILL.md, cli-codex/SKILL.md` | Updated | `model_profiles.json` references. |
| `.opencode/scripts/git-hooks/pre-commit` | Updated | `pattern_index.md` hint string. |
| `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Updated | Functional `json.load` path changed to `model_profiles.json`. |
| `README.md (root)` | Updated | `pattern_index.md` reference. |
| `154/spec.md, 154/graph-metadata.json` | Updated | Phase-5 map row and `children_ids`. |

### Follow-Ups

- Historical and archived references were intentionally not updated. About 293 spec-doc references across `z_archive`, `026`, `027`, `152` and `154` still name the old dash filenames.
- The historical references were the user's chosen scope as point-in-time records, not an oversight.
- `cli-opencode`'s own `context-budget.md` keeps its dash. This phase was scoped to `sk-prompt-models` filenames, and aligning `cli-opencode` filenames would be separate work.
- References from `cli-opencode` to the `sk-prompt-models` canonical files were repointed correctly.
- The four model-profile filenames remain dashed by contract. They mirror external model ids enforced by the drift guard.
- A future change that renames model-profile files would also need to teach the guard a dash and underscore translation.
