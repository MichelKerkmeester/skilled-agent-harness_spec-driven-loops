---
title: "System Skill Advisor Architecture"
description: "Architecture notes for the standalone System Skill Advisor MCP package, legacy advisor_* bridge, and package-local skill graph database."
trigger_phrases:
  - "system skill advisor architecture"
  - "standalone advisor mcp"
  - "legacy advisor tool bridge"
  - "skill graph database path"
---

# System Skill Advisor Architecture

This document records the child 002 architecture envelope for the standalone `system-skill-advisor` package. ADR-001 is the controlling decision: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md`.

---

## 1. OVERVIEW

The target architecture is **Standalone Advisor MCP With Legacy Tool Bridge**.

The advisor becomes its own MCP server process named `system_skill_advisor`, with source, schemas, handlers, tests, docs, and database state owned by `.opencode/skills/system-skill-advisor/`. The public tool ids remain stable as `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`.

Child 002 does not move runtime behavior. It creates the package envelope and reserves the drop target that child 003 fills.

---

## 2. STORAGE LOCATION

The advisor skill graph database moves to:

```text
.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
```

SQLite sidecars live beside it:

```text
.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite-wal
.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite-shm
```

This path is owned by the advisor skill, not by `system-spec-kit/mcp_server`. Tests and disposable CI runs may use `SYSTEM_SKILL_ADVISOR_DB_DIR`; operator docs should treat that override as non-default.

---

## 3. MCP TOPOLOGY

ADR-001 rejects the old co-resident shape where advisor tools run inside `spec_kit_memory`. The final topology is two independent MCP processes:

```text
Runtime clients and hooks
        |
        v
MCP router / client namespace
        |
        +------------------------------+
        |                              |
        v                              v
system_skill_advisor MCP          spec_kit_memory MCP
advisor_recommend                 memory_context
advisor_status                    memory_search
advisor_rebuild                   memory_save
advisor_validate                  code_graph_*
        |                              |
        v                              v
skill-local DB                    memory DB and continuity state
```

During migration, old `advisor_*` calls through `spec_kit_memory` may be temporarily proxied or answered with a deprecation hint. The bridge is a migration window, not the target architecture.

---

## 4. LEGACY TOOL BRIDGE

The bridge keeps public tool ids stable:

| Tool id | Target owner | Compatibility rule |
|---|---|---|
| `advisor_recommend` | `system_skill_advisor` | Stable id, standalone server namespace |
| `advisor_rebuild` | `system_skill_advisor` | Stable id, standalone server namespace |
| `advisor_status` | `system_skill_advisor` | Stable id, standalone server namespace |
| `advisor_validate` | `system_skill_advisor` | Stable id, standalone server namespace |

Existing consumers already name these ids in hook wrappers, plugin bridge code, Python compatibility scripts, doctor workflows, install guides, and tests. Renaming during extraction would create churn without improving isolation. Server-level namespacing supplies the boundary.

---

## 5. MIGRATION SEQUENCE

1. Child 002: author this package envelope.
2. Child 003: move advisor source, tests, database resolver, and fixtures into `mcp_server/`.
3. Child 004: add `skill-advisor-launcher.cjs`, the standalone MCP entrypoint, and runtime config entries.
4. Child 005: cut hooks, plugin bridge, Python shim, doctor workflows, install guides, and consumers over.
5. Child 006: validate, clean stale docs, and remove temporary memory-side proxies.

---

## 6. INVARIANTS

- Only the standalone advisor process writes `skill-graph.sqlite` after cutover.
- `system-spec-kit` remains the spec, memory, and validation skill.
- `advisor_*` names remain public tool ids through the first standalone release.
- The advisor owns its Zod schemas and JSON tool descriptors after child 003.
- Runtime configs are not changed until child 004.
