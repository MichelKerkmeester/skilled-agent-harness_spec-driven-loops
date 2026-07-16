---
title: "Changelog: Phase 11: command-surface-normalization [032-goal-opencode-plugin/011-command-surface-normalization]"
description: "Chronological changelog for normalizing the twice-renamed /goal command filename and its referencing surfaces."
trigger_phrases:
  - "phase changelog"
  - "goal command rename"
  - "command surface normalization"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`
> Commits: `303902e631` fix(mk-goal): normalize command filename + close 2 config-contract gaps; `f510f8e96f` fix(mk-goal): close 2 config-contract gaps + fix command doc/metadata; `8405ba4f57` fix(032-goal-opencode-plugin): amend command name to goal_opencode.md

### Summary

The `/goal` command file had been renamed twice in two days with no doc sweep either time. This phase picked one final name, backed by deep-research's confirmed no-built-in-collision finding, closed nine stale referencing surfaces in one pass, fixed two smaller config-contract gaps, then was amended same-day when the operator overrode the chosen filename in favor of the one a concurrent session had independently converged on.

### Added

- `mutation=created|refreshed|replaced` field on `/goal set` output, reporting whether the set call created, refreshed, or replaced the active goal

### Changed

- Command file renamed to `.opencode/commands/goal.md` (this phase's original conclusion, reasoned from a `strings` search of the installed opencode 1.17.11 binary confirming no built-in `/goal` command exists)
- Nine referencing surfaces re-swept: phase 003/007/008 docs, `004-lifecycle-tracking/graph-metadata.json`, both feature catalogs, both manual-testing playbooks, `ENV_REFERENCE.md`
- **Amendment (same day):** operator confirmed `.opencode/commands/goal_opencode.md` as the correct, final name instead, matching what the concurrent phase-009 session had independently converged on; all nine surfaces re-swept a second time to point at the amended name
- `goal_opencode.md`'s "unsupported verbs fail" claim corrected to describe the actual coerce-to-`set` dispatch behavior (the command's own routing resolves every non-empty input to a valid action before the tool is ever called)

### Fixed

- DR-002/DR-007-P1/DR-008: command surface had fractured into multiple names across code, phase docs, graph metadata and overlay catalogs/playbooks
- DR-007-P2: two non-deliverable files (`mk-spec-memory.js`, `session-cleanup.js`) stripped from `004-lifecycle-tracking/graph-metadata.json`'s `key_files`
- DR-004-P2: doc claimed unknown verbs fail; actual dispatch always coerces to `set`
- DR-010-P1: `MK_GOAL_PLUGIN_DISABLED=1` previously left manual `/goal set|clear|complete|pause` mutations still executing; `executeGoalAction`/`executeGoalStatus` now fail closed with a `PLUGIN_DISABLED` error when the flag is set
- DR-010-P2: `/goal set` output had no way to distinguish a fresh set from a refresh or replacement

### Verification

- `ls .opencode/commands/*goal*.md` - PASS: exactly one file, matching the live name at each point in the phase
- `node --check .opencode/plugins/mk-goal.js` - PASS
- Full 6-file `mk-goal-*.test.cjs` suite, fresh run - PASS: 6/6 exit 0
- Repo-wide `rg -n 'goal\.md'` sweep (excluding historical changelog/research/review dirs) - PASS: zero hits as a *current* filename claim, non-zero only in historical narrative
- `mutation=created|refreshed|replaced` repro (3 sequential set calls: new, same, different objective) - PASS: `created`, `refreshed`, `replaced` in order
- `MK_GOAL_PLUGIN_DISABLED=1` fail-closed repro (`set` and `status`) - PASS: both return `STATUS=FAIL code=PLUGIN_DISABLED`

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/goal_opencode.md` | Renamed (twice within phase) | Final canonical command filename; unknown-verb doc claim corrected. |
| `.opencode/plugins/mk-goal.js` | Modified | Fail-closed `MK_GOAL_PLUGIN_DISABLED` gate; `mutation` field on set output. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | `MK_GOAL_PLUGIN_DISABLED` entry documents the broader fail-closed contract. |
| `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Modified | Rename history extended with both the original and amended filename decisions. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json` | Modified | Non-deliverable files stripped from `key_files`. |
| Phase 003/007/008 docs, both feature catalogs, both manual-testing playbooks | Modified | Filename references re-swept twice (original rename, then amendment). |

### Follow-Ups

- A fifth rename is architecturally still possible; nothing in this phase code-level guards against it, only the operator's standing 2026-07-01 decision and this phase's existing procedure.
- Historical narrative in this phase's own docs and the constitutional memory file intentionally keeps past filenames in past tense; a literal repo-wide grep for retired names is not expected to return zero hits, only zero hits as a *current* filename claim.
