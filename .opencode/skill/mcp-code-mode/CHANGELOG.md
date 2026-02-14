# Changelog - mcp-code-mode

All notable changes to the mcp-code-mode skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**1.1.0.3**] - 2026-02-07

Script alignment with workflows-code--opencode standards (**Phase 19**).

---

### Changed

1. **update-code-mode.sh** — Shebang changed to `#!/usr/bin/env bash`; strict mode upgraded from `set -e` to `set -euo pipefail`; all variables double-quoted with `${}`; `CODE_MODE_DIR` marked `readonly`; `local` declarations added in functions (`current_version`, `new_version`, `mcp_entry`); `$MCP_ENTRY` inlined in `print_config_reminder` (was referencing variable from different function scope); `REPLY` given default `${REPLY:-}` for `set -u` safety; warning/error messages routed to stderr
2. **validate_config.py** — Module docstring moved directly after header (no blank line separator); `Tuple` added to imports; `_required_env_vars` type hint corrected to `Set[Tuple[str, str]]`; return type hints added to all methods (`-> bool`, `-> None`); Google-style docstrings added to all 12 methods; bare `except Exception` narrowed to `(OSError, UnicodeDecodeError)`; class-level docstring expanded with `Args:` section; `main()` docstring clarified

---

## [**1.1.0.2**] - 2026-02-03

Script comment standardization per workflows-code **code_style_guide.md**.

---

### Changed

1. **update-code-mode.sh** — Added 3-line box-drawing file header
2. **validate_config.py** — Added 3-line box-drawing file header

---

## [**1.1.0.1**] - 2026-01-31

Documentation update to reflect **critical finding** that Code Mode requires **prefixed environment variables**.

---

### Fixed

1. **Documentation: Prefixed Variable Naming** — Updated all documentation to reflect Code Mode's requirement for `{manual_name}_{VAR}` format:
   - `assets/env_template.md` — Added "CRITICAL: Variable Naming Convention" section, updated all examples
   - `assets/config_template.md` — Added prefixed variable warning and examples
   - `references/configuration.md` — Added troubleshooting section for "Variable not found" errors
   - `SKILL.md` — Added "Critical: Prefixed Environment Variables" section
   - `mcp_server/INSTALL_GUIDE.md` — Updated env example with prefixed format

---

### Changed

1. **Environment variable format** — Switched from unprefixed to Code Mode's `{manual}_{VAR}` format:
```bash
# OLD (incorrect for Code Mode)
CLICKUP_API_KEY=pk_xxx
FIGMA_API_KEY=figd_xxx

# NEW (correct for Code Mode)
clickup_CLICKUP_API_KEY=pk_xxx
figma_FIGMA_API_KEY=figd_xxx
```

---

## [**1.0.3.2**] - 2026-01-05

Embeds MCP server source code into skill folder and documents the **prefixed environment variable** requirement.

---

### New

1. **Embedded MCP Server** — Code Mode source embedded in `mcp_server/` directory for portability
2. **Environment Template** — `.env.example` template with Code Mode prefixed variables documented

---

### Changed

1. **Install Guide** — Added "CRITICAL: Prefixed Environment Variables" section to `mcp_server/INSTALL_GUIDE.md`
2. **Troubleshooting** — New entry for "Variable not found" errors explaining prefixed format

---

### Fixed

1. **Documentation Gap** — Code Mode requires `{manual}_{VAR}` format (e.g., `clickup_CLICKUP_API_KEY`)

---

## [**1.0.0.0**] - 2025-12-28

Initial release of mcp-code-mode skill providing **MCP orchestration** via TypeScript execution with **98.7% context reduction** and access to **200+ tools**.

---

### New

1. **TypeScript Execution** — Execute TypeScript code with direct access to 200+ MCP tools
2. **Progressive Discovery** — Tools loaded on-demand via `search_tools()`, `list_tools()`, `tool_info()`
3. **98.7% Context Reduction** — ~1.6k tokens vs ~141k for 47 tools natively
4. **State Persistence** — Data flows naturally between operations in single execution
5. **Multi-Tool Workflows** — Chain Webflow, Figma, ClickUp, Chrome DevTools in single call
6. **MCP Server integrations** — Pre-configured servers:
   - **Webflow** — 40+ tools for sites, collections, pages, CMS items
   - **ClickUp** — 20+ tools for tasks, lists, workspaces
   - **Figma** — 18 tools for files, comments, images, components, styles
   - **Notion** — 20+ tools for pages, databases, blocks
   - **Chrome DevTools** — 26 tools per instance for browser automation
7. **Documentation suite** — Complete reference set:
   - `SKILL.md` — AI agent instructions and workflow guidance
   - `README.md` — User documentation with examples
   - `references/naming_convention.md` — Critical tool naming patterns
   - `references/configuration.md` — Setup guide for .utcp_config.json
   - `references/tool_catalog.md` — Complete tool inventory
   - `assets/config_template.md` — Template configuration file
   - `assets/env_template.md` — Template environment file

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
