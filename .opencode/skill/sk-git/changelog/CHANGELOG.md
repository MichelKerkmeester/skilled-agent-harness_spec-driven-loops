# sk-git Changelog

All notable changes to the sk-git skill are documented here.

---

## 1.0.10.0 — 2026-02-28

**Restructured SKILL.md to comply with sk-doc template standards.**

### Changed
- Reordered sections to match 8-section template: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES, SUCCESS CRITERIA, INTEGRATION POINTS, RELATED RESOURCES
- Merged Workspace Choice Enforcement and Skill Selection Decision Tree into HOW IT WORKS
- Merged Integration Examples into RELATED RESOURCES
- Added missing opening `<!-- ANCHOR:when-to-use -->` marker
- Updated RESOURCE_MAP to include `github_mcp_integration.md` in FINISH intent
- Removed table of contents from README.md (forbidden by sk-doc standards)
- Added `github_mcp_integration.md` to README structure tree

### Added
- `references/github_mcp_integration.md` — extracted from SKILL.md Section 7 (GitHub MCP Integration)

### Metrics
- SKILL.md: 692 lines → 478 lines, 3170 words → 2311 words, 12 sections → 8 sections

---

## 1.0.9.0 — 2026-02-24

**Added deterministic AI commit-message logic.**

### Changed
- Added deterministic AI commit-message logic in SKILL.md (type/scope inference, summary normalization)
- Updated `references/commit_workflows.md` with first-match type/scope inference and summary normalization
- Updated `assets/commit_message_template.md` with AI-specific priority logic
- Updated README.md with changelog folder and feature note

---
