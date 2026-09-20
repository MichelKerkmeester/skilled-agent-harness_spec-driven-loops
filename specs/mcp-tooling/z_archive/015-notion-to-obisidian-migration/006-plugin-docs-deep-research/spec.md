---
title: "Phase 006: Per-plugin deep research to optimize mcp-obsidian plugin docs"
description: "Phase parent for seven per-plugin deep-research legs (GLM-5.2 via cli-devin for the first five, ox-alpha via cli-opencode/OpenRouter for the last two) that investigate what to add, update, or create in the mcp-obsidian file-layer plugin references to optimize an AI's ability to operate each plugin. Research only; doc edits are the phase 009 follow-up build."
trigger_phrases:
  - "006 plugin docs deep research"
  - "per-plugin deep research mcp-obsidian"
  - "optimize plugin references research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research"
    last_updated_at: "2026-08-22T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "All 7 legs synthesized into prioritized edit tables"
    next_safe_action: "Hand synthesis.md tables to phase 009 apply pass"
    blockers: []
    key_files:
      - "spec.md"
      - "001-advanced-canvas/synthesis.md"
      - "002-claudian/synthesis.md"
      - "003-project-manager/synthesis.md"
      - "004-dataview/synthesis.md"
      - "005-notion-bases/synthesis.md"
      - "006-meta-bind/synthesis.md"
      - "007-js-engine/synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-plugin-docs-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Phase 006: Per-plugin deep research to optimize mcp-obsidian plugin docs

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `005-obsidian-plugin-expansion` |
| **Successor** | `007-excalidraw-deprecation` |

---

## 1. ROOT PURPOSE

Run one focused deep-research leg per plugin that has a dedicated mcp-obsidian file-layer reference tree, to discover what should be **added, updated, or created** in those docs so an AI can operate the plugin more reliably. Each leg researches the real plugin (repository, docs, compiled `main.js`) and targets the reference tree's current gaps — especially the `VERIFY`-flagged unknowns that could not be confirmed when the references were first authored.

---

## 2. WHAT NEEDS DONE

- For each of the seven plugins, produce a `research/research.md` plus a fresh-reviewer `synthesis.md` that recommends a prioritized (P0/P1/P2), evidence-cited doc-update plan (new workflows, confirmed data-model keys, gotchas, and any new reference document worth creating).
- Keep the legs research-only. Applying the recommendations to the shipped `references/plugins/<name>/*` docs is the separate follow-up build in phase `009-apply-plugin-doc-recs`.

---

## 3. SUB-PHASE LIST

| Phase | Folder | Plugin | Executor |
|---|---|---|---|
| 001 | `001-advanced-canvas/` | Advanced Canvas | GLM-5.2 via cli-devin |
| 002 | `002-claudian/` | Claudian | GLM-5.2 via cli-devin |
| 003 | `003-project-manager/` | Project Manager (deliberately skipped — deprecated mid-packet) | N/A (fresh-reviewer verification only) |
| 004 | `004-dataview/` | Dataview | GLM-5.2 via cli-devin |
| 005 | `005-notion-bases/` | Notion Bases | Native executor (deep-loop append gateway blocked automated multi-iteration synthesis after iteration 1) |
| 006 | `006-meta-bind/` | Meta Bind | ox-alpha via cli-opencode/OpenRouter |
| 007 | `007-js-engine/` | JS Engine | ox-alpha via cli-opencode/OpenRouter (deep-loop append gateway blocked automated synthesis across 3 relaunches; direct-read fallback) |

Each child is the bound spec_folder / write authority for one research leg, reduced afterward into that leg's own fresh-reviewer `synthesis.md`.

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, synthesis, research provenance) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-advanced-canvas/` | Advanced Canvas reference-docs deep research | Complete |
| 002 | `002-claudian/` | Claudian reference-docs deep research | Complete |
| 003 | `003-project-manager/` | Project Manager reference-docs deep research (deliberate skip + verification) | Complete |
| 004 | `004-dataview/` | Dataview reference-docs deep research | Complete |
| 005 | `005-notion-bases/` | Notion Bases reference-docs deep research | Complete |
| 006 | `006-meta-bind/` | Meta Bind reference-docs deep research | Complete |
| 007 | `007-js-engine/` | JS Engine reference-docs deep research | Complete |

### Phase Transition Rules

- Each leg MUST pass `validate.sh` independently before its `synthesis.md` is handed to phase 009
- This phase parent tracks aggregate progress via this map
- Use `/speckit:resume mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/[NNN-plugin]/` to resume a specific leg
- Run `validate.sh --recursive` on this phase parent to validate all seven legs as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-007 | `009-apply-plugin-doc-recs` | Every leg's `synthesis.md` contains a prioritized, cited P0/P1/P2 edit table (or, for 003, a "no doc investment warranted" verdict) | `validate.sh <leg> --strict` Errors:0 per leg |
| 006, 007 | `009-apply-plugin-doc-recs` | The metadata-write recipe (`=now()` correction vs JS Engine execution context) is reconciled into one coherent recipe before either doc is edited | Cross-leg reconciliation named in both legs' `synthesis.md` §5 |
<!-- /ANCHOR:phase-map -->
