---
title: "Decision Record: Skill Benchmark Ledger Head Boundary"
description: "Accept the schema-only prevEventHash boundary while preserving real append-head linkage in the authorized ledger substrate."
trigger_phrases:
  - "Skill Benchmark prevEventHash boundary"
  - "skill benchmark ledger head linkage"
  - "schema payload digest boundary"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T12:15:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted the schema-only previous-hash boundary"
    next_safe_action: "Carry semantic head checks into reducers and ledger integration"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-ledger-boundary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The schema binds prevEventHash into payloadDigest without receiving the actual ledger head"
      - "AppendOnlyLedger writes each frame against the verified real head"
---
# Decision Record: Skill Benchmark Ledger Head Boundary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Actual-Head Validation Outside the Schema Leaf

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | System Deep Loop maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The Skill Benchmark schema requires `payload.prevEventHash` to be a digest and includes it in `payloadDigest`. This
makes a changed claim detectable, but the schema validator receives only the envelope and registry. It does not receive
the ledger's verified prior head, so it cannot prove that the claimed value equals the real append head.

A self-consistent event can therefore carry a plausible but incorrect `payload.prevEventHash` while an authorization
request carries the real prior head. The schema accepts that envelope. `AppendOnlyLedger` still writes the physical
frame's `prev_record_hash` from its verified head under the append lock, so the durable ledger chain remains correctly
linked. Comparing the payload claim with that real head belongs to the ledger integration and reducer boundary.

### Constraints

- The schema leaf must remain a pure envelope validator without storage or ledger-head access.
- The frozen authorized-ledger substrate owns durable frame linkage and cannot be changed from this lane.
- The payload claim must remain digest-bound so later replay or reducer checks can detect alteration.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep `prevEventHash` structurally and cryptographically bound in the schema, while leaving equality with
the verified append head to the authorized ledger and reducer integration.

**How it works**: The schema validates the digest shape and recomputes `payloadDigest` over `prevEventHash`.
`AppendOnlyLedger` independently anchors each stored frame to its verified current head. Consumers that treat the
payload field as a semantic claim must compare it with the actual preceding frame during append integration or replay.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Schema binding plus substrate/reducer head checks** | Keeps the leaf pure and the durable chain authoritative | Payload equality is not proven by schema validation alone | 9/10 |
| Pass the live ledger head into the schema validator | Could reject mismatches at schema validation | Couples a reusable registry contract to mutable storage state | 4/10 |
| Remove `prevEventHash` from the payload | Avoids a duplicated head claim | Loses tamper-evident semantic linkage for replay consumers | 2/10 |

**Why this one**: It preserves the frozen substrate boundary and gives reducers a digest-bound claim to verify without
pretending that a stateless schema validator knows the real ledger head.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Payload tampering remains detectable because `prevEventHash` participates in `payloadDigest`.
- The physical append chain remains authoritative because each frame is linked to the verified head under lock.

**What it costs**:
- Schema validation alone can accept a self-consistent but incorrect payload claim. Mitigation: compare the claim with
  the actual preceding frame in ledger integration or reducer replay before relying on it semantically.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer mistakes schema validity for proof of actual-head equality | M | Document the boundary and require integration or replay comparison |
| A later schema change duplicates substrate head logic | M | Keep storage-aware checks out of the lane registry |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The schema and substrate expose distinct claims that must not be conflated |
| 2 | **Beyond Local Maxima?** | PASS | Storage-coupled validation and removing the field were both evaluated |
| 3 | **Sufficient?** | PASS | Digest binding plus authoritative frame linkage preserves both responsibilities |
| 4 | **Fits Goal?** | PASS | The decision keeps this leaf additive-dark and schema-only |
| 5 | **Open Horizons?** | PASS | Reducers can add semantic comparison without changing event bytes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The Skill Benchmark registry narrows shared common events to `scope.variant === 'skill-benchmark'`.
- Tests prove foreign common variants cannot survive lane registry preparation or durable append revalidation.
- The schema continues to bind `prevEventHash` into `payloadDigest` without claiming actual-head equality.

**How to roll back**: Remove this record only after a replacement contract injects verified head state into schema
validation or explicitly removes the payload claim. Revert the registry wrapper and its regression test together if the
lane no longer owns a distinct ledger.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

