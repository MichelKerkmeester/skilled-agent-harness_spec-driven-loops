---
title: "Changelog: Release Cleanup Phase Parent"
description: "Chronological changelog for the release cleanup phase parent spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-release-cleanup` (Level 2)

### Summary

This rollup now reflects the mixed state of the release-cleanup children. Six phases remain scaffold-only with no target cleanup executed. Three phases are complete: manual testing playbooks, agent definitions and AGENTS/runtime routing. The root table links every child changelog and marks completed work separately from pending cleanup contracts.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| [`001-code-readmes`](./changelog-005-001-code-readmes.md) | Scaffold-only | Defines the future cleanup contract for per-directory code README surfaces. No target cleanup has run. |
| [`002-skill-and-repo-readmes`](./changelog-005-002-skill-and-repo-readmes.md) | Scaffold-only | Defines the future cleanup contract for skill-level, repo-level and runtime README surfaces. No target cleanup has run. |
| [`003-skill-references-assets-and-skillmd`](./changelog-005-003-skill-references-assets-and-skillmd.md) | Scaffold-only | Defines the future cleanup contract for skill `SKILL.md`, reference and asset Markdown. No target cleanup has run. |
| [`004-feature-catalogs`](./changelog-005-004-feature-catalogs.md) | Scaffold-only | Defines the future cleanup contract for feature catalog packages. No target cleanup has run. |
| [`005-manual-testing-playbooks`](./changelog-005-005-manual-testing-playbooks.md) | Complete | Rechecked the packet-028 manual testing playbook package and fixed 13 stale anchors across 9 files. |
| [`006-commands`](./changelog-005-006-commands.md) | Scaffold-only | Defines the future cleanup contract for command documentation and runtime mirrors. No target cleanup has run. |
| [`007-agents`](./changelog-005-007-agents.md) | Complete | Rewrote three agent mirror READMEs and localized two Claude path-convention lines after verifying all agent bodies. |
| [`008-agents-md`](./changelog-005-008-agents-md.md) | Complete | Corrected the root AGENTS.md mk-spec-memory tool count from 37 to 39 and verified both runtime mirrors. |
| [`009-changelogs-constitutional-and-templates`](./changelog-005-009-changelogs-constitutional-and-templates.md) | Scaffold-only | Defines the future cleanup contract for changelogs, constitutional docs and templates. No target cleanup has run. |

### Added

- Added linked rollup rows for all nine child changelogs.
- Added a mixed-state summary that separates completed cleanup from scaffold-only contracts.

### Changed

- Replaced the phase-parent placeholder with a source-grounded rollup.
- Rewrote stale pending-only child summaries for the completed phases.

### Fixed

- Corrected the root rollup so completed phases no longer read as pending.
- Preserved pending status for scaffold-only phases instead of inventing execution.

### Verification

| Check | Result |
|-------|--------|
| Child changelog inventory | PASS, 9 child changelogs plus root |
| Source grounding | PASS, child statuses checked against specs, tasks and implementation summaries |
| Link check | PASS, every child row links to its local changelog |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `changelog-005-root.md` | Updated | Parent rollup rewritten with linked child summaries |

### Follow-Ups

- Execute the six scaffold-only cleanup contracts when their document families are ready for a targeted pass.
