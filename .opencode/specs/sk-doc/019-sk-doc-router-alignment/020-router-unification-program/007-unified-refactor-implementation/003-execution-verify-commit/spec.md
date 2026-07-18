---
title: "Feature Specification: Execution Plane — Destination-Local PREPARE → VERIFY → COMMIT"
description: "Phase 3 of the unified router refactor: the destination-local execution plane (Idea 7). PREPARE emits a short-lived RouteProofV1 (evidence, never a capability) binding request/policy/registry hashes, a versioned read-set, ordered targets, authority class, preconditions, expiry, and an idempotency key. VERIFY recomputes digests and current authority immediately before the first side effect (READY|STALE_PROOF|NEEDS_INPUT|DEFER|REJECT). COMMIT acquires destination-local authority, writes a receipt plus fencing epoch, invalidates every later prepared leg, and opens a new planning epoch on mutation. Idempotency ledger guarantees a single effect per duplicate key. No router-owned atomic rollback across external effects; post-COMMIT recovery is destination-owned. Planning/design only — no live routing config, registry, scorer, or skill is modified."
trigger_phrases:
  - "execution plane prepare verify commit"
  - "route proof destination local authority"
  - "idempotency ledger fencing epoch receipt"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Execution Plane — Destination-Local PREPARE → VERIFY → COMMIT

## EXECUTIVE SUMMARY

This phase builds the **execution plane** of the unified router — Idea 7, "proof-carrying commit" — the single mechanism through which a positive route decision becomes an actual side effect [synthesis §2 diagram lines 53-57; §3 Idea 7 row]. It is the only plane in the architecture that consumes authority, and it consumes authority **destination-locally**: a `RouteProofV1` is *evidence that a route was legitimately planned*, never a capability that authorizes the effect on its own [synthesis §2.1; §3 Idea 7 "Proof is evidence"; §10 "authority stays destination-local"].

The plane is a three-step protocol per target leg:

- **PREPARE** — the router-side adapter emits a short-lived `RouteProofV1` that binds the request/policy/registry hashes, a versioned read-set, the ordered targets, an authority class, preconditions, an expiry, and an idempotency key. PREPARE performs **no** side effect; it only pins evidence.
- **VERIFY** — the destination recomputes the bound digests and its *current* authority **immediately before the first side effect** and returns one of `READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT`. The decision algebra already withholds authority until this point (`authority: WithheldUntilVerify` on every `route` branch) [synthesis §2.3 line 87].
- **COMMIT** — on `READY`, the destination acquires its own local authority, performs the effect, records a **receipt** plus a **fencing epoch**, and invalidates every later prepared leg. A mutating leg opens a **new planning epoch**, forcing any downstream proof to re-PREPARE against the post-mutation state.

An **idempotency ledger** keyed on the proof's idempotency key guarantees that a duplicate submission produces **exactly one** effect and returns the original receipt. There is deliberately **no router-owned atomic rollback across external effects**: once a destination COMMITs an external effect, undo is the destination's responsibility, not the router's [synthesis §9 Stage 6 "post-effect recovery is destination-owned"].

This phase is **planning/design only**. It authors the contract, the state machine, and the deterministic route-gold fixtures that prove the plane; it does **not** modify any live routing config, registry, scorer, or skill, and it never edits the shared benchmark scorer `router-replay.cjs` [synthesis §8.2; §10].

## PROBLEM & PURPOSE

### Problem Statement

A route decision is not an effect. Between "the policy says route to destination D" and "D has mutated the world" sits a window in which the compiled policy can drift, the pinned activation generation can be superseded, authority can be revoked, or the same request can be replayed. Without a disciplined execution plane, three failure classes become representable: (1) a stale or forged recommendation is treated as a capability and triggers an effect it no longer authorizes; (2) a duplicate submission produces a second, unintended effect; (3) a router attempts to "roll back" an external effect it never owned, silently corrupting attribution [synthesis §6 eliminated-alternatives "rollback by regeneration"; §9 line 261 hard gates].

The synthesis fixes the *shape* of the plane but explicitly parks the operational details as **open question 5**: the idempotency ledger location, its retention/partition model, and which destinations can supply a side-effect-free PREPARE and an atomic (or explicitly non-atomic) COMMIT [synthesis §11 item 5]. Those details cannot be invented as constants; they must be designed against the destination roles the compiled policy already declares.

### Purpose

Deliver the destination-local PREPARE → VERIFY → COMMIT protocol, the `RouteProofV1` evidence contract, the idempotency ledger with a duplicate-key single-effect guarantee, and the receipt + fencing-epoch model — such that authority is consumed *only* at a destination's own VERIFY → COMMIT boundary, exactly-once is an adapter property of the ledger (not a claim in the proof text) [synthesis §3 Idea 7], and every one of these behaviors is provable through deterministic offline route-gold fixtures that leave the shared scorer untouched.

## SCOPE

### In Scope

- The `RouteProofV1` evidence contract: bound `requestFactsHash`, `effectivePolicyHash`, registry/authority hash, versioned read-set, ordered `targets`, `authorityClass`, `preconditions`, `expiry`, and `idempotencyKey` [synthesis §2.1; §9 Stage 6 gate].
- PREPARE: the pure, side-effect-free emission of a proof from a positive `route` decision (single or ordered/surface bundle legs); explicit no-op on any non-`route` decision, which structurally carries no targets and withholds authority [synthesis §2.3; §4 Seam A].
- VERIFY: the destination-side digest + current-authority recomputation immediately before the first side effect, returning the closed state set `READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT`.
- COMMIT: destination-local authority acquisition, effect execution, receipt write, fencing-epoch stamp, invalidation of later prepared legs, and new-planning-epoch semantics on mutation.
- The idempotency ledger: key derivation, storage/partition model (resolving open-q 5), retention window, and the duplicate-key → single-effect + original-receipt guarantee [synthesis §11 item 5].
- Ordering discipline: **read-only legs before mutating legs**; a mutating leg fences all not-yet-committed legs prepared against the prior generation [synthesis §9 Stage 6 "read-only legs before mutating"].
- The N=1 degenerate correctness proof: PREPARE/VERIFY/COMMIT, idempotency, and receipts are cardinality-agnostic and work unchanged for `mcp-code-mode` (candidateCount = 1, `selectionKind = single`) [synthesis §5.2 retained list].
- Deterministic route-gold fixtures added via the compatibility projector: stale-proof rejected by VERIFY, and duplicate idempotency-key single receipt [synthesis §8.2 fixture families].

### Out of Scope

- The recovery ladder, the shared `UncertaintyBudgetV1`, and user-turn accounting — owned by phase `004-recovery-ladder`. A destination-precondition `NEEDS_INPUT` returned here is routed **back through** the ladder and never itself opens a user turn [synthesis §4 Seam B].
- Calibrated auto-route certificates (phase `005`), the learning overlay (phase `007`), and the actual per-hub live activation (phase `006/*`). This phase proves the plane under **zero live authority**.
- Any **router-owned atomic rollback across external effects** — explicitly rejected; post-COMMIT recovery is destination-owned [synthesis §9 Stage 6; §6 eliminated-alternatives].
- Editing the shared benchmark scorer `router-replay.cjs`, or modifying any live routing config, registry, or skill. A scorer edit required to make execution fixtures pass is a **migration failure**, not a license [synthesis §8.2; §10].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This specification |
| `plan.md` | Create | Build approach, contracts touched, verification |
| `tasks.md` | Create | Ordered, checkable task list |

> Runtime contract/fixture artifacts named in `plan.md` are **design targets** for the eventual implementation packet; this phase authors the plan only and mutates no live router, registry, scorer, or skill.

## REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | PREPARE emits a `RouteProofV1` binding all pinned inputs | Proof carries `requestFactsHash`, `effectivePolicyHash`, registry/authority hash, versioned read-set, ordered `targets`, `authorityClass`, `preconditions`, `expiry`, `idempotencyKey`; PREPARE performs zero side effects [synthesis §2.1; §9 Stage 6] |
| REQ-002 | A proof is evidence, never a capability | No proof field can authorize an effect; authority is consumed only at the destination's own VERIFY → COMMIT boundary; every non-`route` decision yields no proof (target-free, authority-free) [synthesis §2.3; §3 Idea 7; §4 Seam A; §10] |
| REQ-003 | VERIFY recomputes digests + current authority immediately before the first side effect | VERIFY returns exactly one of `READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT`; any drifted bound hash, superseded generation, or passed expiry ⇒ `STALE_PROOF`; a `COMMIT` reached without a matching `READY` VERIFY hard-fails [synthesis §9 line 261 "a COMMIT lacking VERIFY"] |
| REQ-004 | COMMIT acquires destination-local authority and records a receipt + fencing epoch | Receipt records `idempotencyKey`, fencing `epoch`, `effectivePolicyHash`, target, outcome, timestamp; authority is destination-local, never router-supplied [synthesis §10 "only destination VERIFY→COMMIT consumes authority"] |
| REQ-005 | Duplicate idempotency key yields a single effect | Re-submitting a proof with an existing ledger key performs no second effect and returns the original receipt; a duplicate key creating a second effect hard-blocks activation [synthesis §9 line 261; §8.2 "duplicate idempotency-key receipt"] |
| REQ-006 | Mutation opens a new planning epoch and fences later legs | A committed mutating leg stamps a fencing epoch and invalidates every not-yet-committed leg prepared against the prior generation; those legs must re-PREPARE [synthesis §9 "requests pin one generation"; Stage 6] |
| REQ-007 | No router-owned atomic rollback across external effects | Rollback of the pre-effect adapter is available (`disable pre-effect adapter`); once an external COMMIT lands, recovery is destination-owned and the router makes no atomic-undo claim [synthesis §9 Stage 6 rollback column] |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Read-only legs are ordered before mutating legs | The leg scheduler proves read-only-before-mutating ordering; a bundle cannot COMMIT a mutating leg before a preceding read-only leg is resolved [synthesis §9 Stage 6 "read-only legs before mutating"] |
| REQ-009 | The plane is correct at N=1 without special-casing | `mcp-code-mode` (candidateCount = 1, `selectionKind = single`, `crossTargetEdges = []`) runs the identical PREPARE/VERIFY/COMMIT path; no `if skillId == mcp-code-mode` branch exists [synthesis §5.2 retained; §5.3 dial] |
| REQ-010 | The advisory route guard cannot become destination VERIFY | The packet's `mcp-route-guard.cjs` stays `allow`/`warn`, fails open, and is never wired as the VERIFY authority check [synthesis §5.2 line 168] |
| REQ-011 | Execution behaviors are provable via deterministic route-gold fixtures | New `TypedRouteGoldV1` fixtures (stale-proof-rejected, duplicate-key-single-receipt, direct route carrying no forbidden handoff artifacts) replay deterministically through the compatibility projector; `router-replay.cjs` is unmodified [synthesis §8.2] |
| REQ-012 | Idempotency ledger location + retention/partition model is specified | The design fixes ledger storage, partition key, and retention window, and declares which destination roles supply side-effect-free PREPARE and atomic vs explicitly non-atomic COMMIT (resolves open-q 5) [synthesis §11 item 5] |

## SUCCESS CRITERIA

- **SC-001**: A stale proof (any bound hash drifted, generation superseded, or expiry passed) is rejected at VERIFY with `STALE_PROOF` and never reaches COMMIT — demonstrated by the stale-proof route-gold fixture.
- **SC-002**: Two submissions of the same proof produce exactly one effect and one receipt; the second returns the original receipt — demonstrated by the duplicate-key fixture.
- **SC-003**: No path exists by which a `clarify | defer | reject` decision, or a bare recommendation/proof, triggers a COMMIT; authority is consumed only at destination VERIFY → COMMIT [synthesis §2.3; §10].
- **SC-004**: The identical PREPARE/VERIFY/COMMIT code path runs for `mcp-code-mode` (N=1) and a multi-target bundle with zero name/skill conditionals.
- **SC-005**: Route-gold stays green end to end and the shared scorer file is byte-unchanged; the git diff touches no live routing config, registry, scorer, or skill.
- **SC-006**: A rollback drill proves the pre-effect adapter can be disabled cleanly, and the design documents that post-COMMIT external recovery is destination-owned (no atomic router undo is asserted).

## MIGRATION GATE

This phase owns the **Stage 6 — Destination rollout** gate from the master plan's Shared Migration-Gate Model [`../spec.md` §"SHARED MIGRATION-GATE MODEL", stage row 6, "Owned by phase(s): 003, 006/*"; synthesis §9 Stage 6].

**Gate to satisfy before the next phase activates:** the execution-plane fixtures — **proof / expiry / read-set / authority / epoch / idempotency / receipt** — must parse and replay deterministically, with **read-only legs proven to run before mutating legs**, all under **zero live authority** (shadow only). Concretely, before phase `004-recovery-ladder` activates, the stale-proof-rejected and duplicate-key-single-receipt `TypedRouteGoldV1` fixtures must replay green through the compatibility projector with `router-replay.cjs` unmodified.

**Reversibility (Stage 6 rollback column):** `disable pre-effect adapter`. The pre-effect PREPARE/VERIFY adapter can be switched off to fall back to legacy serving authority; a **post-effect external COMMIT cannot be undone by the router** — that recovery is destination-owned. This phase therefore builds and proves the destination-rollout *mechanism and fixtures* here; the actual per-hub live destination rollout is consumed downstream by phases `006/*`, which reuse this identical execution plane [`../spec.md` §"SHARED MIGRATION-GATE MODEL"].

**Hard-gate interactions (any one hard-blocks activation)** [synthesis §9 line 261]: a COMMIT lacking a matching VERIFY; a duplicate idempotency key creating a second effect; a negative decision that carries a target/authority; a request observing mixed generations; a required edit to the shared scorer.

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` — §2 execution plane, §3 Idea 7, §4 seams, §5.2 N=1 retention, §8.2 benchmark fixtures, §9 Stage 6, §10 constraints, §11 open-q 5
- **Master plan (phase parent)**: `../spec.md` — Phase Documentation Map (phase 3) + Shared Migration-Gate Model (Stage 6)
- **Upstream contracts**: phase `000-contract-schemas` (`RouteProofV1` schema + deterministic hashing), phase `002-decision-evaluator` (the `route` decision this plane consumes)
- **Downstream consumers**: phase `004-recovery-ladder` (routes `NEEDS_INPUT`/`DEFER` through the budget), phases `006/*` (per-hub live destination rollout on this same plane)
