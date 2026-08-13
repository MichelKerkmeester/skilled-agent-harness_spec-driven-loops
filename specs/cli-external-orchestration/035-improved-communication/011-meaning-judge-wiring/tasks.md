---
title: "Tasks: Phase 011 Meaning-Judge Wiring"
description: "Planned task breakdown for production composition, local reject-only judgment, and exact-original terminal-state handling."
trigger_phrases:
  - "meaning-judge-wiring"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/011-meaning-judge-wiring"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned meaning-judge task breakdown."
    next_safe_action: "Execute T001 by inventorying the production module graph."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 011 Meaning-Judge Wiring

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory provider, validator, judge, render, and proxy-evaluation producers and consumers (`src/`)
- [ ] T002 Freeze production stage order and the local-only judge boundary (`spec.md`, `plan.md`)
- [ ] T003 Record the exact-original baseline for every judge terminal state (`test/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add one production composition entry point (`src/`)
- [ ] T005 Bind the reject-only local judge after deterministic restoration (`src/fidelity/`)
- [ ] T006 Map rejection, timeout, cancellation, exception, absence, and invalid output to exact-original (`src/`)
- [ ] T007 Keep offline proxy reviewers outside the runtime module graph (`src/evaluation/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Prove provider -> validate -> judge -> render ordering (`test/`)
- [ ] T009 Run the complete judge terminal-state matrix (`test/`)
- [ ] T010 Run hosted-egress canaries for source and restored candidate text (`test/`)
- [ ] T011 Prove evaluation-only proxy modules are not runtime dependencies (`test/`)
- [ ] T012 Prove canonical state remains unchanged (`test/`)
- [ ] T013 Run `npm run check` and strict packet validation (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All eight requirements and checklist blockers have observed evidence.
- [ ] Every negative or unavailable judge outcome returns exact-original.
- [ ] No decoded source or restored candidate reaches hosted transport.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
