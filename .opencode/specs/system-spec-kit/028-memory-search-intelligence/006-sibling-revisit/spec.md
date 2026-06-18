---
title: "Feature Specification: Sibling-Subsystem Revisit + Follow-ups (028 × 027)"
description: "Cross-packet deep-research child extending 005: reconcile 028's Skill-Advisor + Code-Graph findings against 027's shipped advisor/code-graph code, mine the skipped aionforge-procedural crate, and second-pass adversarial-verify the top GO candidates."
trigger_phrases:
  - "028 sibling subsystem revisit"
  - "advisor codegraph 027 reconciliation"
  - "aionforge-procedural outcome-weighted ranking"
  - "028 go candidate adversarial re-verify"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-sibling-revisit"
    last_updated_at: "2026-06-17T05:19:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed 006 sibling-revisit + follow-ups child for a time-boxed sprint to 200"
    next_safe_action: "Run the Advisor-x-027 + CodeGraph-x-027 + procedural + readiness waves"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-006-sibling-revisit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Sibling-Subsystem Revisit + Follow-ups (028 × 027)

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
Child 005 reconciled 028's **Memory** findings against 027's shipped code and flagged two cross-packet overlaps it deliberately scoped OUT (Memory-only mandate): 028's Skill-Advisor candidates × 027's advisor work, and 028's Code-Graph candidates × 027's code-graph work. The aionforge-procedural crate (outcome-weighted skill ranking) was also left as the one external follow-up, and the top GO candidates have had only single-pass verification.

### Purpose
Close those follow-ups: reconcile 028's Advisor + Code-Graph findings against live 027 code (supersede/extend/contradict/already-covered), mine aionforge-procedural for the Advisor, and second-pass adversarially re-verify the top GO candidates. Read-only; extends the 028 roadmap + the 005 ledger. Time-boxed sprint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of live 027 advisor + code-graph code, 028's 002/003 research, and the aionforge-procedural crate.
- Cross-packet verdicts + adversarial re-verification of the GO list.

### Out of Scope
- Implementing any candidate; modifying 027 or external code.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each verdict cites live 027 code + the 028 candidate | file:line + candidate id per row |
| REQ-002 | Cover 028 Advisor + Code-Graph candidates vs 027; aionforge-procedural; GO re-verify | all addressed in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: research.md adds the Advisor×027 + CodeGraph×027 verdict rows + the procedural mapping + the GO re-verify outcomes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Time box (~40 min) | Fewer iterations than 50 | Larger parallel waves; reduce once at end; stop honestly wherever reached |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Advisor×027: do 028's C4/C5/C3/C1/QCR reconcile against 027's shipped advisor feedback-calibration + reconnect?
- Code-Graph×027: do 028's Q1-C1/Q6-C1/Q4-C1/CG-edge-staleness/Q3 reconcile against 027's code-graph tombstone-audit + adoptions?
- aionforge-procedural: outcome-weighted skill ranking + failure-mode recall for the Advisor?
- GO re-verify: do the top GO candidates survive a second independent skeptic?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS
- **Research output**: `research/research.md`.
- **005 ledger**: `../005-revisit-027/research/research.md`.
- **Synthesis**: `../research/synthesis/00-index.md`.
- **Parent**: `../spec.md`.
<!-- /ANCHOR:related-docs -->
