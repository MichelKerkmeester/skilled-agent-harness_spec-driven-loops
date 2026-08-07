---
title: "Feature Specification: Phase 10 — Split code-webflow Other References"
description: "Split 8 oversized code-webflow non-implementation references (debugging_workflows 1940, css/patterns 1271, javascript/quality_standards 1167, shared/dev_workflow 940, css/quality_standards 764, verification_workflows 666, javascript/style_guide 643, deployment/minification_guide 533) into 31 topic-cohesive parts and rewire the code-webflow RESOURCE_MAP, parent union, and webflow playbook expected_resources, keeping every deterministic gate green."
trigger_phrases:
  - "018 phase 010 split code-webflow other references"
  - "code-webflow debugging css javascript hygiene"
  - "webflow reference split debugging_workflows"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/010-code-webflow-other-references"
    last_updated_at: "2026-07-11T15:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Split applied (31 parts), code-webflow router rewired, 21/21 guards green, 0 regressions"
    next_safe_action: "Commit phase 010, then proceed to phase 011 (code-quality + flagged)"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-010-webflow-other"
      parent_session_id: null
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 10 — Split code-webflow Other References

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 009-code-webflow-implementation-references |
| **Successor** | 011-code-quality-and-flagged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eight code-webflow non-implementation docs exceed 500 lines (largest: debugging_workflows 1940). All are routed in the code-webflow RESOURCE_MAP (DEBUGGING/CSS/JAVASCRIPT/VERIFICATION/DEPLOYMENT/shared), mirrored to the parent union.

### Purpose
Losslessly partition all eight into topic-cohesive parts (≤500 lines) and rewire every live code-webflow route.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split 8 files → 31 parts.
- Rewire child `code-webflow/SKILL.md`, parent `smart_routing.md` union, checklists/cross-links, webflow playbook expected_resources.

### Out of Scope
- Content changes (lossless partition only).
- code-opencode / other surfaces; generated reports; historical spec-docs/changelogs.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
- R1: Each part ≤500 lines; union reproduces source exactly.
- R2: Child map, parent union move in lockstep; no deleted path remains in any authored route.
- R3: 3 router guards pass; full-suite failure count unchanged vs baseline (11).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- 8 sources split into 31 parts; sources deleted; no part >500 lines.
- 21/21 router-guard tests; dangling grep clean; 0 regressions.
- `validate.sh --strict` on this child = 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- debugging_workflows §2 (systematic debugging) exceeds a clean H2 grouping → split at its Rules subsection (H3) to keep every part ≤478.
- code-webflow has its own javascript refs (distinct from code-opencode's, split in 008) → the cross-link rewirer is surface-scoped.
- Dependency: builds on 007/008/009.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None. Boundaries computed and dry-run verified before this spec was written.
<!-- /ANCHOR:questions -->
