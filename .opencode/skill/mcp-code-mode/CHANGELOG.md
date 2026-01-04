# Changelog

All notable changes to the **mcp-code-mode** skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

---

## [**1.0.2.5**] - 2026-01-02

Security fix for hardcoded API key exposure.

#### Security
- **CWE-798 (Hardcoded Credentials)**: Fixed hardcoded `VOYAGE_API_KEY` in `.utcp_config.json` - now uses `${VOYAGE_API_KEY}` variable reference loaded from `.env`

#### Changed
- API key references changed from hardcoded values to `${VOYAGE_API_KEY}` variable syntax

---

## [**1.0.0.5**] - 2025-12-29

Added Narsil to Code Mode examples.

#### Changed
- Quick Reference updated with Narsil examples via Code Mode

---

## [**1.0.0.4**] - 2025-12-29

Skill standardization release.

#### Added
- Standard reference files for skill structure

#### Changed
- Standardized RELATED RESOURCES section in SKILL.md

#### Fixed
- Hardcoded paths throughout skill
- Broken anchor links

---

## [**1.0.0.0**] - 2025-12-29

First official release of the mcp-code-mode skill.

#### Added
- **Code Mode**: MCP orchestration for external tool access
- Access to external tools via `.utcp_config.json`:
  - Narsil (code intelligence)
  - GitHub (API integration)
  - Figma (design files)
  - ClickUp (project management)
  - Chrome DevTools (browser debugging)
- Configuration and workflow references
- Tool catalog documentation
