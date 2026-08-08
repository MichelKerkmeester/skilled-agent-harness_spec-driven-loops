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
    recent_action: "Built+verified agent-improvement independent derivation; 2/6 modes done"
    next_safe_action: "Build 4 remaining converters (2 same-shape, deep-alignment + deep-review harder)"
    blockers:
      - "Blocker 1 NOT fully discharged: 2/6 modes done, 4 remain (each needs its own independent oracle)"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts"
    completion_pct: 33
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
| **Status** | In Progress (2/6 modes built + verified: deep-ai-council + agent-improvement; 4 remain) |
| **Updated** | 2026-08-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**2 of 6 shadow-parity modes built and verified: deep-ai-council (F-006-01) and agent-improvement (F-012-01).** The other four modes remain unbuilt (see Known Limitations).

### agent-improvement (F-012-01)

Same defect shape as council: `ledgerProjection` folded the reducer, validated `outcome==='projected'`, then discarded the typed fold and returned the same `legacyProjection(events,…)` raw-event hand-scan. New independent converter `agentImprovementProjectionFromReducerState` derives the ledger side from the reducer's typed `folded.projection`; the legacy side keeps the raw-event scan. Red-before (mock `foldAgentImprovementEvents` to corrupt `agentIrVersions[0].compilerFingerprint` in the typed output only): pre-fix harness reported `ok:true` (byte-identical digests); rebuilt harness reports `ok:false` / `divergence.class:'projection-semantic'`, and a separate injected-payload-drift test also fails the harness with a `payload` class, while identical inputs still pass. tsc rc0; `agent-improvement-shadow-parity.vitest.ts` 35/35; `authorized-ledger` 28/28. Honest limit: three fields (`causalEvidence.locusIds` for intervention entries, `ablationDigests`, `blockingVetoCodes` from `promotion_denied`) are unrecoverable from the reducer's current persisted schema and are left empty with code comments — a reducer-schema gap, not a derivation defect, and not exercised by the current fixture (which never emits those events).

### deep-ai-council (F-006-01)

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

1. **Blocker 1 is NOT fully discharged — 2 of 6 modes done.** deep-ai-council and agent-improvement now derive independently and their harnesses fail on injected divergence. The other four modes still compare a projection to a near-copy of itself and would not fail on a planted divergence:
   - **model-benchmark, skill-benchmark** — same defect shape as council/agent-improvement (fold, discard, call the shared hand-scan) and a reusable independent legacy oracle exists; each is fixable with a pilot-equivalent converter over its own large typed-projection schema.
   - **agent-improvement (done)** carries an honest residual: three fields (`causalEvidence.locusIds` for intervention entries, `ablationDigests`, `blockingVetoCodes` from `promotion_denied`) are unrecoverable from the reducer's current schema and left empty; closing them needs a reducer-schema change (broader blast radius), not a harness change.
   - **deep-alignment** — both sides call the same `projectionView(foldProjection(events))`; there is no existing raw-event hand-scan to reuse as an independent oracle, so it needs a from-scratch legacy oracle (larger effort).
   - **deep-review** — worst shape: `ledgerProjection` launders a reducer exception straight into legacy success, and on a successful fold only spot-checks 5 fields then returns the legacy projection anyway; ~150 lines of dead copy-paste code use the wrong (deep-research) schema and are unusable. Needs the exception-laundering removed AND a genuine from-scratch converter.
2. **Full 022 discharge requires the 5 remaining converters**, each verified the same way (an injected divergence must fail the harness; identical inputs must still pass). The pilot showed even a careful field-by-field mapping can miss one real semantic gap that only surfaces by diffing actual computed output — so each remaining mode needs its own empirical intermediate-state diff, not just inspection.
<!-- /ANCHOR:limitations -->
