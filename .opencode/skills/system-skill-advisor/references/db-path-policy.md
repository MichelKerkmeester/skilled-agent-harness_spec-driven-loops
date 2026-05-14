---
title: "System Skill Advisor DB Path Policy"
description: "Policy for the package-local skill graph SQLite database path required by ADR-001 constraint A."
trigger_phrases:
  - "system skill advisor db path"
  - "skill-graph.sqlite advisor path"
  - "advisor database policy"
---

# System Skill Advisor DB Path Policy

---

## 1. POLICY

The advisor database lives inside the standalone advisor skill package:

```text
.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
```

It must not live under:

```text
.opencode/skills/system-spec-kit/mcp_server/database/
```

SQLite sidecars stay beside the database file:

```text
skill-graph.sqlite-wal
skill-graph.sqlite-shm
```

---

## 2. RATIONALE

ADR-001 constraint A requires DB-local ownership for the extracted advisor. The database is the advisor's runtime state, so it belongs with the skill that reads, writes, validates, and rebuilds it.

This separation gives cleaner mutation scope:

- `/doctor:update` and future repair flows can reason per skill package.
- The advisor MCP server can be the single writer for `skill-graph.sqlite`.
- `system-spec-kit` keeps memory and spec packet state without owning advisor runtime data.
- Backups, cleanup, and integrity checks can target the advisor package directly.

---

## 3. TEST AND CI OVERRIDE

`SYSTEM_SKILL_ADVISOR_DB_DIR` is allowed for tests and disposable CI runs only.

Production and operator docs should treat the package-local path as the default. A runtime override must not be used to silently re-collocate the advisor DB with `system-spec-kit/mcp_server/database/`.

---

## 4. MIGRATION NOTES

Child 002 documents this policy and reserves `mcp_server/database/`.

Child 003 moves the DB resolver and runtime ownership into this package.

Child 004 wires the standalone launcher and runtime configs.
