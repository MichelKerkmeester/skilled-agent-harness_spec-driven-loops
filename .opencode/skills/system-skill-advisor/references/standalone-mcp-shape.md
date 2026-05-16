---
title: "Standalone MCP Shape"
description: "Summary of ADR-001 standalone System Skill Advisor MCP topology and migration boundary."
trigger_phrases:
  - "standalone advisor mcp shape"
  - "mk_skill_advisor topology"
  - "advisor mcp server boundary"
---

# Standalone MCP Shape

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-decision -->
## 1. DECISION

ADR-001 chooses a standalone MCP server named `mk_skill_advisor`.

The server owns:

- Advisor MCP descriptors.
- Zod input/output schemas.
- Tool handlers.
- Scorer and projection code.
- Skill graph database path resolution.
- Advisor tests, fixtures, playbook and feature catalog.

---

<!-- /ANCHOR:1-decision -->

<!-- ANCHOR:2-boundary -->
## 2. BOUNDARY

The standalone boundary is a process boundary, not only a folder move.

```text
mk_skill_advisor -> advisor tools and skill graph DB
mk-spec-memory      -> memory, continuity and spec-kit tools
```

The memory MCP server may keep a temporary bridge for legacy `advisor_*` calls during migration. It must not remain the long-term owner of advisor implementation modules or database writes.

---

<!-- /ANCHOR:2-boundary -->

<!-- ANCHOR:3-child-packet-ownership -->
## 3. CHILD PACKET OWNERSHIP

| Packet | Responsibility |
|---|---|
| 002 | Envelope only |
| 003 | Source, tests, DB path move |
| 004 | Launcher and runtime config |
| 005 | Hooks and consumer cutover |
| 006 | Cleanup and bridge removal |

<!-- /ANCHOR:3-child-packet-ownership -->
