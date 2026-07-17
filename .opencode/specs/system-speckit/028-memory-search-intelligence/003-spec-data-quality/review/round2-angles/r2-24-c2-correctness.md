# R2-24 c2-correctness: is prod-mode completeRecall@3 the right unblocker metric

**Angle summary:** Prod-mode completeRecall@3 is gating on the wrong band. The metric is structurally blind to ranks 4 and beyond, which is the exact band its own declared dependents (027 floor experiment, C1 prefix) exist to move, and the inadmissibility rationale that justifies the @3-only scope rests on a floor-versus-cap misread that the live code refutes.

---

## FINDINGS

### FINDING 1 (P0) The @3-only gate is blind to the floor-movement signal its own dependents produce

**Issue type:** SPEC-PREMISE (cross-phase contradiction)

The 015 gate reads only completeRecall@3 (REQ-001/002/003 and SC-001/002/003 all bind the verdict to completeRecall@3) and is declared the keystone that unblocks every Tier-C and 027 retrieval item. completeRecall@3 only ever inspects the top 3 results (`topK(results, k)` with k=3, eval-metrics.ts:385). But 027 exists to answer "whether results 4-10 are signal or noise" and to sweep floors of 5, 8 and 10 (027 spec.md:3, 027 spec.md:31), and C1/C4 are gated on first proving "the floor can move" (research.md:48). A relevant doc surfaced at rank 4 through 8 is invisible to @3, so the keystone instrument cannot register the success of the keystone-dependent work. The harness ALREADY computes the prod-column @5 and @8 it would need (`COMPLETE_RECALL_KS` default '3,5,8', run-eval-v2.mjs:43; `prodMode` profile written per class, run-eval-v2.mjs:316), yet 015 scopes those bands out (015 spec.md:87, 015 spec.md:197).

**Evidence:** 015 spec.md:78,87,108,197 (gate reads only @3); 027 spec.md:3,20,31 (027 needs ranks 4-10, sweeps 5/8/10, depends on 015); research.md:48 (C4 builds only after the floor is shown to move); eval-metrics.ts:385; run-eval-v2.mjs:43,316.

**Why it matters:** A Tier-C feature whose whole point is to push a relevant doc from the long tail into ranks 4-8 can pass nothing and regress nothing at @3. The instrument cannot discriminate the win it was built to certify.

---

### FINDING 2 (P1) The inadmissibility rationale rests on a floor-versus-cap misread of live truncation

**Issue type:** LIVE-CODE refutes SPEC-PREMISE

015 states the prod path "truncates every query to a 3-result floor" and that "the K=3 floor hides exactly that band" of @5/@10/@20 (015 spec.md:65, 015 spec.md:87, 015 spec.md:197). Live code shows `DEFAULT_MIN_RESULTS = 3` is a MINIMUM, not a cap: it is documented as "Minimum number of results to always return, regardless of gap" (confidence-truncation.ts:30-35). The gap cutter only trims at a confidence cliff at or after index `minResults - 1` and otherwise returns ALL results up to the search limit (confidence-truncation.ts:130, confidence-truncation.ts:166, confidence-truncation.ts:175), and the prod seam runs that cutter only outside evaluationMode against a 20-wide window (hybrid-search.ts:2049-2068, run-eval-v2.mjs:46,182-194). A floor of 3 guarantees at least 3, it does not cap at 3, so it cannot "hide" ranks 4 through 20. The prod-column @5 and @8 are real populated reads, not artifacts. The premise that makes @3 "non-negotiable" and @5/@8 "inadmissible" is false against the tree.

**Evidence:** 015 spec.md:65,87,197; confidence-truncation.ts:30-35,130,166,175; hybrid-search.ts:2049-2068; run-eval-v2.mjs:46,182-194,316.

**Why it matters:** The metric choice is justified by a property the code does not have. Remove the false premise and there is no reason to discard the @5/@8 prod columns the harness already emits.

---

### FINDING 3 (P1) "complete" is unreachable and headroom-starved for multi-target sets at K=3

**Issue type:** LIVE-CODE plus SPEC-PREMISE

completeRecall is fractional: numerator is hits within top-K, denominator is the FULL relevant-set size (`hits / relevantIds.size`, eval-metrics.ts:380-395). REQ-004 mandates every gold query carry a relevance set of length 2 or more with no upper bound (015 spec.md:111) and SC-003 only forbids single-target queries (015 spec.md:128). For any query with N relevant targets where N is greater than 3, completeRecall@3 is mathematically capped at 3/N below 1.0, and no top-3 reorder can lift it. A causal_chain query with 5 targets is frozen at a 0.6 ceiling. A feature that genuinely surfaces the 4th or 5th target earns zero @3 credit. So K=3 under-discriminates precisely the multi-target recall wins the gate was built to detect. The fractional formula gives some resolution for 2-target and 3-target sets, so this is a narrowing rather than a total blind spot, which is why it is P1 not P0.

**Evidence:** eval-metrics.ts:372-396 (numerator clipped to topK=3, denominator is full set); 015 spec.md:111 (REQ-004 length 2 or more, no cap), 015 spec.md:128 (SC-003 forbids only single-target).

**Why it matters:** The name promises completeness the cutoff cannot deliver for the larger gold sets, and the band where the headroom lives (4-8) is the band the gate refuses to read.

---

### FINDING 4 (P1) completeRecall@3 is order-insensitive, so a C2 pass does not imply a better reader experience

**Issue type:** LIVE-CODE

completeRecall@3 is pure set membership within the top-3 window with no rank weighting (eval-metrics.ts:386-393). A Tier-C change that pulls a 2nd target from rank 4 to rank 3 while pushing the single best doc from rank 1 to rank 3 RAISES completeRecall@3 (one more target inside the window) while DEGRADING the top-1 result the prod reader sees first. PROMOTION mode would pass that change (015 spec.md:110, REQ-003 exits zero on any measured rise). The harness already computes the order-sensitive metrics that would catch this (NDCG and MRR and top1 precision, eval-metrics.ts:253-315,426-445), but the gate consumes none of them. So a C2 pass is necessary-ish but not sufficient for a prod-reader improvement, which directly answers the second half of the angle: a feature can pass C2 and still leave the reader worse off at rank 1.

**Evidence:** eval-metrics.ts:386-393 (membership only, no rank discount), eval-metrics.ts:253-315,426-445 (order-sensitive metrics exist and go unused); 015 spec.md:110 (REQ-003 promotes on any rise).

**Why it matters:** The gate certifies window-membership, not ranking quality. The reader experiences ranking. The two can move in opposite directions and the gate would not see it.

---

### FINDING 5 (P2) hard_negative as a measurability class collides with REQ-004's mandatory 2-target rule

**Issue type:** SPEC-PREMISE

`MEASURABILITY_CLASSES` freezes three classes including `hard_negative` (run-eval-v2.mjs:51-55), and REQ-004 forces every gold query of any class to carry a relevance set of length 2 or more (015 spec.md:111). But a hard negative is defined as expected-NOT-citable with no relevant target (eval-metrics.ts:743,758), completeRecall returns 0 when the relevant set is empty (eval-metrics.ts:383), and `meanCompleteRecallProfile` SKIPS queries with zero ground truth entirely (run-eval-v2.mjs:219-226). So the gold-set author is handed mutually exclusive instructions: tag a query hard_negative (whose correct signal is absence) yet give it 2 or more relevant targets. Either the hard_negative rows violate REQ-004 or they invert the class semantics.

**Evidence:** run-eval-v2.mjs:51-55,219-226; eval-metrics.ts:383,743,758; 015 spec.md:111 (REQ-004).

**Why it matters:** The contradiction lands at gold-set authoring time (Phase 2) and would either drop the hard_negative class silently or seed it with semantically wrong targets, weakening the very discrimination the gate claims.

---

## SLICE STATUS

Not clean. The angle's core question resolves against the spec: prod-mode completeRecall@3 is gating on the wrong band for its stated purpose, and the rationale for excluding @5/@8 is refuted by the live truncation code. All five findings carry file:line or doc:section evidence. The data-quality program is research-only, so findings 1, 2, 3 and 5 are correctable in the 015 spec before any build, and finding 4 is a design gap to fold into the gate's metric set.
