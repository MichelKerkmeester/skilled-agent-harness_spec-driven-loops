---
title: "System Skill Advisor DB Path Policy"
description: "Policy for the package-local skill graph SQLite database path required by ADR-001 constraint A."
trigger_phrases:
  - "system skill advisor db path"
  - "skill-graph.sqlite advisor path"
  - "advisor database policy"
---

# System Skill Advisor DB Path Policy

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

This policy fixes the current runtime location for the advisor's package-local SQLite skill graph database and its sidecar files.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:1-policy -->
## 2. POLICY

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

<!-- /ANCHOR:1-policy -->

<!-- ANCHOR:2-rationale -->
## 3. RATIONALE

ADR-001 constraint A requires DB-local ownership for the extracted advisor. The database is the advisor's runtime state, so it belongs with the skill that reads, writes, validates and rebuilds it.

This separation gives cleaner mutation scope:

- `/doctor:update` and future repair flows can reason per skill package.
- The advisor MCP server can be the single writer for `skill-graph.sqlite`.
- `system-spec-kit` keeps memory and spec packet state without owning advisor runtime data.
- Backups, cleanup and integrity checks can target the advisor package directly.

---

<!-- /ANCHOR:2-rationale -->

<!-- ANCHOR:3-test-and-ci-override -->
## 4. TEST AND CI OVERRIDE

`MK_SKILL_ADVISOR_DB_DIR` is allowed for tests and disposable CI runs only. `SYSTEM_SKILL_ADVISOR_DB_DIR` remains a legacy fallback for existing scripts.

Production and operator docs should treat the package-local path as the default. A runtime override must not be used to silently re-collocate the advisor DB with `system-spec-kit/mcp_server/database/`.

---

<!-- /ANCHOR:3-test-and-ci-override -->

<!-- ANCHOR:4-migration-notes -->
## 5. MIGRATION NOTES

Current package state keeps the database under `mcp_server/database/` and exposes it through the standalone `mk_skill_advisor` MCP server.

The `skill_graph_*` handlers and the lower-level `lib/skill-graph/` database/query library are advisor-owned and package-local.

<!-- /ANCHOR:4-migration-notes -->
