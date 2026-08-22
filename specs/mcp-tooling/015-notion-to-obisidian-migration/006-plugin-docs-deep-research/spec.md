---
title: "Phase 006: Per-plugin deep research to optimize mcp-obsidian plugin docs"
description: "Phase parent for five per-plugin deep-research runs (4 iterations each, GLM-5.2 via cli-devin, early convergence allowed) that investigate what to add, update, or create in the mcp-obsidian file-layer plugin references to optimize an AI's ability to operate each plugin. Research only; doc edits are a separate follow-up build."
trigger_phrases:
  - "006 plugin docs deep research"
  - "per-plugin deep research mcp-obsidian"
  - "optimize plugin references research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "scaffolded 5 per-plugin deep-research children; launching runs"
    next_safe_action: "run 5 deep-research loops; synthesize doc-update recommendations"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-plugin-docs-deep-research"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Phase 006: Per-plugin deep research to optimize mcp-obsidian plugin docs

---

## 1. ROOT PURPOSE

Run one focused deep-research loop per plugin that has a dedicated mcp-obsidian file-layer reference tree, to discover what should be **added, updated, or created** in those docs so an AI can operate the plugin more reliably. Each run researches the real plugin (repository, docs, compiled `main.js`) and targets the reference tree's current gaps — especially the `VERIFY`-flagged unknowns that could not be confirmed when the references were first authored.

---

## 2. WHAT NEEDS DONE

- For each of the five plugins, produce a `research/research.md` that recommends concrete doc updates (new workflows, confirmed data-model keys, gotchas, and any new reference document worth creating).
- Keep the runs research-only. Applying the recommendations to the shipped `references/plugins/<name>/*` docs is a separate follow-up build, gated on operator review of the findings.

---

## 3. SUB-PHASE LIST

| Phase | Folder | Plugin |
|---|---|---|
| 001 | `001-advanced-canvas/` | Advanced Canvas |
| 002 | `002-claudian/` | Claudian |
| 003 | `003-project-manager/` | Project Manager |
| 004 | `004-dataview/` | Dataview |
| 005 | `005-notion-bases/` | Notion Bases |

Each child is the bound spec_folder / write authority for one `/deep:research:auto` run: 4 iterations max, early convergence allowed, executor `cli-devin` model `glm-5-2` effort high.
