---
title: "Implementation Summary: Selective-Classification Controller"
description: "Delivered a pure certificate-gated selective controller, replayable friction bounds, held-out promotion metrics, typed route-gold fixtures, and adversarial shadow validation."
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Delivery status | Implemented reference artifact; shadow verification clean |
| Controller | `SelectiveControllerV1` pure four-input resolver returning an evidence/state envelope |
| Runtime dependency boundary | Frozen canonical hash, decision oracle, and recovery-ladder contract |
| Routing authority | Recommendation only; `WithheldUntilVerify` |
| Migration stage | Stage 3 shadow evaluation |
| Route-gold status | `shadow-partial`; real scorer over typed fixtures, no per-hub canary |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`lib/selective-controller.cjs` implements the terminal decision controller as a
pure function over a request-pinned policy/risk identity, ordered candidates,
an external certificate handle, and phase 004's shared `budgetState`. Its public
`decision` is the frozen `route | clarify | defer | reject` algebra. Only route carries targets, and
every result withholds authority pending destination-local VERIFY→COMMIT
(synthesis §2.3, §10).

Positive routes now carry the canonical evidence array
`[{kind:"rankScore",...},{kind:"scoreMargin",...}]`. The route keys are exactly
`selectionKind,targets,basis,evidence,authority`. Calibration is absent from the
decision and appears only as sibling evidence on the controller envelope,
preserving the identical public shape required by synthesis §4 Seam C.

Multi-candidate `signal` routing requires a live active selective-classification
certificate. The controller recomputes both certificate hashes, validates the
lifecycle and method, compares policy hash/risk slice/generation with the
request, retains the held-out corpus identity, and applies the upstream-fitted
abstention threshold. Rank and margin remain non-authority evidence. A bounded
default is reachable only after the same gate and an explicit request-pinned
low-threshold posture, and only with usable rank evidence. Malformed certificate
fields abstain rather than escape the controller. All certificate negatives fall to clarify/defer
(synthesis §3 Idea 5, §8.1).

Clarification is one typed question with at most three candidate options plus
`none_of_these`. A sentinel or otherwise non-discriminating answer defers as
`no-match` before any route branch. Attempt two is the sole accepted-answer
rescore. Clarify authorization reads
`budgetState.contract.userTurns - budgetState.userTurnsUsed`; a spent phase-004
turn therefore cannot emit another clarification, regardless of the local
interaction counter. The returned `budgetState` increments on clarify and is the
single authoritative continuation. Four fixed
hard limits cover one user turn, three options, two attempts, and 256 contract
tokens. `promotion-metrics.v1.json` separately defines all seven promotion
metrics over an externally bound held-out corpus slice; it selects no threshold
value (synthesis §4, §11 Q2, §12).

N=1 is data-driven. `candidateCount === 1` removes certificate, ranking,
threshold, bundle, and default machinery; exact admission can signal-route,
leaf ambiguity can clarify, and zero signal defers. Any singular ranking or
certificate invocation hard-fails; any non-`single` selection kind also
hard-blocks, without a skill-name branch (synthesis
§5.1, §9).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`resolveSelectiveController()` and `inspectSelectiveController()` return the
same frozen envelope: public `decision`, sibling calibration evidence, returned
`budgetState`, and non-authoritative replay counters. The controller imports
the real frozen `parseRouteDecisionShape()` guard and asserts every terminal
decision before returning it.

The fixture set additionally falsifies five branch-order and edge failures:
`none_of_these` under a valid high-rank certificate, zero signal under a valid
bounded-default certificate, a threaded state whose single user turn is already
spent, a one-candidate ordered bundle, and a self-consistently rehashed
certificate with a malformed threshold. Separate mutation fixtures retain the
overrun shared ledger, fourth option, third attempt, 257th token, and singular
ranking call. A source mutation removes only the shared-budget guard and proves
the spent-budget case flips from `defer` to `clarify`.

Compatibility uses the committed calibration projector. The harness projects
the same route with and without certificate evidence and byte-compares the
results. It invokes the real exported `evaluateRouteGold` against authored typed
gold, then corrupts a real observation and requires a red result. All three
shared scorer digests are checked before and after the lane (synthesis §8.2,
§10).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Certificate legality is anchored to the request-pinned policy identity and
  risk slice. The envelope's calibration claim is evidence, never the
  authority used to admit the branch (synthesis §8.1).
- The controller consumes the upstream fitted threshold from a validated
  selective-classification certificate. It does not choose a numeric value or
  reinterpret rank as probability (synthesis §2.3, §11 Q2).
- Decision-card tokens are deterministic maximal non-empty
  Unicode-whitespace-delimited spans. This is replayable and strict, while
  making no model-tokenizer equivalence claim.
- Advisor evidence is additive. Live identity-matched advisor evidence may
  rank; stale annotates only; absent contributes zero; compiled policy remains
  available (synthesis §8.1).
- Route-gold remains a compatibility projection. Out-of-band calibration evidence is
  intentionally invisible, and changing a scorer to observe it would be a
  migration failure (synthesis §8.2, §10).
- Stage 3 is the terminal claim here. Stage-4 threshold fitting, per-hub canary,
  fenced activation, and rollback drill remain downstream (synthesis §9).
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Fresh targeted verification produced:

- syntax: both CommonJS files pass `node --check`;
- data: both JSON files parse successfully;
- purity: three frozen local imports; six forbidden-effect patterns absent;
- external oracle: all 17 terminal decisions pass the real frozen
  `parseRouteDecisionShape()` assertion;
- replay: 17 typed rows × 25 repeated runs, one decision byte sequence per row;
- certificate negatives: absent, stale, policy mismatch, and risk-slice mismatch
  each end in clarify with their exact reason;
- friction negatives: an overrun shared ledger, fourth option, third attempt,
  and 257th token each hard-fail with a distinct fixed reason;
- falsifiers: `none_of_these` defers `no-match`; certified zero-signal defers
  `no-match`; spent-turn clarification defers `evidence-unavailable`; malformed
  threshold clarifies with `CERTIFICATE_THRESHOLD_INVALID`;
- shared-budget teeth: phase-004 `userTurnsUsed=1` yields `defer`; removing only
  the shared-budget guard makes the identical input yield `clarify`;
- N=1: signal route with `rankCalls=0`, `thresholdCalls=0`, and
  `rescoreCalls=0`; planted ranking and ordered-bundle selection hard-fail;
- held-out binding: external corpus and certificate validate at corpus hash
  `be0fca5545dfe895c8bb22e45fdd07cbde8517873e76c9251af7a4ae7d8bccca`;
  both declared sample counts equal the one matching risk-slice record, yielding
  certificate `de8f49083fb5df1150da09ae78a93efda6535cf52585449edca833850d106aca`;
- projection: with/without certificate bytes are identical;
- real scorer: 17/17 typed rows pass; corrupted intent fails;
- protected SHA-256: scorer `d5a9cc72…`, replay `b039b8dd…`, loader
  `249be7c1…`, unchanged before/after;
- comment hygiene: zero violations in both CommonJS files.

Validator status is `shadow-partial`: SC-001..SC-004 report `pass`; SC-005
reports `shadow-partial` because the lane does not fit a real threshold or run
a per-hub canary.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- Real threshold fitting, operational sample floors, and per-hub canary traffic
  are not present. They remain Stage-4 work.
- Typed fixtures call the real scorer, but no activated live router produces
  these controller decisions; route-gold evidence is therefore shadow-only.
- Certificate registry authenticity is represented by the externally supplied
  active handle and committed certificate contract. Production trust roots or
  signatures are outside this controller.
- The controller emits no proof, activation, registry mutation, or destination
  effect. Fenced CAS activation and post-COMMIT recovery stay downstream.
- Strict packet validation was run and failed outside the controller contract:
  the packet predates current template/anchor requirements, and the repository
  validator cannot load `level-contract-resolver.js` or its local `tsx` runtime.
  Those dependencies and structural migrations are outside this phase's allowed
  edit surface, so the strict gate remains open.
<!-- /ANCHOR:limitations -->
