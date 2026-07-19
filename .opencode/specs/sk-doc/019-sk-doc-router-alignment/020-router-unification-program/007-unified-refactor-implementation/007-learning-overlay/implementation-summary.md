---
title: "Implementation Summary: Offline Correction Overlay"
description: "Delivered an immutable vocabulary-assignment overlay, content-filtered offline corpus, real-scorer replay, hard-gated shadow promotion, fenced rollback, and inert singleton behavior."
importance_tier: "critical"
contextType: "implementation"
status: "implemented-dormant"
---
# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Delivery status | Implemented and shadow-validated; production overlay remains dormant |
| Primary artifact | Separately hashed immutable `CorrectionOverlayV1` |
| Effective identity | Canonical hash of base, overlay-or-null, schema, and activation generation |
| Runtime dependencies | Node built-ins plus frozen local contract libraries |
| Serving authority | Legacy-authoritative and shadow-only; no live routing pointer changed |
| Migration gate | Stage 5 machinery validated; real-corpus promotion remains unsatisfied |
| Route-gold status | Three base-parity rows pass through the real evaluator/projector/scorer; a learned divergence fails |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Built

The phase contains an offline pipeline from raw correction/handoff records to a
frozen candidate vocabulary assignment table. Raw records pass a content-based
privacy filter and epoch retention/partition policy before normalization. The
compiler accepts only branded sanitizer output, groups deterministic votes by
normalized vocabulary, resolves assignments only to destinations already in the
compiled base, and returns `overlay:null` when destination cardinality is one.
Every compiled corpus must carry one partition and one retention-policy identity;
mixed inputs reject before voting. Candidate ordering uses Unicode code-unit
comparison, matching the frozen serializer rather than the host locale.
That is the learning plane from synthesis §2 and §2.1, with privacy and retention
made explicit for open question 7.

The promoted `CorrectionOverlayV1` uses the committed upstream schema shape:
`schemaVersion`, `basePolicyHash`, `adjustments`, `promotionProvenance`, and
`overlayHash`. Each adjustment has exactly `vocabulary` and `destinationId`.
There is no weight field or scoring API; the only named weight is the exported
uniform inert value `4`. This implements synthesis §3 Idea 2 without answering
the unresolved learnable-field question by invention.

An effective tuple is computed by the frozen `canonical.cjs` over the base hash,
overlay hash or null, schema version, and activation generation. Promotion pins
one manifest generation per request and uses the committed generation/hash CAS.
The base bytes never change. Learning therefore changes which frozen artifact a
manifest selects, matching seam D in synthesis §4 while keeping the mutable
online alternative eliminated as required by synthesis §6.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How Delivered

`runRouteGoldReplay()` materializes candidate vocabulary as additive compiled
detectors/selectors, then calls the imported phase-002 `evaluate()` for every
base and base-plus-overlay request. The imported compatibility projector maps
those real decisions into the scorer shape, and phase-002's read-only scorer
subprocess supplies the verdict. Fixtures cannot provide expected intent or
resource arrays: gold is derived from the authenticated base-policy decision.
The learned `construct` divergence therefore evaluates as `route` against a base
`defer` and fails route-gold parity. The protected router producer is also called
read-only, and its intents and resources are compared with evaluator projection
output rather than accepted merely because parsing succeeded.

Promotion consumes negative-target-free, evidence-never-COMMIT, and
COMMIT-requires-VERIFY verdicts before replay or CAS. Route-gold parity and the
stale-CAS check are blocking gates in the same path; aggregate score has no
override. Effective identity recomputes the base and promoted-overlay hashes from
canonical artifact bytes before forming the tuple. Activation retains the actual
prior base plus optional overlay and tuple, verifies that artifact reproduces the
manifest preimage, then performs the fenced swap. Rollback rejects a manifest-only
preimage and restores the retained artifact and manifest byte-identically.

No live promotion was performed. The upstream activation manifest used by this
implementation is deliberately legacy-authoritative and shadow-only, so the
successful executable fixture is reported as `promoted-shadow`. Without a real
production correction corpus and an independently approved measured gain, the
runtime outcome remains `overlay=null` / `P=static`. That is the intended
optional posture from synthesis §5.3 and §12, not unfinished base behavior.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Decisions

- Canonical serialization, overlay hashing, effective hashing, decision closure,
  compatibility projection, read-only scoring, and fenced CAS all come from
  committed upstream modules. This avoids a self-referential validator and keeps
  identity semantics aligned with synthesis §2.1 and §4 seam D.
- Candidate compilation is majority assignment per normalized vocabulary with a
  locale-independent destination-key tie order, but equal top counts reject as
  `AMBIGUOUS_TRAINING_SIGNAL`. No confidence threshold or learned weight was
  invented (synthesis §3 Idea 2; §12).
- The privacy filter runs on canonical raw-record content before normalization
  and ignores `privacyClaim`. The retention window and partition are explicit
  inputs. A corpus cannot combine partition or retention-policy identities, and
  corpus identity is recomputed from admitted records, so a declared digest
  cannot license different bytes (synthesis open question 7).
- Promotion machinery remains shadow-only because no real production corpus was
  supplied. The fixture models a positive measured gain to exercise every gate,
  but it is not reported as operational evidence. The subsystem may never leave
  `P=static` (synthesis §12).
- Overlay application is additive to the compiled base: it never replaces base
  detectors, so valid base routes remain byte-identical under a no-op or parity
  overlay. The real evaluator remains the sole decision authority.
- Overlay routing can only select a declared destination. Promotion consumes the
  real negative-target, evidence-COMMIT, and missing-VERIFY gate outcomes before
  activation. Recommendation never becomes capability (§2.1, §9).
- Rollback restores a retained base-plus-overlay artifact and its manifest bytes
  while the fencing epoch remains monotonic. A pointer without retained content
  rejects as `RETAINED_ARTIFACT_REQUIRED` (synthesis §9).
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Fresh targeted verification produced these results:

- identity: base SHA-256
  `d8181caacfb1a60f76a6ab5c3bf0264fca055ebbce7a22a2c99a98c237995d1d`,
  overlay SHA-256
  `1dafd6d7b7bacf05a6300f0457d6069690de0bfca336e40deef7330b3fa4ab41`,
  and generation-8 effective SHA-256
  `84a78b9be5ced4c580291c8b050b594c21b5b118ce6f907fc5288f2ab3be2cac`
  reproduce through the frozen canonical library; changed overlay bytes retaining
  the declared hash reject with `OVERLAY_HASH_MISMATCH`;
- vocabulary-only: adjustment fields are exactly `destinationId,vocabulary`;
  injected weight rejects with `OVERLAY_FIELD_FORBIDDEN`, and attempted online
  mutation throws `TypeError`;
- replay: two independent three-row runs are byte-identical with replay SHA-256
  `8ae771ea9e07c69cfd80eecc5bfe3a44f6efd024c6ff4560b6fe50a685e75849`;
  base/no-op and base/parity-overlay decisions are byte-identical; the real
  evaluator divergence is `base:defer` versus `overlay:route` and scorer
  `pass:false`; caller-supplied gold rejects; scorer writes are zero;
- promotion: route-gold, negative-target, evidence-COMMIT, and missing-VERIFY
  failures each block aggregate `999999.000000`; same-person approval, zero gain,
  unbound corpus, mixed generations, and stale CAS reject at named gates;
- rollback: generation-7 artifact identity
  `022e26de1a27a44534212af011e20ebcda402b5e9aab403229a090163e3d7647`
  restores byte-exactly at fencing epoch 2; absent retained content rejects;
- privacy: two records are admitted, the planted email/password record is
  excluded despite a clean claim, the expired record is excluded, and mixed
  partition/retention-policy corpora reject;
- authority: candidate count stays 3, target-bearing defer rejects, and evidence
  commit rejects; an undeclared destination and actor commit without READY also
  reject;
- singleton: candidate count 1 yields `overlay:null`, `P=static`, and the prior
  effective hash unchanged;
- locale/producer: `en-US` and `sv-SE` disagree on the planted ordering but emit
  candidate SHA-256 `72cd985bccc56b9d06613494a54cca9231c1d203461b1f7cecc4b16b66c4e80c`;
  protected producer intent `quality` and its four resources equal the evaluator
  projection exactly.

Protected SHA-256 values after replay are:

- `router-replay.cjs`:
  `b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf`;
- `score-skill-benchmark.cjs`:
  `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`;
- `load-playbook-scenarios.cjs`:
  `249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde`.

Both CommonJS files pass `node --check`; the fixture passes
`python3 -m json.tool`; comment hygiene reports zero violations; the dependency
and name-branch scans return no findings. The targeted validator command is
`node harness/validate-learning-overlay.cjs` and exits 0.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- The overlay may correctly stay dormant and never promote. No production
  correction-telemetry corpus, operational gain measurement, or live human
  approval was supplied; `overlay=null` / `P=static` remains authoritative.
- The passing gain record is a deterministic fixture used to exercise promotion
  gates. Its `real-correction-telemetry` shape is not evidence that the fixture
  came from production; live promotion remains impossible through the retained
  legacy-authoritative, shadow-only manifest.
- The privacy filter is a bounded structural baseline for email, credentials,
  token-like secrets, and private keys. A production privacy program still needs
  reviewed classification rules, deletion operations, access controls, and an
  operational retention owner.
- Route-gold coverage is three focused base-parity rows, one deliberate learned
  divergence, and one producer comparison. It proves the real evaluator,
  projector, and scorer boundary, not fleet-wide routing quality or production
  benefit.
- The primary library is larger than the preferred local guideline because it
  keeps sanitizer, compiler, replay, and fenced lifecycle rules in one cohesive
  contract module. There is no runtime performance benchmark.
- `validate.sh` was not run by explicit instruction. Metadata freshness and the
  repository-wide strict spec contract are therefore unverified.
<!-- /ANCHOR:limitations -->
