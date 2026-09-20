---
title: "Deep Research Synthesis: mcp-notion adopt-vs-build verdict"
description: "Salvaged synthesis of a completed 10-iteration deep-research run (glm-5-2 via cli-devin, no early convergence): the official Notion MCP covers all CRUD via 24 tools but leaves 5 fillable tooling gaps and needs a Notion knowledge layer, so the verdict is BUILD mcp-notion as a light workflow mode (mcp-click-up pattern) with dual-backend routing."
trigger_phrases:
  - "mcp-notion research verdict"
  - "notion mcp build vs adopt"
  - "notion mcp 24 tools gap matrix"
  - "notion dual backend local remote"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Deep Research Synthesis: mcp-notion adopt-vs-build verdict

<!-- SPECKIT_LEVEL: 2 -->

> **Provenance.** This synthesis is salvaged from a run that completed **all 10 iterations** (glm-5-2 via cli-devin, `--stop-policy max-iterations`, no early convergence) in the `glm` lineage. The run's automatic synthesis step was skipped because a post-loop write-containment guard fataled the lineage after the devin leaf wrote out-of-scope hook READMEs (reverted, no repo residue). Iteration content is intact at `lineages/glm/iterations/iteration-001.md`…`iteration-010.md` (66 findings, 30+ sources); this file consolidates them.

---

## 1. VERDICT

**BUILD** — author `mcp-notion` as a **light workflow mode** on the `mcp-click-up` pattern. Not a thin transport (the `mcp-figma`/`mcp-mobbin` pattern) and not a full 11-plugin skill (the `mcp-obsidian` pattern).

Confidence: **High** — 10 iterations, 6/6 research questions resolved, verdict grounded in a documented gap matrix.

---

## 2. WHY NOT THE OTHER TWO PATTERNS

- **Not a thin transport.** `mcp-notion` mutates the workspace (creates pages, manages data sources, appends content) → `packetKind: "workflow"`, `mutatesWorkspace: true`. And 5 needed capabilities require **direct Notion API calls beyond the MCP** — a thin transport cannot make those. It must also route between two backends, which a transport cannot abstract.
- **Not a full skill.** Notion has **no third-party plugin ecosystem**, so `mcp-obsidian`'s 11-plugin file-layer depth is unnecessary — 6 of its 11 plugin domains are structurally non-applicable.

---

## 3. CAPABILITY MAP — OFFICIAL NOTION MCP

The official server is **`@notionhq/notion-mcp-server` v2.5.1, 24 tools** (not the ~18 my earlier surface estimate suggested), across 6 domains: pages (7), blocks (5), databases/data-sources (6), comments (2), users (3), search (1). Notion API **2.0.0 migrated to data sources** as the primary abstraction (replacing "databases"); markdown round-trip tools require API `2026-03-11`; most tools pin `2025-09-03`.

### Gap matrix

| Capability | MCP covers? | Gap type | Resolution |
|---|---|---|---|
| Page CRUD (7), Block CRUD (5), Data-source mgmt (6), Comments (2), Users (3), Page-markdown round-trip (2) | ✅ | — | No gap |
| Search | ✅ 1 tool | Structural | Title-only; no full-text content search |
| File uploads | ❌ (5 API endpoints exist) | Tooling | Direct API calls |
| Views | ❌ (6+ endpoints) | Tooling | Direct API calls |
| Page property items (non-truncated) | ❌ (1 endpoint) | Tooling | Direct API call |
| Async tasks (poll) | ❌ local / ✅ remote | Tooling | Direct API call or remote MCP |
| Daily notes | ❌ | Tooling | Knowledge-layer convention |
| Hard delete / headless FS / full-text search / chart+drawing blocks / plugins | ❌ | Structural | Inherent platform differences — no fix needed |

**Summary:** 0 uncovered CRUD operations · 5 tooling gaps (all fillable with direct API calls) · 7 structural gaps (inherent, mostly non-applicable).

---

## 4. THE DUAL-BACKEND FINDING (affects registration)

Notion is **deprecating the open-source local server** and prioritizing the **remote MCP at `https://mcp.notion.com/mcp`** (Streamable HTTP + OAuth). The two backends split cleanly by runtime:

| Backend | Transport / auth | Headless? | Tool names | Use when |
|---|---|---|---|---|
| **Local stdio** (deprecated) | `npx @notionhq/notion-mcp-server`, `NOTION_TOKEN` | **Yes** | `create-a-page`, `retrieve-a-page`, … | Headless / Code Mode |
| **Remote** (recommended) | `mcp.notion.com`, OAuth | No (interactive only) | `notion-create-pages`, … + async tasks | Interactive with browser |

**Implication for what we registered:** the manual I added to `.utcp_config.json` targets the **local stdio server** — which is correct, because Code Mode is headless and the remote OAuth server **cannot run headless**. The local server being deprecated is a known risk to encode, not a wrong choice: the mode should route to remote when interactive+OAuth is available and fall back to local stdio for headless, per §6.

---

## 5. THE KNOWLEDGE LAYER THE MODE MUST ENCODE

Three pillars (from iterations 6–7): the **database → data-source → page hierarchy**; **22 property types** with schema/value/filter/sort semantics; and the **relational/computed model** — relations (single/dual), rollups (14 functions), and **Formulas 2.0** (~50 functions). Plus operational doctrine: **rate limits** (3 req/s per integration, `Retry-After` backoff+jitter) and **per-operation API-version pinning** (`2025-09-03` vs `2026-03-11`).

---

## 6. PROPOSED ARCHITECTURE

```
mcp-notion/
  SKILL.md            — routing, invariants, operation-to-tool table, smart router
  README.md           — overview + install summary
  INSTALL-GUIDE.md    — NOTION_TOKEN, Code Mode registration, .env, dual-backend config
  changelog/
  references/
    mcp-tools.md      — 24-tool catalog + Code Mode invocation
    api-gap-tools.md  — direct API calls for the 5 gap endpoints
    property-types.md — 22 property types, schema/value/filter/sort
    database-model.md — hierarchy, relations, rollups (14 fns), Formulas 2.0
    troubleshooting.md— rate limits, auth, version, deprecation migration
```

Mode-registry entry: `workflowMode: "mcp-notion"`, `packetKind: "workflow"`, `mutatesWorkspace: true`, tool surface `[Read, Write, Edit, Bash, Glob, Grep, mcp__code_mode__call_tool_chain]`. Smart-router backend selection: interactive+OAuth → remote MCP; else headless+`NOTION_TOKEN` → local stdio + direct API for the 5 gaps; else escalate to INSTALL-GUIDE.

---

## 7. MIGRATION TIE-IN (packet 015)

`mcp-notion` is the **read-side inventory enabler** for the Notion→Obsidian migration researched in `015`: the same knowledge layer that operates a live Notion workspace also reads its structure (data sources, relations, rollups, formulas) to drive an Obsidian import. Build once, serve both.

---

## 8. RESEARCH QUESTIONS — ALL RESOLVED

| Question | Answer |
|---|---|
| Capability map | 24 tools, 6 domains covered, 9 uncovered (5 fillable, 4 structural) |
| Parity vs mcp-obsidian | 3 surfaces / 15 ops / 11 plugins in obsidian; headless is impossible for Notion (cloud-only) |
| Adopt vs build | **BUILD** as a light workflow mode |
| Knowledge layer | 3 pillars: hierarchy, 22 property types, relational/computed model |
| Auth + runtime | 3 token types, 2 backends, dual-backend routing, 3 req/s rate limit |
| Migration tie-in | Read-side inventory enabler; shared knowledge layer |

**Ruled out (5):** hard delete, headless filesystem, thin transport, full skill, remote-only.

---

## 9. COMPLETENESS

- Iterations: 10/10 (forced-depth) · Questions: 6/6 · Findings: 66 · Sources: 30+ · Ruled-out: 5
- Executor: cli-devin · Model: glm-5-2 (GLM-5.2 High) · Stop policy: max-iterations (no early convergence)
- Per-iteration evidence: `lineages/glm/iterations/iteration-001.md`…`iteration-010.md`; registry: `lineages/glm/findings-registry.json`
