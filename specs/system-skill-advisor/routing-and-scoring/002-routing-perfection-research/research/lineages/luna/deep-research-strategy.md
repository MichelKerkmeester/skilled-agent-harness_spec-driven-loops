# Deep research strategy

## Research Topic

Perfect skill routing across the fleet: why a phrase a hub's router advertises fails to reach that hub, and what would fix it.

## Known Context

The detached worker prompt fixes five ordered angles: scorer shape; cross-hub collision arbitration; the two-vocabulary contract; compiled routing; and measurement as a gate. The confidence bar remains `0.8`. The supplied daemon-generation-679 measurements are inputs, not facts to re-derive: 439 router declarations across six hubs, 19 wrong-hub failures, and 136 no-reach observations. The no-reach set is dominated by two- and three-word phrases. Stage 1 reads a hub's `graph-metadata.json` intent signals; stage 2 reads `hub-router.json` and `ROUTER.md`. Five hubs are on the compiled route contract; `sk-design` is not.

## Key Questions

1. What exact scorer mechanics make short router phrases fail, and is the remedy a specificity gate, normalization fix, or a separate query-shape policy?
2. How should collisions be arbitrated when a phrase is semantically owned by one hub but a generic review/audit token strongly favors `sk-code`?
3. What invariant can prove that every advertised router phrase has stage-1 reach without treating bare common words as valid vocabulary?
4. What does the compiled-route split change, and what remains independent of compilation?
5. What build-gating check catches wrong-hub routing and measures no-reach without making short common phrases hard failures?

## Answered Questions

- Q1: Short no-reach is caused by stage-1 projection coverage combined with stop-word filtering and the `max(3, denominatorBasis)` lexical overlap denominator; phrase specificity and the confidence bar are not the primary defect.
- Q2: Cross-hub collisions are caused by generic explicit token boosts winning without a cross-hub stage-2 ownership input; the repair requires bounded, stage-1-authorized phrase ownership rather than a universal longest-phrase rule.
- Q3: The invariant must check every multi-word stage-2 phrase for owner-local stage-1 authorization, then probe dynamic reach; single-word local mode vocabulary remains telemetry, while `wrong-hub` fails and `no-reach` is informational.
- Q4: Compiled routing is a fail-closed, within-hub mode-selection layer. It improves deterministic serving and freshness proof for five registered hubs, but does not choose the hub or make stage-2 vocabulary visible to the stage-1 advisor; `sk-design` is legacy until a separate rollout exists.
- Q5: The measurement gate must require full multi-word inventory and probe health, fail on wrong-hub and probe errors, report no-reach as telemetry, and keep bare one-word common vocabulary outside hard failures.

## What Worked

- Reading the scorer lanes and the six hub contracts together exposes the stage boundary and the collision path.
- Live probes are reserved for representative short, contextual, and collision phrases; the measured fleet totals supplied by the worker prompt are treated as baseline evidence.
- The direct built scorer reproduced the short/contextual boundary even though the daemon IPC probe was unavailable in this sandbox.
- Reading all six hub contracts exposed a consistent local two-stage design but no advisor-visible cross-hub ownership channel.
- The checker-compatible six-hub join separated missing ownership data from normalization: canonicalization changed only one sample count.
- Read-only compiled probes separated serving authority and manifest freshness from vocabulary reach; all five registered hubs were fresh while `sk-design` returned the legacy sentinel.
- Reading the checker and supplied reports exposed the silent probe-error false-green path and supplied stable safe-negative categories.

## What Failed

- The daemon-backed CLI probe could not connect because the sandbox returned `EPERM` for the advisor socket; no live daemon claim is made from that attempt.
- The local built projection differed from the supplied daemon-generation collision ranks for two probes; the discrepancy is retained as runtime/projection drift, not collapsed into one claim.
- A full router/metadata diff is ruled out by the checker contract; it would flag intentional stage-2 mode vocabulary and bare common words.
- Compiled serving is not a substitute for stage-1 ownership, and a fresh compiled manifest is not vocabulary proof.
- A truncated inventory or unavailable advisor cannot count as a passing measurement.

## Exhausted Approaches

None at initialization.

## Ruled-Out Directions

- Lowering the `0.8` confidence bar is out of scope and would weaken abstention rather than repair vocabulary reach.
- Adding more router phrases before the stage-1 contract is fixed cannot guarantee reach.
- Increasing lexical lane weight is not a safe first repair because it would amplify generic-token collisions.
- A universal longest-phrase winner is ruled out: `decision branch` would still be captured by git's first-class `branch` token without semantic authorization.
- A global union of all router keywords is ruled out because it would turn stage-2 prose into untrusted cross-hub vocabulary.
- Fuzzy matching is ruled out because it would blur ownership and reintroduce collisions.
- A `sk-design` compiled rollout is treated as a separate operational package, not folded into the scorer repair.
- Failing every no-reach row is rejected because it would make the gate unrunnable on short fragments.

## Next Focus

Phase synthesis complete: the causal model, ranked recommendations, unresolved implementation choices, and `maxIterationsReached` terminal reason are recorded in `research.md`.

## Synthesis Summary

The route defect is produced at the boundary between hub discovery and hub-local routing. Stage-1 graph metadata must authorize meaningful stage-2 phrases before a scorer phrase anchor can safely arbitrate them. The compiled layer and freshness guard are orthogonal. The measurement gate must distinguish wrong-hub, no-reach, and probe-error outcomes and must cover the complete multi-word inventory.
