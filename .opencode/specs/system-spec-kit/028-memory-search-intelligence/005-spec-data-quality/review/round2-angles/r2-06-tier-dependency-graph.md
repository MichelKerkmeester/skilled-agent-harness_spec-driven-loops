# r2-06 tier-dependency-graph (architecture)

**Angle summary:** The 5 inviolable edges form a clean acyclic graph and the two edges the brief calls out (census-before-gate, engine-before-doors) are both correct, but the governance layer mis-scopes the set it orders (claims 18 phases against an authoritative 28), its edge model is heterogeneous so 3 of 5 edges cannot be the stage boundaries REQ-001 demands, and the live folder numbering encodes the INVERSE of both cross-phase safety edges.

Read: 028 spec.md, 028 plan.md, 028 tasks.md, parent 005 spec.md (phase map + build-order deps), research/research.md (sections 2-5), live folder tree (28 dirs). The 5 governance docs (rollout-sequence.md, migration-runbook.md, safety-model.md, measurement-plan.md, no-go-list.md) do NOT exist yet, so every ordering claim below is a SPEC PREMISE, not a built sequence.

---

## FINDING 1 — P1 — "Eighteen build phases" contradicts the parent's authoritative 28 child phases

The governance spec describes the program it must order as "a fleet of eighteen build phases" and names its non-scope as "the eighteen sibling phase specs" (028 spec.md:66, 89; plan.md:110). The authoritative phase parent says the opposite: "the implementation lives in the 28 child phases below, one child per converged recommendation" and enumerates all 28 across Tier A (001-010), B (011-013), C (014-018), Novel (019-025), Infra (026-028) (parent spec.md:153, 159-206). The layer sequences far more than 18: the engine (026) is the first stage, the 7 novel phases (019-025) are Phase VI, and 027 sits behind C2, all per 028 spec.md:78. The number 18 maps cleanly to Tier A+B+C only (10+3+5) and is then conflated with the coincidentally-also-18 NO-GO list, so the same word "eighteen" is used for two different sets in one document. The rollout-sequence.md "names each sibling phase folder per stage" (028 spec.md:96), and there are 27 siblings, so a sequence scoped to "eighteen" leaves ~9 phases unordered, which is the exact out-of-order-build risk this layer exists to kill.

- Evidence (SPEC PREMISE vs SPEC PREMISE): 028 spec.md:66,89 and plan.md:110 ("eighteen") contradict parent spec.md:153 ("28 child phases") and the 28-row table at parent spec.md:159-206.
- Type: SPEC-PREMISE.

## FINDING 2 — P1 — REQ-001 requires 5 edges as "named stage boundaries" but 3 of the 5 cannot be folder-stage boundaries

REQ-001 acceptance says "each of the five edges ... appears as a named stage boundary" in rollout-sequence.md (028 spec.md:113). The five edges are not the same kind of object. Only engine-before-doors and C2-before-retrieval-promotion are true cross-phase folder edges, and those two are exactly the parent's whole Build-Order Dependencies list (parent spec.md:210-211). The other three are a different granularity: backfill-before-error is an intra-gate BEAT that lives in migration-runbook.md per REQ-002 (028 spec.md:79, 114), census-before-gate gates on a runbook artifact 028 itself owns with no census phase folder (028 spec.md:80), and coverage-guard-before-retrieval-trust names a node with no folder at all (see Finding 4). A 17-stage sequence over phase folders cannot express a beat boundary or a folderless precondition as a "stage boundary," so REQ-001's acceptance criterion is unsatisfiable as written for 3 of 5 edges and SC-001 inherits the same defect (028 spec.md:133).

- Evidence (SPEC PREMISE): 028 spec.md:113 (REQ-001 AC) against 028 spec.md:79 (backfill beat in runbook), :80 (census artifact), :88 (coverage guard has no folder); parent spec.md:210-211 confirms only 2 cross-phase edges exist.
- Type: SPEC-PREMISE.

## FINDING 3 — P1 — Folder numbering encodes the INVERSE of both inviolable cross-phase edges

The numbering is not merely silent on build order, it actively inverts both safety-critical cross-phase edges. Engine-before-doors (edge 2) requires 026-shared-safe-fix-engine to ship before A1/B1/B2, yet the engine is numbered 026, after its consumers 001/011/012 (parent spec.md:210). C2-before-retrieval-promotion (edge 5) requires 015-c2-prodmode-recall-gate to ship before every Tier-C item including 014-c1-chunk-prefix, yet C2 is numbered 015, after C1 at 014 (parent spec.md:211). A contributor who reads the NNN prefix as build order, the spec-kit norm, builds both safety edges backwards. The only corrective is rollout-sequence.md, which does not exist. This affirms the gap the layer targets and adds a concrete requirement the eventual doc must carry: an explicit "numbering is not the build order" warning, because absence plus inversion is worse than absence alone.

- Evidence (LIVE-CODE / live tree): folders `014-c1-chunk-prefix` and `015-c2-prodmode-recall-gate` and `026-shared-safe-fix-engine` against the required order at parent spec.md:210-211.
- Type: LIVE-CODE.

## FINDING 4 — P2 — Edge 4 (coverage guard before retrieval trust) names a folderless node with a latent self-dependency

The coverage guard is the precondition for the entire retrieval half (028 spec.md:124 REQ-007), but it has no phase folder in the 28-child decomposition and the spec routes it "inside the C1 and C2 phases" (028 spec.md:88). That creates an ownership inversion: C1's re-embed REQUIRES the guard to pre-exist (research.md:45, "behind a coverage guard that does NOT exist yet"), yet the guard is said to be built inside C1, so built-in-C1 plus needed-by-C1 is a self-dependency unless C1 sequences the guard strictly first. The parent's Build-Order Dependencies omit the coverage-guard edge entirely (parent spec.md:208-211), so this inviolable edge is asserted in 028 but unrepresented in the authoritative graph. A dedicated coverage-guard phase ahead of C1/C2 would remove both the folderless-node and the self-dependency problems. No hard cycle exists in the cross-phase DAG, this is the one near-cycle.

- Evidence (SPEC PREMISE): 028 spec.md:88, :124 (REQ-007) against research.md:45 and the omission at parent spec.md:208-211.
- Type: SPEC-PREMISE.

## FINDING 5 — P2 — plan.md grounds the 18-item NO-GO list to a 3-row range, off by 5

plan.md:91 cites the NO-GO novel half as "the novel table (research/research.md:83-85)," but 83-85 is only the three strict-NO-GO rows (auto-rewrite, rollup, leaderboard). The eight non-unqualified-GO rows span research.md:78-85 (three qualified GO-on-cost at 78-80, two conditional at 81-82, three NO-GO at 83-85), which spec.md:83 and REQ-005 at spec.md:117 cite correctly as 78-85. Following the plan's range yields 10 Tier-D plus 3 novel = 13, not 18, which fails the benchmark PASS gate "the NO-GO enumeration count reads 18" (plan.md:145). Spec-internal citation conflict that would mislead the author of no-go-list.md.

- Evidence (SPEC PREMISE): plan.md:91 (83-85) against spec.md:83 and :117 (78-85) and the row layout at research.md:74-85; benchmark count at plan.md:145.
- Type: SPEC-PREMISE.

---

**Affirmed clean (with evidence checked):** No cycles in the cross-phase dependency graph (engine and C2 fan out, nothing points back to an ancestor). Census-before-gate is correct: RE-MEASURE-TO-ZERO needs the Stage-0 baseline before any warn-to-error flip (028 spec.md:79-80, research.md:108). Engine-before-doors is correct and matches the parent (the three front doors call the one shared engine, parent spec.md:210, research.md:91-93). The 17-stage / 7-phase count is asserted consistently across spec, plan, research with no internal contradiction in the count itself.
