# Iteration 006 — Typed Gate and Evaluation State Machine

## Focus

Resolve P6 by defining one end-to-end machine whose states preserve the owner and reason for every block.

## Findings

1. **DIRECTLY-STATED cross-link — evaluation layers remain distinct.** S5 separates return shape, trajectory/evidence, and authorization; S3 separates graph admission from transition authorization; S2 separates belief usability and human-gate settlement from append authority. The integrated machine must carry typed outcomes rather than one `validated` flag. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35]

2. **State sequence.** `ReturnAdmission{accepted|repairable|rejected}` -> `Evidence{complete|blocked(family,reason)|stale(family)}` -> `Belief{usable|contradicted|insufficient|stale|authority_zero}` -> `Convergence{continue|stop_eligible|terminal_blocked}` -> `OrgPolicy{allow|deny|ask}` -> `HumanGate{not_required|pending|approved|rejected|expired|revoked}` -> `Authority{shadow_recorded|authorized_append|denied(reason)}`. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:38] [INFERENCE: this discriminated union is the total product of the studies' owned boundaries.]

3. **Transition guards.** Only `accepted` enters evidence; all D/C/G/H/R/M families must be complete; belief must be `usable`; `stop_eligible` is necessary only for terminal promotion; `deny` blocks and `ask` requires a current approved gate; approval is scoped and revocable; 036 rechecks head/epoch/fence/capability/policy at append. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:79] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77] [INFERENCE: a positive earlier state is necessary but never sufficient for a later owner.]

4. **Current versus target terminal transition.** In current mode, the machine ends with `shadow_recorded` only after legacy produces the externally visible result; divergences are evidence. In target mode, an exact candidate digest and complete gate trace are submitted to 036, whose `authorized_append` is the only successful authority mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5] [INFERENCE: the same upstream trace can drive shadow measurement now and authorization later without changing ownership.]

5. **Failure recording is monotone.** Each block records `{owner, state, reasonCode, evidenceDigests, candidateDigest, policyDigest, observedHead, epoch, fence, timestamp}`. Repair creates a new attempt linked to the blocked one; it never rewrites the prior result or skips the failed owner. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:38] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:103] [INFERENCE: monotone attempts preserve replay and mutant-localized accountability.]

## Sources Consulted

- S2 belief, temporal truth, refusal, and gates: lines 35–145, 275–450.
- S3 admission, policy, and human gates: lines 18, 67–89.
- S4 conjunctive evidence: lines 77–91.
- S5 typed return and three-layer evaluation: lines 38–48, 95–112.

## Assessment

- New information ratio: 0.66.
- Novelty justification: integrated every owner into a reason-preserving discriminated state machine usable in both dark and target modes.
- Confidence: high on ordering and outcomes; medium on which intermediate repairs deserve local retry budgets.

## Reflection

- What worked: making blockers owner- and reason-specific.
- What failed: boolean validation and a terminal “approved” state without append-time rechecks.
- Ruled out: policy bypass; approval as capability; rewriting failed attempts; shadow mutation of external results.

## Recommended Next Focus

P7 — reconcile all rollout plans into a dependency and rollback DAG.
