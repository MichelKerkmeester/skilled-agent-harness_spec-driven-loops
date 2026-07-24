---
title: "Implementation Summary: Decision Evaluator"
description: "Closed route-decision evaluator, structural guards, compatibility projector, and shadow replay evidence."
trigger_phrases:
  - "decision evaluator implementation summary"
  - "closed route algebra implementation"
  - "shadow evaluate results"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Decision Evaluator

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented; local replay is shadow-partial |
| **Date** | 2026-07-18 |
| **Level** | 2 |
| **Authority** | Shadow-only; no live route or commit authority |
| **Strict Validation** | Not run here by instruction; orchestrator-owned from main tree |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The phase now contains a pure CommonJS evaluator that accepts frozen
`RouteRequestV1` and `CompiledPolicyV1` values and emits an immutable
`RouteDecisionV1`. A separate decision-contract guard makes the four top-level actions closed,
keeps `selectionKind` inside `route`, validates destination referential closure, constrains branch
authority through typed graph relations, and rejects unsafe bundle, evidence, rank, and
degraded-fallback shapes. Positive parsing and projection require a content-valid policy; the
separately named shape-only parser carries no referential-authority claim.

The compatibility projector maps positive decisions to scorer intents/resources and all negative
decisions to the established empty-intent convention. Typed leaf pairs resolve only through a
supplied frozen manifest projection. Thirteen fixtures and the replay driver exercise positive,
negative, degraded, stale, mixed-generation, handoff, rank-only, and N=1 paths. Explicit mode is
resolved before observation-based candidate assembly, and every route requires a live request
evidence claim matching the policy generation and effective hash.

### Files Delivered

| File | Action | Purpose |
|------|--------|---------|
| `lib/decision-contract.cjs` | Created | Closed algebra, structural guards, target/policy closure |
| `lib/evaluator.cjs` | Created | Pure deterministic branch evaluator and N=1 trace counters |
| `lib/projector.cjs` | Created | Typed-decision compatibility projection |
| `fixtures/evaluator-cases.v1.json` | Created | Eleven fixed request/decision/hash oracles plus separately authored scorer gold |
| `tests/decision-evaluator.test.cjs` | Created | Anti-hollow structural and behavioral assertions |
| `replay-driver.cjs` | Created | Repeated/cross-process replay, shared scorer, protected-byte gates |
| `checklist.md` | Created | Level-2 verification evidence |
| `spec.md`, `plan.md`, `tasks.md` | Updated | Implementation status, checkboxes, and evidence |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation binds directly to the frozen V1 schemas and imports the frozen canonical
serialization/hashing library instead of duplicating it. No Phase-1 live artifact, runtime
registry, advisor, filesystem source, clock, or random input participates in evaluation.

The driver treats `router-replay.cjs`, `score-skill-benchmark.cjs`, and both frozen typed-gold
fixtures as protected inputs. It loads their expected SHA-256 values from a read-only manifest,
then requires the scorer's real `evaluateRouteGold()` export in a write-denied child process. Every
projected row is scored against separately authored intent/resource gold; the observed write log
stays empty, and a deliberate mismatch proves the scorer's failure path. These typed rows were not
mapped to existing legacy corpus scenarios, so the gate claims real-scorer compatibility only.

Rollback remains disabling/removing the phase-local shadow lane. Because decisions carry no live
authority and evaluation performs no effects, rollback restores the prior serving path without an
external undo operation (synthesis §§9-10).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep four top-level actions and nest composition inside `route` | Makes negative-with-target and flat composition/control-flow states unrepresentable at the guard boundary (synthesis §2.3, §4 seam A, §6). |
| Copy complete targets only from `policy.destinations` | Preserves compound destination identity, role, authority reference, runtime discriminator, and destination-local authority (synthesis §2.2, §7). |
| Treat rank values as carried evidence only | Rank can decorate an already-legal route but cannot produce a candidate or reverse a defer (synthesis §2.3, §6). |
| Enter ranking, bundle, and handoff helpers only when policy cardinality exceeds one | N=1 uses the same contract while empty multi-candidate machinery constant-folds away without a name special case (synthesis §5.1, §5.2). |
| Resolve typed leaf pairs through an explicit manifest projection | Preserves current resource observations without teaching the shared scorer a new contract (synthesis §8.2). |
| Reject duplicate manifest identities | Prevents order-dependent `Map.set()` overwrite from silently changing a projected resource. |
| Resolve explicit mode before other observations | Preserves command precedence; unrelated detector/resource signals cannot widen an explicit route. |
| Resolve authority references through closed graph relations | An evidence destination must have an `evidenceOnly` edge and cannot share a reference with commit approval; names carry no authority semantics. |
| Pin protected scorer/router digests and score in a write-denied subprocess | Detects pre-run tampering and turns write-back into an observed fact rather than a constant (synthesis §8.2, §9, §10). |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Unit and structural guards | Pass | 147 assertions; 14 exact unsafe-state rejection codes |
| Syntax | Pass | `node --check` on five CJS files; JSON parser on fixture file |
| Comment hygiene | Pass | Project checker on five CJS files plus driver-side scan |
| Same-process determinism | Pass | 25 runs per fixture, one fixed decision hash per row |
| Cross-process determinism | Pass | Three child processes reproduce all 13 fixed hashes |
| Projector and shared scorer | Shadow-partial | Projection shape and 13/13 real read-only scorer passes against locally authored gold are proven; full real-producer/hub-scenario parity is deferred |
| Mismatch falsifier | Pass | Deliberate intent corruption fails as `intent-mismatch` |
| Protected bytes and write observation | Pass | Protected files equal the same-tree manifest digests; before/after hashes match; write-attempt log is empty |
| N=1 degeneracy | Pass | Three singular rows report zero rank/bundle/handoff calls |
| No name branch | Pass | Four destination names absent; multiline branch-pattern gate passes |

Protected input hashes recorded by the replay driver:

- `router-replay.cjs`: `b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- Negative typed gold: `f1890c0c0dd5114cd31373b25797caf64f40c48a46fe3049599f623ceed81c15`
- Singular typed gold: `aa892f6d14b7c7e9bae694aad343d71149ab781589600b62371333b534d9107f`

The verification rung is deterministic unit/in-memory replay. It proves local contract behavior and
shared-scorer compatibility; it does not prove activation in a serving runtime.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A Phase-0 amendment is still needed for a first-class identity binding.** The frozen
   `RouteRequestV1` carries only the integer `pinnedActivationGeneration`; it has no required
   `effectivePolicyHash` field. Under the frozen schema, the evaluator requires a live
   compatibility/runtime evidence record containing both generation and effective hash before it
   can return `route`; absence defers as `stale-policy`, and conflict rejects as `invalid`. This is
   the strongest safe binding available here, but the schema itself cannot require or type that
   evidence payload.
2. The frozen decision schema has no leaf-pair field. The projector accepts typed leaf pairs and a
   frozen manifest projection as explicit adapter inputs; it cannot derive leaf resources from the
   decision alone without changing V1.
3. The driver invokes the real shared scorer export in a read-only child process against locally
   authored intent/resource gold. Full route-gold against the real `router-replay.cjs` producer and
   real hub scenarios is deferred to per-hub activation (Stage 4), and the typed rows were not mapped
   to existing legacy corpus rows. The driver therefore reports this result and its overall status
   as `shadow-partial`, not an unqualified pass. The protected-digest pin is a read-only same-tree
   manifest within this isolated worktree; an independent CI trust source remains production
   hardening. The dependency-backed Vitest suite was not run, and `validate.sh --strict` was
   intentionally not run per the execution brief.
4. Shadow evidence proves no live authority, filesystem effect, or serving activation. Destination
   PREPARE/VERIFY/COMMIT remains outside this phase by design (synthesis §§2-3).
5. Generated `graph-metadata.json` still reports `planned`. It was not manually edited because
   generated metadata ownership and strict validation remain with the orchestrator; the authored
   canonical docs report the narrower implemented-and-locally-verified state.

<!-- /ANCHOR:limitations -->
