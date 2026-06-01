---
title: "Track 002 Phase Changelogs"
description: "Index of phase-level changelogs for the 026/002 resource-map-template track. Covers the local-owner deep-loop rollback, the cross-cutting template creation, and the convergence-time auto-emission integration."
trigger_phrases:
  - "track 002 changelog"
  - "resource map template changelog index"
  - "phase changelog index 002"
  - "resource map template history"
  - "002 track changelog readme"
importance_tier: "normal"
contextType: "implementation"
---

# Track 002 Phase Changelogs

Three phases shipped between 2026-04-24 and 2026-05-02 that together introduced a reusable resource-map path catalog, restored the local-owner deep-loop artifact contract, and made autonomous deep loops emit filled resource maps at convergence with zero scan cost.

The resource-map track is the second child packet under the 026-graph-and-context-optimization specification. It solved three problems in sequence: (1) child-phase deep-loop artifacts had been scattering under ancestor root folders due to a centralized placement policy, (2) reviewers had no reusable template for a flat "what files did this packet touch" path catalog, and (3) there was no automation to fill that catalog from evidence the loops already captured.

## Phases (chronological)

| Phase | Date | Title | One-line story |
|-------|------|-------|----------------|
| 001 | 2026-05-02 | [Reverse parent research/review folders](./001-reverse-parent-research-review-folders/changelog-001-reverse-parent-research-review-folders.md) | Restored local-owner artifact placement for 135 child packets and rewrote 155 references. |
| 002 | 2026-05-02 | [Resource map template creation](./002-resource-map-template-creation/changelog-002-resource-map-template-creation.md) | Created the cross-cutting resource-map.md template and wired it into 12 discovery surfaces. |
| 003 | 2026-04-26 | [Resource map deep-loop integration](./003-resource-map-deep-loop-integration/changelog-003-resource-map-deep-loop-integration.md) | Made deep-review and deep-research auto-emit filled resource maps at convergence. |

## How to read these

Each phase changelog follows the canonical nested-changelog template at `.opencode/skills/system-spec-kit/templates/changelog/phase.md`. Sections are:

- **Summary**: what changed and why it mattered, in plain language
- **Added**: new capabilities or surfaces
- **Changed**: behavior changes to existing features
- **Fixed**: bugs closed
- **Verification**: how the change was validated
- **Files Changed**: source paths with one-line descriptions
- **Follow-Ups**: known deferred items

Voice rules per `.opencode/skills/sk-doc/references/global/hvr_rules.md` apply throughout.

## Where to find the full story

- Per-phase spec folders live under `026/002/001/`, `026/002/002/`, and `026/002/003/`.
- The track-root Level 3 spec at `026/002/spec.md` covers the executive summary and cross-cutting requirements.
- Deep-research and deep-review iteration output lives inside each phase's `research/` and `review/` folders.
- Implementation summaries with detailed file changes live at each `<phase>/implementation-summary.md`.

## Authoring conventions

- File names: `changelog-<phase>-<short-name>.md`
- One file per shipped phase, regardless of commit count
- Multi-commit phases collapse into one entry with all commits listed in Files Changed
- HVR rules are non-negotiable: no em-dashes, no semicolons, no Oxford commas in narrative prose
