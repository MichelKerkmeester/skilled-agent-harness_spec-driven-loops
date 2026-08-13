# Iteration 7: P4 mutation API fence contract and safe wave boundary

## Focus

Close P4 at field and commit-boundary level: require the exact claim identity and a current monotonic fence on every claim-derived mutation, couple each fence to the exact resource and expected version it protects, define atomic validation, and identify which Graphene mechanisms may inform wave construction without supplying write safety.

## Findings

### 1. EXTEND — `GraphMutationCommandV1` must be claimant-addressed and target-complete

The minimum authoritative command is not `mutate(node, payload)`. It is a versioned envelope containing `operation_id`, `operation_kind`, `graph_id`, `node_id`, `claim_id`, `session_id`, `claim_event_sequence` (or another immutable claim version), a canonical payload digest, and an ordered non-empty `targets[]`. Each target is `{resource_key, resource_digest, atomicity_domain, fence_token, expected_version}`; a ledger target replaces scalar `expected_version` with the exact `{ledger_id, sequence, record_hash}` head. Optional wave evidence is `{wave_id, plan_fingerprint, authorization_id}`, but it cannot replace any claimant or target field. Graphene already returns an immutable claim ID derived from node, session, and event sequence, while the 036 branch record carries logical branch, wave, lease, owner, attempt, and fence as one exact tuple. The combined rule is therefore: every claim-derived mutation carries the caller's immutable attempt identity explicitly; no mutation resolves the current claimant from `node_id` alone. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/id.rs:208-216] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:340-363] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts:537-555] [INFERENCE: `GraphMutationCommandV1` field names and the target-array shape are a proposed integration contract]

**When not to use:** Do not accept node-only, session-only, claim-only, fence-only, or global-fence commands. Do not infer a claim from the currently active node entry, and do not let a wave ID or admission receipt stand in for a claimant tuple.

### 2. REFINE — Claim identity and fencing are conjunctive, never alternative, proofs

The exact active claim comparison answers “is this the attempt currently assigned to this node?” The monotonic fence answers “is this the newest mutation epoch for this canonical protected resource?” Graphene's `ClaimId` is stable attempt identity but is not a durable per-resource high-water mark. The 036 lease is a complete tuple—resource, fence token, lease ID, owner, and correlation identity—and every takeover advances the durable token even after expiry or release. Hence a valid commit requires both `active_claim == supplied_claim` and `current_resource_fence == supplied_fence` for every target. C1 cannot act under C2, and a replayed C1 identity cannot cross a successor resource epoch even if old claim bytes survive recovery. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/node.rs:209-225] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/locks-and-fencing-types.ts:44-79] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:540-608] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:83-102]

**When not to use:** Do not use a claim ID as a cross-store fencing token, and do not use a current fence to authorize work belonging to a different claim, attempt, node, session, wave, or operation.

### 3. EXTEND — Fence and expected version are coupled to each canonical resource, not to the command globally

A safe target is the indivisible tuple `canonical resource identity + current fence + expected state version/head`. The fence prevents an older ownership epoch; the expected version/head prevents a current owner from overwriting state that changed within its own epoch; canonical resource identity prevents aliases from opening parallel authority domains. The existing 036 state store validates current fence, state version, and continuity identity under one mutex, while the ledger writer binds a ledger resource fence to the exact verified ledger head. `GraphMutationCommandV1.targets` must therefore enumerate every authoritative resource the operation can change—claim/branch state, domain ledger, lineage/checkpoint state, projection only when it is independently mutable, merge target, budget, or effect-intent ledger—and each listed fence must have been granted for that exact resource. Unknown, duplicate, aliased, missing, cross-domain, or unordered targets fail before commit. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts:96-177] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts:25-76] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:440-489] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:75-102]

**When not to use:** Do not attach one fence to a logical operation that writes several unenumerated resources; do not protect aliases independently; do not omit an expected version because the lease is current; and do not claim safety outside the backend's declared atomicity domain.

### 4. REFINE / EXTEND — Validation and the authoritative mutation form one atomic decision

The commit algorithm is: (1) canonicalize and validate the immutable command without side effects; (2) acquire all target guards in canonical order; (3) inside that guard, re-read and compare the exact live claim tuple, every current fence, every expected resource version/head, operation idempotency, wave/authorization evidence when required, and transition/schema/budget rules; (4) preview the deterministic fold; (5) append exactly one gateway-authorized domain event as the authoritative commit point; and (6) derive projections/checkpoints from that event and represent external work as effect intent, never as a pre-commit side effect. Any mismatch returns a typed refusal and changes no domain state, projection, checkpoint, budget, or effect state. This composes Graphene's `BEGIN IMMEDIATE` read-validate-append transaction with 036's side-effect-free prepare and commit-time fence revalidation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs:157-210] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:432-489] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts:897-938] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:88-105]

**When not to use:** Do not validate then release the guard before writing, perform I/O during preparation, mint or deserialize a caller-supplied fence capability, or treat a successful preview as a commit.

### 5. REFINE — Multi-resource fencing excludes stale writers but does not invent cross-store crash atomicity

`withFences` revalidates every ordered lease and runs the commit while all resource mutexes are held; that closes takeover interleavings within the declared single-host-filesystem domain. It does not make several independently replaced files, ledgers, remote effects, or heterogeneous stores an all-or-nothing transaction if the process crashes midway. The safe composition is one authoritative ledger append under the exact claimant and all necessary fences, followed by disposable projection rebuild and separately authorized effect-intent/confirmation transitions. A direct multi-store mutation is permitted only where one backend transaction proves atomic compare-claim/fences/versions plus all writes; otherwise serialize through the authority ledger or fail closed. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/locks-and-fencing-types.ts:13-42] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:440-489] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:116-130] [INFERENCE: crash atomicity does not follow from exclusion over multiple independent persistence operations]

**When not to use:** Do not advertise `withFences` as distributed consensus, a heterogeneous-store transaction, or proof that already-issued external effects roll back after a crash.

### 6. CONFIRM / REFINE — The exact rule applies to every claim-derived mutation surface

Completion, failure, retry, renewal, release, checkpoint, progress/status, result acceptance, salvage, merge, budget debit, effect intent/confirmation, and terminal transition must all consume the same explicit claim identity and the appropriate current resource/fence/version tuple. Graphene violates this on `renew`, `release`, `checkpoint`, and `done`: each accepts a node and selects or merely detects whichever claim is active. By contrast, 036's branch fold accepts a protected record only when logical branch, wave, lease ID, owner, attempt ID, fence, and expiry all match the one live lease. Non-worker control mutations such as a human gate do not fabricate a worker claim; they require their own exact principal/gate version, authorization, canonical resource fence, and expected version under the same atomic rule. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:369-447] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:449-515] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/ledger-fold.ts:466-491] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves/spec.md:88-115]

**When not to use:** Do not keep authoritative convenience methods such as `done(node)`, `renew(node)`, `release(node)`, or `checkpoint(node, value)` on reclaimable work. A process-local single-worker demo may retain them only outside the durable authority surface and without making concurrency-safety claims.

### 7. REFINE — Graphene can inform wave candidates and readiness evidence, but supplies no write-safety proof

The Graphene mechanisms safe to borrow are precisely: explicit dependency/read-set declarations; deterministic readiness from folded state; in-transaction premise validation at claim time; one observable active claim per exact node; stable claim IDs; bounded budget checks; and event-derived reconstruction. These mechanisms can propose eligible lanes, detect stale premises, provide scheduling evidence, and support read-only or disposable parallel computation. They cannot authorize a durable write wave because Graphene has no complete canonical write sets, alias resolution, conflict-edge derivation, immutable wave membership and plan fingerprint, hard-order proof, authorization record, canonical per-resource fence set, expected-version contract, idempotent operation identity, or mutation-side claimant/fence validation. 036 must independently compile and authorize the wave, acquire every target fence, and revalidate each mutation; Graphene evidence can only narrow candidates. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:245-367] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs:157-210] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:83-105] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:122-156] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts:376-397]

**When not to use:** Do not admit parallel writes from Graphene readiness, a valid read-set, an active claim, deterministic replay, absence of a dependency edge, or a Graphene claim transaction. If canonical write identity, alias closure, plan freshness, authorization, target enumeration, fence coverage, expected versions, or atomicity is unknown, serialize or block.

## Closed P4 contract

`commitMutation(command)` is legal only if the authority boundary, in one commit decision, proves:

1. `command.claim_id` is the exact live claim for `graph_id/node_id/session_id/claim_event_sequence` and permits `operation_kind`.
2. `operation_id` is unused or resolves idempotently to the byte-identical prior receipt.
3. `targets[]` is complete, canonical, unique, ordered, and confined to one supported atomicity domain.
4. Every target's durable current fence equals its supplied monotonic `fence_token`.
5. Every target's current version or ledger head equals its supplied expectation.
6. Required wave fingerprint, membership, predecessor, conflict, and authorization evidence is current.
7. Schema, transition, budget, and effect-intent checks pass.
8. The gateway-authorized event append is the sole authoritative commit; derived views and effect confirmations cannot precede it.

The decisive negative control remains `prepare(C1,F1,V1) -> expire/revoke -> acquire(C2,F2) -> successor commits V2 -> resume C1`. The expected result is a typed stale-claim or stale-fence refusal before the old commit body executes, with domain head, versions, projections, budgets, checkpoints, and effects reflecting only C2/F2. A second control keeps C2/F2 current but changes the target version/head; it must fail with version/head conflict, proving the fence does not hide same-epoch lost updates. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts:622-656] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts:773-850] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts:110-177]

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/id.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/node.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/locks-and-fencing-types.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/ledger-fold.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md`

## Assessment

- `newInfoRatio`: 0.56
- Novelty: Iteration 6 proved the stale-successor hole; this pass closes P4 with an exact command envelope, per-resource fence/version coupling, a single authoritative commit rule, the cross-store atomicity limit, and an exhaustive boundary between Graphene planning evidence and 036 safety.
- Confidence: High for claimant/fence conjunction, current runtime behavior, and the wave boundary; medium-high for the proposed `GraphMutationCommandV1` field names because implementation placement remains intentionally undecided.

## Reflection

- What worked: joining Graphene's transactional claim/read-set pattern to 036's exact branch lease tuple, multi-fence guard, expected state version, and expected ledger head.
- What failed: treating multi-resource exclusion as implicit crash atomicity; the sources support stale-writer exclusion, but atomic all-or-nothing persistence still requires one transactional backend or a single authoritative ledger commit.
- Ruled out: node-addressed ownership resolution, a global fence, claim-only safety, fence-only safety, wave admission as commit authority, unversioned target writes, and Graphene readiness as a write-wave certificate.

## Recommended Next Focus

P5 temporal supersession observed-time and nogood admission audit.
