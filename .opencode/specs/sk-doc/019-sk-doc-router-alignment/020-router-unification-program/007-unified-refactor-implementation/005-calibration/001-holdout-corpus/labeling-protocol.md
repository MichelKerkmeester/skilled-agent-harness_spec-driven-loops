---
title: "Intent-Derived Blind Labeling Protocol"
description: "Independent-author protocol that prevents router-output leakage into held-out calibration gold."
importance_tier: "critical"
contextType: "implementation"
---
# Intent-Derived Blind Labeling Protocol

## 1. Authoring sequence

1. A privacy scrubber removes direct identifiers, secrets, unique organization
   names, free-form personal data, and unnecessary path fragments.
2. An independent label author sees only the scrubbed user request, the frozen
   policy card, destination identities, and closed decision algebra.
3. The author records the user's intended action, positive selection kind when
   applicable, target tuple, negative reason when applicable, and compatibility
   gold. Router scores, selected modes, resources, telemetry, and prior replay
   results are unavailable during this step.
4. The author locks the label and attests that its source is `user-intent`, that
   router output was not viewed before lock, and that the gold was not reconciled
   against router output.
5. A separate operator may run replay only after label lock. Replay observations
   live outside the hashed record set, so they cannot silently rewrite gold.

This ordering prevents the router under measurement from confirming itself.
Advisor rank and score margin remain evidence, not probability or authority
(synthesis §2.3, §8.1).

## 2. Required provenance

Every record carries:

```text
labelProvenance = "intent-derived"
authorAttestation = {
  authorId,
  goldSource = "user-intent",
  independentFromRouterOperator = true,
  routerOutputViewedBeforeLabelLock = false,
  reconciledAgainstRouterOutput = false,
  labelLockedAtEpoch
}
```

The validator rejects router-derived sources and reconciliation separately, with
stable reason codes. `fixtures/negative/leakage-router-derived.json` is a planted
leakage case; the harness asserts the exact
`LABEL_LEAKAGE_ROUTER_SOURCE` rejection rather than accepting any throw.

## 3. Gold rules

- Exact positive intent selects `route(single)`.
- Explicit multi-target composition selects the hub-supported positive
  composition kind.
- Genuine one-turn ambiguity selects `clarify`.
- Zero signal selects `defer(no-match)` and projects to no intent and no resource
  union.
- Invalid or forbidden intent selects `reject`.
- Negative branches never carry targets or authority.

These rules preserve the fixed decision algebra and no-over-emission invariant
(synthesis §2.3, §10).

## 4. Disagreement and relabeling

An adjudicator may compare two independent intent labels, but still may not see
router output. Disagreement is resolved from user intent and frozen policy only.
Any post-lock label change mints a new record and corpus generation. Reconciliation
against live or replayed routing output permanently disqualifies the record from
held-out use.
