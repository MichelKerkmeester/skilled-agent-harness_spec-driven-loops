---
title: "Research and Diagnosis Phase Parent"
description: "Phase parent grouping the investigative work that diagnosed GPT-backed OpenCode deep-loop routing, identity, and orchestration failures."
trigger_phrases:
  - "gpt reliability research and diagnosis"
  - "deep-loop gpt behavioral hardening research"
  - "031 research and diagnosis"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/001-research-and-diagnosis"
    last_updated_at: "2026-07-04T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Regrouped research 007 and 034 into the research-and-diagnosis track"
    next_safe_action: "Parent complete; diagnosis feeds fix tracks 002-007"
    blockers: []
    key_files:
      - "spec.md"
      - "001-gpt-behavioral-hardening-research/research/research.md"
      - "002-gpt-reliability-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-031-001-research-and-diagnosis-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Behavioral-hardening research (001, formerly 007): key questions answered with file:line evidence across multiple lineages."
      - "GPT-reliability research (002, formerly top-level 034): iterative xhigh investigation, verified findings, ranked synthesis."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research and Diagnosis Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | complete |
| **Created** | 2026-07-04 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-deep-loop/025-deep-loop-gpt-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GPT-backed OpenCode mis-handled deep-loop routing, host identity, and orchestration. Before any fix could land, the failure modes had to be characterized with evidence. This track groups the two investigative packets that produced that diagnosis.

### Purpose
Hold the research and diagnosis work that the downstream fix tracks build on. Detailed evidence lives in each child's `research/` subtree.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed planning and evidence live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Behavioral-hardening research characterizing GPT deep-loop behavior (child 001, formerly 007).
- GPT-reliability research: iterative investigation, findings registry, ranked synthesis (child 002, formerly top-level 034).

### Out of Scope
- The fixes themselves (owned by the downstream tracks 002-007).
- Re-running the investigations already recorded in each child's research subtree.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Maintain | parent | Root purpose and child map |
| `description.json` | Generator-owned | parent | Search metadata for this phase parent |
| `graph-metadata.json` | Generator-owned | parent | Child identity and phase graph metadata |
| `001-gpt-behavioral-hardening-research/spec.md` | Regrouped | 001 | Behavioral-hardening research (from 031/007) |
| `002-gpt-reliability-research/spec.md` | Regrouped | 002 | GPT-reliability research (from top-level 034) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-gpt-behavioral-hardening-research/` | Behavioral-hardening research (formerly 031/007) | COMPLETE |
| 002 | `002-gpt-reliability-research/` | GPT-reliability research (formerly top-level 034) | COMPLETE |

### Phase Transition Rules

- Each child owns its own research evidence and findings.
- Parent state follows the completed child research.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Inspect one research/diagnosis surface | Child `spec.md` + research subtree name scope and evidence |
| child | parent | Child research complete | Findings feed the downstream fix tracks |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at the parent level. Detailed evidence lives in each child's `research/` subtree.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
- **Child phases**: `001-gpt-behavioral-hardening-research/`, `002-gpt-reliability-research/`
