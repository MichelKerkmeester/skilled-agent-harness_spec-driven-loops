---
title: "Changelog: mcp-click-up — ClickUp Skill via cupt CLI + Official MCP [124-mcp-click-up-task-management/root]"
description: "Chronological changelog for the mcp-click-up — ClickUp Skill via cupt CLI + Official MCP spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/099-mcp-click-up-task-management` (Level 3)

### Summary

The mcp-click-up skill gives AI agents a structured, safe interface to ClickUp. Unlike ad-hoc tool usage, this skill provides:

### Added

- Create skill directory structure (.opencode/skills/mcp-click-up/ + subdirs)
- Create playbook phases 01-05 with 16 test markdown files

### Changed

- Write scripts/install.sh — pipx→pip cupt install + Python check + MCP config snippet
- Write graph-metadata.json — skill_id, family, intent_signals, edges
- Write SKILL.md — 8 sections with routing pseudocode and operation table
- Write README.md — overview, quick start (5 steps), CLI vs MCP feature table
- Write INSTALL_GUIDE.md — AI-first install block, cupt + MCP sections, validation gates
- Write references/cupt_commands.md — all commands, --json variants, agent invariants

### Fixed

- CHK-FIX-001 No existing files modified — all changes are additive

### Verification

- validate.sh --strict - PASSED (exit 0)
- skill_advisor.py "clickup task management" - mcp-click-up, confidence 0.95
- shellcheck install.sh - PASSED (exit 0)
- Skill in registry - YES
- All P0 checklist items - PASSED
- All P1 checklist items - PASSED
- P0 - CHK-001 spec.md exists with no [NEEDS CLARIFICATION] markers (EVIDENCE: spec.md written and complete)
- P0 - CHK-002 plan.md exists with technical approach documented (EVIDENCE: plan.md has operation table, file map, and phase structure)

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- cupt team filter performance — Client-side filter is slow on large workspaces (5-20s). Documented in references/cupt_commands.md and troubleshooting.md.
- cupt community tool — Not maintained by ClickUp officially. Future versions may break. Version not pinned in install.sh (installs latest); pin if stability required.
- MCP requires Node.js/npx — Not auto-installed by install.sh. User must have Node.js installed separately.
- Official MCP config — User must manually add config snippet to opencode.json; install.sh prints but does not apply it.
