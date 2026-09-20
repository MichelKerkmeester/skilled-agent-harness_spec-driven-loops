---
title: "Tasks: Persona-Injection Contract Design"
description: "Task breakdown for authoring and verifying the persona-injection contract."
trigger_phrases:
  - "persona injection contract tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/002-persona-injection-contract"
    last_updated_at: "2026-08-19T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Contract authored + verified against P1 inventory"
    next_safe_action: "Begin P3 mode SKILL + hub enforcement edits"
    blockers: []
    key_files:
      - "scratch/persona-injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-002-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Persona-Injection Contract Design

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

- [x] T001 Read the verified P1 inventory (`../001-analysis-inventory/scratch/dispatch-point-inventory.md`)
- [x] T002 Locate the reuse precedents (`orchestrate.md:138`; Rule 14 in each mode `SKILL.md`)
- [x] T003 Confirm the canonical placement target (`cli-prompt-quality-card.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 State the invariant rule anchored to `orchestrate.md` Agent Loading Protocol (`§1`)
- [x] T005 Specify runtime-aware resolution (AGENTS.md §7) + subtask→persona mapping (`persona-injection-contract.md` §2)
- [x] T006 Transcribe the per-surface native-vs-inline table from P1 (`dispatch-point-inventory.md` §C → `§3`)
- [x] T007 Define the inline block format reusing `DESIGN_DISPATCH_MANIFEST` (`§4`)
- [x] T008 Add the consistency guard + rare explicit exceptions (`persona-injection-contract.md` §5/§6)
- [x] T009 Write the placement plan for P3/P4 (`persona-injection-contract.md` §7)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Cross-check every `§3` verdict against P1 `dispatch-point-inventory.md` §C
- [x] T011 Confirm precedents exist (`orchestrate.md:138` protocol; Rule 14 per mode `SKILL.md`)
- [x] T012 Record contract summary in `implementation-summary.md`
- [x] T013 Run `validate.sh` on the phase folder with `--strict` (Errors:0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (`T001`–`T013`)
- [x] No `[B]` blocked tasks remaining (`git status` clean)
- [x] Contract covers all 7 required sections (`persona-injection-contract.md`)
- [x] Manual verification passed (deterministic cross-check vs P1 `§C`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
