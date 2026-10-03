---
title: "Iteration 4: Where else in .skilled the same judgment pays off"
trigger_phrases: []
---
# Iteration 4: Where else in .skilled the same judgment pays off

## Focus

Surfaces in `.skilled` that decide whether two artifacts mean the same thing today using exact keys, content hashes or lexical overlap — and where the same measured same-or-different judgment would pay off, with the payoff ordered.

## Actions Taken

- Read the question, ruled-out and resolved-findings merge paths in `fanout-merge.cjs` and checked their matching discipline line by line.
- Read the `claim-continuity` matcher's semantic-candidate contract and its consumers.
- Read the `conditional-fanin` sufficiency rule and `contradiction-supersession` event registry.
- Checked the scorer's export surface as the reusable measurement kit for any new surface.

## Findings

1. The fan-out merge's question and direction streams are exact-identity only and one stream silently loses attribution. `openQuestions` and `resolvedQuestions` merge by `id || question || text` with `_lineages` unioned only on an exact id match, so two lineages that ask the same question in different words stay two entries; `ruledOutDirections` goes further — the first lineage to name a direction keeps it and a second lineage naming the same `id` is dropped without even adding its lineage label. These merged lists feed synthesis directly, so restatements survive into the final report as independent questions/directions. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:759-787]

2. The review merge's resolved-findings stream repeats the same cross-body blind spot on a second collection. `resolvedFindings` uses the near-duplicate machinery only when `enableNearDuplicateDedup` is on and otherwise collapses on `contentIdentityKey` equality or id — the same body-key gate that is blind to cross-body restatements, so merged `resolvedFindingsCount` under-reports true resolution overlap. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:876-897]

3. `claim-continuity` has already built the receiving end of the judgment: its matcher accepts `ClaimSemanticCandidate` records carrying `semantic_decision ∈ {equivalent, distinct, topical_only}`, a `similarity_score` in [0,1] and `community_consensus`, and folds them beside exact alias evidence into a replay-stable decision. What does not exist is a producer of those candidates — precisely the judgment Jev measures. The same judgment therefore pays off here as candidate evidence, without embedding a model in the matcher. Consumers already exist: cycle detection reads this frontier. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts:109-123] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts:196-280]

4. `conditional-fanin` decides branch agreement by exact key: `evaluateSufficiency` groups accepted results by provenance and marks a group coherent only when all its `agreementKey`s are identical. Two branches that computed substantively the same result under different keys count as no agreement, which is the same cross-body blindness expressed as a fan-in policy failure; the shadow adapter that runs beside the legacy wait-for-all path is the natural place to measure a model-assisted agreement read before committing to it. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/conditional-fanin/sufficiency.ts:22-34]

5. `contradiction-supersession` canonicalizes the identity of a relationship but not the judgment that one exists: `canonicalContradictionPair` and `contradictionRelationshipId` fix an order-independent pair id and rejects self-relations, while which pairs contradict or supersede is supplied by callers. A same-or-different (or contradict/restate) model judgment is the missing candidate generator; the ledger's replay and projection machinery would then verify and replay the decisions. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/contradiction-supersession/event-registry.ts:157-181]

6. The scorer is the reusable kit for all of the above. `score-fanout-pairs.cjs` exports the pair classifier, pair key, merge oracle, label gate, Keep Rule, verdict summarizer and report builder, so a new surface can be instrumented with the same two-class census, label gate and exact binomial verdict without new statistics code — which is also the cheapest way to keep every future same-or-different claim honest. Ordered by expected payoff: (a) the merge's own question/direction streams, where duplication survives into synthesis today; (b) claim-continuity candidates, where the consumer contract already exists; (c) conditional-fanin agreement; (d) contradiction candidate generation. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1495-1529]

## Ruled Out

- "The judgment is only useful inside the fan-out merge": four other consumers already model identity lexically or by key and would accept the same evidence.
- "Wire a model into the matchers": claim-continuity's contract takes candidate evidence, not a model call, so the judgment can stay outside the deterministic matcher.

## Next Focus

Iteration 5 — default-on integration: reader, call shape, guards, cost model, risk register, and the ranked recommendation set for the parent synthesis.

## Sources

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `.skilled/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts`
- `.skilled/skills/system-deep-loop/runtime/lib/conditional-fanin/sufficiency.ts`
- `.skilled/skills/system-deep-loop/runtime/lib/contradiction-supersession/event-registry.ts`
