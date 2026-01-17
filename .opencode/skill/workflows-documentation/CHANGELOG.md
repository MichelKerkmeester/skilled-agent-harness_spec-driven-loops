# Changelog

All notable changes to the workflows-documentation skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.1.0] - 2026-01-02

*Environment version: 1.0.2.8*

Asset folder reorganization for improved discoverability.

---

### Changed

1. **Asset Folder Reorganization** — Improved discoverability:
   - `assets/components/` → `assets/opencode/` (OpenCode component templates)
   - `assets/documents/` → `assets/documentation/` (document templates)
2. **Path References Updated** — 250+ path references updated across 35+ files
3. **Organizational Principle Established** — New folder structure guidance:
   - `references/` = FLAT (no subfolders) for simpler AI agent discovery
   - `assets/` = Subfolders ALLOWED for grouping related templates
   - `scripts/` = Typically flat, subfolders OK for large collections
4. **`skill_md_template.md` Updated** — Added "Folder Organization Principle" section
5. **`skill_creation.md` Updated** — Added folder guidance

---

## [5.0.0] - 2025-12-30

*Environment version: 1.0.1.7*

Agent creation workflow and install guide improvements.

---

### Added

1. **`/create:agent` Command** — 5-phase workflow for agent creation
2. **`agent_template.md`** — Consistent agent structure template

---

### Changed

1. **MCP Install Guides** — All now include detailed H1 descriptions
2. **`command_template.md`** — Reduced 27% by removing duplication

---

## [4.0.0] - 2025-12-29

*Environment version: 1.0.0.6*

Write agent enforcement and skill creation validation.

---

### Added

1. **HARD BLOCK Section** — Write agent enforcement
2. **Prompt Prefix Requirement** — Skill creation requirement
3. **Prerequisite Check Validation** — Pre-creation validation
4. **Validation Command** — Skill creation validation

---

## [3.0.0] - 2025-12-29

*Environment version: 1.0.0.5*

Write agent requirements and workflow updates.

---

### Added

1. **Skill Creation Requirement** — Requires `@write` agent prefix
2. **HARD BLOCK Enforcement** — Write agent enforcement
3. **Prompt Prefix and Prerequisite Checks** — Validation checks

---

### Changed

1. **Quick Reference** — Updated with CDN deployment workflow
2. **Quick Reference** — Updated with JS minification workflow

---

## [2.0.0] - 2025-12-29

*Environment version: 1.0.0.4*

Skill creation guide and standardization.

---

### Added

1. **Skill Creation Guide** — Required templates and file locations
2. **Skill Advisor Configuration** — Documentation

---

### Changed

1. **Standardized Structure** — 69 files total across all skills
2. **SKILL.md** — Reduced 24% through better organization

---

### Fixed

1. **Hardcoded Paths** — Replaced throughout
2. **Broken Anchor Links** — Fixed

---

## [1.0.0] - 2025-12-29

*Environment version: 1.0.0.0*

Initial release of workflows-documentation skill.

---

### Added

1. **Initial Skill Release** — Document quality pipeline with structure enforcement
2. **Markdown Validation** — Content optimization for AI assistants
3. **Template System** — README, frontmatter, and install guide templates
4. **llms.txt Generation** — LLM navigation support

---

See [SKILL.md](./SKILL.md) for usage documentation.
