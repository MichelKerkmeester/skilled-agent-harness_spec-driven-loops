# Changelog - mcp-figma

All notable changes to the mcp-figma skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**1.1.0.1**] - 2026-01-31

Documentation update to reflect **critical finding** that Code Mode requires **prefixed environment variables**.

---

### Fixed

1. **Documentation: Prefixed Variable Naming** — Updated all documentation to reflect Code Mode's requirement for `{manual_name}_{VAR}` format:
   - `INSTALL_GUIDE.md` — Added prefixed variable callout in Code Mode Integration section, updated troubleshooting
   - `README.md` — Updated Environment Variables section with prefixed format, fixed troubleshooting
   - `SKILL.md` — Updated Figma Provider Configuration section with critical prefixed variable warning

---

### Changed

**Environment Variable Format for Code Mode:**
```bash
# OLD (incorrect for Code Mode)
FIGMA_API_KEY=figd_xxx

# NEW (correct for Code Mode)
figma_FIGMA_API_KEY=figd_xxx
```

---

## [**1.0.2.8**] - 2026-01-02

Path fixes and duplicate file cleanup.

---

### Fixed

1. **Duplicate File** — Deleted duplicate `INSTALL_GUIDE.md` in skill root
2. **Broken Paths** — Fixed 3 broken paths (removed erroneous `/MCP/` from paths)

---

## [**1.0.2.0**] - 2025-12-30

Initial release of mcp-figma skill for design-to-code workflows.

---

### New

1. **18 Figma Tools** — Complete access to Figma's design platform:
   - **File Management** — `get_file`, `get_file_nodes`, `set_api_key`, `check_api_key`
   - **Image Export** — `get_image`, `get_image_fills` (PNG, SVG, PDF, JPG)
   - **Components** — `get_file_components`, `get_component`, `get_team_components`, `get_team_component_sets`
   - **Styles** — `get_file_styles`, `get_style`, `get_team_styles`
   - **Team/Projects** — `get_team_projects`, `get_project_files`
   - **Comments** — `get_comments`, `post_comment`, `delete_comment`

2. **Two Installation Options** — Option A (Official): HTTP remote server at `mcp.figma.com/mcp` with OAuth; Option B (Framelink): Local stdio via `figma-developer-mcp` package

3. **Code Mode Integration** — Token-efficient access via `call_tool_chain()`

4. **`SKILL.md`** — AI agent instructions with activation triggers and workflow guidance
5. **`README.md`** — User documentation with tool reference and examples
6. **`INSTALL_GUIDE.md`** — Complete installation for both options
7. **`references/tool_reference.md`** — All 18 tools with parameter documentation
8. **`references/quick_start.md`** — 5-minute getting started guide
9. **`assets/tool_categories.md`** — HIGH/MEDIUM/LOW tool prioritization

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
