---
title: "Decision Record: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify"
description: "Decision record for 025-artifact-certificate-binding: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "artifact certificate binding"
  - "sealed artifact identity binding"
  - "certificate semantic binding"
  - "decoy artifact negative test"
  - "deep loop 025 certificates"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored ADR-001 and ADR-002 from the WS1 phase-tree proposal"
    next_safe_action: "Operator accepts or rejects ADR-001 and ADR-002"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One binding validator: re-derive every load-bearing identity and compare exactly

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

---

<!-- ANCHOR:adr-001-context -->
### Context

Twelve findings across the sealed-artifact store, four certificate emitters and three reducers describe the same mistake: a claim is accepted because part of it matches. A decoy sharing two digests is returned as creation evidence; a certificate carrying a false candidate passes because the verifier never compares that field; provenance returns true for four unrelated lifecycle events. Fixing twelve places independently would yield twelve definitions of what binding means.

### Constraints

- Each emitter binds a different set of fields, so the validator must be parameterised by data.
- Genuine historical certificates must continue to verify.
- Some load-bearing values are currently invented by the issuer, so re-derivation depends on `024` making real positions readable.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One binding validator that compares a claim against values re-derived from the verified typed payload, driven by a per-emitter field list.

**How it works**: Each emitter supplies its load-bearing field list. The validator re-derives each field from the verified typed payload and compares by exact equality, rejecting with the mismatched field named. Metadata correspondence alone never satisfies a check.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One validator + per-emitter field lists** | Single definition of binding; new emitters inherit it; mismatches are reportable | Requires enumerating four field lists up front | 9/10 |
| Per-emitter local checks against a shared field list | Less coupling between emitters | Four implementations of the same comparison; they drift | 5/10 |
| Twelve independent fixes | Fastest per fix | Twelve definitions of binding; the class recurs at the next emitter | 2/10 |

**Why this one**: One validator makes "what does this certificate bind" a reviewable list rather than an emergent property of twelve code paths.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A decoy is rejected everywhere rather than in the one place someone remembered.
- A new emitter inherits binding by supplying a field list.
- A rejection names the mismatched field, which makes investigation cheap.

**What it costs**:
- Four field lists must be enumerated before the validator is useful. Mitigation: that enumeration is the highest-value review artifact in the child.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A field list is incomplete, so a binding gap survives | H | Decoy test per finding; independent review of the field lists |
| Tightening rejects a genuine historical certificate | H | Historical corpus enumerated first (CHK-011); any rejection investigated as a finding |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Twelve findings share one mechanism and gate every cutover certificate |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | A validator plus field lists closes all twelve |
| 4 | **Fits Goal?** | PASS | Cutover certificates must bind what they claim |
| 5 | **Open Horizons?** | PASS | A fifth emitter supplies a field list rather than a new implementation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- A new binding validator module plus four per-emitter field lists.
- The sealed-artifact store, four certificate emitters, and three reducers.

**How to roll back**: Revert per emitter; each is an independent commit. The validator can remain in place unused.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A verifier never re-derives a value the issuer invented

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-007-01` records that certificate receipts fabricate `result_head.sequence` from `receiptDigests.length` and transition heads from `attemptNumber`, and that verification re-derives the same synthetic value. The signature therefore stays valid for a false ledger position: both sides agree because both sides are guessing the same way.

### Constraints

- Certificates already issued carry the synthetic values, so the fix order matters for compatibility.
- Real ledger positions become readable only once `024`'s primitives are in place.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Ledger positions are read from the ledger on both sides; neither the issuer nor the verifier computes them.

**How it works**: The issuer records the actual head it observed; the verifier reads the same head independently from the ledger and compares. A certificate citing a position the ledger does not have fails verification.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read real positions on both sides** | A false position cannot verify; the signature attests to something real | Depends on `024`; already-issued certificates need a compatibility decision | 9/10 |
| Keep the synthetic value but sign it explicitly | No dependency on `024` | Signs a number nobody checked; the property is unchanged | 2/10 |
| Fix the verifier only | Smaller change | Issuer keeps inventing; verification fails on every new certificate | 3/10 |
| Fix the issuer only | Smaller change | Verifier keeps re-deriving, so it never notices | 3/10 |

**Why this one**: Both halves are required for the property to hold; fixing one side alone either breaks verification or leaves it blind. The order is a compatibility decision recorded in Phase 2.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A signature attests to a real ledger position rather than to a shared guess.

**What it costs**:
- A dependency on `024`, and a compatibility decision for already-issued certificates. Mitigation: the fix order is decided and recorded before implementation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Already-issued certificates stop verifying | H | Historical corpus check (CHK-111); the fix order is chosen with that corpus in view |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A signature over a fabricated position is not evidence |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including the two one-sided fixes |
| 3 | **Sufficient?** | PASS | Reading the real position on both sides is the whole fix |
| 4 | **Fits Goal?** | PASS | Cutover certificates must cite real ledger positions |
| 5 | **Open Horizons?** | PASS | Applies unchanged to future certificate kinds |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `deep-improvement-common-certificates.ts` issuance and verification paths.

**How to roll back**: Revert both halves together; reverting only one leaves the system in the worse of the two one-sided states.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
