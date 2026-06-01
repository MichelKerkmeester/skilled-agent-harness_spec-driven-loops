---
title: "Skill references and assets documentation alignment"
description: "System-spec-kit documentation carried stale references to deleted scripts and old template folder names and omitted newly shipped validation and workflow features. An audit across 39 Markdown files updated 19 files in the skill entry, references, and assets surfaces to align with the current manifest-backed template and validation system."
trigger_phrases:
  - "skill references assets alignment"
  - "round 5 skill docs audit"
  - "system-spec-kit stale reference cleanup"
  - "manifest-backed template documentation"
  - "skill entry documentation alignment"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/005-skill-reference-asset-doc-alignment` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

The system-spec-kit skill documentation surface had stale references to deleted scripts, old template folder names, and a retired architecture label from earlier cleanup rounds. It also omitted newly shipped validation and workflow features introduced in packets 003 and 004. An audit covered 39 Markdown files across the skill entry document (SKILL.md), references directory, and assets directory. The audit updated 19 files to replace stale references with current manifest-backed template and validation paths and to document newly available features where those topics naturally belong.

### Added

- Documentation for create.sh traversal hardening and phase-mode syntax in reference workflow and structure pages
- Documentation for the validation orchestrator, exit-code taxonomy, post-create validation, and save-locking behavior in reference validation and config pages

### Changed

- SKILL.md agent routing directions now reference templates/manifest/spec-kit-docs.json and templates/manifest/*.md.tmpl instead of deleted level-contract file and folder names
- Reference documentation replaced stale level_contract_* guidance with live manifest-backed template render guidance
- Assets template mapping documentation updated to show phase-parent scaffolding through create.sh --phase and batch inline rendering
- Phase parent graph-metadata.json updated with child identifier and active-child pointer for the 005 packet

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Gate A stale-pattern grep | PASS: zero hits for deleted scripts, deleted template paths, and retired architecture label |
| Gate B workflow-invariance vitest | PASS: 1 test file and 2 tests passed in 253ms |
| Gate C 005 packet strict validation | PASS: Errors 0, Warnings 0 |
| Gate D 003 and 004 regression validation | PASS: both packets reported Errors 0, Warnings 0 |
| Gate E sentinel packet validation | PASS: Errors 0, Warnings 0 |
| Markdown readability | PASS: all 39 in-scope Markdown files are readable |
| Current-reality grep | PASS: no remaining level_contract_*, Level template contract folder, placeholder resolver command, or old phase command hits |
| Tasks complete | 28 completed task items recorded |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Replaced stale level-contract file references with manifest-backed template paths and updated exit-code taxonomy |
| `.opencode/skills/system-spec-kit/references/` (multiple files) | Modified | Updated workflow, validation, template, structure, memory, config, and intake docs with current manifest-backed references |
| `.opencode/skills/system-spec-kit/assets/` (multiple files) | Modified | Updated template matrices and routing assets for manifest-backed scaffolding and rendering commands |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/graph-metadata.json` | Modified | Added child identifier and active-child pointer for the 005 packet |

### Follow-Ups

- None.
