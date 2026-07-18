---
title: "Tasks: Execution Plane — PREPARE → VERIFY → COMMIT"
description: "Ordered, checkable task list to design and prove the destination-local execution plane: RouteProofV1 lifecycle, the pure PREPARE emitter, the VERIFY state machine, COMMIT with destination-local authority + receipt + fencing epoch, the idempotency ledger (open-q 5), read-only-before-mutating ordering, N=1 degeneracy, and the deterministic route-gold fixtures via the compatibility projector — with the shared scorer untouched and no live routing config, registry, scorer, or skill modified."
trigger_phrases:
  - "execution plane task list"
  - "prepare verify commit tasks"
  - "idempotency ledger fixture tasks"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Execution Plane — PREPARE → VERIFY → COMMIT

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description → requirement`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-a -->
## Phase A: Contract + lifecycle

- [ ] T001 Confirm the `RouteProofV1` field set consumed from phase `000` and pin the binding set: `requestFactsHash`, `effectivePolicyHash`, registry/authority hash, versioned read-set, ordered `targets`, `authorityClass`, `preconditions`, `expiry`, `idempotencyKey` → REQ-001
- [ ] T002 Specify the "proof is evidence, never a capability" invariant: no proof field authorizes an effect; authority is consumed only at destination VERIFY → COMMIT → REQ-002
- [ ] T003 Define `idempotencyKey = hash(requestFactsHash, target, effectivePolicyHash)` and prove it is deterministic across resubmission → REQ-005
- [ ] T004 [P] Specify `expiry` (short-lived TTL) and its role as a `STALE_PROOF` trigger at VERIFY → REQ-003

<!-- /ANCHOR:phase-a -->
---

<!-- ANCHOR:phase-b -->
## Phase B: State machines

- [ ] T005 Specify the pure PREPARE adapter `routeDecision → RouteProofV1 | none`; emit `none` for every non-`route` decision (target-free, authority-free) → REQ-002
- [ ] T006 Assert PREPARE performs zero side effects and never touches destination state → REQ-001
- [ ] T007 Specify the VERIFY closed state machine `READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT` with digest + current-authority recomputation immediately before the first side effect → REQ-003
- [ ] T008 Map `STALE_PROOF` triggers: any drifted bound hash, superseded generation, or passed expiry → REQ-003
- [ ] T009 Route a destination `NEEDS_INPUT` back through the phase `004` ladder; assert it does NOT itself open a user turn → REQ-003 (see synthesis §4 Seam B; phase 004 owns the budget)
- [ ] T010 Specify COMMIT: acquire destination-local authority, perform effect, write receipt `{idempotencyKey, epoch, effectivePolicyHash, target, outcome, ts}` → REQ-004
- [ ] T011 Assert a COMMIT reached without a matching `READY` VERIFY hard-fails → REQ-003
- [ ] T012 Wire the guard boundary: `mcp-route-guard.cjs` stays advisory (`allow`/`warn`, fails open) and is NEVER the VERIFY authority check → REQ-010

<!-- /ANCHOR:phase-b -->
---

<!-- ANCHOR:phase-c -->
## Phase C: Ledger + ordering

- [ ] T013 Design the idempotency ledger: storage location, partition key, retention window — resolve open-q 5 → REQ-012
- [ ] T014 Declare, per destination role, which destinations supply side-effect-free PREPARE and atomic vs explicitly non-atomic COMMIT → REQ-012
- [ ] T015 Specify the duplicate-key read path: existing key ⇒ no second effect, return the original receipt → REQ-005
- [ ] T016 Specify read-only-before-mutating leg scheduling; a mutating leg cannot COMMIT before a preceding read-only leg resolves → REQ-008
- [ ] T017 Specify the fencing epoch: a committed mutating leg stamps a new epoch and invalidates every not-yet-committed leg prepared against the prior generation (forces re-PREPARE) → REQ-006
- [ ] T018 Specify "no router-owned atomic rollback across external effects": router owns pre-effect adapter disable only; post-COMMIT recovery is destination-owned → REQ-007

<!-- /ANCHOR:phase-c -->
---

<!-- ANCHOR:phase-d -->
## Phase D: Proof + verification

- [ ] T019 Author the stale-proof-rejected `TypedRouteGoldV1` fixture via the compatibility projector → REQ-011, SC-001
- [ ] T020 Author the duplicate-key-single-receipt fixture → REQ-011, SC-002
- [ ] T021 Author the "direct route carries no forbidden handoff artifacts" fixture → REQ-011
- [ ] T022 Verify all fixtures replay deterministically and `router-replay.cjs` is byte-unchanged → REQ-011, SC-005
- [ ] T023 Argue N=1 degeneracy: identical PREPARE/VERIFY/COMMIT path for `mcp-code-mode`; assert zero skill/name conditionals → REQ-009, SC-004
- [ ] T024 Document the Stage 6 gate satisfaction path (proof/expiry/read-set/authority/epoch/idempotency/receipt fixtures; read-only legs before mutating; zero live authority) → Migration Gate
- [ ] T025 Define + document the rollback drill: disable pre-effect adapter; note destination-owned post-COMMIT recovery → REQ-007, SC-006

<!-- /ANCHOR:phase-d -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements (REQ-001..REQ-007) satisfied with evidence
- [ ] All P1 requirements (REQ-008..REQ-012) satisfied or deferred with approval
- [ ] Stale-proof and duplicate-key fixtures replay green; scorer byte-unchanged (SC-001, SC-002, SC-005)
- [ ] No live routing config, registry, scorer, or skill modified (planning/design only)
- [ ] Migration Gate (Stage 6) satisfaction path + rollback drill documented (SC-006)
- [ ] Git diff limited to this phase folder's three docs

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../009-unified-refactor-research/unified-refactor-synthesis.md` (§2, §3 Idea 7, §4, §5.2, §8.2, §9 Stage 6, §10, §11 open-q 5)
- **Master plan**: `../spec.md` (Shared Migration-Gate Model, Stage 6)

<!-- /ANCHOR:cross-refs -->
