---
title: "Tasks: Phase 005 - Parity Benchmark Release Gate"
description: "Task breakdown for the planned sk-design parity benchmark and release gate."
trigger_phrases:
  - "phase 005 tasks"
  - "parity benchmark tasks"
  - "release gate tasks"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/005-parity-benchmark-release-gate"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 005 task list."
    next_safe_action: "Complete gate setup before benchmark execution."
---
# Tasks: Phase 005 - Parity Benchmark Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm Phase 004 implementation evidence exists before benchmark execution (`../004-mode-packet-refactor/`).
- [ ] T002 Name the release owner for failure, conditional release, and baseline overwrite decisions (`decision-record.md`).
- [ ] T003 Locate existing baseline or record missing-baseline status (benchmark baseline ledger).
- [ ] T004 Approve append-only artifact location for benchmark runs (future benchmark output root).
- [ ] T005 Freeze the release report schema with lane verdict, baseline, current result, delta, evidence, and authority fields (`plan.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [P] Draft golden prompts for `design-interface` with anti-slop, hierarchy, interaction, accessibility, and polish expectations (golden prompt corpus).
- [ ] T007 [P] Draft golden prompts for `design-foundations` with visual-system, token, typography, and layout expectations (golden prompt corpus).
- [ ] T008 [P] Draft golden prompts for `design-motion` with temporal intent, reduced-motion, and interaction expectations (golden prompt corpus).
- [ ] T009 [P] Draft golden prompts for `design-audit` with critique, remediation, accessibility, and usefulness expectations (golden prompt corpus).
- [ ] T010 [P] Draft golden prompts for `design-md-generator` with extraction preservation and style-reference expectations (golden prompt corpus).
- [ ] T011 Add negative controls for vague, non-design, conflicting, unsafe, and router-misdirection prompts (golden prompt corpus).
- [ ] T012 Define context manifest and proof fields for every prompt (release report schema).
- [ ] T013 Define manual playbook scenarios for live usefulness and parity feel (manual playbook artifact).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run router/advisor invariant checks and record independent verdicts (release report).
- [ ] T015 Run golden prompt benchmark and record baseline/current/delta for every prompt (release report).
- [ ] T016 Run procedure-selection checks with public mode, private procedure path, rationale, and fallback evidence (release report).
- [ ] T017 Run context manifest and proof gates for all prompts (release report).
- [ ] T018 Run anti-slop, accessibility, hierarchy, interaction, polish, and live usefulness review lanes (release report).
- [ ] T019 Run md-generator preservation tests and record extraction/output verdicts (release report).
- [ ] T020 Run negative controls and record false-positive prevention behavior (release report).
- [ ] T021 Record release-owner decisions for failures, accepted risks, conditional release, or baseline overwrite (`decision-record.md` or release report).
- [ ] T022 Run strict Spec Kit validation for this phase after future evidence updates (`validate.sh`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [ ] T023 Confirm the release gate keeps routing invariants and usefulness evidence as separate proof tracks (`plan.md`).
- [ ] T024 Confirm the baseline ledger is append-only unless explicit overwrite authority is recorded (benchmark baseline ledger).
- [ ] T025 Confirm md-generator preservation remains a P0 release lane, not a best-effort check (`checklist.md`).
- [ ] T026 Confirm failure authority is recorded before any blocked or conditional release proceeds (`decision-record.md`).
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 setup, benchmark, preservation, negative-control, and release-authority tasks are complete.
- [ ] No `[B]` blocked tasks remain.
- [ ] Baseline and current benchmark deltas are reported.
- [ ] Release owner records ready, blocked, or conditional verdict.
- [ ] Strict validation passes after evidence updates.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
