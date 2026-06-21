# R2-28 Biggest Risk (adversarial)

**Angle summary:** The single biggest risk is that the program's named spine, the "truncation law", overstates the live code. Prod runs a confidence-gap truncator with a 3-result minimum, not a fixed top-3 cap, so the premise that freezes six retrieval phases rests on an unmeasured and partly self-contradicted reading.

**Slice:** review seat 28, angle adversarial, slice biggest-risk.

**What I checked and what held.** I treated the keystone (A1, "extend the live quality machinery to authored docs") as the rival biggest-risk candidate and tried to break it. It held. `computeMemoryQualityScore` (`quality-loop.ts:392-422`) is genuinely pure, it calls four scorers and returns a score object with no content write and no truncation. The destructive `attemptAutoFix` substring-trim to an 8000-char budget is real (`quality-loop.ts:460-470`) and the research correctly fences it off as NEVER-reuse. The keystone half survives, so the biggest risk lands on the retrieval spine, not the keystone.

---

## FINDINGS

### F1 — P1 — The spine premise "truncates every query to a 3-result floor" overstates the live gap-truncator

- **Evidence (LIVE CODE):** `confidence-truncation.ts:30` documents `minResults` as "Minimum number of results to always return, regardless of gap. Default: 3", and `confidence-truncation.ts:35` sets `DEFAULT_MIN_RESULTS = 3`. The function returns ALL results unchanged when the flag is off (`:117`), when there are `<= minResults` results (`:130`), when scores are flat so `medianGap === 0` (`:148`), and when no gap exceeds `2 * medianGap` (`:175`). It only cuts at a genuine relevance cliff and never below 3. The prod call site `hybrid-search.ts:2049-2073` invokes it with no custom `minResults` and reassigns `reranked` only when `truncationResult.truncated` is true. The flag `SPECKIT_CONFIDENCE_TRUNCATION` is default TRUE (`search-flags.ts:214-217`).
- **Evidence (SPEC PREMISE):** `research/research.md` section 1 EXECUTIVE VERDICT (line 8): "The prod retrieval path truncates every query to a 3-result floor". The number 3 is a per-query MINIMUM on a gap-based truncator, so prod returns 3-or-more and returns the full tail whenever no cliff fires. "Every query to a 3-result floor" asserts a universality and a fixed cut depth the code does not provide.
- **Internal contradiction that proves the overstatement:** `027-retrieval-floor-experiment/spec.md:67` describes the SAME mechanism accurately as "a 3-result floor layered with a gap-cliff at roughly 2x the median gap and a token budget". The program contradicts its own spine, the careful reading lives in 027 while the headline in research.md and the C2 spec (`015-c2-prodmode-recall-gate/spec.md:65`) carry the fixed-3 framing.
- **Why it is the biggest risk:** This premise is the program's explicit organizing thesis ("The truncation law is the spine", research.md section 6). It freezes the entire Tier-C retrieval slate (014, 016, 017, 018), justifies standing up the whole C2 measurement apparatus (015), and motivates 027. A reviewer who takes "every query to 3" literally believes external recall@5/@10 is mechanically invisible in prod, when for flat-distribution queries prod already returns the full tail and those numbers are partly visible.
- **Classification:** SPEC-PREMISE issue. The cited file:line (`confidence-truncation.ts:35`) is real, the INTERPRETATION layered on it is overstated.
- **Mitigated?** PARTIALLY. 027 is the one phase built to measure the tail and it carries the accurate layered reading. But the mitigation is gated behind the still-conditional unbuilt C2 (015), and 027's sweep overrides `DEFAULT_MIN_RESULTS` to 5/8/10 (`027 spec.md:79-80`), which only changes outcomes for queries whose cliff currently lands at index 2 to 4. The 2x gap-cliff multiplier that actually governs the cut for most queries is left as an OPEN question (`027 spec.md:31`), not a committed sweep variable, so the designed mitigation under-tests the real mechanism.

### F2 — P1 — The whole retrieval half is a single point of failure on C2's uncalibrated human-authored goldens

- **Evidence (SPEC PREMISE):** `015-c2-prodmode-recall-gate/spec.md:77` builds a hand-authored `spec-corpus-golden.json` whose relevance sets are the sole verdict input, and `:78` plus REQ-001 (`:108`) require every Tier-C promotion and regression to read ONLY the prod completeRecall@3 column against those goldens. SC-003 (`:128`) requires only that the goldens be non-saturating and multi-target. Nothing in 015 or any sibling phase independently validates that the relevance sets are CORRECT.
- **Why it matters:** Every retrieval verdict in the program (C1, C3, C4, C5 and the 027 sweep) inherits whatever notion of relevance the goldens encode. If the goldens are wrong, every downstream promote/regress decision is wrong with no cross-check, and the program treats that single instrument as the non-negotiable arbiter.
- **Classification:** SPEC-PREMISE / design-gap issue (the instrument is unbuilt, the gap is in the design of the gate).
- **Mitigated?** NO for golden correctness. `015 spec.md:188` flags calibration of per-class THRESHOLDS as an open question but says nothing about validating the relevance sets themselves. The instrument has a threshold dial and no calibration check on its ground truth.

### F3 — P2 — The plain-language SUMMARY encodes the strongest and least accurate version of the spine

- **Evidence (SPEC PREMISE):** `SUMMARY.md:9`: "Search only ever shows the top 3 results ... it cuts the answer down to about three results ... This single rule decides whether every idea below is worth doing." This is the doc a non-expert reader uses to understand the program, and it drops the gap-cliff and the minimum-not-cap nuance entirely, stating a flatly incorrect model of prod retrieval as the rule that decides the whole program.
- **Classification:** SPEC-PREMISE issue.
- **Mitigated?** NO. The accurate reading exists only in 027's spec body, which a SUMMARY-only reader never reaches.

---

## RETURN

- **Slice:** r2-28 adversarial / biggest-risk
- **Counts:** P0: 0, P1: 2, P2: 1
- **Most important finding:** F1. The program's named spine, "prod truncates every query to a 3-result floor", overstates the live gap-based truncator (`confidence-truncation.ts:30,35,130,148,175`; `hybrid-search.ts:2049-2073`), which returns the full tail whenever no relevance cliff fires and never cuts below a 3-result MINIMUM. The program contradicts itself here, 027's body reads it correctly while research.md and 015 carry the fixed-3 framing. It is partially mitigated by 027, but that mitigation sits behind the unbuilt C2 gate and sweeps the minimum floor rather than the gap-cliff multiplier that actually governs the cut. The keystone half is sound, so this retrieval-spine overstatement is the one thing most likely to misdirect the future build.
