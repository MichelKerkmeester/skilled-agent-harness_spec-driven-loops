---
title: "Tasks: HTML, DOCX, and move-aware review"
description: "Tasks for gated HTML and DOCX extraction, parser isolation, deterministic move detection, side-by-side review, and fidelity diagnostics."
trigger_phrases:
  - "HTML DOCX diff tasks"
  - "move detection tasks"
importance_tier: "critical"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/004-html-docx-and-move-detection"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Created the rich-structure task scaffold"
    next_safe_action: "Verify phase 003 unlock evidence"
    blockers:
      - "Phase 003 applicable gates"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: HTML, DOCX, and move-aware review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: `T### [P?] Description (target surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm phase 003 gates are green for HTML, DOCX, dependencies, and report security (gate report)
- [ ] T002 Select and prove worker or subprocess resource enforcement on all platforms (parser isolation)
- [ ] T003 [P] Freeze structural HTML and DOCX expected outputs (fixture corpus)
- [ ] T004 [P] Freeze repeated-content, move, and replacement expected actions (fixture corpus)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement sanitized structural HTML extraction and diagnostics (HTML adapter)
- [ ] T006 Implement limited DOCX conversion, sanitization, warnings, and external-access denial (DOCX adapter)
- [ ] T007 Implement parser timeout, memory, termination, and error envelopes (isolation layer)
- [ ] T008 Implement unique subtree-hash anchoring (tree mapper)
- [ ] T009 Implement deterministic duplicate contextual matching (tree mapper)
- [ ] T010 Implement similarity scoring and one-to-one assignment with tie-breakers (tree mapper)
- [ ] T011 Emit first-class move and replacement actions with provenance (diff model)
- [ ] T012 Add side-by-side progressive enhancement and fixed-script CSP hashing (report renderer)
- [ ] T013 Add fidelity dashboard, capability badges, warnings, and move links (report renderer)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run structural, hostile-container, and isolation fixtures (adapter tests)
- [ ] T015 Prove move mapping is deterministic for duplicates and reordered blocks (mapping tests)
- [ ] T016 Run CSP, no-network, accessibility, and no-JavaScript report gates (browser harness)
- [ ] T017 Run approved HTML/DOCX performance and memory budgets (benchmark harness)
- [ ] T018 Update capability tiers and the phase summary with measured limitations (phase docs)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Phase 003 gates remain green.
- [ ] HTML and DOCX adapters emit truthful structure and diagnostics.
- [ ] Move and replacement actions are stable and one-to-one.
- [ ] Unified and side-by-side reports pass security and accessibility checks.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Gate phase**: `../003-validation-security-and-quality-gates/spec.md`
- **Research algorithm**: `../001-research-and-requirements/research/research.md`
<!-- /ANCHOR:cross-refs -->

