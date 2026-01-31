# Changelog - workflows-documentation

All notable changes to the workflows-documentation skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**1.0.3.4**] - 2026-01-14

Validation improvements for skill packaging.

---

### Changed

1. **package_skill.py** — Added SMART ROUTING and REFERENCES section validation
2. **Resource Router** — Fixed mode numbering (6 duplicates → 4 unique)
3. **init_skill.py** — Added REFERENCES section to template

---

## [**1.0.2.8**] - 2026-01-02

Major asset folder reorganization for improved discoverability.

---

### Changed

1. **Asset Folders Renamed**:
   - `assets/components/` → `assets/opencode/` (OpenCode component templates: skills, agents, commands)
   - `assets/documents/` → `assets/documentation/` (document templates: README, install guides, frontmatter)
2. **250+ Path References Updated** — Across SKILL.md, 7 reference files, 9 asset files, AGENTS.md, write.md agent, 7 command files, 2 install guides

---

### New

1. **Folder Organization Principle** — Added to templates:
   - `references/` = FLAT (no subfolders) for simpler AI agent discovery
   - `assets/` = Subfolders ALLOWED for grouping related templates
   - `scripts/` = Typically flat, subfolders OK for large collections

---

## [**1.0.0.0**] - 2025-12-20

Initial release of workflows-documentation skill for DQI-compliant documentation.

---

### Features

1. **Document Quality Index (DQI)** — Validation system for documentation:
   - Structure validation (headers, sections, ordering)
   - Style validation (emoji vocabulary, formatting)
   - Content validation (completeness, accuracy)

2. **Component Creation Workflows**:
   - **Skills** — Complete skill folder scaffolding and packaging
   - **Agents** — Agent file creation with frontmatter
   - **Commands** — Command file creation with workflows
   - **Install Guides** — Step-by-step installation documentation

3. **ASCII Flowcharts** — Visualization for complex workflows

4. **Template Library**:
   - Skill templates (SKILL.md, README.md)
   - Agent templates with permission blocks
   - Command templates with phase structure
   - Documentation templates (README, install guides)

### Documentation

- `SKILL.md` — AI agent instructions with DQI enforcement
- `README.md` — User documentation with template reference
- `references/` — Style guides and validation rules
- `assets/opencode/` — OpenCode component templates
- `assets/documentation/` — Document templates

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
