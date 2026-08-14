# Iteration 002 — Conjunctive Promotion Evidence

## Focus

Resolve P2: define evidence families that must all pass independently and an oracle that attributes a failed candidate to the earliest owning boundary.

## Findings

1. **DIRECTLY-STATED cross-link — evidence families are conjunctive.** S4 distinguishes data quality, causal correctness, and negative/contradiction evidence; S5 independently distinguishes return-shape, trajectory/evidence, and transition-authorization evaluation. These families overlap in purpose but cannot substitute for each other. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95]

2. **Unified promotion certificate.** A candidate promotion binds six independent results: `D` data/knowledge quality, `C` causal-prefix and replay parity, `G` governance-mutant survival, `H` harness-mutant survival, `R` recovery/rollback drill, and `M` measured baseline/delta. Promotion is eligible iff every required family is `pass` and every artifact is candidate-, epoch-, policy-, and source-digest-bound. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126] [INFERENCE: the six-family certificate is the minimal union of the studies' non-substitutable proof obligations.]

3. **Anti-masking rule.** Aggregates may summarize but never promote: no weighted average, majority vote, or global green status may hide a red or missing family. Each family has a typed state `not_run|pass|fail|stale`; `not_run`, `fail`, and `stale` block. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131] [INFERENCE: typed four-state families make S4's conjunctive rule mechanically auditable.]

4. **Earliest-owner oracle.** Evaluate in causal ownership order: producer/shape (`D`) -> event/replay (`C`) -> policy (`G`) -> harness/loop (`H`) -> recovery (`R`) -> measurement (`M`). Report the first failing owner as the remediation owner; downstream failures remain recorded as consequences and cannot reassign ownership. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:505] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:145] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:150] [INFERENCE: the oracle combines dependency order with mutant-localized failure ownership.]

5. **Promotion versus cutover.** A complete promotion certificate proves candidate readiness, not authority transfer. 036 still rechecks current head, epoch, fence, identity/capability, and the approved policy at commit time; rollback evidence must remain usable throughout the reversible window. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:178] [INFERENCE: separating readiness evidence from the commit-time authority check prevents stale certificates from becoming capabilities.]

## Sources Consulted

- S2 causal parity, rollout dependencies, and rollback controls: lines 147–224, 452–523.
- S3 governance mutants and ownership order: lines 131–176.
- S4 independent evidence families: lines 77–91.
- S5 evaluation and harness mutants: lines 95–148, 193–206.

## Assessment

- New information ratio: 0.82.
- Novelty justification: six evidence families and an earliest-owner oracle connect testing, evidence, recovery, and measurements without masking.
- Confidence: high on conjunctive semantics; medium on exact thresholds, which require the shadow prototype.

## Reflection

- What worked: preserving each study's evaluator as a named family.
- What failed: a single readiness score loses failure ownership and permits compensation.
- Ruled out: weighted promotion score; “mostly green”; stale certificate as authority capability.

## Recommended Next Focus

P3 — memory locates, knowledge asserts, belief settles usability.
