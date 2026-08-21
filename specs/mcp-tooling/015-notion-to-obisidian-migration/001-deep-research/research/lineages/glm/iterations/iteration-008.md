# Iteration 8: Required vs Optional Obsidian Plugins (Ranked)

## Focus

Produce the definitive required-vs-optional Obsidian plugin list for a flawless complex Notion→Obsidian migration, ranked against `mcp-obsidian`'s existing plugin knowledge. Each plugin gets a required/optional verdict, the gap it closes, and install/config notes.

## Findings

### F8.1 — `mcp-obsidian`'s existing plugin knowledge (the baseline)

`mcp-obsidian` already knows 11 plugin/theme file formats at the file layer: Beancount, Tables, BRAT, Health.md, Iconic, Charts, **Dataview**, Excalidraw, Git, Outliner, Minimal. [SOURCE: mcp-obsidian/SKILL.md §2] Dataview is already in the knowledge base and already enabled in the target vault (`community-plugins.json`). [SOURCE: mcp-obsidian/references/plugins/dataview/dataview.md §3]

This means: Dataview requires no new install for an `mcp-obsidian`-driven migration — it is operable at the file layer today.

### F8.2 — Required plugins (close a gap the importer + core Bases leave open)

| Plugin | Verdict | Gap it closes | Install/config | [SOURCE] |
|---|---|---|---|---|
| **Core Bases** (built-in) | **Required** (already shipped) | Database views (table/board/list/calendar), formulas, the importer's `.base` target | Core plugin, enable in Settings; ships v1.9+ | prior-findings §2, SKILL.md |
| **Notion Bases** (`bgarciamoura/obsidian-notion-bases-plugin`, v1.5.0+) | **Required for relational/view parity** | Two-way relations, lookup/rollup columns (7 functions), subtasks, Gallery/Timeline/Gantt/Chart views (lifts view coverage 4/10→7/10) | Community plugin: install via BRAT or community store; every row a `.md` + `_database.md` schema; configure relation/rollup columns per database | github.com/bgarciamoura/..., releases 1.3.0/1.5.0 |
| **Dataview** (`blacksmithgu/obsidian-dataview`) | **Required** (already in mcp-obsidian knowledge) | Read-only rollup/relation queries without the Notion Bases plugin; back-reference queries for dual relations; verification queries | Already enabled; file-layer operable; `enableDataviewJs` defaults false (enable only if JS views needed) | dataview.md §3, §6 |

**Why Notion Bases plugin is "required for parity" rather than optional:** core Bases cannot do two-way relations, lookup columns, rollup columns, or gallery/timeline/chart views (iteration 4, 7). For a *complex, relational* Notion workspace, these are the features that define the workspace. Without the plugin, dual relations and the 6 non-table view types (board/calendar/timeline/gallery/chart + the core-Bases gaps) are not recoverable interactively. Dataview covers the read-only case but not interactive two-way relations.

### F8.3 — Optional plugins (close a gap only some workspaces need)

| Plugin | Verdict | When needed | Install/config | [SOURCE] |
|---|---|---|---|---|
| **Tasks** | Optional | Notion recurring-task databases | Community plugin; configure recurrence rules | prior-findings §3 |
| **Kanban** | Optional | If board views are preferred as dedicated Kanban boards (vs Bases board view) | Community plugin | prior-findings §3 |
| **Calendar / Full Calendar** | Optional | If calendar views are preferred as dedicated calendars (vs Bases calendar view) | Community plugin | prior-findings §3 |
| **Obsidian Charts** | Optional | If chart views are needed and the Notion Bases plugin Chart view is insufficient | Community plugin; already in mcp-obsidian knowledge (Charts plugin file-layer) | mcp-obsidian/SKILL.md §2 |
| **Bases Toolbox** | Optional | Native-style rollups (count/sum/avg/min/max) as real properties without the full Notion Bases plugin; merge/duplicate-finder | Community plugin | forum.obsidian.md Bases Toolbox thread |
| **Excalidraw** | Optional | If Notion embeds whiteboards/drawings need parity | Already in mcp-obsidian knowledge; file-layer operable | mcp-obsidian/SKILL.md §2 |
| **Obsidian Git** | Optional | Vault backup + multi-device sync (acceptance checklist item) | Already in mcp-obsidian knowledge; file-layer operable | mcp-obsidian/SKILL.md §2, prior-findings §4 |
| **Outliner** | Optional | Notion-style list/toggle editing parity | Already in mcp-obsidian knowledge | mcp-obsidian/SKILL.md §2 |
| **BRAT** (Obsidian42) | Optional (enabler) | Install beta/community plugins (e.g., Notion Bases plugin) from GitHub | Already in mcp-obsidian knowledge; use to install the Notion Bases plugin if not in community store | mcp-obsidian/SKILL.md §2 |

### F8.4 — Plugins with no parity target (document as lost)

| Notion feature | No Obsidian plugin parity | Action |
|---|---|---|
| Form view | No Obsidian form-builder plugin gives database-form parity | Document as lost; approximate via templated note + Dataview input替代 is not real parity |
| Map view | Map View plugin is geo-map of notes, not a database map view | Document as lost |
| Dashboard view | No database-dashboard plugin | Approximate via a dashboard note embedding multiple Bases/Dataview blocks |
| Database buttons (action automation) | No parity | Document as lost |

### F8.5 — Install/config notes (file-layer, since mcp-obsidian operates plugins at the file layer)

- **Enable a plugin:** add its id to `.obsidian/community-plugins.json` (file-layer Edit). [SOURCE: dataview.md §3]
- **Plugin settings:** edit `.obsidian/plugins/<id>/data.json` — read first, back up before write, merge not replace. [SOURCE: dataview.md §6]
- **Install a community plugin not in the store:** use BRAT (already in mcp-obsidian knowledge) to install from a GitHub repo — BRAT's `data.json` carries the repo list and release policy. [SOURCE: mcp-obsidian/SKILL.md §2 PLUGIN_BRAT route]
- **Verification:** file-layer writes prove the file, not the pixels — tell the user to reload the note/pane to confirm rendering. [SOURCE: dataview.md §8]

### F8.6 — Ranked required-plugin summary

1. **Core Bases** — required (shipped; importer target).
2. **Notion Bases community plugin** — required for relational/view parity (two-way relations, rollup/lookup columns, gallery/timeline/chart views).
3. **Dataview** — required (already in mcp-obsidian knowledge; read-only rollups, back-refs, verification).
4. *(Optional tier: Tasks, Kanban, Calendar/Full Calendar, Charts, Bases Toolbox, Excalidraw, Git, Outliner, BRAT — per-workspace need.)*

## Sources Consulted

- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md §2] — 11 plugin/theme file formats in mcp-obsidian knowledge
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md §3, §6, §8] — Dataview already enabled, settings discipline, file-layer verification
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin] — 7 views, 18 column types, relations/lookups/rollups, two-way, subtasks
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.3.0] — two-way relations
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.5.0] — rollup columns, charts, subtasks
- [SOURCE: https://forum.obsidian.md/t/enhance-bases-usability-experience-with-bases-toolbox/115907] — Bases Toolbox rollups
- [SOURCE: prior-findings.md §3] — Tasks, Kanban, Calendar alternatives
- [SOURCE: iteration 4, 7 findings] — relation/rollup and view-coverage evidence

## Assessment

- **newInfoRatio: 0.58** — The prior findings listed plugin alternatives but did not rank required-vs-optional against the importer's actual gaps + core Bases coverage. This iteration produces the ranked list and the key insight that the Notion Bases plugin is *required for parity* (not optional) for a relational workspace.
- **Novelty justification:** First required/optional ranking grounded in the importer's confirmed gaps + core-vs-plugin view coverage, and first note that Dataview needs no new install (already in mcp-obsidian knowledge).
- **Confidence:** High on plugin features (release notes). High on Dataview already-enabled (skill reference). Medium on "Notion Bases plugin required" — it is required *for full relational/view parity*; a workspace that accepts read-only Dataview rollups and core-Bases views could treat it as optional. The verdict is conditional on the "flawless/complex" scope.

## Reflection

- **What worked:** Cross-referencing the importer gaps (iterations 1, 4, 7) with plugin feature sets produced a defensible ranking.
- **What failed:** Nothing.
- **Ruled out:** Treating the Notion Bases plugin as optional for a *complex relational* workspace (it is required for parity); treating Dataview as needing install (it is already in mcp-obsidian knowledge).

## Recommended Next Focus

**Iteration 9:** Q9 — The mcp-notion-reads / mcp-obsidian-writes division of labor. Synthesize the complete step-by-step migration method, mapping each migration step (inventory, import, relation reconstruction, file/attachment carry-over, comment carry-over, view reconstruction, verification) to the exact mcp-notion read tools and mcp-obsidian write tools that perform it.
