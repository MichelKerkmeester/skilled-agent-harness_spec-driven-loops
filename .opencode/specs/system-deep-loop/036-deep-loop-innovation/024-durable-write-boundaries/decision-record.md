---
title: "Decision Record: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface"
description: "Decision record for 024-durable-write-boundaries: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "durable write boundaries fencing"
  - "blocker 3 append fencing token"
  - "gateway only mutation ledger"
  - "appendAuthorized internal only"
  - "deep loop 024 fencing"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
    last_updated_at: "2026-08-03T06:05:31Z"
    last_updated_by: "codex"
    recent_action: "Recorded the runtime-enforced fence capability and ECMAScript hard-private append boundary"
    next_safe_action: "Run the final owned-suite gate and strict child validation"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gateway-only mutation: the fenced append gateway is the only exported domain mutation capability

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Operator (ruling), packet owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Report §6 step 4 calls for a decision, not automatically a build: make the fenced append gateway the only exported domain mutation capability, or accept the gap with a recorded rationale and a compensating control. `F-014-01` is CONFIRMED: `append-only-ledger.ts` has zero matches for `fenc|lease|token|highWater`, so a superseded writer holding an unexpired allow proof can append directly. Fencing exists only in an optional `FencedLedgerWriter` wrapper, which the protected-surface manifest currently describes as a mere direct replacement.

### Constraints

- This changes the exported mutation surface of the ledger that `014` is about to make authoritative, so it is the widest blast radius in the remediation tree.
- In-flight callers of the direct export must be migrated or covered during the change.
- The gap becomes a real corruption vector at cutover under multi-writer leases, per the finding's own calibration note.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Gateway-only mutation. Every append routes through the fenced writer and its coordinator-issued capability; direct `appendAuthorized` is an ECMAScript hard-private primitive reachable only through the module's capability-gated internal bridge.

**How it works**: The gateway resolves identity and evaluates policy. `FencedLeaseCoordinator.withFence` mints an opaque capability whose state is held in a module-scoped `WeakMap`; using the capability rechecks the durable current lease. `#appendAuthorized` validates that capability before reading or committing any frame. The package entry exposes neither the hard-private method nor the bridge, and the fenced writer's public API remains unchanged.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gateway-only mutation (operator ruling)** | Fencing cannot be bypassed; one place to reason about authority; the property is testable from the export surface | Breaking change to the exported surface; every caller must migrate | 9/10 |
| Accept the gap with a compensating control | No breaking change; cheaper | The control is advisory; a caller can still bypass fencing; the gap becomes a corruption vector exactly at cutover | 4/10 |
| Keep both exports, make the fenced one the documented default | No migration needed | Documentation is not enforcement; this is effectively the status quo that produced the finding | 2/10 |
| Enforce fencing inside `appendAuthorized` and keep it exported | No surface change; fencing unavoidable | Leaves two authority concepts in one function; policy and identity checks stay outside the fence | 6/10 |

**Why this one**: The operator ruled for gateway-only mutation. Beyond the ruling, it is the only option where "no unfenced append exists" is a property a test can assert from the export surface rather than a convention.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A superseded writer cannot append, which is the specific corruption vector `014` would otherwise inherit.
- Authority reasoning collapses to one entry point.
- The safety property becomes testable rather than documented.

**What it costs**:
- A breaking change to the exported surface, with every caller migrated. Mitigation: full call-site inventory first, gateway path added before the direct export is demoted, in separate commits.
- Fencing adds work on the append path. Mitigation: CHK-111 measures the overhead so a later regression is visible.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller outside this child breaks on the demotion | H | Call-site inventory (CHK-010); demotion is a separate, independently revertible commit |
| An unenumerated mutation path bypasses the gateway | H | Export-surface test (CHK-041) plus the grep inventory |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Blocker 3 is a named cutover blocker and `F-014-01` is CONFIRMED |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including the compensating-control alternative the report explicitly permits |
| 3 | **Sufficient?** | PASS | One gateway is the smallest surface on which the property is assertable |
| 4 | **Fits Goal?** | PASS | Directly discharges Blocker 3, which gates `014` |
| 5 | **Open Horizons?** | PASS | New mutation kinds are added at the gateway rather than as new exported writers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `append-only-ledger.ts` export surface and append path.
- `transition-authorization-gateway.ts` as the single mutation entry point.
- Every call site of the direct export.
- The protected-surface manifest description of `FencedLedgerWriter`.

**How to roll back**: Revert the export-demotion commit only. Fencing stays enforced inside the gateway and the direct export returns, which restores caller compatibility while preserving most of the safety gain. Record the revert as re-opening Blocker 3.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Identity-bearing gateway inputs are resolved and verified, never trusted

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, operator ruling |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-014-02` records that the gateway treats caller-supplied `actorId`, `capabilityId` and `evidenceDigest` as authority. `F-014-03` records that policy identity digests only `evaluate.toString()`, so a closure-captured allowlist can change under an unchanged policy identity. Both are the same mistake: an identity accepted rather than derived.

### Constraints

- Resolution must not require a network round trip on the append path.
- Policy digests must stay stable for identical captured state across machines.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: The gateway resolves each identity-bearing input against the authority it claims, and policy identity covers captured authorization state as well as evaluator source.

**How it works**: Each identity field is looked up and verified before the fence check; a failure produces a durable denial naming the field. The policy digest is computed over the evaluator source plus a canonical serialisation of its captured authorization state.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Resolve and verify at the gateway** | Forgery becomes impossible at the boundary; failures name the field | Resolution cost on the append path | 9/10 |
| Sign identity claims at the caller | No resolution cost | Moves the trust problem to key distribution; a stale key still authorizes | 5/10 |
| Trust the caller, audit after the fact | Zero cost | This is the status quo that produced the finding | 1/10 |

**Why this one**: Resolution at the boundary is the only option where a forged identity cannot commit a write, and the failure message tells the operator exactly which field failed.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A forged actor or capability identity is denied rather than recorded as authority.
- A changed captured allowlist changes the policy digest, so policy identity means something.

**What it costs**:
- Resolution work on the append path. Mitigation: measured in CHK-111 alongside fencing overhead.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Canonical serialisation of captured state differs across hosts | M | NFR-D01 stability test across locales |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two findings describe the same accepted-identity mistake |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed including caller-side signing |
| 3 | **Sufficient?** | PASS | Resolution plus digest coverage closes both findings |
| 4 | **Fits Goal?** | PASS | Part of making every durable write identity-verified |
| 5 | **Open Horizons?** | PASS | New identity kinds plug into the same resolution step |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `transition-authorization-gateway.ts` identity resolution.
- `transition-policy-registry.ts` digest computation.

**How to roll back**: Revert the resolution and digest commits independently; each is a separate mechanism with its own test.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Leaf artifact publication is staged and promoted atomically behind a closed parser

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, operator ruling |

---

<!-- ANCHOR:adr-003-context -->
### Context

Five findings (`F-003-02`, `F-037-01`, `F-039-01`, `F-039-02`, `F-036-04`) describe one mechanism: leaf artifact publication writes narrative, then a write-once delta, then a state record, with no rollback. A failure after the delta leaves the iteration permanently unpersistable, and the record parser accepts wrong-typed authoritative fields. `026` needs a closed parser to build slice-binding semantics on top.

### Constraints

- The write-once delta must stay write-once; the fix cannot make it rewritable.
- `026` depends on the parser, so it must land early in this child rather than at the end.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Publication stages into a temporary location and promotes atomically, and the record parser is closed so wrong-typed authoritative fields are rejected with the field named.

**How it works**: All three artifacts are written to a staging area and promoted in one step, so a crash leaves either the prior state or the complete new state. The parser validates each authoritative field's type and rejects rather than coercing.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stage and promote atomically** | A crash never strands an iteration; a clean retry always works; write-once stays write-once | Requires a staging area and a promotion step | 9/10 |
| Compensating deletes on failure | No staging area | A crash during compensation reproduces the problem one level down | 4/10 |
| Make the delta rewritable | Simplest retry story | Destroys the write-once property that other consumers depend on | 2/10 |

**Why this one**: Staging is the only option where the failure story is "either old or new" rather than "some partial state we hope to compensate".
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A failed iteration is always cleanly retryable.
- `026` gets a parser it can layer slice-binding on.
- Wrong-typed authoritative fields fail loudly instead of being coerced.

**What it costs**:
- A staging area and a promotion step. Mitigation: promotion is a rename on the same filesystem, which is atomic.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Staging area and target on different filesystems, so promotion is not atomic | M | Assert same-filesystem staging; fail closed if not |
| `026` starts before the parser lands | M | Parser is scheduled early in Phase 5 and the ownership edge is recorded in `MANIFEST.md` |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five findings describe the same non-atomic publication |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed including compensating deletes |
| 3 | **Sufficient?** | PASS | Staging plus a closed parser closes all five |
| 4 | **Fits Goal?** | PASS | Makes every durable write all-or-nothing |
| 5 | **Open Horizons?** | PASS | `026` layers on the parser without reopening this design |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `leaf-artifact-writer.ts` publication sequence and record parser.

**How to roll back**: Revert the staging commit; publication returns to the three-stage sequence. Record the revert as re-opening the five leaf-writer findings.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:derived-adrs -->
## Derived architectural decisions

### ADR-004: Carry the fencing token with the authorization proof

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-02 |
| **Deciders** | Packet owner |

**Decision**: The fencing token belongs alongside the authorization proof and is bound into the persisted authorization reference, not added to the closed event envelope.

The confirm inputs show that the event envelope is a closed 14-field structure and already carries `authority_epoch` but no fence token. The proof and persisted `AuthorizationReference` are the authority-bearing structures and can be extended without changing canonical event bytes. Proof placement keeps the envelope schema stable while making the token replay-verifiable through the durable authorization reference. Envelope placement would make fencing replay-visible earlier but would widen every envelope producer and its exact-field parser.

**Consequence**: The fenced writer supplies the current lease token to the internal append boundary; the durable reference records it for high-water verification. A proof without a current fence is not a production append capability.

### ADR-005: Use a zero-length deprecation window

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-02 |
| **Deciders** | Packet owner |

**Decision**: Do not add an internal compatibility shim. The gateway path is confirmed first, all 32 production callers are migrated in the same landing, and the package export is demoted in the immediately following ordered edit before verification. There is no released state in which a production caller has been removed from its old path without a new path.

The alternative internal shim would preserve compatibility but create a second mutation seam whose lifetime would need separate fencing and removal evidence. The operator ruling requires the window to be zero-length or explicitly shimmed; the ordered same-landing migration is the smaller durable control. White-box tests remain on the internal module path by design and are not public consumers.

### ADR-006: Share one durable single-winner primitive

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-02 |
| **Deciders** | Packet owner |

**Decision**: Reuse one `FencedLeaseCoordinator`-backed single-winner primitive for effect recovery, operator-decision commit, and exact replay-fingerprint attestation convergence.

The confirm inputs identify `FencedLeaseCoordinator` as the existing cross-process primitive: it issues monotonic tokens, uses durable `O_EXCL` mutexes, and writes recovery markers. The alternative of three local locks repeats the same race surface and would only coordinate callers inside one process. The shared primitive is scoped to keyed durable writes, so it does not couple the unrelated business logic of the three paths.

**Consequence**: Each path supplies a distinct protected resource key and performs its read/decide/append sequence under the same fencing guard. The primitive owns exclusivity; the path retains its own idempotency and conflict semantics.

### ADR-007: Derive the effect single-winner root from the ledger context by default

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-02 |
| **Deciders** | Packet owner |

**Decision**: The effect-recovery gateway derives its cross-process coordination root from the authorized writer's ledger root when the caller does not provide an explicit root. A shared temporary coordination root is the fallback for custom writers that do not expose a ledger root.

This makes single-winner semantics the default production behavior rather than an opt-in capability. The ledger-derived root keeps independent gateway instances for the same durable resource in one coordination domain; the explicit option remains available for deployments that intentionally partition storage. The fallback is shared across processes and is used only when no durable writer root is available.

**Consequence**: `F-004-01` and `F-004-02` are enforced on the default construction path. The two-process tests exercise that unconfigured path; callers no longer need to remember `singleWinnerRootDirectory` to receive cross-process exclusion.
### ADR-008: Enforce the fence with an opaque capability at the primitive boundary

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-03 |
| **Deciders** | Operator ruling, packet owner |

**Decision**: Use a coordinator-issued `FenceCapability` as a required internal append argument, backed by a module-scoped `WeakMap`. The coordinator mints the opaque object only while executing `withFence` or `withFences`; its validator checks the protected resource identity and re-runs the current-lease assertion, so an expired, released, or superseded capability fails at the ledger primitive with `STALE_FENCE`.

The ledger computes the canonical protected-resource key for its own identity and validates the capability before event preparation, proof verification, idempotency handling, or frame commit. The append implementation is `#appendAuthorized`, so a constructed ledger has no cast-reachable method. The bridge closes over the instance and is not exported from the authorized-ledger package entry; the fenced writer and the dedicated white-box test helper are its sanctioned callers. Multi-resource branch writes select the capability matching the ledger lease.

**Alternatives rejected**:

- A proof-side token alone is forgeable and does not recheck the durable current lease.
- A fence assertion only in `FencedLedgerWriter` leaves the original bypass intact.
- A public numeric token or exported mutable registry would preserve a runtime-reachable forge path.

**Consequences**: The persisted authorization reference still records the current fence token, preserving replay evidence, while the capability is process-local and never serialized. The writer's external API is unchanged. White-box tests acquire a real fence through one helper and no longer call the erased TypeScript-private method. Rollback is a code-only revert of ADR-008's capability, bridge, writer, and test-helper changes; no persisted-data migration is required.

### ADR-009: Idempotent ledger replay short-circuits at the caller, not inside the fenced writer

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-05 |
| **Deciders** | Packet owner |

**Decision**: When a caller has already matched the target event as durably committed, it returns the receipt rebuilt from the committed frame and never re-enters the fenced writer; the append boundary is entered only for a genuinely new event. The frame-to-receipt constructor already used inside the append primitive is exported so every caller builds the receipt one way.

Routing every append through the fenced writer regressed idempotent replay. The writer derives its expected head from the proof's recorded prior head and rejects with `HEAD_CONFLICT` when the live head no longer matches, before delegating to the primitive. On a replay the target event is already committed, so the live head has advanced exactly past that recorded prior head, and the pre-check rejects a legitimate replay that the primitive would have absorbed by returning the existing receipt. The four resume adapters and the contradiction/supersession exact-retry path already compute the committed match and re-verify the event bytes and the original allow decision; they now return the committed frame's receipt on that branch and enter the fenced writer only for a new append.

**Alternatives rejected**:

- Make the fenced writer idempotency-aware by delegating an already-committed replay to the primitive: breaks `receipts-and-effect-recovery`, whose concurrent replay carries a different random decision id, so the primitive throws `AUTHORIZATION_ALREADY_USED` instead of the `HEAD_CONFLICT` that consumer converts to `idempotent`, and it changes that consumer's returned status. It also mutates a security-critical primitive shared by every fenced caller.
- Return the receipt from the writer on any committed digest match: the same consumer breakage, with a result that depends on audit-append interleaving timing.

**Consequences**: Replaying a committed resume or an exact relationship retry returns the original receipt instead of failing with `HEAD_CONFLICT`. The fenced writer is untouched, so the fence keeps rejecting a genuinely new event racing an advanced head and a stale, superseded, or forged writer, and the digest and original-decision guards at each caller still run. `durableReceipt` joins the authorized-ledger public surface. Known separate blocker: the deep-ai-council resume adapter suite is masked by an unrelated pre-existing failure — its test harness holds a never-released council-ledger fence lease, so the adapter's own fenced append times out on lease acquisition before any idempotency or security assertion runs; this reproduces with the fix reverted and is out of scope for the idempotency remediation. Rollback is a code-only revert.
<!-- /ANCHOR:derived-adrs -->
