---
title: "Changelog: 005-deep-commands"
description: "Six mode-based deep commands were split into thin routers plus presentation assets, with workflow YAML byte-identical and parity verified."
trigger_phrases:
  - "011 005 deep commands changelog"
  - "deep command router split"
  - "deep presentation assets"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/005-deep-commands` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation`

### Summary

The presentation/router split was extended to the deep command family. Six mode-based deep commands became thin routers plus `deep_<command>_presentation.*` assets, while their `_auto.yaml` and `_confirm.yaml` workflow assets remained byte-identical.

### Added

- Presentation assets for `ask-ai-council`, `start-agent-improvement-loop`, `start-context-loop`, `start-model-benchmark-loop`, `start-research-loop`, and `start-review-loop`.
- `command_presentation_template` support in sk-doc for scaffolding presentation contracts.

### Changed

- Six deep command routers now follow the speckit-pattern sections: Router Contract, Owned Assets, Mode Routing, Execution Targets, Presentation Boundary, and Workflow Summary.
- `sk-doc` command template guidance now documents the presentation/router split for mode-based workflow command families.

### Fixed

- Three P2 parity findings were remediated by restoring omitted synchronization and HARD BLOCK framing clauses in deep command routing text.

### Verification

| Check | Result |
|-------|--------|
| Structural gate | PASS: all six routers reference owned assets and keep frontmatter intact |
| Workflow assets | PASS: six `_auto`/`_confirm` YAML pairs byte-identical to HEAD |
| Deterministic parity sweep | PASS |
| Fable 5 parity | PASS: 6/6 commands |
| Spec validation | PASS: this folder strict validation, 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/deep/*.md` (6 mode commands) | Modified | Thin routers with presentation boundaries |
| `.opencode/commands/deep/assets/deep_*_presentation.*` | Created | Deep command display contracts |
| `.opencode/skills/sk-doc/assets/command_template.md` | Modified | Router/presentation standard aligned |
| `.opencode/skills/sk-doc/assets/command_presentation_template.md` | Created | Presentation contract skeleton |
| `005-deep-commands/**` | Updated | Phase docs and verification evidence |

### Follow-Ups

- Two non-mode deep commands were verified as already thin and remained out of split scope.
