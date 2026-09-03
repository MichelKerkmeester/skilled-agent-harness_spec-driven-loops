---
title: "Iteration 5: Adopt vs Build — Verdict Analysis"
trigger_phrases: []
---
# Iteration 5: Adopt vs Build — Verdict Analysis

## Focus
Weigh the thin transport pattern (mcp-figma/mcp-mobbin) against the full skill pattern (mcp-obsidian) and the light workflow pattern (mcp-click-up), using the parity mapping from iteration 4 to determine which pattern best serves mcp-notion.

## Findings

### F5.1 — Three patterns in the mcp-tooling hub

The mode-registry.json reveals three distinct patterns:

| Pattern | Example modes | packetKind | mutatesWorkspace | Knowledge layer | Backend |
|---|---|---|---|---|---|
| **Thin transport** | mcp-figma, mcp-refero, mcp-mobbin | `transport` | `false` | None — bridges to external tool | figma-desktop-transport / code-mode-remote-mcp |
| **Light workflow** | mcp-click-up | `workflow` | `true` | Moderate — domain conventions (markdown formatting), operation routing | cli-plus-mcp (CLI primary, MCP fallback) |
| **Full skill** | mcp-obsidian | `workflow` | `true` | Deep — 11 plugin file formats with data models, workflows, troubleshooting | cli-plus-mcp (3 surfaces: headless CLI, app CLI, MCP) |

[SOURCE: .claude/skills/mcp-tooling/mode-registry.json] [SOURCE: .claude/skills/mcp-tooling/mcp-click-up/SKILL.md]

### F5.2 — Why thin transport (adopt) is insufficient for mcp-notion

The thin transport pattern is **read-only** (`mutatesWorkspace: false`, `forbidden: ["Write", "Edit", "Task"]`). It bridges to an external tool without mutating this workspace. This pattern fits mcp-figma (drive Figma Desktop) and mcp-refero/mcp-mobbin (search remote design references) because those modes consume external content without creating local artifacts.

mcp-notion **must mutate the workspace** — it creates pages, manages databases, appends content, and manages properties. It is a **workflow mode**, not a transport. The transport pattern is architecturally wrong for mcp-notion regardless of the MCP tool coverage.

Additionally:
- The 5 tooling gaps (file uploads, views, property items, async tasks, daily notes) require direct API calls beyond the MCP — a thin transport cannot make direct API calls
- The Notion knowledge layer (22 property types, relations, rollups, formulas) needs encoding — a thin transport has no knowledge layer
- Rate limit handling (3 r/s) needs doctrine — a thin transport has no troubleshooting/install guidance

**Verdict: thin transport (adopt) is rejected.**

### F5.3 — Why full skill (mcp-obsidian pattern) is more than needed

The full skill pattern (mcp-obsidian) has 11 plugin file-format knowledge domains, each with a 4-file reference set (index, data-model, workflows, troubleshooting) — 44 reference files total. This depth is justified because Obsidian has a rich plugin ecosystem where file formats matter (Beancount ledgers, Dataview queries, Excalidraw drawings, etc.).

Notion has **no plugin ecosystem**. The parity mapping (iteration 4, F4.5) showed 6 of 11 plugin domains are structurally non-applicable (BRAT, Iconic, Charts, Excalidraw, Git, Minimal). Only 3 need analogue encoding (Beancount→databases, Health.md→databases+files, Dataview→query-data-source) and 2 are already covered (Tables→databases, Outliner→blocks).

Building 44 reference files for a non-existent plugin ecosystem would be over-engineering. The Notion knowledge layer is about the **database/property model** (22 property types, schemas, relations, rollups, formulas, API versioning, rate limits) — not about third-party plugins.

**Verdict: full mcp-obsidian-level skill is more than needed.**

### F5.4 — Light workflow (mcp-click-up pattern) is the right fit

The light workflow pattern (mcp-click-up) is the Goldilocks zone for mcp-notion:

| Dimension | mcp-click-up | mcp-notion (proposed) |
|---|---|---|
| packetKind | `workflow` | `workflow` |
| mutatesWorkspace | `true` | `true` |
| Backend | cli-plus-mcp (CLI primary, MCP fallback) | **code-mode-remote-mcp** (MCP primary, direct API for gaps) |
| Knowledge layer | Moderate (markdown formatting contract, operation routing) | Moderate (22 property types, database schemas, rate limits, API versioning) |
| Surfaces | 2 (cupt CLI + official MCP) | 2 (official MCP + direct API for 5 gap endpoints) |
| Reference files | 3 (cupt-commands, mcp-tools, troubleshooting) | ~4-5 (mcp-tools, api-gap-tools, property-types, troubleshooting, install-guide) |

mcp-notion would be:
- `packetKind: "workflow"` — it mutates the workspace (creates pages, manages databases)
- `backendKind: "code-mode-remote-mcp"` — the official Notion MCP via Code Mode is the primary surface; direct API calls fill the 5 tooling gaps
- A Notion knowledge layer covering: 22 property types, database/data-source schemas, relations/rollups/formulas, API version pinning (2025-09-03 vs 2026-03-11), rate limit handling (3 r/s with Retry-After)
- Install + troubleshooting doctrine (NOTION_TOKEN setup, Code Mode registration, rate limit recovery, deprecation-migration guidance)

### F5.5 — Deprecation risk strengthens the build case

The open-source local MCP server is being deprecated in favor of the remote Notion MCP at `https://mcp.notion.com/mcp` (iteration 1, F1.4). The remote server uses:
- **OAuth** (not API tokens) — fundamentally different auth
- **Different tool names** (`notion-create-pages`, `notion-update-page`, `notion-fetch`, etc.) — not the same `create-a-page` / `retrieve-a-page` naming
- **Additional capabilities** (multi-page creation, view queries, cross-tool search with Notion AI)

A thin transport tightly couples to one backend's tool names and auth model. A **light workflow skill can abstract the backend**: the knowledge layer (property types, database schemas, rate limits) is backend-agnostic, and the tool-routing layer can switch from the local stdio server to the remote OAuth server when the operator is ready.

**This is the strongest argument for build over adopt**: the deprecation risk is mitigated by a skill that can migrate backends, while a thin transport would need to be rewritten when the local server is sunset.

### F5.6 — Proposed mcp-notion mode architecture

```
mcp-notion/
  SKILL.md                    — routing, invariants, operation-to-tool table
  README.md                   — overview
  INSTALL-GUIDE.md            — NOTION_TOKEN setup, Code Mode registration, .env
  mode-registry entry         — workflowMode: "mcp-notion", packetKind: "workflow"
  changelog/
  references/
    mcp-tools.md              — official Notion MCP 24-tool catalog + Code Mode invocation
    api-gap-tools.md          — direct API calls for 5 gap endpoints (file uploads, views, property items, async tasks, daily notes)
    property-types.md         — 22 property types, schemas, configurations, page property values
    database-model.md         — databases vs data sources, relations, rollups, formulas
    troubleshooting.md        — rate limits, auth errors, deprecation migration
```

### F5.7 — Preliminary verdict: BUILD (light workflow, not full skill)

**Adopt-vs-build verdict: BUILD** — but as a **light workflow mode** (mcp-click-up pattern), not a full skill (mcp-obsidian pattern).

Rationale:
1. mcp-notion must mutate the workspace → `packetKind: "workflow"`, not `transport`
2. 5 tooling gaps require direct API calls beyond the MCP → needs a multi-surface skill
3. The Notion knowledge layer (22 property types, database schemas, rate limits, API versioning) needs encoding → needs reference docs
4. Deprecation risk requires backend abstraction → a skill can migrate from local stdio to remote OAuth; a thin transport cannot
5. But Notion has no plugin ecosystem → the 11-plugin-depth of mcp-obsidian is unnecessary
6. The light workflow pattern (mcp-click-up) is the right complexity level

## Sources Consulted
- .claude/skills/mcp-tooling/mode-registry.json (all 7 modes, packetKind/backendKind classification)
- .claude/skills/mcp-tooling/mcp-click-up/SKILL.md (light workflow pattern reference)
- .claude/skills/mcp-tooling/mcp-obsidian/SKILL.md (full skill pattern reference)
- Iteration 4 findings (parity mapping, structural vs tooling gaps)
- Iteration 1 findings (deprecation risk)

## Assessment
- **newInfoRatio: 0.70** — The three-pattern analysis and the verdict are net-new synthesis. Some overlap with prior iterations' gap analysis, but the pattern comparison and deprecation-risk argument are new.
- **Novelty justification**: First comparative analysis of all three mcp-tooling patterns applied to mcp-notion; the deprecation-risk-as-build-argument is a new analytical lens.
- **Confidence**: High — based on the mode-registry.json classification and cross-referencing 4 iterations of findings.

## Reflection
- **What worked**: Reading the mode-registry.json revealed the three-pattern taxonomy that maps cleanly to the adopt-vs-build spectrum. The mcp-click-up middle ground was the key insight.
- **What failed**: Nothing significant.
- **Ruled out**: **Thin transport (adopt) pattern** — architecturally wrong for a workspace-mutating mode. **Full mcp-obsidian-level skill** — over-engineered for a plugin-less platform.

## Recommended Next Focus
Iteration 6: Notion knowledge layer — databases, data sources, and the 22 property types with their schemas and configurations. This is the core knowledge the mode must encode, analogous to mcp-obsidian's plugin file-layer doctrine.
