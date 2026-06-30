---
title: "Changelog: Phase 8: system-spec-kit integration [032-goal-opencode-plugin/008-system-spec-kit-integration]"
description: "Chronological changelog for integrating the /goal OpenCode plugin into system-spec-kit references and assets."
trigger_phrases:
  - "phase changelog"
  - "goal plugin system-spec-kit"
  - "mk-goal references"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

This phase changelog records the system-spec-kit documentation integration for the local `/goal` OpenCode plugin and its operator-facing references.

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 1. 2026-06-30

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/008-system-spec-kit-integration` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`

### Summary

The `/goal` OpenCode plugin is now documented inside `system-spec-kit` as a known local plugin surface. The integration adds routed skill logic, a hook reference, feature catalog and manual playbook assets, environment variable coverage, and explicit bridge-boundary notes so operators do not confuse `mk-goal` with daemon-backed plugins.

### Added

- Added `references/hooks/goal_plugin.md` with plugin paths, behavior, env vars, boundaries, and verification commands.
- Added `feature_catalog/18--ux-hooks/goal-opencode-plugin.md`.
- Added `manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md` and root playbook row `454`.

### Changed

- Updated `system-spec-kit/SKILL.md` keywords and hook routing for `mk-goal`, `/goal`, `active_goal`, and session-goal terms.
- Updated `references/config/hook_system.md` with a goal-plugin session-objective contract.
- Updated `ARCHITECTURE.md` and `mcp_server/plugin_bridges/README.md` to distinguish bridge-backed plugins from standalone local plugins.
- Updated `mcp_server/ENV_REFERENCE.md` with `MK_GOAL_*` runtime controls.
- Updated parent phase map and changelog index for phase 008.

### Fixed

- System-spec-kit no longer omits the `/goal` plugin from its OpenCode plugin documentation surface.

### Verification

- `node .opencode/plugins/__tests__/mk-goal-state.test.cjs` - PASS.
- `node .opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` - PASS.
- `node .opencode/plugins/__tests__/mk-goal-export-contract.test.cjs` - PASS.
- `node .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` - PASS.
- `node .opencode/plugins/__tests__/mk-goal-supervisor.test.cjs` - PASS.
- `node .opencode/plugins/__tests__/mk-goal-continuation.test.cjs` - PASS.
- `python3 .opencode/skills/sk-doc/scripts/extract_structure.py` on the new goal reference, feature catalog file, and manual playbook file - PASS.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` - PASS with one unrelated existing warning.
- `LC_ALL=C rg -n "[^ -~]"` on new phase and goal docs - PASS.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/032-goal-opencode-plugin --strict` - PASS: parent packet and all nine phases.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Routes goal-plugin terms and summarizes the local plugin contract. |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Created | Adds the operator contract. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modified | Adds `mk-goal` to OpenCode plugin transport docs. |
| `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md` | Created | Adds feature catalog coverage. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md` | Created | Adds manual validation scenario. |

### Follow-Ups

- Restart OpenCode before testing newly loaded plugin or command behavior after plugin edits.
