---
title: "Feature Specification: Skill Advisor — External Mining"
description: "Mine aionforge query-class routing, deterministic RRF, and Beta-posterior governance plus galadriel ambient mining for the Skill Advisor 5-lane fusion scorer."
trigger_phrases:
  - "028 skill advisor mining"
  - "advisor query class routing"
  - "deterministic rrf fusion"
  - "lane weight auto tuning"
  - "ambient trigger harvest"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed skill-advisor child spec for the deep-research loop"
    next_safe_action: "Run /deep:research:auto on this folder (ceiling 10 @0.03)"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-003-skill-advisor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Skill Advisor — External Mining

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
The Skill Advisor fuses five fixed-weight lanes (explicit-author 0.42, lexical 0.28, graph-causal 0.13, derived 0.12, semantic-shadow 0.05) with no query-class routing and a non-deterministic weighted sum. Aionforge encodes mandatory query-class routing, deterministic RRF, and bounded reliability-weighted governance; galadriel encodes ambient auto-classified mining.

### Purpose
Produce evidence-backed, code-mapped improvement candidates for the Skill Advisor by mining the external systems, ranked by leverage and effort.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of `external/aionforge-memory-development/docs/**` and `external/galadriel-public-main 2/harness/**`.
- Mapping techniques to the lane-fusion and recommendation code.

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
| REQ-002 | Candidates cover query-class routing, deterministic RRF fusion, bounded-posterior auto-tuning, semantic-lane exact-rerank, ambient trigger harvest | All themes addressed |
| REQ-003 | Candidates ranked by leverage × effort | Ranked table in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains code-mapped candidates, each citing an external source and an internal Skill Advisor module (lane-fusion or recommendation code).
- **SC-002**: Candidates cover query-class routing, deterministic RRF fusion, bounded-posterior auto-tuning, semantic-lane exact-rerank, and ambient trigger harvest.
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

- Would intent-aware query-class routing improve lane weighting over the fixed 0.42/0.28/0.13/0.12/0.05 split?
- Does deterministic RRF (fixed order, stable tiebreak, zero-weight elision) remove the comparable-score problem in the current weighted sum?
- Can a bounded Beta-posterior auto-tune lane weights from outcomes without over-fitting to a few signals?
- Can the semantic-shadow lane graduate from 0.05 via an exact-rerank pass?
- Is an ambient, off-budget trigger-harvest pass worth adding for niche-skill discovery?
- Which of these generalize to the Memory MCP recall path?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research output**: See `research/research.md`.
- **Parent Spec**: See `../spec.md`.
<!-- /ANCHOR:related-docs -->
