# Changelog

All notable changes to the mcp-code-mode skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3.2] - 2026-01-05

*Environment version: 1.0.3.2*

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

## [1.0.2.5] - 2026-01-02

*Environment version: 1.0.2.5*

### Security
- **CWE-798 (Hardcoded Credentials)**: Fixed hardcoded `VOYAGE_API_KEY` in `.utcp_config.json` - now uses `${VOYAGE_API_KEY}` variable reference

### Fixed
- Install script generating invalid config with `_note`, `_neural_backends` fields

### Changed
- API key references changed from hardcoded values to `${VOYAGE_API_KEY}` variable syntax

---

## [1.0.2.4] - 2026-01-01

*Environment version: 1.0.2.4*

### Added
- MCP Install Scripts Suite with shared utilities library (33 functions)

### Changed
- 70 files standardized with snake_case naming

---

## [1.0.1.0] - 2025-12-29

*Environment version: 1.0.1.0*

### Changed
- Narsil added to Code Mode examples
- Tool routing updated for Narsil integration

---

## [1.0.0.4] - 2025-12-29

*Environment version: 1.0.0.4*

### Added
- Standardized skill structure

### Changed
- SKILL.md reduced 24% through better organization

### Fixed
- Hardcoded paths replaced with environment variables

---

## [1.0.0.0] - 2025-12-29

*Environment version: 1.0.0.0*

### Added
- Initial skill release
- MCP orchestration via TypeScript execution
- Token-efficient multi-tool workflows
- Type-safe invocation patterns
- Integration with Webflow, Figma, GitHub, ClickUp, Narsil
- 98.7% context reduction vs native MCP calls
- 60% faster execution

---

See [README.md](./README.md) for additional version history.
