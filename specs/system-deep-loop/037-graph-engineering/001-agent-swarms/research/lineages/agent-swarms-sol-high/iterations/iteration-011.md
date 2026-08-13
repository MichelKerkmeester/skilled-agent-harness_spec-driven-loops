# Iteration 11: Mode-Specific Subgraph Profiles

## Focus

Typed subgraphs should unify execution mechanics, not collapse research, review, and improvement into one generic prompt loop.

## Findings

1. The current mode registry names separate owners and backend contracts for research, review, alignment, improvement, and councils; this diversity is an existing semantic boundary, not accidental duplication. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-200]
2. Decision: define a shared `LoopSubgraphSpecV1` envelope and mode-specific profiles. `ResearchProfile` converges on evidence novelty/coverage; `ReviewProfile` converges on verified finding closure; `ImprovementProfile` converges on evaluator-approved candidate deltas; `CouncilProfile` converges on a quorum-backed decision record. [INFERENCE: maps current mode ownership onto one typed execution interface while preserving purpose-specific terminal evidence]
3. A self-correcting builder/judge/manager loop supports separating proposal, independent evaluation, and routing authority; the roles must exchange structured artifacts rather than share mutable conversational state. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:14-61]
4. Each profile declares admissible node/edge kinds, evidence schema, dedupe key, deterministic gates, judge policy, convergence statistic, budget allocation, and terminal certificate. Unsupported capabilities fail graph compilation rather than degrade silently. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:63-136]
5. Cross-profile composition occurs only through typed ports: review can consume a research evidence bundle, improvement can consume verified review findings, and council can adjudicate bounded alternatives; no profile reads another's private scratch state. [INFERENCE: typed handoffs prevent semantic leakage while allowing nested orchestration]
6. When not to use: do not encode a mode as a subgraph merely to wrap a single deterministic command or one-pass document transform; use a harness/node contract until there is genuine cyclic control, independent evaluation, or convergence state. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:12-27]

## Ruled Out

- One universal convergence metric; shared mutable scratch state; silent capability downgrade.

## Assessment

- New information ratio: 0.74
- Novelty: turns mode differences into compile-time profiles rather than backend folklore.
- Questions addressed/answered: q-loop-subgraphs mode mapping.

## Recommended Next Focus

Specify behavioral parity and trace equivalence across every execution surface.
