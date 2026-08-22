# Iteration 1: mcp-notion-reads / mcp-obsidian-writes Division of Labor — Inventory and Import Steps

## Focus
Map every migration step (inventory, import, reconstruction, verification) to the exact mcp-notion or mcp-obsidian tool surface that performs it.

## Findings

### F1.1 — Inventory Phase: mcp-notion owns all reads

The pre-flight inventory requires enumerating every Notion page, database/data source, property, relation, rollup, formula, view, comment, and file. The 24 mcp-notion tools cover every read operation needed:

| Inventory item | mcp-notion tool | Notes |
|---|---|---|
| List all pages by title | `search` | Title-only search — no full-text content search |
| Retrieve page content (body) | `retrieve-page-markdown` | Token-efficient; returns full Markdown body |
| Retrieve page metadata/properties | `retrieve-a-page` | Properties only; 25-item truncation on relation/people/rich_text fields |
| List database data sources | `retrieve-a-database` | Returns container metadata + data source IDs |
| Get data source schema | `retrieve-a-data-source` | Returns property definitions, types, and options |
| Query rows | `query-data-source` | Filter + sort + pagination; retrieves all rows |
| List comments | `list-comments` | Per-page unresolved comments list |
| List views | Direct API (Gap 2) | MCP has no view tool — `GET /v1/databases/{id}/views` needed |
| Retrieve property items (non-truncated) | Direct API (Gap 3) | `GET /v1/pages/{id}/properties/{prop}` for relation/people fields with >25 references |
| List users | `list-all-users` | For audit purposes |

[SOURCE: mcp-notion SKILL.md §3 — 24-tool catalog, 5 API gaps]
[SOURCE: mcp-notion/references/mcp-tools.md §5 — tool inventory]
[SOURCE: mcp-notion/references/api-gap-tools.md §4-5 — views and property items]

### F1.2 — Import Phase: Human-driven, but mcp-obsidian handles post-import

The official Obsidian Importer (in-app UI) performs the actual Import step — it is NOT a programmatic surface the AI can call. The AI's role is:

1. **Human action**: Open Obsidian → Importer → "Notion (API)" → paste internal integration token → select scope → run
2. **AI layer after import**: mcp-obsidian (notesmd-cli or MCP) reads/verifies/writes the resulting vault files

[SOURCE: prior-findings.md §5 — human runs the Importer; agent works around it]
[SOURCE: mcp-obsidian SKILL.md §3 — notesmd-cli operates filesystem, MCP operates live vault]

### F1.3 — mcp-obsidian Write Surface for Post-Import Tasks

| Post-import task | mcp-obsidian surface | Tool/command | Requires running app? |
|---|---|---|---|
| Read imported note | MCP (app) / CLI (headless) | `obsidian_get_note` / `notesmd-cli print` | MCP: Yes / CLI: No |
| Write/overwrite note | MCP (app) / CLI (headless) | `obsidian_write_note` / `notesmd-cli create` | MCP: Yes / CLI: No |
| Edit frontmatter | CLI (headless) | `notesmd-cli frontmatter` | No |
| Search notes by name | CLI (headless) | `notesmd-cli list` + filter | No |
| Full-text search | CLI (headless) | `notesmd-cli search-content` | No |
| Global search (live vault) | MCP (app) | `obsidian_search_notes` | Yes |
| Manage tags | MCP (app) | `obsidian_manage_tags` | Yes |
| Delete note | MCP / CLI | `obsidian_delete_note` / `notesmd-cli delete` | Varies |
| Plugin-driven tasks | Reference | Dataview, Tables, etc. | Plugins loaded |

[SOURCE: mcp-obsidian SKILL.md §2 — operation-to-tool routing table]
[SOURCE: mcp-obsidian/references/mcp-tools.md §5 — 14 MCP tool surface]

### F1.4 — The mcp-notion Read Surface Has Critical Gaps for Inventory

1. **Title-only search** — `search` returns only title matches; full-text content search is impossible via the Notion API. For a complete inventory, must iterate all pages by traversing the root page tree.
2. **25-reference truncation** — `retrieve-a-page` truncates relation/people/rich_text at 25 references. To get the full set, must call the property-item endpoint per property (Gap 3).
3. **Views are read-only via MCP** — creating/reading views requires direct Notion API calls (Gap 2). The MCP's `query-data-source` can replicate filtered reads, but cannot read the saved view configuration.
4. **No file/attachment enumeration** — Notion files are embedded in blocks or `files` properties. Inventory requires reading each page's Markdown body (via `retrieve-page-markdown`) to detect file references, plus calling file-upload endpoints (Gap 1) for upload metadata.

[SOURCE: mcp-notion/references/mcp-tools.md §7 — 5 uncovered domains]
[SOURCE: mcp-notion/references/api-gap-tools.md — direct API recipes]

## Sources Consulted
- mcp-notion SKILL.md
- mcp-obsidian SKILL.md
- mcp-notion/references/mcp-tools.md
- mcp-notion/references/api-gap-tools.md
- mcp-obsidian/references/mcp-tools.md
- prior-findings.md
- Obsidian Help — Import from Notion: https://obsidian.md/help/import/notion
- Notion API Reference: https://developers.notion.com/reference

## Assessment
- newInfoRatio: 1.0
- noveltyJustification: "First pass on tool-surface mapping; entirely new evidence not in prior-findings"
- Confidence: High — all tool names and capabilities are source-confirmed from skill references
- This iteration answered the structural question of which tool does what, but raised four sub-questions on gaps

## Reflection
- What worked: Reading both skill SKILL.md files and tool references side-by-side produced a decisive tool-per-step map
- What failed: The Importer UI is opaque to AI — confirmed this is a human-only step
- Ruled out: Using mcp-notion for post-import vault writes (mcp-obsidian owns that surface entirely)

## Recommended Next Focus
KQ-3 continued: Deep-dive on the reconstruction and verification steps — specifically how mcp-obsidian rebuilds relations, creates .base files, and writes Dataview queries.