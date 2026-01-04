# Changelog

All notable changes to the **mcp-figma** skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

---

## [**1.0.2.8**] - 2026-01-02

Fixes for broken paths in mcp-figma skill.

#### Fixed
- Duplicate `INSTALL_GUIDE.md` in mcp-figma skill root (deleted)
- 3 broken paths (removed erroneous `/MCP/` from paths)

---

## [**1.0.2.0**] - 2025-12-30

Initial release of mcp-figma skill.

#### Added
- **mcp-figma skill** with 18 tools for Figma integration:
  - File operations (get file, get nodes, get images)
  - Component operations (get components, get component sets)
  - Style operations (get styles, get local styles)
  - Variable operations (get variables, get variable collections)
  - Comment operations (get comments, post comment)
  - Project operations (get project files, get team projects)
  - Version operations (get file versions, get file version)
  - User operations (get me, get team members)
- Tool reference documentation
- Quick start guide
- Tool categories asset

#### Changed
- Standardized RELATED RESOURCES section in SKILL.md
