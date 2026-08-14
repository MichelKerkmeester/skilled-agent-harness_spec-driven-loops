# Iteration 008 — Measurements and Owner-Disagreement Arbitration

## Focus

Resolve P8 by closing what is measured, who owns each measure, and how conflicting owner decisions settle without voting away a blocker.

## Findings

1. **DIRECTLY-STATED cross-link — measurement is multi-family.** S1 requires observability and budgets; S2 requires parity/refusal/recovery evidence; S4 requires completeness and independent evidence quality; S5 requires behavior, quality, cost, latency, and mutant outcomes. A single success rate is insufficient. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:93] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:197] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193]

2. **Baseline families.** Measure correctness (causal-prefix mismatch, replay determinism, stale/fence rejection), epistemics (source coverage, contradiction recall, never-forget retention, belief calibration), harness (repair success, runaway/context-pollution rate, mutant kill rate), governance (DENY/ASK/approval/expiry/revocation and unauthorized attempts), performance (p50/p95 latency, tokens, cost, tool calls, graph overhead), recovery (detect/reconcile/rollback time and success), and rollout (shadow divergence, legacy zero-use, per-mode cutover health). [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:117] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193] [INFERENCE: the seven families cover every promotion owner and rollback consequence.]

3. **Measurements bind denominators and provenance.** Every metric records population, exclusions, candidate/base digests, mode, authority state/epoch, policy version, time window, raw observations, and calculation version. Thresholds are policy inputs; missing or incomparable baselines block promotion rather than becoming zero. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:23] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [INFERENCE: explicit denominators prevent selection bias and baseline laundering.]

4. **Owner arbitration is jurisdictional, not majoritarian.** Owners decide only their boundary: return adapter -> shape, evidence evaluator -> family, belief reducer -> usability, convergence reducer -> stop eligibility, organization policy -> allow/deny/ask, human gate -> scoped ASK, 036 -> mutation. Any earlier-owner block remains blocking; later approval cannot override it. For multiple applicable policies, automated composition is `DENY > ASK > ALLOW`; changing DENY requires a new policy version, not human override. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [INFERENCE: jurisdiction plus restrictive policy composition closes the owner-disagreement gap named by S3.]

5. **Conflict protocol.** Emit immutable `OwnerDisagreement{candidate,scope,owners,verdicts,reasons,evidence,policyVersion}`; identify earliest jurisdiction; re-run only contested factual derivations using blinded independent evidence; if conflict persists, return typed `ASK` to a named human owner with expiry. Until a new evidence or policy version settles it, state is `blocked_disagreement`; 036 refuses mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:103] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330] [INFERENCE: independent rerun resolves facts; scoped human action resolves policy ambiguity, never failed safety evidence.]

## Sources Consulted

- S1 observability/budgets: lines 93–97.
- S2 parity, refusal, recovery, and gates: lines 147–224, 330–490.
- S3 budgets, governance mutants, and explicit arbitration gap: lines 117–143, 222–232.
- S4 completeness and negative evidence: lines 23–36, 103–136, 197–216.
- S5 measurements and harness mutants: lines 126–148, 193–206.

## Assessment

- New information ratio: 0.69.
- Novelty justification: added seven metric families and a jurisdictional conflict protocol with restrictive policy composition and typed blocking.
- Confidence: high on ownership/arbitration semantics; low-to-medium on numeric thresholds until baseline data exists.

## Reflection

- What worked: separating factual re-derivation from policy escalation.
- What failed: majority vote, metric averaging, or human override of safety DENY.
- Ruled out: missing baseline as zero; late-owner override; unresolved disagreement as warning-only.

## Recommended Next Focus

Iteration 9 — cross-angle contradiction audit, no-bypass proof, and tension resolution across P1–P8.
