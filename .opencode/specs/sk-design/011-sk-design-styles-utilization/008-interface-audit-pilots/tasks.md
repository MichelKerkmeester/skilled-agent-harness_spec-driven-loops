---
title: "Tasks: interface + audit contrasting pilots"
description: "Level-3 task queue for wiring design-interface and design-audit to the styles library through the phase-007 shared context seam: setup contract binding, implementation of the two contrasting pilots, and fixture-atlas verification. All tasks pending — scaffold only."
trigger_phrases:
  - "interface audit pilots tasks"
  - "design-interface pilot tasks"
  - "design-audit comparison tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the interface/audit pilots scaffold (six L3 planning docs)"
    next_safe_action: "Wire the phase-007 seam into design-interface, then design-audit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-iface-audit-011-008"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: interface + audit contrasting pilots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Bind the phase-007 `CORPUS_CONTEXT_PLAN` envelope fields into both mode contracts (`.opencode/skills/sk-design/design-interface/**`, `.opencode/skills/sk-design/design-audit/**`)
- [ ] T002 Fix the authority order (brief/owned system > mode judgment > target evidence > corpus > transport) in both contracts
- [ ] T003 [P] Define the maintainer fixture-atlas naming convention (positive / no-fit / rejected-default / drift / comparison-unavailable)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Interface pilot
- [ ] T004 Implement anchor retrieval: 1 coherent anchor via the phase-007 envelope (`design-interface/**`)
- [ ] T005 Add optional bounded contrast / rejected-default retrieval (`design-interface/**`)
- [ ] T006 Build the relational exemplar from anchor + optional contrast (`design-interface/**`)
- [ ] T007 Emit the decision-only, source-aware handoff — decisions + sources, never raw style bodies (`design-interface/**`)
- [ ] T008 Record the counterfactual no-corpus default that changed after grounding (`design-interface/**`)

### Audit lane
- [ ] T009 Implement 0–2 comparison-reference retrieval as NON-AUTHORITATIVE context (`design-audit/**`)
- [ ] T010 Add the intended-anchor drift detector + evidence labels (`design-audit/**`)
- [ ] T011 Enforce non-authority guards — no severity/score, no WCAG/perf, no copying, no fix ownership (`design-audit/**`)
- [ ] T012 [P] Emit `comparison-unavailable` as a first-class result when 0 refs (`design-audit/**`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Author falsification (counterexample) fixtures proving unsafe integrations fail closed
- [ ] T014 [P] Author interface positive / no-fit / rejected-default fixtures
- [ ] T015 [P] Author audit drift + comparison-unavailable fixtures
- [ ] T016 Assemble the maintainer fixture atlas — assert no user-facing style gallery
- [ ] T017 Verify both pilots populate the shared phase-007 proof/handoff fields with contrasting shapes
- [ ] T018 Run `validate.sh <folder> --strict` and reconcile completion metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Interface emits relational exemplar + decision-only handoff without overriding brief/target/preflight
- [ ] Audit emits non-authoritative context + drift fixtures with no corpus verdict
- [ ] Shared proof/handoff fields populated by both pilots
- [ ] Fail-closed falsification fixtures pass
- [ ] `validate.sh <folder> --strict` passes; all ADRs status: Accepted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: ../spec.md
<!-- /ANCHOR:cross-refs -->
