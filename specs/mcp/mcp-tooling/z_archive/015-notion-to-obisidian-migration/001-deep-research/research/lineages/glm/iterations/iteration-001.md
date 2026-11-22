---
title: "Iteration 1: Importer Choice Deep-Dive (Notion API vs HTML zip)"
trigger_phrases: []
---
# Iteration 1: Importer Choice Deep-Dive (Notion API vs HTML zip)

## Focus

Verify and refine the prior provisional verdict — "API import for a database-heavy workspace" — against the live Obsidian Importer source and docs. Enumerate exactly what the Notion API importer preserves vs drops, contrast with the HTML `.zip` route, and decide the importer path for a complex Notion space.

## Findings

### F1.1 — The Notion API importer is live and converts databases → Bases automatically

The official Obsidian Importer's Notion API mode (PR #444, merged; DeepWiki indexed 2026-01-25 at commit `d4e05b`) fetches via the official Notion API (`@notionhq/client`), converts Notion blocks to Markdown, and **generates `.base` files for database views**. It uses a three-phase process: (1) Import — fetch and convert pages/databases to Markdown with placeholders; (2) Resolution — replace placeholders with wikilinks in up to 10 rounds; (3) Cleanup — remove temporary `notion-id` properties (unless incremental). [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api]

This **confirms and strengthens** the prior verdict: the API importer is not just "new" — it is the implemented, merged path that reconstructs databases as Bases.

### F1.2 — What the API importer preserves (refined matrix)

| Notion artifact | API importer behavior | Evidence |
|---|---|---|
| Databases | Converted to `.base` files; rows become notes with YAML frontmatter; a `base` frontmatter property links each page to its `.base` file | [SOURCE: deepwiki.com/.../3.2-notion-api], [SOURCE: github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api.ts] |
| Database properties | Mapped to frontmatter via `mapDatabaseProperties()`; title→`file.name`; date→`datetime` refined by data; relation→list with `isRelation: true`; button properties skipped | [SOURCE: deepwiki.com/.../database-helpers.ts] |
| Formulas | Converted from Notion functions to Obsidian Bases formulas via `convertNotionFormulaToObsidian()`; strategy `static` or `hybrid` (default `hybrid`) | [SOURCE: deepwiki.com/.../3.2-notion-api], [SOURCE: github.com/.../api-helpers.ts] |
| Rollups | **Converted to Bases formulas** (not dropped) — count→`note["Rel"].length`, sum/mean→list methods, show_original→`.map(value.asFile().properties["Target"])`, earliest/latest_date→`.map(...).sort()[0/−1]`, empty/not_empty/percent_empty→filter expressions | [SOURCE: deepwiki.com/.../database-helpers.ts], [SOURCE: github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/database-helpers.ts] |
| Relations | Stored as frontmatter lists; resolved to `[[wikilinks]]` via multi-phase placeholder resolution (up to 10 rounds) using `notion-id` → file-path mapping | [SOURCE: deepwiki.com/.../3.2-notion-api] |
| Attachments (image/video/PDF/file) | Downloaded into the vault's attachment folder with `![]()` embeds; `downloadExternalAttachments` option (default false) for external URLs; incremental import skips same-size files | [SOURCE: deepwiki.com/.../3.2-notion-api], [SOURCE: github.com/.../block-converter.ts] (`ATTACHMENT_CONFIGS`) |
| Page cover | Stored as a frontmatter property (`coverPropertyName`, default `cover`) | [SOURCE: github.com/.../notion-api.ts] |
| Synced blocks | Converted to separate markdown files (`{Page Name} synced block.md`) | [SOURCE: github.com/.../block-converter.ts] (`createSyncedBlockFile`) |
| Nested hierarchy / internal links | Preserved — child pages become nested notes; mentions → wikilinks via placeholder resolution | [SOURCE: deepwiki.com/.../3.2-notion-api] |
| Incremental import | Supported — skips files with same `notion-id`; re-runs append rather than duplicate | [SOURCE: github.com/.../notion-api.ts] (`incrementalImport`) |

### F1.3 — What the API importer drops (the gaps that drive reconstruction)

| Dropped / limited | Detail | Evidence |
|---|---|---|
| **Discussion comments** | Not mentioned in the importer's conversion surface — the Notion API exposes comment endpoints but the importer does not carry page/discussion comments into the markdown. **GAP.** | [SOURCE: deepwiki.com/.../3.2-notion-api] (no comment handling in enumerated conversion) |
| **Secondary views** | Only a **default table view** is generated per `.base` file (with column order). Board/Calendar/Timeline/Gallery/Form/Chart/Map/Dashboard views are NOT reconstructed. | [SOURCE: deepwiki.com/.../database-views-and-base-files], [SOURCE: github.com/obsidianmd/obsidian-importer/issues/421] (bounty: "determine what can't be imported, fallbacks for calendar/kanban") |
| **Linked data sources** | Prior findings flagged "linked data sources not imported" — confirmed as a known gap. | [SOURCE: prior-findings.md §1] |
| **People `name()`/`email()` and Text `style()`/`unstyle()`** | Do not convert (prior finding, not contradicted). | [SOURCE: prior-findings.md §1] |
| **Gallery cover images** | A PR-test comment reports gallery-view cover images are not imported. | [SOURCE: github.com/obsidianmd/obsidian-importer/pull/444] (test feedback) |
| **Rate limits** | Large workspaces hit the Notion API ~3 req/s limit; the importer paginates but budget time. | [SOURCE: prior-findings.md §1], [SOURCE: mcp-notion/api-gap-tools.md §8] |

### F1.4 — HTML `.zip` route contrast (confirmed worse for databases)

The HTML route loses databases entirely (rows become plain notes + CSV); views, properties, formulas, relations, rollups all gone. The official docs still recommend HTML over Notion's own Markdown export ("We recommend that you do not use Notion's Markdown export as it omits important data"), but for a database-heavy workspace the API route is strictly superior. HTML is the fallback only when a token cannot be minted. [SOURCE: prior-findings.md §1]

### F1.5 — Refined verdict

**API import is the confirmed primary path** for a complex, database-heavy Notion workspace — it is the only route that reconstructs databases as Bases, converts formulas and rollups to Bases formulas, resolves relations to wikilinks, and downloads attachments. The prior "verify" flag on relations/rollups is now **partially resolved**: the importer does convert them, but the conversion is mechanical (rollups→formulas, relations→wikilinks via placeholder rounds) and must be **independently verified** post-import because (a) the importer is new, (b) Bases cross-note formulas have performance/refresh caveats (see iteration 4), and (c) secondary views and comments are genuine gaps requiring agent-driven reconstruction.

## Sources Consulted

- [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api] — Notion API importer architecture, phases, attachment handling, settings
- [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/2.6-database-views-and-base-files] — `.base` file generation, default table view only
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/database-helpers.ts] — rollup→formula conversion source
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api.ts] — settings (formulaStrategy, downloadExternalAttachments, coverPropertyName, databasePropertyName, incrementalImport)
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/block-converter.ts] — ATTACHMENT_CONFIGS, synced blocks
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/issues/421] — bounty spec: what can/can't be imported, fallbacks
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/pull/444] — PR test feedback (gallery cover images)
- [SOURCE: prior-findings.md §1] — prior provisional verdict + HTML route
- [SOURCE: mcp-notion/references/api-gap-tools.md §8] — rate limit doctrine

## Assessment

- **newInfoRatio: 0.82** — The prior findings treated the API importer as "new, relations/rollups flagged verify." This iteration confirmed it is the merged, implemented path and discovered the rollup→formula and relation→wikilink placeholder-resolution mechanics, the attachment/cover/synced-block handling, and the concrete gaps (comments, secondary views, gallery covers). High novelty against the seed.
- **Novelty justification:** First evidence-grounded confirmation that rollups are auto-converted (not dropped) and that the importer's three-phase placeholder system resolves relations — both refine the prior "verify" flag into a "converts, but verify post-import" verdict.
- **Confidence:** High on the importer's behavior (source-level evidence). Medium on the comments gap (absence in enumerated conversion, not an explicit "we don't import comments" statement — treat as high-likelihood gap pending iteration 6).

## Reflection

- **What worked:** Source-level evidence (importer GitHub + DeepWiki) gave concrete conversion mechanics the prior web-research note lacked.
- **What failed:** The official `obsidian.md/help/import/notion` page returned empty body via WebFetch — fell back to DeepWiki + GitHub source, which was richer.
- **Ruled out:** Notion's own Markdown export as a route (officially discouraged; omits data). HTML `.zip` as the primary path for database-heavy spaces (loses databases).

## Recommended Next Focus

**Iteration 2:** Q2 — Map the exact mcp-notion read surface (24 MCP tools + 5 API gaps) to the inventory phase: which tool reads each Notion artifact (databases, data sources, schema, rows, relations, rollups, formulas, files, views, comments, users), and what are the read limits (truncation at 25 refs, title-only search, ~3 req/s).
