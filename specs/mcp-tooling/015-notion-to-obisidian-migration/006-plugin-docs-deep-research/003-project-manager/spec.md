---
title: "Phase 006/003-project-manager: Deep research to optimize the Project Manager mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/project-manager/* so an AI can operate the Project Manager plugin more reliably at the file layer, with emphasis on the pm-task frontmatter schema (customFields non-scalar encoding and recurrence fields currently VERIFY)."
trigger_phrases:
  - "006 project-manager deep research"
  - "Project Manager reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/003-project-manager"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "scaffolded as bound spec_folder for the Project Manager deep-research run"
    next_safe_action: "run /deep:research:auto bound to this folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-003-project-manager"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Phase 006/003-project-manager: Project Manager reference-docs deep research

---

## 1. PURPOSE

Investigate what to add, update, or create in `references/plugins/project-manager/*` (the mcp-obsidian file-layer reference tree for the Project Manager plugin) so an AI can operate the plugin more reliably. The run researches the real plugin (repository, docs, compiled `main.js`) and targets current gaps, with emphasis on the pm-task frontmatter schema (customFields non-scalar encoding and recurrence fields currently VERIFY).

## 2. RESEARCH TOPIC

What should be added, updated, or created in the mcp-obsidian Project Manager file-layer reference docs (`references/plugins/project-manager/*`) to optimize an AI's ability to operate this plugin? Resolve the VERIFY-flagged unknowns, confirm data-model keys against the real plugin, and identify missing workflows, gotchas, and any new reference document worth creating. Research only; do not edit the shipped docs.
