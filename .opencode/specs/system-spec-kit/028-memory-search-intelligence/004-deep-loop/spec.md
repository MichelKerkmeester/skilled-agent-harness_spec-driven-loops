---
title: "Feature Specification: Deep Loop Runtime — External Mining"
description: "Mine aionforge bounded Beta posterior, contradiction-edge quarantine, transient/fatal recovery, and observability gauges plus galadriel ambient reflection for the deep-loop runtime."
trigger_phrases:
  - "028 deep loop mining"
  - "convergence calibration"
  - "contradiction quarantine"
  - "fan out recovery"
  - "cost guard enforcement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed deep-loop child spec for the deep-research loop"
    next_safe_action: "Run /deep:research:auto on this folder (ceiling 10 @0.03)"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-004-deep-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Deep Loop Runtime — External Mining

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop runtime's Bayesian convergence scorer, coverage-graph contradiction handling, council adjudicator weighting, fan-out recovery, and cost guards are hardcoded or advisory. Aionforge encodes a bounded reliability-weighted Beta posterior (flood-resistant), non-destructive contradiction-edge quarantine, transient/fatal recovery with durable retries, and lag/pending/failed observability gauges; galadriel encodes threaded ambient reflection.

### Purpose
Produce evidence-backed, code-mapped improvement candidates for the deep-loop runtime by mining the external systems, ranked by leverage and effort.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of `external/aionforge-memory-development/docs/**` and `external/galadriel-public-main 2/**`.
- Mapping techniques to the convergence, coverage-graph, fan-out, and adjudication code.

### Out of Scope
- Implementing the candidates.
- Touching the other three subsystems.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate cites an external source and an internal module | Source path + internal file named per candidate |
| REQ-002 | Candidates cover flood-resistant convergence calibration, trust-keyed contradiction quarantine, resumable fan-out recovery, enforceable cost ceiling with backpressure | All themes addressed |
| REQ-003 | Candidates ranked by leverage × effort | Ranked table in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains code-mapped candidates, each citing an external source and an internal deep-loop module (convergence, coverage-graph, fan-out, or adjudication code).
- **SC-002**: Candidates cover flood-resistant convergence calibration, trust-keyed contradiction quarantine, resumable fan-out recovery, and an enforceable cost ceiling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Early convergence | Fewer iterations than budget | Broaden scope / add key questions, then resume a new generation |
| Dependency | External doc readability | Weak or unsupported mappings | Cite file:line per candidate; mark inferences |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Can a bounded reliability-weighted Beta posterior make convergence resistant to a flood of weak findings?
- Should contradictions be modeled as edges that quarantine the lower-trust finding rather than dropping either side?
- Can fan-out recovery classify branches transient vs fatal and retry from durable state instead of re-running the whole loop?
- What is the minimal enforceable cost ceiling with observable backpressure (lag/pending/failed gauges)?
- Does galadriel's threaded ambient reflection suggest cheaper cross-iteration question continuity?
- Which of these reuse the same primitives as the Memory MCP and code-graph candidates?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research output**: See `research/research.md`.
- **Parent Spec**: See `../spec.md`.
<!-- /ANCHOR:related-docs -->
