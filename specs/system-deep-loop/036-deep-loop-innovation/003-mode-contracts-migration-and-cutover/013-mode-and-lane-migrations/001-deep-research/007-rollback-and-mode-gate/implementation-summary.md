---
title: "Implementation Summary: Deep Research Rollback and Mode Gate"
description: "A fail-closed rollback switch and independently authenticated migration-readiness gate now complete the Deep Research golden lane without moving authority."
trigger_phrases:
  - "Deep Research rollback gate implementation"
  - "Deep Research mode migration certificate"
  - "deep-research golden lane complete"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-23T07:06:02Z"
    last_updated_by: "codex"
    recent_action: "Committed unresolved-risk regression coverage and refreshed verification evidence"
    next_safe_action: "Phase 014 may evaluate the readiness certificate before a separately authorized cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-rollback-gate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "leaf-007-round-12-2026-07-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Window credit deduplicates by both execution ID and certificate digest."
      - "Rollback re-verifies gate evidence and reproduces the certificate digest."
      - "The migration certificate is readiness evidence, not cutover authority."
      - "Resume accepts only migration-ready compatibility and manifest dispositions."
      - "Phase 014 must source retention counts from the real stores."
      - "Shared-contract and write-set digests remain explicit unbound descriptors."
      - "Lifecycle rows authenticate identities, not absent per-kind substrate semantics."
      - "Health state is gated and the full aggregate is signed, but observation authenticity is a substrate boundary."
      - "Rollback-window inputs are fully bound, but historical execution authenticity requires a certificate store."
      - "Resume evidence is fully bound and safe-value checked, but has no signed resume reference in the gate bundle."
      - "Rollback policy and source authority fields come from the gateway decision."
      - "Historical lease identity requires phase-014 correlation."
---
# Implementation Summary: Deep Research Rollback and Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-rollback-and-mode-gate |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
| **Runtime Surface** | `.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Research now has a fail-closed rollback switch and an independent migration-readiness gate. Both remain additive-dark: legacy stays authoritative, the ledger remains denied, the rollback window remains open, and phase 014 retains sole ownership of any cutover or authority restoration.

### Independent authenticated mode gate

`DeepResearchModeMigrationGate` evaluates the five required evidence classes with their exact blocking dispositions. It re-verifies the embedded parity certificate, then authenticates every claimed stream and attestation against one matching allowed transition in the immutable audit written by the real `TransitionAuthorizationGateway`. The gate does not trust the sibling gate-input self-report. `evaluateParity` also requires every parsed receipt's event-schema, reducer, and projection versions to equal the top-level version tuple before that tuple can enter a signed certificate; divergence yields `EVIDENCE_STALE`. The certificate bucket does not carry an equivalent exact three-field version tuple, so parity receipts are the binding authority for these fields.

Lifecycle rows are authenticated against exact `(eventDigest, receiptDigest)` identities returned only by ready evidence verifiers: authorized parity receipts, offline-verified transition receipts, and verified sealed-artifact content/descriptor pairs. All ten event digests and all ten receipt digests must be independently unique, which also makes every pair unique. Insufficient authenticated source identities are now consistently `blocked` with `EVIDENCE_MISSING`; a complete bundle containing an unrecognized row fails `EVIDENCE_STALE`; duplicate rows fail `LIFECYCLE_INCOMPLETE`. Resume evidence is safe-value gated, compared through a complete canonical semantic digest between legacy and ledger results, and bound in full into the lifecycle disposition digest. No signed resume reference exists in the evaluated bundle, so ADR-005 records its authenticity as a substrate boundary.

The rollback evaluator treats the verified drill certificate as the authority for candidate SHA, verifier identity, verifier version, rollback asset, and classification digest. Any contradiction yields rollback-readiness `EVIDENCE_STALE` and no migration certificate. The offline certificate bucket separately binds the top-level authority epoch to every verified transition receipt and binds the event-envelope version to every verified projection event. Health readiness requires the caller-declared aggregate state to be `healthy` or `recovered`, and the rollback-readiness disposition now binds the canonical digest of the complete aggregate rather than only `aggregateId`. That makes every aggregate field tamper-evident in the signed certificate and makes a post-certificate swap fail provenance re-verification. It does not prove the declared state came from real observations because the gate bundle contains no signed observations or health reference; ADR-004 records that boundary.

Lifecycle readiness now uses explicit positive sets. Top-level and component compatibility outcomes may be `exact`, `compatible`, or `migrate`; `pin-old-runtime` and `blocked` fail with `RESUME_INVALID`. Manifest disposition may be `original` or `restart`; `reject` fails. Branch disposition may be `reuse`, `reexecute`, or `compensate`, while effect disposition may be `reexecute`, `compensate`, or `reconcile`; `reject` and `blocked` are excluded respectively. Legacy-versus-ledger parity now compares one canonical view containing decision constants and dispositions; complete compatibility entries; branch identity, retry key, disposition, and evidence events; complete effect action data; every invalidation set plus `synthesisReopened`; the full lease; forensic and verified-artifact digest sets; event-tail digest; and fresh-projection fingerprint. Every set-like array and structural array is sorted by a canonical stable key before hashing. Only adapter-local decision IDs/digests, branch attempt IDs, and explanatory `decisionReason` prose are excluded: they describe path-local envelopes or wording rather than the continuation action, and the sibling parity adapters intentionally generate different branch-attempt namespaces. `pin-old-runtime` is not phase-014-ready because it admits continuation only under the old runtime rather than proving the installed candidate can resume.

A passing result emits `DeepResearchModeMigrationCertificate`. Top-level validation requires `versions` to contain exactly `eventEnvelopeVersion`, `eventSchemaVersion`, `reducerVersion`, and `projectionVersion`; unknown keys block issuance. Certificate assembly reconstructs those four fields individually rather than spreading caller input, so even a later-enumerated caller key cannot enter the signed certificate. The closed certificate also binds the candidate SHA, BASE, shared-contract and write-set digests, fixture IDs, stream and artifact digests, receipt digests, run-certificate digest, replay fingerprint, verifier identity, authority epoch, rollback anchor, rollback-window evaluation, all input dispositions, and unresolved risks.

The rollback-window evaluator counts connected execution identities rather than array rows. Valid rows that repeat either `executionId` or `certificateDigest` form one execution component and contribute one threshold credit, preventing duplicate or ambiguous records from satisfying the five-execution minimum. Its `evaluationDigest` now commits both the public evaluation and the canonical digest of the complete input, so different execution evidence cannot collapse to one signed digest merely because it produces the same summary. This leaf has no historical certificate store to authenticate those execution claims; ADR-005 keeps that provenance obligation explicit.

### Comparison completeness audit

| Local comparison or validator | Complete-structure mechanism |
|---|---|
| Top-level input and version validation | Every top-level scalar prerequisite and risk ID is validated; `hasExactKeys` closes the version object to exactly four contractual keys, and certificate assembly reconstructs exactly those fields |
| Parity fixture coverage | Sorted complete fixture-ID and receipt-ID arrays are compared by canonical digest; parsed receipts self-authenticate their closed structures |
| Parity readiness, version, and authorization checks | Readiness predicates cover every gate-required discriminator; three version fields exhaust the imported version tuple; each receipt requires an exact authorized stream/attestation pair |
| Sealed-artifact coverage | The required lifecycle set is an intentional minimum; every supplied binding is verified by the real reader and every verified artifact digest enters the evidence set |
| Offline certificate evidence | The real verifier authenticates the complete bundle; local envelope-version and authority-epoch checks exhaust the two caller fields imported from that bundle |
| Lifecycle matrix | Exact row count, exact kind set, unique event/receipt columns, full row format, and exact authenticated identity membership cover the complete local row contract |
| Resume decision parity | Canonical whole-semantic-view digest covers all comparable decision, compatibility, branch, effect, invalidation, lease, forensic/artifact, tail, and projection fields; rest-object projection automatically carries future comparable decision fields |
| Resume safe-value validation | Intentional safety predicate over every disposition capable of authorizing reuse or recovery; structural equality is independently enforced by the complete semantic digest |
| Rollback-drill cross-check | The real verifier authenticates the complete drill certificate; local checks exhaust every caller field copied from drill facts, while the health aggregate is bound by its complete canonical digest |
| Rollback-window evaluation | Every field of each five-field execution row is validated or filtered, connected identities are deduplicated, and `evaluationDigest` binds the complete input |
| Gate disposition aggregation | Exactly one disposition from each of the five buckets is sorted into contractual order; the verdict fold covers every disposition class, and any unresolved risk blocks an otherwise passing result |
| Migration-certificate construction | `certificateDigest` covers the complete certificate core; no open caller object is spread into the closed `versions` shape |
| Migration-certificate provenance in the rollback switch | Closed constants plus a complete core digest are checked inside an exception-safe boundary, then the real mode gate re-derives and returns the exact certificate; the request anchor must equal that certificate's authenticated anchor |
| Rollback request preservation and authorization | Every declared request field is mapped in ADR-006 to digest binding, real-evidence authentication or cross-checking, a validated closed value, or the explicit historical-lease boundary in ADR-007; caller canonicalization is fail-closed, and before/after count pairs remain exhaustive for destructive preservation |
| Rollback-certificate construction | Decision identity, request/evidence digests, policy version, source authority state, and source epoch come from the real gateway decision; the fence token and canonical resource digest identify the real coordinator target; `staleWriterDenied` is reachable only for a well-formed, resource-matched, digest-bound caller tuple whose token is below that real rollback token; historical grant identity is not claimed; remaining fields are bound facts, constants, or deterministic derivations; `certificateDigest` covers the complete core |

### Externally authorized rollback switch

`DeepResearchRollbackSwitch` denies missing configuration, an operation outside the closed rollback operation set, unknown state, stale epochs, absent or invalid gate certificates, incomplete evidence, destructive intent, evidence-binding mismatch, gateway failure, gateway denial, and failed writer fencing. A self-consistent certificate digest is insufficient: the switch re-runs the supplied gate evidence through `DeepResearchModeMigrationGate` and requires the independently issued certificate digest to match before deferring the rollback request to the real `TransitionAuthorizationGateway`. A mode-owned `self-authorized-recovery` capability is denied by an explicit external-authority policy rule there.

All caller-controlled validation and canonicalization runs inside one fail-closed preparation boundary. Gate-certificate digest failures become `ABSENT_GATE_CERTIFICATE`; malformed resume, classification, resource, or lease-digest evidence becomes `EVIDENCE_INCOMPLETE`; structural stale-lease failures retain `WRITER_FENCE_FAILED`. The switch snapshots the resulting primitives and canonical writer resource before authorization, so later gateway, fencing, and certificate work does not re-read caller evidence. Circular and non-finite variants on the gate certificate, resume evidence, and stale-writer lease all resolve to denied decisions rather than rejected promises. Gateway exceptions still map to `GATEWAY_FAILURE`, and fencing exceptions still map to `WRITER_FENCE_FAILED`.

Certificate provenance re-verification now returns the independently reproduced certificate rather than a boolean. The switch requires the request's top-level `rollbackAnchorDigest` to equal that certificate's rollback anchor, which was already authenticated against the verified rollback-drill facts. A separately authorization-bound but different request anchor is therefore denied as `EVIDENCE_INCOMPLETE`.

The authorized rehearsal freezes admission, drives the real `FencedLeaseCoordinator`, validates the real in-flight classification manifest, and emits `DeepResearchRollbackCertificate`. The switch canonicalizes `writerResource`, requires the fixed Deep Research ledger-writer identity, requires `staleWriterLease.resource` to match it, and binds both the canonical resource digest and the complete stale-lease digest into the evidence accepted by the transition gateway. A resource or lease swap under one exact gateway retry therefore fails before fencing. The certificate records `writerResourceDigest` beside the real fence token, making the target resource disputable from the signed certificate.

Before authorization, the switch validates the complete caller-attested stale lease. `leaseId`, `ownerId`, and `correlationId` must pass the frozen `validateOpaqueIdentity` contract; all three timestamps must be parseable and ordered as `acquiredAt <= renewedAt < expiresAt`; the resource must be canonical and match the fixed Deep Research writer. Wrong types, empty identities, unparseable timestamps, and non-monotonic timestamps fail as `WRITER_FENCE_FAILED`. The complete validated tuple remains digest-bound, so an authorization cannot be replayed with another lease value.

The coordinator retains a durable per-resource high-water mark and issues each new fence token strictly above it. After acquiring rollback token `N`, the switch requires the bound stale token to be a positive safe integer strictly below `N`; equal, higher, malformed, and arbitrary high tokens fail as `WRITER_FENCE_FAILED`. The certificate's literal `staleWriterDenied: true` honestly records that the caller-attested predecessor is well-formed, resource-matched, digest-bound, and token-superseded. It does not authenticate that the historical `leaseId` or `ownerId` was the genuine grant for that token because the coordinator exposes no supported per-token grant-history lookup. ADR-007 defers that correlation to phase 014.

The acquisition-contention path is unchanged and still denies a live competing writer before any certificate can be emitted. Guarded mutations independently revalidate the coordinator's durable current-lease state, so anti-split-brain safety does not rely on the caller-attested certificate field.

All four before-and-after retention counts, the caller's configuration-version claim, and the complete claimed authority snapshot remain part of the authorized evidence digest. The certificate sources `policyVersion`, `fromAuthorityState`, and `fromAuthorityEpoch` from the real gateway decision, derives the restoration epoch from that verified epoch, and uses only bound facts, authenticated coordinator evidence, or constants for every remaining field. ADR-006 records the complete request field-to-binding audit. Its `authorityMutation: false` and `phase014RestorationRequired: true` fields keep this leaf non-authoritative.

Neither authenticated input contains authoritative retained-store totals. The classification manifest commits frozen in-flight state rows, and the migration certificate commits selected stream and artifact evidence digests. They do not expose complete ledger-event or artifact-store counts. This leaf therefore authenticates the caller's exact assertions without claiming direct store observation; `decision-record.md` requires phase 014 to read the real ledger and artifact store when constructing the request.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-rollback-gate/types.ts` | Updated | Closed schemas plus additive fenced-resource evidence in the rollback certificate |
| `runtime/lib/deep-research-rollback-gate/mode-gate.ts` | Updated | Independent evidence evaluation, canonical complete resume parity, consistent fail-closed dispositions, identity-deduplicated window evaluation, and readiness certificate issuance |
| `runtime/lib/deep-research-rollback-gate/rollback-switch.ts` | Updated | Exception-safe caller-evidence preparation, gate-certificate and anchor provenance re-verification, external authorization, destructive rollback rejection, writer fencing, and rollback certificate issuance |
| `runtime/lib/deep-research-rollback-gate/index.ts` | Created | Public module exports |
| `runtime/tests/unit/deep-research-rollback-gate.vitest.ts` | Updated | Independent adversarial malformed-input resolution, anchor equality, request-field binding, operation-enum, lifecycle, provenance, resource identity, identity-deduplication, unresolved-risk blocking, and positive-control coverage over real shared substrates |
| Leaf specification documents | Updated | Completed status, safe resume sets, retained-count boundary, evidence, and phase-014 handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module imports the six landed Deep Research sibling contracts and drives the shared transition, fencing, classification, sealed-artifact, certificate, replay, and rollback-drill implementations directly. It consumes the health substrate's aggregate contract, gates its declared state, and signs its full digest without claiming to re-drive or authenticate the underlying observations. The phase-006 executor contract remains `substrateImportsReal: true`. No shared or sibling implementation was changed. The focused suite uses the real authorization audit and proves that a self-consistent forged parity receipt without a corresponding authorized transition is blocked. It also proves that caller-supplied certificate fields and versions cannot replace authenticated values or expand a closed signed shape. The committed unresolved-risk regression now proves that one risk, multiple risks, and an empty identifier alongside a valid identifier all block an otherwise passing gate and suppress certificate issuance; the genuine empty-risk control still passes. This closes the CHK-020 traceability gap between the documented disposition fold and the shipped suite. Lifecycle labels retain CHK-019's distinct authenticated-identity guarantee; ADR-003 records that five extended categories cannot gain per-kind semantic binding until the substrate defines corresponding evidence kinds.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Authenticate each parity attestation and stream as one real allowed transition | Separate or self-reported matches could let a forged receipt combine unrelated evidence |
| Cross-check the certificate version tuple inside `evaluateParity` | The parsed parity receipts carry the exact event-schema, reducer, and projection versions; the certificate verifier does not expose an equivalent three-field tuple |
| Cross-check drill-owned certificate fields inside `evaluateRollback` | A verified drill must be the authority for its candidate, verifier, classification, and rollback-asset facts |
| Cross-check authority epoch and envelope version inside `evaluateCertificates` | Offline-verified transition receipts and projection events expose those exact values |
| Validate and reconstruct the four-field `versions` object | Closed-key admission blocks caller extras, while field-by-field assembly prevents an open spread from expanding signed evidence |
| Compare complete canonical resume semantics | Scalar agreement can hide branch, effect, compatibility, or invalidation drift; a whole-view digest makes every comparable field fail closed |
| Authenticate lifecycle rows by exact digest pair and require unique columns | A relabeled row or independently mixed digest values must not satisfy ten lifecycle stages |
| Defer per-kind lifecycle semantics until the substrate defines them | Five extended lifecycle categories have no dedicated fixture, transition, or artifact vocabulary; inventing a mapping would create false evidence semantics |
| Count rollback executions by connected `executionId` and `certificateDigest` identity | Repeated or ambiguous rows must not manufacture five authoritative executions |
| Re-derive migration-certificate provenance through the real mode gate | Internal digest consistency proves shape, not authentic issuance from the bound evidence |
| Convert caller canonicalization exceptions into typed denials | Malformed evidence is an invalid request, not an exceptional escape from the fail-closed decision contract |
| Cross-check the request anchor against the reverified certificate | The certificate already authenticates the real rollback-drill anchor, so a second caller-selected anchor is neither necessary nor safe |
| Keep `windowClosed` structurally false in this leaf | Meeting the minimum makes the window eligible for phase-014 consideration; this leaf has no closure authority |
| Require external authorization for all four recovery operations | A quarantined or degraded mode must not approve its own rollback, unquarantine, verifier replacement, or authority restoration |
| Emit readiness and rollback evidence without mutating authority | This preserves the additive-dark boundary and leaves cutover and restoration to phase 014 |
| Reject count changes and destructive intent before authorization | Non-destructive preservation is a precondition, not a post-hoc assertion |
| Allow only migration-ready resume values | Agreement is insufficient when both paths agree on an unsafe result; `pin-old-runtime` cannot certify the installed candidate |
| Bind all retention assertions to external authorization | Reusing an authorization with different counts must fail before the gateway decision is consumed |
| Source authoritative retention counts in phase 014 | This switch has no ledger or artifact-store handle, and neither authenticated input exposes complete retained totals |
| Source rollback policy and authority fields from the gateway decision | Request labels can describe evidence, but only the real allow decision authenticates the policy and authority under which the rollback was approved |
| Bind the complete claimed authority snapshot and configuration version | A prepared authorization request must not be reusable with changed certificate-facing caller claims |
| Canonicalize and cross-check the Deep Research ledger writer | External authorization must not turn an untrusted coordinator resource identity into authority to fence an unrelated writer |
| Bind the complete stale writer lease | A replayed authorization must not substitute another lease, even for the same canonical resource |
| Validate the complete stale writer lease | Malformed identities or timestamp relations must not earn positive corroborating certificate evidence |
| Require strict stale-token supersession | A certificate must prove the bound predecessor token is below the rollback token actually issued by the coordinator, not merely observe that no lease remains active after release |
| Defer historical grant identity to phase 014 | The coordinator exposes current lease and token high-water state but no supported historical token-to-grant lookup |
| Record the writer resource digest in the certificate | A bare fence token cannot prove which resource the coordinator fenced |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest suite | PASS: 1 file, 77 tests, up from the 74-test baseline |
| Runtime TypeScript build | PASS: zero diagnostics |
| Self-authorized recovery | PASS: a mode-supplied proof and the explicit `self-authorized-recovery` capability are denied by the real gateway policy for all four operations; the externally authorized control reaches real fencing |
| Forged parity input | PASS: self-consistent green receipt without authorized ledger evidence is blocked |
| Migration-certificate provenance | PASS: an invented self-consistent certificate is rejected; the certificate re-issued from genuine gate evidence is accepted |
| Malformed caller evidence | PASS: circular and non-finite values on each of `gateCertificate`, `resumeEvidence`, and `staleWriterLease` resolve to typed denials with null certificates; none rejects its promise, and all well-formed controls authorize |
| Rollback-anchor equality | PASS: a genuine reverified certificate paired with a different externally authorized top-level anchor is denied as `EVIDENCE_INCOMPLETE` |
| Mode-certificate issuance | PASS: all five real evidence buckets produce a non-null certificate with exact bound fields; a missing or stale bucket blocks issuance |
| Unresolved-risk pass blocker | PASS: single, multiple, and empty-plus-valid unresolved-risk arrays each produce a non-pass `blocked` verdict with a null certificate from otherwise-ready input; the empty array control still passes with a non-null certificate |
| Version evidence binding | PASS: fabricated event-schema, reducer, projection, and combined tuples yield parity `EVIDENCE_STALE` with no certificate; the exact receipt-carried tuple passes and is signed |
| Version closed shape | PASS: caller-supplied extra keys block issuance; a staged-enumeration regression proves certificate assembly extracts only the four contractual fields; the genuine four-field control passes |
| Health aggregate binding | PASS: changing severity, observation, active signals, policy version, and policy digest under the same `aggregateId` changes both disposition and certificate digests; a post-certificate swap is denied while the unchanged control authorizes |
| Rollback-window input binding | PASS: two distinct execution/certificate sets that produce the same public window summary have different evaluation digests |
| Evidence-authentication audit | PASS: every consumed object and signed field is mapped to a real verifier, authenticated cross-check, deterministic derivation plus full binding, or ADR-003/004/005 substrate boundary |
| Drill-fact evidence binding | PASS: independently altered candidate SHA, verifier identity, verifier version, rollback anchor, and classification digest yield rollback-readiness `EVIDENCE_STALE` with no certificate; the exact matching evidence set passes |
| Receipt/event evidence binding | PASS: altered authority epoch and event-envelope version yield certificate-bucket `EVIDENCE_STALE` with no certificate |
| Rollback operation enum | PASS: `not-a-real-operation` is denied as `UNKNOWN_STATE` before certificate issuance |
| Lifecycle evidence identities | PASS: one fabricated identity relabeled ten times, one genuine identity relabeled ten times, and one distinct unrecognized identity all block; ten unique identities derived from ready parity, certificate, and sealed evidence pass |
| Resume full-structure parity | PASS: safe branch-only, effect-only, compatibility-only, and full invalidation-only ledger drift yield `RESUME_INVALID`; structurally equal safe decisions remain ready |
| Resume safe-value gate | PASS: agreed `blocked`, agreed `reject`, unsafe component/branch/effect values, and safe-value scalar disagreement yield `RESUME_INVALID` with no certificate; `compatible` plus `restart` passes when every bucket is ready |
| Retained-count authorization binding | PASS: matching 9-event/6-artifact assertions authorize; replaying the same request with 777 retained events is denied as `EVIDENCE_INCOMPLETE` |
| Rollback certificate field sources | PASS: gateway-authorized false caller labels cannot replace the real `authority_state` or `policy_version`; the unchanged control records the real state, epoch, and policy |
| Rollback claim digest binding | PASS: post-authorization changes to either the claimed authority state or configuration version are denied as `EVIDENCE_INCOMPLETE` |
| Writer-resource authorization binding | PASS: an exact authorization replay with another writer resource is denied as `EVIDENCE_INCOMPLETE`; a freshly authorized unrelated writer is denied as `WRITER_FENCE_FAILED` |
| Stale-lease authorization binding | PASS: substituting another stale lease for the same canonical writer is denied as `EVIDENCE_INCOMPLETE` |
| Stale-writer lease structure | PASS: wrong-typed fields, empty or non-string opaque identities, unparseable timestamps, and non-monotonic timestamps are denied as `WRITER_FENCE_FAILED` |
| Stale-writer supersession | PASS: a gateway-authorized token at or above rollback token `N` is denied as `WRITER_FENCE_FAILED`; a well-formed caller-attested predecessor below `N` authorizes and records the honestly scoped `staleWriterDenied: true` result |
| Live-writer contention | PASS: a live competing holder still prevents rollback-lease acquisition and yields `WRITER_FENCE_FAILED` before certificate issuance |
| Fenced-resource certificate evidence | PASS: authorized positive controls record the canonical Deep Research ledger-writer `resourceDigest` beside the real fence token |
| Gate-input disposition table | PASS: missing rows map to `blocked`, `not_ready`, `blocked`, `blocked`, and `rollback_required` |
| Lifecycle missing-evidence disposition | PASS: insufficient authenticated lifecycle sources use the same `blocked` mapping as every other lifecycle failure |
| Window minimum | PASS: repeated execution IDs or certificate digests count once; five distinct identities at 14 days become eligible while incomplete and abstained runs do not count |
| Non-destructive rollback | PASS: truncation, sealed-artifact rewrite, and non-reproduction-as-proof are rejected |
| Split-brain | PASS: a live competing writer is denied by real coordinator contention, and a stale epoch is denied by the real gateway after simulated restoration |
| Strict spec validation | PASS after metadata regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No authority transition occurs here.** Phase 014 must independently verify the migration certificate and authorize any cutover or restoration.
2. **Eligibility does not close the rollback window.** Even after both minimums are met, this module reports `eligible_to_close` with `windowClosed: false`.
3. **Legacy retirement remains forbidden.** Ledger events, sealed artifacts, legacy readers, and rollback assets remain retained through the later policy-controlled window.
4. **Authoritative retained-count sourcing is a wiring responsibility.** This leaf authenticates the exact count assertions but cannot observe the real ledger or artifact store; phase 014 must source both totals directly before authorization.
5. **Lifecycle evidence is identity-bound, not fully behavior-bound.** CHK-019 authenticates distinct evidence identities, but the frozen substrate has no dedicated kinds for five extended lifecycle categories. ADR-003 defers semantic per-kind binding until those kinds exist.
6. **Health state authenticity is deferred.** This leaf gates the declared state and signs the full aggregate digest, but it has no signed observation source from which to re-derive that aggregate. ADR-004 assigns authoritative health provenance to phase 014 or a substrate enhancement.
7. **Resume and rollback-window provenance remain integration boundaries.** Resume evidence is fully bound and safe-value checked without a signed resume reference; rollback-window input is fully signed and deduplicated without a historical certificate store. ADR-005 requires authoritative sourcing before phase-014 consumption.
8. **Historical stale-lease identity is an integration boundary.** The complete caller tuple is validated, internally checked, and digest-bound, and its token must be strictly superseded by a real coordinator token. This leaf cannot authenticate the historical lease ID or owner because the coordinator exposes no supported per-token grant-history lookup; ADR-007 assigns correlation to phase 014.
<!-- /ANCHOR:limitations -->
