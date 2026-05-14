---
title: "System Skill Advisor: Feature Catalog"
description: "Initial scaffold for the standalone System Skill Advisor feature catalog. Full population moves from the legacy source tree in child 003."
trigger_phrases:
  - "system skill advisor feature catalog"
  - "advisor feature catalog"
  - "advisor_recommend catalog"
---

# System Skill Advisor: Feature Catalog

This is the initial scaffold for the standalone `system-skill-advisor` feature catalog. Full population happens in child 003 when the advisor source, tests, feature catalog, and playbook move from `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. MCP SURFACE](#2--mcp-surface)
- [3. FUTURE POPULATION](#3--future-population)

---

## 1. OVERVIEW

Initial scaffold, full population in child 003.

The legacy source catalog currently contains daemon freshness, auto-indexing, lifecycle routing, scorer fusion, MCP surface, hooks/plugin, and Python compatibility groups. This scaffold mirrors one real MCP surface entry so discovery has a concrete package-local feature anchor without duplicating all legacy content before the runtime move.

---

## 2. MCP SURFACE

| Feature | File | Current state |
|---|---|---|
| `advisor_recommend` MCP tool | [06--mcp-surface/01-advisor-recommend.md](./06--mcp-surface/01-advisor-recommend.md) | Mirrored scaffold entry; implementation moves in child 003 |

---

## 3. FUTURE POPULATION

Child 003 moves or rehomes the complete legacy catalog from:

```text
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/feature_catalog/
```

Expected groups after full population:

- `01--daemon-and-freshness`
- `02--auto-indexing`
- `03--lifecycle-routing`
- `04--scorer-fusion`
- `06--mcp-surface`
- `07--hooks-and-plugin`
- `08--python-compat`
