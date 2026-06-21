# Iteration 002 — KQ2: LLM-as-judge wired to a real ranking consumer + auto-generated answerable-questions/semantic-intent

## Focus

Two candidates the reuse-first program touched only at arm's length. (a) An LLM-as-judge semantic quality score wired into a REAL ranking or gate consumer, not the governance-only role the parent gave it. (b) answerable_questions + semantic_intent metadata AUTO-GENERATED (LLM-written, not hand-authored) and fused into retrieval.

## What the live code actually does

- The ranking consumer is real and small. `stage2-fusion.ts:264-296` `applyValidationSignalScoring` reads `validationMetadata.qualityScore` and applies `qualityFactor = 0.9 + qualityScore*0.2`, a [0.9,1.1] multiplier on the composite score, BEFORE truncation. So any per-doc score written to `qualityScore` can reorder the prod top-3. The seam exists and is live.
- The score that flows into it today is form-only (structure/triggers/anchors), per the parent and dq-deep. An LLM-judge SEMANTIC score is a different input to the SAME multiplier.
- answerable_questions / semantic_intent: grep across mcp_server search is EMPTY. No live consumer reads them in ranking, fusion, or filtering. They persist on disk and are silently dropped from the vector (the 028 trap, confirmed for this lineage).

## The novel delta vs the reuse-first program

- The reuse-first LLM-judge verdict was "governance-only, marginal value over form-only scorers unproven, CONDITIONAL." The novel framing is sharper: the judge's output is not a new lane, it is a new INPUT to the existing [0.9,1.1] multiplier. The novelty is wiring a semantic signal into a consumer that already moves the floor — so it is the cheapest possible retrieval-class experiment (no new ranking code, only a better number in an existing field).
- For answerable_questions: the reuse-first verdict was "extend the parser allow-list or it is dropped." The novel angle is AUTO-GENERATION — an LLM writes the questions a doc can answer, and they are fused as a query-expansion / pseudo-query surface (HyDE-adjacent; `lib/search/hyde.ts` exists). This is distinct from hand-authoring the field.

## Value per reader

- LLM-judge → qualityScore: R marginal (a [0.9,1.1] nudge can flip a near-tie in the top-3, nothing more — the band is deliberately narrow), A/L real (a semantic quality number is a true governance and gate signal). The honest ceiling is the multiplier band: even a perfect judge moves a score by at most ±10 percent, so it reorders ties, it does not rescue a low-ranked relevant doc.
- Auto-gen answerable_questions: R potentially real IF fused as pseudo-queries at index time (widens the surface a query can match), but ONLY if a consumer is built — today it is a dropped field. A/L low.

## Floor survival

- LLM-judge: the multiplier runs pre-truncation, so it CAN change top-3 composition — but within a ±10 percent band, so it is floor-relevant-but-weak. Promotable only by a prod-mode completeRecall@3 read (inherits the parent law).
- Auto-gen answerable_questions: floor-escape-capable only after both (1) auto-generation and (2) a parser/fusion consumer are built; until the consumer exists it is inert on disk.

## Go / No-Go

- LLM-judge wired to qualityScore: GO-on-cost as a governance/gate signal (the score is honest there), CONDITIONAL as a retrieval lever (the ±10 percent band caps the win; prove marginal value over the form-only scorer via C2 before paying an LLM pass per doc). Novel contribution: identify that the consumer already exists and the judge is just a better input, not a new lane.
- Auto-gen answerable_questions/semantic_intent fused: CONDITIONAL. The auto-generation is novel and cheap, but it is a dead field until a fusion consumer is built, and that consumer is retrieval-class and C2-gated. NO-GO as a standalone field; GO only as the input half of a built-and-measured pseudo-query fusion.

## Dead Ends

- Treating the LLM-judge as a new ranking lane: it is not, the multiplier exists; over-building a parallel scorer repeats the dq-deep "no second scorer" rail.
- Auto-generating answerable_questions without building the consumer: produces a populated-but-ignored field, the exact 028 silent-drop failure.

## Sources

- `stage2-fusion.ts:264-296` (qualityScore [0.9,1.1] multiplier, pre-truncation)
- `lib/search/hyde.ts` (pseudo-query substrate for an answerable-questions fusion)
- grep answerable_questions|semantic_intent across mcp_server search = EMPTY (no live consumer)
- Parent CONDITIONAL tier (LLM-judge, answerable_questions); dq-deep "no second scorer" rail

## Assessment

newInfoRatio 0.80 — sharpened both candidates against the live consumer seam. The novel and useful half is small but real: the LLM-judge is a better input to a shipped multiplier, not a new system. Both stay retrieval-CONDITIONAL under the floor; the judge has honest governance value today.
