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

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. BOUNDARIES](#2--boundaries)
- [3. KEY FILES](#3--key-files)
- [4. VALIDATION](#4--validation)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

The default database path is `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. SQLite sidecars such as `-wal` and `-shm`, launcher lease files and duplicate generated JSON fallbacks live beside it when the database is active, but they are ignored runtime state.

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-boundaries -->
## 2. BOUNDARIES

Runtime state belongs to the standalone advisor package. Tests may override the directory with `MK_SKILL_ADVISOR_DB_DIR`; `SYSTEM_SKILL_ADVISOR_DB_DIR` remains a legacy fallback. Operator documentation should treat the package-local path as canonical.

The tracked JSON fallback remains `../scripts/skill-graph.json`. Do not commit duplicates from this directory.

<!-- /ANCHOR:2-boundaries -->

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `skill-graph.sqlite` | Ignored runtime SQLite skill graph. |
| `skill-graph.sqlite-wal` / `skill-graph.sqlite-shm` | Ignored SQLite sidecars while the DB is active. |
| `.mk-skill-advisor-launcher.json` | Ignored launcher lease state. |
| `skill-graph.json` | Ignored duplicate runtime JSON. Use `../scripts/skill-graph.json` for the tracked fallback. |
| `.gitignore` | Keeps runtime DB and lease files out of git. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-validation -->
## 4. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --health
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/database/README.md
```

<!-- /ANCHOR:4-validation -->

---

<!-- ANCHOR:5-related-resources -->
## 5. RELATED RESOURCES

- [../../references/config/db_path_policy.md](../../references/config/db_path_policy.md)
- [../README.md](../README.md)

<!-- /ANCHOR:5-related-resources -->
