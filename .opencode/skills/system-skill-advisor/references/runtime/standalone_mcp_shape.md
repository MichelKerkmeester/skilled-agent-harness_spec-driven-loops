---
title: "Standalone MCP Shape"
description: "Summary of ADR-001 standalone System Skill Advisor MCP topology and migration boundary."
trigger_phrases:
  - "standalone advisor mcp shape"
  - "mk_skill_advisor topology"
  - "advisor mcp server boundary"
importance_tier: "normal"
contextType: "implementation"
---

# Standalone MCP Shape

Summary of ADR-001 standalone System Skill Advisor MCP topology and migration boundary.

---

## 1. OVERVIEW

### Purpose

Documents the standalone `mk_skill_advisor` MCP topology chosen by ADR-001 and the ownership boundary between advisor routing and adjacent Spec Kit runtimes.

### When to Use

- Confirming which package owns advisor MCP tools, schemas, handlers, scorer code, and skill-graph persistence.
- Checking whether a proposed cleanup crosses from documentation/navigation into runtime migration.
- Explaining why memory and advisor processes must not share database write ownership.

### Core Principle

Advisor routing is a standalone MCP process boundary; documentation can point across packages, but runtime ownership stays inside `system-skill-advisor`.

### Key Sources

- `mcp_server/advisor-server.ts`
- [`legacy_tool_bridge.md`](./legacy_tool_bridge.md)
- [`tool_ids_reference.md`](./tool_ids_reference.md)

---

## 2. DECISION

ADR-001 chooses a standalone MCP server named `mk_skill_advisor`.

The server owns:

- Advisor MCP descriptors.
- Zod input/output schemas.
- Tool handlers.
- Scorer and projection code.
- Skill graph database path resolution.
- Advisor tests, fixtures, playbook and feature catalog.

---

## 3. BOUNDARY

The standalone boundary is a process boundary, not only a folder move.

```text
mk_skill_advisor -> advisor tools and skill graph DB
mk-spec-memory      -> memory, continuity and spec-kit tools
```

The memory MCP server may keep a temporary bridge for legacy `advisor_*` calls during migration. It must not remain the long-term owner of advisor implementation modules or database writes.

---

## 4. CHILD PACKET OWNERSHIP

| Packet | Responsibility |
|---|---|
| 002 | Envelope only |
| 003 | Source, tests, DB path move |
| 004 | Launcher and runtime config |
| 005 | Hooks and consumer cutover |
| 006 | Cleanup and bridge removal |
