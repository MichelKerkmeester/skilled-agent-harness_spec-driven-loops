# Iteration 007 — Unified Rollout and Rollback DAG

## Focus

Resolve P7 by merging all five rollout models into one dependency graph rather than concatenating their stage lists.

## Findings

1. **DIRECTLY-STATED cross-link — all rollouts share an additive-dark spine.** S1 moves from schema/projection through shadow and staged authority; S2 orders foundational ledger/parity before consequences; S3 puts governance controls and mutants before promotion; S5 makes mutants precede trust. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:505] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:192] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126]

2. **Unified DAG nodes.** `R0 freeze baseline/taxonomy/IDs -> R1 freeze typed IR/event/policy contracts -> R2 build mutant oracles -> R3 reuse 036 dark ledger/control adapters -> R4a graph admission/sealed subgraphs || R4b typed returns/LEAF || R4c K0–K6 knowledge production -> R5 memory/knowledge/belief + policy/gates/refusal -> R6 claims/fences/budgets/effects -> R7 causal-prefix shadow parity -> R8 mixed-version/recovery/rollback drills -> R9 conjunctive promotion certificate -> R10 per-mode reversible cutover -> R11 rollback window/zero-use observation -> R12 legacy-writer retirement and final whole-system gate`. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:138] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:150] [INFERENCE: dependency merge yields thirteen nodes with one safe parallel fan-out at R4.]

3. **Parallelism is write-set constrained.** R4a/R4b/R4c may proceed in parallel only against frozen R1 identities and isolated output namespaces. R5 joins by digest; R6 cannot start until governance and epistemic producers exist; R7 cannot start until every candidate path can emit comparable events. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:145] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:67] [INFERENCE: content-addressed join artifacts make the single parallel wave deterministic.]

4. **Rollback assets are stage outputs, not final paperwork.** R0 pins fixtures and legacy snapshots; R1 pins schemas/upcasters; R2 pins live mutants; R3–R6 pin adapters and projection rebuilders; R7 pins mismatch corpus; R8 produces drill certificates; R9 binds all digests; R10–R11 retain legacy readers/writers and rollback anchors. Writers retire only after the reversible window and zero-use telemetry; archival readers remain. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:537] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:178] [INFERENCE: every forward node has a named reconstruction or reversal asset.]

5. **Measurable exits.** Each node exits only on an exact candidate digest and objective evidence: complete inventory, schema compatibility, mutant kill matrix, deterministic replay, independent causal-prefix parity, zero unresolved evidence families, passed recovery drills, bounded cost/latency deltas, approved ASK cases, 036 cutover certificate, and window/zero-use thresholds. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:197] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452] [INFERENCE: exits are certificates over raw family evidence, never prose readiness claims.]

## Sources Consulted

- S1 nine-stage rollout: lines 110–120.
- S2 dependency chain and rollback: lines 452–554.
- S3 ten tranches and risks: lines 178–253.
- S4 knowledge pipeline/gates: lines 118–158.
- S5 mutants-first and measures: lines 126–206.

## Assessment

- New information ratio: 0.63.
- Novelty justification: transformed five differently scoped stage lists into a thirteen-node dependency DAG with one bounded parallel wave and stage-owned rollback assets.
- Confidence: high on prerequisites; medium on per-mode cutover order, which 036 currently freezes separately.

## Reflection

- What worked: merging by dependency and ownership rather than matching stage numbers.
- What failed: concatenation creates duplicate gates and hides prerequisites.
- Ruled out: big-bang authority; writer retirement before zero-use; parity-only promotion; unbounded parallel lanes.

## Recommended Next Focus

P8 — define measurement baselines and a deterministic owner-disagreement protocol.
