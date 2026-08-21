---
title: "Research: AI-driven migration of complex Notion spaces to Obsidian"
description: "Findings on the best current (2026) approach for an Obsidian-literate AI agent to migrate complex Notion workspaces to Obsidian: importer choice (Notion API vs HTML .zip), native Bases as the database replacement, the plugins that recover relations/rollups/extra views, and the agent's file-layer role."
trigger_phrases:
  - "notion to obsidian migration"
  - "migrate notion obsidian"
  - "notion obsidian bases dataview"
  - "obsidian importer notion api"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Captured web-research findings on AI-driven Notion-to-Obsidian migration"
    next_safe_action: "Optionally convert findings into an mcp-obsidian migration playbook reference"
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-015-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "API import vs HTML import for complex database-heavy spaces (API import)"
      - "Native database replacement in Obsidian (Bases, core since v1.9)"
      - "How to recover relations/rollups Bases lacks (Notion Bases community plugin or Dataview)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Research: AI-driven migration of complex Notion spaces to Obsidian

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. QUESTION

What is the best current (2026) way for an AI agent with file-layer Obsidian knowledge (the `mcp-obsidian` mode of this `mcp-tooling` hub) to migrate a **complex** Notion workspace — databases, relations, rollups, formulas, nested pages — into Obsidian, using plugins to recover the features that do not survive the export?

---

## 2. SCOPE

- **In scope:** importer selection, Obsidian's native database feature (Bases), the plugin stack that recovers lost Notion features, the phased migration process, and the specific parts an AI agent should own at the file layer.
- **Out of scope:** building the migration tooling, any change to shipped runtime, and the reverse direction (Obsidian → Notion).
- **Relationship to other packets:** consumes the plugin knowledge in `013-mcp-obsidian` (Dataview, Tables, Excalidraw). Informs, but does not depend on, `014-mcp-notion`.

---

## 3. FINDINGS

Full evidence log with sources is in [`research.md`](./research.md). Headline conclusions:

1. **Importer choice is the load-bearing decision.** The official Obsidian Importer now has a **Notion API mode** that converts databases and formulas into **Bases**; the HTML `.zip` mode does not preserve databases at all. For a complex space, use API import.
2. **Bases (Obsidian core since v1.9) is the native Notion-database replacement** — but it has **no two-way relations and no rollups** out of the box.
3. **Plugins recover the gap:** the **Notion Bases** community plugin adds relations, rollups, extra view types and spreadsheet formulas; **Dataview** is the no-extra-plugin alternative for relational queries.
4. **The AI's leverage is the file-layer work around the in-app importer:** pre-flight inventory, post-import relation reconstruction (`[[wikilinks]]` in frontmatter), authoring `.base` files and Dataview queries, CSV-to-notes explosion, and programmatic verification.

---

## 4. STATUS

Research complete. This packet is a findings record, not an implementation. Any build work (e.g. a migration playbook baked into `mcp-obsidian`) would be a separate, gated packet.
