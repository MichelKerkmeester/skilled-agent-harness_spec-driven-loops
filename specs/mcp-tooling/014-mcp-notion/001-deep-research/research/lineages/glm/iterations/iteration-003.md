# Iteration 3: mcp-obsidian Capability Set — Full Parity Baseline

## Focus
Map the complete mcp-obsidian capability set — three execution surfaces, core note operations, and the 11 plugin file-layer knowledge domains — to establish the full parity baseline that mcp-notion must match.

## Findings

### F3.1 — mcp-obsidian is a full skill with three execution surfaces

mcp-obsidian operates through three distinct surfaces, each with a different runtime profile:

| Surface | Binary/Transport | Running app? | Auth | Best for |
|---|---|---|---|---|
| **Headless CLI** | `notesmd-cli` (Bash) | No — filesystem only | None | Daily note ops anywhere: open, daily, search, create, list, print, move, delete, frontmatter, vault management |
| **App-backed CLI** | `obsidian` (Bash) | Yes — launches/controls desktop app | None | In-app actions: opening notes in live UI, `obsidian://` URI actions |
| **Cyanheads MCP** | `obsidian.obsidian_*` via Code Mode | Yes + Local REST API + API key | `OBSIDIAN_API_KEY` bearer | Structured note reads/writes, tag management, semantic/global search |

[SOURCE: .claude/skills/mcp-tooling/mcp-obsidian/SKILL.md:121-149]

The smart router picks between them based on runtime probes (app running? REST API up? API key present?). This is a **multi-surface architecture** — not a single transport wrapper.

### F3.2 — Core note operations (15 operations across surfaces)

| Operation | Primary Surface | Command/Tool | Alternative |
|---|---|---|---|
| Open a note | notesmd-cli | `notesmd-cli open "<name>"` | `obsidian` CLI (in live app) |
| Open/append daily note | notesmd-cli | `notesmd-cli daily` | MCP `obsidian_write_note` |
| Search by note name | notesmd-cli | `notesmd-cli list` + filter | MCP `obsidian_search_notes` |
| Search note contents | notesmd-cli | `notesmd-cli search-content "<query>"` | MCP `obsidian_search_notes` |
| List notes | notesmd-cli | `notesmd-cli list` | MCP `obsidian_search_notes` |
| Print a note to stdout | notesmd-cli | `notesmd-cli print "<name>"` | MCP `obsidian_get_note` |
| Create a note | notesmd-cli | `notesmd-cli create "<name>"` | MCP `obsidian_write_note` |
| Move / rename a note | notesmd-cli | `notesmd-cli move "<a>" "<b>"` | n/a |
| Delete a note | notesmd-cli | `notesmd-cli delete "<name>"` | MCP `obsidian_delete_note` |
| Edit frontmatter | notesmd-cli | `notesmd-cli frontmatter "<name>"` | MCP `obsidian_manage_tags` |
| Vault registration | notesmd-cli | `notesmd-cli add-vault` / `set-default-vault` | n/a |
| Structured note read | MCP | `obsidian_get_note` | notesmd-cli `print` |
| Structured note write | MCP | `obsidian_write_note` | notesmd-cli `create` |
| Tag management | MCP | `obsidian_manage_tags` | notesmd-cli `frontmatter` |
| Global / semantic search | MCP | `obsidian_search_notes` | notesmd-cli `search-content` |

[SOURCE: .claude/skills/mcp-tooling/mcp-obsidian/SKILL.md:153-171]

### F3.3 — Cyanheads MCP: 14 tools (5 confirmed core)

The MCP server exposes 14 tools total. The 5 confirmed core tools:
- `obsidian_get_note` — read note contents + metadata
- `obsidian_write_note` — create or overwrite a note
- `obsidian_search_notes` — search by name and/or content
- `obsidian_manage_tags` — add/remove/list tags on a note
- `obsidian_delete_note` — delete a note from the vault

The remaining 9 tools are not enumerated in the reference (likely: append/patch content, list/browse vault, frontmatter/properties, active-note operations). [SOURCE: .claude/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md:81-105]

### F3.4 — Plugin file-layer knowledge: 11 plugins with deep domain doctrine

mcp-obsidian encodes file-layer knowledge for 11 plugins, each with a 4-file reference set (index, data-model, workflows, troubleshooting):

| Plugin | Knowledge Domain | File Format |
|---|---|---|
| **Beancount Finance** | Double-entry ledger, BQL queries, bean-price | `.beancount` ledger files |
| **Obsidian Tables** | Tabular data, columns, rows, formula columns | `.table.md` envelope |
| **Obsidian42 BRAT** | Beta plugin install/update, frozen versions | `data.json` BRAT config |
| **Health.md** | Apple Health/Healthkit data visualization | Health data imports + chart blocks |
| **Iconic** | Icon rules, file/folder icon automation | `data.json` rulebook |
| **Charts** | Chart rendering (bar, line, pie, advanced) | Chart JSON blocks |
| **Dataview** | DQL queries, DataviewJS, inline fields | DQL query blocks + frontmatter fields |
| **Excalidraw** | Drawing notes, embedded drawings | `.excalidraw.md` files |
| **Obsidian Git** | Vault git backup, auto-commit/push/pull | Git repository in vault |
| **Outliner** | List editing, zoom, indentation | List block formatting |
| **Minimal** | CSS theme, style settings, snippets | Theme CSS + snippet files |

[SOURCE: .claude/skills/mcp-tooling/mcp-obsidian/SKILL.md:50-112]

This is the **knowledge layer** — the core differentiator that makes mcp-obsidian a full skill rather than a thin transport. Each plugin has a data model (file format, schema, conventions), workflows (file-layer recipes), and troubleshooting (failure recovery). The agent doesn't just call tools; it understands the file formats and can operate them at the filesystem level.

### F3.5 — mcp-obsidian's architectural pattern: the "build" path

mcp-obsidian represents the **build path** in the adopt-vs-build decision:
- **Multi-surface**: 3 execution surfaces (headless CLI, app CLI, MCP) with smart routing
- **Deep knowledge layer**: 11 plugin file formats with data models, workflows, troubleshooting
- **Install + troubleshooting doctrine**: install scripts, vault registration, auth setup, error recovery
- **Smart routing**: runtime probes determine which surface to use
- **File-layer operation**: the headless CLI operates directly on the vault filesystem — no API needed

This is fundamentally different from the **adopt/transport path** (mcp-figma, mcp-mobbin), which are thin wrappers around a remote MCP with no local knowledge layer.

### F3.6 — Auth model: no OAuth, local token only

mcp-obsidian's auth is simple and local:
- Headless CLI: **no auth** — operates on filesystem directly
- App-backed CLI: **no auth** — controls local app
- MCP: `OBSIDIAN_API_KEY` bearer token from the Local REST API plugin (not OAuth, no browser step)

This is a fundamentally different auth model from Notion's integration token (`ntn_`) or OAuth flow. [SOURCE: .claude/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md:53-63]

### F3.7 — Key parity dimensions for mcp-notion

From the mcp-obsidian architecture, the parity dimensions mcp-notion must address are:

1. **Multi-surface operation** — does mcp-notion need more than one execution surface?
2. **Core CRUD** — note/page create, read, update, delete, move, search
3. **Structured data management** — tags/frontmatter (Obsidian) vs properties/database rows (Notion)
4. **Knowledge layer** — plugin file formats (Obsidian) vs database schemas/property types/relations (Notion)
5. **Headless operation** — can mcp-notion work without a running app? (Notion is cloud-only, so this is fundamentally different)
6. **Install + troubleshooting** — setup, auth, error recovery doctrine
7. **Search** — full-text search (Obsidian) vs title search + database queries (Notion)

## Sources Consulted
- .claude/skills/mcp-tooling/mcp-obsidian/SKILL.md (full skill: routing, surfaces, rules, quick reference)
- .claude/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md (14-tool MCP catalog, auth, invocation)

## Assessment
- **newInfoRatio: 0.80** — Most findings are new (the detailed mcp-obsidian capability map hasn't been documented in this packet before). Some overlap with the general understanding from the spec, but the 3-surface architecture, 15-operation table, and 11-plugin knowledge layer are all newly enumerated.
- **Novelty justification**: First systematic enumeration of mcp-obsidian's full capability set as a parity baseline; the 11-plugin knowledge layer and multi-surface architecture are net-new detail.
- **Confidence**: High — sourced directly from the checked-in skill files in this repository.

## Reflection
- **What worked**: Reading the actual skill files gave authoritative, repo-specific data.
- **What failed**: Nothing significant.
- **Ruled out**: Nothing yet — but the headless CLI surface (filesystem operation) is architecturally impossible for Notion (cloud-only), which will factor into the parity mapping.

## Recommended Next Focus
Iteration 4: Parity mapping — map each mcp-obsidian capability to a Notion-MCP equivalent, identify gaps, and assess which gaps are structural (cannot be filled) vs tooling (can be filled with custom tools or direct API calls).
