# Iteration 009 — Cross-Angle Contradiction and No-Bypass Audit

## Focus

Stress P1–P8 as one system, resolve their apparent tensions, and search for a path that reaches authority while skipping an owner.

## Findings

1. **Projection versus execution is resolved by proposal semantics.** The graph can schedule real work while remaining a projection: it produces typed proposals and evidence, but 036 alone commits authority. This reconciles S1's graph projection with S3's admission/authorization split. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18] [INFERENCE: “projection” limits mutation authority, not computational usefulness.]

2. **Mutable memory/belief versus immutable evidence is resolved by event/projection separation.** Memory ranking, knowledge views, and belief settlements may change as new events arrive; the source evidence, contradictions, denials, gates, and receipts remain append-only and projections are rebuildable. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:50] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50] [INFERENCE: mutability belongs to derived views, never their reference closure.]

3. **Completeness versus bounded autonomy is resolved by scoped completeness.** S4 completeness applies to the declared corpus, ontology, evidence families, and negative cases; S5 bounds LEAF tactics, repair, and loop duration. A bounded loop may end `abstain` or `blocked` and still be complete if it accounts for every scoped obligation without claiming an unsupported answer. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:23] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83] [INFERENCE: completeness is obligation coverage, not mandatory success.]

4. **Parity versus improvement is resolved by two candidate lanes.** The compatibility lane proves exact causal-prefix legacy parity; an improvement lane may propose changed behavior only under a new policy/candidate digest and must run the full evidence/mutant suite. Improvement evidence can never make a parity mismatch disappear. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:69] [INFERENCE: lane separation prevents intentional semantic change from laundering compatibility failure.]

5. **Policy, human approval, and authority do not conflict because their jurisdictions differ.** Organization policy decides ALLOW/DENY/ASK; a human settles a scoped ASK; 036 still verifies current mutation facts. Belief usability and convergence eligibility are prerequisites, not votes. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [INFERENCE: jurisdictional ordering removes circular approval.]

6. **No-bypass audit result: no accepted path found.** Attempts to skip return admission, one evidence family, belief, convergence for terminal promotion, policy, human ASK settlement, or 036 all terminate in a typed blocker. Attempts to widen a child capability, reuse a stale approval, submit a late result, or use dark output externally fail at the boundary that owns the violation. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126] [INFERENCE: this is a design audit; executable mutant proof remains open.]

## Sources Consulted

- Orientation tensions and integrated spine: lines 33–71.
- S1 projection, causal parity, and rollout: lines 5, 69–75, 110–120.
- S2 immutable fold, parity, fences, refusal, gates: lines 99–224, 226–450.
- S3 policy, gates, mutants: lines 67–143.
- S4 completeness and evidence: lines 23–136.
- S5 memory, bounded LEAF, evaluation, mutants: lines 50–148.

## Assessment

- New information ratio: 0.04.
- Novelty justification: the audit found no new component but resolved seven cross-angle tensions into explicit lane, scope, and projection rules.
- Confidence: high in logical non-contradiction; medium in no-bypass until mutants execute against a prototype.
- Convergence telemetry: threshold reached, but max-iterations policy requires iteration 10 and a broader closure audit.

## Reflection

- What worked: adversarially tracing forbidden paths to the earliest owner.
- What failed: treating parity and improvement as one lane; treating completeness as forced success.
- Ruled out: projection mutation; mutable evidence history; improvement-masked parity; circular owner voting.

## Recommended Next Focus

Iteration 10 — capstone closure: settled/open split and exact mutant-driven shadow prototype evidence.
