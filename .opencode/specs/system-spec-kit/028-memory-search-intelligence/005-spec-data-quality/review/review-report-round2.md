# Round-2 Deep Review: Data-Quality Subsystem

> 30 review iterations across 6 angles (code quality, architecture, wiring, documentation, effectiveness, adversarial), run as parallel opus seats. Each seat read the LIVE system-spec-kit code the program grounds in, not only the 005 docs, since 005 ships nothing. Findings are tagged SPEC-PREMISE (the docs claim X) versus LIVE-CODE (the real tree shows Y).

## Verdict: CONDITIONAL

The data-quality program rests on a real, code-grounded foundation. The keystone machinery ships and is default-ON, A4 is a genuine low-risk win, and the shared engine earns its abstraction. But the program carries one load-bearing premise overstatement, the truncation-law K=3 framing, that propagates into the decision-facing docs AND mis-designs the C2 retrieval gate, and it over-scaffolds 28 full phases when the defensible build is single-digit. The direction is right. The magnitude, the C2 metric, the A4 census sizing, and the scope all need correction before any build.

Coverage: all 30 slices returned findings. Roughly 100 findings total: 1 design-blocking, ~29 P1, ~40 P2, the rest confirmed-clean. The findings cluster into six themes below. This is research-only, so every finding is correctable in the spec before a line of code lands.

---

## Theme 1: The truncation-law spine overstates the K=3 cutoff (HEADLINE, convergent across 5 independent slices)

Five slices that never saw each other (16 research-soundness, 22 truncation-law, 24 c2-correctness, 28 biggest-risk, 30 worth-building) independently reached the same conclusion, and slice 28 named it THE biggest risk to the program.

- **The premise:** SUMMARY.md:9 says "Search only ever shows the top 3 results ... This single rule decides whether every idea below is worth doing." spec.md exec lines 50-51 says the prod path "truncates every query to a 3-result floor."
- **The live code:** `DEFAULT_MIN_RESULTS = 3` (`confidence-truncation.ts:35`) is a MINIMUM GUARANTEE, not a cap. It is documented as "Minimum number of results to always return, regardless of gap." `truncateByConfidence` returns unchanged when count is at or below 3 (`:130`), only searches for a cutoff at or after index `minResults - 1` (`:166`), and otherwise returns ALL results up to `DEFAULT_LIMIT = 20`. Test T13/T16 assert `toBeGreaterThanOrEqual(DEFAULT_MIN_RESULTS)` (`confidence-truncation.vitest.ts:198-215`), proving 3 is a floor. The caller names the field `minResultsGuaranteed` (`hybrid-search.ts:2065`).
- **Two further precision errors:** the real prod-limiting mechanism is TOKEN-BUDGET truncation (`run-eval-v2.mjs:18-20,44`), a different stage than the confidence floor the law borrows the "3" from. And prod context strategies default to limits of 5, 8 and 10 (`memory-context.ts:1077,1097,1127`), not 3.
- **What survives:** the law's two CONCLUSIONS hold and are live-code corroborated. The eval-vs-prod fidelity gap is real and first-class (eval skips truncation via `if (!evaluationMode)` at `hybrid-search.ts:2049`, reported as a FIDELITY metric), so external recall@K alone genuinely cannot promote a retrieval candidate (Tier-C stays gated) and write-time candidates genuinely bypass the floor (ship on cost). The directional tiering is sound. The mechanism statement and the "every query, down to 3" magnitude are not.
- **Blast radius:** the overstatement is worst in the decision-facing translation. SUMMARY.md is the doc an approver reads, and its load-bearing one-liner inflates the "retrieval work is wasted past top-3" conclusion that deprioritizes the entire Tier-C slate.

## Theme 2: The C2 gate (completeRecall@3) is mis-designed for its stated purpose

The single most consequential design finding (slice 24 rated F1 a P0, a cross-phase contradiction).

- **Blind to its own dependents' band:** 015 reads ONLY completeRecall@3, yet it is the keystone that unblocks 027 (which sweeps floors 5/8/10 to test whether ranks 4-10 are signal) and C1/C4 (gated on "the floor can move"). A relevant doc surfaced at rank 4-8 is invisible to @3, so the keystone instrument cannot register the success of the keystone-dependent work. The harness ALREADY computes the prod-column @5 and @8 (`COMPLETE_RECALL_KS = '3,5,8'`, `run-eval-v2.mjs:43`), but 015 scopes them out on the false floor-vs-cap premise from Theme 1.
- **Mathematically headroom-starved:** completeRecall is `hits / relevantIds.size` (`eval-metrics.ts:380-395`). REQ-004 mandates relevance sets of length 2+ with no cap. For any N-target query with N>3, completeRecall@3 is capped at 3/N below 1.0. A 5-target query is frozen at a 0.6 ceiling, and surfacing the 4th or 5th target earns zero @3 credit. The metric under-discriminates the exact multi-target wins it was built to detect.
- **Order-insensitive:** completeRecall@3 is pure set membership with no rank weighting. A change that pulls a 2nd target to rank 3 while pushing the best doc from rank 1 to rank 3 RAISES the metric while DEGRADING the top result the reader sees first, and PROMOTION mode would pass it. The harness computes NDCG, MRR and top1 (`eval-metrics.ts:253-315,426-445`) but the gate consumes none. A C2 pass does not imply a better reader experience.
- **Class contradiction:** `hard_negative` is frozen as a measurability class (expected-NOT-citable, empty relevant set) yet REQ-004 forces every query to carry 2+ targets, and `meanCompleteRecallProfile` skips zero-ground-truth queries. The gold-set author gets mutually exclusive instructions.
- **Fix:** widen the gate to the @3/@5/@8 columns the harness already emits, and fold in at least one order-sensitive metric, before this gate becomes the retrieval tier's single promotion path.

## Theme 3: A4's "11 invalid graph files" census does not survive a real run

Slice 23 re-ran the real `graphMetadataSchema` over the live 2059-file corpus.

- **The count is wrong:** a real `safeParse` fails 24 files (16 excluding archives), not 11. The "11" matches only the JSON-parse-failure subcount, never the count against the target schema (`004/spec.md:140`, `research.md:21`).
- **The wrong files:** the 11 are nested deep-loop text-stub artifacts under `research/.../iterations/`, not root packets. The genuine failing roots (`.opencode/specs/graph-metadata.json` legacy two-key shape, plus three `026-.../022-...` packets failing on `migration_source`, missing `depends_on[].source`, out-of-enum `save_lineage`) are NOT in the 11. These are exactly the cases the spec's own Risk-row-4 anticipates but never re-counted.
- **"Unconditional" overstates:** A4 is unconditional as a DECISION, not as a FLIP. The error flip is gated on a re-measure-to-zero backfill (REQ-004, the four-beat discipline). The live count is 16-24 today, not 0.
- **But safety holds, and the win is real:** the re-measure-to-zero gate WOULD catch the undercount before any flip. And every other half checks clean: 0 of 2059 files are grandfathered (the bypass is genuinely dead), the scope touches no ranking or re-index surface, and `folderDescriptionSchema` already fails 0 of 2054 description files. A4 remains a real, low-risk free win. It is mis-sized and mis-labeled, not unsound.

## Theme 4: The program over-scaffolds (28 full phases versus a single-digit defensible build)

Slices 9, 25, 29, 30 converge here.

- Only ONE phase is a measured unconditional GO (A4). Tier C (014-018) is hypothesis-until-prod-measured. The novel slate is mostly GO-on-cost-thin or NO-GO. SUMMARY.md itself calls the search-tuning items "maybes, do not build until proven."
- Yet conditional and subsumed phases carry full build-bound Level-2 scaffolds (spec+plan+tasks+checklist+summary each), and all 28 ship a hollow implementation-summary that inverts that doc's purpose for a research-only deliverable.
- The 18-item NO-GO list enumerates 5 items that are actually GO-on-cost or conditional and already have build folders (slice 29 F1). The phase-map inflates the novel slate from GO-on-cost to flat GO (slice 25 F2).
- **Minimal high-value subset (the honest build):** 004 (A4, free and measured), 026 (the shared engine reuse seam), 001 (A1 keystone), 003 (A3 enum-constrain). Defer all of Tier C and the thin novel items behind a real prod@K read. The honest framing is "single-digit buildable phases plus a measurement gate," not "a 28-phase program."

## Theme 5: Wiring and seam gaps in the keystone and engine

- **A1 keystone:** H1b byte-identity is unachievable at the named `description.json` seam (slice 03 F1, the writer serializes differently there), and the live scorer is markdown-body-shaped so reusing it verbatim on JSON metadata needs adaptation (slice 01).
- **026 engine:** INV-1 is sold as "mechanical" but can only check declarations, not behavior (slice 07 F1). Five of the seven novels never touch the shared sweep or engine, so 026 overstates itself as their foundation, and the two that do mount break the engine's single-target pure-runner contract (slice 10 F1/F2).
- **Flag registration:** the `FLAG_CHECKERS` plus drift-guard registration is non-constructible as written (slice 13 F1), the "flag-ceiling proves default-off" claim is false (F2), and A7 mis-routes validate.sh flags into flag-ceiling against its own precedent (F3).
- **Verification homing:** the 23-suite verification contract has no CI home (slice 27 F1), and the skill-graph drift gate names no validate-time transport and has no provable test (F2).

## Theme 6: Documentation accuracy (mostly in docs authored this session)

- **Tracking doc (`benchmark-and-test-status.md`):** rows 004 and 008 carry cross-phase metric contamination (A3's enum swap-precision printed for A4, A7's unlinked-REQ printed for A8), row 020 invents a test filename the phase never declares, row 022 prints an undecided threshold as declared (slice 19).
- **research.md internal:** the executive verdict says "four" novel capabilities while the tables say "seven," the NO-GO count of 18 does not reconcile with the 13 visible entries, and the CONDITIONAL slate counts C2 the gate among the items frozen behind itself (slice 16).
- **The 015-gates-itself self-reference recurs across three slices:** the parent `spec.md:183,211` calls 015 the unblocker for "every Tier-C item" though 015 is itself Tier-C (the child scopes it correctly to "C1, C3, C4, C5"), the changelog gates C2 on itself, and the CONDITIONAL slate counts C2 among the items frozen behind itself (slices 15, 16, 18). A builder taking the parent wording literally hits a self-cycle under the 028 topological-sort contract.
- **Parent-versus-child wiring drift (slice 15):** the parent build-order names two dependency edges where the governance child names five inviolable edges, and the 026 edge lists only A1/B1/B2 where the child adds B3 and the C-class detectors. Plus a within-child wobble (026 "five front doors" versus SC-001 "three").
- **Minor:** phase 001's status label drifts from its 27 siblings into the rollup, and a few directory attributions in research.md drop the `scripts/core/` prefix (slices 18, 30 F4).

---

## What is genuinely sound (the foundation is real, not fictional)

- **The keystone premises are code-confirmed.** The quality loop is live and default-ON (`search-flags.ts:182,395`, both "Default: TRUE graduated"). The A1 reuse targets exist (`generate-context.ts` `atomicWriteJson`, `post-save-review.ts` `reviewPostSaveQuality` wired through `workflow.ts`). The A4 gate is real and dormant (`validator-registry.json:192,200`, the zod schema, the `legacy_grandfathered` bypass A4 retires).
- **The shared engine (026) is architecturally sound** and earns its abstraction, a genuinely shared safety-critical decision over git-tracked authored docs.
- **The scripts-to-handlers import boundary** the program worried about is real, CI-enforced, and correctly resolved via the api-barrel route (slice 14).
- **The seam citations are mostly accurate** (slices 11, 17 found the H1/H2/H3 map and most file:line cites correct), the changelogs are scrupulous (slice 18), and the claim-honesty largely holds (slice 20 found only that "measured GO" labels a measured input as a proven outcome, a framing nit not a fabrication).

---

## Prioritized remediation (before any build)

| # | Sev | Finding | Fix | Evidence |
|---|-----|---------|-----|----------|
| 1 | P0 | C2 @3-only gate blind to the rank 4-8 band its dependents move | Widen 015 to the @3/@5/@8 columns the harness already emits, add an order-sensitive metric | `eval-metrics.ts:385`, `run-eval-v2.mjs:43,316`, `027/spec.md:3,31` |
| 2 | P1 | Truncation-law overstates floor as cap, across SUMMARY/spec/tracking | Reframe as a cliff-conditional never-cut-below-3 floor (returns 3..20), name token-budget as the real prod mechanism, keep the surviving direction | `confidence-truncation.ts:35,130,166`, `confidence-truncation.vitest.ts:214` |
| 3 | P1 | A4 census says 11 invalid, real run fails 24 (16 live), wrong files | Re-measure against the target schema, list the real failing roots, reframe "unconditional GO" as decision-unconditional/flip-gated | `graph-metadata-schema.ts:61-71`, `004/spec.md:140` |
| 4 | P1 | 003 producer guard incomplete (3 leak paths, spec names 1) | Guard `deriveStatus` 'unknown' and `deriveImportanceTier` raw-tier paths, not only `normalizeDerivedStatus` | `graph-metadata-parser.ts:180,1041,1071-1079` |
| 5 | P1 | 003 enum-enforce flag cannot gate an enum baked into the schema | Use a dual lenient/strict schema or a flag-gated superRefine, not a bare z.enum swap | `graph-metadata-parser.ts:341,1125,1149` (no flag seam) |
| 6 | P1 | Flag registration (13), engine novel-fit (10), verification CI home (27) non-constructible/unhomed as written | Correct the flag-ceiling routing, scope 026 to the 2 novels that mount, give the 23-suite contract a CI home | `flag-ceiling.vitest.ts`, slices 10/13/27 |
| 7 | P1 | Over-scaffolding: 28 full phases, single-digit defensible | Reframe scope to the minimal subset (004, 026, 001, 003) plus the measurement gate, mark Tier-C and thin-novel as deferred-not-ready | `research.md:29,51,79-85` |
| 8 | P1 | Tracking doc rows 004/008 metric contamination | Print A4's census-conformance metric and A8's provenance metric, not A3's and A7's | `benchmark-and-test-status.md:24,28` |
| 9 | P2 | research.md internal count drifts (four/seven, 18/13, C2-behind-itself) | Reconcile the executive verdict with the tier tables | `research.md:8,74-80,132` |

Themes 1, 3 and 4 are the same root cause seen from three angles: the program reasoned correctly about DIRECTION (retrieval needs proof, write-time is cheap) but attached an overstated MAGNITUDE (top-3 cap, 11 files, 28 phases) to each. Correcting the magnitude does not collapse the program. It right-sizes it.

## Honest status

This review changed no reviewed file. The findings are against SPEC PREMISES and LIVE CODE, separated per finding. Nothing in 005 is built, so all of the above is correctable in the specs before implementation. The minimal subset (004, 026, 001, 003) is worth building and the machinery it leans on genuinely ships. The retrieval tier and most novel items are correctly self-gated as unproven and should be reframed as deferred, not scaffolded as ready.
