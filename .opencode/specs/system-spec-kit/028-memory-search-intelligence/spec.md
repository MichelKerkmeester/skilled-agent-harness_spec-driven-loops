---
title: "Feature Specification: Memory Search Intelligence (Phase Parent)"
description: "Phase parent for mining two external memory systems (galadriel, aionforge) into evidence-backed improvements for the four internal retrieval subsystems."
trigger_phrases:
  - "028 memory search intelligence"
  - "external memory systems research"
  - "galadriel aionforge mining"
  - "memory retrieval improvements"
  - "deep research improvement roadmap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence"
    last_updated_at: "2026-06-17T10:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "008 retrieval-eval CLOSED (12/20 saturation); synthesis/08 + C9-A8 build spine"
    next_safe_action: "Children 001-008 all complete; implementation is a separate later packet"
    blockers: []
    key_files:
      - "spec.md"
      - "handover.md"
      - "research/roadmap.md"
      - "001-speckit-memory/research/research.md"
      - "002-code-graph/research/research.md"
      - "003-skill-advisor/research/research.md"
      - "004-deep-loop/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-memory-search-intelligence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cross-cutting spine themes that span >1 subsystem: determinism, bi-temporal currentness, query-class routing, graceful degradation, bounded reliability-weighted learning, idempotent async consolidation."
      - "Each child sustained ~4-7 productive iterations before genuine saturation; ~54 candidates surfaced total."
      - "027-revisit (child 005, 50 iters): 028 is net-additive to 027 (0 supersedes, 0 contradicts; EXTENDS x6/ALREADY-COVERED x1/NO-TRANSFER x3); 027's shipped doctrine reverse-validates 028's deflation."
      - "Sibling + cross-cutting (child 006, 50 iters → 200 total): Advisor/Code-Graph x 027 mostly EXTENDS; net-new cross-cutting wins (ANN tie-stability, constitutional self-edit guard, source_kind-gated render escaper); deferred C1/QCR/codegraph-bi-temporal; refuted cross-cutting-C8; procedural downgraded to proxy-only."
      - "Fresh-agent review (10 read-only Opus seats) integrated ~30 synthesis refinements: de-GOd Q1-C1/Q6-C1, folded 006 net-new into 01, dropped-candidate recovery; RV5 coverage CLEAN."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose, sub-phase list, high-level outcome
-->

# Feature Specification: Memory Search Intelligence (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two mature open-source memory engines are vendored under `external/` — galadriel (Python memory-palace) and aionforge-memory (Rust retrieval substrate). They encode retrieval, consolidation, and currentness techniques that the project's own four retrieval subsystems do not yet use. Without a structured mining effort, that prior art stays unread and the internal systems keep their known gaps (no query-class routing, flag-based currentness, write-blocking consolidation, non-deterministic fusion).

### Purpose
Run a decomposed deep-research campaign that mines the two external systems for concrete, code-mapped improvement candidates for the four internal subsystems, and synthesizes them into one ranked, cross-cutting improvement roadmap. This packet ends at the roadmap; implementation is a separate, later decision.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Per-phase research, findings, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of the two external systems under `external/`.
- Per-subsystem deep-research loops producing cited, code-mapped improvement candidates.
- A consolidated cross-cutting improvement roadmap ranked by leverage × effort.
- A cross-packet revisit (child 005) reconciling packet 027's shipped refinements against the 028 findings.

### Out of Scope
- Implementing any of the improvement candidates (deferred to a later packet).
- Modifying the external reference systems.
- Changing the internal subsystems' code this round.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-speckit-memory/research/**` | Create | 001 | Memory MCP research artifacts |
| `002-code-graph/research/**` | Create | 002 | Code graph research artifacts |
| `003-skill-advisor/research/**` | Create | 003 | Skill advisor research artifacts |
| `004-deep-loop/research/**` | Create | 004 | Deep loop research artifacts |
| `research/roadmap.md` | Create | parent | Cross-cutting improvement roadmap |
| `005-revisit-027/research/**` | Create | 005 | Cross-packet 027-revisit research artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all research detail and continuity live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-speckit-memory/` | Mine external systems for Spec-Kit Memory MCP improvements (PRIMARY) | Complete |
| 002 | `002-code-graph/` | Mine external systems for Code Graph improvements | Complete |
| 003 | `003-skill-advisor/` | Mine external systems for Skill Advisor improvements | Complete |
| 004 | `004-deep-loop/` | Mine external systems for Deep Loop runtime improvements | Complete |
| 005 | `005-revisit-027/` | Cross-packet revisit: reconcile 027's shipped refinements against the 028 findings | Complete |
| 006 | `006-sibling-revisit/` | Sibling-subsystem revisit (028 Advisor + Code-Graph × 027) + aionforge-procedural + GO re-verify | Complete |
| 007 | `007-memory-systems/` | Mine external memory systems (Mem0/Graphiti/Letta/Cognee) for Memory MCP search-intelligence (+ Advisor fusion, Deep-Loop continuity); 4-model sweep | Complete (22/40, saturation) |
| 008 | `008-retrieval-evaluation/` | Research the retrieval-evaluation + post-027/002 angle space (A1-A8) the shipped 015-019 work opened up; Opus-via-claude2 | Complete (12/20, saturation) |

### Phase Transition Rules

- Each phase runs its own `/deep:research` loop independently.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume system-spec-kit/028-memory-search-intelligence/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Memory research.md emitted | `research.md` exists; state.jsonl terminal stop reason |
| 002 | 003 | Code-graph research.md emitted | `research.md` exists; state.jsonl terminal stop reason |
| 003 | 004 | Skill-advisor research.md emitted | `research.md` exists; state.jsonl terminal stop reason |
| 004 | parent | All four research.md emitted | Cross-cutting roadmap synthesized |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which external techniques generalize across more than one internal subsystem (the roadmap spine)?
- How many real iterations does each child sustain before genuine saturation?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md and research artifacts.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
