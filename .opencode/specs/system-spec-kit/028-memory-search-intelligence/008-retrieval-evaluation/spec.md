---
title: "Feature Specification: Retrieval Evaluation & Post-027/002 Research Angles"
description: "Research the retrieval-evaluation + measurement angle space (A1-A8) the shipped 027/002 015-019 search-intelligence work opened up — eval harness on the now-working cosine gate, isotonic calibration, gate/rank divergence, cold-tier re-measurement, unified semantic substrate, reindex-as-consolidation, shadow-eval methodology."
trigger_phrases:
  - "028 retrieval evaluation research"
  - "post-027-002 angles deep research"
  - "memory eval harness isotonic calibration"
  - "gate rank divergence shadow-eval"
  - "reindex as consolidation semantic substrate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/008-retrieval-evaluation"
    last_updated_at: "2026-06-17T14:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 008; dispatched wave-1 (A1/A4/A6) Opus via claude2"
    next_safe_action: "Bank wave-1 seats; continue 20-iter angle research per recipe"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-008-retrieval-evaluation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Feature Specification: Retrieval Evaluation & Post-027/002 Research Angles

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 027/002 shipped phases 015-019 to the live Memory MCP (cosine-gate fix, truncation safety, verdict aggregation, generic-query routing, confidence calibration incl. a flag-off isotonic infra, cosine reorder, output parity, responsive reindex, daemon maintenance-grace). The 028/007 ↔ 027/002 reconciliation (`../research/synthesis/07`) found this **changed the ground** under both research efforts: it fixed the *broken request-quality gate* (measurement was structurally impossible before), and surfaced flag-off / deferred / unmeasured levers. Eight research angles (A1-A8) emerged that neither the 016 research nor the 028/007 campaign covered.

### Purpose
Research those angles to evidence-backed, code-mapped answers — primarily a **memory-retrieval eval harness (A1, keystone)** that makes every recall candidate measurable on the now-working gate, plus calibration/divergence/substrate/consolidation/methodology angles. Each candidate is **novelty-diffed** vs the 016 research + the 028/007 roadmap. Research-only — the packet ends at the candidate list + a measurement plan.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of the live Memory MCP (`.opencode/skills/system-spec-kit/mcp_server/`) post-015-019 + the 027/002 shipped narrative.
- Designing an eval harness (golden set + label schema + metrics) on the now-working cosine gate.
- Novelty-diff vs the 016 research (027/002) + the 028/007 roadmap (`synthesis/06`).
- Candidate proposals + a doctrine-class tag (correctness-always-on vs intelligence-shadow-gated), 20 iterations, Opus 4.8 via claude2.

### Out of Scope
- Implementing any candidate or building the harness (deferred to a later packet).
- Modifying the live Memory MCP code or the 027/002 shipped work.
- Re-mining the external memory systems (that was 007); this is the internal eval/measurement frontier.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate cites a live internal seam + the angle it answers | Internal file:line + angle id (A1-A8) per candidate |
| REQ-002 | Every candidate is novelty-tagged vs 016 + 028/007 | EXTENDS / NET-NEW / NO-TRANSFER tag per candidate |
| REQ-003 | Candidates ranked by leverage × effort + doctrine-class | Ranked table in research.md with correctness-vs-shadow-gated class |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains code-mapped candidates for the angle space, each citing an internal seam + novelty-tagged vs 016 + 028/007.
- **SC-002**: The eval-harness keystone (A1) has a concrete golden-set + label + metric + reindex-precondition design; the remaining angles (A2-A8) each have a GO / NEEDS-BENCHMARK / NO-TRANSFER verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Re-surfacing 016 / 028/007 findings | Low novelty | Mandatory novelty-diff vs both efforts |
| Risk | Early saturation (8 angles, 20 iters) | Fewer iterations than budget | Broaden angles; mark genuine saturation, do not pad |
| Dependency | Deferred corpus reindex (gate-zero) | Recall angles un-measurable until it runs | Design the harness now; flag reindex as the first implementation step |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- A1: What golden-set + label schema + metrics make Memory MCP retrieval measurable on the now-working cosine gate, and does eval scaffolding already exist internally?
- A2: How to collect real labels, fit, validate, and promote 017/S4's flag-off isotonic calibration?
- A4: When do the cosine gate and the RRF rank disagree, and what does the divergence signal?
- A6: Can 027's semantic-trigger + the 028/007 semantic-edge-layer + the fused-summary-channel collapse into one embeddable-channel framework?
- A7/A8: Can async sleep-time reorganization host inside 018's responsive reindex, and which shadow metrics predict promotion-worthiness?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research output**: See `research/research.md`.
- **Source of the angles**: `../research/synthesis/07-reconciliation-with-027-002.md` + `06-memory-systems-findings.md`.
- **Parent Spec**: See `../spec.md`.
<!-- /ANCHOR:related-docs -->
