---
title: "Track 002 Phase 002: Resource map template creation"
description: "Authored the resource-map.md template at the templates root and wired it into every discovery surface across all documentation levels. One constant edit in the MCP spec-doc classifier so memory indexing recognizes the new filename."
trigger_phrases:
  - "track 002 phase 002 changelog"
  - "resource map template creation"
  - "cross-cutting path catalog template"
  - "resource-map.md template wiring"
  - "level-agnostic template"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/002-resource-map-template-creation` (Level 2)
> Parent packet: `system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix`

### Summary

Before this phase, reviewers had no quick way to answer "what files did this packet touch" without reading `implementation-summary.md` end to end or diffing git. A prior one-off artifact (005/path-references-audit) proved the value of a flat categorized path ledger but was never promoted into a reusable template.

This phase promoted that shape to a first-class cross-cutting template. The template now lives at the templates root alongside handover, research, and debug-delegation. It stays optional at every level so existing spec folders are never retroactively broken. A single coordinated pass wired it into the main templates README, all four level READMEs, SKILL.md, the skill root README, the level specifications reference, the feature catalog, the manual testing playbook, and CLAUDE.md. The MCP spec-doc classifier gained one entry in `SPEC_DOCUMENT_FILENAMES` so memory save and discovery treat it as a canonical spec document.

### Added

- New template file `templates/resource-map.md` with frontmatter, Summary block with count placeholders, Action and Status vocabulary note, and ten category sections: READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta. Author-instructions HTML comment at the bottom.
- New feature catalog entry `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md`.
- New manual testing playbook entry `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md`.

### Changed

- `mcp_server/lib/config/spec-doc-paths.ts`: appended `resource-map.md` to `SPEC_DOCUMENT_FILENAMES` so the MCP classifier recognizes the new filename.
- Main templates README: Structure table row, Workflow Notes, and Related section for the new file.
- All four level READMEs (1, 2, 3, 3+): Optional Files subsection mentioning the template.
- `SKILL.md`: canonical spec docs list, cross-cutting templates section, distributed governance note.
- Skill root README: template architecture section updated.
- `references/templates/level_specifications.md`: cross-cutting templates row and per-level optional files blocks.
- `CLAUDE.md`: Documentation Levels cross-cutting note.

### Fixed

- No bugs fixed. This was an additive feature with no behavior change.

### Verification

- `npm run typecheck` inside `mcp_server/`: exit 0.
- Grep audit of all 12 discovery surfaces for the new filename: hit count >= 1 in every target file.
- Strict packet validation: passed after refactoring spec/plan/tasks/checklist to Level 2 shape.
- Template file verified: frontmatter complete, ten category sections present, SPECKIT_TEMPLATE_SOURCE marker present, no placeholder tokens.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/templates/resource-map.md` (NEW) | The cross-cutting template with ten category sections. |
| `.opencode/skills/system-spec-kit/templates/README.md` | Modified: structure row + workflow notes + related. |
| `.opencode/skills/system-spec-kit/templates/level_1/README.md` | Modified: optional files subsection. |
| `.opencode/skills/system-spec-kit/templates/level_2/README.md` | Modified: optional files subsection. |
| `.opencode/skills/system-spec-kit/templates/level_3/README.md` | Modified: optional files subsection. |
| `.opencode/skills/system-spec-kit/templates/level_3+/README.md` | Modified: optional files subsection. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified: canonical spec docs + cross-cutting templates + governance. |
| `.opencode/skills/system-spec-kit/README.md` | Modified: template architecture section. |
| `.opencode/skills/system-spec-kit/references/templates/level_specifications.md` | Modified: cross-cutting row + per-level mentions. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Modified: added filename to SPEC_DOCUMENT_FILENAMES. |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` (NEW) | Feature catalog entry. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` (NEW) | Playbook scenario. |
| `CLAUDE.md` | Modified: documentation levels cross-cutting note. |

Commits: `30024e3bed` (fleet marker + validation), `083f74c814` (test playbooks), `b2edaa4cfc` (rename 010 to 009), `79ea13374c` (bulk WIP commit).

### Follow-Ups

- None. The template is discoverable, optional, and ready for Phase 003 deep-loop integration.
