---
title: "Phase 006/006-meta-bind: Deep research to optimize the Meta Bind mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, ox-alpha via cli-opencode/OpenRouter, early convergence allowed) investigating what to add, update, or create in references/plugins/meta-bind/* so an AI can operate the Meta Bind plugin more reliably at the file layer, with emphasis on resolving the VERIFY-flagged now() timestamp-expression grammar and the js action signature used by the Notion-style task-timer buttons."
trigger_phrases:
  - "006 meta-bind deep research"
  - "Meta Bind reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind"
    last_updated_at: "2026-08-22T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "scaffolded as bound spec_folder for the Meta Bind deep-research run"
    next_safe_action: "run /deep:research:auto bound to this folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-006-meta-bind"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Phase 006/006-meta-bind: Meta Bind reference-docs deep research

---

## 1. PURPOSE

Investigate what to add, update, or create in `references/plugins/meta-bind/*` (the mcp-obsidian file-layer reference tree for the Meta Bind plugin) so an AI can operate the plugin more reliably. The run researches the real plugin (repository `mProjectsCode/obsidian-meta-bind-plugin`, id `obsidian-meta-bind-plugin`, docs, and the installed compiled `main.js`) and targets current gaps, with emphasis on the syntax that drives the Notion-style start/stop task-timer buttons documented this session.

## 2. RESEARCH TOPIC

What should be added, updated, or created in the mcp-obsidian Meta Bind file-layer reference docs (`references/plugins/meta-bind/*`) to optimize an AI's ability to operate this plugin? Resolve the two VERIFY-flagged unknowns: (1) the exact expression grammar for a `now()`-style timestamp written into frontmatter by a button (the metadata/JS-expression form Meta Bind actually accepts), and (2) the precise signature and options of the `js` inline-button action (script path resolution, arguments passed, and how it couples to the JS Engine plugin). Confirm input-field and button-block syntax against the real plugin, and identify missing workflows and gotchas. Research only; do not edit the shipped docs.

<!-- ANCHOR:open-questions -->
## 3. OPEN QUESTIONS

- Meta Bind expression grammar for now()-style timestamps
- JS inline-button action signature and script path resolution
- JS action coupling to the JS Engine plugin
- Input-field and button-block syntax confirmation
- Missing workflows and gotchas in current reference docs
<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:research-context -->
## 4. RESEARCH CONTEXT

Deep-research is active for this topic. The canonical research output lives in `research/research.md`. This spec.md receives only bounded seed context and a post-synthesis findings block.
<!-- /ANCHOR:research-context -->
