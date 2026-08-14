# Iteration 005 — Graph, Sealed Subgraph, and LEAF Boundary

## Focus

Resolve P5: what graphs schedule, what subgraphs inherit, what a LEAF may do, and how escalation returns to workflow ownership.

## Findings

1. **DIRECTLY-STATED cross-link — graph owns structure, LEAF owns bounded tactics.** S1 assigns readiness, scheduling, reducers, and typed subgraphs to the graph layer; S5 confines a LEAF to a fixed action set and requires workflow-owned escalation. A LEAF cannot invent a new transition, evaluator, capability, or authority path. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83]

2. **Closed LEAF action vocabulary.** Use `READ_CONTEXT`, `CALL_MODEL`, `CALL_TOOL`, `EMIT_ARTIFACT`, `REQUEST_SUBGRAPH`, and `RETURN_RESULT`. Every action binds an admitted node, declared inputs, bounded outputs, capability ID, budget debit, and evidence obligations; unknown actions are refused at shape admission. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:55] [INFERENCE: the six kinds cover computation while withholding policy and authority mutation.]

3. **Closed escalation vocabulary.** A LEAF may emit `ASK_HUMAN`, `REQUEST_BUDGET`, `REQUEST_CAPABILITY`, `REPORT_BLOCKER`, or `ABSTAIN`. Escalation ends the local action lease and returns a typed request to the owning graph reducer; it never changes topology or defaults to approval. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83] [INFERENCE: refusal plus workflow-owned escalation closes the set without unsafe guesses.]

4. **Recursive sealed-subgraph rules.** A subgraph binds parent digest, schemas, action/capability subsets, evaluator set, policy digest, budget transfer, deadline, max depth, and child limit. A child only narrows policy/capabilities, receives a conserved budget slice, cannot outlive its parent lease, and returns through the parent evaluator/reducer. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:55] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226] [INFERENCE: monotone inheritance prevents recursive privilege amplification.]

5. **Claim-and-fence applies at every boundary.** Dispatch grants a node-scoped claim and fence; result admission verifies graph/subgraph/node IDs, attempt, lease, fence, input digest, and policy digest. Late or duplicate results remain evidence but cannot update the canonical reducer. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33] [INFERENCE: S2 mutation discipline preserves single-writer semantics through recursion.]

## Sources Consulted

- S1 scheduling and typed subgraphs: lines 33–41, 61–67.
- S2 claim/fence and refusal: lines 226–273, 330–384.
- S3 sealed graph and TOCTOU defense: lines 55–65.
- S5 fixed LEAF action/escalation contract: lines 83–93.

## Assessment

- New information ratio: 0.72.
- Novelty justification: one closed action/escalation algebra plus recursion invariants preserve authority, budgets, and fences.
- Confidence: high on ownership; medium on the six-action minimality until mutant tests exercise unknown actions.

## Reflection

- What worked: monotone, conservation-based inheritance.
- What failed: arbitrary “next action” strings and child-defined capabilities.
- Ruled out: direct LEAF authorization; child budget creation; policy widening; late-result mutation.

## Recommended Next Focus

P6 — compose gate and evaluation outcomes into one typed state machine.
