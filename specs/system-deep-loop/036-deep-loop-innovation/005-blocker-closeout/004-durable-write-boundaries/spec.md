---
title: "Feature Specification: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface"
description: "`appendAuthorized` validates decision, prior head, expiry and authority epoch but contains zero fencing, lease, token or high-water-mark logic, so a superseded writer holding an unexpired proof can append directly. The operator has ruled for GATEWAY-ONLY MUTATION: every append routes through the transition-authorization gateway enforcing fencing tokens, and direct `appendAuthorized` becomes internal-only. Around that ruling sit the same-mechanism concurrent-write defects across locks, leases, effects, attestations and leaf artifact publication."
trigger_phrases:
  - "durable write boundaries fencing"
  - "blocker 3 append fencing token"
  - "gateway only mutation ledger"
  - "appendAuthorized internal only"
  - "deep loop 024 fencing"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/004-durable-write-boundaries"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Re-verified Blocker 3 vs HEAD; fencing primitive absent, cited SHA unrelated"
    next_safe_action: "Implement REQ-001/REQ-002 fencing; fix fence_token regression; re-verify"
    blockers:
      - "Blocker 3's fencing mechanism (FenceCapability / #appendAuthorized / STALE_FENCE at the ledger primitive) is absent from runtime/lib/authorized-ledger; confirmed by diff and grep."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 35
    open_questions: []
    answered_questions:
      - "OPERATOR RULING: GATEWAY-ONLY MUTATION. All appends route through the transition-auth gateway enforcing fencing tokens; direct appendAuthorized becomes internal-only. IMPLEMENTED — landed via `5c98e4654e4` + the 024 fencing fix set (`30a0089a3b`, `39015ed14c`, `27e6c2b5a9`, `5b6d9e86b9a`); gateway code present in `append-only-ledger.ts`, `authorized-ledger.vitest.ts` 34/34 green (2026-08-10)."
      - "This child owns `runtime/lib/deep-loop/leaf-artifact-writer.ts` structurally: atomic staged publication plus a closed runtime parser. `026` layers slice-binding semantics on top. This part shows real diffs and passing in-process tests."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `003-legacy-compat-event-vocabulary`; successor `003-artifact-certificate-binding`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Blocker 3 is that the authorized append enforces no fencing. A grep of `append-only-ledger.ts` for `fenc|lease|token|highWater` returns nothing: `appendAuthorized` checks decision, prior head, expiry and authority epoch, and fencing lives only in an optional `FencedLedgerWriter` wrapper that a caller can bypass. The operator has ruled for gateway-only mutation, which turns the fenced gateway from an opt-in wrapper into the only exported way to mutate the ledger. That ruling changes the exported mutation surface of the ledger `014` is about to make authoritative, which makes this the largest blast radius in the remediation tree.

**Key Decisions**: GATEWAY-ONLY MUTATION: the fenced append gateway is the only exported domain mutation capability and direct `appendAuthorized` becomes internal-only — operator ruling, recorded Accepted (ADR-001); identity-bearing inputs are verified at the gateway rather than trusted from the caller (ADR-002); leaf artifact publication is atomic and staged (ADR-003)

**Critical Dependencies**: `021` — honest baselines. This child gates `025`, `027`, and the file-level dependency `026` has on `leaf-artifact-writer.ts`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Blocker 3 DISCHARGED — the fencing GO-set is BUILT + verified + adversarially clean + landed: B1 append-boundary fence + F-018-03 fence_token (`39015ed14c`), B2 gateway identity fail-closed (`27e6c2b5a9`), B3 policy-identity digest (`5b6d9e86b9`), B4 loop-lock atomic publish (`ff3a574014`). REQ-001/002 met: `appendAuthorized` is hard-private `#appendAuthorized`, reachable only via a coordinator-minted capability re-checked against the durable current lease; a superseded writer is rejected with STALE_FENCE before any frame commits. B5/B6 + F-004-01/02/03 were T001-REFUTED (already remediated — see `t001-disposition.md`). A final independent adversarial pass could not refute B1–B4. **Documented residual (elective):** token-replay — an active in-process actor reading the public current token can mint a matching capability, but it is bounded by the exclusive-lock + prior-head CAS + single-use dedup (no double-commit, no content forgery, out of the stated threat model). **Operator-decision caveat:** B2's new required identity-verified fields with `event_version` unchanged reject pre-existing dark-ledger audit frames (availability, not integrity). See `implementation-summary.md`, `build-spec.md`, `t001-disposition.md`. |
| **Created** | 2026-07-30 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/004-durable-write-boundaries` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W2 (hard gate on 014) |
| **Findings in scope** | 18 (7 P0 / 11 P1 / 0 P2), 1 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Yes — Blocker 3 of the four named cutover blockers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`F-014-01` is CONFIRMED: `appendAuthorized` validates decision, prior head, expiry and authority epoch but contains zero fencing, lease, token or high-water-mark logic, so a superseded writer holding an unexpired proof can append directly while fencing sits in an optional wrapper. Around that boundary sit the same mechanism in nine other places. The gateway treats caller-supplied `actorId`, `capabilityId` and `evidenceDigest` as authority (`F-014-02`). The policy registry digests only `evaluate.toString()`, so a closure-captured allowlist can change under an unchanged policy identity (`F-014-03`). Branch workers run unfenced for the lease lifetime (`F-018-03`). The diff-gated JSONL append is a check-then-append race with no cross-process lock (`F-018-04`). Lock reclaim and release both mutate a shared path after a separate identity read (`F-018-01`, `F-018-02`, `F-003-01`). Torn-tail quarantine can remove a frame before its recovery marker is durable (`F-002-01`). Cyclic request data throws before a durable denial is built (`F-002-02`). Three effect and attestation paths let two callers both win (`F-004-01`, `F-004-02`, `F-004-03`). And leaf artifact publication writes narrative, then a write-once delta, then a state record with no rollback, so a failure after the delta leaves the iteration permanently unpersistable (`F-003-02`, `F-037-01`, `F-039-01`, `F-039-02`, `F-036-04`).

### Purpose
Make every durable write ownership-elected, identity-verified and all-or-nothing, with the fenced gateway as the only exported mutation capability.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The review report states that in
> every confirmed case the actor is the operator or a stale local file, not a remote attacker. Read
> every P0 and P1 below as **cutover-readiness and robustness risk, not breach risk**. A finding's
> severity label is not a licence to treat it as a security incident.

> **Finding = hypothesis.** Only 13 of the 166 register findings carry a `CONFIRMED*` mark. Every
> other finding in the scope table below is an unverified single-leaf report. No fix may be built
> against an unconfirmed finding: T001 re-reads every cited `file:line` at HEAD and records
> `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any edit.

### Non-Goals
- Certificate and sealed-artifact binding — that is `025`, which consumes the receipt and proof primitives this child lands.
- Alignment slice-binding semantics on top of the leaf record parser — that is `026`.
- Mode gates and rollback switches — that is `027`.
- Fan-out dispatch containment — that is `028`, even though it shares the `runtime/lib/deep-loop/` directory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- GATEWAY-ONLY MUTATION: the fenced append gateway becomes the only exported domain mutation capability; direct `appendAuthorized` is demoted to internal-only.
- Fencing tokens enforced at the append boundary, with a high-water mark that rejects a superseded writer holding an unexpired proof.
- Gateway identity verification: `actorId`, `capabilityId` and `evidenceDigest` are resolved and verified rather than trusted from the caller.
- Policy identity that covers captured authorization state, not only `evaluate.toString()`.
- Branch workers fenced for the lease lifetime.
- A cross-process lock for the diff-gated JSONL append.
- Lock reclaim and release made identity-verified and atomic against a successor.
- Torn-tail quarantine ordered so the recovery marker is durable before a frame is removed.
- A durable denial for cyclic or throwing request data, rather than a rejected promise.
- Single-winner semantics on the three effect and attestation paths.
- Atomic staged leaf artifact publication plus a closed runtime parser for the reported record. **This child owns `leaf-artifact-writer.ts` structurally**; `026` layers slice-binding on top of the parser.
- The protected-surface manifest updated so `FencedLedgerWriter` is no longer described as a mere direct replacement.

### Out of Scope
- Certificate issuance and offline verification (`025`).
- Alignment coverage, seal state and lane identity (`026`).
- Readiness gates and rollback switches (`027`).
- Fan-out dispatch and write containment (`028`).

### Findings in Scope (18)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-014-01` | P0 | CONFIRMED | `runtime/lib/authorized-ledger/append-only-ledger.ts:298` | Ledger append can bypass the fencing-token boundary |
| `F-014-02` | P0 | unverified | `runtime/lib/authorized-ledger/transition-authorization-gateway.ts:113` | Caller-controlled identity strings can forge writer authority |
| `F-014-03` | P0 | unverified | `runtime/lib/authorized-ledger/transition-policy-registry.ts:97` | Policy identity omits captured authorization state |
| `F-018-01` | P0 | unverified | `runtime/lib/deep-loop/loop-lock.ts:274` | Stale lock reclamation can move a refreshed lock without identity verification |
| `F-018-02` | P0 | unverified | `runtime/lib/deep-loop/loop-lock.ts:705` | Lock release can delete a successor after a stale identity check |
| `F-018-03` | P0 | unverified | `runtime/lib/branch-leases-waves/durable-orchestrator.ts:675` | Branch worker side effects are not fenced for the lease lifetime |
| `F-018-04` | P1 | unverified | `runtime/lib/deep-loop/atomic-state.ts:337` | Cross-process diff-gated JSONL append is a check-then-append race |
| `F-002-01` | P1 | unverified | `runtime/lib/authorized-ledger/immutable-frame-store.ts:502` | Torn-tail recovery can quarantine bytes without durable recovery evidence |
| `F-002-02` | P1 | unverified | `runtime/lib/authorized-ledger/transition-authorization-gateway.ts:130` | Cyclic or throwing request data bypasses durable default denial |
| `F-004-01` | P1 | unverified | `runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:615` | Concurrent recovery callers can both execute the same unresolved effect |
| `F-004-02` | P1 | unverified | `runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:760` | Conflicting operator decisions can both commit and drive side effects |
| `F-004-03` | P1 | unverified | `runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts:373` | Concurrent exact attestation writes do not converge idempotently |
| `F-003-01` | P1 | unverified | `runtime/lib/deep-loop/loop-lock.ts:705` | Lock release can unlink a successor owner's lock after a reclaim race |
| `F-003-02` | P1 | unverified | `runtime/lib/deep-loop/leaf-artifact-writer.ts:246` | Leaf artifact publication can leave an orphaned delta without a canonical state record |
| `F-037-01` | P1 | unverified | `runtime/lib/deep-loop/leaf-artifact-writer.ts:243` | State-log append failure strands the write-once delta and defeats redispatch |
| `F-039-01` | P0 | unverified | `runtime/lib/deep-loop/leaf-artifact-writer.ts:145` | Reported finding counts can disappear before verdict reduction |
| `F-039-02` | P1 | unverified | `runtime/lib/deep-loop/leaf-artifact-writer.ts:253` | Leaf artifact persistence is not all-or-nothing |
| `F-036-04` | P1 | unverified | `runtime/lib/deep-loop/leaf-artifact-writer.ts:149` | Leaf state records accept wrong-typed authoritative fields |

`F-003-01` and `F-018-02` cite the same file and line (`loop-lock.ts:705`) from different iterations; treat them as one work unit while keeping both IDs mapped. Five findings (`F-003-02`, `F-037-01`, `F-039-01`, `F-039-02`, `F-036-04`) are all `leaf-artifact-writer.ts`, which this child owns structurally.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts` | Modify | Enforce fencing at the append boundary; demote `appendAuthorized` to internal (`F-014-01`, CONFIRMED) |
| `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts` | Modify | Verify identity-bearing inputs; build a durable denial for cyclic input (`F-014-02`, `F-002-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts` | Modify | Cover captured authorization state in the policy digest (`F-014-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts` | Modify | Order torn-tail quarantine after a durable recovery marker (`F-002-01`) |
| `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts` | Modify | Fence branch workers for the lease lifetime (`F-018-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts` | Modify | Single-winner recovery and operator-decision commit (`F-004-01`, `F-004-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts` | Modify | Idempotent convergence for concurrent exact attestations (`F-004-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts` | Modify | Identity-verified atomic reclaim and release (`F-018-01`, `F-018-02`, `F-003-01`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts` | Modify | Cross-process lock for the diff-gated JSONL append (`F-018-04`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts` | Modify | Atomic staged publication plus a closed record parser (`F-003-02`, `F-037-01`, `F-039-01`, `F-039-02`, `F-036-04`) |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts` | Modify | Superseded-writer and gateway-only-surface tests |
| `protected-surface manifest (see `runtime` references)` | Modify | Stop describing `FencedLedgerWriter` as a direct replacement; record the gateway-only rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fenced append gateway is the only exported domain mutation capability; the append primitive is ECMAScript hard-private and requires a coordinator-issued current fence capability. | The public entry exposes no direct append; a constructed ledger has no cast-reachable `appendAuthorized`; a direct internal attempt without a current capability is rejected with `STALE_FENCE` before a frame is committed. |
| REQ-002 | A superseded writer holding an unexpired authorization proof cannot append. | Superseded-writer test: acquire a fence, supersede it, attempt an append with the still-unexpired proof, observe rejection with a fencing-specific error. |
| REQ-003 | The gateway verifies `actorId`, `capabilityId` and `evidenceDigest` rather than trusting caller-supplied values. | A request carrying a forged actor or capability identity is denied; the denial names the field that failed resolution. |
| REQ-004 | Policy identity covers captured authorization state, so a changed closure-captured allowlist changes the policy digest. | Two policies with identical `evaluate` source but different captured allowlists produce different digests. |
| REQ-005 | Leaf artifact publication is all-or-nothing: no failure path leaves an iteration permanently unpersistable. | Crash-injection test at each stage boundary: a clean retry succeeds and no orphaned delta blocks it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Every concurrent-write race in scope has a two-process test proving single-winner semantics. | One test per race: `F-018-04`, `F-004-01`, `F-004-02`, `F-004-03`, `F-018-01`, `F-018-02`/`F-003-01`. |
| REQ-007 | Cyclic or throwing request data yields a durable `INVALID_INPUT` denial rather than a rejected promise. | Hostile-input test: cyclic request data produces a persisted denial record and a typed error, not an unhandled rejection. |
| REQ-008 | Branch workers are fenced for the lease lifetime. | A worker whose lease is revoked mid-flight cannot commit a side effect afterward. |
| REQ-009 | Torn-tail quarantine writes its recovery marker durably before removing a frame. | Crash-injection between marker write and frame removal leaves a recoverable store. |
| REQ-010 | The leaf record parser is closed: wrong-typed authoritative fields are rejected rather than coerced. | A record with a wrong-typed authoritative field is rejected with the field named (`F-036-04`). |

### Universal - applies to every child in the 021-032 remediation tree

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Confirm before build. Every finding ID in the scope table is re-read at HEAD and classified `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit. | T001 output table in `tasks.md` lists all scoped IDs with a classification and a cited probe, test, commit, or new anchor. |
| REQ-U02 | Baseline before delta. Every suite this child touches is run **before** any edit and its real numbers recorded; the whole gate is re-run at close and reported as a delta. | Pre-edit and post-edit runs of the named runners are recorded in `checklist.md` with discovered-test counts, pass/fail/skip, and exit codes. |
| REQ-U03 | Negative test per confirmed finding. Acceptance is a test that **fails before the fix and passes after** — never a green suite alone. | Each confirmed finding maps to a named test that is demonstrated red at the pre-fix commit and green at the post-fix commit. |
| REQ-U04 | Independent verification. An adversarial pass is run by a different actor than the builder; a gate authored alongside the change is not independent evidence. | A verification pass distinct from the build pass is recorded, naming the actor and the defects it found (or explicitly none). |
| REQ-U05 | Evidence citations are drift-proof. No completion claim cites a bare run count or a raw line number; every claim cites a **test name + suite-content digest + candidate SHA**. | `checklist.md` evidence strings contain a test name, a suite digest, and a commit SHA. Grep for bare "N/N passing" strings returns none. |
| REQ-U06 | Completion discipline. `validate.sh --strict` exits 0 for this child, all `checklist.md` items are `[x]` with evidence, and completion metadata reconciles across `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0; no doc claims a completion state another doc contradicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: The exported mutation surface exposes only the fenced gateway; a direct append is not reachable from outside the module.
- **SC-003**: A superseded writer holding an unexpired proof is rejected with a fencing-specific error.
- **SC-004**: Every named race has a two-process test proving exactly one winner.
- **SC-005**: Crash injection at every leaf-publication stage boundary leaves a state a clean retry can recover from.
- **SC-006**: Cyclic request data produces a durable denial, not a rejected promise.
- **SC-007**: `npm run typecheck && npm test` in `runtime` green, reported as a delta against the `021` baseline.
- **SC-008**: Blocker 3 discharged, and the primitives `025` and `027` consume are in place.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Changing the exported mutation surface breaks in-flight callers | High | Enumerate every call site before the change; provide the gateway path first, demote the direct export second, in separate commits |
| Risk | This is the largest blast radius in the tree and it lands under `014` | High | Isolated worktree, per-mechanism commits, and a rollback that reverts the surface change independently of the race fixes |
| Risk | Two-process concurrency tests are flaky and get skipped | Medium | Deterministic barriers rather than sleeps; a skipped concurrency test fails the checklist |
| Risk | `026` needs the leaf record parser this child owns | Medium | Land the parser early in the child so `026` can start; the file-level ownership edge is recorded in `MANIFEST.md` |
| Risk | `028` edits the same `runtime/lib/deep-loop/` directory | Medium | Different files; serialize the merge, not the work |
| Dependency | `021` honest baselines | Blocks evidence issuance | Sequence after `021` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: No exported path may mutate the ledger without passing the fenced gateway.
- **NFR-S02**: A denial must be durable before the caller observes the rejection.
- **NFR-S03**: Single-winner semantics on every contended path; two callers may never both commit.

### Recoverability
- **NFR-R01**: Every partial publication state must be recoverable by a clean retry.
- **NFR-R02**: Torn-tail recovery must never remove a frame before its marker is durable.

### Determinism
- **NFR-D01**: Policy identity must be stable for identical captured state and different for different captured state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Cyclic request data: durable `INVALID_INPUT` denial, never an unhandled rejection (`F-002-02`).
- Wrong-typed authoritative field in a leaf record: rejected with the field named (`F-036-04`).
- Empty append batch: no-op that still passes the fence check, so the fence path is never bypassed by an empty case.

### Error Scenarios
- Superseded writer with unexpired proof: rejected (`F-014-01`).
- Forged `actorId` or `capabilityId`: denied with the failing field named (`F-014-02`).
- Two concurrent recovery callers for one unresolved effect: exactly one executes (`F-004-01`).
- Two conflicting operator decisions: exactly one commits (`F-004-02`).
- Crash after the write-once delta, before the state record: a clean retry succeeds (`F-037-01`, `F-039-02`).

### State Transitions
- Lock reclaim racing a successor: the successor's lock survives (`F-018-01`, `F-018-02`, `F-003-01`).
- Lease revoked mid-flight: the worker cannot commit afterward (`F-018-03`).
- Concurrent exact attestations: converge idempotently (`F-004-03`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | 18 findings across 10 files spanning five subsystems (`authorized-ledger`, `deep-loop`, `receipts-and-effect-recovery`, `branch-leases-waves`, `replay-fingerprint`) plus a protected-surface manifest and a test file |
| Risk | 24/25 | Changes the exported mutation surface of the ledger `014` is about to make authoritative; spec names this "the largest blast radius in the remediation tree" |
| Research | 12/20 | `F-014-01` root cause already isolated by a confirmed grep; original open questions: fencing-token placement (RESOLVED — ADR-004, proof-side placement, implemented at `39015ed14c`), deprecation-window control (RESOLVED — ADR-005, zero-length window), shared vs. per-path single-winner primitive (see ADR-006/007) |
| Multi-Agent | 8/15 | Single workstream, six sequential phases (surface inventory through delta+gate), one independent adversarial verification pass (REQ-U04) |
| Coordination | 14/15 | Wave W2, hard gate on `014` Blocker 3; blocks `025`/`027` outright and gates `026`'s file-level dependency on `leaf-artifact-writer.ts`; itself gated on `021` landing first |
| **Total** | **81/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The exported-surface change breaks callers outside this child | H | M | Full call-site inventory before the change; gateway path added before the direct export is demoted |
| R-002 | Fencing is added but bypassable by an unenumerated path | H | M | Export-surface test (REQ-001) plus a grep-based inventory of every mutation entry point |
| R-003 | Concurrency tests are flaky and get disabled | M | H | Deterministic barriers; a skipped concurrency test is a checklist failure, not a warning |
| R-004 | Leaf-writer restructure collides with `026` | M | M | Parser lands early; file ownership recorded in `MANIFEST.md` |
| R-005 | Directory-level collision with `028` in `runtime/lib/deep-loop/` | M | M | Different files; serialize the merge |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: A superseded writer cannot append (Priority: P0)

**As a** operator relying on the ledger as the authority after cutover, **I want** a writer that has been superseded to be rejected even with an unexpired proof, **so that** a stale writer cannot corrupt the authoritative log under multi-writer leases.

**Acceptance Criteria**:
1. Given a writer whose fence has been superseded, When it attempts an append with an unexpired authorization proof, Then the append is rejected with a fencing-specific error.
2. Given the same scenario before this child, When it attempts the append, Then it succeeded — and that contrast is recorded as the acceptance evidence.

### US-002: A crash never strands an iteration (Priority: P0)

**As a** engineer re-running a failed leaf iteration, **I want** a partial publication to be recoverable by a clean retry, **so that** a failure after the write-once delta does not make the iteration permanently unpersistable.

**Acceptance Criteria**:
1. Given a crash injected at any leaf-publication stage boundary, When the iteration is retried cleanly, Then it succeeds and no orphaned delta blocks it.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- What compensating control covers in-flight callers during the window between adding the gateway path and demoting the direct export? The two changes are deliberately separate commits; the window must be either zero-length (same release) or covered by a documented deprecation shim.
- Does the fencing token live in the frame envelope or alongside the authorization proof? Both work; the envelope form makes the token replay-visible, the proof form keeps the envelope smaller. Decide before Phase 3.
- Do the three effect and attestation paths (`F-004-01`, `F-004-02`, `F-004-03`) share one single-winner primitive, or does each keep its own? A shared primitive is preferred but must not force an unrelated coupling.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

### P1 hardening delta

The append primitive now validates a module-scoped, coordinator-issued fence capability itself. The capability is opaque, resource-bound, and rechecks the durable current lease; the persisted authorization reference continues to carry the numeric fence token for replay evidence. The sanctioned test helper acquires the same fence used by production and replaced 89 in-scope direct white-box calls; the pre-existing `legacy-projections.test.ts` remains outside this leaf's scope.

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../001-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../001-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../001-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
