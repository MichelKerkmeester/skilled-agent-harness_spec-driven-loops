---
title: "Implementation Summary: Shadow Parity Independent Derivation"
description: "All 6 shadow-parity modes built + verified + landed (council, agent-improvement, model-benchmark, skill-benchmark, deep-alignment, deep-review): each derives its ledger side from the reducer's typed state (or a from-scratch legacy oracle) independently of the legacy side, and a divergence-injection test fails the rebuilt harness where a shared-derivation harness could not while identical inputs still pass. Blocker 1 (independent derivation / divergence-detectability) is DISCHARGED; REQ-005 full-surface fixture coverage remains open across all modes."
trigger_phrases:
  - "shadow parity independent derivation implementation"
  - "blocker 1 parity harness not built"
  - "divergence injection test missing"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-shadow-parity-independent-derivation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/002-shadow-parity-independent-derivation"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Built+verified deep-review converter; 6/6 modes, Blocker 1 discharged"
    next_safe_action: "Blocker 1 done; 014 still blocked on 024 (Blocker 3, unbuilt)"
    blockers:
      - "Blocker 1 DISCHARGED (6/6 modes); 014 still blocked on 024 (Blocker 3, unbuilt) + REQ-005 fixtures open"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Is Blocker 1 discharged? YES — all 6 modes built + verified with real red-before/green-after divergence tests (council, agent-improvement, model-benchmark, skill-benchmark, deep-alignment, deep-review). Residual: REQ-005 full-surface fixture coverage."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-shadow-parity-independent-derivation |
| **Level** | 3 |
| **Status** | Blocker 1 DISCHARGED — all 6 modes built + verified + landed (council, agent-improvement, model-benchmark, skill-benchmark, deep-alignment, deep-review). Residual: REQ-005 full-surface fixtures + formal closeout docs |
| **Updated** | 2026-08-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**All 6 shadow-parity modes built and verified: deep-ai-council (F-006-01), agent-improvement (F-012-01), model-benchmark (F-012-02), skill-benchmark (F-012-03), deep-alignment (F-006-02), deep-review (F-012-04).** Each derives its ledger and legacy sides by genuinely different code paths, and each harness fails on a planted divergence while passing identical inputs — so Blocker 1 (independent derivation / divergence-detectability) is discharged. REQ-005 full-surface fixture coverage remains open across all modes (see Known Limitations).

### model-benchmark (F-012-02, scope-out) + skill-benchmark (F-012-03, consume-new-fields)

These two revealed the reducers were lossy for fields the legacy scan reads. GPT-5.6-SOL classified each field (see Known Limitations). **model-benchmark:** the 4 service-locator fields are incidental, so the legacy scan's suffix branch now returns `[]` and the new `modelBenchmarkProjectionFromReducerState` agrees — both sides drop them, parity holds; divergence test `ok:false`/`projection-semantic`, identical inputs `ok:true`; 39/39. **skill-benchmark:** the reducer was fixed (landed) to persist the load-bearing evidence digests; `skillBenchmarkProjectionFromReducerState` now consumes them, matching legacy's sticky last-write semantics (verified field-by-field + a prefix-by-prefix incremental-fold diff, which also caught a real `state.run` vs `state.common.run` bug); divergence `ok:false`, identical `ok:true`; 19/19. Both tsc rc0.

### agent-improvement (F-012-01)

Same defect shape as council: `ledgerProjection` folded the reducer, validated `outcome==='projected'`, then discarded the typed fold and returned the same `legacyProjection(events,…)` raw-event hand-scan. New independent converter `agentImprovementProjectionFromReducerState` derives the ledger side from the reducer's typed `folded.projection`; the legacy side keeps the raw-event scan. Red-before (mock `foldAgentImprovementEvents` to corrupt `agentIrVersions[0].compilerFingerprint` in the typed output only): pre-fix harness reported `ok:true` (byte-identical digests); rebuilt harness reports `ok:false` / `divergence.class:'projection-semantic'`, and a separate injected-payload-drift test also fails the harness with a `payload` class, while identical inputs still pass. tsc rc0; `agent-improvement-shadow-parity.vitest.ts` 35/35; `authorized-ledger` 28/28. Honest limit: three fields (`causalEvidence.locusIds` for intervention entries, `ablationDigests`, `blockingVetoCodes` from `promotion_denied`) are unrecoverable from the reducer's current persisted schema and are left empty with code comments — a reducer-schema gap, not a derivation defect, and not exercised by the current fixture (which never emits those events).

### deep-ai-council (F-006-01)

Before: `councilLedgerProjection` folded the reducer only to validate `outcome === 'projected'`, then discarded `folded.projection` and called the SAME `councilProjectionFromEvents(...)` raw-event hand-scan that `councilLegacyProjection` calls (differing only by a `'ledger'`/`'legacy'` string) — so the harness compared a projection to a near-copy of itself and could not detect a reducer-internal divergence (the F-006-01 defect).

After: a new independent converter `councilProjectionFromReducerState` (~200 lines) derives every field of the ledger-side projection from the reducer's own typed `DeepAiCouncilProjectionState` (`run`, `councilSeats`, `critique`, `blindedAdjudication`, `convergence`, `artifacts`, `testGate`, `status.provenance`, `seenEvents`) — with no path back into the raw event array. `councilLedgerProjection` now folds first, throws if the fold is not `'projected'`, and returns `councilProjectionFromReducerState(folded.projection, …)`. The legacy side keeps the independent raw-event hand-scan, so the two sides now derive by genuinely different code paths.

Red-before / green-after (verified against the real pre-fix code, not simulated): with the reducer fold's `testGate.verdict` mocked `pass`→`fail`, the PRE-fix harness reported `ok: true` (byte-identical digests — could not see the divergence); the REBUILT harness reports `ok: false`, `divergence.class === 'projection-semantic'`, `certificateStatus: 'refused'`. A paired test confirms identical (uncorrupted) inputs still report `ok: true` / `certificateStatus: 'issued'`. One real field-fidelity gap (`roundIds` before `round_started`) was found empirically by diffing intermediate projections across event-counts 0–13 and fixed (union in `state.run.roundId`); 0 differences remain on the identical-input path.
### deep-alignment (F-006-02)

The hardest mode: both sides previously called the same `projectionView(foldProjection(events))`, with no pre-existing raw-event hand-scan to reuse as an independent oracle. New `deepAlignmentLegacyOracleProjection` is a from-scratch switch-based fold over all 40 event stems that never imports `foldDeepAlignmentEvents` or any reducer-internal helper, independently reimplementing the computed pieces (`legacyDerivedSeverity`/`legacyIsHardVetoClass`, `legacyReviewLoopBackbone`); `legacyProjection` now returns it while the ledger side keeps the reducer fold, so the two derive by genuinely different code paths. Empirical debugging (prefix-by-prefix diff over the fixture) found and fixed a real bug: semantically-identical-but-differently-ordered objects produced different replay fingerprints (fixed by canonicalising the cloned state — `return JSON.parse(canonicalJson(rawState))`). Red-before (corrupt `authorityAlignment.status`): pre-fix harness reported `ok: true` (undetectable); rebuilt harness reports `ok: false` / `divergence.class: 'projection-semantic'` / `certificateStatus: 'refused'`; identical inputs still `ok: true`. tsc rc0; `deep-alignment-shadow-parity.vitest.ts` 10/10. Honest limit: empirical field-by-field verification covers only the 9 event stems the current fixture emits; the other ~31 are implemented by the same direct-field-mapping method but not fixture-diffed (no fixture exercises them — the pre-existing REQ-005 surface-coverage gap shared across all modes).

### deep-review (F-012-04)

The last and worst-shaped mode: `ledgerProjection` laundered a reducer exception straight into legacy success AND, on a successful fold, spot-checked only 5 fields then discarded `folded.projection` and returned the legacy projection anyway — so both sides were the same derivation. ~230 lines of dead copy-paste code used the wrong (deep-research) schema. New independent converter `deepReviewProjectionFromReducerState` derives the ledger side from the reducer's typed `DeepReviewProjectionState` (`run`, `reviewLoop`, `findingLedger`, `artifactIndex`, `status`, `seenEvents`) with no path back to raw events; `ledgerProjection` now folds first and throws on any non-`projected` outcome (no legacy fallback). The legacy oracle `legacyReviewProjection` was strengthened to a complete independent implementation (reimplements the severity/hard-veto rule from scratch rather than trusting the event's self-reported severity) and confirmed to never call `foldDeepReviewEvents`. The dead wrong-schema code + 4 unused type imports were deleted (net −81 lines). Red-before (mock `foldDeepReviewEvents` to corrupt `reviewLoop.outcome`): pre-fix harness reported the corrupted fold as `active`, byte-identical to legacy — blind; rebuilt harness reports `ok:false` / `divergence.class:'projection-semantic'` / `certificateStatus:'refused'` / `parityCertificate:null`; identical inputs `ok:true` / `issued`. tsc rc0; `deep-review-shadow-parity.vitest.ts` 10/10. Design fork (surfaced, resolved scope-out): `receiptRefs` and `reportOrder` are not persisted by the reducer's artifact record — classified incidental (real receipt-forgery detection lives at the untouched observation layer; the trust-critical `reportDigest` is fully recoverable), so normalized to `[]` on BOTH projection paths so the reducer's lossiness isn't hidden by one side faking a value.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The deep-ai-council mode was delivered T001-confirm-first, red-before → green-after: the defect was reproduced against the real pre-fix code (a mocked reducer-internal divergence the old harness reported as parity-pass), the independent converter was built, and the same injection now fails the harness while identical inputs still pass. `tsc --noEmit` rc 0; `deep-ai-council-shadow-parity.vitest.ts` 41/41; `authorized-ledger.vitest.ts` 28/28 (no regression). The scoped diff for council touched only the council harness adapter and its test. Four more modes (agent-improvement, model-benchmark, skill-benchmark, deep-alignment) were subsequently delivered the same confirm-first, red-before → green-after way — each landed separately with its own tsc-rc0 and per-file green suite (skill-benchmark also required a landed reducer fix to persist load-bearing evidence digests; deep-alignment and deep-review each required a from-scratch legacy oracle). deep-review additionally removed the reducer-exception-laundering and deleted ~230 lines of wrong-schema dead code. All six modes now derive their two sides by genuinely different code paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Packet evolved from audit to build | It began as an honesty audit (confirm the six adapters were unbuilt), then the operator directed building the missing converters. All six modes are now genuinely built + verified + landed; `spec.md` Status reports Blocker 1 discharged rather than the original Planned framing |
| Verify each built mode with an injected-divergence test, not inspection alone | The pilot showed a careful field-by-field mapping can still miss one real semantic gap that only surfaces by diffing actual computed output; so every built mode carries a red-before/green-after divergence test plus (for the harder modes) an empirical intermediate-state diff |
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
| agent-improvement / model-benchmark / skill-benchmark / deep-alignment | Built + verified independently — each its own red-before/green-after divergence test, tsc rc0, per-file green (35/35, 39/39, 19/19, 10/10 respectively) |
| deep-review | Built + verified independently — exception-laundering removed, `deepReviewProjectionFromReducerState` derives the ledger side, ~230 lines wrong-schema dead code deleted; red-before blind → green-after `ok:false`/`projection-semantic`/refused; tsc rc0, 10/10 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Blocker 1 is DISCHARGED — all 6 modes done.** deep-ai-council, agent-improvement, model-benchmark, skill-benchmark, deep-alignment, and deep-review now derive their two sides by genuinely different code paths, and each harness fails on an injected divergence while passing on identical inputs. Per-mode residuals below are all incidental fields or reducer-schema gaps — none block divergence-detectability:
   - **model-benchmark, skill-benchmark — done + verified + landed.** GPT-5.6-SOL classified each field: the 4 model-benchmark service fields (`evaluatorServiceRef`/`canaryServiceRef`/`promotionServiceRef`/`sharedServiceContractVersion`) are INCIDENTAL → scoped out of the comparator (no reducer change); the skill-benchmark evidence digests are LOAD-BEARING → the reducer was fixed to persist them (landed) and the converter consumes them. Both converters built + verified (model-benchmark 39/39, skill-benchmark 19/19, tsc rc0). Residual (honest): skill-benchmark's `certificateEvidenceDigests` (`evidenceSetDigest`) remains unrecoverable — the reducer uses it only for referential-integrity assertions during fold and never persists it; out of the reducer-fix scope, not exercised by the fixture, documented in code. `compatibilityEvidenceDigests` was already persisted (prior finding refuted).
   - **agent-improvement — done.** Honest residual: three fields (`causalEvidence.locusIds` for intervention entries, `ablationDigests`, `blockingVetoCodes` from `promotion_denied`) are unrecoverable from the reducer's current schema and left empty; closing them needs a reducer-schema change (broader blast radius), not a harness change.
   - **deep-alignment — done.** Needed a from-scratch legacy oracle (`deepAlignmentLegacyOracleProjection`, a switch-fold over all 40 event stems) because both sides previously shared `foldProjection`. Honest residual: empirical field-by-field verification covers only the 9 stems the current fixture emits; the other ~31 use the same direct-mapping method but are not fixture-diffed (the REQ-005 surface-coverage gap shared across all modes).
   - **deep-review — done.** Removed both the reducer-exception-laundering and the success-path laundering; built `deepReviewProjectionFromReducerState`; strengthened the legacy oracle to a complete independent implementation; deleted ~230 lines of wrong-schema dead code. Design fork (resolved scope-out): `receiptRefs`/`reportOrder` are not persisted by the reducer's artifact record — incidental (receipt-forgery detection lives at the untouched observation layer, and the trust-critical `reportDigest` is fully recoverable), normalized to `[]` on BOTH paths so the reducer's lossiness isn't hidden by one side faking a value.
2. **REQ-005 (full surface-to-test fixture mapping) remains open across all 6 modes.** Each mode's independent derivation + divergence test is proven, but only the fixture-emitted event stems are empirically diffed field-by-field (deep-review: 9 stems run the full pipeline; the rest are mapped by the same method but not fixture-diffed). Closing REQ-005 means adding fixtures that emit every stem. This is a thoroughness gap, not a divergence-detectability gap — Blocker 1's cutover-gating deliverable (a planted divergence fails the harness) holds for all 6.
<!-- /ANCHOR:limitations -->
