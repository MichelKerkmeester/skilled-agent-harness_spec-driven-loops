---
title: "Decision Record: Verified Ownership for Named Artifact Claims"
description: "Records fail-closed Deep Alignment provenance ownership, authority-liveness reads, and the accepted successor-owned boundary for every plain cross-artifact digest closure."
trigger_phrases:
  - "deep alignment named dependency ownership"
  - "finding authority digest binding"
  - "governed exception issuer verification"
  - "plain cross-digest closure boundary"
  - "deep alignment certificates receipts boundary"
  - "deep alignment authority liveness invariant"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
    last_updated_at: "2026-07-24T04:17:18Z"
    last_updated_by: "codex"
    recent_action: "Added the authority-liveness invariant for direct and provenance-bound reads"
    next_safe_action: "Leaf 004 must resolve every deferred plain cross-artifact digest before authority cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/deep-alignment-artifact-material.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/deep-alignment-sealed-artifacts.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-sealed-artifacts.vitest.ts"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Named digest claims require the exact dependency content digest, not a same-kind member"
      - "Exception issuer identity comes from the publisher on the exact authority dependency"
      - "A non-null authority rollback reference blocks direct and recursively bound reads"
      - "Every plain scalar or array digest that names another sealed artifact remains shape-checked here and requires leaf-004 closure"
---
# Decision Record: Verified Ownership for Named Artifact Claims

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bind Named Claims to Exact Verified Dependency Owners

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | Deep Alignment sealed-artifact FIX agent under the approved leaf scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

Finding evidence and governed exceptions carried security-relevant scalar claims, but validation proved only that digest
values had the right shape. The dependency walker recursively verified caller-supplied entries without proving that a
named scalar selected one of those verified entries. A fabricated authority or finding digest could therefore coexist
with an empty dependency list, and a real dependency of the expected kind could coexist with a scalar naming different
content. Exception issuer identity had the same gap because it came only from the exception under audit.

### Constraints

- The shared filesystem-backed sealer remains the only digest, descriptor, publication, and verified-read authority.
- The landed schema, shared review-loop contracts, golden modules, and frozen substrate remain unchanged.
- The adapter stays additive-dark and cannot modify legacy state or transfer runtime authority.
- Rejection must be typed and must publish or release zero artifact bytes.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat each named cross-artifact claim as an ownership assertion over one exact recursively verified
dependency, not as evidence that some dependency of a compatible kind is present.

**How it works**: The material parser applies this field map before publication:

| Material kind | Named field | Expected dependency owner | Match |
|---------------|-------------|---------------------------|-------|
| Finding evidence | `authorityDigest` | Authority capsule | Dependency `content_digest` equals the scalar |
| Governed exception | `findingDigest` | Finding evidence | Dependency `content_digest` equals the scalar |
| Governed exception | `authorityDigest` | Authority capsule | Dependency `content_digest` equals the scalar |
| Governed exception | `issuerId` | The authority capsule selected by `authorityDigest` | Verified capsule `publisherId` equals the scalar |

Parser-time checks reject a missing or wrong-digest owner. Seal-time and read-time dependency traversal then uses
`SealedArtifactStore.readVerified`, decodes the dependency through the registered Deep Alignment canonicalizer, checks
authority epoch and recursive dependencies, and compares material identity only after that verification succeeds.
This rule map is intentionally limited to the spec-mandated direct provenance fields; plain digest fields outside it remain
shape-checked values and are covered by ADR-002.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exact recursively verified owner** | Fails closed and reuses the real sealer | Named claims require explicit dependency wiring | 10/10 |
| Accept any dependency of the expected kind | Small check | A fabricated scalar still passes beside unrelated real content | 2/10 |
| Keep shape-only scalar validation | No compatibility change | Preserves the demonstrated false verification result | 0/10 |
| Add a mode-local digest or signature verifier | Could validate more policy locally | Forks the frozen integrity substrate and creates two authorities | 1/10 |

**Why this one**: Exact ownership is the smallest adapter-only change that makes the named claim reproducible while
preserving the shared store as the sole integrity authority.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- A finding cannot assert an authority digest unless that exact authority capsule is present and store-verified.
- An exception cannot assert a finding or authority digest unless each exact artifact is present and store-verified.
- An exception issuer cannot self-attest; it must match the verified publisher of its exact authority capsule.
- Recursive dependency corruption, absence, kind substitution, or mixed authority epoch still blocks the parent.

**What it costs**:

- Finding and exception writers must seal dependencies first and pass their exact references. Mitigation: the existing
  `deepAlignmentDependency` helper constructs the closed dependency entry.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later issuer-roster kind replaces authority publishers | M | Extend the declarative field map to the registered owner kind without changing the shared sealer |
| A caller supplies duplicate same-kind dependencies | L | Matching uses the exact content digest, and issuer identity is read from that exact authority dependency |
| Parser and recursive verifier drift | H | Both consume the same named-dependency rule map and the real-store unit controls |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four adversarial rejection tests reproduced false verification on the prior adapter |
| 2 | **Beyond Local Maxima?** | PASS | Membership-only and second-verifier alternatives were checked and rejected |
| 3 | **Sufficient?** | PASS | One declarative map drives parser and recursive verification without substrate changes |
| 4 | **Fits Goal?** | PASS | The change addresses only named cross-artifact referential integrity |
| 5 | **Open Horizons?** | PASS | New registered owner kinds can extend the map without changing digest or store semantics |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- The material module declares the four field-to-owner rules and rejects absent or wrong-digest dependency entries.
- The store adapter retains recursively verified dependency material and checks issuer identity against the exact
  authority dependency selected by `authorityDigest`.
- The real-store unit suite proves fabricated, mismatched, and correct bindings for findings and exceptions.

**How to roll back**: Revert the named-dependency rule map, recursive identity check, and matching tests together. The
shared store, landed schema, and legacy execution path need no rollback because they were not modified.
<!-- /ANCHOR:adr-001-impl -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Defer All Plain Cross-Artifact Digest Closure to Certificates and Receipts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | Deep Alignment sealed-artifact operator boundary decision |

<!-- ANCHOR:adr-002-context -->
### Context

This leaf seals the exact bytes of each Deep Alignment artifact through the shared phase-007 content-addressed store,
validates fields by artifact kind, shape-checks 64-hex digests, kind-checks its declared `SealedArtifactReference`
dependencies, and performs tamper-evident verified reads of material it seals. Some material also carries plain scalar or
array digests that name another sealed artifact by content digest. These values are typed `string` or `string[]`, are not
`SealedArtifactReference` fields, and are not members of this leaf's declared dependency-closure set.

The operator-accepted boundary therefore applies to every such plain cross-artifact digest field across all Deep Alignment
artifact kinds. A fabricated value, or a real artifact digest reused under the wrong artifact kind, can be shape-valid and
can be sealed and read as a value without proving the referenced artifact's existence, kind, or freshness. The same class
must be handled uniformly rather than inferred from a short list of fields.

### Constraints

- The shared filesystem-backed sealer remains the only digest, descriptor, publication, and verified-read authority.
- The round-1 direct finding-provenance bindings remain in this leaf: finding `authorityDigest`, governed-exception
  `findingDigest`, governed-exception `authorityDigest`, and governed-exception `issuerId` against the verified authority
  capsule publisher.
- The additive-dark path cannot expose these artifacts authoritatively before the phase-014 cutover.
- Closure verification must reject missing, reordered, mutated, stale, wrong-kind, or unauthorized evidence before any
  authority cutover.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep every plain scalar or array digest that names another sealed artifact immutable and shape-valid in this
leaf, while assigning its cross-artifact closure to successor leaf `004-certificates-and-receipts`. This is a general rule
for all Deep Alignment artifact kinds, not an exhaustive field enumeration.

**Additional examples of the deferred class**:

| Artifact kind | Example plain scalar/array digest fields | Binding in this leaf |
|---------------|------------------------------------------|---------------------|
| Applicability, detector, verifier, witness, finding, and exception material | `applicabilityDecisionDigest`, `subjectSnapshotDigest` | 64-hex shape only; no dependency backing |
| `CONVERGENCE_SNAPSHOT` | `orderedInputDigests`, `findingsViewDigest`, `exceptionViewDigest`, `unresolvedFindingDigests` | 64-hex scalar/array shape only; no dependency backing |
| `ALIGNMENT_REPORT` | `orderedInputDigests`, `convergenceSnapshotDigest`, `findingsViewDigest`, `exceptionViewDigest`, `unresolvedFindingDigests`, and the report digest set including `reportDigest` | 64-hex scalar/array shape only; no dependency backing |

The examples are illustrative, not exhaustive. The rule covers every plain scalar or array digest field whose meaning is to
name another sealed artifact, including any additional field introduced under another registered Deep Alignment kind.

The fields bound here remain the finding's direct authority provenance and the governed exception's direct finding,
authority, and issuer provenance. `authorityDigest` on finding evidence must match a verified authority-capsule dependency;
governed-exception `findingDigest` and `authorityDigest` must match their exact verified dependencies; and `issuerId` must
match `publisherId` on the verified authority capsule selected by that exact `authorityDigest`. This round-1 direct
provenance binding is separate from the general successor-owned closure rule for other plain digest fields.

Leaf `004-certificates-and-receipts` must independently resolve every deferred plain cross-artifact digest to real sealed
content, verify existence, expected-kind matching, and freshness, bind that content into its dependency closure,
certificates, and receipts, recompute the replay fingerprint over the certificate, receipts, sealed-artifact references, and
event-ledger records, and fail closed on missing, reordered, mutated, stale, wrong-kind, or unauthorized evidence before
authority cutover. Its dependency-closure/offline verifier owns this forward obligation; it is not a residual defect in
this sealed-artifacts leaf.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer all plain-digest closure to leaf 004** | Preserves this adapter's boundary and gives certificates one independent closure point for every cross-artifact field | Requires successor certificate and receipt verification | 10/10 |
| Add every plain digest as a dependency here | Closes references earlier | Expands the dependency contract without typed reference fields and duplicates successor evidence ownership | 4/10 |
| Treat 64-hex shape as sufficient for authoritative use | No additional wiring | A syntactically-valid digest can name absent or unrelated content | 1/10 |
| Add a second mode-local digest or signature verifier | Could prove closure locally | Forks the shared integrity authority and creates competing verification semantics | 0/10 |

**Why this one**: It records the values immutably, preserves the shared sealer as the only local integrity authority, and
places cross-artifact closure where certificates and receipts can authenticate the complete replay evidence set.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- The ownership boundary is explicit: direct finding provenance is verified here, while plain cross-artifact references are
  not silently treated as verified dependencies.
- Leaf 004 has a concrete obligation to authenticate every deferred digest, including existence, kind-match, and freshness,
  before authority cutover.
- Additive-dark behavior remains unchanged because no authoritative consumer receives these artifacts before cutover.

**What it costs**:

- A plain digest can be syntactically valid yet unresolved until leaf 004 performs certificate-time closure. Mitigation:
  leaf 004 must reject unresolved or mismatched closure before issuing a cutover-eligible certificate or receipt.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A successor verifier overlooks a plain-digest field on a newly registered kind | High | Discover all scalar/array fields that name sealed artifacts, maintain the field-to-kind closure registry, and require complete replay-fingerprint coverage |
| A caller treats shape validation as content verification | High | Preserve the explicit boundary in this record and the implementation summary; leaf 004 owns authoritative closure |
| A plain digest is reordered, substituted, or reused under the wrong kind in a certificate package | High | Recompute the ordered certificate/receipt/reference/event replay fingerprint, verify expected kind and freshness, and fail closed |
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Re-verification found the same shape-only, undeclared-dependency class in applicability/target fields and in convergence/report digest sets |
| 2 | **Beyond Local Maxima?** | PASS | Local backing, shape-only authoritative use, and successor-owned closure were compared |
| 3 | **Sufficient?** | PASS | The general rule covers every plain scalar/array cross-artifact digest, preserves the round-1 provenance bindings, and gives leaf 004 the closure obligation |
| 4 | **Fits Goal?** | PASS | The decision is additive-dark and does not expand this leaf's sealer contract |
| 5 | **Open Horizons?** | PASS | Leaf 004 can add certificate-time closure without changing the shared digest or store semantics |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- This record and the implementation summary document the accepted boundary for every plain cross-artifact digest.
- The existing adapter continues to shape-validate and seal such scalar/array values without adding dependency backing,
  including `CONVERGENCE_SNAPSHOT`'s ordered input, findings-view, exception-view, and unresolved-finding digest fields and
  `ALIGNMENT_REPORT`'s ordered-input, convergence, findings-view, exception-view, unresolved-finding, and report digest set.
- The existing round-1 named-dependency rules remain unchanged and continue to bind finding and governed-exception
  provenance to exact verified owners.
- Leaf 004 must implement and receipt the deferred cross-artifact closure, including existence, kind-match, and freshness,
  before authority cutover.

**How to roll back**: Revert this documentation boundary and its summary/checklist reconciliation together. No runtime,
shared sealer, dependency map, test, or artifact content changes are part of this ADR.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Require Live Authority Capsules at Every Read Boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | Deep Alignment sealed-artifact FIX agent under the approved leaf scope |

<!-- ANCHOR:adr-003-context -->
### Context

The shared store authenticated a rolled-back authority capsule's immutable bytes, descriptor, and digest, but the
Deep Alignment read adapter checked only its expiry. Because the closed capsule type permits only `status: valid`, a
capsule carrying `rollbackRef: rolled-back-from:authority-epoch-0` remained syntactically valid and could release bytes.
A finding or governed exception bound to that exact capsule also passed recursive provenance verification. Integrity was
therefore being mistaken for current authority.

### Constraints

- The exact `authorityDigest`, `findingDigest`, and `issuerId` ownership checks remain unchanged.
- The general plain scalar or array cross-artifact digest closure remains assigned to successor leaf 004.
- The fix stays inside the typed authority reference and recursive read context already owned by this leaf.
- Rejection remains bounded, typed, additive-dark, and byte-free.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Treat an authority capsule as live only when its closed material remains valid, has no rollback reference,
and has not reached its expiry boundary. Apply that invariant through the existing recursive read-context check.

| Liveness input | Live condition | Refusal boundary |
|----------------|----------------|------------------|
| `status` | Exactly `valid` | The closed parser rejects every other value before material reaches read-context verification |
| `rollbackRef` | `null` | A non-null value yields `INVALID_INPUT` at phase `read` with reason `rolled_back_authority` |
| `expiresAt` | Strictly later than the read clock | The existing expiry refusal remains unchanged |
| Superseded, revoked, or retired fields | Not members of the closed authority shape | Extra lifecycle fields are rejected as malformed material |
| Reference, descriptor, canonicalization, and authority-epoch versions | Must match the registered store and requested epoch | Existing shared-store version checks and recursive mixed-epoch checks remain unchanged |

The check runs when the capsule is read directly and whenever recursive dependency verification dereferences the exact
authority capsule selected by finding or governed-exception provenance. It is a lifecycle check on an existing typed
reference, not plain-digest closure, and therefore leaves ADR-002 intact.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Recursive authority-liveness check** | One invariant covers direct and dependent reads without changing artifact shapes | Historical rolled-back artifacts remain stored but unusable | 10/10 |
| Check only top-level authority reads | Smallest branch | Findings and exceptions could still authenticate through rolled-back provenance | 1/10 |
| Add lifecycle fields to every dependent artifact | Makes state locally visible | Duplicates authority state and creates stale copies | 2/10 |
| Expand all plain digest closure in this leaf | Could discover more relationships | Breaks the accepted successor-owned boundary and duplicates certificate work | 0/10 |

**Why this one**: The recursive walker already dereferences the exact typed authority dependency, so the liveness
decision belongs there and automatically covers every current provenance consumer.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:

- A rolled-back authority capsule cannot release bytes on direct read.
- Finding and governed-exception reads fail when their exact authority provenance has been rolled back.
- A live capsule and its exactly bound finding continue to verify.
- Existing expiry, epoch, exact-owner, and publisher-identity checks remain composable.

**What it costs**:

- Adapter sealing also refuses new artifacts that depend on a rolled-back authority because it reuses recursive dependency
  verification. Historical or externally produced fixtures must use the immutable store directly to exercise the read
  boundary.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future lifecycle field is added without a read invariant | High | Keep the authority shape closed and extend this liveness table and read-context check together |
| A dependent artifact bypasses recursive verification | High | Keep every named authority claim in the declarative dependency rule map and retain direct, finding, and exception regression coverage |
| A caller interprets stored bytes as live authority | High | Consumers must use `readDeepAlignmentArtifact`; raw storage presence is not an authority PASS |
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both direct and finding reads returned verified bytes for a capsule carrying a rollback reference before the fix |
| 2 | **Beyond Local Maxima?** | PASS | Top-level-only, duplicated lifecycle state, and plain-digest expansion were compared |
| 3 | **Sufficient?** | PASS | One recursive check covers direct authority, finding provenance, and governed-exception provenance |
| 4 | **Fits Goal?** | PASS | The change is additive-dark and stays on the typed authority reference boundary |
| 5 | **Open Horizons?** | PASS | Future closed lifecycle fields can extend the same invariant without changing digest ownership |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:

- `assertReadContext` refuses any authority capsule whose `rollbackRef` is non-null before returning or recursively
  authorizing parent bytes.
- The real-store suite proves direct authority, finding provenance, and governed-exception provenance rejection, while
  preserving the live-authority finding control.
- Existing exact-owner rules, publisher binding, expiry and epoch checks, and the generalized plain-digest boundary remain
  unchanged.

**How to roll back**: Revert the rollback-reference branch, its three rejection fixtures, and this decision together.
The stored artifacts, shared store, exact-owner rules, and plain-digest boundary require no rollback.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
