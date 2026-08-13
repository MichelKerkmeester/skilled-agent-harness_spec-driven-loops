# Iteration 7: Blinded, Certificate-Bound Gate Authority

## Focus

This pass asks when a `GateVerdict` may actually open an edge with material consequences.

## Findings

1. 036 already defines stronger adjudication than AgentSwarms: opaque randomized candidates, mirrored A/B and B/A, counterfactual probes, raw-score retention, effective-independence evidence, and stable/unstable/inconclusive outcomes. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service/spec.md:54-66] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service/spec.md:76-85]
2. Decision: semantic gates above a configured risk threshold must reference a 036 adjudication verdict, not inline re-score raw judge output. Missing mirrored comparisons, bias-sensitive counterfactuals, insufficient independence, or self-scoring yield `inconclusive` and route to escalation. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service/spec.md:99-113]
3. Decision: edge authority is capped by blast radius, not confidence. Reversible/contained transitions may auto-pass after deterministic checks; wide reversible changes require clean trajectory plus semantic gate; destructive, migration, production-data, or money-moving effects always require a human/cutover gate. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:147-169]
4. Decision: every authority-bearing verdict references an exact artifact certificate whose semantic fields, topology digest, evidence digests, policy identity, evaluator versions, and ledger head are re-derived and compared. The 025 remediation shows metadata-only correspondence and self-consistent invented positions are not enough. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding/spec.md:49-56] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding/spec.md:82-86]
5. Decision: before promotion, run negative controls—a clearly wrong artifact, identity/order swaps, stale certificate, decoy with copied metadata, missing source, and policy-version mismatch. A gate cannot become authoritative until those controls fail as expected in shadow traffic. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:90-136] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding/spec.md:112-123]
6. Gate policy and evaluator versions are frozen inputs to replay; silent judge upgrades invalidate comparison and require a new policy epoch. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:117-138]

## Ruled Out

- Confidence-only auto-authority.
- Self-judging or identity-visible panels for high-stakes edges.
- Certificates that bind metadata but not semantic payload identity.

## Dead Ends

A high score cannot authorize an intrinsically non-auto-approvable effect.

## Edge Cases

- Ambiguous input: blast-radius policy is organization-specific but must be versioned and conservative.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: human gate durability is deferred to iteration 9.

## Sources Consulted

- [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service/spec.md:54-129]
- [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding/spec.md:49-123]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:90-180]

## Assessment

- New information ratio: 0.79
- Novelty: defines the authority conditions above a typed verdict and binds them to 036's strongest evidence services.
- Questions addressed/answered: q-verdicts authority boundary.

## Reflection

- What worked and why: 036's bias and certificate work turns broad blog guidance into concrete contracts.
- What did not work and why: confidence cannot encode reversibility or impact.
- What I would do differently: make blast radius a required input to gate compilation.

## Recommended Next Focus

Separate durable event replay, checkpoints, and external-effect receipts across crash boundaries.
