---
title: "Acceptance Criteria: Phase 9: fix-alignment-report-findings-for-speckit-command-surfaces"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fix alignment report findings for speckit command surfaces acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/009-fix-alignment-report-findings-for-speckit-command-surfaces"
    last_updated_at: "2026-11-14T19:44:25Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-fix-alignment-report-findings-for-speckit-command-surfaces"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: fix-alignment-report-findings-for-speckit-command-surfaces

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 009-fix-alignment-report-findings-for-speckit-command-surfaces
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every command runs from the repository root. `K` is `.skilled/skills` and `A` is `.skilled/commands/speckit/assets`. Each observation was made on the uncommitted tree over `ba7062dd17`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the speckit commands and the advisor bridges, When the stale-count search of REQ-001 runs, Then it prints nothing and the README rows read 13 and 5 | `rg -n '14\+? ?-?step\|sequential_14\|8-step'` over the three paths of REQ-001 exits 1 with no line. Observed: no line, exit 1. Evidence: .skilled/skills/system-spec-kit/README.md:347 | Met | - |
| AC-002 | REQ-002 | Given the command contract, the resume catalog entry, its playbook and the resume presentation, When the two searches of REQ-002 run, Then both print nothing and the `Detection:` line lists the five values of `detection_method` | Both `rg` commands exit 1 with no line, and line 74 reads `provided\|handoff-note\|session-ref\|phase-folder\|none` as does `speckit-resume.yaml` line 222. Observed: as stated. Evidence: .skilled/commands/speckit/assets/speckit-resume-presentation.txt:74 | Met | - |
| AC-003 | REQ-003 | Given the command metadata, When the mirror check runs, Then it prints no `/speckit:` line | `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs \| rg '/speckit:'` exits 1. Observed: no line, exit 1. Evidence: .skilled/skills/system-spec-kit/command-metadata.json:1 | Met | - |
| AC-004 | REQ-004 | Given the implement workflow, When the `checkpoints` list is read beside the step keys of `workflow:`, Then both name the nine steps in the same order | The list at line 11 and the step keys at lines 370 to 621 agree, with `step_6_7_acceptance_verify` after `step_6_development`. Observed: as stated. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:11 | Met | - |
| AC-005 | REQ-005 | Given the two contract tests, When one `shared_tail` pointer is removed or `merge_on_clean` is added to a lifecycle sequence, Then the matching test fails | With the `documentation_levels` pointer removed from `speckit-implement.yaml`, `test-phase-command-workflows.js` prints `passed=142 failed=1` and exits 1. With `merge_on_clean` added, the autopilot vitest prints `1 failed \| 4 passed`. Restored, they print `passed=143 failed=0` and `5 passed`. Evidence: .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js:97 | Met | - |
| AC-006 | REQ-006 | Given the goal-hook scenario, When its command sequence runs, Then each of the three files is checked by its own `rg` with wording that file holds | Each of the three `rg` commands the scenario names exits 0, one for `AGENTS.md` and one for each of the other two files. Observed: three times exit 0. Evidence: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md:21 | Met | - |
| AC-007 | REQ-007 | Given the four new intent signals, When the seventeen probes and the D-10 prompt are scored, Then P03, P11, P12 and the D-10 prompt return `system-spec-kit` and the eleven earlier passes still pass | `run-probes.cjs` prints `pass=14 fail=3`, and the three failures are P08, P13 and P14. The D-10 prompt returns `system-spec-kit` at 0.92. Observed: as stated. Evidence: .skilled/skills/system-spec-kit/graph-metadata.json:112 | Met | - |
| AC-008 | REQ-008 | Given the three compiled deep-loop contracts, When the drift check runs, Then it exits 0 and names no drifted command | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` and exits 0. Observed: as stated. Evidence: .skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1 | Met | - |
| AC-009 | REQ-009 | Given the final state, When the recheck and the whole battery run on the run folder, Then no row is newly failing and the two catalog entries name the shared include and the plan autopilot contract | `recheck.cjs` prints `resolved=8 still_open=2 new=0 needs_review=17`. The two still open are `C-3`, out of scope, and the package check that could not run in the first run either. The whole battery prints `fail=0`. Evidence: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md:27 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every row is Met, and each one names the command that was run and what it printed.
<!-- /ANCHOR:closure -->
