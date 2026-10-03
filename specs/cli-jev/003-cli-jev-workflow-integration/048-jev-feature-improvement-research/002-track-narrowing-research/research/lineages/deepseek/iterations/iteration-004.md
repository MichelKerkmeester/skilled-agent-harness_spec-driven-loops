---
title: "Iteration 4: Where Else The Same Judgment Pays Off"
trigger_phrases: []
---
# Iteration 4: Where Else The Same Judgment Pays Off

## Focus

Inventory the surfaces in `.skilled` where the same judgment — free text in, one destination out of a listed set, measured against a zero-call baseline under a frozen keep rule — already exists or would pay off, with file:line evidence.

## Findings

1. The judgment is currently served nowhere, which is the first and largest payoff gap. The 017 phase recorded it explicitly: "This keep serves nothing, because serving a pick needs a later phase, and opening one is the operator's call." [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/implementation-summary.md:66] The narrowing is a measured capability with no caller.

2. Gate 1 itself has three ready-made insertion surfaces, all currently lexical. The root `AGENTS.md` Gate 1 instruction calls the trigger-index lookup and the same pointer is mirrored to every runtime. [SOURCE: file:AGENTS.md:65] The `/speckit:search` front door is built on exactly the two lanes the narrowing is measured against (trigger-index lookup plus one ripgrep recipe). [SOURCE: file:.skilled/commands/speckit/search.md:2] [SOURCE: file:.skilled/commands/speckit/search.md:77] and it declares the semantic capabilities it cannot provide: "Capabilities that lived in the retired database — semantic matching, fusion, decay, access tracking, session dedup, causal traversal, epistemic baselines, ablations and dashboards — are declared unsupported rather than approximated." [SOURCE: file:.skilled/commands/speckit/search.md:138] The system-spec-kit skill states the same Gate 1 contract in two places. [SOURCE: file:.skilled/skills/system-spec-kit/SKILL.md:462] [SOURCE: file:.skilled/skills/system-spec-kit/SKILL.md:568] A track pick here lands on every runtime and on the search front door at once; it is the highest-reach placement available.

3. The same judgment at finer granularity is already measured and operator-labeled: the save-time spec-folder suggestion (feature 022). `score-alignment-suggestion.ts` replays `validateContentAlignment` and `validateFolderAlignment`, runs the same label gate, the same frozen keep-rule shape — including a one-sided loss test — and a live arm only behind `--jev`. [SOURCE: file:.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md:28] [SOURCE: file:.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md:42] Its recorded verdict is `keep K=40 A=39 B=30`. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md] Track narrowing is the coarse version of the same destination-picking task; the folder suggestion reaches it with a labeling pipeline already in place.

4. The same judgment on near-tied mode selection is measured: the clarify default (feature 020). `score-clarify-default.cjs` counts compiled-hub clarifies, extracts alternatives in router order with a `gold` or operator `label`, stops under 30 labeled rows, uses the router's first alternative as baseline, and runs the choice three times in rotated option order with a `none_of_these` class — the identical geometry to the track narrowing's three orders and `none` option. [SOURCE: file:.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md:30] Its recorded verdict is `keep K=54 A=28 B=15`, with most gain from recognizing the none class. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md]

5. The skill advisor's near-tie cluster is the closest same-judgment, same-tooling surface, and it already implements probability aggregation. The suggested-order eval measures whether a Jev order of the advisor's near-tie cluster beats the best zero-call order across 241 skill-firing prompts, under a 2,200 ms budget, using per-row mean probability with ties kept in scorer order and `none` deferring to the scorer's order. [SOURCE: file:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md:26] [SOURCE: file:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md:28] [SOURCE: file:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md:38] That is exactly the mean-probability aggregation which iteration 2 showed buys +1 row on the track call log; the advisor eval is the precedent for adopting it.

6. The measurement pattern itself is a reusable kit already applied to five or more classifiers, not just routing: fetch-text injection screening against a fixed lexical screen, completion-claim auditing against a regex, and hallucination grading against majority and rule baselines all share the frozen-keep-rule, three-order, call-log shape. [SOURCE: file:.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md:18] [SOURCE: file:.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md:36] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md] The trust upgrades from iteration 3 — row pinning, versioned out dirs, cluster-aware slack — pay off multiplied across every one of these scores if applied once to the shared pattern.

7. A lower-risk insertion than Gate 1 serving exists inside retrieval itself: trigger-phrase quality. The index generator already buckets rejected phrases per class and collects their owning documents (`phraseQuality`). [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:256] A judgment over phrase text (keep/reject/rewrite) would improve the lookup lane offline, at index-generation time, with no per-prompt latency and no user-visible failure mode — and it improves the very baseline the narrowing is measured against.

8. The serving substrate already exists and is deliberately opt-in. The `cli-classifier` hub exposes `mode cli-jev` as a read-and-bash-only transport that "selects a value and never mutates this workspace", with the policy that "transports never fail over silently". [SOURCE: file:.skilled/skills/cli-classifier/SKILL.md:22] [SOURCE: file:.skilled/skills/cli-classifier/SKILL.md:24] The Pi route sits behind `JEV_TRANSPORT` with the CLI as default and fallback, and was measured as adopt: `K=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100`, cost 0.0022 per 100 calls. [SOURCE: file:.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32] [SOURCE: file:.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:79] So default-on track picking needs a caller, a policy and a budget — not new transport plumbing.

9. Ranked by reach and readiness: (1) Gate 1 no-hit assist (every runtime, search front door, no semantic alternative exists today — findings 1, 2, 8); (2) packet/spec-folder suggestion (finer judgment, existing label gate and corpus — finding 3); (3) advisor near-tie ordering (existing eval and probability-ordering implementation — finding 5); (4) trigger-phrase quality judging (offline, lowest risk, improves the baseline — finding 7); (5) share the I3 trust upgrades across the scorer family (finding 6).

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/implementation-summary.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `AGENTS.md`
- `.skilled/commands/speckit/search.md`
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md`
- `.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md`
- `.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md`
- `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md`
- `.skilled/skills/cli-classifier/SKILL.md`
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/lineages/deepseek/steer.md` (absent)

## Assessment

- newInfoRatio: 0.58
- Novelty justification: the iteration connected the track narrowing to five measured sibling surfaces, identified the search front door's declared semantic gap as the highest-reach insertion, and found that the advisor eval already implements the probability aggregation this lineage's iteration 2 recommended.
- Confidence: high; every surface is documented and linked by read files. The ranking is judgment, grounded in reach, readiness and existing measurement infrastructure.
- Code graph note: none used.

## Reflection

- Worked: reading sibling feature catalogs first gave a ready map of where the same pattern lives instead of speculative proposals.
- Failed: nothing material; no sibling scorer was executed, so reuse claims rest on their catalog contracts, not re-runs.
- Ruled out: proposing a brand-new judgment surface — the evidence shows the gap is serving existing measured judgments, not inventing more.

## Recommended Next Focus

Iteration 5: default-on integration needs, cost and risk. Use the recorded latency, payload, availability gates and the 017 operator-decision record to bound what turning the pick on would require.
