# P2 — Unified Promotion-Evidence Model

## Certificate

A `GraphPromotionCertificate` binds candidate, graph, source, policy, authority epoch, and six independent evidence-family results:

| Family | Owner | Required proof |
|---|---|---|
| D | data/knowledge | source quality, completeness, negative evidence |
| C | causal/replay | causal-prefix parity, deterministic replay |
| G | governance | governance-mutant kills, policy/gate correctness |
| H | harness | return/trajectory/context/LEAF mutant kills |
| R | recovery | receipt reconciliation, crash and rollback drills |
| M | measurement | provenance-bound baseline and candidate deltas |

S4 makes evidence families conjunctive; S3 and S5 provide independent governance and harness mutants; S2 supplies causal parity and recovery. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147]

## State and anti-masking

Each family is `not_run | pass | fail | stale`. Promotion requires all six `pass`. Summaries may report but never decide; no average, weighting, majority, or global green state can hide a red family. [INFERENCE: typed family state operationalizes S4's non-substitution rule.]

## Earliest-owner oracle

Evaluate causal ownership in order `D -> C -> G -> H -> R -> M`. The first failed family owns remediation. Downstream failures remain recorded as consequences and never transfer ownership. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:505] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:145] [INFERENCE: dependency order plus mutant localization yields deterministic attribution.]

## Boundary

Certificate completeness means “ready to request authority,” not “authorized.” 036 performs fresh append-time checks; stale evidence blocks.
