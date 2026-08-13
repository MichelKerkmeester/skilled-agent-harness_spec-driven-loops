---
title: "Decision Record: Skill Benchmark Sealed-Artifact Boundaries"
description: "Records the typed canary-freshness read invariant and the accepted certificate-owned boundary for named plain-digest fields."
trigger_phrases:
  - "Skill Benchmark cross-artifact digest closure"
  - "skill benchmark plain digest backing"
  - "skill benchmark certificates closure boundary"
  - "skill benchmark canary freshness"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-24T05:41:00+02:00"
    last_updated_by: "codex"
    recent_action: "Required active fresh typed canaries on artifact reads"
    next_safe_action: "Enforce the forward closure obligation in the certificates-and-receipts leaf"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-sealed-artifacts/skill-benchmark-sealed-artifacts.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-sealed-artifacts.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-sealed-boundary-20260724"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cross-artifact backing for named plain-digest fields is enforced by the certificates-and-receipts leaf, not by this sealed-artifacts leaf."
      - "Every typed canary-bearing Skill Benchmark read forces common freshness verification and requires an active lifecycle."
---
# Decision Record: Skill Benchmark Sealed-Artifact Boundaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep cross-artifact plain-digest closure in the certificates leaf

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | Operator, Skill Benchmark implementation owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

This leaf seals the exact bytes of each Skill Benchmark artifact through the shared content-addressed store. It validates
each field by kind, shape-checks digest strings, exact-kind checks every declared `SealedArtifactReference`, walks that
declared reference closure, and performs tamper-evident verified reads.

Some fields name other artifacts without carrying a `SealedArtifactReference`. The exposure and causal-score observations
carry `assignmentId` and `assignmentDigest`; run assignments carry `skillBundleRef` and `skillBundleDigest`. These values
are immutable once sealed, but `explicitReferences()` cannot resolve or kind-check them because their contract is a plain
string rather than a sealed reference.

### Constraints

- This leaf must remain additive-dark and must not absorb certificate issuance, receipt materialization, or authority-cutover logic.
- The shared sealer, landed schema, golden modules, and certificates-and-receipts leaf remain outside this change's implementation scope.
- Any authoritative consumer must prove that named digests resolve to authenticated sealed artifacts of the expected kind before cutover.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep cross-artifact backing for `assignmentId`, `assignmentDigest`, `skillBundleRef`, and
`skillBundleDigest` as a forward obligation on the certificates-and-receipts leaf.

**How it works**: This leaf continues to seal those scalar values immutably and verifies only its declared
`SealedArtifactReference` closure. The certificates-and-receipts leaf must bind the named values to authenticated ledger
events and real sealed content of the expected kind, then reject missing, reordered, mutated, stale, or unauthorized
evidence through its independent offline verifier before any authority cutover.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Enforce closure in the certificates-and-receipts leaf** | Preserves the sealed-artifact boundary and verifies backing where ledger events, receipts, and certificates are available together | Creates an explicit forward obligation | 9/10 |
| Convert the four fields to `SealedArtifactReference` here | Makes this leaf able to walk the references directly | Changes the landed schema and expands the locked scope | 3/10 |
| Resolve plain digests opportunistically in this leaf | Adds partial backing without schema changes | Duplicates certificate verification and cannot authenticate the full event and receipt chain | 2/10 |

**Why this one**: The successor leaf has the complete evidence set needed for cross-artifact authentication. Keeping this
leaf limited to immutable material and declared reference closure avoids a second, incomplete certificate path.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The verification boundary states exactly which plain fields remain unbacked in this leaf.
- Certificate integration has a concrete rejection obligation before authority can move.

**What it costs**:
- This leaf accepts a syntactically valid named digest whose target has not yet been verified. Mitigation: artifacts remain
  additive-dark, and the certificates-and-receipts verifier must close the four named fields before cutover.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A certificate path treats a shape-valid digest as authenticated backing | High | Require the successor offline verifier to resolve the digest, exact-kind check the sealed content, and bind the matching ledger event |
| The forward obligation is omitted during certificate integration | High | Carry these four fields into the successor's certificate and receipt verification checklist |

This boundary does not weaken this leaf's existing fail-closed behavior for tampered, unsealed, truncated, or partially
published material, wrong-kind sealed references, mismatched referenced epochs, or visibility violations.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The four plain fields name artifacts but are outside the declared sealed-reference closure |
| 2 | **Beyond Local Maxima?** | PASS | Schema conversion, opportunistic resolution, and certificate-owned closure were compared |
| 3 | **Sufficient?** | PASS | One explicit successor obligation covers backing without duplicating certificate logic |
| 4 | **Fits Goal?** | PASS | The decision preserves additive-dark sealed artifacts and blocks authoritative use until closure exists |
| 5 | **Open Horizons?** | PASS | The successor can enforce closure without changing this leaf's public artifact shapes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- This decision record names the four deferred plain fields and the successor verifier obligation.
- No cross-artifact backing code, schema change, shared-sealer change, or certificate implementation is added here.

**How to roll back**: Remove this record only if the same closure obligation is implemented and verified in an earlier
boundary. Removing the record without that implementation would hide an accepted authentication boundary.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Require an active fresh canary on typed-reference reads

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | Operator, Skill Benchmark implementation owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

Skill Benchmark materials exact-kind validate `canaryEpochReference` and resolve it through the shared immutable store.
The common reader, however, only checked canary freshness when a caller supplied `requireFreshCanary` or selected a
specialized access role. Default Skill Benchmark consumers supplied neither. A causal score could therefore bind a
retired canary, match its evaluator and accepted scored gold, and still release verified score bytes.

### Constraints

- Canary freshness is a read invariant and cannot depend on a self-declared score flag or optional caller policy.
- Timestamp and expiry evaluation remains owned by the deep-improvement-common verifier.
- Skill Benchmark additionally requires lifecycle `active`; sealed, burned, retired, expired, and not-yet-valid canaries
  are unusable.
- The typed-reference fix must not expand into the plain-digest closure reserved by ADR-001.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Every Skill Benchmark material carrying `canaryEpochReference` re-reads that typed reference through
`readDeepImprovementCommonArtifact` with freshness forced on, then requires lifecycle `active`.

**How it works**: The shared reader authenticates the real `CANARY_EPOCH`, applies its sealed-time and expiry rules, and
returns `STALE_CANARY` for stale temporal state. The Skill Benchmark adapter then returns the same typed refusal for any
non-active lifecycle. The check runs unconditionally before artifact bytes are returned and covers exposure, causal-score,
and certificate-input materials without trusting duplicated flags.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Force common freshness and require active lifecycle** | Reuses the shared temporal contract and closes every typed canary read | Adds one verified common read per canary-bearing artifact | 10/10 |
| Require callers to pass `requireFreshCanary` | No adapter change | Default consumers remain vulnerable and policy omission becomes an integrity bypass | 1/10 |
| Reimplement all timestamp arithmetic locally | Avoids the second common read | Duplicates shared canary semantics and can drift | 3/10 |

**Why this one**: Freshness belongs to the common verifier, while active-only acceptance is the Skill Benchmark read
contract. Composing those checks keeps both ownership boundaries explicit.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Default reads reject retired and otherwise stale canaries before releasing score bytes.
- Exposure and certificate-input reads receive the same typed-reference lifecycle protection.
- Active, unexpired canaries continue to verify without a caller policy override.

**What it costs**:
- Canary-bearing reads perform an additional authenticated common-artifact read. This is accepted because correctness and
  shared-policy reuse outweigh a small additive-dark read cost.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A fixture uses an already-expired active canary | Medium | Pin fixture validity to a deterministic long-lived window and retain an explicit active control |
| Future common lifecycle vocabulary changes | Medium | Fail closed because any lifecycle other than `active` remains stale to Skill Benchmark |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The pre-fix default read returned a score bound to a retired canary |
| 2 | **Beyond Local Maxima?** | PASS | Caller policy, local timestamp duplication, and shared-verifier composition were compared |
| 3 | **Sufficient?** | PASS | The check authenticates the typed canary, verifies time freshness, and requires active lifecycle |
| 4 | **Fits Goal?** | PASS | It satisfies the read contract without changing schemas or authority |
| 5 | **Open Horizons?** | PASS | The common verifier can evolve timestamp rules while the leaf keeps its active-only invariant |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The read closure forces common canary freshness verification and active lifecycle for every typed canary reference.
- Focused tests prove retired-canary refusal with no bytes and active-canary success on the default read path.
- Gold-state, reference-kind, evaluator-epoch, and ADR-001 plain-digest boundaries remain unchanged.

**How to roll back**: Remove the active/fresh assertion and its focused tests. This would reopen default-read acceptance of
retired canaries and is not safe while the specification requires canary freshness.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
