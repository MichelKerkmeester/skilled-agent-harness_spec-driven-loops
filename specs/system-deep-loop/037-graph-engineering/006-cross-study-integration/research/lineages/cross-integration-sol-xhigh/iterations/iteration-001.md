# Iteration 001 — One Authority-Subordination Contract

## Focus

Resolve P1 by joining proposal/admission, harness acceptance, belief/convergence, policy, human decision, and 036 authority without making any upstream layer authoritative.

## Findings

1. **DIRECTLY-STATED cross-link — projection is not authority.** S1 makes the graph a projection over authoritative artifacts, while S3 says graph admission is not transition authorization. Therefore graph nodes and edges can prove structural readiness but cannot commit runtime state. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18]

2. **DIRECTLY-STATED cross-link — harness acceptance is also subordinate.** S5 separates typed-return acceptance from transition authorization; S2 requires authority-zero refusal when authoritative context is absent. A locally accepted return may enter evidence evaluation, but may not advance the authoritative cursor. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:14] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330]

3. **Current-state contract.** Legacy remains the sole authoritative writer; graph, harness, knowledge, belief, convergence, policy, and human-gate outputs are candidate evidence. The dark adapter may record and compare them only after legacy resolves, and must return the legacy result unchanged. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5] [INFERENCE: the only coherent current-state join is observe-after-legacy because 036 is designated but not enforced.]

4. **Target-state contract.** The order is `proposal -> graph admission -> typed return admission -> evidence-family gates -> belief settlement -> convergence eligibility -> organization policy ALLOW|DENY|ASK -> durable human decision when ASK -> 036 authorize-and-append`. Each stage emits a typed result; only the final 036 operation mutates authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [INFERENCE: this total order is the smallest composition that preserves every study's ownership boundary.]

5. **No-bypass invariants.** No graph edge authorizes; no accepted return promotes itself; no belief score overrides missing evidence; no convergence result bypasses policy; no policy ASK defaults to allow; no human approval bypasses epoch/fence/current-head checks; and dark mode never changes the externally returned legacy result. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:145] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [INFERENCE: these invariants are the negative form of the composed ownership chain.]

## Sources Consulted

- S1 graph-as-projection and rollout: lines 5, 110–120.
- S2 refusal, claim/fence, and durable human gates: lines 226–273, 330–450.
- S3 admission/authorization and organization policy: lines 18, 67–89, 145–176.
- S5 typed return and layered evaluation: lines 5, 14–20, 95–112.

## Assessment

- New information ratio: 0.88.
- Novelty justification: the round produces a two-mode authority contract and explicit no-bypass chain that no single study contains.
- Confidence: high on ownership ordering; medium on the exact 036 adapter boundary pending the implementation audit in P4.

## Reflection

- What worked: treating each study output as a typed upstream certificate rather than allowing shared authority.
- What failed: interpreting “admission” or “accepted return” as a synonym for authorization.
- Ruled out: graph-as-authority; harness-as-authority; ASK-as-implicit-allow.

## Recommended Next Focus

P2 — define a conjunctive promotion-evidence model with earliest-owner failure attribution.
