---
title: "Changelog: Phase 7: sk-code Asset-Template Alignment and Smart-Router Conformance [142-sk-code-ponytail-based-refinement/007-sk-code-asset-router-alignment]"
description: "Chronological changelog for the Phase 7 sk-code asset-template and smart-router conformance work."
trigger_phrases:
  - "phase changelog"
  - "sk-code assets"
  - "router conformance"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/007-sk-code-asset-router-alignment` (Level 2)
> Parent packet: `.opencode/specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement`

### Summary

Phase 7 made `sk-code` authoring assets conform to the `sk-doc` asset template and aligned smart-router prose with canonical loading-level language. The change is structural conformance only. It does not change routing behavior, `STACK_FOLDERS` keys or Iron Law wording.

### Added

- Added the Resource Loading Levels table to `SKILL.md` §2 in `.opencode/skills/sk-code/SKILL.md`.
- Confirmed playbook by-section anchors resolve and the ladder gate is intact.
- CHK-002 confirmed the technical approach is defined in `plan.md` as additive and structural-only.
- CHK-040 confirmed `spec.md`, `plan.md` and `tasks.md` are synchronized with the implemented work.
- CHK-041 is N/A because no code comments were added and markdown content was preserved verbatim.

### Changed

- Read sk-doc asset and smart-router standards under `sk-doc/assets/skill/*`.
- Read the 11 checklists plus `SKILL.md` §2 and identified the four router hard constraints.
- Confirmed the asset-validator failure: `missing_required_section: overview`.
- Restructured `agent_authoring.md` to OVERVIEW with Purpose and Usage in `assets/opencode/checklists/agent_authoring.md`.
- Restructured `command_authoring.md` and `mcp_server_authoring.md` in `assets/opencode/checklists/`.
- Restructured `skill_authoring.md` and `spec_folder_authoring.md` in `assets/opencode/checklists/`.

### Fixed

- CHK-FIX-001 is N/A because this was a conformance task, not a bug fix, and there were no findings to classify.
- CHK-FIX-002 is N/A because no behavioral producer changed and router prose is additive.
- CHK-FIX-003 completed the consumer scan. Playbook, `verify_stack_folders` and canary were checked.
- CHK-FIX-004 is N/A because no security, path, parser or redaction logic was touched.
- CHK-FIX-005 is N/A because there was no input matrix and edits were structural docs only.
- CHK-FIX-006 is N/A because no process-wide state was read.

### Verification

| Check | Result |
|-------|--------|
| Asset validation | PASS: `validate_document.py --type asset` on 11 checklists returned 11/11 VALID |
| Stack folders | PASS: `verify_stack_folders.py` exited 0 and 3 surfaces resolve |
| Rule canary | PASS: `check-rule-copies.js` exited 0 and both Iron Law lines are intact |
| Skill validation | PASS: `validate_document.py --type skill` on `SKILL.md` returned VALID |
| Playbook anchors | PASS: sub-detection table and §4 ALWAYS resolve to real sections |
| Task ledger | PASS: 14 completed task item(s) recorded |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `assets/opencode/checklists/agent_authoring.md` | Updated | OVERVIEW restructure with Purpose and Usage, dividers and renumbering |
| `assets/opencode/checklists/command_authoring.md` | Updated | OVERVIEW restructure |
| `assets/opencode/checklists/mcp_server_authoring.md` | Updated | OVERVIEW restructure |
| `assets/opencode/checklists/skill_authoring.md` | Updated | OVERVIEW restructure |
| `assets/opencode/checklists/spec_folder_authoring.md` | Updated | OVERVIEW restructure |
| `.opencode/skills/sk-code/SKILL.md` | Updated | Added Resource Loading Levels table and UNKNOWN_FALLBACK checklist to §2 |

### Follow-Ups

- CHK-042 says README update was not required because the sk-code README was unaffected by this conformance pass.
- The sk-code-review references-to-assets reclassification was deferred to a separate dedicated packet because its coupling spans changelogs, playbook source-anchors and runtime mirrors.
- The reclassification table and coupling map are recorded in the approved plan.
