---
title: "Feature Specification: Code Graph Phase Parent"
description: "Phase parent for 8 code graph implementation plans derived from packet 028 research."
trigger_phrases:
  - "028 code graph implementation parent"
  - "code graph child phase map"
  - "code graph implementation planning"
  - "028 code graph candidate tail"
  - "code graph research to implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph"
    last_updated_at: "2026-06-19T06:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Wired Code Graph as a phase parent with 8 implementation sub-phases"
    next_safe_action: "Use the child map to implement PENDING code graph candidates in dependency order"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "001-001-determinism-walk-order/spec.md"
      - "008-008-doc-symbol-lane/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-code-graph-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The code graph research child now routes to 8 implementation child folders."
      - "Packet 030 remains the Wave-0 shipped evidence record for DONE rows."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Code Graph Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-16 |
| **Updated** | 2026-06-19 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code graph research surfaced candidate work across deterministic traversal, edge lifecycle, readiness, parser resilience and doc-symbol coverage. This parent needs to route those candidate groups to child folders while keeping code-level planning out of the subsystem root.

### Purpose
Provide the subsystem root purpose and implementation phase map for the Code Graph portion of packet 028. The child folders own the detailed specs, plans, tasks and validation evidence.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for the 8 Code Graph implementation child folders.
- A phase-documentation map that names each implementation sub-phase and current planning status.
- A research-input pointer for the evidence packet that fed these child plans.

### Out of Scope
- Implementing the Code Graph candidates.
- Editing packet 030.
- Rewriting the subsystem research artifacts.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify | parent | Parent purpose and child map |
| `description.json` | Refresh | parent | Search metadata for the parent |
| `graph-metadata.json` | Refresh | parent | Child identity and parent graph metadata |
| `[0-9][0-9][0-9]-*/**` | Maintain | child phases | Implementation planning owned by child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

Research input: `research/research.md` remains the subsystem source packet for candidate evidence and citations.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-001-determinism-walk-order/` | Deterministic graph traversal order | Planned |
| 002 | `002-002-edge-staleness-correctness/` | Edge staleness and correctness checks | Planned |
| 003 | `003-003-generation-watermark/` | Hard generation watermark readiness | Planned |
| 004 | `004-004-code-edge-bitemporal/` | Bi-temporal edge lifecycle | Planned |
| 005 | `005-005-seeded-ppr-ranking/` | Seeded PPR impact ranking | Planned |
| 006 | `006-006-edge-governance-vocab/` | Shared edge governance vocabulary | Planned |
| 007 | `007-007-parser-resilience/` | Parser failure recovery and quarantine | Planned |
| 008 | `008-008-doc-symbol-lane/` | Documentation symbol extraction lane | Planned |

### Phase Transition Rules

- Each child folder owns its own `spec.md`, `plan.md`, `tasks.md` and level-required validation docs.
- Parent status changes only after child strict validation passes.
- Use `/speckit:resume system-spec-kit/028-memory-search-intelligence/002-code-graph/[NNN-phase]/` to resume a specific child.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Select the next PENDING candidate group | Child `spec.md` names gate, scope and evidence |
| child | parent | Child reaches strict validation green | `validate.sh <child> --strict` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. Candidate questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research input**: `research/research.md`
- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
