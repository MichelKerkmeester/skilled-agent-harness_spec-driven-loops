---
title: "Acceptance Criteria: Phase 9: findings-summary-integrity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "findings summary integrity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/009-findings-summary-integrity"
    last_updated_at: "2026-10-18T16:34:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Commit after operator approval"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: findings-summary-integrity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity
**Level:** 2
**Status:** Complete
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a delta finding row keyed `findingId`, when the reducer runs, then the registry holds that finding with its id, severity and file, and no summary-only row for its run | Met. Green: the one-file run of `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` exits 0 with `tests 1 pass 1`, and its case `testDeltaFindingKeyedByFindingIdLands` is defined at `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:295`. Red: the same case on the HEAD reducer exits 1 with `actual: { P0: 1, P1: 1, P2: 1 }`, a mirror run with HEAD `reduce-state.cjs` in a scratch tree, recorded in implementation-summary.md. Fix: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:626` | Met | - |
| AC-002 | REQ-002 | Given an iteration whose `findingsSummary` is the running total and whose findings are all in the registry by that run, when the reducer runs, then no summary-only finding is created | Met. Green: `testCumulativeSummaryCountsFindingsActiveByRun` at `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:317` passes in the one-file run. Red: the same case on the HEAD reducer exits 1 with `actual: { P0: 0, P1: 0, P2: 5 }`, recorded in implementation-summary.md. Cumulative branch: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:801` and `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1079` | Met | - |
| AC-003 | REQ-003 | Given the existing summary-fallback fixtures, when the deep-loop script tests run, then they pass unchanged | Met. The test file diff removes no line, so every fixture is unchanged (`git diff` shows additions only for `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs`). The per-run cases `testSummaryOnlyFallback` at `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:119`, `testSummaryWithoutFindingsCountPadsPerRun` at `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:410` and `testSummaryDivergingFromFindingsCountPadsPerRun` at `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:428` pass in the same run, which printed `[deep-review] reduce-state summary fallback regression passed` | Met | - |
| AC-004 | REQ-004 | Given the relaunch-loop review folder, when the reducer reruns, then its registry reports P2 12 and holds no `SUMMARY-` row | Met. On-disk registry: `specs/hooks/023-session-relaunch-loop/review/deep-review-findings-registry.json:384` reads `openFindingsCount` 12, with `findingsBySeverity` P0 0, P1 0, P2 12 and zero `SUMMARY-` occurrences. Rerun: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` on a scratch copy of the packet exits 0 and its open findings match the on-disk registry exactly (12 ids, F7-P2-001 through T3-P2-002). The review folder itself was not written | Met | - |
| AC-005 | REQ-005 | Given a delta finding row keyed `findingId` and no `id`, when `verify-iteration.cjs` enumerates the iteration's findings, then the row enumerates, and a row with neither key does not | Met. Cases `review-delta-finding-id` and `review-delta-no-id-key` at `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:623` and `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:624`. Code: `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:205`. Run from `.skilled/skills/system-deep-loop/runtime`: `npx vitest run tests/unit/verify-iteration.vitest.ts` exits 0 with `Test Files 1 passed` and `Tests 31 passed` | Met | - |
| AC-006 | REQ-006 | Given an iteration record that resolves a finding in a delta file, when the cumulative padding is counted, then that finding is not padded as an open summary-only row | Met. Case `testDeltaOnlyIterationRecordResolvesForCumulativePadding` at `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:376` passes in the one-file run. Red on the HEAD reducer: exits 1 with `actual: { P0: 0, P1: 0, P2: 5 }`. Code: the iteration-type guard at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:815`, the merged records at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1079`, and `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1093` | Met | - |
| AC-007 | REQ-007 | Given the findings from the fresh SWE reviews rv-open and rv2, when each finding in this phase's scope is checked, then it is fixed or accepted with its ledger entry, and the reviewed lanes pass the deep-loop tests | Met. rv-open raised reducer P2s at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:468`. The fix lane recorded them at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:471`. rv2 found no reducer defect and its P0 was disproved live at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`. The verifier string-id P2 is accepted with its rationale at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`. Tests: the one-file reducer run exits 0 and the verifier run exits 0 with 31 of 31 | Met | - |

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

**Closeable:** Yes

All seven criteria are Met. The reducer fix and the verifier fix each carry a named test with a red run on the HEAD code. Both declared edge cases now have tests. A row that carries both keys registers under `id` (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:446`), and a row with an empty `findingId` creates no finding (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:474`). The verifier still accepts only string ids, as the schema says, and that predates this packet.
<!-- /ANCHOR:closure -->
