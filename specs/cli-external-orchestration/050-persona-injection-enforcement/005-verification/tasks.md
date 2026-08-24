---
title: "Tasks: Persona-Injection Enforcement Verification"
description: "Task breakdown for the objective sweep, the recursive validate gate, and the regression delta."
trigger_phrases:
  - "persona injection verification tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/005-verification"
    last_updated_at: "2026-08-19T11:39:00Z"
    last_updated_by: "claude"
    recent_action: "All sweep + gate tasks complete"
    next_safe_action: "Operator review, then merge to v4"
    blockers: []
    key_files:
      - "scratch/persona-injection-sweep.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-005-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Persona-Injection Enforcement Verification

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enumerate dispatch surfaces: 6 mode `SKILL.md`, hub `SKILL.md`, canonical `cli-prompt-quality-card.md`, 6 thin `cli-*/assets/prompt-quality-card.md`
- [x] T002 Define presence + negative-proof `rg`/`grep` patterns for the sweep
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Sweep 1-2: persona rule present in all 6 modes + hub; canonical `## 6. PERSONA INJECTION` + hub REFERENCES bullet present
- [x] T004 Sweep 3: each mode rule cites `cli-prompt-quality-card.md` + `Persona Injection` (6/6)
- [x] T005 Sweep 4 (negative proof): the `rg` negative-proof pattern returns `no matches` across every `SKILL.md`
- [x] T006 Sweep 5: 6/6 thin `cli-*` cards delegate to the canonical card (inherit §6 by reference)
- [x] T007 Record results in `scratch/persona-injection-sweep.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `validate.sh --recursive --strict` on the packet (`5/5 PASSED`, Errors:0)
- [x] T009 Record the regression delta — baseline 0 surfaces vs `6/6` modes + hub + card; docs-only, no functional regression
- [x] T010 Confirm no shipped file changed in this phase (`git status` scoped to `005-verification/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (`T001`–`T010`)
- [x] No `[B]` blocked tasks remaining (`git status` scoped)
- [x] Sweep 5/5 pass; negative proof holds
- [x] Recursive gate `5/5 PASSED`, Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
