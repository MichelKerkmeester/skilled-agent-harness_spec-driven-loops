# Iteration 6: P4 stale-worker successor safety proof and mutation-side fencing

## Focus

Construct the stale-worker safety proof across claim identity, lease expiry, reclaim, successor claim, and late mutation; separate claim-time locking from mutation-side fencing; and decide what, if anything, Graphene can safely contribute to 036 wave admission.

## Findings

### 1. CONTRADICT — Graphene's documented revoked-claim completion guarantee is not implemented by the public mutation surface

Graphene documents that a revoked worker must discard its result and that `gr done` on a revoked claim is refused. The implementation cannot establish that predicate: `Executor::done` accepts `(graph, node, output, spend, now)` but no claim ID, session, lease version, or fence, and its transactional check asks only whether `active_claims` contains the node. The CLI likewise exposes `done` by node and forwards no claim identity. Therefore the documented guarantee is contradicted by the implemented API contract, not merely left untested. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/04-execution.md:47-67] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:450-515] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-cli/src/run.rs:334-340]

**When not to use:** Do not use node-level active-claim existence as authorization for completion, failure, checkpoint, renewal, release, retry, salvage, effect confirmation, or any terminal mutation when a lease can expire or be revoked and the node can be reclaimed.

### 2. CONFIRM / REFINE — The stale-worker successor counterexample is a complete safety proof against lease-only waves

The counterexample is: worker A claims node N and receives claim C1; C1 expires or is revoked; the release is folded; worker B reclaims N and receives C2; A later calls `done(N, old_output)`; inside Graphene's atomic store mutation, `active_claims[N]` is present because it points to C2, so A's old output is admitted as `NodeDone`. The transaction prevents interleaving during each operation but cannot distinguish A from B because the mutation carries no attempt identity. This confirms repo 1's conclusion that a lease without mutation-side fencing is insufficient and refines it with an executable witness: successor presence makes the stale mutation *more* likely to pass than the no-successor case. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:266-365] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:450-515] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33-41]

**When not to use:** Do not cite a SQL write lock, one-active-claim index, query-time expiry, or atomic fold as proof of stale-worker safety unless the protected mutation itself identifies and validates the exact claimant epoch.

### 3. EXTEND — Claim ID and monotonic fence solve different parts of the proof and both belong in `GraphMutationCommandV1`

Graphene already mints a claim ID from node, session, and the next ledger sequence, so it has a suitable immutable attempt identity. A safe mutation command should carry at least `graph_id`, `node_id`, `claim_id`, `fence_token`, `expected_node_version` (or expected ledger head), `operation_id`, and the operation payload. In the same atomic commit as the mutation, the authority boundary must prove: the active claim equals `claim_id`; the durable current resource fence equals `fence_token`; the expected node/head version still matches; the operation ID has not already committed; and the claim is valid for the requested operation. Claim ID rejects C1 after C2; the monotonic fence rejects every mutation from the displaced epoch across ledger, projection, checkpoint, salvage, and effect stores, including recovery where an identity could otherwise be replayed. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:339-364] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:540-608] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:89-102]

**When not to use:** Do not treat claim ID as a substitute for a durable monotonic fence across multiple protected stores, restarts, salvage paths, or effect delivery; do not treat a fence token as a substitute for node-attempt identity and expected-version/idempotency checks.

### 4. EXTEND — Every claim-derived mutation must be claimant-addressed; Graphene's node-addressed helpers can operate on a successor's claim

The omission is broader than `done`. `renew`, `release`, and `checkpoint` accept a node, load `held_claim(state, node)`, and therefore select whichever claim is current. Checkpoint then appends the state before renewing that selected claim. A stale caller that retained only N can consequently renew, release, or checkpoint under C2; analogous node-only failure and retry surfaces require the same audit. The decisive API rule is: no claim-derived public mutation may resolve ownership from the node alone. It must accept the caller's C1/fence and atomically compare them with C2/current fence before any domain event, projection write, budget debit, checkpoint, effect, or claim lifecycle change. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:370-447] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:91-100]

**When not to use:** Do not preserve convenience APIs such as `renew(node)`, `release(node)`, or `checkpoint(node, value)` on concurrent/reclaimable work; a trusted single-worker local harness with no reclaim is the only narrow case where node-only helpers are non-hazardous, and even there they should remain outside the authoritative interface.

### 5. CONFIRM — 036's prepare-then-revalidate-then-commit protocol closes the exact Graphene hole

The live coordinator allocates a strictly increasing token on acquisition/takeover, retains the high-water mark after release, rejects displaced renewal/release, and runs mutation preparation without side effects before reacquiring the resource mutex, revalidating the exact live lease, minting an unforgeable in-process capability, and invoking the commit. Its negative control pauses the old holder after preparation, lets a successor take over and commit, resumes the old holder, and proves the stale commit body never executes. Fenced state and ledger tests separately prove stale successor-epoch writes leave state/head unchanged. This is mutation-side fencing: authorization is rechecked at the final side-effect boundary, not inferred from an earlier claim. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:268-365] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:432-489] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts:622-656] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts:773-850]

**When not to use:** Do not split `checkCurrentFence()` from a later raw write, perform side effects during the preparation phase, expose the minted capability to serialization/replay, or claim multi-host safety outside the coordinator/backend's declared atomicity domain.

### 6. REFINE / EXTEND — Graphene can inform wave readiness and claim admission, but cannot authorize write-wave admission

Graphene contributes two safe planning ideas: validate read-set premises inside the claim transaction, and make active ownership explicit and observable. It does not provide repo 1's readiness algebra, canonical write sets, conflict graph, digest-bound immutable wave plan, authorization record, per-resource fence set, or mutation-side validation. A safe boundary is therefore: read-only or disposable-computation lanes may borrow Graphene-style readiness/claiming; a write wave is admitted only after 036 verifies the current `WavePlanV1` fingerprint, complete canonical read/write sets, hard dependencies, unknown-as-conflict policy, conflict-free active lanes, authorization ID, and acquired fences for every protected write resource. Each later mutation must consume those exact current fences plus its claim/attempt and expected version; admission alone never licenses a commit. This confirms repo 1's staged order and refines it into separate `admitWave` and `commitMutation` proof obligations. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:83-105] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:122-156] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts:376-397] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110-120]

**When not to use:** Do not use Graphene claimability, lease ownership, a no-conflict graph edge, or a wave-admitted event by itself to parallelize durable writes; serialize or block whenever write identity, alias resolution, plan freshness, authority, atomicity domain, or mutation fence coverage is incomplete.

## Safety proof obligations

| Boundary | Required evidence | Failure result |
|---|---|---|
| Claim | Node is claimable; premises valid; no active exact-node claim; budget admits | Refuse claim, no mutation |
| Takeover | Prior lease expired/revoked; new durable token is strictly greater; claim C2 differs from C1 | Refuse takeover or fail closed |
| Wave admission | Immutable plan fingerprint; authorization; completed predecessors; complete canonical sets; no active conflict; all required fences acquired | Serialize or block wave |
| Mutation | Active claim equals caller claim; current durable fence equals caller fence; expected version/head matches; idempotency key unused; validation and write share one atomic boundary | Typed stale-claim/stale-fence/version refusal, zero domain mutation |
| Completion/effect | Same mutation proof plus schema, budget, effect-intent/receipt, and terminal-transition checks | Refuse and preserve successor epoch |

The negative control is the four-step interleaving `prepare(C1/F1) → expire/revoke → acquire(C2/F2) and commit successor → resume C1/F1`. Passing requires every C1/F1 commit body to remain unexecuted and all authoritative state, ledger heads, projections, checkpoints, budgets, and effects to contain only successor-epoch changes. [INFERENCE: combines the observed Graphene counterexample with the verified 036 stale-commit test shape]

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/04-execution.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-cli/src/run.rs`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md`

## Assessment

- `newInfoRatio`: 0.71
- Novelty: P4's orientation hypothesis is now a complete counterexample and a two-boundary contract: exact claimant plus current fence at mutation, and separate evidence for safe wave admission.
- Confidence: High for the Graphene stale-successor hole and current 036 fencing behavior; medium-high for the proposed `GraphMutationCommandV1` field set because naming and placement remain a design inference.

## Reflection

- What worked: tracing the documented claim guarantee through the exact CLI and executor signatures, then applying the existing 036 paused-stale-commit negative control.
- What failed: broad wave-library search was noisy because legacy wave utilities use `wave` as merge metadata without being an authority-grade admission implementation.
- Ruled out: SQL transaction alone, active-claim existence, claim ID alone, lease ownership alone, and wave admission alone as proofs of safe durable mutation.

## Recommended Next Focus

P4 mutation API fence contract and safe wave admission boundary.
