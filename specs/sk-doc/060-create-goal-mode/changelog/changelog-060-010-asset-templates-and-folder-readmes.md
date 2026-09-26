---
title: "Changelog: Phase 10: asset-templates-and-folder-readmes [060-create-goal-mode/010-asset-templates-and-folder-readmes]"
description: "Chronological changelog for the Phase 10: asset-templates-and-folder-readmes phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-09-26

> Spec folder: `specs/sk-doc/060-create-goal-mode/010-asset-templates-and-folder-readmes` (Level 2)
> Parent packet: `specs/sk-doc/060-create-goal-mode`

### Summary

An author now starts a goal from a blank that already fits its kind. assets/ holds a top-level, a phase-parent and a phase-child template, each carrying the system-spec-kit goal template word for word apart from placeholders written for that kind. A parity test keeps them in step with goal.md.tmpl, and the checker now rejects an unfilled copy of any of them. Before this change, an unfilled top-level copy passed all four checks. The two code folders have READMEs, and the references index is gone.

### Added

- Write the three templates, generated from the renders with kind-specific placeholder wording (sk-create-goal/assets/goal-{top-level,phase-parent,phase-child}-template.md).
- Make the checker read the templates' placeholder wording and add one unfilled-template test per kind (scripts/check-goal.cjs, scripts/tests/check-goal.test.cjs). Evidence: before the change an unfilled top-level copy passed all four checks.
- Regenerate leaf-manifest.json, republish the sk-doc compiled route and regenerate .hermes/skills/sk-create-goal/SKILL.md.
- Amend parent decision D2, add the phase 010 binding row and a template criterion, and print the parent chat slice (../goal.md).
- Run node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/. Evidence: 15 of 15 pass.
- Compare check-goal.cjs --all under the HEAD checker and the new one. Evidence: identical reports over 302 goals.

### Changed

- Render goal.md.tmpl at level 2 and at the phase level with inline-gate-renderer.sh. Evidence: the two renders differ only by the binding section, so top-level and child goals share one structure.
- Record the operator's decision. Evidence: "Checked per-kind copies (Recommended)", 2026-09-26, which supersedes the render-only rule and parent decision D2.
- Write the parity test (scripts/tests/template-parity.test.cjs). Evidence: four tests, three parity and one drift control.
- Delete references/README.md and assets/.gitkeep, and repoint SKILL.md, README.md and ROUTER.md.
- Amend the workflow in SKILL.md, references/parent-and-nested-goals.md, both command YAMLs, the presentation contract, the command router, the README and the playbook prose.
- Version the mode 1.1.0.0 and write changelog/v1.1.0.0.md.

### Fixed

- Read the sibling template convention (sk-create-repo-rule/assets/repo-rule-template.md). Evidence: frontmatter, an overview, the template between <!-- BEGIN TEMPLATE --> and <!-- END TEMPLATE -->, the fixed elements and a self-check.
- Write the code-folder READMEs (scripts/README.md, scripts/tests/fixtures/README.md).
- CHK-021 The parity test fails when a fixed line is removed

### Verification

- node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/ - 15 of 15 pass
- check-goal.cjs --all, HEAD checker versus new - Identical reports, 302 goals scanned
- Code-folder READMEs - 0 issues each; HVR 0 hard blockers
- Templates - 0 issues as asset; the one HVR hard blocker in each is the semicolon in goal.md.tmpl's own sentence, which parity keeps
- Changelog - Shape checker 0 errors; validator 0 issues; HVR 0 hard blockers
- SKILL.md, README, command router - 0 issues each; HVR 0 hard blockers
- Package, playbook, parent-skill check - Result: PASS; PASS ... scenarios=8 ... violations=0; all hard invariants passed
- Routing - Guard fresh, verify OK, all hubs compiled-serving, kill-switch legacy, sk-doc admission pass, canary 22 of 22, finalize exit 0

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Each template carries one voice finding it cannot fix. The semicolon is in goal.md.tmpl's own sentence, and changing it would break parity. The fix belongs in system-spec-kit.
- references/parent-and-nested-goals.md still lacks an Overview section. The validator already flagged it before this phase.
- The v1.0.0.0 changelog keeps the older layout. v1.1.0.0 uses the current one.
- sk-design admission drift remains. It predates this packet, and the sk-doc row passes.
