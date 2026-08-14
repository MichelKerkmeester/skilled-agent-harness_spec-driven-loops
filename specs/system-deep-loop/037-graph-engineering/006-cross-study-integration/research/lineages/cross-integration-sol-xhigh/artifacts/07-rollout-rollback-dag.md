# P7 — Unified Rollout and Rollback DAG

## Dependency graph

`R0 baseline/taxonomy/IDs`
-> `R1 typed IR/event/policy contracts`
-> `R2 mutant oracles`
-> `R3 dark 036 adapters`
-> (`R4a graph admission/subgraphs` || `R4b typed returns/LEAF` || `R4c K0–K6 knowledge production`)
-> `R5 memory/knowledge/belief + policy/gates/refusal`
-> `R6 claims/fences/budgets/effects`
-> `R7 causal-prefix shadow parity`
-> `R8 mixed-version/recovery/rollback drills`
-> `R9 conjunctive promotion certificate`
-> `R10 per-mode reversible cutover`
-> `R11 rollback window + zero-use observation`
-> `R12 legacy-writer retirement + final whole-system gate`

This merges S1's rollout spine, S2's dependency order, S3's governance tranches, S4's knowledge gates, and S5's mutants-first rule. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:505] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:192] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:138] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126]

## Parallel-lane rule

Only R4a/b/c run in parallel, against frozen R1 identities and isolated write sets. R5 joins content-addressed outputs. No later node begins on partial prerequisites. [INFERENCE: this is the maximal safe parallel cut in the merged dependencies.]

## Rollback assets

R0 fixtures/snapshots; R1 schemas/upcasters; R2 live mutants; R3–R6 adapters/rebuilders; R7 mismatch corpus; R8 drill certificates; R9 digest manifest; R10–R11 legacy readers/writers and rollback anchors. Writers retire after the window and zero-use telemetry; archival readers remain. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:537] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:178]

## Exit rule

Every node emits an exact-digest certificate over raw evidence. No prose readiness, parity-only promotion, or big-bang authority move.
