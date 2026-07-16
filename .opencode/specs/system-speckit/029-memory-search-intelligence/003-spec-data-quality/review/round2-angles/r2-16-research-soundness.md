# r2-16 research-soundness

Angle summary: research/research.md is internally near-coherent on its convergence math (5 lineages, 37 iterations, 1 unconditional GO all reconcile) but its load-bearing truncation-law claim mischaracterizes the live code it cites, and three GO/CONDITIONAL/NO-GO counts disagree between the executive verdict and the tier tables.

## FINDINGS

### P1 — Truncation-law spine misreads DEFAULT_MIN_RESULTS as a cap when it is a minimum guarantee
- Evidence (LIVE-CODE): `research.md` §1 line 8 claims "The prod retrieval path truncates every query to a 3-result floor (`confidence-truncation.ts:35`, `DEFAULT_MIN_RESULTS = 3`...)". The cited file says the opposite. `confidence-truncation.ts:30-35` documents `minResults` as "Minimum number of results to always return, regardless of gap" and `truncateByConfidence` (`confidence-truncation.ts:82-160`) only truncates when a consecutive score gap exceeds 2x the median gap (a relevance cliff), returns ALL results unchanged when no such gap exists (line 91), and never cuts below the protected minimum of 3. The caller confirms this: `hybrid-search.ts:2065` names the field `minResultsGuaranteed: DEFAULT_MIN_RESULTS`, and `hybrid-search.ts:2049-2068` applies it only when `truncationResult.truncated` is true.
- Type: LIVE-CODE issue.
- Why P1 not P2: this is the declared "spine" (§6 line 117) and the premise for the entire floor-tax ROI inversion that orders all 28 phases. "Truncates EVERY query TO a 3-result floor" overstates on two axes. Truncation is cliff-conditional not universal, and 3 is the never-cut-below guarantee not the truncation target. That inflates the per-query retrieval tax the tier ordering rests on.
- Why P1 not P0: the directional conclusion survives. The truncate call IS prod-only (`hybrid-search.ts:2049 if (!evaluationMode)`, eval path skips to `applyResultLimit` at line 2123), so a prod-vs-eval fidelity gap on retrieval candidates is real in shape, just not in the "every query, down to 3" magnitude the doc asserts. Citation is also imprecise: the `if (!evaluationMode)` wrap lives at `hybrid-search.ts:2049`, not at the cited `confidence-truncation.ts:35` which is only the constant declaration.

### P2 — Executive verdict says "four" novel capabilities, the table and convergence report say "seven"
- Evidence (SPEC-PREMISE): `research.md` §1 line 8 lists "four genuinely novel floor-bypassing capabilities the reuse-first work missed", but §3 (lines 74-80) enumerates seven GO-on-cost novel candidates (contradiction-detection, embedding-drift, example/test-gen, context-budget assembler, typed-relation KG, freshness-decay queue, per-doc SLAs) and §7 line 132 confirms "the seven novel GO-on-cost capabilities".
- Type: SPEC-PREMISE issue (doc-internal, executive-verdict vs tier-table contradiction).
- Note: the charitable reading is that §1 conflated the four novel AXES named in §3 line 70 (corpus consistency, measurement integrity, adherence concreteness and context density) with capabilities. Either way the most-read section misstates the headline count.

### P2 — Consolidated NO-GO count of 18 does not reconcile with the 13 visible entries
- Evidence (SPEC-PREMISE): `research.md` §7 line 132 claims "A consolidated NO-GO list of 18 items". The visible consolidated NO-GO surface is Tier D with 10 rows (`research.md` lines 57-66) plus 3 novel NO-GOs in §3 (lines 83-85: retrieval-driven auto-rewriting, auto-summarization rollup nodes, doc-quality leaderboard), totaling 13. No derivation in the document accounts for the remaining 5.
- Type: SPEC-PREMISE issue.
- Note: §1 line 8 references "ten governance anti-patterns" for the same list without a count, so only §7 asserts 18 and it is unverifiable against the doc's own tables.

### P2 — CONDITIONAL slate counts C2 (the gate) among the "5 items frozen behind the C2 gate"
- Evidence (SPEC-PREMISE): `research.md` §7 line 132 says "A CONDITIONAL retrieval slate of 5 items frozen behind the C2 prod@3 gate". Tier C is C1-C5 = 5 items, but C2 IS that gate ("C2 unblocker: a spec-corpus prod-mode completeRecall@3 benchmark plus a regression gate", line 46), and §3 line 51 states "Every Tier C item ships default-off behind ... the C2 gate", placing C2 behind itself. The genuine count of retrieval candidates frozen behind the gate is 4 (C1, C3, C4, C5), not 5.
- Type: SPEC-PREMISE issue (self-referential counting incoherence).

## CHECKED-AND-CLEAN
- Lineage and iteration math reconciles: 5 lineage rows (§7 lines 126-130), iteration sum 9+6+7+8+7 = 37 matches "Thirty-seven substantive iterations" in §0 line 4 and §7 line 122.
- "1 measured unconditional GO" is coherent across §1 line 8, §2 line 29 ("A4 is the only measured unconditional GO") and §7 line 132 ("the JSON-schema gate").
- Quality-loop keystone premise verified LIVE: `SPECKIT_QUALITY_LOOP` and `SPECKIT_QUALITY_AUTO_FIX` both default TRUE (`search-flags.ts:180,393`), supporting §1 line 8 and A1.
- The 5.9x eval-vs-prod figure (§1 line 8) is a cross-packet 028 premise, not present in this tree. Not counted as a finding since it is cited as a prior 028 measurement, not a claim about this corpus's code.

RETURN: slice r2-16-research-soundness | P0=0 P1=1 P2=3 | Most important: the truncation-law spine (§1) mischaracterizes `DEFAULT_MIN_RESULTS = 3` as a universal truncate-to-3 cap when the cited code makes it a cliff-conditional never-cut-below-3 minimum, inflating the floor-tax ROI premise that orders all 28 phases.
