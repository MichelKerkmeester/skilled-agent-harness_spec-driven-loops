# Changelog

All notable changes to the mcp-figma skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-12-30

*Environment version: 1.0.2.0*

Initial release of the mcp-figma skill with 18 Figma MCP tools for design file access.

---

### Added

1. **Initial Skill Release** — Figma MCP integration via Code Mode
2. **18 Figma MCP Tools** — Design file access capabilities:
   - File retrieval and document structure
   - Image export (PNG, SVG, PDF)
   - Component and style extraction
   - Team management and project files
   - Collaborative commenting
3. **Code Mode Integration** — Token-efficient workflows for Figma operations
4. **Two-Option Architecture** — Flexible setup options:
   - **Option A**: Official Figma MCP (HTTP, mcp.figma.com) - OAuth login, zero install
   - **Option B**: Framelink (stdio, local) - API key auth, Code Mode integration
5. **Install Guide** — Setup documentation with detailed instructions
6. **Reference Files** — Tool usage patterns and examples

---

### Fixed

1. **Duplicate Install Guide** — Deleted duplicate `INSTALL_GUIDE.md` in skill root
2. **Broken Paths** — Removed 3 paths with erroneous `/MCP/` segments

---

See [SKILL.md](./SKILL.md) for usage documentation.
