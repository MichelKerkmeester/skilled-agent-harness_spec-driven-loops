---
title: "ADR: Convergence Profile Unification (shared schema, not one formula)"
description: "Define a shared convergence-profile schema describing each loop's metrics, and explicitly reject a single universal convergence formula across the three convergence implementations."
trigger_phrases:
  - "convergence profile unification adr"
  - "convergence profile schema"
  - "reject single universal convergence formula"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# ADR: Convergence Profile Unification

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. Context

Three convergence implementations exist with independently evolved threshold logic:

- `scripts/convergence.cjs` (deep-research loop): rolling newInfoRatio average, MAD floor, entropy, composite weighted-stop vote.
- `lib/council/convergence.cjs` (AI council): agreement/contradiction-density signals.
- `lib/coverage-graph/coverage-graph-signals.ts` (coverage graph): slice/reuse coverage, relevance floor, dependency completeness.

Each carries the same *shape* of decision (combine several normalized metrics into a stop/continue verdict) but with genuinely different metric semantics. There was no shared vocabulary describing what each metric means, its weight, its direction (higher = more converged vs less), or how it is normalized. That made cross-loop reasoning, tuning, and the planned signal additions (002/011–014, 003/001, 003/003) error-prone.

---

## 2. Decision

Define a **shared convergence-profile schema** — a typed descriptor with fields `{ threshold, weight, role, direction, normalizer }` — that each implementation uses to *describe* its metrics in a common vocabulary. The schema is documentation-and-contract only in this phase: each convergence file gains the exported profile type plus a schema comment block explaining the fields; no convergence math changes.

A **parity test** (`tests/integration/convergence-script.vitest.ts`) pins the current threshold/convergence traces of all three implementations as golden values, so the subsequent migration phase can prove zero behavioral drift.

---

## 3. Alternatives Considered

| Alternative | Verdict | Why |
|-------------|---------|-----|
| **Single universal convergence formula** across all three loops | REJECTED | The loops measure fundamentally different things (information novelty vs seat agreement vs graph coverage). Collapsing them into one formula would force lossy metric coercion and hide loop-specific stop conditions. |
| Leave each implementation fully independent (no shared schema) | REJECTED | Perpetuates the divergence the new signals would worsen; no shared tuning vocabulary. |
| **Shared descriptive schema, independent formulas** | CHOSEN | Common vocabulary + typed contract for tooling and tuning, while each loop keeps its own faithful math. |

---

## 4. Consequences

- New convergence signals declare their `{threshold, weight, role, direction, normalizer}` against the shared schema, so weighting and direction are explicit rather than implicit.
- The parity test is a regression floor: the later hard-migration phase that routes the three files through the shared schema must keep these golden traces green.
- This phase changes **no** convergence behavior; it is contract + test-pin only.

---

## 5. Migration Guide (informational, not executed here)

A later phase migrates `scripts/convergence.cjs`, `lib/council/convergence.cjs`, and `lib/coverage-graph/coverage-graph-signals.ts` to consume the shared profile schema for their metric definitions. Each migration step must keep `tests/integration/convergence-script.vitest.ts` green to prove no drift.
