# Changelog

All notable changes to the workflows-documentation skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.2.0] - 2026-01-14

### Added
- Unified markdown and OpenCode component specialist
- Document quality enforcement (structure, style validation)
- Content optimization for AI assistants
- OpenCode component creation workflows (skills, agents, commands)
- Scaffolding, validation, and packaging for components
- ASCII flowchart creation for visualizing complex workflows
- Install guide creation for MCP servers, plugins, and tools
- README and frontmatter templates
- DQI (Document Quality Index) scoring system

---

## [5.1.0] - 2026-01-02

*Environment version: 1.0.2.8*

### Changed
- **Asset folder reorganization** for improved discoverability:
  - `assets/components/` → `assets/opencode/` (OpenCode component templates)
  - `assets/documents/` → `assets/documentation/` (document templates)
- 250+ path references updated across 35+ files
- New organizational principle established:
  - `references/` = FLAT (no subfolders) for simpler AI agent discovery
  - `assets/` = Subfolders ALLOWED for grouping related templates
  - `scripts/` = Typically flat, subfolders OK for large collections
- `skill_md_template.md` updated with "Folder Organization Principle" section
- `skill_creation.md` updated with folder guidance

---

## [5.0.0] - 2025-12-30

*Environment version: 1.0.1.7*

### Added
- `/create:agent` command with 5-phase workflow for agent creation
- `agent_template.md` for consistent agent structure

### Changed
- All MCP install guides now include detailed H1 descriptions
- `command_template.md` reduced 27% by removing duplication

---

## [4.0.0] - 2025-12-29

*Environment version: 1.0.0.6*

### Added
- HARD BLOCK section for write agent enforcement
- Prompt prefix requirement for skill creation
- Prerequisite check validation
- Validation command for skill creation

---

## [3.0.0] - 2025-12-29

*Environment version: 1.0.0.5*

### Added
- Skill creation requires `@write` agent prefix
- HARD BLOCK enforcement for write agent
- Prompt prefix and prerequisite checks

### Changed
- Quick Reference updated with CDN deployment workflow
- Quick Reference updated with JS minification workflow

---

## [2.0.0] - 2025-12-29

*Environment version: 1.0.0.4*

### Added
- Skill Creation guide with required templates and file locations
- Skill Advisor configuration documentation

### Changed
- Standardized structure across all skills (69 files total)
- SKILL.md reduced 24% through better organization

### Fixed
- Hardcoded paths throughout
- Broken anchor links

---

## [1.0.0] - 2025-12-29

*Environment version: 1.0.0.0*

### Added
- Initial skill release
- Document quality pipeline with structure enforcement
- Markdown validation and content optimization
- Template system for README, frontmatter, and install guides
- llms.txt generation for LLM navigation

---

See [SKILL.md](./SKILL.md) for usage documentation.
