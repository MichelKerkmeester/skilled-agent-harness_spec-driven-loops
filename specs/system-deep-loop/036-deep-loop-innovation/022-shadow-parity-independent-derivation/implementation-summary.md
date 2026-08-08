---
title: "Implementation Summary: Shadow Parity Independent Derivation"
description: "1 of 6 shadow-parity modes built + verified: deep-ai-council now derives its ledger side from the reducer's typed state (councilProjectionFromReducerState), independent of the legacy raw-event scan; a divergence-injection test fails the rebuilt harness where a shared-derivation harness could not, identical inputs still pass (tsc rc0, 41/41). Five modes remain unbuilt, each needing its own from-scratch converter."
trigger_phrases:
  - "shadow parity independent derivation implementation"
  - "blocker 1 parity harness not built"
  - "divergence injection test missing"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/022-shadow-parity-independent-derivation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/022-shadow-parity-independent-derivation"
    last_updated_at: "2026-08-08T03:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built+verified deep-ai-council independent derivation; divergence test fails harness (1/6)"
    next_safe_action: "Build 5 remaining modes' independent converters; deep-review needs exception-laundering fix"
    blockers:
      - "Blocker 1 NOT fully discharged: 1/6 modes done, 5 remain (each needs its own independent oracle)"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts"
    completion_pct: 17
    open_questions: []
    answered_questions:
      - "Is Blocker 1 discharged? Partially — 1 of 6 modes (deep-ai-council) built + verified with a real red-before/green-after divergence test; 5 modes remain unbuilt."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-shadow-parity-independent-derivation |
| **Level** | 3 |
| **Status** | In Progress (1/6 modes built + verified: deep-ai-council; 5 remain) |
| **Updated** | 2026-08-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**1 of 6 shadow-parity modes — deep-ai-council (F-006-01) — built and verified.** The other five modes remain unbuilt (see Known Limitations).

Before: `councilLedgerProjection` folded the reducer only to validate `outcome === 'projected'`, then discarded `folded.projection` and called the SAME `councilProjectionFromEvents(...)` raw-event hand-scan that `councilLegacyProjection` calls (differing only by a `'ledger'`/`'legacy'` string) — so the harness compared a projection to a near-copy of itself and could not detect a reducer-internal divergence (the F-006-01 defect).

After: a new independent converter `councilProjectionFromReducerState` (~200 lines) derives every field of the ledger-side projection from the reducer's own typed `DeepAiCouncilProjectionState` (`run`, `councilSeats`, `critique`, `blindedAdjudication`, `convergence`, `artifacts`, `testGate`, `status.provenance`, `seenEvents`) — with no path back into the raw event array. `councilLedgerProjection` now folds first, throws if the fold is not `'projected'`, and returns `councilProjectionFromReducerState(folded.projection, …)`. The legacy side keeps the independent raw-event hand-scan, so the two sides now derive by genuinely different code paths.

Red-before / green-after (verified against the real pre-fix code, not simulated): with the reducer fold's `testGate.verdict` mocked `pass`→`fail`, the PRE-fix harness reported `ok: true` (byte-identical digests — could not see the divergence); the REBUILT harness reports `ok: false`, `divergence.class === 'projection-semantic'`, `certificateStatus: 'refused'`. A paired test confirms identical (uncorrupted) inputs still report `ok: true` / `certificateStatus: 'issued'`. One real field-fidelity gap (`roundIds` before `round_started`) was found empirically by diffing intermediate projections across event-counts 0–13 and fixed (union in `state.run.roundId`); 0 differences remain on the identical-input path.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The deep-ai-council mode was delivered T001-confirm-first, red-before → green-after: the defect was reproduced against the real pre-fix code (a mocked reducer-internal divergence the old harness reported as parity-pass), the independent converter was built, and the same injection now fails the harness while identical inputs still pass. `tsc --noEmit` rc 0; `deep-ai-council-shadow-parity.vitest.ts` 41/41; `authorized-ledger.vitest.ts` 28/28 (no regression). The scoped diff touches only the council harness adapter and its test. The other five modes were surveyed but not built — see Known Limitations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not modify `spec.md`, `checklist.md`, `tasks.md`, or `decision-record.md` | They already report Planned/0%/Proposed accurately; there is no honesty gap to correct in this packet, only a missing `implementation-summary.md` |
| Verify only one of the six adapters in depth (council) plus diff-check the other five | The diff-check alone (zero lines changed in five of six adapters, one/two trivial unrelated lines in the sixth) is sufficient to establish none of the six were rebuilt; the deep read of the council adapter confirms the specific defect mechanism is still present, not merely that the file is unchanged |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p tsconfig.json` from `runtime/` | rc 0 |
| `deep-ai-council-shadow-parity.vitest.ts` (incl. the new divergence-injection test) | 41/41 passed (144s) |
| `authorized-ledger.vitest.ts` (regression) | 28/28 passed |
| Red-before (pre-fix harness restored from HEAD, reducer `testGate.verdict` mocked pass→fail) | reported `ok: true` (byte-identical digests) — could NOT detect the reducer-internal divergence |
| Green-after (rebuilt harness, same injection) | `ok: false`, `divergence.class: 'projection-semantic'`, `certificateStatus: 'refused'`; identical inputs still `ok: true` / `issued` |
| Independent-derivation check | ledger side derives from `folded.projection` via `councilProjectionFromReducerState`; legacy side keeps the raw-event hand-scan — two distinct code paths |
| Other 5 modes (deep-alignment, agent-improvement, model-benchmark, skill-benchmark, deep-review) | Not built — still same-derivation (see Known Limitations) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Blocker 1 is NOT fully discharged — 1 of 6 modes done.** deep-ai-council now derives independently and its harness fails on injected divergence. The other five modes still compare a projection to a near-copy of itself and would not fail on a planted divergence:
   - **agent-improvement, model-benchmark, skill-benchmark** — same defect shape as council (fold, discard, call the shared hand-scan) and a reusable independent legacy oracle exists; each is fixable with a pilot-equivalent converter over its own large typed-projection schema (comparable effort to the pilot each).
   - **deep-alignment** — both sides call the same `projectionView(foldProjection(events))`; there is no existing raw-event hand-scan to reuse as an independent oracle, so it needs a from-scratch legacy oracle (larger effort).
   - **deep-review** — worst shape: `ledgerProjection` launders a reducer exception straight into legacy success, and on a successful fold only spot-checks 5 fields then returns the legacy projection anyway; ~150 lines of dead copy-paste code use the wrong (deep-research) schema and are unusable. Needs the exception-laundering removed AND a genuine from-scratch converter.
2. **Full 022 discharge requires the 5 remaining converters**, each verified the same way (an injected divergence must fail the harness; identical inputs must still pass). The pilot showed even a careful field-by-field mapping can miss one real semantic gap that only surfaces by diffing actual computed output — so each remaining mode needs its own empirical intermediate-state diff, not just inspection.
<!-- /ANCHOR:limitations -->
