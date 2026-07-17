---
title: "Resource Map Template: Cross-Cutting Template Creation and Discovery Wiring"
description: "Promoted the one-off path-references-audit artifact to a reusable level-agnostic template and wired it into all discovery surfaces in one coordinated pass."
trigger_phrases:
  - "resource map template creation"
  - "cross-cutting path catalog template"
  - "resource-map.md template wiring"
  - "level-agnostic file path ledger"
  - "spec-doc-paths resource-map"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/002-resource-map-template-creation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix`

### Summary

Reviewers and successor phases had no quick way to answer "what files did this packet touch" without reading `implementation-summary.md` end to end or diffing git. A prior one-off artifact in the 005/path-references-audit proved the value of a flat categorized path ledger but was never promoted to a reusable shape.

This phase promoted that shape to a first-class optional cross-cutting template. The template now lives at the templates root alongside handover, research, debug-delegation. It stays optional at every level so no existing spec folder is retroactively broken. It is also discoverable from every README, SKILL surface, reference guide, feature catalog, playbook that operators typically read when starting a new packet. A single constant edit in the MCP spec-doc classifier (`SPEC_DOCUMENT_FILENAMES`) ensures memory save and discovery treat the new filename as a canonical spec document.

### Added

- New template file `templates/resource-map.md` with frontmatter, Summary block with count placeholders, Action/Status vocabulary note, plus ten category sections: READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta.
- Feature catalog entry `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` (now at `22--context-preservation/resource-map-template.md` after later renaming).
- Manual testing playbook entry `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` (now at `22--context-preservation/resource-map-template.md` after later renaming).

### Changed

- `mcp_server/lib/config/spec-doc-paths.ts`: appended `resource-map.md` to `SPEC_DOCUMENT_FILENAMES` so the MCP classifier recognizes the new filename.
- `templates/README.md`: new Structure table row, Workflow Notes, and Related section for the template.
- Level READMEs for 1, 2, 3, and 3+: Optional Files subsection added mentioning the template.
- `SKILL.md`: canonical spec docs list, cross-cutting templates section, and distributed governance note updated.
- `README.md` (skill root): template architecture section updated.
- `references/templates/level_specifications.md`: cross-cutting templates row and per-level optional files blocks added.
- `CLAUDE.md`: Documentation Levels cross-cutting note updated.

### Fixed

- No bugs fixed. This was an additive feature with no behavior change.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` inside `mcp_server/` | PASS (exit 0) |
| Grep audit of 12 discovery surfaces for the new filename | PASS (hit count at least 1 in every target file) |
| Template file smoke read: frontmatter complete, ten category sections present | PASS |
| `validate.sh --strict` post-refactor | PASS (after Level 2 shape alignment of packet docs) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/templates/resource-map.md` (NEW) | Created | The cross-cutting template with ten category sections. |
| `.opencode/skills/system-spec-kit/templates/README.md` | Modified | Structure row, Workflow Notes, Related section. |
| `.opencode/skills/system-spec-kit/templates/level_1/README.md` | Modified | Optional Files subsection. |
| `.opencode/skills/system-spec-kit/templates/level_2/README.md` | Modified | Optional Files subsection. |
| `.opencode/skills/system-spec-kit/templates/level_3/README.md` | Modified | Optional Files subsection. |
| `.opencode/skills/system-spec-kit/templates/level_3+/README.md` | Modified | Optional Files subsection. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Canonical spec docs, cross-cutting templates, governance. |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Template architecture section. |
| `.opencode/skills/system-spec-kit/references/templates/level_specifications.md` | Modified | Cross-cutting row and per-level mentions. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Modified | Appended filename to `SPEC_DOCUMENT_FILENAMES`. |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` (NEW) | Created | Feature catalog entry. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` (NEW) | Created | Playbook scenario. |
| `CLAUDE.md` | Modified | Documentation Levels cross-cutting note. |

### Follow-Ups

- Add an optional `resource-map-emit.sh` helper that scans `git diff` for a packet and emits a draft of the file so authors do not fill path rows by hand.
- Backfill the template into high-traffic spec folders during their next touch.
