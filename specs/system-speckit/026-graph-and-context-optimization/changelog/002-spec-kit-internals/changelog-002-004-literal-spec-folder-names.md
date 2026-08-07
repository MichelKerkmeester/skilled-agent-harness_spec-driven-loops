

---
title: "Changelog: Literal spec folder and phase naming guidance [002-spec-kit-internals/004-literal-spec-folder-names]"
description: "AI-chosen spec-folder and phase slugs now must include a specific subject token, generic placeholders like remediation and phase-N are explicitly rejected across four workflow surfaces."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
  - "literal spec folder names"
  - "spec kit internals"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals`

### Summary

AI-chosen spec-folder and phase slugs now must include a specific subject token describing the concrete work being built or fixed. Generic placeholders like phase-1, phase-2, remediation, cleanup, and review-remediation-2 are explicitly listed as rejected examples. The instruction lands at four surfaces: the four YAML workflow files that drive /spec_kit:plan and /spec_kit:complete, the create.sh auto-generation fallback, the complete.md interactive Q8 prompt, and a new always-on rule 20 in system-spec-kit/SKILL.md.

### Added

- No new additions recorded.

### Changed

- The Generate phase names activity in all four spec_kit YAML workflow files now demands literal names with a specific subject token, rejecting generic placeholders like phase-1, phase-2, remediation, and cleanup.
- The create.sh auto-generation fallback at lines 571 and 1084 now emits a PROVIDE-DESCRIPTIVE-SLUG placeholder slug plus a stderr warning when --phase-names is omitted, instead of silently scaffolding phase-N.
- The complete.md interactive Q8 prompt now includes concrete bad-versus-good examples for phase naming.
- A new ALWAYS rule 20 in system-spec-kit/SKILL.md codifies the requirement for literal naming of AI-derived spec folders and phases, including remediation packets.

### Fixed

- No fixes recorded.

### Verification

- validate.sh --strict on this packet - PASS (0 errors, 0 warnings)
- All 4 YAMLs load via yaml.safe_load - 4/4 OK
- grep -l "specific subject token" on the 4 YAMLs - 4/4 match (parity confirmed)
- bash -n create.sh - Exit 0 (syntax check)
- grep -c PROVIDE-DESCRIPTIVE-SLUG create.sh - 2 (one per fallback site)
- Synthetic create.sh smoke-test with --phase and no --phase-names - Emits 3 stderr warnings, scaffolds 001-phase-1-PROVIDE-DESCRIPTIVE-SLUG etc.
- grep -c '^## ' SKILL.md (pre vs post) - 7 vs 7 (unchanged)
- grep "Literal naming for AI-derived" SKILL.md - 1 match (rule 20 present)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml` | Modified | Step-P2 activity rewritten to demand literal names with specific subject token |
| `.opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modified | Step-P2 activity rewritten to demand literal names with specific subject token |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml` | Modified | Step-P2 activity rewritten to demand literal names with specific subject token |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modified | Step-P2 activity rewritten to demand literal names with specific subject token |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modified | Lines 571 and 1084: placeholder slug plus stderr warning when --phase-names omitted |
| `.opencode/commands/spec_kit/complete.md` | Modified | Q8 Phase Names prompt rewritten with bad-versus-good examples |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | New ALWAYS rule 20 for literal naming of AI-derived spec folders and phases |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Phase-naming entry refreshed to mention new guidance |

### Follow-Ups

- None.
