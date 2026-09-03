---
title: "Iteration 3: mcp-obsidian Write Surface Mapping (notesmd-cli + MCP + plugin file-layer)"
trigger_phrases: []
---
# Iteration 3: mcp-obsidian Write Surface Mapping (notesmd-cli + MCP + plugin file-layer)

## Focus

Map the exact `mcp-obsidian` write surface to the migration **reconstruction** phase. For each Obsidian artifact the agent must create/repair post-import, name the surface (headless `notesmd-cli`, app-backed cyanheads MCP, or plugin file-layer) that writes it, and document the headless-vs-app-backed decision that shapes unattended migration.

## Findings

### F3.1 — Three write surfaces and when each applies

| Surface | Binary / transport | Needs running app? | Write capabilities | [SOURCE] |
|---|---|---|---|---|
| **Headless CLI** | `notesmd-cli` (Bash) | No — filesystem only | create, move, delete notes; edit frontmatter; daily note | mcp-obsidian/SKILL.md §3 |
| **App-backed MCP** | cyanheads `obsidian-mcp-server` via Code Mode (`obsidian.obsidian_*`) | Yes + Local REST API + `OBSIDIAN_API_KEY` | `obsidian_write_note`, `obsidian_manage_tags`, `obsidian_delete_note` (structured JSON) | mcp-obsidian/references/mcp-tools.md §5 |
| **Plugin file-layer** | Read/Edit on plugin data files | Varies (files only; no pixels) | `.base` files, Dataview query blocks, plugin `data.json` settings, `community-plugins.json` | mcp-obsidian/references/plugins/dataview/dataview.md §3 |

**The headless-vs-app-backed decision is load-bearing for unattended migration.** A fan-out migration agent runs headless (no running Obsidian app, no Local REST API token). The router's `resolve_execution_profile()` returns `NOTESMD_CLI` by default for automated sessions. The MCP path requires a live app + Local REST API v4+ + `OBSIDIAN_API_KEY`, which is a human-in-the-loop precondition. [SOURCE: mcp-obsidian/SKILL.md §2, references/mcp-tools.md §2]

**Implication:** For an unattended/automated migration, the **headless `notesmd-cli` + direct file Read/Edit is the primary write surface.** The MCP is the structured-search/tag path only when a live app is available. Plugin file-layer work (`.base`, Dataview queries) is always available headlessly because it operates on files.

### F3.2 — Write operation → surface mapping (reconstruction phase)

| Reconstruction operation | Primary surface | Command / tool | Alternative | [SOURCE] |
|---|---|---|---|---|
| Create a note (row → `.md`) | notesmd-cli | `notesmd-cli create "<name>"` | MCP `obsidian_write_note` | SKILL.md §2 routing table |
| Write/overwrite note body | notesmd-cli | create + Edit, or `notesmd-cli print` → Edit | MCP `obsidian_write_note` | mcp-tools.md §6 |
| Edit frontmatter (properties) | notesmd-cli | `notesmd-cli frontmatter "<name>"` | MCP `obsidian_manage_tags` (tags only) | SKILL.md §2 |
| Move/rename a note | notesmd-cli | `notesmd-cli move "<a>" "<b>"` | n/a | SKILL.md §2 |
| Delete a note | notesmd-cli | `notesmd-cli delete "<name>"` | MCP `obsidian_delete_note` | SKILL.md §2 |
| Tag management | MCP (app) | `obsidian_manage_tags` | notesmd-cli frontmatter | mcp-tools.md §7 |
| Global/semantic search (verify) | MCP (app) | `obsidian_search_notes` | notesmd-cli `search-content` | mcp-tools.md §9 |
| **Author `.base` files** | file-layer (Read/Write) | write `.base` YAML directly | n/a — no CLI/MCP tool for this | state-outputs, dataview.md §3 |
| **Author Dataview query blocks** | file-layer (Edit) | embed ```` ```dataview ```` blocks in notes | n/a | dataview.md §3, §5 |
| **Edit plugin settings** | file-layer (Read/Write) | `.obsidian/plugins/<id>/data.json` (backup first) | n/a | dataview.md §6 |
| **Enable a plugin** | file-layer (Edit) | `.obsidian/community-plugins.json` | n/a | dataview.md §3 |
| In-app open / URI action | official `obsidian` CLI | `obsidian "<vault/path>"` | n/a (app-backed only) | SKILL.md §3 |

### F3.3 — The plugin file-layer is the reconstruction workhorse

The prior findings named "author `.base` files and Dataview queries" as the highest-value agent work. This iteration confirms **there is no CLI or MCP tool that authors `.base` files or Dataview query blocks** — both are pure file-layer operations done with Read/Write/Edit on markdown. The mcp-obsidian skill explicitly operates Dataview "by editing note metadata, placing query blocks and editing its `data.json` settings. It never drives the query UI." [SOURCE: mcp-obsidian/references/plugins/dataview/dataview.md §1, §3]

This means the reconstruction write surface is:
- `notesmd-cli create` / `frontmatter` / `move` / `delete` for note CRUD (headless).
- Read/Write/Edit for `.base` files, Dataview blocks, plugin settings, and `community-plugins.json` (headless file-layer).
- MCP `obsidian_write_note` / `obsidian_manage_tags` / `obsidian_search_notes` only when a live app + REST API is available (structured verification path).

### F3.4 — Dataview file-layer specifics relevant to relation/rollup reconstruction

- Dataview reads three metadata layers: YAML frontmatter, inline fields (`Key:: Value`), and implicit `file.*` fields. [SOURCE: dataview.md §4]
- Query blocks: DQL (```` ```dataview ````), inline `=`, DataviewJS (```` ```dataviewjs ````, disabled by default). [SOURCE: dataview.md §5]
- The AI **can** write/validate DQL query text but **cannot** run DataviewJS or force a pane refresh — file-layer verification proves the write, not the pixels. [SOURCE: dataview.md §3]
- `enableDataviewJs` defaults to `false`; JS blocks stay inert until enabled in settings. [SOURCE: dataview.md §6]
- Inline fields need the exact `Key:: Value` separator (two colons); a single colon does not parse. [SOURCE: dataview.md §8]

### F3.5 — Two MCP server surfaces (do not conflate)

The cyanheads `obsidian-mcp-server` exposes `obsidian_*` tools (5 confirmed core, 14 total). Separately, the **Local REST API plugin v5.1.0+ ships its own built-in MCP** at `https://127.0.0.1:27124/mcp/` exposing **16 `vault_*` tools** (`vault_read`/`vault_write`/`vault_patch`/`vault_move`/`search_simple`/`search_query`/`tag_list`/…). Same Local REST API core, different server + tool surface — always confirm with `list_tools()`. [SOURCE: mcp-obsidian/references/mcp-tools.md §5, SKILL.md §3]

This is relevant to verification (iteration 10): the `vault_*` MCP surface offers `vault_patch` (partial note update) and `search_query` (structured search) that the cyanheads `obsidian_*` surface may not expose — useful for programmatic parity checks when a live app is available.

## Sources Consulted

- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md] — three surfaces, execution profile selection, routing table
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md] — cyanheads 14-tool catalog, prerequisites, two-MCP-server note
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md] — file-layer surface, metadata layers, query formats, gotchas
- [SOURCE: prior-findings.md §5] — AI agent file-layer role

## Assessment

- **newInfoRatio: 0.64** — The mcp-obsidian surface was documented in the skill but not yet mapped to reconstruction; this iteration fixes the headless-vs-app-backed decision (headless primary for unattended migration) and confirms `.base`/Dataview authoring is pure file-layer with no CLI/MCP tool.
- **Novelty justification:** First explicit statement that the reconstruction workhorse (`.base` + Dataview) has no CLI/MCP tool and must be file-layer, and that unattended migration defaults to notesmd-cli + file Read/Edit.
- **Confidence:** High — grounded in the skill's own references.

## Reflection

- **What worked:** The skill's execution-profile router and Dataview file-layer index gave the write map directly.
- **What failed:** Nothing.
- **Ruled out:** Assuming the MCP is the default write path for unattended migration (it needs a live app + token); assuming a CLI tool exists for `.base` authoring (none — file-layer only).

## Recommended Next Focus

**Iteration 4:** Q4 — Relations & rollups recovery path. Map Notion single/dual relations and the 14 rollup functions to Obsidian recovery options: what the importer auto-converts (rollup→Bases formula), what Bases v1.9.7 cross-note lookups add, what needs the Notion Bases community plugin vs Dataview, and the verified path per relation/rollup type.
