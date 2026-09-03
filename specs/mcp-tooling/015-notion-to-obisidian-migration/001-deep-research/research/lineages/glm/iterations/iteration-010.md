---
title: "Iteration 10: Parity & Verification + Final Method Decision"
trigger_phrases: []
---
# Iteration 10: Parity & Verification + Final Method Decision

## Focus

Define the programmatic pass/fail checks that confirm a migrated workspace matches the source with no silent loss, and state the final flawless-migration method decision ready to hand to phase 002+. This resolves the spec's REQ-004 (auto-preserved vs reconstruct matrix), REQ-005 (file/comment/multi-view handling), and the overall handoff criteria.

## Findings

### F10.1 — Programmatic parity checks (mcp-notion source vs mcp-obsidian target)

| Check | mcp-notion source read | mcp-obsidian target check | Pass criterion |
|---|---|---|---|
| **Page/note count** | `search` + `query-data-source` (total rows per data source) | `notesmd-cli list` (note count per folder) | Target count ≥ source count per database/folder |
| **Row count per database** | `query-data-source` (paginated count) | Dataview `TABLE ... FROM "<folder>"` → `length()` OR Bases view row count | Equal counts per database |
| **Property schema parity** | `retrieve-a-data-source` (property names + types) | file-layer read of `.base`/frontmatter properties | Every source property has a target equivalent (or documented loss) |
| **Relation resolution** | `GET /v1/pages/{id}/properties/{prop}` gap (full relation values) | `notesmd-cli search-content` / grep for `[[wikilinks]]` in frontmatter; verify each link target exists | No orphaned wikilinks; every relation value resolves to an existing note |
| **Rollup/formula render** | `retrieve-a-data-source` (rollup/formula config) | file-layer read of `.base` formula; Dataview query to compute expected value | Formula present; computed value matches source (or documented static fallback) |
| **Attachment presence** | `GET /v1/file_uploads` gap (attachment ledger) | file-layer: every `![]()` embed path exists on disk; `notesmd-cli search-content` for embeds | No missing-attachment embeds |
| **Comment count parity** | MCP comment-list (comment count per page) | frontmatter `comment_count` field; `## Comments` section present | Equal comment counts; section present where count > 0 |
| **View count parity** | `GET /v1/databases/{id}/views` gap (view count per database) | file-layer: count view blocks in `.base` + Notion Bases plugin views in `_database.md` | Target view count ≥ source (minus documented-lost form/map/dashboard) |
| **Hierarchy parity** | `retrieve-a-page` + block children (parent-child tree) | `notesmd-cli list` (folder tree) | Nested structure preserved; child notes in expected folders |
| **Internal link parity** | mentions in block tree | grep for broken `[[wikilinks]]` (target note absent) | No broken internal links |
| **Property-type mismatch** | source property type | target frontmatter type | No type mismatches (e.g., date stored as string) |

### F10.2 — Auto-preserved vs needs-reconstruction matrix (REQ-004)

| Notion artifact | Auto-preserved by importer? | Reconstruction needed? | Method |
|---|---|---|---|
| Pages (prose/blocks) | Yes | No (verify) | — |
| Nested hierarchy | Yes | No (verify) | — |
| Internal links/mentions | Yes (wikilinks) | No (verify resolution) | — |
| Databases → Bases | Yes (`.base` + frontmatter) | No (verify) | — |
| Database properties | Yes (frontmatter) | No (verify types) | — |
| Formulas | Yes (hybrid conversion) | Partial (hand-fix `style`/`name`/`email`; static fallback) | file-layer `.base` |
| Rollups | Yes (→ Bases formula) | Optional (upgrade to Notion Bases plugin Rollup column for interactive) | file-layer `_database.md` |
| Relations (single) | Yes (wikilinks) | No (verify) | — |
| Relations (dual/two-way) | Partial (wikilinks, no back-ref) | Yes (Notion Bases plugin two-way Relation or Dataview back-ref) | file-layer `_database.md` / Dataview |
| Block attachments | Yes (downloaded + embed) | No (verify) | — |
| `files` property attachments | Yes (downloaded, frontmatter) | Verify shape | — |
| External attachments | Only if opt-in | Yes if opt-out (enable `downloadExternalAttachments` or accept links) | importer option |
| Page cover | Yes (frontmatter `cover`) | No (accept as parity record) | — |
| Gallery cover images | No | Yes (read via API, write frontmatter `cover` + download) | mcp-notion read + mcp-obsidian write |
| Comments | No | Yes (MCP comment-list → `## Comments` + `comment_count`) | mcp-notion read + mcp-obsidian write |
| Table view | Yes (default) | No | — |
| Board/List/Calendar/Card views | No | Yes (core Bases view blocks) | file-layer `.base` |
| Gallery/Timeline/Gantt/Chart views | No | Yes (Notion Bases plugin views) | file-layer `_database.md` |
| Form/Map/Dashboard views | No | No parity — document as lost | — |
| Subtasks (self-relation) | Partial (wikilinks) | Yes (Notion Bases plugin self-relation + hierarchical) | file-layer `_database.md` |
| Synced blocks | Yes (separate files) | No (verify) | — |

### F10.3 — Final flawless-migration method decision

**The method, ready to hand to phase 002+:**

1. **Inventory (mcp-notion reads):** enumerate every database, data source, property, relation (single/dual), rollup (function), formula, view (all 10 types), attachment, comment, and user via the 24 MCP tools + 5 API gaps. Produce the must-preserve / rebuild / retire ledger with schema-level detail. Budget for ~3 req/s rate limits.

2. **Import (human-driven Importer, Mode A):** create an internal Notion integration (`ntn_` token), grant content access, run the official Obsidian Importer → "Notion (API)" → paste token → select scope → run. Settings: `formulaStrategy: hybrid`, `downloadExternalAttachments: true` (to capture external files), `incrementalImport: true` (for re-runs). The importer converts databases→Bases, formulas→Bases formulas, rollups→Bases formulas, relations→wikilinks, downloads attachments, stores covers as frontmatter.

3. **Reconstruct (mcp-obsidian writes, headless file-layer):**
   - **Relations:** verify wikilinks resolve; rebuild dual-relation back-references via the Notion Bases plugin two-way Relation column (or Dataview back-ref query for read-only).
   - **Rollups:** verify importer formulas render; upgrade to Notion Bases plugin Rollup columns (sum/count/avg/min/max/count_values/list) for interactive parity.
   - **Formulas:** verify hybrid-converted formulas; hand-translate `style()`/`name()`/`email()` (drop styling, store person as text); use `static` fallback for no-equivalent.
   - **Comments (gap):** MCP comment-list → append `## Comments` section + `comment_count` frontmatter per note.
   - **Gallery covers (gap):** read cover via API → frontmatter `cover` + download image.
   - **Views:** reconstruct secondary views — core Bases view blocks (board/list/calendar/card) and Notion Bases plugin views (gallery/timeline/gantt/chart); map Notion filters → nested AND/OR/NOT; document form/map/dashboard as lost.

4. **Verify (mcp-notion reads vs mcp-obsidian/grep checks):** run the F10.1 parity checks. Keep Notion live until all pass.

5. **Required plugins:** Core Bases (shipped), Notion Bases community plugin (relational/view parity), Dataview (already in mcp-obsidian knowledge). Optional: Tasks, Kanban, Calendar/Full Calendar, Charts, Bases Toolbox, Excalidraw, Git, Outliner, BRAT.

6. **Boundaries:** the agent never drives the in-app Importer UI; it complements at the file layer. The entire reconstruction + verification pipeline is headless-capable (notesmd-cli + file Read/Edit). Form/Map/Dashboard views and Database buttons have no parity — document as lost.

### F10.4 — Honest boundaries (carried forward)

- The API importer is new; imported relational data stays suspect until the F10.1 parity checks pass. [SOURCE: prior-findings §1]
- Bases cross-note formulas (v1.9.7) have a performance impact and no auto-refresh — prefer Notion Bases plugin rollup columns for interactive rollups. [SOURCE: forum cross-note-lookup thread]
- `median`/`range` rollup conversion and `dateBetween`/`dateRange` formula parity are VERIFY — confirm post-import. [SOURCE: iteration 4, 5]
- The `files`-property frontmatter serialization is VERIFY — confirm shape post-import. [SOURCE: iteration 6]

## Sources Consulted

- [SOURCE: iterations 1-9 findings] — the full evidence base
- [SOURCE: prior-findings.md §4, §5] — acceptance checklist + agent boundaries
- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md] — gap read endpoints for verification
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md] — Dataview verification queries

## Assessment

- **newInfoRatio: 0.45** — This iteration synthesizes the verification regime and the final method decision; novelty is lower because it integrates rather than discovers. The auto-preserved-vs-reconstruct matrix (REQ-004) and the final method are the deliverable.
- **Novelty justification:** First complete parity-check table mapping mcp-notion source reads to mcp-obsidian/grep target checks, and first consolidated auto-preserved-vs-reconstruct matrix.
- **Confidence:** High — built on iterations 1-9. The VERIFY items are honestly flagged.

## Reflection

- **What worked:** Integrating all prior findings into the verification regime + final method.
- **What failed:** Nothing.
- **Ruled out:** Claiming full parity for form/map/dashboard views (no Obsidian equivalent — document as lost); claiming the importer "just works" for relations/rollups (verify post-import).

## Recommended Next Focus

**Synthesis:** compile `research.md` from all 10 iterations, update the dashboard and findings registry, set config status to complete, and emit the convergence report. The GLM lineage is ready to hand to the parent orchestrator for merging with the deepseek lineage.
