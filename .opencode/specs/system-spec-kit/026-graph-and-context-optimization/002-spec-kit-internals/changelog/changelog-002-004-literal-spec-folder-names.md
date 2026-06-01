---
title: "Changelog: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N [002-spec-kit-internals/004-literal-spec-folder-names]"
description: "AI-derived spec folder and phase slugs defaulted to generic placeholders across 10 generation surfaces with no enforcement of literal subject tokens. Four high-impact surfaces were updated and one new SKILL.md rule landed to require concrete naming."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
  - "literal naming"
  - "spec folder names"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals`

### Summary

AI-derived spec-folder and phase slugs frequently defaulted to generic placeholders that do not describe the concrete work being shipped. Generic examples like phase-1, phase-2, remediation, and cleanup appeared across 10 generation surfaces with no enforcement. The intervention updated four high-impact surfaces to require a literal slug with a specific subject token, added a visible warning in create.sh when phase names are omitted, and landed a new always-on rule 20 in system-spec-kit/SKILL.md covering remediation-packet naming.

### Added

- New ALWAYS rule 20 in system-spec-kit/SKILL.md codifying the requirement that AI-derived spec folders and phases reference both the source and the specific target component or behaviour.
- create.sh auto-generation fallbacks now emit a PROVIDE-DESCRIPTIVE-SLUG placeholder and a stderr warning when --phase-names is omitted, making the omission visible on every ls.

### Changed

- Four YAML workflow files (spec_kit_plan_auto.yaml, spec_kit_plan_confirm.yaml, spec_kit_complete_auto.yaml, spec_kit_complete_confirm.yaml) now demand literal phase names that describe the concrete work. Names must include a specific subject token and explicitly reject placeholders like phase-1, phase-2, remediation, and cleanup.
- complete.md Q8 interactive prompt now includes concrete bad-vs-good examples to guide operators toward descriptive phase naming.

### Fixed

- None.

### Verification

- validate.sh --strict on this packet - PASS (0 errors, 0 warnings)
- All 4 YAMLs load via yaml.safe_load - 4/4 OK
- grep -l "specific subject token" on the 4 YAMLs - 4/4 match (parity confirmed)
- bash -n create.sh - Exit 0 (syntax check)
- grep -c PROVIDE-DESCRIPTIVE-SLUG create.sh - 2 (one per fallback site)
- Synthetic create.sh smoke-test with --phase and no --phase-names - Emits 3 stderr warnings; scaffolds 001-phase-1-PROVIDE-DESCRIPTIVE-SLUG etc.
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
| `.opencode/commands/spec_kit/complete.md` | Modified | Q8 Phase Names prompt: bad-vs-good examples added |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | New ALWAYS rule 20: Literal naming for AI-derived spec folders and phases |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Phase-naming entry refreshed to mention new guidance |

### Follow-Ups

- No retroactive renaming of existing generic packets (005-deep-review-p1-p2-remediation, 004-remediation, 001-remediation) because it would require updating every changelog, memory, and graph-metadata reference.
- No lint enforcement for generic slugs was adopted as the right scope. A lint would need a stoplist plus allowlist, and legitimate names like 001-research-and-baseline would false-positive.
- Smoke test of the YAML rewrite is not automated and requires a manual operator-driven run against an ambiguous task to confirm /spec_kit:plan :auto produces literal names.
