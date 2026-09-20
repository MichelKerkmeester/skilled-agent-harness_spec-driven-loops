---
title: "Iteration 4: Parity Mapping — mcp-obsidian → Notion MCP"
trigger_phrases: []
---
# Iteration 4: Parity Mapping — mcp-obsidian → Notion MCP

## Focus
Map each mcp-obsidian capability to a Notion-MCP equivalent. Classify gaps as **structural** (architecturally impossible to fill — cloud vs filesystem, no plugin ecosystem) or **tooling** (fillable with custom tools, direct API calls, or knowledge-layer encoding).

## Findings

### F4.1 — Core CRUD parity: mostly covered, with three partial gaps

| Obsidian capability | Notion MCP equivalent | Coverage | Gap type |
|---|---|---|---|
| Open/read a note | `retrieve-a-page` / `retrieve-page-markdown` | ✅ Full | — |
| Create a note | `create-a-page` | ✅ Full | — |
| Update note content | `update-page-markdown` / `append-block-children` / `update-a-block` | ✅ Full | — |
| Move/rename a note | `move-page` + `update-page-properties` (title) | ✅ Full | — |
| Delete a note | `archive-a-page` (soft delete only) | ⚠️ Partial | **Tooling** — no hard delete in API; archive is the Notion-native model |
| List notes | `search` (no query = all shared pages) | ✅ Full | — |
| Structured read | `retrieve-a-page` (JSON) | ✅ Full | — |
| Structured write | `create-a-page` / `update-page-properties` | ✅ Full | — |

The core CRUD surface is well-covered. The only gap is hard delete — Notion's model is archive-only, which is a design choice, not a missing feature.

### F4.2 — Search parity: title-only search is a significant gap

| Obsidian capability | Notion MCP equivalent | Coverage | Gap type |
|---|---|---|---|
| Search by note name | `search` (title search) | ✅ Full | — |
| Full-text content search | `search` (title only) + `query-data-source` (database rows) | ⚠️ Partial | **Structural** — Notion's search API is title-only; no full-text content search endpoint exists |
| Global/semantic search | `search` | ⚠️ Partial | **Structural** — no semantic search in the API; remote Notion MCP with Notion AI extends to connected tools (Slack, Drive, Jira) but that's the remote server, not the open-source one |
| List all notes | `search` (empty query) | ✅ Full | — |

**This is a structural gap**: Obsidian's `search-content` does full-text search across all note bodies. Notion's `search` only matches page/data-source titles. To search page content, you must retrieve each page and search client-side — impractical at scale due to the 3 r/s rate limit. The remote Notion MCP with Notion AI may offer better search, but the open-source local server does not.

### F4.3 — Tags and frontmatter: different model, not a gap

| Obsidian capability | Notion MCP equivalent | Coverage | Gap type |
|---|---|---|---|
| Tag management | `update-page-properties` (multi_select property) | ✅ Full (different model) | — |
| Frontmatter editing | `update-page-properties` (page properties) | ✅ Full (different model) | — |
| Daily note | `create-a-page` (with date title convention) | ⚠️ Partial | **Tooling** — no native daily-note concept; implement as a convention (page in a "Daily Notes" database with date-formatted title) |

Obsidian's YAML frontmatter maps to Notion's page properties. Tags map to multi_select properties. The model is different (schema-based properties vs freeform YAML) but the capability is equivalent. Daily notes require a convention but are implementable.

### F4.4 — Multi-surface architecture: structural gap (cloud vs filesystem)

| Obsidian surface | Notion equivalent | Gap type |
|---|---|---|
| Headless CLI (filesystem) | **None** — Notion is cloud-only | **Structural** — cannot operate offline or on local files |
| App-backed CLI (local app control) | **None** — no local Notion app CLI | **Structural** — Notion has no local app to remote-control |
| MCP (structured API) | Official Notion MCP (24 tools) | ✅ Covered |

**This is the most fundamental structural difference**: mcp-obsidian's headless CLI operates directly on the vault filesystem — no API, no auth, no network. Notion is a cloud service; every operation requires an API call with authentication. This means:

1. mcp-notion cannot have a headless/filesystem surface
2. mcp-notion is limited to a single surface: the MCP/API
3. Offline operation is impossible
4. Rate limits (3 r/s) constrain all operations

This doesn't mean mcp-notion can't reach parity — it means the parity model must be adapted: the "multi-surface" dimension collapses to a single surface (MCP/API), but the knowledge-layer dimension can still be rich.

### F4.5 — Knowledge layer: 11 Obsidian plugins mapped to Notion equivalents

| Obsidian plugin | Notion equivalent | Coverage | Gap type |
|---|---|---|---|
| **Beancount Finance** | Databases with number/currency properties + formulas | ⚠️ Analogue | **Knowledge** — Notion databases can track finance but no BQL query language; formula property covers calculations |
| **Obsidian Tables** | Databases (native table views) | ✅ Full | — — databases ARE Notion's table format |
| **BRAT (beta plugins)** | n/a — no plugin ecosystem | 🔴 Structural | No equivalent needed — Notion has no third-party plugins |
| **Health.md** | Databases + file uploads for health data | ⚠️ Analogue | **Knowledge + Tooling** — needs file upload (not in MCP) + custom chart rendering (no chart block API) |
| **Iconic (icon rules)** | n/a — no file-icon automation | 🔴 Structural | No equivalent needed |
| **Charts** | No native chart blocks in API | 🔴 Structural | Notion UI has charts but the API doesn't expose chart block creation |
| **Dataview (DQL)** | `query-data-source` (filters/sorts) + formula properties | ⚠️ Partial | **Knowledge** — database queries cover filtered/sorted retrieval, but no DataviewJS (arbitrary JS) or inline-field querying across pages |
| **Excalidraw (drawings)** | No drawing block API | 🔴 Structural | Notion UI supports embedded drawings but API doesn't expose them |
| **Obsidian Git** | n/a — cloud service, no git | 🔴 Structural | No equivalent needed — Notion handles persistence |
| **Outliner (list editing)** | Block operations (append/update/delete blocks) | ✅ Full | — — Notion's block model handles lists natively |
| **Minimal (CSS theme)** | n/a — no theme API | 🔴 Structural | No equivalent needed |

**Summary**: 2 full coverage (Tables, Outliner), 3 analogues needing knowledge encoding (Beancount, Health.md, Dataview), 6 structural non-applicable (BRAT, Iconic, Charts, Excalidraw, Git, Minimal).

### F4.6 — Tooling gaps: fillable with direct API calls or custom tools

| Gap | API endpoint exists? | Fillable? | How |
|---|---|---|---|
| File uploads | ✅ 5 endpoints | **Yes** | Direct API calls (create-file, upload-file, complete-file-upload, retrieve, list) |
| Views management | ✅ 6+ endpoints | **Yes** | Direct API calls (create-view, list-views, retrieve, update, delete, query) |
| Page property items | ✅ 1 endpoint | **Yes** | Direct API call (retrieve-a-page-property) |
| Async task polling | ✅ 1 endpoint | **Yes** | Direct API call (retrieve-an-async-task) |
| Daily notes convention | n/a | **Yes** | Knowledge-layer convention (date-titled pages in a database) |

These 5 gaps are all **tooling gaps** — the Notion API has the endpoints; the MCP server just doesn't expose them. A custom CLI or direct API integration can fill them.

### F4.7 — Structural gaps: cannot be filled

| Gap | Why structural | Impact on parity |
|---|---|---|
| Headless/filesystem operation | Notion is cloud-only | High — no offline operation, no filesystem access |
| Full-text content search | API search is title-only | Medium — must retrieve pages to search content (rate-limited) |
| Hard delete | API only supports archive | Low — archive is the Notion-native model |
| Chart/drawing blocks | API doesn't expose these block types | Low — these are UI-only features |
| Plugin ecosystem | Notion has no third-party plugins | None — no equivalent needed |
| Theme customization | No theme API | None — no equivalent needed |

## Sources Consulted
- Iteration 1 findings (Notion MCP 24-tool inventory)
- Iteration 2 findings (Notion API 15 domains, rate limits, property types)
- Iteration 3 findings (mcp-obsidian 3 surfaces, 15 ops, 11 plugins)
- .claude/skills/mcp-tooling/mcp-obsidian/SKILL.md (operation-to-tool routing table)

## Assessment
- **newInfoRatio: 0.75** — The parity mapping is a synthesis of prior findings into a new analytical framework. The gap classification (structural vs tooling) and the capability-by-capability mapping are net-new analysis.
- **Novelty justification**: First systematic parity mapping with gap classification; the structural vs tooling distinction is a new analytical lens.
- **Confidence**: High — based on cross-referencing three iterations of documented findings.

## Reflection
- **What worked**: Synthesizing prior findings into a structured parity table revealed clear patterns: CRUD is covered, search is structurally limited, the knowledge layer splits into analogues vs non-applicable.
- **What failed**: Nothing significant.
- **Ruled out**: **Hard delete as a requirement** — Notion's archive model is the native pattern; pursuing hard delete would be fighting the platform. **Headless filesystem operation** — architecturally impossible for a cloud service.

## Recommended Next Focus
Iteration 5: Adopt vs build analysis — weigh the thin transport pattern (mcp-figma/mcp-mobbin) against the full skill pattern (mcp-obsidian), using the parity mapping to determine whether the 24 MCP tools + 5 tooling gaps + knowledge layer are best served by adopt or build.
