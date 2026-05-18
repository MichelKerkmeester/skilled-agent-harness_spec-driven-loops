---
title: "Skill Graph Library Extraction Status"
description: "Current state and roadmap for lib/skill-graph/ ownership inside system-skill-advisor after migration from system-spec-kit."
trigger_phrases:
  - "skill graph extraction"
  - "lib/skill-graph"
  - "skill graph database"
---

# Skill Graph Library Extraction Status

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

This reference documents the current ownership state of the `lib/skill-graph/` library inside `system-skill-advisor` and explains the documentation drift corrected during the realignment. Extraction from `system-spec-kit` is already complete and no code movement remains.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-current-location -->
## 2. CURRENT LOCATION

The `lib/skill-graph/` library resides inside the advisor skill package:

```text
.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/
```

The directory contains three files:

- `README.md` - Library documentation
- `skill-graph-db.ts` - SQLite schema initialization and indexer writes
- `skill-graph-queries.ts` - Prepared relationship queries

The library owns the SQLite schema, indexing logic and relationship query helpers used by the `skill_graph_*` MCP tools.

---

<!-- /ANCHOR:2-current-location -->

<!-- ANCHOR:3-documentation-drift -->
## 3. DOCUMENTATION DRIFT

Before the realignment, [SKILL.md](../SKILL.md) stated that `lib/skill-graph/` database and query logic remained in `system-spec-kit` until a pending cleanup. That historical claim sat near the bottom of SKILL.md before the realignment delta corrected it.

That statement is outdated. The extraction completed earlier and no `skill-graph` folder exists under `system-spec-kit/mcp_server/lib/`. File search across the spec-kit tree confirms the absence. The pending-cleanup reference is obsolete and was removed during the verified documentation delta. The current [SKILL.md §4 RULES](../SKILL.md) plus §7 INTEGRATION POINTS reflect the post-extraction state.

---

<!-- /ANCHOR:3-documentation-drift -->

<!-- ANCHOR:4-extraction-status -->
## 4. EXTRACTION STATUS

Extraction is complete. `lib/skill-graph/` is fully migrated to `system-skill-advisor/mcp_server/lib/skill-graph/`.

No pending extraction work remains. The old cleanup reference is obsolete and SKILL.md drift is corrected by the realignment delta. Downstream code paths now import the library only from the advisor package.

---

<!-- /ANCHOR:4-extraction-status -->

<!-- ANCHOR:5-roadmap -->
## 5. ROADMAP

The remaining work is purely documentation alignment, not code movement:

- Update [SKILL.md](../SKILL.md) to state that extraction is complete. **Done**: ARCHITECTURE.md §1 plus §9 plus SKILL.md §4 RULES now describe `lib/skill-graph/` as package-local to system-skill-advisor.
- Remove the obsolete pending-cleanup reference from any operator or maintainer docs that still cite it. **Done**: the future-work bullet was removed from ARCHITECTURE.md §9.
- Preserve a migration note where helpful so operators reading historical context understand the prior location.

No further refactor is planned for `lib/skill-graph/` itself. Future ownership changes would be tracked as a separate packet with its own ADR and migration plan.

<!-- /ANCHOR:5-roadmap -->
