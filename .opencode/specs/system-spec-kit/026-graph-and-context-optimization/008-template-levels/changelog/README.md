---
title: "Template Levels Phase Changelogs"
description: "Index of phase-level changelogs for the 026/010 template-levels track. Each entry tells the story of what was investigated, designed, shipped, and audited across eight phases that replaced the spec-kit Level 1/2/3/3+ template taxonomy with a manifest-driven capability-flag system."
trigger_phrases:
  - "template levels changelog"
  - "template levels history"
  - "phase changelog index"
  - "026/010 changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Template Levels Phase Changelogs

Eight phases shipped between 2026-05-01 and 2026-05-02 that together replaced the spec-kit Level 1/2/3/3+ template taxonomy with a manifest-driven capability-flag system. The template source surface dropped from 86 files to approximately 13 in `templates/manifest/`. The Level vocabulary remains the sole public/AI-facing surface per ADR-005 (workflow-invariance constraint).

## Phases (chronological)

| Phase | Date | Title | One-line story |
|-------|------|-------|----------------|
| 010/001 | 2026-05-01 | [Template consolidation investigation](./changelog-001-consolidation-investigation.md) | A 10-iteration deep-research loop analyzed the 86-file template system and recommended PARTIAL consolidation. The user rejected this framing. |
| 010/002 | 2026-05-01 | [Template greenfield redesign](./changelog-002-template-greenfield-redesign.md) | A 9-iteration loop converged on the C+F hybrid manifest-driven design with 5 ADRs, eliminating the level taxonomy. |
| 010/003 | 2026-05-01 | [Template greenfield implementation](./changelog-003-template-greenfield-impl.md) | Executed the 4-phase plan: added manifest/resolver/renderer/CI-test, modified scaffolder, modified validators, deleted 51 legacy files. Source surface: 86 to 13. |
| 010/004 | 2026-05-01 | [Deferred followups](./changelog-004-deferred-followups.md) | Implemented 10 Gate 7 items: validation orchestrator, manifest template versions, exit-code taxonomy, save lock, batch renderer, and 5 ADRs. |
| 010/005 | 2026-05-02 | [Skill references and assets alignment](./changelog-005-skill-references-assets-alignment.md) | Audited SKILL.md, references/, and assets/ for stale references after the migration. Removed all stale hits and added current-feature notes. |
| 010/006 | 2026-05-02 | [Command Markdown and YAML alignment](./changelog-006-command-md-yaml-alignment.md) | Audited 18 command assets (6 Markdown + 12 YAML) for stale references and missing behavior notes. All 12 YAMLs parse cleanly. |
| 010/007 | 2026-05-02 | [Fleet marker validation sweep](./changelog-007-fleet-marker-validation-sweep.md) | Swept all spec folders for SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers referencing deleted paths. Corrected where needed. |
| 010/008 | 2026-05-02 | [z_archive marker validation sweep](./changelog-008-z-archive-marker-validation-sweep.md) | Confirmed archive markers are correct as historical provenance under ADR-005 indefinite support. No corrections needed. |

## How to read these

Each phase changelog follows the canonical nested-changelog template at `.opencode/skills/system-spec-kit/templates/changelog/phase.md`. Sections are:

- **Summary**: what changed and why it matters, in plain language
- **Added**: new capabilities or surfaces
- **Changed**: behavior changes to existing features
- **Fixed**: bugs closed
- **Verification**: how we proved the change works
- **Files Changed**: source paths with one-line descriptions
- **Follow-Ups**: known deferred items

Voice rules per HVR apply throughout. Technical jargon includes a parenthetical definition on first use.

## Where to find the full story

- Per-phase spec folders live under `026/010/001/` through `026/010/008/`.
- Deep-research output for phases 001 and 002 lives at `<phase>/research/research.md`.
- Implementation summaries with detailed file changes live at `<phase>/implementation-summary.md`.
- The key ADRs are at `002/decision-record.md` (ADR-001 through ADR-005) and `004/decision-record.md`.

## Authoring conventions

- File names: `changelog-<phase>-<short-name>.md`
- One file per shipped phase, regardless of commit count
- Multi-commit phases collapse into one entry with all commits listed in Files Changed
- HVR rules are non-negotiable: no em-dashes, no semicolons, no Oxford commas in narrative prose
- SPECKIT_TEMPLATE_SOURCE marker present in every phase changelog