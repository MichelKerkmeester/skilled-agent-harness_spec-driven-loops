## Verdict
AGREE-WITH-CHANGES — confidence 0.72 — the gate + measurement surface is genuinely high-ROI, but the contract's load-bearing role is assumed not shown, the card geometry is internally contradictory, and the success criteria conflate "fixed diagrams" with "converted diagrams".

## What GPT-5.5 got right
- **The gate is the real asset.** Making RC-1..RC-5 machine-checkable on the rendered DOM (not the model's self-report) is the correct load-bearing surface; everything else is decoration around it. NFR-R01 (render failure = explicit error, never silent pass) is the right invariant.
- **As-text vs as-fill distinction (NFR-C02)** is correctly identified as the RC-5 false-negative trap (`#8591b3` as stroke passes, as text fails). Most plans miss this.
- **Arm-based isolation (REQ-008)** with `control` byte-reproducibility is the right experimental discipline — it isolates whether the *contract* lifts SHIP (T1) vs the *gate+repair* (T2), which is the actual scientific question.
- **Scope fence is clean** — pushing primitive routing, skeleton-first 2D, and the adoption gate to later phases stops this phase from boiling the ocean.
- **Failure-only repair** (no second pass) is a pragmatic cap on cost and a clean handoff to phase 004 for residual failures.

## Gaps / risks / errors

1. **HARD — Card geometry is self-contradictory.** The spec says `SAFE_LINEAR_560` at 560×480 with visual box `x=30..530, y=30..328` and title band `y=356..456`. But the A1 research it claims to implement specifies **480×480** (`--tile-w:480px; --tile-h:480px`, `visualBox:[24,24,432,304]`). The continuity "answered question" hand-waves this away ("locked at 560x480, not 480") without re-deriving the geometry — the wider aspect (500px vs 432px visual width) changes row capacity, glyph sizes, and the gate's bbox thresholds. If the harness actually renders 480-tall, every Y threshold in REQ-006 is potentially wrong. **Resolve before freezing the contract.**

2. **SC-002 is a measurement-conflation trap.** "Diagram-vs-linear delta narrows from ~41 to 15-22 pts" — but A1's mechanism is *converting* diagrams into compact-matrix/stacked-list, not *fixing* spatial reasoning. The worst-band tiles stop being diagrams, so the delta shrinks by reclassification, not by skill gain. Phase 006's adoption decision will be reading a metric whose meaning changed mid-experiment. State this honestly: SC-002 should measure "post-conversion primitive score", not "diagram score".

3. **One-shot repair (REQ-007) is unvalidated.** No evidence GLM-5.2 given failure-JSON + screenshot actually resolves the failure in a single call. The 76-82% SHIP forecast assumes a repair success rate that has never been measured. Cost of being wrong: the entire T2 lift collapses and phase 006 blocks. **Run a 5-tile probe first** (below).

4. **The failure-JSON schema is load-bearing for phase 002 but deferred to "documented in plan.md" (REQ-009).** plan.md doesn't contain it. Phase 002 is blocked on a schema that doesn't exist. Freeze it in Phase-1 Setup as a versioned artifact, not a doc afterthought.

5. **T1 vs T2 attribution is buried.** SC-001 says "under the T2 arm" — but T1 (contract-only) is the cheap experiment and T2 is where the lift almost certainly lives (the research itself admits "prompt-only collision prevention is weaker than browser-measured overlap"). The plan structures the 45-tile pilot as if contract and gate contribute comparably. They likely don't. If T1 lift is ~0, the contract is decorative and could be cut to reduce prompt density (which the spec itself flags as the IFScale-cliff risk in §6).

6. **Contrast helper LOC and determinism are optimistic.** NFR-C02 requires walking every element, classifying SVG `stroke`/`fill` vs CSS `color`, and exempting `aria-hidden`. Realistically `contrast.mjs` alone is 200+ LOC, not bundled into a 200-450 total. Separately, NFR-C01 (determinism) is violated by async web-font load shifting bboxes — the gate must `await document.fonts.ready` + network-idle before measurement, which isn't specified.

7. **REQ-002 caps may trade correctness for safety.** "Matrix = header + max 3 rows + N more" assumes no Product tile semantically needs ≥4 rows. If any of the 45 tiles is a 5-invoice ledger where hiding rows loses meaning, the gate passes an *impoverished* tile. No audit of the 45 specs' row requirements is cited.

8. **Gate false-positive operating point is undefined** because the adoption-vs-repair-only question (OQ-1) is deferred to phase 006. If the gate ever blocks adoption, its FP rate on known-good tiles becomes critical — and REQ-006 only validates against 2 known-good examples (accountbeheer-5, kwartaalcijfers-2). That's undersized for a measurement surface 4 phases depend on.

9. **Scaffold leaks.** `Branch: system-speckit/028-memory-search-intelligence` is an unrelated packet; `fingerprint: sha256:0000…` is a placeholder; arm names switch between `control/a1_prompt/a1_gate_repair` (REQ-008) and `C0/T1/T2` (Edge Cases, Testing). Minor individually, but signals the docs weren't reconciled before this review.

## Strongest improvement or alternative
**Insert a 5-tile probe before the 45-tile pilot.** Take 5 known-bad diagram tiles (accountbeheer-4, oci-4, goedkeuringssysteem-4, orders-facturen-4, aangepast-assortiment-3), hand-inject the `SAFE_LINEAR_560` contract, and measure T1 lift *before* building the gate. Two outcomes, both valuable:
- **T1 lifts ≥10pts** → contract is load-bearing, full pilot justified, gate build proceeds.
- **T1 lifts <5pts** → contract is decorative under instruction load (as the research itself predicts); skip T1, build gate+repair only, cut contract tokens to ease the IFScale risk.

This costs ~1 hour and de-risks the entire 8-15h estimate + the unvalidated one-shot-repair assumption (the same 5 tiles can probe repair success rate simultaneously). The plan currently goes straight from "no code" to "full 45-tile pilot" with no intermediate falsification step — that's the single biggest methodological gap.

## One thing to test or verify before building this phase
**Confirm the actual rendered card dimensions** by reading the harness's reference shell CSS (`gen-tile.mjs` + the shell template). The 560×480 (spec) vs 480×480 (A1 research) contradiction must be resolved empirically before any bbox threshold in REQ-006 is trusted — otherwise the gate could pass/fail against the wrong coordinate space and every downstream phase inherits the error.