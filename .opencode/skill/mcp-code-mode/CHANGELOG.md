# Changelog

All notable changes to the mcp-code-mode skill are documented in this file.

## [1.0.3.2] - 2026-01-05

### Added
- **Embedded MCP server source** - Code Mode source code now included in `mcp_server/` folder for portability
- **Prefixed variable documentation** - Install guide updated with critical `{manual}_{VAR}` requirement
- **`.env.example` template** - New template file with all prefixed variables documented

### Changed
- Install guide: Added "CRITICAL: Prefixed Environment Variables" section
- Install guide: Updated `.env` template with prefixed versions
- Install guide: New troubleshooting entry for "Variable not found" errors

### Fixed
- Documentation gap: Code Mode requires prefixed environment variables (e.g., `narsil_VOYAGE_API_KEY`, `figma_FIGMA_API_KEY`)

---

See [README.md](./README.md) for additional version history.
