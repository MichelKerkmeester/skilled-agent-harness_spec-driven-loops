---
title: "Decision Record: Authenticated Certificate Boundaries"
description: "Records every request and certificate evidence source plus the retained-count, lifecycle, health, resume, and rollback-window authenticity boundaries."
trigger_phrases:
  - "Deep Research retained count boundary"
  - "rollback count authorization binding"
  - "phase-014 deletion verification wiring"
  - "Deep Research lifecycle semantic binding"
  - "Deep Research health aggregate authenticity boundary"
  - "Deep Research complete evidence authentication audit"
  - "Deep Research rollback request field binding audit"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-23T05:57:57Z"
    last_updated_by: "codex"
    recent_action: "Made rollback requests exception-safe and cross-checked the authenticated anchor"
    next_safe_action: "Wire phase 014 to source counts from the real ledger and artifact store"
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
      - "Neither authenticated gate input contains authoritative retained ledger-event and artifact-store totals."
      - "Shared-contract and write-set digests are the only caller descriptors without a same-evaluation aggregate evidence source."
      - "No signed health observations, resume reference, or historical rollback-window certificate store are available to this leaf."
      - "The Deep Research ledger writer has one fixed canonical protected-resource identity in this leaf."
      - "The coordinator exposes no supported historical token-to-grant lookup, so lease ID and owner authenticity remain a phase-014 integration boundary."
      - "The rollback request anchor is cross-checked against the reverified migration certificate's authenticated anchor."
---
# Decision Record: Authenticated Certificate Boundaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bind retention assertions and keep store observation at the wiring boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research mode-gate implementation owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The rollback switch receives four caller-reported retention counts but has no ledger or artifact-store handle. Its authenticated classification manifest commits frozen in-flight state rows, not retained event or artifact totals. The re-derived migration certificate commits selected stream and artifact evidence digests, not complete retained-store counts. Treating either quantity as the missing totals would give unrelated evidence a stronger meaning than its contract supports.

### Constraints

- The switch may use only its transition gateway and fencing coordinator; shared substrate and exported request shapes remain unchanged.
- A reused authorization must not validate a rollback request whose retention assertions changed.
- Authoritative deletion verification must observe the actual ledger and artifact store at the phase-014 wiring boundary.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Bind all four before-and-after retention counts into the evidence digest authorized by the real transition gateway, while requiring phase 014 to source those values from the real ledger and artifact store.

**How it works**: The mode-local switch rejects changed counts when they do not match the gateway-authorized digest, so an authorization cannot be replayed with different retention claims. This leaf authenticates the recorded assertions but does not relabel them as direct store observations. Phase 014 must obtain the counts from the authoritative stores before constructing the rollback request.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bind assertions and require real-store sourcing in phase 014** | Prevents replay and preserves the current module boundary | Needs explicit wiring in the cutover layer | 9/10 |
| Treat classification row counts as retained event counts | Requires no new wiring | Confuses in-flight state rows with append-only ledger events | 1/10 |
| Treat migration-certificate artifact digests as the full retained artifact count | Uses authenticated data already present | Counts only selected gate evidence, not the artifact store | 2/10 |
| Add ledger and artifact-store handles to this switch | Enables direct observation here | Breaks the locked boundary and expands the leaf into shared wiring | 5/10 |

**Why this one**: It closes authorization replay without fabricating evidence semantics or breaking downstream shapes, and it places authoritative observation where the real stores are available.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The signed authorization now commits the exact four retention assertions used by the rollback certificate.
- Changing any retained count requires a fresh external authorization.

**What it costs**:
- The switch alone cannot prove the reported totals came from the stores. Mitigation: phase 014 must read the real ledger and artifact store and supply those observed totals.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A wiring caller supplies invented but self-consistent counts before authorization | High | Phase 014 sources counts directly from both authoritative stores before requesting authorization |
| Selected evidence counts are mistaken for retained-store totals | High | Keep the semantic boundary explicit in this record and the implementation summary |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The same authorization previously accepted changed retention assertions |
| 2 | **Beyond Local Maxima?** | PASS | Classification, certificate, and direct-store options were compared |
| 3 | **Sufficient?** | PASS | Digest binding closes replay while one explicit wiring obligation covers provenance |
| 4 | **Fits Goal?** | PASS | The change strengthens non-destructive rollback without moving authority |
| 5 | **Open Horizons?** | PASS | Phase 014 can add real-store sourcing without changing this module's public shapes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `rollback-switch.ts` includes all four retained-count fields in the gateway-bound evidence digest.
- The focused test reuses one valid authorization request with altered counts and expects a fail-closed denial.
- Phase 014 must construct these fields from direct ledger and artifact-store observations.

**How to roll back**: Revert the four digest fields, the altered-replay regression, and this boundary record together; doing so reopens authorization replay and is not a safe production rollback.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Bind every signed field to verified evidence or an explicit descriptor boundary

### Decision

The migration certificate may contain a caller-supplied value only when the same evaluation either cross-checks it against verified evidence or records that no corresponding aggregate evidence exists in the evaluated buckets. Deterministic constants and evaluator-derived fields remain implementation-owned. A mismatch in a field with verified evidence fails closed and prevents certificate issuance.

### Certificate field source map

| Signed field | Source and binding |
|---|---|
| `schemaVersion` | Implementation constant `DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION` |
| `certificateKind` | Implementation constant `mode-migration-readiness` |
| `mode` | Implementation constant `deep-research`; parity and rollback verifiers independently require the same mode |
| `readiness` | Implementation constant; emitted only after all five dispositions are ready |
| `candidateSha` | Cross-checked against the verified rollback-drill certificate `facts.candidateSha` |
| `baseSha` | Cross-checked against both parsed parity gate input and parity manifest |
| `sharedContractDigest` | Free descriptor, intentionally unbound because no evaluated bucket exposes the aggregate shared-contract digest |
| `writeSetDigest` | Free descriptor, intentionally unbound because no evaluated bucket exposes the aggregate write-set digest |
| `versions.eventEnvelopeVersion` | Cross-checked against every offline-verified projection event's `envelope_version` |
| `versions.eventSchemaVersion` | Cross-checked against every parsed parity receipt |
| `versions.reducerVersion` | Cross-checked against every parsed parity receipt |
| `versions.projectionVersion` | Cross-checked against every parsed parity receipt |
| `fixtureIds` | Derived from the verified parity receipt set |
| `streamDigests` | Derived from authorized parity receipts whose stream and attestation are matched in the authorization audit |
| `artifactDigests` | Derived from sealed artifacts returned by the real artifact reader |
| `receiptDigests` | Derived from authorized parity receipts and the offline-verified certificate bundle |
| `runCertificateDigest` | Derived from the offline certificate verifier result |
| `replayFingerprint` | Derived from the offline certificate verifier result |
| `verifierIdentity` | Cross-checked against verified rollback-drill `facts.verifierIdentity` |
| `verifierVersion` | Cross-checked against the verified rollback-drill certification envelope `verifier_version` |
| `authorityState` | Closed constant `legacy_authoritative`; top-level validation and parity authorization audit require the same state |
| `authorityEpoch` | Cross-checked against every offline-verified transition receipt's `facts.authorityEpoch` |
| `rollbackAnchorDigest` | Cross-checked against verified rollback-drill `facts.bindings.rollbackAsset` |
| `rollbackWindow` | Deterministically derived from validated rows; `evaluationDigest` also binds the canonical digest of the complete input, while ADR-005 records the absent historical certificate store |
| `dispositions` | Derived from the five evaluators; rollback readiness binds verified drill facts plus the canonical digest of the complete health aggregate, with health provenance bounded by ADR-004 |
| `unresolvedRiskIds` | Sorted input that must be empty before a pass; ADR-005 records that this leaf has no authoritative risk registry against which to prove completeness |
| `authorityMutation` | Closed implementation constant `false` |
| `rollbackWindowClosed` | Closed implementation constant `false` |
| `cutoverCertificate` | Closed implementation constant `false` |
| `certificateDigest` | Recomputed from canonical bytes of every preceding certificate-core field |

### Consequences

- A contradictory candidate SHA, verifier identity, verifier version, authority epoch, rollback anchor, classification digest, or envelope version now withholds the certificate.
- The two intentionally unbound descriptors remain visible rather than being assigned false provenance. Phase 014 must supply them from its pinned integration contract when it consumes this readiness certificate.
- The retained-count store-observation boundary in ADR-001 is unchanged.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Accept identity-authenticated lifecycle coverage without unsupported semantic binding

### Context

The lifecycle matrix requires ten unique rows and authenticates each exact `(eventDigest, receiptDigest)` identity against ready parity receipts, verified transition receipts, or verified sealed artifacts. That proves evidence identity and uniqueness, which is the property recorded by CHK-019. It does not prove that a cited identity originated from the behavior named by the row's `kind` label.

The frozen substrate has no dedicated fixture, transition, or artifact kind for `crash-resume`, `source-refresh`, `quarantine`, `contradiction`, or `incomplete-run`. The available Deep Research transition and artifact vocabularies cover only the basic init, gather, analyze, convergence, synthesis, and memory-save behaviors, while the shadow-parity lifecycle event map uses a separate stage vocabulary. Binding the five extended labels inside this leaf would therefore require invented semantics or shared-substrate changes.

### Decision

Accept the CHK-019 property as the leaf boundary: every lifecycle row must use a distinct authenticated evidence identity, but the five extended lifecycle categories are not semantically bound to dedicated behavior evidence. Do not infer a per-kind mapping from unrelated transition, artifact, or shadow-stage labels.

Per-kind semantic binding is deferred to a future leaf or phase that adds dedicated fixture, transition, or artifact kinds for those categories. Until that substrate exists, rotating authenticated identities among lifecycle labels is a known, substrate-bounded limitation rather than an in-leaf correctness claim.

### Consequences

- Fabricated, duplicated, mixed, or unauthenticated lifecycle identities remain fail-closed.
- The matrix cannot detect a permutation of distinct authenticated identities among the ten `kind` labels.
- No shared substrate, public type, or sibling implementation changes are introduced by this decision.
- Future semantic binding must extend the substrate vocabulary first, then add an explicit kind-to-evidence verifier without weakening CHK-019's identity and uniqueness checks.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Bind the complete health aggregate and defer observation authenticity

### Context

The health-degeneration substrate derives `HealthAggregate` values through `HealthObservationProjector` or `replayHealthObservations`, but the mode gate receives only the aggregate. It receives no ordered `HealthBoundaryInput[]`, signed health observation, projector state, or authenticated health reference. The authorized-ledger audit, parity receipts, sealed artifacts, offline run certificate, classification manifest, and rollback-drill certificate contain no health digest to cross-check.

The prior rollback-readiness digest included only `aggregateId`. A caller could therefore change `observationId`, `severity`, `activeSignalIds`, `policyVersion`, or `policyDigest` without changing the signed readiness evidence.

### Decision

Require the declared aggregate state to remain `healthy` or `recovered`, and bind `SHA-256(canonicalBytes(healthAggregate))` into the rollback-readiness disposition. Because dispositions are included in the mode-migration certificate core, the complete aggregate becomes tamper-evident and a post-certificate aggregate swap fails certificate provenance re-verification.

Do not claim that this leaf independently proves the declared health state reflects real observations. Authoritative health authenticity is deferred to phase 014 or a substrate enhancement that supplies signed observations, authenticated projector state, or a signed aggregate reference that the gate can re-derive or verify.

### Consequences

- Every canonical aggregate field now affects the readiness disposition and final certificate digest.
- `degraded`, `critical`, `warning`, `observing`, and `not_evaluable` still yield `HEALTH_NOT_GREEN`.
- A fully fabricated but internally well-formed green aggregate can still pass initial state gating; this is an explicit substrate boundary rather than verified health provenance.
- Phase 014 must not treat the green string alone as authoritative health evidence.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Close both certificate evidence audits with explicit substrate boundaries

### Context

A field-by-field review covered every input consumed across the five gate buckets and every field included in both the migration certificate and rollback certificate. Most values are authenticated by the real audit, artifact reader, offline certificate verifier, classification verifier, rollback-drill verifier, transition authorization decision, fencing coordinator, or a cross-check against those outputs. Four migration-readiness classes lack an authoritative source in the evaluated bundle: aggregate shared-contract and write-set descriptors, resume-evidence provenance, rollback-window history, and authoritative risk-set completeness. Lifecycle label semantics remain the separate ADR-003 boundary.

The rollback certificate formerly copied `policyVersion` and `fromAuthorityState` from raw request fields even though the successful gateway result exposed the verified `policy_version` and `authority_state`. Its evidence digest also omitted those request claims, allowing a previously prepared authorization request to be paired with changed labels. The same audit found that the authority epoch could be sourced directly from the verified decision instead of relying only on the request cross-check.

### Decision

Use the following evidence-source map as the gate's complete authentication contract.

| Evidence input | Authentication, binding, or boundary |
|---|---|
| Parity manifest | Parsed parity receipts are verified against the manifest; required Deep Research case IDs must equal receipt fixture IDs |
| Parity mode-gate input | `parseDeepResearchModeGateInput` verifies its closed shape and digest; BASE and manifest digest are cross-checked |
| Parity receipts | `parseDeepResearchParityReceipt` verifies receipt and parity-certificate structure; every stream/attestation pair must match a real allowed authorization-audit entry |
| Authorization-audit locator | `readAuthorizationAudit` reads the immutable audit substrate; its head and matched authorized evidence enter the parity disposition digest |
| Sealed store and bindings | `readDeepResearchArtifact` verifies every binding, descriptor, content digest, and required lifecycle artifact |
| Certificate verification input | `verifyDeepResearchCertificateOffline` verifies receipts, artifact bindings, and deterministic replay; parsed receipt and event facts cross-check epoch and envelope version |
| Lifecycle event/receipt identities | Each exact pair must come from a ready authenticated parity receipt, verified transition receipt, or verified sealed artifact; rows and resume evidence are bound in full |
| Lifecycle `kind` and `fixtureId` labels | Identity and uniqueness are enforced, but per-label semantics lack dedicated substrate kinds; ADR-003 is authoritative for this boundary |
| Resume evidence | Legacy and ledger must have equal canonical semantic digests over decision constants and dispositions, complete compatibility/branch/effect structures, all invalidation fields, the complete lease, forensic and artifact digest sets, event-tail digest, and fresh-projection fingerprint. Arrays are sorted by canonical stable keys. Path-local decision IDs/digests, branch attempt IDs, and explanatory `decisionReason` prose are excluded because the two adapters may generate different envelopes or wording for the same action. Both sides still pass the migration-ready allowlist, and the complete original evidence remains bound into the lifecycle disposition. No signed resume reference exists in the bundle, so origin authenticity is deferred to phase 014 |
| Phase-014 rollback evidence | `verifyPhase014RollbackEvidence` verifies the HMAC certificate; candidate, verifier, classification, and rollback-asset facts are cross-checked |
| Classification manifest | `verifyClassificationManifest` verifies its self-digest and the verified rollback-drill certificate cross-checks `finalDigest` |
| Rollback anchor | Format-checked and cross-checked against verified rollback-drill `facts.bindings.rollbackAsset` |
| Health aggregate | State-gated and bound by its full canonical digest; observation authenticity is the ADR-004 boundary |
| Rollback-window input | Validated and deduplicated by connected execution/certificate identity; the evaluation digest binds the full canonical input, but no historical certificate store authenticates those executions |
| Shared-contract and write-set digests | Signed descriptors with no same-evaluation aggregate source; phase 014 must supply them from its pinned integration contract |
| Unresolved risk IDs | A pass requires an empty list and signs that result; no authoritative risk registry exists in this leaf to prove omission-free completeness |

The rollback certificate uses the following complete field-source contract.

| Rollback certificate field | Authenticated source, binding, or derivation |
|---|---|
| `schemaVersion` | Derived constant `DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION` |
| `certificateKind` | Derived constant `non-destructive-rollback` |
| `mode` | Derived constant `deep-research`; the authorization request is independently required to use the same mode |
| `operation` | Caller value restricted to the closed operation enum and included in the gateway-authorized evidence digest |
| `policyVersion` | Serialized from `authorization.decision.policy_version`; the caller's `configurationVersion` claim is independently included in the authorized evidence digest |
| `decisionId` | `authorization.decision.decision_id` from the real gateway allow decision |
| `requestDigest` | `authorization.decision.request_digest` from the real gateway allow decision |
| `evidenceDigest` | `authorization.decision.evidence_digest`, after exact equality with the locally re-derived complete evidence digest |
| `rollbackReason` | Included in the gateway-authorized evidence digest |
| `fromAuthorityState` | `authorization.decision.authority_state` from the real gateway authority provider; the caller's state claim is also included in the authorized evidence digest |
| `fromAuthorityEpoch` | `authorization.decision.authority_epoch`; the caller epoch is bound into the evidence digest and cross-checked against `authorizationRequest.authorityEpoch` before authorization |
| `restoredAuthorityState` | Derived constant `legacy_authoritative` |
| `restoredAuthorityEpoch` | Deterministically derived as the gateway decision's `authority_epoch + 1` |
| `writerFenceToken` | Real `FencedLeaseCoordinator.acquire` output after the acquired lease passes `withFence` |
| `writerResourceDigest` | Canonical digest of the fixed Deep Research ledger-writer identity; the request value is gateway-bound and cross-checked before coordinator access |
| `classificationDigest` | Verified classification manifest `finalDigest`, included in the gateway-authorized evidence digest |
| `resumeEvidenceDigest` | Canonical digest of the complete resume evidence, included in the gateway-authorized evidence digest |
| `rollbackAnchorDigest` | Format-checked, cross-checked against the reverified migration certificate's authenticated anchor digest, and included in the gateway-authorized evidence digest |
| `retainedEventCount` | Post-rollback count included with both before/after values in the authorized digest; equality is required before authorization |
| `retainedArtifactCount` | Post-rollback count included with both before/after values in the authorized digest; equality is required before authorization |
| `admissionFrozen` | Derived constant `true`, emitted only after the request admission state is verified as `frozen` |
| `staleWriterDenied` | Derived constant `true`, emitted only when the gateway-bound caller-attested lease is well-formed, names the fixed canonical writer resource, and carries a positive safe token strictly below the rollback token returned by the real coordinator; historical lease ID and owner authenticity are the ADR-007 boundary |
| `eventDeletionCount` | Derived constant `0`, guarded by destructive-intent rejection and equal retained event counts |
| `artifactRewriteCount` | Derived constant `0`, guarded by destructive-intent rejection and equal retained artifact counts |
| `authorityMutation` | Derived constant `false` |
| `phase014RestorationRequired` | Derived constant `true` |
| `certificateDigest` | Recomputed from canonical bytes of every preceding rollback-certificate core field |

No rollback-certificate field remains sourced from unauthenticated raw caller input. Authenticated fields come from the gateway or fencing substrate, caller facts are bound into the gateway-authorized evidence digest, and the remaining fields are constants or deterministic derivations. Migration-readiness provenance boundaries remain named above or in ADR-003/ADR-004.

### Consequences

- Different health aggregates and different rollback-window evidence cannot reuse one migration certificate even when their public state summaries match.
- Any semantic legacy-versus-ledger resume divergence now withholds readiness, including branch, effect, compatibility, and invalidation-only drift.
- A caller cannot change the claimed authority state or configuration version after authorization, and cannot make the certificate report either claim instead of the gateway decision.
- The rollback certificate's authority epochs now derive from the gateway decision; the request epoch remains both bound and cross-checked.
- Resume, window-history, descriptor, lifecycle-label, and risk-set authenticity remain visible integration obligations rather than implicit trust claims.
- Phase 014 must verify those bounded sources before treating readiness evidence as sufficient for an authority decision.
- No shared substrate changes are required. The exported rollback certificate gains one additive resource-digest field; no downstream exact-shape consumer exists outside this leaf.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Bind every consequential rollback request field

### Context

The rollback certificate audits covered output provenance, but the request boundary lacked an equivalent field-by-field proof. `writerResource` and `staleWriterLease` reached the real fencing coordinator without entering the gateway-authorized evidence digest. An exact gateway retry could therefore preserve the authorization decision while changing which resource was fenced, and the certificate recorded only a fence token.

The coordinator retains a per-resource token high-water mark across release and allocates every new grant above it. The prior post-release `withFence` call did not prove supersession: after release, the coordinator had no active lease, so both a displaced predecessor and an arbitrary non-current tuple were rejected. That made the certificate's stale-writer result tautological.

Caller-controlled certificate, resume, and lease evidence also reaches the frozen canonical serializer. That serializer intentionally rejects circular references, forbidden keys, non-plain objects, non-finite numbers, and structural limits by throwing. Those exceptions are validation outcomes at this boundary, not reasons for `requestRollback` to reject its promise or bypass the fail-closed decision contract.

### Decision

Canonicalize the requested writer resource, require it to equal the fixed Deep Research ledger-writer identity, require the stale lease to name that same resource, and validate every required lease field before authorization. `leaseId`, `ownerId`, and `correlationId` must pass the frozen opaque-identity validator. `acquiredAt`, `renewedAt`, and `expiresAt` must be parseable timestamps ordered as `acquiredAt <= renewedAt < expiresAt`. Bind both the canonical resource digest and the complete validated stale-lease digest into the authorization evidence, and record the resource digest in the rollback certificate.

Contain the complete caller-input validation and canonicalization phase inside a fail-closed boundary. Invalid gate-certificate canonicalization yields the existing absent-certificate denial; malformed resume, classification, resource, lease-digest, or aggregate evidence yields `EVIDENCE_INCOMPLETE`; structural stale-lease validation retains `WRITER_FENCE_FAILED`. Snapshot the validated primitives and canonical resource before authorization so the gateway, fencing, and certificate phases do not re-read caller-owned evidence. Gateway exceptions remain `GATEWAY_FAILURE`, and coordinator exceptions remain `WRITER_FENCE_FAILED`.

After the real coordinator acquires rollback token `N`, require the bound stale token to be a positive safe integer strictly below `N`. A token equal to or above `N` is not superseded and fails as `WRITER_FENCE_FAILED`. The certificate attests only that the caller-attested predecessor is a well-formed, resource-matched, digest-bound tuple whose token is strictly superseded by the coordinator-issued rollback token. It does not authenticate that the caller's historical `leaseId` or `ownerId` was the grant issued for that token; ADR-007 records that substrate boundary. The separate acquisition remains the split-brain boundary: a live competing writer prevents token `N` from being issued at all.

The complete request-field contract is:

| `DeepResearchRollbackRequest` field | Binding, authentication, or constant |
|---|---|
| `configurationVersion` | Token-format validated and bound into the gateway-authorized evidence digest; certificate policy still comes from the gateway decision |
| `operation` | Restricted to the closed four-value operation set and bound into the authorized digest |
| `currentAuthority` | State is allowlisted, epoch is a positive safe integer, both are bound, and certificate authority fields come from the gateway decision |
| `expectedAuthorityEpoch` | Must be a safe integer equal to `currentAuthority.epoch`; the authorization request epoch must equal the same bound epoch |
| `gateCertificate` | Closed constants and internal digest are checked inside an exception-safe boundary, then the real mode gate re-derives and returns the exact certificate; malformed canonical input is denied and the reproduced digest is authorization-bound |
| `gateInput` | Authenticated by re-executing `DeepResearchModeMigrationGate`; only an exact certificate reproduction is accepted |
| `authorizationRequest` | Mode, authority epoch, and evidence digest are cross-checked locally; the real gateway authenticates policy, authority, request identity, and retry semantics |
| `rollbackReason` | Required, length-bounded, authorization-bound, and copied into the certificate |
| `admissionState` | Validated closed value `frozen`; the certificate emits the derived constant `admissionFrozen: true` |
| `classificationManifest` | Verified by the real manifest verifier; `finalDigest` is authorization-bound and recorded in the certificate |
| `resumeEvidence` | Canonical digest of the complete evidence is computed inside the fail-closed caller-input boundary, authorization-bound, snapshotted, and recorded in the certificate |
| `writerResource` | Canonicalized, required to equal the fixed Deep Research ledger writer, bound by `resourceDigest`, matched to the stale lease, and recorded in the certificate |
| `staleWriterLease` | Required fields are type-validated and internally checked; opaque identities use the frozen validator, timestamps must be parseable and monotonic, malformed full-tuple canonicalization fails closed, the full tuple digest is authorization-bound, its canonical resource and token are snapshotted, its resource must match `writerResource`, and its token must be a positive safe integer strictly below the real coordinator-issued rollback token. Historical grant identity is not authenticated in-leaf |
| `destructiveIntent` | Validated closed value `none`; every destructive value is denied before authorization |
| `retainedEventCountBefore` | Non-negative safe integer, authorization-bound, and required to equal the after count |
| `retainedEventCountAfter` | Non-negative safe integer, authorization-bound, equality-checked, and recorded as the retained event count |
| `retainedArtifactCountBefore` | Non-negative safe integer, authorization-bound, and required to equal the after count |
| `retainedArtifactCountAfter` | Non-negative safe integer, authorization-bound, equality-checked, and recorded as the retained artifact count |
| `rollbackAnchorDigest` | 64-hex format checked, cross-checked against the reverified certificate's authenticated anchor digest, authorization-bound, and recorded in the certificate |

No declared request field is inert. Every field is now externally bound, authenticated or cross-checked against real evidence, or restricted to a validated closed value. Structurally malformed caller evidence resolves to a denied `DeepResearchRollbackDecision`; it does not escape as an uncaught serializer or validator exception.

### Consequences

- Replaying one authorization with another writer resource or stale lease fails as `EVIDENCE_INCOMPLETE` before the gateway decision can cause fencing.
- A freshly authorized but noncanonical writer identity fails as `WRITER_FENCE_FAILED` before coordinator access.
- Wrong-typed, empty-identity, unparseable-timestamp, or non-monotonic caller-attested leases fail as `WRITER_FENCE_FAILED` before authorization.
- A gateway-authorized arbitrary token equal to or above the rollback token fails as `WRITER_FENCE_FAILED`; a well-formed caller-attested predecessor can pass only when the new rollback token strictly supersedes it.
- A live competing writer still fails through the coordinator's acquisition-contention path before any supersession result or certificate exists.
- The certificate identifies the fenced resource by canonical digest, so a fence token cannot be interpreted without its resource identity.
- Circular and non-finite gate-certificate, resume, and stale-lease evidence resolve to fail-closed denials while well-formed controls still authorize.
- A top-level rollback anchor cannot differ from the anchor authenticated by the reverified migration certificate, even when the differing request value has its own external authorization.
- The retained-count sourcing boundary remains ADR-001, and the lifecycle-kind semantic boundary remains ADR-003.
- Shared fencing and authorization substrates remain unchanged; the leaf stays additive-dark.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Accept historical lease identity as a phase-014 substrate boundary

### Context

The real `FencedLeaseCoordinator` exposes acquisition, renewal, release, fenced execution, current-state inspection, storage paths, and bounded telemetry. Its supported inspection result contains the active lease, durable `lastFenceToken`, generation, journal-head hash, and expiry state. It exposes no supported lookup that maps a historical fence token to the `leaseId`, `ownerId`, or `correlationId` originally issued for that token. After the rollback switch releases its own lease, `activeLease` is null and the durable high-water token remains.

The leaf can therefore authenticate the fixed writer resource and prove that the real coordinator issued rollback token `N` above the caller-attested predecessor token. It can also type-validate, internally check, and authorization-digest-bind the complete caller tuple. It cannot prove that the historical identity fields belonged to the grant originally issued for the predecessor token without reaching beyond the supported in-leaf coordinator contract.

### Decision

Accept historical grant identity as an explicit integration boundary. `staleWriterDenied: true` attests that the caller-attested predecessor lease is a well-formed, resource-matched, digest-bound tuple whose positive fence token is strictly below the rollback token issued by the real coordinator. It does not attest that the supplied historical `leaseId`, `ownerId`, or `correlationId` was the genuine grant identity for that token.

Phase 014 must correlate the attested tuple with authoritative coordinator or ledger history before treating historical identity as authenticated, just as ADR-001 requires real-store observation for retained counts. The lifecycle-kind boundary in ADR-003 remains unchanged.

The anti-split-brain safety property does not depend on this certificate attestation. The coordinator independently checks durable current-lease state for guarded mutation, renewal, and release, and its acquisition-contention path prevents rollback token issuance while a live writer holds the resource. The certificate field is corroborating evidence, not the mutation-safety mechanism.

### Consequences

- Malformed or internally inconsistent lease values cannot earn a positive stale-writer result.
- A well-formed tuple with invented historical identity fields can still satisfy this leaf when its resource and superseded token are valid; phase 014 owns historical correlation.
- The certificate now states exactly what the leaf verifies without weakening the real coordinator fence.
- No locks-and-fencing source, public coordinator API, or rollback-certificate shape changes.
<!-- /ANCHOR:adr-007 -->
