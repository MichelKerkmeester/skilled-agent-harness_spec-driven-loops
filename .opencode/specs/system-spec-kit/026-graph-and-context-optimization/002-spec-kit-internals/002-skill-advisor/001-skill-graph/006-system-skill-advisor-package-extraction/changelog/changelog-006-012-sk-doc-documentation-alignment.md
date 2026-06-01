---
title: "Advisor doc alignment with sk-doc [006/012]"
description: "Aligned 120 system-skill-advisor docs with sk-doc templates. Rewrote ARCHITECTURE.md to post-013/009 state. Updated the root README advisor section. Corrected stale tool counts, lane weights, and regression-count wording across the skill tree."
trigger_phrases:
  - "advisor doc alignment sk-doc"
  - "system-skill-advisor architecture rewrite"
  - "skill advisor documentation alignment"
  - "sk-doc template traces advisor"
  - "advisor stale wording fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/012-sk-doc-documentation-alignment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The `system-skill-advisor` package had accumulated stale documentation through earlier extraction packets. Claims about the old advisor path, an outdated four-tool count, old lane weight values, and inaccurate regression-pass totals were spread across the feature catalog, manual testing playbook, references, and skill-root docs.

A mechanical Markdown pass aligned 120 advisor docs with `sk-doc` template expectations: anchors were added or balanced, template traces were inserted, and content discrepancies were corrected. `ARCHITECTURE.md` was fully rewritten to describe the current post-013/009 standalone MCP surface with eight public tools. The public root `README.md` advisor section was updated to name `system_skill_advisor`, list the eight tools, and note the pending packet-011 `lib/skill-graph/` library boundary. Commit scope was kept strictly doc-only, excluding source files and packet-011 staged additions.

### Added

- Template trace markers and section anchors across 120 advisor Markdown docs
- Level 2 packet docs and metadata for packet 012

### Changed

- `ARCHITECTURE.md` rewritten to describe the standalone `system_skill_advisor` MCP server with eight public tools and current data-flow boundaries
- Skill-root docs (`SKILL.md`, `README.md`, `INSTALL_GUIDE.md`) updated to reflect post-013/009 advisor state
- Feature catalog (37 docs) corrected for stale tool-count claims, old advisor path references, and lane weight values
- Manual testing playbook (43 docs) normalized for regression-count wording and anchor presence
- Root `README.md` advisor section updated with standalone server name, tool table, FAQ entry, and related links

### Fixed

- Old four-tool advisor claim replaced with the correct eight-tool count across scoped docs
- Stale advisor path references removed from feature catalog and playbook docs
- Incorrect fixed regression-pass totals replaced with data-dependent wording

### Verification

| Check | Result |
|-------|--------|
| Metadata JSON | PASS: `metadata json ok` |
| Scoped anchor balance | PASS: `scoped anchor balance ok (121 docs)` |
| Frontmatter and template trace | PASS for 120 advisor docs in packet 012 scope |
| Stale wording scan | PASS for old advisor path, old four-tool wording, fixed regression counts, and semantic-lock wording |
| Markdown lint | Not available: `markdownlint` not installed. Structural checks and spot checks used instead. |
| Advisor regression harness | NON-BLOCKING: current checked-in dataset run returned non-zero. Recorded as doc discrepancy evidence only. |
| Strict validation | PASS: packet 012 strict validation exits 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Full rewrite to current post-013/009 architecture. Covers overview, boundaries, components, data flow, DB ownership, MCP surface, extension points, testing, and future work. |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Updated to standalone server name, eight-tool surface, and package-local DB ownership. |
| `.opencode/skills/system-skill-advisor/README.md` | Updated tool table, usage section, and related-links for post-013/009 state. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Updated install steps to reflect merged SET-UP_GUIDE content and standalone launcher path. |
| `.opencode/skills/system-skill-advisor/feature_catalog/**` (37 docs) | Template traces and corrected current-state claims. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/**` (43 docs) | Anchors, template traces, and normalized regression wording. |
| `.opencode/skills/system-skill-advisor/references/**` (3 docs) | Anchors, template traces, and updated package boundary wording. |
| `README.md` | Public advisor section updated with standalone server, eight tools, FAQ, and related links. |

### Follow-Ups

- Update `opencode.json` stale environment note that says `system_skill_advisor` registers four tools. Config edits are outside packet 012 scope.
- Complete packet-011 to finalize the `mcp_server/lib/skill-graph/` library boundary and remove the transitional note from `ARCHITECTURE.md`.
- Resolve advisor regression harness failures against existing expected ids once runtime changes land.
