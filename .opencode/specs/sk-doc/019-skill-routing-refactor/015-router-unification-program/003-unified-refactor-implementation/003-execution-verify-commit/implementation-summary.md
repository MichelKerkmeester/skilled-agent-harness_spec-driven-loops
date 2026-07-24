---
title: "Implementation Summary: Destination-Local Execution Plane"
description: "Pure PREPARE, destination VERIFY/COMMIT, idempotency, fencing, and shadow replay evidence."
trigger_phrases:
  - "execution plane implementation summary"
  - "prepare verify commit results"
  - "idempotency fencing replay"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Destination-Local Execution Plane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented; phase-local replay is shadow-partial |
| **Date** | 2026-07-18 |
| **Level** | 2 |
| **Authority** | Shadow-only; no live route or commit authority |
| **Strict Validation** | Not run here by instruction; orchestrator-owned from main tree |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The phase now contains a pure PREPARE emitter, a destination-local VERIFY/COMMIT coordinator, a
destination-owned idempotency ledger, a compatibility projector, three route-gold fixtures, direct
transition tests, and a protected-scorer harness. PREPARE emits the frozen `RouteProofV1` shape and
binds request facts, policy, registry/authority source, ordered targets, authority class,
preconditions, expiry, and destination reads through versioned read-set entries plus the
attestation statement hash.

VERIFY recomputes those bindings and current authority into the closed five-state set. COMMIT
accepts only its matching process-local READY result, re-acquires destination authority, collapses
duplicates through the ledger, records the required receipt, and advances/fences the planning epoch
after mutation. Evidence roles verify and resolve read-only but cannot COMMIT, preserving synthesis
§7's role boundary.

### Files Delivered

| File | Action | Purpose |
|------|--------|---------|
| `lib/execution-plane.cjs` | Created | Pure proof emission plus destination VERIFY/COMMIT/fencing |
| `lib/idempotency-ledger.cjs` | Created | Partitioned duplicate collapse, receipt retention, pending recovery state |
| `lib/projector.cjs` | Created | Typed decision to frozen scorer observation projection |
| `fixtures/execution-route-gold.v1.json` | Created | Three authored gold rows plus fixed proof/replay hash oracles |
| `tests/execution-plane.test.cjs` | Created | Real state transitions and exact hard-failure assertions |
| `harness/run-phase.cjs` | Created | 25-run replay, static gates, protected hashes, read-only scorer invocation |
| `execution-plane.md` | Created | Ledger storage/retention, role atomicity, ordering, rollback decisions |
| `checklist.md` | Created | Level-2 verification evidence |
| `spec.md`, `plan.md`, `tasks.md` | Updated | Shadow implementation status, completed checkboxes, evidence pointers |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation imports the frozen canonical serializer/hashing library and does not extend the
frozen proof or decision schemas. The narrow proof schema is respected by encoding required bindings
as named versioned read entries; the complete statement and `proofHash` protect those bytes. Proofs,
prepared target lists, and receipts are deeply immutable without freezing caller input.

The harness requires the real `evaluateRouteGold()` and `routeSkillResources()` exports in a
write-denied child process. Three projected rows are compared with separately authored intent and
resource gold; all pass, a deliberate mismatch fails, and both protected files retain their pinned
SHA-256 values. Repeated replay compares against checked-in hash oracles rather than accepting the
first runtime result as its own expected value.

Pre-effect rollback disables PREPARE and blocks an already-READY COMMIT. A failed non-atomic external
adapter remains pending and cannot repeat the effect; destination-owned recovery must reconcile it.
The router makes no atomic undo claim after an external COMMIT (synthesis §§6, 9 Stage 6, 10).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Encode prose-required bindings inside frozen `RouteProofV1.readSet` | Preserves the committed schema while binding the complete execution statement (synthesis §§2.1, 3 Idea 7, 10). |
| Keep proof and READY non-authoritative | Proof is evidence; READY is a matching verification fact; COMMIT still acquires current local authority (synthesis §§2.3, 3 Idea 7, 10). |
| Partition the ledger by compound destination identity + authority class | Destination identity is compound and policy generation remains in the key/receipt, preventing cross-destination aliasing (synthesis §2.2, §11.5). |
| Retain through the maximum destination horizon | Proof expiry, recovery deadline, and provider dedupe deadline are real bounds; one fleet-wide number would be invented without telemetry (synthesis §11.5). |
| Resolve evidence without COMMIT | Evidence targets are read-only and never consume effect authority (synthesis §7). |
| Stable-partition read-only legs before mutation | Preserves authored order within classes and lets the first mutation fence every unresolved later leg (synthesis §9 Stage 6). |
| Use one protocol for N=1 and bundles | Empty later-leg collections constant-fold naturally; no destination name earns a branch (synthesis §§5.1-5.3). |
| Report shared-scorer evidence as shadow-partial | Real scorer compatibility is proven; real hub scenarios and router production belong to per-hub activation (synthesis §§8.2, 9). |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Direct transition tests | Pass | 58 assertions with exact state/error checks |
| Stale proof | Pass | Seven drift/generation/expiry variants → `STALE_PROOF`, zero effects |
| Duplicate key | Pass | Two COMMIT calls → one effect, one receipt, original receipt returned |
| READY hard fence | Pass | Null, bare proof, forged READY, stale result all rejected specifically |
| Ordering/fencing | Pass | Read first; mutation opens epoch 41; later leg invalidated and stale |
| N=1 degeneracy | Pass | Single and bundle legs report the same three protocol stages; zero name branches |
| Adapter disable | Pass | Zero proofs after disable; already-READY COMMIT blocked; zero effects |
| Non-atomic recovery boundary | Pass | Failed effect remains pending; retry effect count remains one |
| Deterministic fixtures | Pass | 25 runs × 3 fixtures match fixed proof and replay hash oracles |
| Shared route-gold | Shadow-partial | 3/3 real scorer passes; mismatch falsifier fails; full hub producer lane deferred |
| Protected bytes | Pass | Router/scorer hashes equal trusted constants before and after; zero write attempts |
| Comment hygiene | Pass | Project checker + harness scan report zero violations across five CJS files |

Protected hashes:

- `router-replay.cjs`: `b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`

The verification rung is unit/in-memory deterministic replay. It proves phase-local behavior and
shared-scorer compatibility, not a serving destination or external provider transaction.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The included ledger is in-memory verification infrastructure. Production destinations must
   persist the same partition/key/state model in their own durable store; atomic adapters must place
   effect and finalized receipt in one transaction.
2. The retention rule is fixed, but its numerical horizon is destination configuration: the maximum
   of proof expiry, destination recovery deadline, and provider dedupe deadline. No repository
   telemetry supports one fleet-wide number.
3. A non-atomic pending state prevents a second effect but does not implement provider-specific
   reconciliation. Post-effect recovery is intentionally destination-owned.
4. Evidence targets follow `PREPARE → VERIFY → read-only resolution`, not COMMIT, because synthesis
   §7 forbids evidence roles from consuming effect authority. Every effect-capable leg follows the
   identical three-step protocol.
5. The harness invokes the real shared scorer against locally authored gold and checks the real
   router export and bytes. It does not run real hub scenarios through `routeSkillResources()`;
   full route-gold production is deferred to per-hub activation and reported `shadow-partial`.
6. No live destination, filesystem effect, network provider, activation selector, or advisory guard
   is wired. `mcp-route-guard.cjs` remains advisory and absent from the dependency graph.
7. `validate.sh --strict` was intentionally not run. Generated `graph-metadata.json` remains
   orchestrator-owned and may still report `planned` until the main-tree metadata refresh.

<!-- /ANCHOR:limitations -->
