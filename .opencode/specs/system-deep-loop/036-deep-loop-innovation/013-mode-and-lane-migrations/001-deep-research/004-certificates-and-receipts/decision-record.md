---
title: "Decision Record: Deep Research Certificate Trust Boundaries"
description: "Records receipt-chain durability, exact projection provenance, memory-handoff digest sources, and per-kind initialization correspondence without changing frozen shared types."
trigger_phrases:
  - "deep research prior receipt digest"
  - "deep research receipt chain durability"
  - "shared receipt evidence digest"
  - "deep research projection ledger equality"
  - "deep research memory handoff digest binding"
  - "deep research initialization artifact correspondence"
importance_tier: "critical"
contextType: "decision"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-22T06:26:51Z"
    last_updated_by: "codex"
    recent_action: "Bound handoff digests and initialization kinds to canonical evidence"
    next_safe_action: "Successor resume logic may verify the existing receipt chain contract"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/deep-research-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The signed shared evidence digest commits to the prior receipt digest"
      - "Projection evidence must exactly equal the verified authorized-ledger range"
      - "The memory-save input list is the canonical ordered final reference set"
      - "The offered view digest must match a verified synthesis output among the memory-save inputs"
      - "Plan frontier and search recipe remain seal-bound because initialization exposes no distinct event digest"
---
# Decision Record: Deep Research Certificate Trust Boundaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Prior-Link Verification Inside the Existing Signed Evidence Digest

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research certificate maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

Each domain transition receipt includes `facts.priorReceiptDigest`, and `receiptDigest` is the canonical digest of all
receipt facts. The durable shared receipt does not expose a separate prior-digest field. The concern was that a durable
read might therefore be unable to verify the prior link, or that the shared issuer could idempotently reuse a receipt
whose prior link changed.

### Constraints

- The shared `BoundaryReceiptPayload` and `BoundaryReceiptIssuer` substrate are frozen.
- Exported Deep Research receipt and certificate types must remain unchanged.
- Same-key, different-facts reuse must fail through the shared typed conflict path.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the frozen shared payload and verify the prior link through its existing signed `evidence_digest`.

**How it works**: The domain `receiptDigest` commits to `priorReceiptDigest` because it hashes the complete receipt facts.
The projected boundary result writes that digest as `evidence_digest`; the shared receipt persists and certifies it, and
the issuer's stable-facts comparison includes it. Offline verification re-derives the domain facts and digest, compares
the durable payload, and verifies the shared receipt event and certification.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use the existing signed evidence digest** | Preserves frozen types and already participates in durable conflict detection and offline verification | The prior link is a cryptographic commitment rather than a separate shared-payload field | 9/10 |
| Add `prior_receipt_digest` to the shared payload | Makes the link directly visible in the generic payload | Breaks the frozen shared contract and expands change scope into substrate schemas, parsers, and consumers | 3/10 |

**Why this one**: The existing digest path proves the required property. Adding a duplicate field would increase contract
surface without increasing verification strength.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The durable-read proof is explicit and covered by a same-key prior-digest conflict test.
- Shared and exported types remain stable for successor consumers.

**What it costs**:

- Generic receipt readers need the domain facts to display the prior digest. Mitigation: domain offline verification
  already requires and strictly parses those facts before accepting the receipt chain.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future refactor stops projecting `receiptDigest` as `evidence_digest` | H | Keep the equality and changed-prior conflict fixtures in the targeted suite |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The durable prior link is required for receipt-chain verification |
| 2 | **Beyond Local Maxima?** | PASS | Both explicit-field and existing-commitment designs were assessed |
| 3 | **Sufficient?** | PASS | The signed digest and conflict path prove the property without a wider schema change |
| 4 | **Fits Goal?** | PASS | The decision closes the receipt durability question inside this leaf |
| 5 | **Open Horizons?** | PASS | Successor resume logic can verify the chain without a contract migration |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- The targeted suite asserts durable `evidence_digest === receiptDigest`.
- The targeted suite proves a changed prior digest conflicts under the same facts-independent receipt key.

**How to roll back**: Revert the proof and this decision record together; no runtime or shared-type migration is needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Require Projection Events to Equal the Verified Ledger Range

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research certificate maintainers |

### Context

Certificate issuance and offline verification previously accepted `projectionEvents` separately from the authorized
ledger used for receipt facts, heads, and replay fingerprints. Both inputs could be internally valid while describing
different event sets. A certificate could therefore combine convergence and obligation evidence from one history with
receipts and replay evidence from another.

### Constraints

- The authorized ledger, reducer, replay walker, sealed artifacts, and shared receipt substrate are frozen.
- Exported certificate and verifier input types must remain stable.
- The check must work offline and must not introduce a second projection digest or trust root.

### Decision

**We chose**: Require exact canonical equality, including order, between the supplied projection events and the effective
event envelopes in the verified replay range during issuance and offline verification.

The ledger range remains the provenance authority. The reducer still computes the existing projection integrity digest,
but it can now fold only the event set already authenticated by the same ledger path that supplies receipt facts, heads,
and replay inputs.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exact ordered event equality** | Closes the exploit with private runtime logic and no schema or type change | Requires callers to provide the canonical ledger event envelopes | 10/10 |
| Compare projection digests only | Smaller comparison surface | Two different event sets can fold to the same projection; provenance remains ambiguous | 3/10 |
| Document the separation as safe | No runtime change | The separation is not safe because the certificate attests facts from both inputs | 0/10 |

### Consequences

**What improves**:

- Projection status, convergence, and obligations now share provenance with receipts, heads, and replay.
- Offline verification detects a mismatched projection before accepting any derived certificate fact.
- The successor contract and frozen shared substrate remain unchanged.

**What it costs**:

- Callers cannot provide a semantically equivalent projection stream with different metadata or ordering. That strictness
  is intentional for an evidence certificate; normalization belongs before authorized append, not during attestation.

### Implementation

Issuance and offline verification compare the projection input with the effective envelopes from the bounded verified
range and return typed `PROJECTION_INVALID` evidence at `projection:ledger-events` on any mismatch. The targeted suite
proves both paths.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Bind Handoff and Initialization Material to Unambiguous Canonical Sources

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research certificate maintainers |

### Context

Sealed memory-handoff material carried a final-reference-set digest and an offered-view digest, but correspondence used
only the target packet and continuity digest from the result event. Initialization correspondence also accepted any of
four event digests for any initialization artifact kind. Both behaviors accepted well-formed material without proving
that the field represented the fact named by its artifact kind.

### Decision

The canonical final reference set is the ordered `inputArtifactQualifiedDigests` list on the memory-save receipt. The
receipt chain already attests those verified qualified identities, and excluding the handoff output avoids a circular
self-digest. `finalReferenceSetDigest` is the canonical digest of that ordered list. `offeredViewDigest` must equal the
`outputDigest` of a verified synthesis artifact named by that same memory-save input list. This makes the offered view a
member of the attested final reference set rather than any unrelated synthesis artifact elsewhere in the certificate.

Initialization material uses this exact map:

| Artifact kind | Authorized initialization field |
|---------------|----------------------------------|
| `OBJECTIVE` | `charterDigest` |
| `MODE_CONFIGURATION` | `configDigest` |
| `CAPABILITY_COMMITMENT` | `executorFingerprint` |
| `POLICY_INPUT` | `replayFingerprint` |
| `PLAN_FRONTIER` | No distinct event digest; closed canonical material and sealed provenance remain authoritative |
| `SEARCH_RECIPE` | No distinct event digest; closed canonical material and sealed provenance remain authoritative |

The two unmapped kinds do not borrow another kind's event digest. Adding an invented one-to-one mapping would falsely
attribute plan or recipe bytes to a different authorized fact. Their kind, lifecycle, canonical material, sealed bytes,
and receipt role remain verified; a future event-schema version may add distinct fields without changing this frozen
certificate or receipt shape.

Convergence and synthesis `orderedInputDigests` use order-independent set equality with their declared receipt inputs.
Every declared identity must be present and no undeclared identity may be padded into the sealed result artifact.

### Consequences

- Fabricated handoff reference-set and offered-view digests fail both issuance correspondence and offline re-derivation.
- An objective cannot claim the executor, configuration, or replay field merely because its digest is well formed.
- Provenance padding fails with the existing typed `ARTIFACT_INVALID` path.
- All changes are private derivation and validation logic; exported certificate and receipt types remain stable.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use receipt inputs and verified synthesis output** | Uses already-attested real values, avoids self-reference, preserves public types | Requires receipt-context derivation during issuance and offline verification | 10/10 |
| Digest the complete artifact claims including the handoff | Appears to cover the whole bundle | Circular because the handoff bytes contain the digest being computed | 0/10 |
| Keep format-only digest checks | No code change | Accepts fabricated attestations and does not prove correspondence | 0/10 |
| Map plan and recipe to unrelated initialization fields | Produces a superficially complete table | Misattributes facts the event schema does not carry | 1/10 |
<!-- /ANCHOR:adr-003 -->
