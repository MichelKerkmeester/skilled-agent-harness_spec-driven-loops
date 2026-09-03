---
title: "Iteration 9: AI Agent Programmatic Migration vs Human-in-the-Loop"
trigger_phrases: []
---
# Iteration 9: AI Agent Programmatic Migration vs Human-in-the-Loop

## Focus
Can the AI agent drive the entire Notion→Obsidian migration programmatically via mcp-notion + mcp-obsidian, or is human-in-the-loop always required for some steps?

## Findings

### F9.1 — Human-Required (Cannot Be Automated)

| Step | Why human-required | Workaround |
|---|---|---|
| **Install and enable Obsidian plugins** | Plugins require clicking "Install" in the Obsidian UI; no programmatic plugin installation API exists | Agent can write schema files (`_database.md` for Notion Bases, DQL blocks for Dataview, `.base` files for core Bases) — the plugin reads its config from these files. Human just clicks "Enable" once. |
| **Create Notion internal integration** | Must be done in Notion UI (`Settings → Integrations → Internal Integration`) | Agent provides step-by-step instructions + the tool name to grant content access |
| **Run the in-app Obsidian Importer** | Importer is a UI-only feature; no CLI/API version exists | Agent provides the Notion token, the target vault path, and the scope. Human pastes the token and clicks "Import." |
| **Verify formula output by eye** | Formula engine differences mean only a human can confirm correctness | Agent flags all formulas that DON'T have an Obsidian equivalent; human verifies a sample |
| **Accept/reject folder structure** | Obsidian structure is a usability decision | Agent presents 2-3 options with trade-offs; human chooses |

[SOURCE: prior-findings.md §5 — "human runs the in-app Importer"]
[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — installation via Community Plugins]
[SOURCE: mcp-obsidian SKILL.md §4 — never auto-modify config files]

### F9.2 — AI-Automatable (Zero Human Touch)

| Phase | Automatable steps | Tools |
|---|---|---|
| **Pre-flight inventory** | Enumerate all databases, data sources, properties, relations, rollups, formulas, views, comments, users, files | mcp-notion (24 tools + 5 direct API calls) |
| **Create cross-reference** | Build UUID → filename map for relation rewrite | mcp-notion query-data-source → map creation |
| **Write acceptance criteria** | Generate must-preserve/rebuild/retire ledger from inventory | Agent reasoning + mcp-notion schema data |
| **Post-import relation reconstruction** | Rewrite raw relation UUIDs to `[[wikilinks]]` | notesmd-cli `search-content` + `frontmatter` loop |
| **Create plugin schema files** | Write `_database.md` per database with column types, view config | notesmd-cli `create` + mcp-obsidian file-layer writes |
| **Write Dataview queries** | Generate DQL code blocks for rollups and custom views | notesmd-cli `create`/`frontmatter` |
| **Normalize frontmatter** | Standardize property names/types across thousands of notes | notesmd-cli `frontmatter` batch operations |
| **Run parity verification** | Execute the automated acceptance checklist | Bash script + notesmd-cli |
| **Generate migration report** | Summarize what was preserved, what was rebuilt, what gaps remain | Agent synthesis |
| **Git init vault backup** | Initialize git repo in the vault | `git init` via Bash |

[SOURCE: mcp-notion SKILL.md §3 — full 24-tool + 5 API gap surface]
[SOURCE: mcp-obsidian SKILL.md §7 — notesmd-cli command cheat sheet]
[SOURCE: prior-findings.md §5 — agent's file-layer value]

### F9.3 — The Hybrid Migration Flow

```
Human: Creates Notion integration → shares pages → installs Obsidian plugins
  ↓
AI (mcp-notion): Full workspace inventory → produces migration ledger
  ↓
Human: Runs Obsidian Importer (API mode) with the token AI prepared
  ↓
AI (mcp-obsidian): Verifies import → flags discrepancies
  ↓
AI (mcp-obsidian): Reconstructs relations → writes _database.md → writes .base files
  ↓
AI (mcp-obsidian): Writes Dataview queries → normalizes frontmatter
  ↓
AI (mcp-obsidian): Runs automated parity check → produces report
  ↓
Human: Sign-off on report OR requests fixes
```

Total human active time: ~15-30 minutes (three UI interactions: create integration, install plugins, run importer).
Total AI autonomous time: variable depending on workspace size (30 min to 4+ hours for large workspaces at API rate limits).

[SOURCE: prior-findings.md §4 — test-vault-first process adapted for AI automation]
[SOURCE: mcp-notion/references/api-gap-tools.md §8 — rate limits set the pace]

### F9.4 — Where the AI Adds the Most Value (Ranked)

| Value | Task | Time saved vs manual |
|---|---|---|
| **HIGHEST** | Relation reconstruction (rewriting UUIDs → wikilinks across 100s of notes) | Hours of manual grep/replace |
| **HIGH** | Inventory (enumerating every DB, property, view, file) | Would take a human days for complex workspaces |
| **HIGH** | Creating _database.md schema files per database | Hand-authoring YAML schemas is error-prone |
| **MEDIUM** | Running the parity check (automated script vs manual clicking) | 15 min automated vs 2+ hours manual |
| **MEDIUM** | Frontmatter normalization across 1000s of notes | Manual is tedious and inconsistent |
| **LOW (but important)** | Writing Dataview queries | Human would need to learn DQL syntax |

[SOURCE: prior-findings.md §5 — "post-import reconstruction (highest value)"]
[SOURCE: prior-findings.md §5 — programmatic verification as value-add]

### F9.5 — Is Fully Autonomous Migration Possible?

**Short answer**: Not today. The Obsidian Importer is a GUI-only surface. The Notion Bases plugin installation is a GUI-only surface. Both require human clicks.

**Medium-term answer** (speculative): If Obsidian adds a CLI-based import command (e.g., `obsidian import notion --token ntn_...`) and plugin installation via CLI, the entire flow becomes AI-autonomous. No evidence such a CLI exists in 2026.

**Best answer for this phase**: Design the migration process as a hybrid model where the human handles 3 GUI interactions and the AI handles everything else. This is the "flawless" path: the AI does the heavy lifting, the human provides the UI access.

[SOURCE: prior-findings.md §5 — honest boundaries section]
[SOURCE: mcp-obsidian SKILL.md §3 — official obsidian CLI exists but only for opens/URIs, not import]

## Sources Consulted
- prior-findings.md §4, §5
- mcp-notion SKILL.md §3, §7
- mcp-obsidian SKILL.md §3, §4, §7
- mcp-obsidian SKILL.md §4 — "never auto-modify config files"
- bgarciamoura/obsidian-notion-bases-plugin README

## Assessment
- newInfoRatio: 0.8
- noveltyJustification: "Hybrid flow design with exact human-vs-AI step mapping, value ranking, and autonomy outlook is new — prior-findings only said 'human runs the Importer'"
- Confidence: High — each constraint is source-confirmed

## Reflection
- What worked: The hybrid flow diagram makes the division of labor immediately actionable
- What failed: Cannot predict if/when Obsidian will add a CLI import command — this is speculation
- Ruled out: Assuming full automation is possible today (blocked by Importer GUI + plugin install GUI)

## Recommended Next Focus
KQ-10: Rate limits, batching strategies, large-workspace considerations, and remaining gaps — pre-synthesis wrap-up