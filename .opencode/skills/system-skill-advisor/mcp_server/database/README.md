---
title: "Skill Advisor Database: Local Runtime State"
description: "Database folder for the package-local skill graph SQLite state and sidecar files."
trigger_phrases:
  - "skill advisor database"
  - "skill graph sqlite"
---

# Skill Advisor Database: Local Runtime State

<!-- sk-doc-template: skill_readme -->

This folder holds package-local SQLite runtime state for the standalone Skill Advisor MCP server.

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

The default database path is `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. SQLite sidecars such as `-wal` and `-shm` live beside it when the database is active.

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-boundaries -->
## 2. BOUNDARIES

Runtime state belongs to the standalone advisor package. Tests may override the directory with `SYSTEM_SKILL_ADVISOR_DB_DIR`, but operator documentation should treat the package-local path as canonical.

<!-- /ANCHOR:2-boundaries -->

<!-- ANCHOR:3-related-resources -->
## 3. RELATED RESOURCES

- [../../references/db-path-policy.md](../../references/db-path-policy.md)
- [../README.md](../README.md)

<!-- /ANCHOR:3-related-resources -->
