---
title: "SelectiveControllerV1 Reference Contract"
description: "Normative pure-controller boundary, certificate gate, abstention ladder, friction assertions, and promotion evidence rules."
importance_tier: "critical"
contextType: "implementation"
---

# SelectiveControllerV1 Reference Contract

## 1. Function boundary

```text
resolveSelectiveController(
  RouteRequestV1,
  RankedCandidatesV1,
  CalibrationCertificateHandleV1,
  UncertaintyBudgetV1
) -> RouteDecisionV1
```

The reference implementation is deterministic, referentially transparent, and
side-effect-free. Equal canonical inputs produce equal decision bytes. It reads
no clock, random source, network, file, registry, or live scorer. Its decision
is a recommendation with `WithheldUntilVerify`; only destination-local
VERIFY→COMMIT can grant effect authority (synthesis §2.3, §10).

| Input | Required provenance | Controller use |
|---|---|---|
| `RouteRequestV1` | Immutable request adapter | Supplies `requestId`, hub, the externally pinned `{effectivePolicyHash,generation}`, risk slice, evidence, and compiled threshold posture. |
| `RankedCandidatesV1` | Pure evaluator output | Supplies ordered legal-local candidates, non-authority rank evidence, clarification data, and replay interaction state. |
| `CalibrationCertificateHandleV1` | Active external certificate registry | Resolves one immutable `CalibrationCertificateV1` and the active pointer identity; the controller does not fit or redefine calibration. |
| `UncertaintyBudgetV1` | Shared recovery contract | Supplies the request-bound one-turn budget; the controller adds no parallel budget (synthesis §4 Seam B). |

The request identity is the comparison authority. Certificate legality is not
inferred from a decision field. The controller recomputes certificate content
and fence hashes, then compares the certificate's `policyHash`, `riskSlice`,
and generation with the request's pinned values.

## 2. Terminal algebra and order

The reachable action set is the existing closed algebra (synthesis §2.3):

1. With `candidateCount = 1`, ranking and threshold machinery are structurally
   unavailable. Exact admission may emit `route{basis:signal}`; leaf ambiguity
   may emit one `clarify`; otherwise the result is `defer(no-match)`
   (synthesis §5.1, §5.2, §9).
2. With multiple candidates, `route{basis:signal}` requires a live active
   `CalibrationCertificateV1` whose canonical hashes, lifecycle, selective
   classification method, request policy identity, risk slice, generation, and
   held-out corpus identity all bind, and whose fitted abstention threshold is
   met by non-authority rank evidence.
3. `route{basis:bounded-default}` is reachable only after the same certificate
   gate and only when the pinned policy posture explicitly names the
   `bounded-default-low` corner. Certificate absence, staleness, or identity
   mismatch removes both multi-candidate route branches before fallback.
4. One `clarify` is emitted only when at most three typed options plus
   `none_of_these` map to legal local candidates. One accepted answer permits
   exactly one non-cached rescore on attempt two. The rescore can route only if
   the certificate gate and fitted threshold still pass; otherwise it defers.
5. A declined/no-match answer, exhausted attempt, unavailable evidence, or
   failed certificate gate terminates as typed `defer`. Invalid/forbidden input
   is rejected by the frozen algebra boundary rather than converted into a
   destination.

Only `route` carries targets. `clarify`, `defer`, and `reject` are structurally
target-free and carry `authority: Withheld`. Zero signal never unions a default
resource set (synthesis §4 rungs 2–3 and 5–6; §10).

## 3. Certificate consumption

The controller consumes the certificate union committed by the calibration
contract. It neither chooses a threshold nor declares a score probabilistic.
For multi-candidate routing, all of the following are necessary:

- handle state is `live`, and `activeCertificateId` equals the resolved
  certificate's recomputed identity;
- status is `validated` and the method is
  `selective-classification-threshold`;
- `certificateId` and `certHash` recompute from canonical bytes;
- `policyHash`, risk slice, and generation equal the request-pinned identity;
- `corpusId === corpusHash`, preserving the held-out corpus binding;
- the upstream-fitted abstention threshold is met.

Rank score, margin, advisor order, or a decision's own calibration claim never
substitutes for one of these checks. `absent`, `stale`, inactive, malformed, or
identity-mismatched certificates fall to `clarify`/`defer`, never to a silent
bounded default (synthesis §2.3, §8.1).

## 4. Advisor evidence

Advisor rank is one evidence record, never probability. A `live` record
contributes only when its policy hash and risk slice match the request. `stale`
is annotation-only. `absent`/`unavailable` contributes zero. Compiled-policy
rank evidence remains usable when advisor evidence is absent or stale, so local
deterministic policy evaluation continues (synthesis §8.1).

## 5. Replayable friction assertions

The limits are fixed controller constants. Callers cannot raise them.

| Assertion | Deterministic offline check | Failure |
|---|---|---|
| One user turn | `interaction.userTurnsUsed <= 1`; every emitted clarify trace consumes exactly one. | `FRICTION_USER_TURNS_EXCEEDED` |
| Three candidate options plus sentinel | Count typed candidate options before appending exactly one `none_of_these`. | `FRICTION_OPTIONS_EXCEEDED` |
| Two attempts | `interaction.attempt <= 2`; attempt two is the sole accepted-answer rescore. | `FRICTION_ATTEMPTS_EXCEEDED` |
| 256-token card | Count maximal non-empty Unicode-whitespace-delimited tokens from the actual decision-card string. | `FRICTION_CARD_TOKENS_EXCEEDED` |

An overrun is a hard replay failure. It is not truncated, capped, or warned
away. The contract token definition is deliberately local and deterministic;
it does not claim parity with a model-specific tokenizer.

## 6. Replay, projection, and migration

Controller fixtures project through the committed calibration compatibility
projector, which erases calibration-only evidence and maps negative decisions
to empty intent/resource observations. The harness byte-compares projection of
the same route with validated versus unvalidated calibration evidence, invokes
the real `evaluateRouteGold`, proves a corrupted observation fails, and pins
all three protected scorer digests (synthesis §8.2).

This establishes Stage 3 shadow evidence only: deterministic typed replay,
projector parity, classified mismatches, and no gold write-back. Real threshold
fitting and per-hub canary evidence belong to Stage 4. Activation remains a
fenced CAS to a retained prior generation (synthesis §9). A scorer edit required
for green is migration failure, not an implementation option (synthesis §10).

## 7. Limitations

- No numeric threshold is selected here; fixtures consume a frozen upstream
  certificate solely to exercise the contract.
- The representative held-out corpus is shadow evidence. Operational
  risk/coverage fitting and per-hub canary traffic remain downstream work
  (synthesis §11 Q2, §12).
- The controller emits proof/recommendation data only. It cannot activate a
  policy or commit destination effects.
