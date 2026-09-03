---
title: "Iteration 7: Plugin Requirements — Required vs Optional, Install/Config Notes"
trigger_phrases: []
---
# Iteration 7: Plugin Requirements — Required vs Optional, Install/Config Notes

## Focus
Every Obsidian plugin required to close a Notion feature gap, ranked required-vs-optional against mcp-obsidian's existing plugin knowledge, with install and configuration notes.

## Findings

### F7.1 — Plugin Rank Matrix

| Plugin | Priority | Covers Notion feature | Install method | Config by agent? | mcp-obsidian knows? |
|---|---|---|---|---|---|
| **Notion Bases** (`bgarciamoura/obsidian-notion-bases-plugin`) | **P0 — Required** | Relations, rollups, formulas, 7 views (Board/Gallery/Calendar/Timeline/Chart), subtasks, Lookup columns | Community Plugins (Settings → Community Plugins → Browse → "Notion Bases") or BRAT | Agent writes `_database.md` schema files; plugin reads them | No (out of scope for mcp-obsidian) |
| **Dataview** | **P1 — High rec.** | Custom rollup queries, cross-DB aggregations, inline fields, task queries | Community Plugins | Agent writes DQL code blocks into notes | Yes — full plugin knowledge (workflows, data-model, troubleshooting) |
| **Tasks** | P2 — Conditional | recurring tasks (Notion recurring date property) | Community Plugins | Agent writes task markdown `- [ ]` with dates | Yes — in plugin references |
| **Obsidian Git** | P2 — Recommended | vault backup, version history, multi-device sync | Community Plugins | Agent can init git in vault | Yes — full plugin knowledge |
| **Notion Bases viewer** (not a separate plugin) | N/A | Reading `.base` files — built into core Obsidian v1.9+ | Ships with Obsidian | Agent writes `.base` files | Yes — via mcp-obsidian notesmd-cli `create` |
| **Kanban** (community) | P3 — Optional | Dedicated Kanban board view (only if Notion Bases board view insufficient) | Community Plugins | Schema via plugin config files | No |
| **Calendar** / **Full Calendar** | P3 — Optional | Dedicated calendar view (only if Notion Bases calendar view insufficient) | Community Plugins | Schema via plugin config files | No |
| **BRAT** (Obsidian42) | P3 — Optional | Install beta/unlisted plugins (needed only if Notion Bases is installed via BRAT instead of Community Plugins) | Community Plugins | Agent writes `data.json` config | Yes — full plugin knowledge |
| **Iconic** | P4 — Cosmetic | File/folder icons (replaces Notion page icons) | Community Plugins | Agent writes rulebook (`iconic-rules.full.json`) | Yes — full plugin knowledge (21 file + 11 folder rules) |
| **Excalidraw** | P4 — Optional | Replace Notion inline drawings | Community Plugins | File-layer operations | Yes — full plugin knowledge |

[SOURCE: mcp-obsidian SKILL.md §8 — plugin references: Dataview, Git, BRAT, Iconic, Excalidraw]
[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — installation and features]

### F7.2 — Minimum Viable Plugin Stack for Complex Migration

```
Required (must install before reconstruction):
  1. Notion Bases plugin — P0, without it relations/rollups/formulas/extra views are lost
  2. Dataview — P1, needed for custom aggregations the plugin doesn't surface

Conditional:
  3. Tasks — only if recurring-task databases exist in Notion workspace

Recommended:
  4. Obsidian Git — vault backup across the migration window (humans make mistakes)
```

All four are installable via Community Plugins within Obsidian (Settings → Community Plugins). None require external accounts or tokens (unlike Notion's API integration).

[SOURCE: mcp-obsidian SKILL.md §3 — notesmd-cli install path]

### F7.3 — Plugins Beyond mcp-obsidian's Knowledge

Two required plugins are NOT in mcp-obsidian's current plugin knowledge:

| Plugin | What's missing in mcp-obsidian | Impact |
|---|---|---|
| **Notion Bases** (`bgarciamoura/obsidian-notion-bases-plugin`) | No data-model/workflows/troubleshooting docs in mcp-obsidian references | Agent cannot advise on plugin-specific schema errors without the plugin README or documentation |
| Tasks-rendering behavior | Tasks plugin has its own markdown conventions (due dates, recurrence syntax) | Agent can write standard task markdown; plugin renders it |

Mitigation: The Notion Bases plugin stores everything in Markdown frontmatter (`_database.md`), which the agent CAN read and write without plugin-specific knowledge. The plugin reads its config from the same files. The agent only needs to know the schema format (documented in the plugin's README).

[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — how data is stored]
[SOURCE: mcp-obsidian SKILL.md §8 — plugin reference list]

### F7.4 — Plugin Installation Automation

The human must install plugins once (click "Install" in Obsidian). The AI agent then:

1. **Notion Bases**: Agent creates `folder/_database.md` files with schema → plugin loads configuration automatically
2. **Dataview**: Agent writes DQL code blocks into notes → Dataview renders them on note open
3. **Tasks**: Agent writes `- [ ] 📅 2026-09-01 🔁 every week` → Tasks plugin picks it up
4. **Obsidian Git**: Agent runs `git init` in the vault via Bash, adds `.gitignore` for Obsidian config files

[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — how data is stored section]
[SOURCE: mcp-obsidian references/plugins/dataview/workflows.md — DQL query authoring]
[SOURCE: mcp-obsidian references/plugins/git/workflows.md — vault git init]

## Sources Consulted
- bgarciamoura/obsidian-notion-bases-plugin README
- mcp-obsidian SKILL.md §8 — full plugin reference list
- mcp-obsidian references/plugins/dataview/ (index, data-model, workflows)
- mcp-obsidian references/plugins/git/ (index, workflows)
- mcp-obsidian references/plugins/brat/ (index, workflows)
- mcp-obsidian references/plugins/iconic/ (index, workflows)
- prior-findings.md §3 — plugin stack

## Assessment
- newInfoRatio: 0.75
- noveltyJustification: "Complete plugin matrix with install methods, priority ranking, agent-configurability, and mcp-obsidian coverage gaps — prior-findings named the plugins but not the install/config details or agent role"
- Confidence: High — plugin knowledge from mcp-obsidian references + plugin READMEs

## Reflection
- What worked: The plugin rank matrix makes it immediately clear what to install and where the agent can help vs where human action is needed
- What failed: Notion Bases plugin is not in mcp-obsidian's references — agent must rely on the plugin's own documentation for schema format
- Ruled out: Expecting the human to learn plugin config syntax — agent should write schema files

## Recommended Next Focus
KQ-6: Parity verification — how to confirm no silent data loss, including the full acceptance checklist automation