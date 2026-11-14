---
title: "Acceptance Criteria: Phase 1: deterministic-stop-decision"
description: "Thirteen Given/When/Then criteria that decide when the deterministic stop decision phase may close. Each one names a Vitest run or an rg check."
trigger_phrases:
  - "deterministic stop decision acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision"
    last_updated_at: "2026-11-14T11:33:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-deterministic-stop-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: deterministic-stop-decision

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 004-workflow-logic-hardening/001-deterministic-stop-decision
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

Commands run from the repository root. `RT` is `.skilled/skills/system-deep-loop/runtime`, `A` is `.skilled/commands/deep/assets` and `VT` is `node_modules/.bin/vitest run --no-coverage`.

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a seeded research graph and a review graph with state and config fixtures, When `convergence.cjs --stop-decision` runs for each loop type, Then the printed `stop_decision` object holds `decision`, `stopReason`, `reasonDetail`, `weightedStopScore`, `signals`, `gates`, `blockedBy`, `graphDecision` and `inputs` | `(cd $RT && $VT tests/integration/convergence-script.vitest.ts -t "stop-decision")` reports 0 failed | Unmet | - |
| AC-002 | REQ-002 | Given unchanged input files, When the same `--stop-decision` command runs twice, Then the two `stop_decision` strings are byte-identical | The determinism case in `tests/integration/convergence-script.vitest.ts` passes | Unmet | - |
| AC-003 | REQ-003 | Given the four workflow files after the change, When the contract test reads each `step_check_convergence` step, Then no step holds `MAD(`, `mean(last` or a weight literal and each names `stop_decision` | `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts)` reports 0 failed | Unmet | - |
| AC-004 | REQ-004 | Given a research STOP candidate with an answered question outside the key questions, When `buildStopDecision` runs, Then `gates.qualityGuards` shows `focusAlignment` failed and the result is `CONTINUE` with `reasonDetail` `qualityGuardFailed` | `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "quality guards")` reports 0 failed and `rg -c checkQualityGuards $A/deep-research-*.yaml $A/deep-review-*.yaml` prints no count | Unmet | - |
| AC-005 | REQ-005 | Given a review config with no threshold, then `0.10`, then `0.20`, When `mapReviewThresholds` runs, Then it returns `0.08` and `0.05` for the first two and `0.16` and `0.10` for the third | `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "thresholds")` reports 0 failed | Unmet | - |
| AC-006 | REQ-006 | Given a STOP candidate from the composite vote, from `all_questions_answered` or from `all_dimensions_clean` and a graph evaluation that throws, When `buildStopDecision` runs for research and review, Then each result is `CONTINUE` with `stopReason` `null` and `reasonDetail` `graphDecisionMissing` | `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "graph")` reports 0 failed | Unmet | - |
| AC-007 | REQ-007 | Given every case in the unit test matrix, When `buildStopDecision` returns, Then `stopReason` is `null` on `CONTINUE` and otherwise a member of the eight-value frozen enum | The enum contract case in `tests/unit/stop-decision.vitest.ts` passes | Unmet | - |
| AC-008 | REQ-008 | Given a review run with `iteration_count` equal to `maxIterations` and a latest `claim_adjudication` event with `passed: false`, When `buildStopDecision` runs, Then the result is `STOP` with `maxIterationsReached` and `claimAdjudicationGate` in the failed gates | `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "cap")` reports 0 failed and `rg -n 'Skip hard stops' $A/deep-review-*.yaml` prints nothing | Unmet | - |
| AC-009 | REQ-009 | Given both review workflow files after the change, When the stuck counter text is searched, Then it uses `0.5 x convergenceThreshold` and no `0.05` literal remains | `rg -n '0\.05\b' $A/deep-review-*.yaml` prints nothing | Unmet | - |
| AC-010 | REQ-010 | Given the four workflow files and `deep-research/SKILL.md`, When they are searched, Then each divergent `branch_on` reads `stop_decision.reasonDetail` and SKILL.md line 271 names only the eight enum values | `rg -c 'stop_decision\.reasonDetail' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints 1 or more per file and `rg -n 'Stop reason \(' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints the enum | Unmet | - |
| AC-011 | REQ-011 | Given `--security-sensitive-fix-scope true --fix-replay-required-rows 2 --fix-replay-passing-rows 1`, When review `--stop-decision` runs, Then `stop_decision.inputs` echoes the three values and `fixCompletenessReplayGate` fails | The judgment-input case in `tests/integration/convergence-script.vitest.ts` passes | Unmet | - |
| AC-012 | REQ-012 | Given the four workflow files, When the `convergence.cjs` calls are counted, Then each file holds exactly one | `rg -c 'runtime/scripts/convergence\.cjs' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints 1 for each file | Unmet | - |
| AC-013 | REQ-013 | Given the runtime taxonomy and the four workflow files after the change, When the stop-reason enum is read from each, Then every list holds eight members ending with `maxDurationReached` | `(cd $RT && $VT tests/unit/lifecycle-taxonomy.vitest.ts tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts)` reports 0 failed and `rg -c maxDurationReached $A/deep-research-*.yaml $A/deep-review-*.yaml` prints 3 per file | Unmet | - |

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

**Closeable:** No

No. Implementation has not started, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
