---
title: "Findings: AI-driven Notion-to-Obsidian migration with plugin-aided feature recovery"
description: "Evidence log for the best 2026 approach to migrate complex Notion workspaces to Obsidian: official importer (API vs HTML), native Bases, feature-recovery plugins, the phased process, and the AI agent's file-layer role. Sourced from Obsidian help and current migration write-ups."
trigger_phrases:
  - "notion obsidian migration findings"
  - "obsidian bases notion databases"
  - "notion api importer obsidian"
  - "dataview rollups relations migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Logged web-research evidence and synthesis"
    next_safe_action: "Optionally convert into an mcp-obsidian migration playbook"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-015-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Findings: AI-driven Notion-to-Obsidian migration with plugin-aided feature recovery

<!-- SPECKIT_LEVEL: 2 -->

> The landscape shifted in 2025–2026: Obsidian gained a native database feature (**Bases**, core since v1.9) and the official Importer gained a **Notion API** mode. Migration is far less lossy than the old Markdown-export route — but complex relational data still needs deliberate reconstruction.

---

## 1. THE LOAD-BEARING DECISION: WHICH IMPORTER

The official Obsidian Importer offers two Notion paths, and the choice determines how much survives.

| Dimension | Notion **API** import (recommended for complex spaces) | **HTML `.zip`** import |
|---|---|---|
| Databases | Preserved → converted to **Bases** | **Lost** (rows become plain notes + CSV) |
| Formulas | Converted where an Obsidian equivalent exists | Lost |
| Prerequisites | Notion integration token (`ntn_…`) + internet | None — offline, no token |
| Known gaps | Only the **primary view** per database; **linked data sources not imported**; People `name()`/`email()` and Text `style()`/`unstyle()` do not convert; relations & rollups need verification; large workspaces hit API rate limits | Database views, properties, formulas, relations, rollups all gone |
| Attachments / hierarchy / internal links | Preserved | Preserved |

Two hard rules from the official docs:
- For the file route, **export as HTML, not Markdown** — "We recommend that you do not use Notion's Markdown export as it omits important data."
- The API importer is explicitly **new**; relations/rollups are flagged "verify." Treat imported relational data as suspect.

**Verdict:** API import for a database-heavy workspace — it is the only path that reconstructs views and formulas as Bases automatically. Fall back to HTML only when a token cannot be minted.

---

## 2. THE NATIVE REPLACEMENT: BASES

**Bases** is a core Obsidian plugin (shipped in v1.9, mid-2025; syntax overhaul in 1.9.2). It turns note **frontmatter properties** into table / board / card views, defined by `.base` files and stored as plain Markdown — so unlike Notion, the database behavior is portable and survives export.

**The gap:** Bases has **no two-way relational schema and no rollups** out of the box — you can link notes, but sum/count/avg-across-related-databases is not native. This is the single most important thing to plan around for a relational Notion workspace.

---

## 3. RECOVERING THE MISSING FEATURES (PLUGIN STACK)

| Missing Notion feature | Recover with | Notes |
|---|---|---|
| Database views (table/board/cards) | **Bases** (native) | Default target of the API importer |
| **Relations + rollups**, extra views (Gallery/Calendar/Timeline/Gantt), spreadsheet formulas, subtasks | **Notion Bases** community plugin (`bgarciamoura/obsidian-notion-bases-plugin`) | 7 views, 18 column types incl. Relation/Lookup/Rollup/Formula; rollups = sum/count/avg/min/max/count_values/list; subtasks up to 3 levels via self-relations; every row a `.md` file + `_database.md` schema; complements native Bases |
| Relations/rollups without a new plugin | **Dataview** | Query frontmatter across `[[linked]]` notes; rollups become `SUM`/`COUNT` over linked pages. Already in `mcp-obsidian` plugin knowledge |
| Recurring tasks | **Tasks** | For Notion's recurring-task databases |
| Kanban | Bases **board** view, or the Kanban plugin | |
| Calendar | Bases **calendar** view, or Calendar / Full Calendar | |
| Toggles / callouts | Native Obsidian **callouts** / `<details>` | No plugin needed |

---

## 4. THE MIGRATION PROCESS (TEST-VAULT-FIRST)

Every credible source converges on the same shape: **reconstruct workflows, not files.**

1. **Inventory.** Mark each item *must-preserve / rebuild / retire*. Focus on active workflows (daily notes, recurring tasks, project status, meeting follow-up), and explicitly list every database, property, relation, rollup, formula, and view.
2. **Test vault.** Keep Notion untouched. Import a representative **sample** into a throwaway vault — one ordinary page, one nested page, one linked page, one attachment, one database — and verify it against an acceptance checklist before the full run.
3. **Import.** API path: create an internal Notion integration, copy the secret to a password manager, grant it content access to the target pages/databases, then Importer → "Notion (API)" → paste token → choose scope → run (budget for rate limits on large spaces).
4. **Reconstruct.** Rebuild relations, rollups, and secondary views the importer dropped.
5. **Acceptance checklist.** Must-preserve pages exist; important internal links resolve; attachments open locally; database rows that matter exist with correct property names/types; every formula/rollup has a tested replacement **or a recorded limitation**; a new daily note lands in the right folder with the right template; one task moves capture→completion without duplication; the vault has a backup + multi-device plan. **Keep Notion live until this passes.**

---

## 5. THE AI AGENT'S ROLE (FILE-LAYER LEVERAGE)

The in-app Importer is a human clicking buttons; the AI cannot drive it. The agent's value is the file-layer work **around** the import — exactly the `mcp-obsidian` "operate the data, not the UI" doctrine.

- **Pre-flight inventory** — enumerate every database, relation, rollup, and formula (via the Notion API or the export tree); produce the must-preserve / rebuild / retire ledger so nothing silently vanishes.
- **Post-import reconstruction (highest value):**
  - **Rebuild dropped relations** — the importer keeps only the primary view and often leaves relation columns as raw text/IDs; rewrite those into `[[wikilinks]]` in frontmatter so Bases/Dataview can traverse them again.
  - **Author `.base` files and Dataview queries** for secondary views and rollups the importer skipped — one per former database.
  - **CSV → notes** (HTML route): explode each database CSV into one note-per-row with typed frontmatter — the shape Bases and the Notion Bases plugin expect.
  - **Normalize frontmatter** across thousands of notes (consistent property names/types), fix broken internal links, convert Notion callouts/toggles, dedupe.
- **Programmatic verification** — run the acceptance checklist as pass/fail checks: grep for orphaned links and missing attachments, detect property-type mismatches, confirm each `.base` renders the expected row count.

**Honest boundaries:** a human runs the in-app Importer (or hands the agent a Notion token to pull via the API and write files directly). Because the API importer is new and relations/rollups are flagged "verify," the relational reconstruction is where the real work lives — budget for it rather than assuming the import "just worked."

---

## 6. SOURCES

- Obsidian Help — Import from Notion: https://obsidian.md/help/import/notion
- Obsibrain — Notion→Obsidian: API vs HTML checklist: https://www.obsibrain.com/blog/notion-to-obsidian-migration-a-complete-guide-and-checklist
- alphonsolabs — What survives, what breaks: https://www.alphonsolabs.com/notion-obsidian-migration-checklist/
- XDA — Obsidian Bases vs Notion databases (relations/rollups limits): https://www.xda-developers.com/notion-databases-great-but-obsidian-bases-better/
- GitHub — Notion Bases plugin (relations/rollups/formulas): https://github.com/bgarciamoura/obsidian-notion-bases-plugin
