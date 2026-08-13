---
title: "Decision Record: Reference Kind, Evaluator Epoch, Consumer Role, and Frozen Substrate Boundaries"
description: "Records read-time reference, evaluator-epoch, and consumer-role invariants plus the accepted frozen-store boundary for cross-artifact digest closure."
trigger_phrases:
  - "embedded artifact reference kind"
  - "evaluator capsule epoch integrity"
  - "mixed epoch promotion rejection"
  - "consumer access role normalization"
  - "unknown access role veto"
  - "frozen substrate seal acceptance"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
    last_updated_at: "2026-07-24T03:42:00Z"
    last_updated_by: "codex"
    recent_action: "Closed consumer-role variant and unknown-role fail-open reads"
    next_safe_action: "Bind successor certificates and receipts to verified promotion evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-sealed-artifacts.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-sealed-artifacts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Semantic reference fields are checked against fixed expected artifact kinds"
      - "Resolved evaluator capsules must carry the same epoch as the consuming material"
      - "Access roles are normalized and validated before visibility or dependency evaluation"
      - "Unknown or malformed access roles use the candidate-restricted policy"
---
# Decision Record: Read-Time Reference, Epoch, and Consumer-Role Integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Enforce semantic reference integrity during verified reads

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | Deep Improvement Common maintainers |

<!-- ANCHOR:adr-001-context -->
### Context

The sealed store proved that an embedded reference existed and that its descriptor, digest, and bytes were internally consistent. That was insufficient for semantic slots. A raw trial output could occupy `candidateInputReference`, `baselineInputReference`, or `evaluatorCapsuleReference` and still satisfy dependency closure. Promotion evidence could also declare epoch 1 while binding a genuine epoch-2 evaluator capsule because only the promotion material's own epoch was compared to caller policy.

### Constraints

- The shared phase-007 `SealedArtifactStore` remains the only sealer and verified-read authority.
- Existing public exports and function signatures remain unchanged for agent-improvement, model-benchmark, and skill-benchmark.
- Generic evidence, output, trace, source, incumbent, rollback, and dependency references remain open to multiple sealed artifact families.
- Refusals return no artifact bytes.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: verify every embedded artifact-reference field with an expected kind and compare every resolved evaluator capsule epoch to the consuming material epoch.

**How it works**: The adapter enumerates embedded reference fields before recursive closure. Semantic fields use fixed kinds: candidate input, baseline input, evaluator capsule, canary epoch, parent candidate, and superseded canary. Generic fields pass their sealed reference's declared kind to `readVerified`, preserving their multi-family contract while still using the kind-checked store path. When a verified reference resolves to an evaluator capsule, its internal `evaluatorEpochId` must equal the consuming material's epoch. The existing caller-policy epoch comparison remains a separate gate.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Field-aware checks in the shared reader** | One invariant for every consumer; no call-site changes; real store remains authoritative | Adds bounded verified reads while walking closure | 9/10 |
| Validate only in `readDeepImprovementPromotionEvidence` | Small patch | Generic reads and raw-trial reads would retain the defect | 3/10 |
| Require extension lanes to pass expected kinds and epochs | Explicit at each caller | Breaks backward compatibility and invites three semantic forks | 2/10 |

**Why this one**: The shared reader already owns dependency closure and typed refusals. Extending that boundary fixes both public read paths without widening the API or duplicating policy in extension lanes.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Wrong-kind candidate, baseline, evaluator, canary, parent-candidate, and superseded-canary bindings fail before bytes are released.
- Mixed evaluator epochs fail with typed `EPOCH_MISMATCH` evidence even when the consuming material matches caller policy.
- All extension lanes inherit the checks through unchanged public exports.

**What it costs**:

- Recursive verification may revisit a reference under a stronger field-specific expectation. Mitigation: expectations are deduplicated by digest and expected kind within each material while recursive expansion remains digest-visited.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-constraining generic evidence fields | H | Generic fields retain their declared sealed kind instead of receiving a fixed common-artifact kind |
| Losing the original store failure shape | M | Store failures are wrapped as typed `DEPENDENCY_MISMATCH` with field, expected kind, actual kind, digest, and cause |
| Epoch logic replaces caller policy | H | Evaluator-capsule equality is additive; the caller-required epoch check remains intact |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two real-store regressions returned promotion-eligible before the fix |
| 2 | **Beyond Local Maxima?** | PASS | The design covers both common and promotion reads plus nested common dependencies |
| 3 | **Sufficient?** | PASS | One internal field map and one recursive verifier close both defects |
| 4 | **Fits Goal?** | PASS | The change stays inside the shared sealed-artifact adapter and focused suite |
| 5 | **Open Horizons?** | PASS | Generic reference families remain extensible and public contracts remain unchanged |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `deep-improvement-common-sealed-artifacts.ts` enumerates and verifies every embedded reference with a field-specific expected kind.
- The same verifier parses resolved evaluator capsules and compares their internal epoch to the consuming material epoch.
- The focused real-store suite proves three wrong-kind rejections, one mixed-epoch rejection, and a matching eligible control.

**How to roll back**: Revert the adapter and focused-test changes together. No schema, stored bytes, public signature, extension-lane call site, or authority flag changes require data migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Accept frozen-store seal-time reference borrowing as a read-mitigated substrate boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | Deep Improvement Common maintainers |

<!-- ANCHOR:adr-002-context -->
### Context

The frozen phase-007 `SealedArtifactStore` remains the only sealer and verified-read authority. Its seal-time validation shape-checks digest fields and persists immutable material, but it permits a material whose `SealedArtifactReference` carries a `content_digest` and `descriptor_digest` belonging to a different already-sealed artifact under a mismatched kind label. In other words, seal-time acceptance does not by itself prove that a reference names the artifact family claimed by its field.

The shared sealed-artifact adapter already walks the declared dependency-closure set and performs tamper-evident reads. A mode artifact may also carry plain scalar or array digest fields that name other sealed artifacts; those values are typed digests rather than `SealedArtifactReference` fields and are outside this leaf's declared closure walk. The additive-dark posture means no consumer treats these artifacts as authoritative before the phase-014 cutover.

### Constraints

- The frozen phase-007 store cannot be changed by this leaf.
- The round-1 adapter kind-check and evaluator-epoch fix remains unchanged.
- A wrong-kind resolved reference must fail closed before any artifact bytes are released.
- Cross-artifact digest closure for successor certificates and receipts is owned by `004-certificates-and-receipts`.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: accept the frozen store's seal-time reference borrowing as a substrate boundary, mitigate declared semantic references at read time, and assign full cross-artifact digest closure to the certificates-and-receipts successor.

**How it works**: The leaf-003 shared adapter resolves each declared `SealedArtifactReference`, compares the resolved artifact's real kind with the field's expected kind, and returns a typed refusal with zero bytes when they differ. It separately requires every resolved evaluator capsule to carry the same epoch as the consuming material. This read-time mitigation does not claim that the frozen store rejects every seal-time borrowed digest. The successor leaf must independently resolve named plain digests, bind them to authenticated certificates, receipts, and ledger evidence, and reject missing, reordered, mutated, stale, or unauthorized backing artifacts before any authority cutover.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Change the phase-007 store** | Closes the mismatch at the earliest boundary | Outside this leaf's authority and would change a frozen shared substrate | 3/10 |
| **Claim seal-time closure from digest shape validation** | No additional implementation work | Confuses syntactic digest validity with artifact identity and kind provenance | 1/10 |
| **Read-time kind mitigation plus successor-owned closure** | Preserves the frozen store, releases no wrong-kind bytes, and assigns full evidence closure to the certificate authority | Seal-time borrowed references remain representable until a verified read or successor closure rejects them | 9/10 |

**Why this one**: It matches the landed adapter behavior, keeps this additive-dark leaf within its frozen-substrate scope, and makes the remaining cross-artifact obligation explicit instead of implying that the store provides it.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- A declared semantic reference that resolves to the wrong artifact kind is refused before bytes are released.
- A promotion that binds an evaluator capsule from a different epoch is refused even when the consuming material's own epoch matches caller policy.
- The store's immutable, tamper-evident seal/read contract remains the shared substrate for all common and extension lanes.

**What remains bounded**:

- The frozen store may still seal syntactically valid material whose reference digest pair borrows another sealed artifact under a mismatched kind label.
- Plain cross-artifact digest fields are sealed immutably as values, but this leaf does not prove that each named digest resolves to the expected artifact or authenticated evidence set.
- `004-certificates-and-receipts` must enforce cross-artifact digest closure before authority cutover; this is a forward obligation, not a residual defect in this leaf.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Re-verification reproduced seal-time acceptance of a borrowed digest pair under a mismatched kind label |
| 2 | **Beyond Local Maxima?** | PASS | Store change, seal-time shape validation, read-time kind checking, and successor closure were compared |
| 3 | **Sufficient?** | PASS | Declared semantic reads refuse wrong kinds and mixed evaluator epochs; successor closure is explicitly required for named cross-artifact digests |
| 4 | **Fits Goal?** | PASS | The boundary preserves the frozen shared store and keeps the leaf additive-dark |
| 5 | **Open Horizons?** | PASS | The certificates-and-receipts successor has a concrete closure obligation before cutover |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- Documentation records the phase-007 store's seal-time acceptance as an operator-accepted substrate boundary.
- The existing leaf-003 read path remains the mitigation: it kind-checks declared references, compares evaluator epochs, and releases zero bytes on typed refusal.
- The successor contract now explicitly requires cross-artifact digest closure over certificates, receipts, sealed references, and ledger evidence.

**How to roll back**: Revert this boundary record and its checklist/summary reconciliation together. The round-1 adapter and evaluator-epoch implementation remain unchanged; no sealed bytes or shared store behavior is migrated.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Normalize and close the consumer access-role enum before reads

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | Deep Improvement Common maintainers |

<!-- ANCHOR:adr-003-context -->
### Context

The common reader matched `accessRole` with bare string equality. Runtime callers can cross the TypeScript boundary with case or whitespace variants, so `Candidate`, `CANDIDATE`, `candidate `, and ` candidate` bypassed the candidate restriction and received the full evaluator capsule. An unrecognized role had the same unrestricted fallthrough. The separate automatic-canary-freshness default also compared the unnormalized role directly.

### Constraints

- Public exports and function signatures remain stable for the three extension lanes.
- Omitted `accessRole` retains the existing `downstream` default.
- Legitimate evaluator reads retain full evaluator material.
- Candidate and unknown-role reads of restricted artifact kinds return a typed refusal with no artifact bytes or material.
- The semantic kind checks, evaluator-epoch checks, and frozen-store boundary remain unchanged.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: trim and case-fold the runtime role, validate it against the closed `canary`, `candidate`, `downstream`, `evaluator`, and `promotion` enum, and map unknown or malformed values to `candidate`, the most restrictive existing role.

**How it works**: The shared reader computes one normalized role before any artifact or dependency read. Restricted artifact kinds are refused immediately for the candidate policy, so denial is stable even when the off-limits artifact has an invalid dependency closure. The same normalized role controls the automatic fresh-canary default for canary and promotion consumers. Exact enum validation remains in place for sealed material kinds, canary lifecycle, and promotion result fields; those comparisons already fail closed because malformed material is rejected by the closed material parser before policy evaluation.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Normalize once and validate the closed role enum** | One inherited rule for all consumers; preserves signatures; reuses the normalized value for visibility and freshness | Runtime normalization accepts harmless case and surrounding-space variants of legitimate roles | 10/10 |
| Compare every spelling at each branch | Small local expressions | Easy to miss variants and repeats the fail-open pattern in freshness logic | 2/10 |
| Reject every non-exact spelling | Strict wire format | Breaks compatible callers without improving the visibility boundary over normalized closed-enum handling | 5/10 |
| Leave unknown roles unrestricted | Preserves the old fallthrough | Violates fail-closed visibility and exposes evaluator material | 0/10 |

**Why this one**: Normalization plus closed-enum validation makes the runtime boundary explicit, centralizes the policy for all extension lanes, and gives unknown input the most restrictive established semantics without changing the public API.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:

- Candidate role variants and unknown roles cannot release full evaluator, baseline, raw-trial, canary, or promotion material.
- Evaluator reads still return the complete capsule, providing a positive control against accidental universal denial.
- Denied consumers receive the same typed visibility refusal before dependency validation can reveal off-limits artifact state.
- Canary and promotion role variants receive the intended automatic freshness default.

**What it costs**:

- Runtime callers that passed an undocumented unknown role now receive candidate-restricted behavior instead of unrestricted material.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Normalization accidentally widens the role set | H | Membership is checked only after trim and case-fold against a five-value closed set |
| Visibility denial leaks artifact state through dependency errors | H | The role veto runs before artifact and dependency reads |
| Extension lanes fork the rule | H | They continue delegating through the unchanged shared reader exports |
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The focused regression failed because a case variant returned full material |
| 2 | **Beyond Local Maxima?** | PASS | Role normalization, unknown handling, freshness defaults, and veto ordering were audited together |
| 3 | **Sufficient?** | PASS | Six restricted inputs are refused, evaluator access remains full, and denial precedes invalid dependency closure |
| 4 | **Fits Goal?** | PASS | The change is internal to the shared adapter and focused suite |
| 5 | **Open Horizons?** | PASS | New roles require an explicit closed-enum policy choice instead of inheriting unrestricted fallthrough |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:

- `deep-improvement-common-sealed-artifacts.ts` normalizes and validates `accessRole` once, maps malformed values to the candidate policy, and runs the visibility veto before artifact reads.
- The normalized role also drives the fresh-canary default.
- The focused suite rejects canonical, case-varied, whitespace-varied, and unknown restricted roles without bytes or material; it proves the evaluator control still receives full capsule fields and budget policy.

**How to roll back**: Revert the shared adapter, focused role assertions, and this decision together. No schema, stored bytes, public signature, extension-lane call site, or authority flag requires migration.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
