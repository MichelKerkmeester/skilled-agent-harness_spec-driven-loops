# Changelog

All notable changes to the mcp-figma skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-30

*Environment version: 1.0.2.0*

### Added
- Initial skill release
- 18 Figma MCP tools for design file access:
  - File retrieval and document structure
  - Image export (PNG, SVG, PDF)
  - Component and style extraction
  - Team management and project files
  - Collaborative commenting
- Code Mode integration for token-efficient workflows
- Two-option architecture:
  - **Option A**: Official Figma MCP (HTTP, mcp.figma.com) - OAuth login, zero install
  - **Option B**: Framelink (stdio, local) - API key auth, Code Mode integration
- Install guide with setup documentation
- Reference files for tool usage patterns

### Fixed
- Duplicate `INSTALL_GUIDE.md` in skill root (deleted)
- 3 broken paths with erroneous `/MCP/` segments removed

---

See [SKILL.md](./SKILL.md) for usage documentation.
