---
title: "Phase 006/001-advanced-canvas: Deep research to optimize the Advanced Canvas mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/advanced-canvas/* so an AI can operate the Advanced Canvas plugin more reliably at the file layer, with emphasis on the extended .canvas JSON schema (cross-portal edge serialization is currently VERIFY)."
trigger_phrases:
  - "006 advanced-canvas deep research"
  - "Advanced Canvas reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/001-advanced-canvas"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "scaffolded as bound spec_folder for the Advanced Canvas deep-research run"
    next_safe_action: "run /deep:research:auto bound to this folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-001-advanced-canvas"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Phase 006/001-advanced-canvas: Advanced Canvas reference-docs deep research

---

## 1. PURPOSE

Investigate what to add, update, or create in `references/plugins/advanced-canvas/*` (the mcp-obsidian file-layer reference tree for the Advanced Canvas plugin) so an AI can operate the plugin more reliably. The run researches the real plugin (repository, docs, compiled `main.js`) and targets current gaps, with emphasis on the extended .canvas JSON schema (cross-portal edge serialization is currently VERIFY).

## 2. RESEARCH TOPIC

What should be added, updated, or created in the mcp-obsidian Advanced Canvas file-layer reference docs (`references/plugins/advanced-canvas/*`) to optimize an AI's ability to operate this plugin? Resolve the VERIFY-flagged unknowns, confirm data-model keys against the real plugin, and identify missing workflows, gotchas, and any new reference document worth creating. Research only; do not edit the shipped docs.

## 3. OPEN QUESTIONS

- Optimize the mcp-obsidian advanced-canvas file-layer reference docs for AI operation. Research the real plugin (repo developer-mike/obsidian-advanced-canvas, docs, and the installed main.js v6.5.4) to resolve the VERIFY-flagged cross-portal (interdimensional) edge serialization, confirm the extended .canvas JSON node and edge keys, and find missing workflows and gotchas. Recommend concrete additions or updates to references/plugins/advanced-canvas/.

## 4. RESEARCH CONTEXT

Deep-research is active for this topic. The canonical research output is `research/research.md`. This run is research-only; do not edit shipped docs under `references/plugins/`.
