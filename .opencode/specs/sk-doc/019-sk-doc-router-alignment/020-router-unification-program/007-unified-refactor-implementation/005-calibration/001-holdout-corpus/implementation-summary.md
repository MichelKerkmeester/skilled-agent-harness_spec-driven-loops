---
title: "Implementation Summary: Calibration Held-Out Routing Corpus"
description: "Delivered contract, representative corpora, governance, and scorer-backed validation evidence with shadow-stage limits stated explicitly."
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Delivery status | Implemented; Stage-3 checks pass with Stage-4 evidence deferred |
| Artifact schema | `CalibrationCorpusV1` / `CalibrationClaimV1` |
| Corpus generation | 1 per representative multi-candidate hub |
| Runtime dependencies | Node built-ins plus frozen canonical contract helper |
| Routing authority | None; evidence only |
| Route-gold status | `shadow-partial`; typed rows use the real projector chain but no activated typed router |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Built

The phase contains strict JSON contracts, an executable validator library, a
zero-dependency scorer-backed harness, protocol/governance documents, three
sealed representative corpora, typed-shadow provenance, exact negative
fixtures, bound non-activation claims, and an explicit singleton no-slice
record. The corpus identity is SHA-256 over frozen canonical bytes of the full
immutable corpus body except `corpusHash` and `corpusId`. Records, policy
identity, coverage, policy binding class, privacy sign-off, retention, and seal
metadata therefore share one content address (synthesis §2.1, §9).

Intent gold is locked before router output is visible. Risk cells derive from
the strictest selected destination and use fixed taxonomy tolerances. Frozen hub
topology, rather than corpus-local declarations alone, requires every reachable
action and positive selection kind. A changed sample must advance beyond its
prior corpus generation, and the trusted prior id is part of the candidate's
content-addressed identity (synthesis §2.2, §2.3, §5.3, §9, §10).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How Delivered

The harness validates each sealed corpus, recomputes its content address from
the frozen canonical helper, checks source-policy snapshots, and runs the
frozen router plus exported `evaluateRouteGold` in a read-only subprocess. The
five typed rows are derived from corpus records by the real
`projectTypedRouteGold -> projectLegacyObservation` chain; the typed fixture now
stores provenance only. A deliberately corrupted observation must fail the real
scorer.

Replay emits frozen-canonical bytes and compares their SHA-256 and exact bytes
across three runs. The harness pins and re-hashes `score-skill-benchmark.cjs`,
`router-replay.cjs`, and `load-playbook-scenarios.cjs`. Negative fixtures assert
specific reasons for trust relabeling, same-generation samples, strictest-target
classification, fixed tolerance, frozen topology, leakage, binding, privacy,
external activation attestation, and live identity/floor/lineage/divergence.
Each new rejection has an accepted control with the relevant guard restored.

No routing config or authority surface is changed. Promotion remains a future
fenced-CAS operation with prior-generation retention (synthesis §8.2, §9, §10).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Decisions

- The frozen domain-tag registry was not extended. `corpusHash` uses the frozen
  canonical byte serializer directly and covers every corpus field except its
  two self-referential identity fields (synthesis §2.1).
- Policy binding class, privacy attestation kind, coverage requirements,
  retention, and seal bytes are identity-bearing because changing them can
  affect validation or claim admission. A trust relabel can become admissible
  only under its newly minted id.
- Generation monotonicity is lineage-aware: changed canonical record bytes must
  advance the generation; metadata-only trust changes still mint a new id.
- Structural fixtures require one record per reachable branch/cell, while
  operational certificate floors are 100 samples for actor/judgment mutating
  cells and 50 for lower-risk cells. The latter are screening floors, not a
  claim of statistical sufficiency (synthesis §3 Idea 5, §11 open-q 2).
- Actor/mutating ECE tolerance is fixed at 250 basis points; every bundle is
  classified by its strictest target, and lower-risk self-declaration cannot
  widen that tolerance (synthesis §2.2, §2.3, §8.1).
- Corpus-local coverage minimums are additive. The external frozen topology is
  authoritative for reachable actions and positive selection kinds.
- The singleton exception is encoded as data and checked generically, following
  the N=1 degeneracy proof (synthesis §5.1, §5.3).
- Privacy-filtered live measurement is non-authority and divergence-blocking;
  sealing requires independent privacy review (synthesis §11 open-q 7).
- Activation admission is evaluated only for operational compiled-policy
  evidence. It requires distinct external proof, signature, and authority
  references plus a reviewer who is not a corpus author; shadow-fixture claims
  remain admissible for non-activation use without those references.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

`node --check` passed for the library and harness; all JSON parsed; the harness
exited 0. It scored 15 records: 10 through the real legacy router and 5 through
the real typed/compatibility projector chain, then passed all 15 through the
exported `evaluateRouteGold`. The corrupted observation was rejected. Three
frozen-canonical replay runs produced identical bytes with SHA-256
`9ee9f59882cb4215a36d408db736ca9029eba1cd5bb01ae1c38f141d15769e01`.
Protected SHA-256 values remained:

- scorer: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`;
- router replay: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`;
- playbook scenario loader: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`.

The three sealed ids are:

- `sk-code`: `1c04bf22a237ee93d7894a2ea85e02d1fbcb47aae58c9a81d30f50a1359bb598`;
- `system-deep-loop`: `2b403b1ab9741c8e34369351cf81eb2a5c27dcae925ad91fddcfd417e09a0265`;
- `mcp-tooling`: `a6cc07b555ea1305436c8310b7d8c5df12fcd6cd208a9fe7cd09eba6ec36f908`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- Five positive-composition/rejection rows are derived through the real typed
  projector chain, but their decisions and diagnostics originate from held-out
  corpus gold rather than activated typed hub routers. Full real-scenario
  route-gold is Stage 4 and remains `shadow-partial` here.
- Corpus policies are hash-verified snapshots of current router/registry source
  with `policyBindingClass: shadow-fixture`, not compiler-produced activated
  `EffectivePolicy` artifacts. Claims therefore set `activationAdmission=false`;
  attempting activation fails closed.
- The live summary is a synthetic contract fixture. No live traffic was sampled
  and no operational privacy reviewer signed it; real live/offline divergence
  remains a P1 gate.
- Representative structural corpora do not meet the 50/100-sample operational
  certificate floors and cannot support a production calibration claim.
- Real cryptographic verification of external attestation signatures remains a
  Stage-4 activation concern. This phase verifies the reference, identity,
  authority, and independence bindings only; it does not verify signature bytes
  or external trust roots.
- Strict repository spec validation was not run by explicit instruction.
<!-- /ANCHOR:limitations -->
