---
title: "Implementation Summary"
description: "The review reducer reads a delta finding keyed findingId and stops cumulative summaries padding phantom summary-only rows into the registry."
trigger_phrases:
  - "findings summary integrity implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity"
    last_updated_at: "2026-10-18T18:26:37Z"
    last_updated_by: "generate-context"
    recent_action: "Added edge-case tests for both keys and empty findingId; both pass with no reducer change"
    next_safe_action: "Commit after operator approval"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs"
      - ".skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs"
    session_dedup:
      fingerprint: "sha256:b7b64a147b48a3e8e5fc693906f08c07a09b44dd57524a6569aab7799edcb8ef"
      session_id: "scaffold-009-findings-summary-integrity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-findings-summary-integrity |
| **Completed** | 2026-10-18 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The review registry now lists the findings the leaves reported. Before this phase, a leaf that keyed a delta finding with `findingId` passed verification, then lost its row in the reducer, and a cumulative `findingsSummary` padded the registry with summary-only rows for findings already listed. The relaunch-loop review showed 23 open P2 rows where 12 were real, and the registry now reports P2 12 with no `SUMMARY-` row.

### Phase 9: findings-summary-integrity

The reducer reads `findingId` as well as `id` when it turns a delta row into a finding, so the row reaches the registry. When a summary is the running total, its severity sum equals the record's `findingsCount`, and the fallback now counts every finding active by that run before it pads. Per-run summaries keep the old padding. The verifier enumerates the same two keys, so the two components agree on what a delta row is. The resolved-id scans read the merged main and delta iteration records, with a type guard, so a finding resolved only in a delta file is not padded as open.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | `findingId` alias in the delta intake; cumulative-aware fallback; merged resolved-id scans; iteration-type guard; comment at `summaryIsCumulative` |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` | Modified | Regression cases for the `findingId` row, the cumulative summary, the cumulative exclusion of resolved findings and the delta-only resolution; no existing line changed |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modified | Delta finding rows enumerate when keyed `id` or `findingId` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modified | Cases `review-delta-finding-id` and `review-delta-no-id-key` |
| `specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity/spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Modified or created | Scope, REQ-005 to REQ-007, AC-005 to AC-007, task and checklist evidence, and this summary |
| `specs/system-deep-loop/038-review-and-cli-lineage/spec.md` | Modified | Phase-map row 9 set to Complete; handoff row updated to the closure check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests came first where a lane recorded them. The reducer change shipped through a build lane, and two fresh SWE reviews followed. rv-open requested changes for a resolved-id scan that ignored delta-side iteration records and for a missing comment on the cumulative heuristic, and both were fixed (`specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:468`, `:471`). rv2 found no reducer defect, disproved its one P0 live, and accepted the string-only verifier id as a predating contract (`specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`).

The lane that built the reducer change has no outcome line in the ledger, so its red run is not on record there. At phase close, the four new reducer cases were run against the HEAD reducer in a scratch mirror (the HEAD `reduce-state.cjs` plus the HEAD tree around it, with the new test file). Each case exited 1 with the phantom count, and the working-tree reducer exits 0 on the same file. The mirror output is in the session scratchpad, not in the repository.

The registry is not rewritten by this phase. The reducer was rerun on a scratch copy of the relaunch-loop packet, with `TMPDIR` set to the scratch root because the reducer refuses spec folders outside the approved roots and the OS temp dir. The rerun exits 0, and its open findings match the on-disk registry exactly.

The full deep-loop gate reported by the orchestrator at 20:02 today is node 375/375 with rc 0, and this phase reran the two suites it changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A summary counts as cumulative when its severity sum equals `findingsCount` | The contract's example writes the running total, and a per-run sum that matches by chance is read as cumulative. That errs toward fewer padded rows, and a test covers a per-run summary that must still pad. |
| The reducer and the verifier read the same two id keys | A leaf row that verification accepts must reach the registry, or the two components disagree about what a delta row is. |
| The string-only verifier id stays as it is | The schema already says strings, and the behavior predates this packet. Reviews accepted it, recorded at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`. |
| The registry is verified by a scratch rerun, not rewritten | The review folder sits outside this phase's write scope, and the on-disk registry already matches the rerun exactly. |
| The Pi findings from the same review wave are not part of this phase | They concern the Pi extension, and they are tracked in `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` | PASS, exit 0, `tests 1 pass 1 fail 0` |
| Same file against the HEAD reducer, one new case at a time (mirror run) | FAIL as expected, exit 1 for each of the four new cases, with phantom counts: `{ P0: 1, P1: 1, P2: 1 }` for the findingId case and P2 5, 4 and 5 for the cumulative cases |
| `npx vitest run tests/unit/verify-iteration.vitest.ts` from `.skilled/skills/system-deep-loop/runtime` | PASS, exit 0, `Test Files 1 passed`, `Tests 31 passed` |
| `node --check` on the two changed reducer and verifier files | PASS, exit 0 each |
| Reducer rerun on a scratch copy of the relaunch-loop packet | PASS, exit 0; open findings 12, P2 12, `SUMMARY-` rows 0, identical to the on-disk registry |
| Pattern scan of added lines for secrets | PASS, 0 matches |
| Orchestrator full gate, run 20:02 today | Reported rc 0 by the orchestrator (node 375/375); not rerun in this phase |
| Pre-existing failures | Five `STALE_SOURCE_DIGEST` vitest failures in the full unit folder are inherited from main, recorded at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:473` |
| `validate.sh specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity --strict` | RESULT: PASSED, Errors 0, Warnings 0, exit 0, run after `repair-derived.cjs --apply` and the continuity save |
| Edge-case tests (both keys, empty `findingId`) | PASS on the first run with no reducer change; deep-review suite pass 1, fail 0; registry rerun P2 12, `SUMMARY-` 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **String-only verifier ids.** The verifier accepts only string ids, as the schema says. A numeric id would not enumerate, and that behavior predates this packet.
2. **The registry is not rewritten here.** The on-disk registry was produced by earlier lanes and matches a fresh rerun, so this phase verifies it and leaves the review folder alone.
<!-- /ANCHOR:limitations -->
