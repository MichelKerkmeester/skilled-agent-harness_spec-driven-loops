---
title: "Feature Specification: Phase 8 — Split code-opencode Other-Language & Shared References"
description: "Split 9 oversized code-opencode docs (typescript trio, shell trio, javascript quality_standards, and the shared code_organization + universal_patterns tier) into 20 topic-cohesive parts and rewire the TYPESCRIPT/SHELL/JAVASCRIPT RESOURCE_MAPs plus the DEFAULT_RESOURCE/IMPLEMENTATION shared tier, the parent smart_routing.md union, the surface-slice-sync TS_TRIO, and all language-standards / language-sub-detection playbook expected_resources, keeping every deterministic gate green."
trigger_phrases:
  - "018 phase 008 split code-opencode references"
  - "typescript shell javascript reference hygiene"
  - "code-opencode shared tier split"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/008-code-opencode-other-references"
    last_updated_at: "2026-07-11T14:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Split applied (20 parts), router + shared tier rewired, 21/21 guards green, 0 regressions"
    next_safe_action: "Commit phase 008, then proceed to phase 009 (code-webflow implementation references)"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-008-other-references"
      parent_session_id: null
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 8 — Split code-opencode Other-Language & Shared References

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
| **Predecessor** | 007-code-opencode-rust-references |
| **Successor** | 009-code-webflow-implementation-references |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nine `code-opencode` docs exceed 500 lines: the typescript trio (865/714/562), the shell trio (625/538/501), javascript quality_standards (605), and the shared tier code_organization (722) + universal_patterns (561). The shared tier is routed under DEFAULT_RESOURCE + IMPLEMENTATION (loaded on nearly every OpenCode task), so its split touches more of the contract than a single-language split.

### Purpose
Losslessly partition all nine into topic-cohesive parts (≤500 lines) and rewire every live authored route — language RESOURCE_MAPs, the shared tier, the parent union, the vitest TS_TRIO, and graded playbook expected_resources.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split 9 files → 20 parts (3/2/2 typescript, 2/2/2 shell, 2 javascript, 3 code_organization, 2 universal_patterns).
- Rewire child `code-opencode/SKILL.md` (TYPESCRIPT/SHELL/JAVASCRIPT + DEFAULT_RESOURCE + IMPLEMENTATION), parent `smart_routing.md` union, `surface-slice-sync.vitest.ts` TS_TRIO, checklist/prose cross-links, and playbook expected_resources (language-standards, language-sub-detection, authoring-verification, cross-stack).

### Out of Scope
- Reference content changes (lossless partition only).
- code-webflow's own `references/javascript/*` (different surface — phase 009/010); generated reports; historical spec-docs/changelogs.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
- R1: Each part ≤500 lines; union reproduces the source exactly.
- R2: Child map, parent union, and vitest constants move in lockstep; no deleted path remains in any authored route.
- R3: 3 router guards pass; full skill-benchmark suite failure count unchanged vs baseline (11).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- 9 sources split into 20 parts; sources deleted; no part >500 lines.
- 21/21 router-guard tests pass; dangling-old-path grep clean; 0 regressions.
- `validate.sh --strict` on this child = 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Shared-tier split changes DEFAULT_RESOURCE (loaded broadly) → mitigated by the drift guard + surface-slice vitest.
- Cross-surface false positives (code-webflow has its own javascript refs) → the cross-link rewirer only targets code-opencode paths and excludes code-webflow.
- Dependency: builds on 007 (parent already widened for WS2).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None. Boundaries computed and dry-run verified before this spec was written.
<!-- /ANCHOR:questions -->
