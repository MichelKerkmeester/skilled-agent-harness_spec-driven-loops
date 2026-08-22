---
title: "Phase 006/002-claudian: Deep research to optimize the Claudian mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/claudian/* so an AI can operate the Claudian plugin more reliably at the file layer, with emphasis on the in-vault .claude/* config schemas (currently VERIFY beyond observed path strings)."
trigger_phrases:
  - "006 claudian deep research"
  - "Claudian reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "scaffolded as bound spec_folder for the Claudian deep-research run"
    next_safe_action: "run /deep:research:auto bound to this folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-002-claudian"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Phase 006/002-claudian: Claudian reference-docs deep research

---

## 1. PURPOSE

Investigate what to add, update, or create in `references/plugins/claudian/*` (the mcp-obsidian file-layer reference tree for the Claudian plugin) so an AI can operate the plugin more reliably. The run researches the real plugin (repository, docs, compiled `main.js`) and targets current gaps, with emphasis on the in-vault .claude/* config schemas (currently VERIFY beyond observed path strings).

## 2. RESEARCH TOPIC

What should be added, updated, or created in the mcp-obsidian Claudian file-layer reference docs (`references/plugins/claudian/*`) to optimize an AI's ability to operate this plugin? Resolve the VERIFY-flagged unknowns, confirm data-model keys against the real plugin, and identify missing workflows, gotchas, and any new reference document worth creating. Research only; do not edit the shipped docs.

## 3. OPEN QUESTIONS

- Optimize the mcp-obsidian claudian file-layer reference docs for AI operation. Research the real plugin (repo YishenTu/claudian, id realclaudian, docs, and the installed main.js v2.2.4) to confirm the in-vault .claude config schemas (mcp.json, claudian-settings.json, settings.json, commands, skills), provider setup, and MCP wiring currently flagged VERIFY. Recommend concrete additions or updates to references/plugins/claudian/.

## 4. RESEARCH CONTEXT

Deep-research is active for this topic. The canonical research output is `research/research.md`. This run is research-only; do not edit shipped docs under `references/plugins/`.
