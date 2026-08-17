---
title: "Decision Record: Identity and Lock Ownership Hardening"
description: "Accepted architecture decisions for fail-closed identity, explicit policy state, and process-shared ownership boundaries."
trigger_phrases:
  - "identity ownership ADR"
  - "deep-loop lock decision record"
  - "F005 loop lock hardening decision"
  - "policy authorization state ADR"
importance_tier: "critical"
contextType: "decision-record"
parent: "system-deep-loop/036-deep-loop-innovation/011-identity-and-lock-ownership-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Landed all 5 findings as 4446839af8 on skilled/v4.0.0.0; FULL 32/32 matrix green"
    next_safe_action: "None — all findings landed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F005 is a real fresh-acquisition partial-record window; the release/reclaim path is hardened, but the window itself remains open as a per-mode 014-cutover precondition rather than dismissed as harness flakiness."
      - "Malformed append-lock ownership is treated conservatively and is never reclaimed by age alone."
      - "Shadowing and legacy-authoritative adapters intentionally have no identity binding; identity checks are required when a binding, resolver, or authority mode says they are required."
---
# Decision Record: Identity and Lock Ownership Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Use explicit identity state and token-checked atomic ownership

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-05 |
| **Deciders** | Runtime remediation owner and Codex execution verifier |
| **Scope** | Authorized transitions, leaf publication, append locks, and loop-lock acquisition |

<!-- ANCHOR:adr-001-context -->
### Context

The runtime had four confirmed defects at authorization and filesystem ownership boundaries. In identity-required modes, missing authority identity bindings could cause gateway comparisons to skip, while shadowing and legacy-authoritative adapters intentionally have no identity binding. Closure-captured authorization state was absent from policy identity. The staged leaf writer used an in-memory winner set and a racy existence check. Append-lock reclaim used age alone and release deleted unconditionally; its restore path could also overwrite a live lock created during the steal window. Direct inspection of the fresh loop-lock path found that it created the exclusive file before writing the complete owner record, which exposes a partial JSON window to a competing process.

### Constraints

- 024's gateway-only fenced append, hard-private `#appendAuthorized`, idempotent replay short-circuit, and passing tests are frozen guarantees.
- The runtime uses filesystem coordination and must remain compatible with the existing write-once and recovery protocols.
- The policy registry cannot safely introspect arbitrary JavaScript closure environments.
- Ambiguous ownership must fail closed; an age heuristic is not proof that an owner is dead.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Require explicit authorization state, fail closed on unresolved identity when identity validation is required, and use token-checked filesystem claims for every cross-process ownership boundary.

**How it works**: The gateway requires complete actor, capability, and evidence identity before policy evaluation. A missing resolver, a thrown resolution, a null result, an omitted field, or any mismatch records a typed denial and cannot produce an allow proof. Every allow decision persists `actor_id_verified`, `capability_id_verified`, and `evidence_digest_verified` as true. Prepared-decision matching and the four typed rollback switches reject digest-valid decisions whose identity flags are not all true. Historically this path was opt-in and fail-open in practice: no production gateway construction site configured a resolver, so missing identity still allowed. That fail-open behavior is retained as a historical limitation of the earlier identity-and-lock packet; the shared gateway now denies by default. Wiring a deployment identity source remains a per-mode 014-cutover precondition for a live allow, not a claim that cutover or per-mode wiring was completed here. Policy registration folds `capturedAuthorizationState` at the 8 shadow-parity harness construction sites into the digest; the registry itself still accepts `null` captured state, and enforcing it there is also a per-mode cutover precondition. Leaf publication runs under the shared append lock. Append locks carry a pid-plus-random-nonce token; reclaim claims and revalidates a dead matching token via an atomic `renameSync` single-inode claim, while release claims and deletes only its own token. If a dead-owner claim must be restored, the reclaimer uses a rename-aside claim plus a vacancy-guarded `renameSync`: the restore only proceeds when the target path is absent (`existsSync` guard), so a live winner is never overwritten; when the target is occupied, the detached claim is discarded instead. Fresh loop-lock acquisition uses `openSync(lockPath,'wx')` (O_EXCL) create-then-write, which guarantees a single exclusive winner but leaves the target path observable before the record is fully written — the partial-record window is not closed by this packet.

**F005 disposition**: Partial. Direct code inspection confirmed a real fresh-acquisition partial-file window. The release/reclaim path is hardened (rename-guarded claim-then-owned-unlink closes the TOCTOU release race). The fresh-acquisition partial-file window itself remains open: closing it — for example by adopting the existing `writeLoopLockAtomic` temp-file-plus-fsync-plus-`renameSync` helper for fresh acquisition, the same pattern already used elsewhere in this file — is a per-mode 014-cutover precondition, not a completed item. The existing two-process falsifier was retained and stabilized with a common readiness barrier; it proves single-winner admission (the `O_EXCL` create can only succeed once), not partial-record elimination.

**F004 re-fix**: The retained owner/successor checks do not cover a reclaimer racing two independent live acquirers. The new deterministic three-process test pauses the reclaimer after it detaches the dead owner, mutates the detached claim, then releases two `openSync(..., 'wx')` racers before the restore commit. The CAS restore preserves the one live winner and prevents the reclaimer from entering the critical section.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit state plus token-checked atomic claims** | Auditable, fail closed, reuses existing filesystem primitives, and handles successor races | Adds registration fields and a small claim/retry path | 9/10 |
| Infer closure state from `evaluate.toString()` | No call-site changes | JavaScript source cannot expose runtime closure values reliably; identical source can hide different state | 2/10 |
| Keep age-only reclaim and tighten the threshold | Small code change | A live slow owner can still be removed; threshold selection is not proof | 1/10 |
| Hold only a delta existence check for leaf publication | Low overhead | Check-then-publish remains cross-process racy | 3/10 |
| Write fresh loop-lock JSON directly after `O_EXCL` (this is the shipped fresh-acquisition behavior; unchanged by this packet) | Familiar, simple, single syscall create | The target inode is observable while incomplete — a real, still-open partial-record window | Shipped as-is; not a rejected alternative. Closing the window (e.g. via `writeLoopLockAtomic` temp+rename) is an open per-mode 014-cutover precondition, deferred rather than scored against alternatives here. |
| Restore by `existsSync` plus `renameSync` | Small and familiar | A live inode created after the check can be overwritten during restore | 1/10 |

**Why this one**: It optimizes for correctness at the exact boundaries where a false allow or duplicate owner can become durable. It also keeps the existing lock and recovery architecture rather than adding a second coordination subsystem.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Missing, thrown, null, partial, or mismatched identity is a durable typed denial at the shared gateway instead of an implicit allow.
- Identity verification flags cannot be false on an allow decision; prepared-decision matching and typed rollback switches refuse unverified identity before certificate issuance.
- Closure-only policy state cannot share an identity with a policy whose state differs.
- Independent leaf writers and appenders have one process-shared winner, with write-once replay preserved.
- Live, dead, malformed, and successor ownership states have conservative, testable behavior.
- A live lock created during dead-owner restore wins atomically; the detached claim is discarded without removing that live inode.
- Fresh loop-lock acquisition admits a single exclusive winner (`O_EXCL`); the partial-record window a concurrent reader can still observe during fresh acquisition remains open and is documented as a per-mode 014-cutover precondition, not closed by this packet.

**What it costs**:

- Construction sites that do not supply a complete matching identity resolver now receive a typed denial instead of an implicit allow. Mitigation: pin actor, capability, and evidence at legitimate writers; do not restore fail-open.
- Every transition policy registration must declare `authorizationState: null` or explicit state. Mitigation: the registration inventory and TypeScript gate catch omissions early.
- Dead or malformed locks can wait for the existing five-second acquisition timeout. Mitigation: preserve the lock for inspection rather than risk deleting a live owner.
- Leaf publication takes the existing append-lock critical section across staging and publication. Mitigation: staged writes are local filesystem operations and the winner path remains bounded by existing timeout behavior.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A resolver returns incomplete identity | H | The gateway checks every request identity field and denies the first unresolved field. |
| PID liveness is ambiguous because of permission or reuse | H | Treat non-`ESRCH` results as live and require token match after atomic claim. |
| Rename-based single-inode claim is unsupported across a device boundary | M | Temp and target are siblings; claim errors fail acquisition rather than overwrite. |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four findings were confirmed by direct runtime read; F005 had a concrete partial-file window. |
| 2 | **Beyond Local Maxima?** | PASS | Explicit state, shared lock reuse, token claims, and the deferred fresh-acquisition atomic-publication option were compared against source-only and age-only alternatives. |
| 3 | **Sufficient?** | PASS | The implementation uses the existing gateway and filesystem boundaries without introducing a new coordinator. |
| 4 | **Fits Goal?** | PASS | The changes target identity, policy identity, leaf publication, append ownership, and loop-lock acquisition only. |
| 5 | **Open Horizons?** | PASS | The design leaves a clear extension point for richer owner liveness evidence without weakening the conservative default. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Gateway identity context records unresolved fields and denies before policy evaluation; provider outages retain `GATEWAY_FAILURE`.
- Policy registration computes `authorizationStateDigest` and rejects undefined state; all runtime/test registrations declare state.
- Leaf publication calls `withAppendLock` around recovery, staging, publication, state append, and cleanup, returning whether this process published.
- Append locks write `{pid, nonce}`, reclaim only a dead matching owner via atomic `renameSync` single-inode claim, restore detached claims with a non-overwriting rename-plus-`existsSync`-guarded compare-and-swap, and compare the token before release.
- Fresh loop locks continue to use direct `openSync(lockPath,'wx')` create-then-write (single-winner, partial-record window open); the release/reclaim path now uses a rename-based claim-then-owned-unlink.
- Tests cover red-before failures, eight shadow-parity adapters plus their harness, cross-process contention, the three-process owner/restore race, owner/successor races, and the retained fresh-acquisition falsifier.

**How to roll back**: Revert this packet's runtime and test changes as a reviewed unit, preserve all lock/state artifacts for inspection, leave 024 documents untouched, and rerun the owned gates. No data migration or external deployment action is required.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
