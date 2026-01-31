# Changelog - workflows-chrome-devtools

All notable changes to the workflows-chrome-devtools skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**2.1.0**] - 2026-01-14

Enhanced orchestrator with intelligent routing between CLI and MCP approaches.

---

### Changed

1. **CLI-First Approach** — Browser DevTools Gateway (bdg) prioritized for speed and token efficiency
2. **MCP Fallback** — Chrome DevTools MCP for multi-tool integration scenarios
3. **Fixed References** — Corrected section references in `session_management.md` and `cdp_patterns.md`

---

### Features

- Screenshot capture and visual comparison
- Network monitoring and request interception
- Console log access and JavaScript execution
- Cookie manipulation and storage access
- Unix pipe composability for terminal automation

---

## [**2.0.0**] - 2025-12-27

Initial release as enhanced Chrome DevTools orchestrator.

---

### Features

1. **Dual Execution Modes**:
   - **CLI (bdg)** — Browser DevTools Gateway for fast, token-efficient operations
   - **MCP** — Chrome DevTools MCP for complex multi-tool workflows

2. **Browser Automation Tools**:
   - Navigation and page control
   - Element interaction and form filling
   - Screenshot capture at various scales
   - Network request monitoring
   - Console log access
   - Cookie and storage manipulation

3. **Resource Routing** — Intelligent selection between CLI and MCP based on task type

### Documentation

- `SKILL.md` — AI agent instructions with routing logic
- `README.md` — User documentation with usage examples
- `references/session_management.md` — Browser session lifecycle
- `references/cdp_patterns.md` — Chrome DevTools Protocol patterns
- `assets/automation_checklist.md` — Verification checklist

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
