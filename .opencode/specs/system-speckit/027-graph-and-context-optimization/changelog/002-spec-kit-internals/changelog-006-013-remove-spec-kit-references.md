---
title: "Changelog: Sweep stale advisor refs from spec-kit docs"
description: "Operator-facing system-spec-kit docs were audited after the advisor extraction. Stale live instructions pointing to old mcp_server/skill_advisor paths were rewritten to target the sibling system-skill-advisor skill and the bridge plugin. Advisor-owned catalog and playbook entries were deleted."
trigger_phrases:
  - "spec-kit advisor ref cleanup"
  - "stale advisor references sweep"
  - "013 remove spec-kit references"
  - "advisor doc cleanup post-extraction"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

After the advisor extraction moved ownership to the sibling `system-skill-advisor` skill, a baseline grep found 208 match lines across 29 spec-kit doc files that still referenced old `mcp_server/skill_advisor/` paths or named spec-kit as the advisor owner. Every hit was bucketed using ADR-004 policy: 31 stale live references were rewritten to target the sibling skill and the `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` bridge, 4 advisor-owned catalog and playbook entries were deleted from spec-kit, and 134 current sibling references were left in place. The final grep returned 167 match lines with zero `STALE_LIVE` doc instructions remaining.

### Added

None.

### Changed

- `ARCHITECTURE.md` retargeted to name `system-skill-advisor` as the advisor owner. Old `mcp_server/` architecture claims and cross-links were removed.
- `gate-enforcement.md` reworded Gate 2 fallback to describe the sibling advisor Python compat shim rather than the spec-kit-internal path.
- `hook_system.md` and both `skill-advisor-hook*.md` files retargeted OpenCode bridge path to `.opencode/plugins/` and updated smoke and package test commands.
- `SET-UP - Skill Advisor.md` retargeted build, test and install checks to `system-skill-advisor`.

### Fixed

- Live doc instructions in 8 operator-facing files were pointing operators to the old `mcp_server/skill_advisor/` path that no longer exists in spec-kit after the extraction.

### Verification

| Check | Result |
|-------|--------|
| Baseline grep | PASS: required grep returned 208 match lines across 29 files. |
| Final grep | PASS: same grep returned 167 match lines. Manual stale-live sweep found 0 `STALE_LIVE` doc instructions remaining. |
| Stale path grep | PASS: targeted grep for `mcp_server/skill_advisor`, removed `plugin_bridges`, old advisor tests and deleted local entries returned 0 hits in whitelisted docs. |
| Spot-checks | PASS: `ARCHITECTURE.md`, `README.md`, `hook_system.md`, `skill-advisor-hook.md` and `SET-UP - Skill Advisor.md` inspected after edits. |
| Strict validation | PASS: `validate.sh 013-remove-spec-kit-references --strict` passed after packet docs were filled. |
| Spec-kit root strict validation | SKIPPED: `.opencode/skills/system-spec-kit/spec.md` is absent. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modified | Removed live claims that advisor lives under spec-kit `mcp_server/`. Retargeted architecture and cross-links to the sibling skill. |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Retargeted OpenCode bridge path and advisor README link. |
| `.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md` | Modified | Reworded Gate 2 fallback as the sibling advisor Python compat shim. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modified | Retargeted OpenCode bridge path to `.opencode/plugins/`. |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modified | Retargeted OpenCode bridge smoke and package test command. |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Modified | Retargeted bridge validation paths and added advisor package build. |
| `.opencode/skills/system-spec-kit/scripts/observability/README.md` | Modified | Fixed sibling advisor relative path. |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Modified | Retargeted build, test and install checks to `system-skill-advisor`. |
| `.opencode/skills/system-spec-kit/feature_catalog/11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md` | Deleted | Advisor-owned feature catalog entry removed from spec-kit catalog. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md` | Deleted | Advisor-owned manual scenario removed from spec-kit playbook. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/279-advisor-status-rebuild-separation.md` | Deleted | Duplicate advisor repair scenario removed. Sibling advisor playbook now owns it. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | Removed the deleted local row 279. |

### Follow-Ups

- The final grep still reports current sibling advisor references and out-of-scope script and test fixture hits. Those are not stale live doc instructions and require no further action.
- Parallel-session dirty files were left untouched and must not be included in the scoped commit.
