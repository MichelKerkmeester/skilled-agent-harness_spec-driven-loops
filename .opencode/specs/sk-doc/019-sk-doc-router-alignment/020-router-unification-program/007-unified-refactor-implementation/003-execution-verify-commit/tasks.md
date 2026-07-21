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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Phase A: Contract + lifecycle

- [x] T001 Confirm the `RouteProofV1` field set consumed from phase `000` and pin the binding set through frozen fields + versioned read-set digests → REQ-001 (`lib/execution-plane.cjs`, fixed proof hashes)
- [x] T002 Enforce the "proof is evidence, never a capability" invariant; authority is consumed only at destination VERIFY → COMMIT → REQ-002 (proof field allowlist + local acquisition)
- [x] T003 Define `idempotencyKey = hash(requestFactsHash, target, effectivePolicyHash)` and prove it deterministic across resubmission → REQ-005 (duplicate fixture)
- [x] T004 [P] Bind `expiresAtEpoch` and exercise passed expiry as `STALE_PROOF` → REQ-003 (transition test)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase B: State machines

- [x] T005 Implement pure PREPARE `routeDecision → RouteProofV1[] | none`; all three negatives emit no proof → REQ-002
- [x] T006 Prove PREPARE leaves decision/context bytes unchanged and never touches destination state → REQ-001
- [x] T007 Implement and exercise `READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT` with current-authority recomputation → REQ-003
- [x] T008 Exercise bound-digest drift, superseded generation, and passed expiry as `STALE_PROOF` → REQ-003
- [x] T009 Document `NEEDS_INPUT` as recovery-ladder data that opens no user turn here → REQ-003 (`execution-plane.md`)
- [x] T010 Implement destination-local acquisition, effect, and receipt `{idempotencyKey, epoch, effectivePolicyHash, target, outcome, timestamp}` → REQ-004
- [x] T011 Exercise null, bare-proof, forged, and stale COMMIT attempts as specific hard failures → REQ-003
- [x] T012 Keep the advisory guard outside every runtime dependency and authority callback → REQ-010 (source/import scan)

### Phase C: Ledger + ordering

- [x] T013 Fix destination-local storage, compound partition key, and max-horizon retention rule → REQ-012 (`execution-plane.md`)
- [x] T014 Declare actor/evidence/transport/judgment PREPARE and atomicity classes → REQ-012 (`execution-plane.md`)
- [x] T015 Exercise duplicate key ⇒ one effect + exact original receipt → REQ-005
- [x] T016 Exercise stable read-only-before-mutating scheduling and `ORDERING_BLOCKED` → REQ-008
- [x] T017 Exercise mutation epoch advance, later-leg invalidation, and `STALE_PROOF` re-PREPARE fence → REQ-006
- [x] T018 Exercise pre-effect disable and pending non-atomic destination recovery boundary → REQ-007

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase D: Proof + verification

- [x] T019 Author and execute stale-proof-rejected typed fixture via the compatibility projector → REQ-011, SC-001
- [x] T020 Author and execute duplicate-key-single-receipt fixture → REQ-011, SC-002
- [x] T021 Author and score the direct-route/no-forbidden-handoff-artifacts fixture → REQ-011
- [x] T022 Replay each fixture 25 times against fixed hashes; pin both protected digests and observe zero writes → REQ-011, SC-005
- [x] T023 Exercise identical N=1 and bundle protocol paths; static gate reports zero skill/name conditionals → REQ-009, SC-004
- [x] T024 Document and locally prove Stage 6 shadow inputs under zero live authority → Migration Gate
- [x] T025 Execute adapter-disable drill and document destination-owned external recovery → REQ-007, SC-006

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements (REQ-001..REQ-007) satisfied with phase-local evidence
- [x] All P1 requirements (REQ-008..REQ-012) satisfied at shadow scope
- [x] Stale-proof and duplicate-key fixtures replay green; scorer byte-unchanged (SC-001, SC-002, SC-005 shadow-partial)
- [x] No live routing config, registry, scorer, or skill modified
- [x] Migration Gate (Stage 6) satisfaction path + rollback drill documented and exercised (SC-006)
- [x] Write inventory is limited to this phase folder; no git command was run

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2, §3 Idea 7, §4, §5.2, §8.2, §9 Stage 6, §10, §11 open-q 5)
- **Master plan**: `../spec.md` (Shared Migration-Gate Model, Stage 6)

<!-- /ANCHOR:cross-refs -->
