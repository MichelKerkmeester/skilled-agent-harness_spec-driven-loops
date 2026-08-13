---
title: "Decision Record: Resume Oracle and Receipt Certificate Trust"
description: "Records the independent resume oracle and the verified, receipt-bound parity-certificate trust boundary, including its unsigned residual risk."
trigger_phrases:
  - "Deep Research legacy resume oracle"
  - "resume parity non-vacuity"
  - "Deep Research observed golden fixtures"
  - "Deep Research receipt certificate binding"
importance_tier: "critical"
contextType: "decision"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
    last_updated_at: "2026-07-22T14:26:52Z"
    last_updated_by: "codex"
    recent_action: "Recorded the receipt trust boundary and successor re-derivation requirement"
    next_safe_action: "Require the successor gate to re-evaluate evidence through the authenticated gateway"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-shadow-parity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Resume parity compares a modeled legacy oracle with the real ledger adapter"
      - "Model-specific identifiers and prose are excluded while continuation semantics remain compared"
      - "Observed legacy golden fixtures are required before phase-014 authority consideration"
      - "The receipt certificate is self-consistent and manifest-fresh but is not signed"
      - "A serialized receipt is evidence, not a standalone authenticated authority record"
---
# Decision Record: Independent Legacy Resume Oracle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Compare Modeled Legacy Resume Semantics with the Real Ledger Adapter

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research shadow-parity maintainers |

---

<!-- ANCHOR:adr-001-context -->
### 1. Context

The resume parity driver required both inputs to be `DeepResearchResumeAdapter` instances. Its production test then copied
the legacy ledger directory byte-for-byte into the ledger harness. Both roles therefore executed identical decision
algebra over identical persisted bytes. A real mismatch between legacy full-state reconstruction and the typed-ledger
resume adapter could not affect the result.

The event dimension already avoids this failure mode. Its legacy side uses the modeled `legacyProjection` and
`directConvergence` fold, while its ledger side uses the typed reducer. Resume needs the same independent-oracle boundary
without changing the receipt, gate-input, or resume-evidence records consumed downstream.

### 2. Constraints

- The ledger side must remain the real `DeepResearchResumeAdapter` and continue driving the real substrate.
- The legacy side must derive branch and effect dispositions from the modeled full-state/event and effect-journal view.
- Both sides must reuse the complete persisted lease without allocation or replacement.
- The change remains additive-dark and cannot authorize rollback readiness, cutover, or production completion.
- `DeepResearchParityReceipt`, `DeepResearchModeGateInput`, and `DeepResearchResumeParityEvidence` keep their names and shapes.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### 3. Decision

**We chose**: Replace the legacy resume adapter role with `DeepResearchLegacyResumeOracle`, backed by the existing modeled
legacy projection and a separate legacy resume policy over the persisted event and effect-journal view.

**How it works**: The oracle folds legacy events through `legacyProjection` and `directConvergence`, derives compatibility,
branch reuse or re-execution, effect recovery, invalidation, a semantic event tail, and a fresh continuation projection.
The driver compares those semantics with the real ledger adapter's independently reconstructed result. Model-specific
decision IDs, retry IDs, evidence IDs, and explanation prose may differ; compatibility outcomes, branch and effect
dispositions, invalidation, forensic and artifact evidence, the complete persisted lease, event tail, and continuation
projection must match.

A typed `DeepResearchResumeParityDivergenceError` blocks evidence emission when any decision, event-tail, or fresh-projection
dimension differs. The positive control uses one independently seeded typed ledger and the legacy event model without any
directory copy. The negative control omits the selected-branch observation from the legacy model while the ledger retains
it, producing real planned-versus-selected resume divergence. Disabling the comparison makes that test fail, proving the
assertion is load-bearing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### 4. Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Modeled legacy oracle versus real adapter** | Independent computations, explicit semantic boundary, falsifiable resume parity | Modeled legacy fidelity must be maintained and verified against observations | 10/10 |
| Two adapter instances over separately seeded ledgers | Removes the byte-copy defect | Still shares the same decision algebra, so implementation bugs remain structurally invisible | 3/10 |
| Two adapter instances over copied bytes | Minimal code | Guarantees equality and cannot detect legacy-versus-ledger divergence | 0/10 |

**Why this one**: Only a distinct model can falsify the implementation under test. Separate storage alone does not create
an independent behavior authority when both sides still call the same class.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### 5. Consequences and Fidelity Boundary

**What improves**:

- Crash-resume parity can now reject a real legacy-model versus ledger-adapter difference.
- The persisted lease is checked as a complete value on both sides.
- All ten event fault kinds are exercised symmetrically when either the legacy or ledger path diverges.
- The real ledger adapter, replay derivation and attestation, certificate flow, receipt guard, and successor handoff remain intact.

**What it costs**:

- The legacy event oracle (`legacyProjection` and `directConvergence`) and the legacy resume oracle are modeled legacy
  behavior for this planning harness. A shared misunderstanding between a model and the real legacy system remains possible.

**Observed-golden obligation**: Before phase 014 may consider authority change, implementation must capture genuine observed
golden fixtures from the real legacy Deep Research system for both event projection and resume behavior. Those fixtures
must cover branch and effect dispositions, invalidation, event tails, continuation projections, lease continuity, and the
existing lifecycle fault surface. Modeled fixtures remain useful for planning and mutation tests but are not a substitute
for observed legacy evidence at the authority boundary.

| Risk | Impact | Mitigation |
|------|--------|------------|
| The modeled legacy oracle shares a fidelity bug with the ledger implementation | H | Capture and gate on genuine observed legacy golden fixtures before phase-014 authority consideration |
| A future refactor normalizes away a resume semantic difference | H | Keep the typed divergence control and comparison-removal falsifier |
| Downstream code couples to the internal driver signature | M | Successor contracts consume the unchanged receipt and gate-input records, not the harness driver |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### 6. Implementation and Rollback

The shadow-parity adapter exports the legacy snapshot oracle and typed resume-divergence error. The internal driver now
accepts the oracle plus one real ledger adapter. The focused suite contains a matching control, a modeled divergence
control, the comparison-removal falsifier, and symmetric legacy-side and ledger-side fault matrices.

**How to roll back**: Revert the oracle, driver, tests, and this record together. The change writes no production data,
changes no authority, and requires no receipt, gate-input, or resume-evidence migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Bind Receipts to Verified Embedded Parity Certificates

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research shadow-parity maintainers |

---

<!-- ANCHOR:adr-002-context -->
### 1. Context

A receipt previously carried only a hexadecimal `parityCertificateDigest`. Because every receipt commitment used public
plain-SHA formulas, a caller could construct equal made-up stream and projection digests, claim an issued certificate,
recompute the receipt commitments, and obtain a passing mode-gate input without any real shadow-parity execution.
`verifyParityCertificate` already enforced manifest freshness, case closure, evidence commitments, shadow-only authority,
zero open divergences, and rollback minimums, but neither receipt parsing nor mode-gate creation invoked it.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### 2. Decision

Each issued `DeepResearchParityReceipt` embeds the real `ParityCertificate` and a sorted full-closure
`certificateEvidenceBindings` array. A refused receipt carries neither. Receipt parsing now requires the trusted
`ParityCaseManifest`; both parsing and mode-gate creation call `verifyParityCertificate` with expectations derived from
that manifest, the locally derived certificate bindings, and the receipt-declared case, reference, and attestation
evidence.

The positional correspondence is exact. For binding record `i`, `fixtureId` equals `certificate.case_ids[i]` and
`caseEvidenceDigest` equals `certificate.case_evidence_digests[i]`. Sorted unique `referenceSetDigest` values reconstruct
`certificate.reference_set_digests`; sorted unique per-record `attestationFinalDigests` reconstruct
`certificate.attestation_final_digests`. Each record also contains the fixture's legacy and ledger stream digests and both
projection fingerprints. The certificate's `bindings.adapter_digest` commits the sorted full set of these records, and
the current receipt must match its fixture record exactly. This rejects a real certificate spliced from another run as
well as a receipt with no embedded certificate.

Missing or malformed certificates fail receipt parsing, stale manifest or BASE bindings become `RECEIPT_STALE`, other
certificate verification failures become `CERTIFICATE_UNVERIFIABLE`, and refused certificates leave the receipt blocked.
No certificate outcome can authorize rollback readiness or cutover.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-residual -->
### 3. Residual Authority Boundary

`verifyParityCertificate` proves self-consistency, manifest freshness, complete case closure, and shadow-only completeness;
it does not provide signing authority. The embedded certificate is not HMAC-signed at this layer. A serialized parity
receipt validated in isolation is therefore internally consistent, manifest-bound evidence. It is not a standalone
authenticated authority record and does not prove by itself that a real run occurred.

Per the successor 007 contract, authenticated verification happens at the phase-014-bound mode gate. That gate re-derives
its verdict from immutable authorized evidence through the real `TransitionAuthorizationGateway` plus deterministic replay
against the authorized ledger. Successor 007 consumes this leaf's receipt as evidence and MUST re-derive the verdict; it
must not trust the receipt's computed `exitStatus`. This is the operator-confirmed trust model as of 2026-07-22.

Optional pre-cutover hardening remains with the shared substrate owner: add issuer signing to
`issueParityCertificate`/`verifyParityCertificate`, and require issuance to confirm its result against real executor and
ledger attestation. That would make a serialized receipt independently authenticatable for every mode through one shared
substrate change.
<!-- /ANCHOR:adr-002-residual -->

---

<!-- ANCHOR:adr-002-consequences -->
### 4. Consequences and Rollback

The receipt shape is additively enriched with `parityCertificate` and `certificateEvidenceBindings`; existing exported
field and type names remain. The successor consumer must accept the enriched closed shape and perform its own gateway
verification. Rollback removes those two fields and the boundary verification together; no production data or authority
state requires repair because the path remains additive-dark and legacy-authoritative.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->
