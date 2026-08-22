---
title: "Feature Specification: 015 Notion→Obsidian flawless-migration — research then adopt-or-build into mcp-obsidian + mcp-notion"
description: "Phase parent for a flawless complex-Notion→Obsidian migration capability: research first (20 iterations, GLM-5.2 via cli-devin + DeepSeek V4 Flash xhigh via cli-opencode/Cline, no early convergence), then synthesize into whatever phase children mcp-obsidian + mcp-notion need — including any Obsidian plugins that close a gap."
trigger_phrases:
  - "015-notion-to-obisidian-migration"
  - "notion to obsidian migration"
  - "migrate notion obsidian"
  - "flawless notion obsidian migration"
  - "complex notion workspace migration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "converted 015 to phase parent; 001-deep-research child scaffolded, seeded with prior findings"
    next_safe_action: "launch 20-iter deep research bound to 001-deep-research"
    blockers: []
    key_files:
      - "spec.md"
      - "001-deep-research/spec.md"
      - "001-deep-research/prior-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-notion-to-obisidian-migration"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: 015 Notion→Obsidian flawless-migration

---

## 1. ROOT PURPOSE

We need to **flawlessly migrate a COMPLEX Notion environment** — databases, relations, rollups, formulas, nested pages, files, comments, views — **fully into Obsidian**, using the `mcp-notion` (24-tool Notion MCP) and `mcp-obsidian` (Local REST API + notesmd CLI + plugins) skills as the migration engine, and adding Obsidian plugins where they close a gap the skills cannot.

A prior single-pass web-research note (preserved as `001-deep-research/prior-findings.md`) already sketched the shape of this problem — importer choice, Bases as the database replacement, plugin-recovered relations/rollups — but it was not exhaustive and predates a dedicated research loop. So the decomposition is **research first** (deep, multi-model, no early convergence, seeded by that prior note), **then autonomously synthesize → phase → implement**, rather than committing to a migration design before the gaps are mapped.

---

## 2. WHAT NEEDS DONE

- Produce a verified, repeatable method for migrating a complex Notion workspace into Obsidian with no silent data loss — relations, rollups, formulas, nested hierarchy, files/attachments, comments, and views all accounted for (preserved, reconstructed, or explicitly logged as a limitation).
- Decide how `mcp-notion` (as the Notion-side reader) and `mcp-obsidian` (as the Obsidian-side writer) drive each step of that method, and which Obsidian plugins (e.g. Notion Bases, Dataview) are required to close feature gaps.
- Bake the verified capability into the two skills (and install any proven plugin), so the migration is a repeatable, agent-driven capability rather than a one-off manual playbook.

---

## 3. SUB-PHASE LIST

| Phase | Folder | Outcome |
|---|---|---|
| **001 — Deep research** | `001-deep-research/` | 20-iteration deep research (10x GLM-5.2 via cli-devin + 10x DeepSeek V4 Flash xhigh via cli-opencode/Cline, no early convergence), seeded by the preserved prior findings — everything needed for a flawless complex Notion→Obsidian migration. |
| 002+ — provisional | *(pending 001 verdict)* | Synthesize the research recommendations, author phase children, and implement into `mcp-obsidian` + `mcp-notion` plus install any proven Obsidian plugins. Their exact shape is decided by the 001 research verdict. |

Later phases are intentionally left provisional: their structure depends on the 001 verdict, so decomposing them now would presume the answer.
