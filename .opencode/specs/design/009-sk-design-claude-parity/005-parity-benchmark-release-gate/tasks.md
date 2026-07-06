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
    recent_action: "Completed automated router-mode release gate and recorded conditional gaps."
    next_safe_action: "Operator executes live/browser/manual lanes before READY."
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

- [x] T001 Confirm Phase 004 implementation evidence exists before benchmark execution (`../004-mode-packet-refactor/`). Evidence: user provided verified fact that Phase 004 is closed before this run.
- [x] T002 Name the release owner for failure, conditional release, and baseline overwrite decisions (`decision-record.md`). Evidence: repository owner, delegated to this session for automated gate record.
- [x] T003 Locate existing baseline or record missing-baseline status (benchmark baseline ledger). Evidence: `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json` exists and was read.
- [x] T004 Approve append-only artifact location for benchmark runs (future benchmark output root). Evidence: current run wrote only `.opencode/skills/sk-design/benchmark/after-009/`.
- [x] T005 Freeze the release report schema with lane verdict, baseline, current result, delta, evidence, and authority fields (`release-report.md`). Evidence: `release-report.md` sections 1-7.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Draft golden prompts for `design-interface` with anti-slop, hierarchy, interaction, accessibility, and polish expectations (golden prompt corpus). Evidence: MR-001, SR-001, PB-001 in `manual_testing_playbook.md`.
- [x] T007 [P] Draft golden prompts for `design-foundations` with visual-system, token, typography, and layout expectations (golden prompt corpus). Evidence: MR-002, SR-002, PB-002 in `manual_testing_playbook.md`.
- [x] T008 [P] Draft golden prompts for `design-motion` with temporal intent, reduced-motion, and interaction expectations (golden prompt corpus). Evidence: MR-003 and MR-006 in `manual_testing_playbook.md`.
- [x] T009 [P] Draft golden prompts for `design-audit` with critique, remediation, accessibility, and usefulness expectations (golden prompt corpus). Evidence: MR-004 and TV-002 in `manual_testing_playbook.md`.
- [x] T010 [P] Draft golden prompts for `design-md-generator` with extraction preservation and style-reference expectations (golden prompt corpus). Evidence: MR-005, MG-001..MG-003, PB-003 in `manual_testing_playbook.md`.
- [x] T011 Add negative controls for vague, non-design, conflicting, unsafe, and router-misdirection prompts (golden prompt corpus). Evidence: AI-002, AI-003, SR-003, TV-004, TV-005 in `manual_testing_playbook.md`.
- [x] T012 Define context manifest and proof fields for every prompt (release report schema). Evidence: root playbook global evidence requirements and PB scenario files.
- [x] T013 Define manual playbook scenarios for live usefulness and parity feel (manual playbook artifact). Evidence: PB-001, PB-002, PB-003 under `manual_testing_playbook/06--parity-behavior/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run router/advisor invariant checks and record independent verdicts (release report). Evidence: router-mode replay passed 18 scored scenarios; D1-inter live advisor remains explicitly unscored.
- [x] T015 Run golden prompt benchmark and record baseline/current/delta for every prompt (release report). Evidence: baseline 21 scenarios/15 scored to after-009 24 scenarios/18 scored, aggregate 69 to 69.
- [x] T016 Run procedure-selection checks with public mode, private procedure path, rationale, and fallback evidence (release report). Evidence: PB-001 route replay passed; manual response proof not run and recorded as operator-required.
- [x] T017 Run context manifest and proof gates for all prompts (release report). Evidence: PB-002 route replay passed; manual response proof not run and recorded as operator-required.
- [x] T018 Run anti-slop, accessibility, hierarchy, interaction, polish, and live usefulness review lanes (release report). Evidence: not run in this automated pass; release report marks them CONDITIONAL and release-blocking before READY.
- [x] T019 Run md-generator preservation tests and record extraction/output verdicts (release report). Evidence: PB-003 route replay reached `md-generator` with `playwright-extract`; live extraction not run and recorded as operator-required.
- [x] T020 Run negative controls and record false-positive prevention behavior (release report). Evidence: replay scenarios AI-002, AI-003, SR-003, TV-004, TV-005 remain in the 24-scenario corpus and benchmark passed; live negative controls remain operator-required.
- [x] T021 Record release-owner decisions for failures, accepted risks, conditional release, or baseline overwrite (`decision-record.md` or release report). Evidence: conditional verdict recorded; no baseline overwrite authorized.
- [x] T022 Run strict Spec Kit validation for this phase after evidence updates (`validate.sh`). Evidence: final validation result recorded in `implementation-summary.md` after metadata regeneration.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [x] T023 Confirm the release gate keeps routing invariants and usefulness evidence as separate proof tracks (`plan.md`). Evidence: `release-report.md` separates router replay from live/manual gaps.
- [x] T024 Confirm the baseline ledger is append-only unless explicit overwrite authority is recorded (benchmark baseline ledger). Evidence: baseline path preserved; current run written to `benchmark/after-009/`.
- [x] T025 Confirm md-generator preservation remains a P0 release lane, not a best-effort check (`checklist.md`). Evidence: CHK-028 is marked conditional/release-blocking pending operator live extraction.
- [x] T026 Confirm failure authority is recorded before any blocked or conditional release proceeds (`decision-record.md`). Evidence: repository owner authority and CONDITIONAL verdict recorded.
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 setup, benchmark, preservation, negative-control, and release-authority tasks are complete for the automated router-mode gate; live/manual gaps remain explicitly release-blocking before READY.
- [x] No `[B]` blocked tasks remain; pending operator execution is recorded as a conditional release gap, not hidden task state.
- [x] Baseline and current benchmark deltas are reported in `release-report.md`.
- [x] Release owner records ready, blocked, or conditional verdict. Evidence: CONDITIONAL.
- [x] Strict validation passes after evidence updates. Evidence: final validation result recorded in `implementation-summary.md`.
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
