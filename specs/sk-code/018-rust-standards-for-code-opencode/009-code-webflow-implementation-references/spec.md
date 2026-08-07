---
title: "Feature Specification: Phase 9 — Split code-webflow Implementation References"
description: "Split 11 oversized code-webflow implementation references (third_party_integrations 1109, webflow_patterns 1091, animation_workflows 1074, form_upload_workflows 750, swiper_patterns 704, observer_patterns 686, focus_management 633, implementation_workflows 600, performance_patterns 580, security_patterns 574, async_patterns 519) into 29 topic-cohesive parts and rewire the code-webflow RESOURCE_MAP, parent smart_routing.md union, and the webflow playbook expected_resources, keeping every deterministic gate green."
trigger_phrases:
  - "018 phase 009 split code-webflow implementation"
  - "code-webflow implementation reference hygiene"
  - "webflow patterns swiper observer split"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/009-code-webflow-implementation-references"
    last_updated_at: "2026-07-11T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Split applied (29 parts), code-webflow router rewired, 21/21 guards green, 0 regressions"
    next_safe_action: "Commit phase 009, then proceed to phase 010 (code-webflow other references)"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-009-webflow-impl"
      parent_session_id: null
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 9 — Split code-webflow Implementation References

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
| **Predecessor** | 008-code-opencode-other-references |
| **Successor** | 010-code-webflow-other-references |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eleven `code-webflow/references/implementation/` docs exceed 500 lines (largest 1109). All are routed in the code-webflow RESOURCE_MAP (IMPLEMENTATION/ANIMATION/FORMS/PERFORMANCE/etc.), mirrored to the parent-hub union under the drift guard.

### Purpose
Losslessly partition all eleven into topic-cohesive parts (≤500 lines) and rewire every live code-webflow route to the new parts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split 11 implementation files → 29 parts.
- Rewire child `code-webflow/SKILL.md` RESOURCE_MAP, parent `smart_routing.md` union, code-webflow checklists/animation refs, and webflow playbook expected_resources.

### Out of Scope
- Content changes (lossless partition only).
- code-opencode refs (different surface); generated reports; historical spec-docs/changelogs.
- code-webflow non-implementation refs (debugging/css/javascript/shared/verification/deployment) — phase 010.
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
- 11 sources split into 29 parts; sources deleted; no part >500 lines.
- 21/21 router-guard tests; dangling grep clean; 0 regressions.
- `validate.sh --strict` on this child = 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Rich webflow intent surface (many intents list these files) → the rewire tool replaces all occurrences; drift guard verifies equality.
- Motion.dev overlay refs (animation_workflows) are cross-stack → the cross-link rewirer targets only code-webflow and excludes other surfaces.
- Dependency: builds on 007/008 (parent widened).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None. Boundaries computed and dry-run verified before this spec was written.
<!-- /ANCHOR:questions -->
