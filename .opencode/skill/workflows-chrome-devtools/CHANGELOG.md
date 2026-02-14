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

### New

1. **Screenshot capture** — Visual comparison capabilities
2. **Network monitoring** — Request interception
3. **Console log access** — JavaScript execution
4. **Cookie manipulation** — Storage access
5. **Unix pipe composability** — Terminal automation

---

## [**2.0.0**] - 2025-12-27

Initial release as enhanced Chrome DevTools orchestrator.

---

### New

1. **Dual Execution Modes** — CLI (bdg): Browser DevTools Gateway for fast, token-efficient operations; MCP: Chrome DevTools MCP for complex multi-tool workflows

2. **Browser Automation Tools** — Navigation and page control, element interaction and form filling, screenshot capture at various scales, network request monitoring, console log access, cookie and storage manipulation

3. **Resource Routing** — Intelligent selection between CLI and MCP based on task type

4. **`SKILL.md`** — AI agent instructions with routing logic
5. **`README.md`** — User documentation with usage examples
6. **`references/session_management.md`** — Browser session lifecycle
7. **`references/cdp_patterns.md`** — Chrome DevTools Protocol patterns
8. **`assets/checklists/`** — Verification checklists

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
