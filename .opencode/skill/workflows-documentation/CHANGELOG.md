# Changelog

All notable changes to the **workflows-documentation** skill are documented in this file.
Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [**1.0.3.1**] - 2026-01-05

OpenCode v1.1.1 compatibility update for agent templates.

#### Changed
- `agent_template.md`: Migrated from deprecated `tools:` to unified `permission:` format
- Added granular pattern-based permissions documentation
- Added deprecation note for old format
- Updated validation checklist for v1.1.1 compliance

---

## [**1.0.2.8**] - 2026-01-02

Major asset folder restructure for improved discoverability.

#### Changed
- `assets/components/` → `assets/opencode/` (OpenCode component templates: skills, agents, commands)
- `assets/documents/` → `assets/documentation/` (document templates: README, install guides, frontmatter)
- 250+ path references updated across: `SKILL.md` · 7 reference files · 9 asset files · `AGENTS.md` · `write.md` agent · 7 command files · 2 install guides
- New organizational principle established and documented:
  - `references/` = FLAT (no subfolders) for simpler AI agent discovery
  - `assets/` = Subfolders ALLOWED for grouping related templates
  - `scripts/` = Typically flat, subfolders OK for large collections
- `skill_md_template.md` updated with "Folder Organization Principle" section
- `skill_creation.md` updated with folder guidance in anatomy and quick reference sections

---

## [**1.0.1.7**] - 2025-12-30

New `/create:agent` command and install guide improvements.

#### Added
- `/create:agent` command with 5-phase workflow for agent creation
- `agent_template.md` for consistent agent structure

#### Changed
- All MCP install guides now include detailed H1 descriptions
- `command_template.md` reduced 27% by removing duplication

---

## [**1.0.1.4**] - 2025-12-29

Skill creation guide added.

#### Added
- Skill Creation guide with required templates and file locations

---

## [**1.0.0.6**] - 2025-12-29

Write agent enforcement for /create commands.

#### Added
- HARD BLOCK section for write agent enforcement
- Prompt prefix requirement
- Prerequisite check validation
- Validation command for skill creation

---

## [**1.0.0.5**] - 2025-12-29

Multi-layer write agent enforcement.

#### Added
- Skill creation requires `@write` agent prefix
- HARD BLOCK enforcement for write agent
- Prompt prefix and prerequisite checks

---

## [**1.0.0.4**] - 2025-12-29

Skill standardization and new references.

#### Added
- `execution_methods` reference
- `folder_structure` reference

#### Changed
- Standardized RELATED RESOURCES section in SKILL.md
- SKILL.md reduced 24% through better organization

#### Fixed
- Hardcoded paths throughout skill
- Broken anchor links

---

## [**1.0.0.0**] - 2025-12-29

First official release of the workflows-documentation skill.

#### Added
- **Documentation Workflow Orchestrator**: Unified markdown and OpenCode component specialist
- Document quality enforcement (structure, style)
- Content optimization for AI assistants
- Complete component creation workflows:
  - Skills (with scaffolding, validation, packaging)
  - Agents
  - Commands
- ASCII flowchart creation for visualizing complex workflows
- Install guide creation for MCP servers, plugins, and tools
- Templates:
  - `skill_md_template.md`
  - `skill_asset_template.md`
  - `skill_reference_template.md`
  - `command_template.md`
  - `agent_template.md`
  - `readme_template.md`
  - `install_guide_template.md`
  - `frontmatter_templates.md`
  - `llmstxt_templates.md`
- References:
  - Core standards
  - Validation rules
  - Optimization guide
  - Workflows
  - Quick reference
  - Skill creation guide
  - Install guide standards
