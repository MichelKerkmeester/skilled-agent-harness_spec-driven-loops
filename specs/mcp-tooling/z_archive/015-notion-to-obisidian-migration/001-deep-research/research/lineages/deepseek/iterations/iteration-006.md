---
title: "Iteration 6: Nested Page Hierarchy — Preservation and Reconstruction"
trigger_phrases: []
---
# Iteration 6: Nested Page Hierarchy — Preservation and Reconstruction

## Focus
How the API importer handles Notion's nested page hierarchy (sub-pages, parent-child relationships), what survives flat, and how to reconstruct deep nesting in Obsidian.

## Findings

### F6.1 — What the API Importer Does with Hierarchy

| Notion nesting pattern | API importer behavior | Example |
|---|---|---|
| Top-level pages | Preserved as top-level notes | `Project Alpha.md` |
| Nested sub-pages (1 level) | Preserved in folder hierarchy | `folder/Subpage.md` |
| Deep nesting (3+ levels) | Preserved as folder nesting | `folder/sub/sub-sub/DeepPage.md` |
| Database rows as pages | Rows become `.md` files in database folder | `Projects/Row Name.md` |
| Sub-pages under database rows | Folders under the row's file path | `Projects/Row Name/Subnote.md` |
| Linked pages (cross-reference, not parent-child) | Preserved as same-vault `[[wikilinks]]` | Wikilinks resolve within the vault |

**Verdict**: The API importer preserves folder hierarchy well. Deep nesting is NOT lost — each sub-page becomes a subfolder with its own Markdown file. This is a key advantage over the HTML export route, which flattens everything.

[SOURCE: prior-findings.md §1 — "Attachments / hierarchy / internal links: Preserved" for API path]
[SOURCE: Obsidian Help — Import from Notion: https://obsidian.md/help/import/notion]

### F6.2 — Remaining Hierarchy Gaps Despite Preservation

| Gap | What happens | Reconstruction needed? | AI agent's role |
|---|---|---|---|
| Notion "breadcrumb" parent references | Not written into notes | Optionally add a `parent:: [[Parent Note]]` frontmatter field | Script: for each note, resolve its folder path → write parent pointer |
| Nested page ordering | Notion's manual drag-reorder is lost | Notes appear alphabetically in folder | Add `order:: N` frontmatter; Dataview sort by it |
| Page icon as hierarchy indicator | Icon becomes `icon:` frontmatter property | Not a hierarchy issue | Agent can verify icon frontmatter exists |
| Cross-database page references | Same note may exist as a row AND as a standalone page | May create duplicates | Detect by title match during inventory; deduplicate |
| Nested templates | Template inheritance is Notion-specific | Must be manually recreated | Agent documents each template's structure; human recreates |

[SOURCE: prior-findings.md §4 — Migration Process: Reconstruction step]
[SOURCE: mcp-obsidian SKILL.md §7 — notesmd-cli frontmatter for scripted updates]

### F6.3 — Programmatic Hierarchy Verification

Post-import, the AI can verify hierarchy preservation:

```bash
# 1. Count directories vs expected parent pages
notesmd-cli list | grep "/" > nested_notes.txt
# 2. For each page that had sub-pages in Notion, confirm folder exists
# 3. Cross-reference page count against mcp-notion query-data-source count
# 4. Verify no orphaned notes (notes without parent that should have one)
```

For a Notion workspace with 500 pages, a complete hierarchy check takes minutes via CLI.

[SOURCE: prior-findings.md §5 — programmatic verification approach]

### F6.4 — "Flat or Nested" Decision for the Migration Plan

| Workspace characteristic | Recommended Obsidian structure | Reason |
|---|---|---|
| Shallow hierarchy (1-2 levels) | Preserve Notion folders as-is | API importer already does this |
| Deep hierarchy (5+ levels) | Preserve but consider flattening folders, use tags instead | Obsidian's graph view works better with tags than deep folders |
| Database-row pages with sub-pages | Keep in dedicated database folder | Notion Bases plugin expects row files in one folder |
| Mixed (some DB, some free-form pages) | Hybrid: database folders + flat page folders | Folder per data source, plus a flat "Pages" folder |

The AI agent should NOT decide the folder structure unilaterally — it should present options and let the human decide. The agent's job is to map the existing structure and preserver fidelity until the choice is made.

[SOURCE: prior-findings.md §4 — "reconstruct workflows, not files" principle]
[SOURCE: mcp-obsidian SKILL.md §3 — notesmd-cli move/rename for restructuring]

## Sources Consulted
- prior-findings.md §1, §4, §5
- mcp-obsidian SKILL.md §7 — notesmd-cli commands
- https://obsidian.md/help/import/notion
- mcp-notion/references/mcp-tools.md §5 — retrieve-a-page, retrieve-a-database

## Assessment
- newInfoRatio: 0.8
- noveltyJustification: "Hierarchy gap analysis (breadcrumbs, ordering, cross-DB duplicates, flat-or-nested decision) extends prior-findings which only noted 'preserved' with no detail"
- Confidence: High — importer behavior from official docs + plugin knowledge

## Reflection
- What worked: Breaking a single 'preserved' claim into 7 sub-items with actionable verification
- What failed: Cannot confirm importer's exact folder-naming behavior without a live test vault
- Ruled out: Assuming importer preserves ALL hierarchy metadata (it preserves filesystem structure, NOT visual ordering or parent references)

## Recommended Next Focus
KQ-5: Detailed analysis of all required vs optional Obsidian plugins — install/config notes for each