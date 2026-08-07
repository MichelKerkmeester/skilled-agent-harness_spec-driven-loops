# Iteration 003 — KQ3: Retrieval-driven doc auto-rewriting

## Focus

The aggressive capability the reuse-first program deliberately stopped short of. The reuse-first B3 edge captures low-retrieval / never-retrieved signals and QUEUES a refinement action, report-only, behind a hard rail: NO body-mutating auto-fix. This candidate crosses that rail: a low-retrieval doc is automatically REWRITTEN to improve its retrievability, then re-embedded.

## What the live code constrains

- The negative signal does not exist yet. `learned-feedback.ts` records only the POSITIVE edge (`recordSelection`); there is no impression/never-retrieved telemetry (dq-automation-impl verified the grep is empty). So the trigger for "this doc is low-retrieval" must be built first (the B3 capture), before any rewrite could fire.
- The destructive-fix precedent is real and cautionary. `quality-loop.ts attemptAutoFix` trims content by `substring` to an 8000-char budget — catastrophic on a 10.6KB authored spec. The reuse-first rail exists precisely because the one shipped auto-mutator is body-destructive.
- The only place a rewrite can help retrieval is the vector, and the vector is fed by `content-normalizer.ts` which strips frontmatter and flattens headings. So a rewrite that changes prose the normalizer keeps CAN move the embedding — making auto-rewrite genuinely retrieval-class and re-index-bound.

## The honest analysis

Auto-rewriting is the most ambitious idea in the topic and the most dangerous. It fails three independent tests:

1. **Authorship integrity.** A spec.md is an authored, human-owned, git-tracked artifact with a frozen-scope contract. Auto-rewriting its body to chase a retrieval metric mutates the source of truth to satisfy a proxy. The "no body auto-fix" rail is not timidity, it is correctness: the doc is the spec, not a retrieval feature.
2. **The proxy trap.** The reward signal is retrievability, which under the floor is the prod top-3. Optimizing prose to climb the top-3 is reward-hacking the embedding, and the parent law says the only valid proof is a prod-mode completeRecall@3 read — which means every rewrite would need a full re-index + dual-mode eval to even know if it helped. The cost-per-rewrite is enormous and the feedback loop is days long.
3. **Irreversibility at scale.** A corpus-wide auto-rewrite that subtly degrades 50 specs to "improve" 5 is net-negative and hard to detect, because the win is measured on a proxy and the loss is in human readability the proxy never scores.

## Value per reader

- R retrieval: hypothetically real (better prose can move the vector) but unprovable without a per-rewrite re-index, and reward-hacking-prone.
- A adherence + L logic: NEGATIVE risk. Machine-rewritten requirement prose can silently change meaning, the worst possible failure for an adherence/logic doc.

## Floor survival

Retrieval-class, re-index-bound, C2-gated AND rail-blocked. It pays the maximum floor tax (a re-index per rewrite cycle) for an unprovable win.

## Go / No-Go

- Auto-rewriting authored bodies: NO-GO. It crosses the one rail every prior lineage independently arrived at, mutates the source of truth to chase a proxy, and is unprovable per-change under the floor.
- The salvageable novel core: SUGGEST-only rewriting. An LLM proposes a diff for a low-retrieval doc, a human approves it, and the approved change flows through the normal authored-write path (where A1's score+suggest already lives). This is novel relative to B3 (which only queues a generic action) because it produces a concrete candidate DIFF — but it is human-gated, not automated. GO-on-cost as a suggest-only tool; the "auto" in auto-rewriting is the part that must die.

## Dead Ends

- Closed-loop auto-rewrite-and-re-embed: reward-hacks the proxy, mutates the source of truth, unprovable per-change.
- Rewriting to a quality-loop score: that score is form-only and a high score is not a retrieval win (dq-deep measurement-honesty finding).

## Sources

- `learned-feedback.ts` (positive edge only; negative signal absent)
- `quality-loop.ts attemptAutoFix` substring trim (the body-destructive precedent)
- `content-normalizer.ts:222,228` (what a rewrite would have to move to touch the vector)
- The "no body auto-fix" rail (parent + dq-deep RISK-1 + dq-automation-impl hard rail)

## Assessment

newInfoRatio 0.74 — the most ambitious candidate resolves to a firm NO-GO on the automated form and a narrow suggest-only GO. Confirms the reuse-first rail from a fresh, adversarial angle rather than inheriting it: the rail survives because auto-rewrite is reward-hacking a proxy on the source of truth.
