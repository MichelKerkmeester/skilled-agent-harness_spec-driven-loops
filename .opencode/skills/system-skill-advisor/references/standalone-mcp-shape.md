---
title: "Standalone MCP Shape"
description: "Summary of ADR-001 standalone System Skill Advisor MCP topology and migration boundary."
trigger_phrases:
  - "standalone advisor mcp shape"
  - "system_skill_advisor topology"
  - "advisor mcp server boundary"
---

# Standalone MCP Shape

---

## 1. DECISION

ADR-001 chooses a standalone MCP server named `system_skill_advisor`.

The server owns:

- Advisor MCP descriptors.
- Zod input/output schemas.
- Tool handlers.
- Scorer and projection code.
- Skill graph database path resolution.
- Advisor tests, fixtures, playbook, and feature catalog.

---

## 2. BOUNDARY

The standalone boundary is a process boundary, not only a folder move.

```text
system_skill_advisor -> advisor tools and skill graph DB
spec_kit_memory      -> memory, continuity, and spec-kit tools
```

The memory MCP server may keep a temporary bridge for legacy `advisor_*` calls during migration. It must not remain the long-term owner of advisor implementation modules or database writes.

---

## 3. CHILD PACKET OWNERSHIP

| Packet | Responsibility |
|---|---|
| 002 | Envelope only |
| 003 | Source, tests, DB path move |
| 004 | Launcher and runtime config |
| 005 | Hooks and consumer cutover |
| 006 | Cleanup and bridge removal |
