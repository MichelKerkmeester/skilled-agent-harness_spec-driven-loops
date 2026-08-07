---
title: "Feature Specification: deep-* skills release cleanup (000-release-cleanup phase parent)"
description: "Phase parent holding the deep-* skill release-cleanup work as a flat list of standalone specs: one release-cleanup spec per skill plus each skill's follow-on remediation specs."
trigger_phrases:
  - "deep skills release cleanup"
  - "000-release-cleanup"
  - "deep-* release cleanup arc"
  - "deep skill release cleanup specs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "flattened to 15 standalone specs; bridge in context-index"
    next_safe_action: "validate recursive then reindex memory graph"
    blockers: []
    key_files:
      - "context-index.md"
      - "001-deep-loop-runtime-release-cleanup/spec.md"
      - "007-deep-review-release-cleanup/spec.md"
      - "013-deep-agent-improvement-release-cleanup/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "116-000-release-cleanup-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Structure: flat phase parent — 15 standalone release-cleanup specs (no nested sub-parents)"
      - "Naming: skill-prefixed; each skill's own cleanup is its '<skill>-release-cleanup' spec, followed by that skill's remediation specs"
      - "Flatten history (old bucket/sub-paths -> new) lives in context-index.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: deep-* skills release cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-26 |
| **Branch** | `main` |
| **Parent Spec** | `116-deep-skill-evolution/spec.md` |
| **Parent Packet** | skilled-agent-orchestration/116-deep-skill-evolution |
| **Handoff Criteria** | Parent + each spec pass `validate.sh --strict --recursive`; metadata + memory index reflect the flat layout |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five deep-* skills (`deep-loop-runtime`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-agent-improvement`) each required release-cleanup work — documentation alignment, reference splits, gate-model reconciliation, finding remediation, and citation hygiene — captured as a release-cleanup spec per skill plus follow-on remediation specs surfaced by the per-skill deep-research and deep-review loops.

### Purpose

Hold all of that release-cleanup work as a single flat list of standalone specs directly under this parent, so any one piece is findable without descending through per-skill sub-parents. Names are skill-prefixed so each spec's owning skill stays explicit.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning, tasks, checklists, decisions, and implementation summaries live in each child spec folder. The flatten history (old bucket/sub-paths → new) lives in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 15 standalone release-cleanup specs (`001`..`015`), each a leaf with its own full docs and evidence
- The lean trio (`spec.md`, `description.json`, `graph-metadata.json`) at this parent

### Out of Scope

- Modifying any deep-* skill source code from this parent level
- Re-narrating per-spec cleanup decisions here (they live in each spec's docs)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each row is a standalone spec (a leaf). Specs are grouped by skill; the first per skill is that skill's own release-cleanup, followed by its remediation specs.

| # | Folder | Focus | Status |
|---|--------|-------|--------|
| 001 | `001-deep-loop-runtime-release-cleanup/` | deep-loop-runtime release cleanup (core) | In Progress |
| 002 | `002-deep-loop-runtime-doc-remediation/` | deep-loop-runtime doc remediation | In Progress |
| 003 | `003-deep-loop-runtime-evergreen-citation-sweep/` | evergreen-citation sweep across deep-* skills | In Progress |
| 004 | `004-deep-loop-runtime-reference-asset-alignment/` | reference + asset alignment | In Progress |
| 005 | `005-deep-research-release-cleanup/` | deep-research release cleanup (core) | In Progress |
| 006 | `006-deep-research-reference-split/` | deep-research reference split + router alignment | In Progress |
| 007 | `007-deep-review-release-cleanup/` | deep-review release cleanup (core) | In Progress |
| 008 | `008-deep-review-gate-model-reconciliation/` | deep-review gate-model reconciliation | In Progress |
| 009 | `009-deep-review-phase5-doc-cluster-remediation/` | deep-review phase-5 doc-cluster remediation | In Progress |
| 010 | `010-deep-review-phase5-reducer-cluster-remediation/` | deep-review phase-5 reducer-cluster remediation | In Progress |
| 011 | `011-deep-ai-council-release-cleanup/` | deep-ai-council release cleanup (core) | In Progress |
| 012 | `012-deep-ai-council-deep-mode-docs-and-tests/` | deep-ai-council deep-mode docs + script tests | In Progress |
| 013 | `013-deep-agent-improvement-release-cleanup/` | deep-agent-improvement release cleanup (core) | In Progress |
| 014 | `014-deep-agent-improvement-benchmark-threshold-and-profile-path/` | benchmark-threshold + profile-path fixes | In Progress |
| 015 | `015-deep-agent-improvement-deep-research-followon-findings/` | deep-research follow-on finding remediation | In Progress |

### Phase Transition Rules

- Each spec is independently executable; specs carry no implicit ordering dependency.
- Run `validate.sh --recursive` on this parent to validate all specs as a unit.
- Resume on this parent follows `graph-metadata.json.derived.last_active_child_id`; if absent, pick a spec from the table above.
<!-- /ANCHOR:phase-map -->

---

## RELATED DOCUMENTS

- **Parent**: `116-deep-skill-evolution/spec.md`
- **Flatten history bridge**: `context-index.md`
- **Children**: 15 standalone specs enumerated above
- **Graph Metadata**: see `graph-metadata.json` for `children_ids` and `derived.last_active_child_id`
