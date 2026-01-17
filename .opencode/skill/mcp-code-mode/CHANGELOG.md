# Changelog

All notable changes to the mcp-code-mode skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.3.2] - 2026-01-05

*Environment version: 1.0.3.2*

Embedded MCP server source and prefixed variable documentation for improved portability.

---

### Added

1. **Embedded MCP Server Source** — Code Mode source code now included in `mcp_server/` folder for portability
2. **Prefixed Variable Documentation** — Install guide updated with critical `{manual}_{VAR}` requirement
3. **`.env.example` Template** — New template file with all prefixed variables documented

---

### Changed

1. **Install Guide** — Added "CRITICAL: Prefixed Environment Variables" section
2. **Install Guide** — Updated `.env` template with prefixed versions
3. **Install Guide** — New troubleshooting entry for "Variable not found" errors

---

### Fixed

1. **Documentation Gap** — Code Mode requires prefixed environment variables (e.g., `narsil_VOYAGE_API_KEY`, `figma_FIGMA_API_KEY`)

---

## [1.0.2.5] - 2026-01-02

*Environment version: 1.0.2.5*

Security fix for hardcoded credentials and install script improvements.

---

### Security

1. **CWE-798 (Hardcoded Credentials)** — Fixed hardcoded `VOYAGE_API_KEY` in `.utcp_config.json` - now uses `${VOYAGE_API_KEY}` variable reference

---

### Fixed

1. **Install Script** — Fixed generating invalid config with `_note`, `_neural_backends` fields

---

### Changed

1. **API Key References** — Changed from hardcoded values to `${VOYAGE_API_KEY}` variable syntax

---

## [1.0.2.4] - 2026-01-01

*Environment version: 1.0.2.4*

MCP Install Scripts Suite release with shared utilities library.

---

### Added

1. **MCP Install Scripts Suite** — Shared utilities library with 33 functions

---

### Changed

1. **File Naming** — 70 files standardized with snake_case naming

---

## [1.0.1.0] - 2025-12-29

*Environment version: 1.0.1.0*

Narsil integration for Code Mode examples and tool routing.

---

### Changed

1. **Code Mode Examples** — Narsil added to example patterns
2. **Tool Routing** — Updated for Narsil integration

---

## [1.0.0.4] - 2025-12-29

*Environment version: 1.0.0.4*

Standardized skill structure with reduced SKILL.md size.

---

### Added

1. **Standardized Skill Structure** — Consistent organization across skill components

---

### Changed

1. **SKILL.md** — Reduced 24% through better organization

---

### Fixed

1. **Hardcoded Paths** — Replaced with environment variables

---

## [1.0.0.0] - 2025-12-29

*Environment version: 1.0.0.0*

Initial release of mcp-code-mode skill for MCP orchestration via TypeScript execution.

---

### Added

1. **Initial Skill Release** — MCP orchestration via TypeScript execution
2. **Token-Efficient Workflows** — Multi-tool workflows with 98.7% context reduction vs native MCP calls
3. **Type-Safe Invocation** — Type-safe patterns for tool invocation
4. **Multi-Tool Integration** — Webflow, Figma, GitHub, ClickUp, Narsil support
5. **60% Faster Execution** — Optimized execution pipeline

---

See [README.md](./README.md) for additional version history.
