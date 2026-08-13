---
title: "Identity and Lock Ownership Hardening"
description: "Fail-closed identity binding and process-shared ownership boundaries for authorized transitions, staged leaf publication, append locks, and fresh loop-lock acquisition."
trigger_phrases:
  - "identity and lock ownership hardening"
  - "deep-loop remediation 033"
  - "gateway identity fail closed"
  - "append lock owner token"
  - "leaf publication single winner"
importance_tier: "critical"
contextType: "specification"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
    last_updated_at: "2026-08-06T05:29:50Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Landed all 5 findings as 4446839af8 on skilled/v4.0.0.0; FULL 32/32 matrix green"
    next_safe_action: "None — all findings landed"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Identity validation is required for bound or resolver-backed authority and non-legacy/shadow modes; unbound legacy/shadow adapters remain allowed by design."
      - "Policy authorization state is explicit at every registration site; closure-only state is rejected."
      - "Leaf publication claims the shared append lock before staging, publishing, and appending."
      - "Append-lock reclaim and release verify a pid-plus-nonce owner token, and restore claims the path without overwriting a live inode."
      - "Fresh loop-lock acquisition uses openSync(lockPath,'wx') (O_EXCL) create-then-write, which guarantees a single exclusive winner but leaves the partial-record window open; closing it is a per-mode 014-cutover precondition. The release/reclaim path uses rename-based single-inode claims with a vacancy-guarded restore."
---
# Feature Specification: Identity and Lock Ownership Hardening

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `032-docs-drift-and-p2-batch`; successor `035-cli-adapter-stress-and-playbooks`.

> **STATUS: LANDED.** All five findings (F001-F005) landed as `4446839af8` on
> `skilled/v4.0.0.0` on the third attempt. The first two attempts produced a 451-test
> per-mode regression that could not be isolated within budget and were reverted; the
> postmortem, hard lesson, and the conditions that let the third attempt succeed are in
> `handover.md`. The FULL per-mode matrix (32/32 files) and owned substrate suites are
> green; `tsc` rc 0.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The deep-loop runtime had four confirmed authorization and cross-process ownership defects. An identity gateway could allow caller fields without a binding in modes where identity was required, policy identity omitted implicit closure state, staged leaf publication only serialized within one process, and append-lock reclaim/release could remove a live or successor owner. The fresh loop-lock path also exposed a partial-record window; this packet hardens the loop-lock release/reclaim boundary, while the fresh-acquisition partial-record window remains open as a documented per-mode 014-cutover precondition.

The remediation makes identity and policy state explicit, adds process-shared single-winner boundaries, and makes ownership transitions compare-and-delete. The existing gateway-only append, hard-private mutator, idempotent replay short-circuit, and their passing tests remain in scope as invariants.

**Key Decisions**: reject closure-only policy state; use token-checked filesystem ownership; harden loop-lock release/reclaim ownership (fresh-acquisition atomic publication remains an open per-mode 014-cutover precondition).

**Critical Dependencies**: the runtime TypeScript compiler, direct Vitest runner, and the existing 024 hardening contract.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete (5/5 findings landed as `4446839af8`) |
| **Created** | 2026-08-05 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The authorization gateway skipped identity comparisons when authority bindings and resolver output were absent, allowing caller-supplied identity fields to pass unvalidated. Policy registration hashed evaluator source but not implicit closure state. Independent processes could also enter the same leaf publication or append-lock lifecycle without a shared ownership proof, and a fresh loop-lock owner could be observed before its record was complete.

### Purpose

Make every identity and ownership decision fail closed or single-winner across process boundaries while preserving the durable-write guarantees already shipped in 024.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Gateway identity resolution and denial behavior for actor, capability, and evidence fields.
- Explicit authorization-state binding in the transition policy registry and its runtime/test registrations.
- Shared leaf publication claim covering staging, publication, and state-log append.
- Append-lock owner tokens, dead-owner reclaim, compare-and-delete release, and compare-and-swap restore.
- Loop-lock release/reclaim ownership hardening, and analysis of the fresh-acquisition partial-record window (documented as an open per-mode 014-cutover precondition), plus deterministic three-process append-lock race coverage.
- Red-before/green-after tests, owned runtime suites, TypeScript verification, packet docs, and child metadata.

### Out of Scope

- The 024 packet's scope, checklist, tasks, spec, and implementation record. Those files are frozen.
- The four pre-existing failure files: `render-command-contract`, `check-contract-drift`, `legacy-projections`, and `review-depth-convergence`.
- New lease semantics, event-envelope schema changes, or deployment behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/authorized-ledger/transition-authorization-gateway.ts` | Modify | Validate identity when required by bindings, resolver configuration, or authority mode; retain the no-binding legacy/shadow path and authority-outage fallback. |
| `runtime/lib/authorized-ledger/transition-policy-registry.ts` | Modify | Require explicit serializable authorization state and digest it. |
| `runtime/lib/deep-loop/leaf-artifact-writer.ts` | Modify | Use the shared append lock and report the publishing winner. |
| `runtime/lib/deep-loop/atomic-state.ts` | Modify | Tokenize, reclaim, restore, and release append locks safely. |
| `runtime/lib/deep-loop/loop-lock.ts` | Modify | Harden the release/reclaim path (rename-guarded claim-then-owned-unlink); fresh acquisition unchanged (`openSync(lockPath,'wx')`), its partial-record window recorded as an open per-mode 014-cutover precondition. |
| `runtime/tests/unit/` and `runtime/tests/fixtures/` | Modify | Add negative/race tests and explicit identity fixtures. |
| `033-identity-and-lock-ownership-hardening/` | Create | Record requirements, decisions, verification, and metadata. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The gateway must fail closed when identity validation is required and the available authority cannot resolve a caller-supplied identity field. | An identity-required authorize request with no bindings, no resolver, and an actor ID returns `deny` with `identity:actorId`; unbound `shadowing` and `legacy_authoritative` adapters remain allowed by design; forged actor, capability, and evidence tests still deny. |
| REQ-002 | Policy identity must include explicit authorization state. | A registration without explicit state is rejected; two registrations with identical evaluator source and different explicit state have different policy digests. |
| REQ-003 | Leaf publication must have one process-shared winner per iteration. | Two processes contending for one iteration yield one `published: true`, one `published: false`, one delta, and one state-log record. |
| REQ-004 | Append-lock ownership must be tokenized and reclaim/restore must not overwrite a live inode. | A live aged owner is not reclaimed; releasing an owner cannot remove a successor lock; one dead owner racing two live acquirers leaves the live winner intact. |
| REQ-005 | Fresh loop-lock ownership must never expose a partial record as reclaimable. | The release/reclaim path atomically claims ownership and never overwrites a live inode, the existing two-process falsifier confirms exactly one fresh-acquisition winner (proving single-winner admission, not partial-record elimination), and stale/release races remain green. The fresh-acquisition partial-record window itself remains open and is recorded as a per-mode 014-cutover precondition. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Existing 024 hardening must remain intact. | Gateway-only fenced append, hard-private `#appendAuthorized`, idempotent replay short-circuit, and their existing tests remain green. |
| REQ-007 | Every new negative or contention test must have red-before and green-after evidence. | The packet records the test name, failing rc, fix, and passing rc for F001-F004, including the three-process F004 stress test. |
| REQ-008 | All policy registration consumers must declare their state contract. | Runtime libraries and tests that instantiate `TransitionPolicyRegistry` provide `authorizationState` or captured state. |
| REQ-009 | Packet metadata must be generated from the completed child docs. | Description and graph metadata scripts run successfully, and strict validation reports zero errors and zero warnings. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four confirmed findings have explicit fail-closed or single-winner tests and green-after results.
- **SC-002**: F005 is classified with direct evidence: the release/reclaim path is hardened; the fresh-acquisition partial-record window remains open and is recorded as a per-mode 014-cutover precondition, not a closed item.
- **SC-003**: The nine requested owned suites pass with no failures.
- **SC-004**: TypeScript compilation returns rc 0 and strict packet validation reports zero errors and zero warnings.
- **SC-005**: No changed code comment contains a spec path or ephemeral finding, requirement, ADR, checklist, or task identifier.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing 024 append and fencing contract | A local fix could regress the shipped mutation boundary. | Keep the gateway-only append, hard-private mutator, replay short-circuit, and owned suites in every final gate. |
| Risk | Dead-owner detection cannot prove liveness for malformed lock contents. | A corrupt lock can remain until the normal acquisition timeout. | Refuse unsafe reclaim; surface the timeout rather than deleting an unverified owner. |
| Risk | Explicit policy state increases registration-site work. | A missed consumer fails at registration rather than silently sharing an identity. | Inventory every `new TransitionPolicyRegistry` call and add explicit null or state. |
| Risk | Rename-based single-inode ownership claims (reclaim, restore, release) depend on same-filesystem paths. | A cross-device boundary would make the claim fail. | The lock and target are created in the same parent directory; treat claim failure as acquisition failure. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Keep existing lock acquisition timeouts and avoid unbounded retry loops; correctness takes precedence over reclaiming an ambiguous lock.

### Security

- **NFR-S01**: Caller identity is accepted only when required validation has a matching authoritative binding or explicit resolver output; no-binding `shadowing` and `legacy_authoritative` modes are exempt by design.
- **NFR-S02**: Policy authorization state is represented in the policy digest and cannot be supplied only through an opaque closure.

### Reliability

- **NFR-R01**: A given leaf iteration and append-lock ownership transition have one durable winner across independent processes.

---

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- No authority identity fields: deny in identity-required modes; allow unbound `shadowing` and `legacy_authoritative` modes that intentionally have no identity binding.
- Multiple capability or evidence bindings: require membership, not an arbitrary single binding.
- Malformed append-lock owner record: do not reclaim it.
- PID reuse or permission error during liveness check: treat the owner as live/conservative.
- Existing staged leaf publication: recover only matching content; report the second process as not the publisher.

### Error Scenarios

- Authority provider outage: retain the existing typed `GATEWAY_FAILURE` fallback.
- Policy registration without explicit state: reject before the policy enters the registry.
- Lock acquisition timeout: report the timeout and preserve the observed owner, including when a live racer wins during dead-owner restore.
- Fresh loop-lock claim collision: return not acquired and read the existing winner record (which a concurrent reader may still observe mid-write during the open fresh-acquisition window).
<!-- /ANCHOR:edge-cases -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Five runtime surfaces, many policy consumers, and cross-process tests. |
| Risk | 24/25 | Authorization identity, durable state, lock ownership, and race safety. |
| Research | 16/20 | Confirmed findings came from direct runtime review and required red-before tests. |
| Multi-Agent | 8/15 | Separate identity, policy, leaf, append-lock, and loop-lock workstreams. |
| Coordination | 13/15 | Existing 024 guarantees and frozen packet boundaries constrain changes. |
| **Total** | **82/100** | Level 3 security-sensitive concurrency remediation. |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Identity binding changes turn an old permissive fixture into a typed denial. | High | High | Add explicit bindings/resolvers to legitimate consumers and retain negative forged-identity tests. |
| R-002 | A stale-lock fix deletes a live or successor owner. | High | Medium | Record pid-plus-nonce, verify liveness after claim, and compare tokens before deletion. |
| R-003 | Two leaf writers append duplicate state. | High | Medium | Hold the shared append lock across stage, publish, append, and cleanup. |
| R-004 | A fresh loop-lock reader parses partial JSON. | High | Medium | Fresh acquisition still uses `openSync(path,'wx')` create-then-write; the partial-record window remains open. Closing it via the existing `writeLoopLockAtomic` temp+rename helper is a per-mode 014-cutover precondition, not yet applied to fresh acquisition. |
| R-005 | Documentation claims completion without current evidence. | Medium | Medium | Record command rc and counts, regenerate metadata, and run strict validation last. |

## 11. USER STORIES

### US-001: Fail-closed identity when required (Priority: P0)

**As a** runtime operator, **I want** unresolved caller identity to be denied when the authority requires identity validation, **so that** missing bindings cannot become implicit authorization while legacy/shadow adapters retain their explicit no-binding contract.

**Acceptance Criteria**:
1. Given an identity-required available authority with no identity bindings, When a request supplies an actor ID and no resolver exists, Then the gateway returns a typed deny naming `identity:actorId`.
2. Given an unbound `shadowing` or `legacy_authoritative` authority, When a request is authorized without a resolver, Then the gateway allows the legacy/shadow write path.

### US-002: Stable policy identity (Priority: P0)

**As a** policy registry consumer, **I want** authorization state to be explicit, **so that** closure state cannot silently share a policy digest.

**Acceptance Criteria**:
1. Given two evaluator functions with identical source and different captured values, When they are registered without explicit state, Then both registrations are rejected.

### US-003: Single-winner leaf publication (Priority: P1)

**As a** deep-loop orchestrator, **I want** one process to own a leaf iteration publication, **so that** retries cannot duplicate its durable state record.

**Acceptance Criteria**:
1. Given two processes start the same iteration together, When both reach the writer, Then exactly one publishes and the state log has one canonical record.

### US-004: Safe append-lock ownership (Priority: P1)

**As a** concurrent writer, **I want** stale-lock recovery to prove owner death and release to verify my token, **so that** one process cannot remove another process's lock.

**Acceptance Criteria**:
1. Given a live owner whose lock mtime is old, When a contender tries to acquire, Then the contender times out without entering the critical section.
2. Given one dead owner and two live acquirers racing while the dead claim is restored, When both live acquirers use `openSync(..., 'wx')`, Then one owns the lock and the reclaimer never enters the critical section.

### US-005: Atomic loop-lock acquisition (Priority: P0)

**As a** loop runner, **I want** the fresh lock record to appear complete, **so that** a competing process never treats a partial record as stale ownership.

**Acceptance Criteria**:
1. Given two fresh acquisitions released by a common barrier, When both claim the path, Then `openSync(path,'wx')` (O_EXCL) guarantees exactly one reports acquired.
2. Given a concurrent reader observes the winner's record before the write completes, Then it may still see a partial file — this window is not yet closed by this packet; closing it is a per-mode 014-cutover precondition (see decision-record.md ADR-001).

### US-006: Preserve shipped guarantees (Priority: P0)

**As a** maintainer of the 024 runtime contract, **I want** remediation to leave its append and replay boundaries intact, **so that** hardening does not trade one security defect for a regression.

**Acceptance Criteria**:
1. Given the owned 024-adjacent suites, When the final verification runs, Then all existing passing tests remain green and no frozen 024 document changes.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. F005 is dispositioned as partial in ADR-001 (release/reclaim path hardened; fresh-acquisition partial-record window open as a per-mode 014-cutover precondition) based on direct code inspection and the deterministic two-process falsifier, which proves single-winner admission rather than partial-record elimination; F004 additionally has a deterministic three-process restore race.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:questions -->
