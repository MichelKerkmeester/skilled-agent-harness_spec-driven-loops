---
title: "ADR: Cross-Mode Anti-Convergence Contract"
description: "Define a declarative antiConvergence contract across research, review, context, and council modes, with fail-closed stopPolicy enforcement and optimizer invariants."
trigger_phrases:
  - "cross-mode anti-convergence ADR"
  - "antiConvergence contract"
  - "stopPolicy fail-closed"
  - "optimizer invariant group"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# ADR: Cross-Mode Anti-Convergence Contract

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. Context

Research mode had an anti-convergence floor, but review, context, and council modes had no equivalent guard. The optimizer could also satisfy individual parameter ranges while proposing an invalid pair such as `minIterations > maxIterations`, and runtime capability documents could omit `stopPolicy`, leaving stop behavior permissive or undefined.

The sibling convergence-profile ADR had already established that the loop modes should share a descriptive convergence vocabulary without forcing a single convergence formula. This phase used that shared vocabulary to define a cross-mode anti-convergence contract without changing convergence math.

---

## 2. Decision

Define and project a declarative `antiConvergence` contract across all four mode configs:

- Research, review, and context configs define `antiConvergence.minIterations`, `antiConvergence.convergenceMode`, and `antiConvergence.stopPolicy`.
- Council config defines the same semantic floor with `antiConvergence.minRounds` because council convergence is round-based.
- Runtime capability files set `stopPolicy` to `fail-closed`, and `runtime-capabilities.cjs` rejects capability loading when required stop-policy data is missing.
- The optimizer manifest locks `convergenceMode` as non-tunable and adds an invariant group that rejects candidates where `minIterations > maxIterations` before scoring.

This is a contract-and-invariant decision. It does not replace the mode-specific convergence formulas or alter their stop calculations.

---

## 3. Alternatives Considered

| Alternative | Verdict | Why |
|-------------|---------|-----|
| Keep the anti-convergence floor only in research mode | REJECTED | Review, context, and council could still stop after a single iteration or round, leaving the same class of premature convergence bug in other modes. |
| Add separate bespoke floors per mode with no shared contract | REJECTED | Bespoke fields would preserve mode drift and leave the optimizer without one invariant vocabulary. |
| Tune `convergenceMode` as an optimizer parameter | REJECTED | The phase treats convergence mode as a contract choice, not a tunable knob; allowing tuning could bypass the intended floor semantics. |
| Shared declarative `antiConvergence` contract with independent convergence math | CHOSEN | It gives all modes an explicit floor and fail-closed policy while preserving mode-specific convergence behavior. |

---

## 4. Consequences

- Each mode config now declares the minimum anti-convergence floor in its own mode vocabulary.
- Missing stop-policy data is a load-time failure, not a permissive default.
- Optimizer candidates that violate the floor relationship are rejected before scoring.
- Council keeps the round-based `minRounds` spelling, so schema readers must treat it as the council equivalent of `minIterations`.
- Later convergence-math migrations must keep this contract intact and prove behavior parity separately.

---

## 5. Migration Guide (informational, not executed here)

Future mode configs must include an `antiConvergence` block and a fail-closed stop policy before they are accepted by runtime capability loading. Optimizer changes must keep `convergenceMode` non-tunable and must reject floor values that exceed the configured maximum iteration or round count before scoring a candidate.
