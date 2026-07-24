# Amendment review — GLM-5.2 (max, via cli-opencode)

Independent senior-architect review of the ADR-001 selection-fix mechanism. Every load-bearing claim verified against the code.

> **VERDICT: Option A is correct — make the surface router authoritative for leaf routing — but ship it with one mandatory coherence fix (the contract's reported `workflowModes` must become the surface-derived set, not the hub's, or you trade zero-emission for a silent mode/leaf-divergence lie). ADR-001 as stated is the bug.**

## Verified against code
- Two genuinely independent passes: hub → `intents` (`router-replay.cjs:574-576,596`); `resourceContract.pairs` from a separately-loaded surface router (`:582-604`); pair `workflowMode` packet-derived from the leaf path via the registry (`buildResourceContract :222-241`), never from the hub.
- Killer filter confirmed: `buildTypedResourceContract` slices `router.intents` to 2 and keeps only pairs whose packet-mode ∈ that hub set (`executor-dispatch.cjs:75,81`).
- Hub over-selection root cause, worse than stated: `projectHubRouter` unions *all* `classes` keywords into each mode (`:121-128`); every create-X mode shares `authoring-actions` (`hub-router.json:37`), so any authoring verb fires all 12 modes at parity; `selectIntents` has no tiebreak (`:404-408`) → insertion order wins. `routerPolicy.tieBreak` (`hub-router.json:7`) is **dead** — never read. That alone makes Option C indefensible.
- SD-015 unfixed by the bypass flag: `fullInventoryIntent` returns `modes` unchanged, but `modes` *is* `router.intents` = `[]` (hub has no full-inventory mode) → 111 pairs → 0.

## Q1 — Why A, not B/C
A changes *which list gates the contract* from the structurally-incapable hub to the only classifier that emits leaf paths; fixes all 5 zero + 8 diverge, regresses none. B (union) over-bundles by definition on every divergent case → trades zero-recall for a D2 precision collapse (another scored failure). C can't fix SD-015 at all (no hub inventory mode) and rests on a dead tiebreak.

## Q2 — A does NOT undermine the hub; the dims are already separated
`intentRecall = setRecall(expected.intentKeys, routerResult.intents)` (hub, `score-skill-benchmark.cjs:1311`) and `resourceRecall` (leaves, `:1312`) are computed from different inputs; `d1intra = 0.4·intentRecall + 0.6·resourceRecall` (`:38-39,209`); plus a dedicated `hubRoute` dim (`gate.hubRoute.knownGaps === 5`). Option A touches only the leaf cap → only `resourceRecall`; `intentRecall` and `hubRoute` are byte-for-byte unchanged. The hub error stays *visible*, not masked.
**Coherence fix (mandatory, same change):** set the contract's advertised `workflowModes` to the surface-derived set; keep the hub's pick only in `routeTelemetry.workflowMode` (scored by `hubRoute`). Then advertised-mode == loaded-mode.

## Q3 — Land A now; the holdout is orthogonal
Every option depends on the same surface-router fit, so "wait for the holdout" decides nothing between them. RESOURCE_MAP maps each intent to a *small* leaf set → worst held-out case is a bounded precision regression, vs today's unbounded zero-on-core. Ship the bounded failure; land behind guards (keep `hubRoute` surfaced; move the 5 zero cases to "fixed", assert `hubRoute.regressions === 0`; flag the fitted status).

## Q4 — What's missing
1. The bypass is structurally broken beyond SD-015 (any surface-only "all modes" intent silently zeroes).
2. `tieBreak` is dead code — the surface cap also needs a deterministic order or it's insertion-order-fragile.
3. Negation / mention-without-intent unhandled in both routers (plain substring `taskLower.includes`).
4. A test encodes the buggy invariant: `sk-doc-leaf-routing-contract.vitest.ts:127-128` asserts `workflowModes === ['alpha-mode','beta-mode']` (hub set) — rewrite to the surface-derived set + coherence property.
5. **Cleaner than all three (follow-on):** collapse to a single classifier — two independent keyword routers over the same prompt is the root cause; the surface router already *is* the intent→leaf map, with the hub demoted to telemetry.

### Risks, ranked
1. Coherence lie (HIGH, must-fix-in-same-change) — advertised ≠ loaded unless `workflowModes` re-pointed. Silent.
2. Fitted surface router (MEDIUM, tracked) — holdout closes it; bounded failure, acceptable now.
3. Unenforced tiebreak (MEDIUM) — add a deterministic policy.
4. Stale test (LOW-MEDIUM) — rewrite or it masks regressions.
5. Negation (LOW now, MEDIUM later).
