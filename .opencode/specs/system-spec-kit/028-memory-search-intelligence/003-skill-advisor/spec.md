---
title: "Feature Specification: Skill Advisor Phase Parent"
description: "Phase parent for 7 Skill Advisor implementation plans derived from packet 028 research."
trigger_phrases:
  - "028 skill advisor implementation parent"
  - "skill advisor child phase map"
  - "advisor implementation planning"
  - "028 skill advisor candidate tail"
  - "skill advisor research to implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor"
    last_updated_at: "2026-06-19T06:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Wired Skill Advisor as a phase parent with 7 implementation sub-phases"
    next_safe_action: "Use the child map to implement PENDING advisor candidates after the shared RRF foundation"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "001-rrf-determinism-spine/spec.md"
      - "007-outcome-weighted-ranking-followon/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-skill-advisor-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The skill-advisor research child now routes to 7 implementation child folders."
      - "Packet 030 remains the Wave-0 shipped evidence record for DONE rows."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill Advisor Phase Parent

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
The Skill Advisor research surfaced candidate work across deterministic fusion, lane health, embedding freshness, query routing, drift metrics and outcome-weighted ranking. This parent needs to route those candidate groups to child folders while keeping implementation detail in the child specs.

### Purpose
Provide the subsystem root purpose and implementation phase map for the Skill Advisor portion of packet 028. The child folders own the detailed specs, plans, tasks and validation evidence.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for the 7 Skill Advisor implementation child folders.
- A phase-documentation map that names each implementation sub-phase and current planning status.
- A research-input pointer for the evidence packet that fed these child plans.

### Out of Scope
- Implementing the Skill Advisor candidates.
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
| 001 | `001-rrf-determinism-spine/` | Shared RRF determinism spine | Implemented (default-off) |
| 002 | `002-runtime-lane-health-degrade/` | Runtime lane health and fallback scoring | Implemented |
| 003 | `003-embedding-staleness-signal/` | Embedding freshness signal | Partial (signal implemented) |
| 004 | `004-c4-shadow-seam-beta-posterior/` | C4 shadow path and beta posterior | Implemented (shadow-only, live NO-GO) |
| 005 | `005-conflict-rerank-query-routing/` | Conflict rerank and query routing | Implemented (default-off) |
| 006 | `006-provenance-drift-observability/` | Provenance drift observability | Partial |
| 007 | `007-outcome-weighted-ranking-followon/` | Outcome-weighted ranking follow-on | Implemented (shadow-only, live NO-GO) |

### Phase Transition Rules

- Each child folder owns its own `spec.md`, `plan.md`, `tasks.md` and level-required validation docs.
- Parent status changes only after child strict validation passes.
- Use `/speckit:resume system-spec-kit/028-memory-search-intelligence/003-skill-advisor/[NNN-phase]/` to resume a specific child.

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
