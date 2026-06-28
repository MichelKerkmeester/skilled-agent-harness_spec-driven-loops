---
title: "Feature Specification: Reference Research — Loop-Systems Improvement"
description: "A 50-iteration deep-research run mining vendored loop-cli-main + kasper into a ranked, deduplicated backlog of 40 improvements to our loop systems."
trigger_phrases:
  - "loop reference research"
  - "loop-cli kasper mining"
  - "loop improvement recommendations"
  - "agent loops research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/001-reference-research"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed 51 proper iterations; synthesized research.md (40 recommendations)"
    next_safe_action: "Implement recommendations via the sibling 002-implementation phase tree"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reference Research — Loop-Systems Improvement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | `002-implementation` |
| **Handoff Criteria** | Ranked recommendation backlog synthesized in `research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our loop systems had unquantified gaps in resilience, convergence quality, observability, safety, and interconnection. We needed concrete, evidence-backed, portable improvements rather than speculation.

### Purpose
Mine two vendored reference codebases (`external/loop-cli-main`, `external/kasper`) over many deep-research iterations and synthesize a ranked, deduplicated, actionable improvement backlog.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only mining of the two reference repos; mapping mechanisms onto our subsystems; synthesis into `research/research.md` + `research/resource-map.md`.

### Out of Scope
- Implementing the improvements (delegated to the sibling `002-implementation`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Ranked backlog of 40 recommendations |
| `research/resource-map.md` | Create | Coverage map from convergence evidence |
| `research/iterations/`, `research/deltas/` | Create | Per-iteration findings + delta streams |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | ≥50 proper (non-converging) iterations | 51 proper iterations recorded; zero early-stop events |
| REQ-002 | Ranked, deduplicated, actionable backlog | `research/research.md` present with 40 items + evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 40 distinct recommendations, each with reference `file:line` + OUR target file + difficulty + quick-win/deep-rewrite tag.
- **SC-002**: Dependency order documented (research §6) for downstream sequencing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Reference repos under `external/` | Citations resolve intra-packet | Kept vendored in this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — phase complete; open implementation questions live in `002-implementation` child phases.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
**Given**
**Given**
-->
