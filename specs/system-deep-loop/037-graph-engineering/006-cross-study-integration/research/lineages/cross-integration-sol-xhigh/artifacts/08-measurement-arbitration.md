# P8 — Measurement and Owner-Disagreement Arbitration

## Measurement families

| Family | Required observations |
|---|---|
| correctness | prefix mismatch, replay determinism, stale/fence rejection |
| epistemics | source coverage, contradiction recall, retention closure, belief calibration |
| harness | repair success, runaway/context pollution, mutant kills |
| governance | DENY/ASK/approval/expiry/revocation, unauthorized attempts |
| performance | p50/p95 latency, tokens, cost, tools, graph overhead |
| recovery | detect/reconcile/rollback time and success |
| rollout | shadow divergence, legacy zero-use, per-mode health |

These combine S1 observability, S2 parity/recovery, S4 completeness, and S5 measured harness quality. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:93] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:197] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193]

Every metric binds population, exclusions, candidate/base digests, mode, authority state/epoch, policy, time window, raw observations, and calculation version. Missing baselines block; they are not zero. [INFERENCE: denominator binding prevents selection bias.]

## Jurisdictions

Return adapter decides shape; evidence evaluators decide their family; belief decides usability; convergence decides stop eligibility; organization policy decides ALLOW/DENY/ASK; human gate settles scoped ASK; 036 decides mutation. Earlier blocks cannot be overruled downstream. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386]

For multiple applicable policies, `DENY > ASK > ALLOW`. Human approval settles ASK only; changing DENY requires a new policy version.

## Conflict protocol

1. Append `OwnerDisagreement` with owners, scopes, verdicts, reasons, evidence, and policy version.
2. Identify earliest jurisdiction.
3. Re-run contested facts with blinded independent evidence.
4. If factual conflict persists or policy is ambiguous, emit scoped ASK with expiry.
5. Until new evidence/policy settles it, remain `blocked_disagreement`; 036 refuses mutation.

S3 names the missing arbitration contract; S4 supplies independent negative-evidence methodology. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:103] [INFERENCE: voting is replaced by jurisdiction and evidence renewal.]
