# Iteration 8 — Citation accuracy spot-check: both lineages cite accurately; the bias lives in framing/emphasis, not fabrication — and one citation mechanically proves iteration 4's finding

**Focus:** KQ-CRIT-9 — spot-check a sample of file:line citations from both prior lineages against the actual files; systematic citation drift would itself be evidence of insufficiently grounded research.

## What was read

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-665` (function `validateRouteProofRecord`, cited by gpt-fast-high/research.md:49 and :207)

## Finding 18 — Citation accuracy across both lineages is high; this round's earlier corrections are about framing and cross-referencing, not fabricated evidence

Across iterations 1-7, every citation this round independently re-read against its source checked out as accurate at the cited line range: `verification-smoke.md:117-124` (Finding 1), `decision-record.md:22` (Finding 2), `cli-opencode/SKILL.md:319` (Finding 4), `index.d.ts:235-241` (Finding 6, a citation neither lineage made but which is accurate), `research.md:39-72`/`review.md:25-58` (Finding 7), `deep_ai-council_auto.yaml:117-118,132-136` (Finding 9), `mode-registry.json:60-80` (Finding 9), `orchestrate.md:44-45,120,148` (Finding 13), `deep.md:4,51-59,77` (Finding 13). **None of the corrections found by this round (Findings 1-2, 4-5, 7-8, 9-11, 12-14) required identifying a false or fabricated citation from either prior lineage — every correction came from reading a citation both lineages already had, more completely, or cross-referencing two citations neither lineage connected to each other.** This is itself a meaningful finding for the charter's self-assessment-bias framing: gpt-fast-high's softer/more self-protective language (iteration 1, Finding 3) is a framing and emphasis choice layered on top of accurate underlying evidence, not evidence fabrication or citation misrepresentation. The bias this round is charged with correcting operates at the level of "what conclusion do you draw from accurate evidence," not "is the evidence real" — worth stating explicitly so the final synthesis does not overstate the correction as "the prior research was unreliable"; it was reliably sourced and under-leveraged in its own conclusions.

## Finding 19 — Direct code-level proof (not just config-level inconsistency) that the ai-council route-proof check would deterministically fail

`validateRouteProofRecord` (the function gpt-fast-high correctly cites at `post-dispatch-validate.ts:619-665`) does a literal strict-inequality comparison: `if (record.mode !== routeProof.mode) return {ok: false, reason: 'route_proof_mismatch', ...}` [SOURCE: post-dispatch-validate.ts:636-642], and equivalent checks for `target_agent` (:643-649) and `resolved_route` (:657-663). `routeProof` here is populated from the YAML's `post_dispatch_validate.route_proof` config block — which, per iteration 4 Finding 9, is hardcoded to `mode: council`, `target_agent: deep-ai-council` in `deep_ai-council_auto.yaml:133-134`. `record` is the actual JSONL record the workflow writes, which (per the emitter block at `:117-118`, unchanged since iteration 4) will carry `mode: ai-council`, `target_agent: "@ai-council"`. Substituting into the actual comparison: `'ai-council' !== 'council'` evaluates `true` in JavaScript strict inequality — **this branch fires unconditionally, for any executor, confirming (not just inferring) that iteration 4's finding is not a theoretical config mismatch but a guaranteed runtime failure of the exact code path both lineages cited as evidence for the route-proof mechanism working correctly.** Neither prior lineage traced their own cited validator function against the ai-council YAML's actual config values to notice this — they cited `post-dispatch-validate.ts` in the context of KQ2 (validator can distinguish wrong route from missing fields) [gpt-fast-high/research.md:49] without applying it to the KQ3/KQ8 ai-council naming-drift finding sitting a few sections away in the same document.

## Ruled out this iteration

- The hypothesis that this round's corrections stem from prior-lineage citation inaccuracy — RULED OUT; every spot-checked citation was accurate. Corrections come from incomplete cross-referencing and framing choices, not bad sourcing.
- Treating iteration 4's ai-council finding as a probable/likely validator failure — upgraded to a proven, code-traced certainty this iteration; "probable" is RULED OUT as too weak a characterization now.

## Status

`complete`.

newInfoRatio: 0.35 — novelty: converts iteration 4's config-level inconsistency finding into a code-traced, deterministic-failure proof by reading the actual comparator function both lineages cited but did not apply to their own ai-council finding; also produces an explicit, checked verdict on citation reliability across both prior lineages (a required KQ this round set for itself).
