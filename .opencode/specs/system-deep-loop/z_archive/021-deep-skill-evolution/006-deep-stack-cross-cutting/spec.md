---
title: "Feature Specification: deep-stack cross-cutting"
description: "Phase parent for deep-* work that spans the whole stack rather than a single skill: a unique-value differentiation audit, deep-* command relocation, and documentation evolution across the five deep-* skills."
trigger_phrases:
  - "deep-stack cross-cutting"
  - "deep skills differentiation audit"
  - "deep commands relocation"
  - "deep skill documentation evolution"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/006-deep-stack-cross-cutting"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "created cross-cutting cluster from three folded sources"
    next_safe_action: "Resume a child leaf or validate the cluster"
    blockers: []
    key_files:
      - "context-index.md"
      - "001-unique-value-differentiation/spec.md"
      - "002-commands-relocation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000606"
      session_id: "116-006-cross-cutting"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Theme: cross-stack deep-* work (not tied to one skill)"
      - "Leaves: differentiation audit, command relocation, documentation evolution (x3)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: deep-stack cross-cutting

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/116-deep-skill-evolution |
| **Predecessor** | `../005-deep-agent-improvement/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | Each leaf passes `validate.sh` independently; cluster validates `--recursive` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Some deep-* work does not belong to any single skill: auditing where the skills' use cases overlap, relocating the shared `deep:*` command assets, and evolving documentation conventions across all five skills at once. Left as separate one-leaf clusters, these inflate the root manifest without carrying single-skill weight.

### Purpose

Group the cross-stack deep-* work under one phase parent so the root reads cleanly while each piece keeps its own leaf with full planning and evidence.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, tasks, checklists, decisions, and implementation summaries live in the child phase folders. The history of how these leaves were grouped lives in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The unique-value differentiation audit across deep-review / deep-research / deep-ai-council.
- Relocation of deep-* command assets and cross-runtime reference updates.
- Documentation-evolution work across the five deep-* skills.

### Out of Scope

- Per-skill behavioral changes (those live in the per-skill clusters 001–005).
- Skill source code beyond documentation/command-asset relocation.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-unique-value-differentiation/**` | Existing | differentiation | Audit evidence (preserved) |
| `002-commands-relocation/**` | Existing | commands | Command relocation spec + evidence (preserved) |
| `003-005-doc-evolution-*/**` | Existing | doc-evolution | Documentation-evolution leaves (preserved) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder. Implementation details live inside each leaf.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-unique-value-differentiation/` | Audit comparing deep-review vs deep-research vs deep-ai-council to sharpen each skill's unique use case | Complete |
| 2 | `002-commands-relocation/` | Relocate deep-* command assets; update cross-runtime references | Active |
| 3 | `003-doc-evolution-spec-and-resource-map/` | Documentation-evolution spec and resource map across the deep-* skills | Active |
| 4 | `004-doc-evolution-research-gap-backstop/` | Deep-research gap backstop for the documentation-evolution delta | Active |
| 5 | `005-doc-evolution-post-impl-deep-review/` | Post-implementation deep-review of the documentation-evolution work | Active |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently.
- Use `/spec_kit:resume 116-deep-skill-evolution/006-deep-stack-cross-cutting/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on this cluster to validate all phases together.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-unique-value-differentiation` | `002-commands-relocation` | Differentiation boundaries documented | Leaf validates |
| `003-doc-evolution-spec-and-resource-map` | `004-doc-evolution-research-gap-backstop` | Doc-evolution spec + resource map exist | Leaf validates |
| `004-doc-evolution-research-gap-backstop` | `005-doc-evolution-post-impl-deep-review` | Gap backstop research complete | Leaf validates |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether the differentiation audit (001) should periodically re-run as the per-skill clusters evolve.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Fold history**: `context-index.md`
- **Phase children**: sub-folders `001-005`
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)
