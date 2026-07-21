---
title: "Implementation Summary: Logical Branch IDs, Leases & Waves"
description: "Additive-dark branch registration, mutation-atomic fenced ownership, deterministic wave admission, and ledger-only resume around the shipped capped pool."
trigger_phrases:
  - "logical branch lease implementation"
  - "durable wave scheduler evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
    last_updated_at: "2026-07-21T04:54:46Z"
    last_updated_by: "codex"
    recent_action: "Completed durable fan-out leaf"
    next_safe_action: "Preserve legacy authority until a later cutover packet adopts the dark orchestration path"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/branch-leases-waves.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Logical Branch IDs, Leases & Waves

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-logical-branch-ids-leases-waves |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete (additive-dark) |
| **Candidate** | Uncommitted leaf delta on base `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Identity derivation** | Version 1, canonical coordinates, 128-bit SHA-256 prefix |
| **Wave policy / plan** | Version 1 / version 1 |
| **Authority** | Legacy execution, status, and checkpoints remain authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Durable fan-out can now name a branch independently of manifest order, serialize its ownership through monotonic fencing tokens, admit work in deterministic waves, and reconstruct scheduling state from a verified ledger. The implementation wraps the shipped capped pool. It does not replace that pool, introduce a second scheduler, or cut over legacy authority.

### Canonical Branch Registry

Logical IDs use only normalized model ID, branch ID, replica ordinal, and derivation version. The manifest compiler validates the entire expansion before returning any registrable branch, sorts by logical ID, rejects duplicate coordinates and forced digest collisions, and binds every registration to manifest, invocation, and wave-plan fingerprints.

### Fenced Ownership and Ledger Fold

Each branch maps to one canonical lineage-state resource. The mutation adapter serializes the shared ledger, rebuilds the verified fold, authorizes the next event, and atomically checks both the ledger and branch fences with the expected ledger head before preview and append. Dispatch, status, retry, result, salvage, and terminal records all carry the exact accepted lease tuple. Stale workers receive the substrate's typed stale-fence or lease-lost error and cannot change the accepted fold.

### Deterministic Wave Admission

The wave compiler sorts canonical branch IDs, freezes ordered membership, assigns explicit prior-wave prerequisites, and derives stable wave IDs and a plan fingerprint. Only the single ledger-admitted current wave is filtered into `runCappedPool`. A later wave requires a durable close with an explicit advance decision.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/branch-leases-waves/errors.ts` | Created | Typed fail-closed orchestration errors |
| `runtime/lib/branch-leases-waves/types.ts` | Created | Public branch, lease, wave, ledger, resume, and pool contracts |
| `runtime/lib/branch-leases-waves/logical-branch-registry.ts` | Created | Coordinate normalization, stable ID derivation, manifest compilation, and registration keys |
| `runtime/lib/branch-leases-waves/wave-plan.ts` | Created | Deterministic immutable wave compilation and replay validation |
| `runtime/lib/branch-leases-waves/event-contract.ts` | Created | Closed versioned orchestration event schema |
| `runtime/lib/branch-leases-waves/ledger-fold.ts` | Created | Canonical reducer, replay validation, and ledger-only resume view |
| `runtime/lib/branch-leases-waves/durable-orchestrator.ts` | Created | Fenced lease adapter, guarded mutations, wave admission, and pool wrapper |
| `runtime/lib/branch-leases-waves/index.ts` | Created | Public additive-dark API |
| `runtime/tests/unit/branch-leases-waves.vitest.ts` | Created | Adversarial identity, process-race, stale-fence, pool, wave, and resume fixtures |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Reconciled implementation and verification evidence |
| `implementation-summary.md` | Created | Recorded architecture, proofs, verification, and authority boundary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation composes the existing canonical event envelope, transition authorization gateway, append-only ledger, protected-resource registry, and fenced lease coordinator in temporary test roots. It imports the shipped CommonJS `runCappedPool` and `classifyLineageFailure` exports directly, then forwards concurrency, retries, lag ceiling, orphan liveness, time, and event callbacks unchanged.

The author-side quality gate found and removed three comments that named planning phases instead of durable invariants. It also replaced object-insertion-order comparison in persisted wave validation with canonical JSON comparison and moved ledger replay and authorization behind the ledger lease so valid concurrent branch writes do not race on the same expected head.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hash canonical coordinates into `lb-v1-<32 hex>` | Identity remains stable across reorder, restart, host, PID, retry, admission, and time while staying directory-safe |
| Reject noncanonical segments instead of normalizing aliases silently | Case, Unicode, traversal, and duplicate-coordinate spellings cannot create parallel identities |
| Use the shared lineage-state resource for every branch | All holders contend in one established monotonic fencing-token domain |
| Serialize replay through authorization and append under a ledger lease | Concurrent branches receive fresh expected heads without weakening fail-closed head conflict detection |
| Check ledger and branch fences together at append | A stale local completion cannot pass a check and write after a successor takes ownership |
| Treat accepted result or salvage as resume-satisfied | A crash after result acceptance but before terminal marking does not redispatch completed work |
| Keep policy outside wave compilation | Budget and partial-failure logic may authorize advance or stop without rewriting membership or ordering |
| Call the shipped pool once per admitted wave | Cap, work conservation, retry classification, stall handling, orphan handling, and ordered settlement retain one owner |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:proofs -->
## Load-Bearing Proofs

### Coordinate-Derived Identity Stability

The encoder accepts a closed tuple of model ID, branch ID, positive replica ordinal, and derivation version. Canonical bytes from that tuple are the only digest input. Reordered manifests compile to identical sorted branch IDs, manifest fingerprints, wave membership, wave IDs, and plan fingerprints. Pool indices, labels, dispatch timestamps, owners, attempts, processes, and wave ordinals are absent from the ID derivation.

### One Fenced Key Per Branch

`canonicalBranchLeaseResource` validates the exact `lb-v1` grammar and delegates `(packet_id, run_id, logical_branch_id)` to the shared lineage-state resource registry. Repeated resolution returns identical resource key and digest. Uppercase and traversal aliases fail before lease lookup. Independent processes contending for the same key produce one token-1 winner and one typed timeout; after release the next grant receives token 2.

### Mutation-Atomic Fence and No Split Brain

Every protected branch event enters one `withFences` call containing the canonical ledger lease and exact branch lease in canonical lock order. Inside that boundary, the adapter verifies the current ledger head, previews the transition against the same fold, and appends the authorized event. The stale-token fixture expires an old lease, grants a higher-token successor, then attempts dispatch, status, retry, result, salvage, and terminal commits with the old token. Every commit returns `STALE_FENCE`; stale renew and release also reject; the accepted branch remains owned by the successor with no result, salvage, or terminal mutation.

### Deterministic Immutable Waves

Equal manifest and policy input yield byte-equivalent frozen plans with stable ordinals, members, prerequisites, wave IDs, and plan fingerprint. A future wave cannot be admitted while another wave is current. Closing with `advance` is a durable policy-neutral transition, after which exactly the next planned wave can open. Frozen member arrays reject mutation after compilation.

### Pool Behavior Remains Single-Owned

The wrapper filters only unsatisfied members of the admitted wave and calls the shipped `runCappedPool` once. A two-member wave reaches two concurrent workers under cap 2, settlements remain in admitted input order despite worker completion order, and no future-wave sentinel reaches the worker. The retry fixture uses the shipped timeout classification and receives attempts 1 and 2 with one higher-token lease per attempt.

### Ledger-Only Resume

Resume accepts no directory, PID, pool-index, or mutable checkpoint input. The verified fold reconstructs branch registrations, current lease owners and expiry, accepted results or salvage, terminal outcomes, current wave, next wave, and blocked prerequisites. Partial-wave restart dispatches only the unsatisfied member. Crash after accepted result but before terminal transition dispatches zero work. A boundary matrix recreates the orchestrator after plan, admission, acquire, renew, dispatch, result, terminal, release, close, and next-wave admission and recovers the same authority each time.
<!-- /ANCHOR:proofs -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Branch leases and waves leaf suite | PASS, exit 0: 1 file and 13 tests |
| Combined leaf and pinned pool/ledger/fencing suites | PASS, exit 0: 4 files and 88 tests |
| Runtime TypeScript typecheck | PASS, exit 0 |
| OpenCode alignment verifier | PASS, exit 0: 8 files scanned, 0 findings |
| Comment hygiene and TypeScript author checks | PASS, zero violations |
| Strict spec validation | PASS, exit 0: Errors 0, Warnings 0 |
| Additive-dark scope | PASS: new module, one test, and leaf docs only; pool and substrates untouched |

### Exact Commands

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node node_modules/vitest/vitest.mjs run --no-coverage \
  ../../system-deep-loop/runtime/tests/unit/branch-leases-waves.vitest.ts
```

Final combined result: `Test Files 4 passed (4); Tests 88 passed (88)`. The leaf contributes 13 tests and the unchanged pinned baseline contributes 75 tests.

```bash
node .opencode/skills/system-spec-kit/node_modules/typescript/bin/tsc \
  --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

Latest result: exit 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Production authority is intentionally unchanged.** No shipped runner calls this API. A later authorized cutover must integrate durable admission while retaining rollback.
2. **Lease TTL is caller-supplied.** The adapter enforces renewal and fencing, but workload owners must choose a TTL and renewal cadence suited to execution duration.
3. **Atomicity is single-host filesystem scoped.** Unsupported atomicity domains fail closed through the shared protected-resource registry.
4. **The shared worktree contains unrelated packet work.** Scoped status identifies this leaf's delta; whole-worktree cleanliness is not claimed.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The planned architecture described direct predecessor result-envelope linkage. Under the user's additive-only scope, this module records protected result and salvage digests under the canonical logical branch but does not modify or import the predecessor module. Existing fan-out scripts, event-envelope, authorized-ledger, locks-and-fencing, and result-envelope substrates remain untouched.
<!-- /ANCHOR:deviations -->
