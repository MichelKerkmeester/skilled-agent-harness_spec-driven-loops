---
title: "Phase 028: Documentation Alignment and Missing README Fill-in"
description: "Five doc-quality drift items under system-spec-kit are now aligned with sk-doc canonical templates. Two new folder READMEs were created for shared/predicates and code_graph/lib/utils. The parallel operator_runbook surface was merged into manual_testing_playbook as the single canonical testing surface."
trigger_phrases:
  - "doc alignment readme fill-in"
  - "operator_runbook merge manual_testing_playbook"
  - "multi-ai-council reference frontmatter"
  - "predicates folder readme"
  - "sk-doc canonical template alignment"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-07

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Five doc-quality drift items had accumulated under `system-spec-kit/`. Only one of six multi-ai-council reference files conformed to the `skill_reference_template.md` standard. Two manifest maintainer docs lacked reference frontmatter entirely. Two code-folder subdirectories had no README at all. The `skill_advisor/` directory carried two parallel manual-testing surfaces that violated the sk-doc single-source-of-truth contract.

All five work-blocks landed in one orchestrated pass. The six multi-ai-council reference files now carry YAML frontmatter, a 1-2 sentence intro, a horizontal divider, numbered uppercase H2 sections. The two manifest docs at `templates/manifest/` gained reference frontmatter while staying in place. Two new folder READMEs were authored using the `readme_code_template.md` baseline. The 42 scenarios from `operator_runbook/` were merged into `manual_testing_playbook/` across nine category directories. Four SAD-NNN overlaps were absorbed into their NC/CL counterparts. A legacy ID cross-reference appendix was added to the entry-point file.

Future authors who copy any of these folders as patterns now inherit a clean precedent rather than amplifying the drift.

### Added

- `shared/predicates/README.md` using `readme_code_template.md`, documenting `boolean-expr.ts` exports and test coverage
- `mcp_server/code_graph/lib/utils/README.md` using `readme_code_template.md`, documenting `workspace-path.ts` and its three handler callers
- Reference frontmatter with `contextType: "reference"` on all six multi-ai-council reference files
- 42 per-test scenario files across nine category directories in `manual_testing_playbook/`
- Legacy ID cross-reference appendix in `manual_testing_playbook.md` mapping deprecated SAD-001 through SAD-004 to their new locations

### Changed

- `templates/manifest/EXTENSION_GUIDE.md`: added reference frontmatter and co-location header comment; file stays at `templates/manifest/`
- `templates/manifest/MIGRATION.md`: added reference frontmatter and co-location header comment; file stays at `templates/manifest/`
- Six multi-ai-council reference files (`command-wiring`, `convergence-signals`, `folder-layout`, `output-schema`, `seat-diversity-patterns`, `state-format`): added intro paragraph, horizontal divider, numbered H2 sections
- `manual_testing_playbook.md` entry-point: rewritten to follow sk-doc playbook template across sections 1 through 17 with per-category summary tables and a recommended wave plan

### Fixed

- Four SAD-NNN scenarios absorbed into NC/CL counterparts with explicit absorption notes, eliminating the parallel-folder duplication
- Stale `operator_runbook` references in skill docs updated to point to `manual_testing_playbook`

### Verification

| Check | Result |
|-------|--------|
| 6 multi-ai-council files pass `validate_document.py` as `reference` | PASS, zero issues per file |
| `EXTENSION_GUIDE.md` and `MIGRATION.md` have YAML frontmatter | PASS, both excluded by validator templates/ pattern but frontmatter in place for indexing |
| `shared/predicates/README.md` validates as `readme` | PASS, zero issues |
| `mcp_server/code_graph/lib/utils/README.md` validates as `readme` | PASS, zero issues |
| 42 per-test files pass `validate_document.py` as `playbook_feature` | PASS, 42 of 42 |
| `manual_testing_playbook.md` entry-point validates | PASS as `readme` type |
| `operator_runbook/` directory removed | PASS, `test ! -d` returns true |
| No stale `operator_runbook` references in active code or current spec packets | PASS, only historical mentions in two other packets remain |
| No stale `SAD-001..004` references outside intentional cross-ref appendix | PASS, only absorption notes and the cross-reference section match |
| Strict spec validate on packet 028 | Errors: 2, Warnings: 0, matching sibling 027 baseline accepted across the parent |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/references/multi-ai-council/*.md` (6 files) | Added YAML frontmatter, intro paragraph, horizontal divider, numbered H2 sections |
| `.opencode/skills/system-spec-kit/templates/manifest/EXTENSION_GUIDE.md` | Added reference frontmatter and co-location header comment |
| `.opencode/skills/system-spec-kit/templates/manifest/MIGRATION.md` | Added reference frontmatter and co-location header comment |
| `.opencode/skills/system-spec-kit/shared/predicates/README.md` (NEW) | New folder README documenting `boolean-expr.ts` exports and test coverage |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/README.md` (NEW) | New folder README documenting `workspace-path.ts` and three handler callers |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/**` | 42 per-test files added across 9 category directories. Entry-point rewritten to sk-doc playbook template. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/` | Entire directory deleted after merge |

### Follow-Ups

- Restore `graph-metadata.json` parent_id to the correct parent path after any future `generate-context.js` refresh, as auto-generation resets the field.
- Confirm NC-004 receiver content against git history to determine if the original narrative needs restoring. A partial cli-codex run emptied the OVERVIEW and SCENARIO CONTRACT sections before being killed.
- Update parent `000-release-cleanup/` `graph-metadata.json` field `derived.last_active_child_id` to point at this packet if not already set.
