---
title: "Implementation Plan: Identity and Lock Ownership Hardening"
description: "Implement fail-closed identity and explicit policy state, then add process-shared publication and ownership boundaries with race-focused verification."
trigger_phrases:
  - "identity lock implementation plan"
  - "deep-loop remediation plan"
  - "cross-process ownership plan"
importance_tier: "critical"
contextType: "plan"
parent: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
    last_updated_at: "2026-08-06T05:29:50Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Landed all 5 findings as 4446839af8 on skilled/v4.0.0.0; FULL 32/32 matrix green"
    next_safe_action: "None — all findings landed"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "checklist.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/atomic-state.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The simplest safe design reuses the append lock for leaf publication and adds token checks to its lifecycle."
      - "The fresh loop-lock path requires atomic complete-record publication because direct writes expose a real partial window."
      - "Append-lock restore uses a rename-aside claim plus a vacancy-guarded renameSync (a non-overwriting compare-and-swap) so two live racers cannot be erased by a reclaimer."
---
# Implementation Plan: Identity and Lock Ownership Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime with Node.js filesystem primitives |
| **Framework** | Direct runtime modules, Vitest, and the Spec Kit verification scripts |
| **Storage** | Append-only JSONL, staged artifact files, and filesystem lock records |
| **Testing** | Vitest serial file execution with child-process race fixtures; TypeScript no-emit check |

### Overview

First make the identity and policy contracts explicit, because every later authorization decision depends on those identities. The gateway validates identity when a binding, resolver, or authority mode requires it, while preserving deliberately unbound legacy/shadow adapters. Then extend the existing filesystem coordination primitives: hold the shared append lock across leaf publication, use pid-plus-nonce ownership for reclaim/release, restore a detached claim with non-overwriting compare-and-swap (rename-aside claim plus vacancy-guarded `renameSync`), and harden the loop-lock release path the same way. Fresh loop-lock acquisition still uses direct `openSync(path,'wx')` create-then-write; closing its partial-record window is a documented per-mode 014-cutover precondition, not part of this packet. Finish by running the red-before/green-after evidence, all owned suites, typecheck, comment hygiene, metadata generation, and strict packet validation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement and frozen boundaries are documented in `spec.md`.
- [x] Success criteria are measurable: named negative tests, owned-suite counts, typecheck rc, and strict validation counts.
- [x] Dependencies are identified: runtime compiler, Vitest, filesystem semantics, and existing 024 guarantees.

### Definition of Done

- [x] F001-F004 acceptance criteria are covered by tests that were red before their fixes and green after.
- [x] F005 has a documented partial disposition (release/reclaim path hardened; fresh-acquisition partial-record window open as a per-mode 014-cutover precondition) and a passing deterministic two-process falsifier proving single-winner admission; F004 has a passing deterministic three-process restore race.
- [x] All owned suites and the typecheck pass.
- [x] Child metadata is regenerated and strict validation reports zero errors and zero warnings.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-closed authorization with filesystem compare-and-swap ownership claims.

### Key Components

- **Transition authorization gateway**: Validates actor, capability, and evidence identity when a binding, resolver, or authority mode requires it; preserves unbound legacy/shadow adapters.
- **Transition policy registry**: Requires explicit serializable authorization state and includes its digest in policy identity.
- **Leaf artifact writer**: Uses the append lock as a process-shared publication claim for one iteration.
- **Atomic append state**: Stores pid-plus-random-nonce owner records and reclaims/releases only after token checks; restore claims the lock path with non-overwriting CAS.
- **Loop lock**: Fresh acquisition creates the owner record directly via `openSync(path,'wx')` (O_EXCL single-winner create-then-write; the partial-record window remains open). The release/reclaim path claims the lock with `renameSync` and restores a detached claim only into a vacant path.

### Data Flow

An authorization request enters the gateway, which resolves identity and policy state before producing a durable decision. A successful leaf publication claims the delta-path lock, stages all artifacts, publishes them write-once, appends one state record, and releases its token. Lock contenders either observe a live owner, reclaim a provably dead token, or return the committed publication without writing again.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Gateway identity context | Builds expected actor/capability/evidence identity | Require validation for bindings, resolver configuration, or non-legacy/shadow modes; preserve unbound legacy/shadow and provider-outage behavior | F001 negative/regression tests and authorized-ledger suite |
| Policy registration | Derives implementation and policy digests | Require explicit state; include `authorizationStateDigest` | F002 closure-state rejection and captured-state digest test |
| Leaf publication | Stages and publishes three iteration artifacts | Wrap the full stage-to-append sequence in `withAppendLock` | F003 two-process contention test and leaf suite |
| Append lock | Uses a filesystem lock during JSONL append | Store owner token; reclaim only dead matching token; restore with non-overwriting CAS; compare token before release | F004 three-process race plus owner/successor tests and atomic-state suite |
| Fresh loop-lock acquisition | Creates the first owner record | Harden the release/reclaim path with rename-based claim-then-owned-unlink; fresh-acquisition write (`openSync 'wx'`) is unchanged and its partial-record window remains an open per-mode 014-cutover precondition | F005 falsifier plus loop-lock and CLI suites |
| Policy consumers | Instantiate transition registries across runtime and tests | Declare `authorizationState: null` or captured state | Registry consumer inventory and TypeScript check |

Required inventories:

- Same-class producers: `rg -n "new TransitionPolicyRegistry|withAppendLock|writeLoopLockExclusive" .opencode/skills/system-deep-loop/runtime`.
- Consumers of changed symbols: `rg -n "authorizationState|authorizationStateDigest|published|withAppendLock" .opencode/skills/system-deep-loop/runtime --glob '*.ts'`.
- Matrix axes: authority availability, binding presence, resolver output, identity field; owner liveness, token match, reclaim race, release successor; publication process count and pre-existing stage state.
- Algorithm invariant: never delete or overwrite an owner whose token was not atomically claimed and revalidated; never append a second canonical iteration line. (The related goal of never exposing a partial fresh owner record is NOT yet met at fresh acquisition — `openSync(lockPath,'wx')` create-then-write leaves that window open; closing it is an open per-mode 014-cutover precondition, not a satisfied invariant.)
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and red tests

- [x] Read the current runtime, 024 hardening, related tests, and template contracts.
- [x] Add F001, F002, F003, and F004 negative/contention tests before production fixes; F004 includes one dead owner and two live racers.
- [x] Inspect the F005 fresh-acquisition path and retain the existing cross-process falsifier.

### Phase 2: Core implementation

- [x] Add fail-closed identity resolution and retain the explicit authority-unavailable fallback.
- [x] Require explicit policy authorization state and update all registry consumers.
- [x] Serialize leaf publication through the shared append lock.
- [x] Add append-lock owner tokens, dead-owner reclaim, and compare-and-delete release.
- [x] Harden the loop-lock release/reclaim path (rename-based claim-then-owned-unlink); the fresh-acquisition write path is unchanged and its partial-record window remains an open per-mode 014-cutover precondition.

### Phase 3: Verification and handoff

- [x] Run focused red-before receipts and green-after tests.
- [x] Run all requested owned suites, typecheck, comment hygiene, metadata generation, and strict validation.
- [x] Reconcile checklist, implementation summary, and F005 ADR disposition.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit negative | Unresolved identity and closure-only policy state | Vitest named tests in `authorized-ledger.vitest.ts` |
| Cross-process contention | Leaf publication and append-lock owner lifecycle, including a three-process reclaim/restore race | Vitest child processes with barriers and control files |
| Cross-process acquisition | Fresh loop-lock winner and stale/release races | `loop-lock.vitest.ts` and `loop-lock-cli.vitest.ts` |
| Owned integration | Authorization, fencing, receipts, branch waves, replay fingerprints | Eight requested suites plus loop-lock CLI companion |
| Static | Type and comment-contract checks | Sibling `tsc`, comment-hygiene script, strict Spec Kit validator |

Red-before evidence is captured before each implementation change. Green-after evidence is captured after the corresponding fix and again in the final owned-suite gate.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../system-spec-kit/node_modules/.bin/tsc` | Internal tool | Green | Typecheck evidence unavailable. |
| Runtime `node_modules/.bin/vitest` | Internal tool | Green | Owned behavioral evidence unavailable. |
| Node filesystem `open`, `rename`, `rm`, and `fsync` | Platform primitive | Green on current host | Ownership claims would need a platform-specific fallback. |
| 024 gateway-only append and fence contract | Internal contract | Green | A regression would block completion. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any owned-suite regression, failed typecheck, or evidence that a live/successor owner can still be deleted.
- **Procedure**: Revert only the 033 runtime/test changes as one reviewed change set, leave 024 frozen docs untouched, rerun the 024 owned baseline, and restore the previous policy registration contract only together with a documented decision. No data migration or irreversible external operation is part of this packet.
- **Operational boundary**: Do not delete lock or state artifacts during rollback. Preserve them for inspection and use the existing write-once/recovery paths.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Contract inventory ──► Red tests ──► Identity and policy fixes ──► Ownership fixes ──► Final gates
                                             │                         │
                                             └── policy consumers ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract inventory | None | Red tests |
| Red tests | Contract inventory | Core fixes |
| Identity and policy | Red tests | Ownership verification |
| Ownership fixes | Red tests and identity contract | Final gates |
| Final gates | All implementation phases | Handoff |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract inventory | Medium | Completed in one review pass |
| Red tests | High | Completed with four named negative/race cases |
| Core implementation | High | Completed across five runtime surfaces |
| Verification | High | Completed with serial owned suites and static gates |
| **Total** | | **Completed** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No data backup is required because the change is runtime code and tests only.
- [x] No feature flag or migration is introduced.
- [x] Verification commands and owner boundaries are recorded in `implementation-summary.md`.

### Rollback Procedure

1. Stop the affected runtime process and preserve any lock/state evidence.
2. Revert the 033 code and test changes without touching the frozen 024 packet.
3. Run the owned-suite and typecheck gates against the reverted state.
4. Re-open this packet if a narrower fix is needed; do not silently weaken fail-closed behavior.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Restore the prior runtime revision; existing append-only artifacts remain write-once and are not rewritten.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
                 ┌────────────────────────┐
                 │ Identity and policy    │
                 │ contract + consumers   │
                 └───────────┬────────────┘
                             │
┌──────────────────┐         ▼          ┌─────────────────────┐
│ Red tests        │────► Ownership primitives ────► Final gates│
└──────────────────┘                    └─────────────────────┘
                             ▲
                 ┌────────────────────────────┐
                 │ F005 partial (release only)│
                 └────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Gateway identity | Authority/resolver contract | Typed identity denial | Authorization decision |
| Policy registry | Explicit JSON state | Stable policy identity | Gateway evaluation |
| Append lock | Filesystem atomic claim | Owner token lifecycle | Leaf and JSONL writers |
| Leaf writer | Append lock and recovery logic | One publication result | Iteration state convergence |
| Loop lock | O_EXCL create-then-write (fresh, unchanged) plus rename-based claim (release/reclaim, hardened) | Fresh owner record; hardened release ownership | Loop process admission |
| Final gates | All components | Evidence and metadata | Packet completion |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **F001/F002 contract and tests** - completed first - CRITICAL
2. **Shared ownership implementations** - completed after red tests - CRITICAL
3. **Owned suites, typecheck, metadata, and strict validation** - final evidence - CRITICAL

**Total Critical Path**: Complete; no unresolved implementation dependency remains.

**Parallel Opportunities**:

- Policy consumer updates and race-test harness preparation were independent after the registry contract was fixed.
- Documentation authoring and final code-suite reruns were independent once the implementation stabilized.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Contract and red tests | Four named negative/contention tests fail before their fixes | Complete |
| M2 | Runtime remediation | F001-F005 implementation and focused tests are green | Complete |
| M3 | Handoff gates | Owned suites, typecheck, metadata, and strict validation pass | Complete |
<!-- /ANCHOR:milestones -->

<!-- ANCHOR:ai-execution-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the active packet, frozen-scope constraints, and affected runtime files before editing.
- Add a failing negative or contention test before each runtime fix.
- Run the owned suites, typecheck, metadata generation, and strict validation before handoff.

### Execution Rules

| Rule | Application |
|------|-------------|
| TASK-SEQ | Preserve the red-before, implementation, and green-after order for each finding. |
| TASK-SCOPE | Modify runtime code/tests and this child packet only; keep frozen 024 files untouched. |
| TASK-EVIDENCE | Record command rc, named tests, and suite counts in `implementation-summary.md`. |

### Status Reporting Format

Report each gate as `command -> rc -> result`, and distinguish confirmed output from inferred behavior.

### Blocked Task Protocol

If a gate fails or scope is ambiguous, stop the implementation, record the exact command and output, and resolve the blocker before claiming completion.
<!-- /ANCHOR:ai-execution-protocol -->
