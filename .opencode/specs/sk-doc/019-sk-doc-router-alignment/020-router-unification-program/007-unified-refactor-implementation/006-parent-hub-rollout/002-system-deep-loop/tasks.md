---
title: "Tasks: Unified Router Rollout — system-deep-loop (Phase 006/002)"
description: "Ordered, checkable task list to compile the four deep-loop projections per public mode, prove route-gold parity through the compatibility projector without touching the shared scorer, and run the fenced Stage-4 canary + byte-exact rollback drill."
trigger_phrases:
  - "system-deep-loop router activation tasks"
  - "deep-loop no-collapse compile tasks"
  - "stage-4 canary task list"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Unified Router Rollout — system-deep-loop (Phase 006/002)

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact / evidence)`

---

## Phase 1: Preconditions & extraction

- [x] T001 Confirm the activation-order precondition: `006/001` (`sk-code`) Stage-4 canary is green (synthesis §9). Block if not. (`../001-sk-code/`)
- [x] T002 Read the authored source and enumerate the seven public modes with their raw rows (`.opencode/skills/system-deep-loop/mode-registry.json`).
- [x] T003 [P] Record the three-tier discriminator semantics: `runtimeLoopType` is read verbatim and NEVER inferred from `workflowMode` (`mode-registry.json:8`, `SKILL.md` "three-tier discriminator").
- [x] T004 Extract the four projections + identity tuple per mode: `{workflowMode, packetRef, packetKind, backendKind, runtimeLoopType|null, routingClass, role}` (spec REQ-001; §2.2, §7).
- [x] T005 Record the two confirmed collapse hazards as fixtures-to-write: `deep-improvement` shared by `agent-improvement`/`model-benchmark`/`skill-benchmark`; `review` runtime key shared by `review`(`deep-review`)/`alignment`(`deep-alignment`).

## Phase 2: Compile the deep-loop policy slice

- [x] T006 Compile `CompiledPolicyV1.destinations[]` for `skillId=system-deep-loop`, one destination per public mode (REQ-001).
- [x] T007 Key each destination on `(skillId, workflowMode, packetId, packetKind, backendKind)` + `runtimeLoopType` + `role`; assert the identity function is injective across all seven (REQ-004).
- [x] T008 Add the shared-packet no-collapse assertion: three `deep-improvement` modes stay distinct, retaining `routingClass` `alias-fold`/`command-bridge` (REQ-002). A collapse hard-fails.
- [x] T009 Add the shared-runtime-key no-collapse assertion: `review` and `alignment` stay distinct at identical `runtimeLoopType=review` with different `packetId` (REQ-003). A collapse hard-fails.
- [x] T010 Encode the backend/runtime relationships as annotating `crossTargetEdges` (projections, not merges) and fix `selectionKinds={single}`; assert no bundle can be emitted (REQ-006; §5.3, §2.3).

## Phase 3: Projections & route-gold parity (scorer untouched)

- [x] T011 Emit `AdvisorProjectionV1` carrying `effectivePolicyHash` + projection hash; preserve each mode's `routingClass` as a compatibility alias projection (REQ-005; §8.2).
- [x] T012 Wire the projection-hash drift guard: on mismatch, advisor evidence degrades to annotation-only and never rewrites a route (REQ-005).
- [x] T013 Build the compatibility projector mapping typed decisions into the existing `{workflowMode, leafResourceId}` observation shape via `shared/references/smart_routing.md` (REQ-009; §8.2).
- [x] T014 Author `TypedRouteGoldV1` fixtures for deep-loop: exact single routes per mode, the two no-collapse cases, zero-signal `defer(no-match)` with no default union, one-turn `clarify`, forbidden `reject`, stale/absent advisor parity, injectivity assertion.
- [x] T015 Run shadow parity with zero live authority; confirm deep-loop route-gold stays green (REQ-009; §8.2).
- [x] T016 [P] Assert `router-replay.cjs` is byte-unchanged (diff == 0); a required scorer edit is logged as a migration failure, not applied (REQ-009; §10).
- [x] T017 [P] (P1) Generate the deep-loop `PolicyCardV1.md` from the same compiled snapshot; run the document-only replay lane and confirm it matches the machine policy (REQ-010; §8.3).

## Phase 4: Dual-read, canary & rollback (Stage-4 gate)

- [x] T018 Stage-2 dual-read: confirm every `workflowMode`, `/deep:*` command, and advisor alias resolves through a declared mode/alias; unmapped input fails closed (§9 Stage 2).
- [x] T019 Verify no over-emission: a zero-signal deep-loop request yields `defer(no-match)` with the `UNKNOWN_FALLBACK` checklist as the `clarify` payload; no full-registry union (REQ-007; §10).
- [x] T020 Run the fenced Stage-4 canary on `system-deep-loop`: zero hard mismatch vs legacy; advisor identity matched-or-ignored; document parity passes (spec MIGRATION GATE).
- [x] T021 Execute the rollback drill: CAS swap (token lock + fencing epoch; atomic temp/fsync/rename) to the byte-identical prior manifest; retain the prior generation through the bake window (REQ-008; §9).
- [x] T022 Assert a request observing mixed generations hard-blocks, and that no non-`route` decision carries a target/authority (§9 hard gates).
- [x] T023 Record the Stage-4 evidence bundle and confirm the gate is OPEN for `006/003` (`mcp-tooling`) activation.

## Phase 5: Verification & reconciliation

- [B] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and resolve any errors. **Blocked by the execution brief's explicit `Do NOT run validate.sh` constraint.**
- [x] T025 Verify `count(destinations)==7` and `count(packets)==5`; both no-collapse assertions green (SC-001).
- [x] T026 Reconcile `spec.md`/`plan.md`/`tasks.md` completion metadata; make no completion claim without the canary + rollback evidence.

### Phase Evidence

| Phase | Status | Evidence |
|-------|--------|----------|
| Preconditions and extraction | Pass | Seven registry rows and both live collapse hazards are captured in `compiled/projection-graph.json`. |
| Compile | Pass | Seven distinct public modes and injective destinations, five packets, verbatim runtime discriminators, single-only selection, and specific duplicate/missing refusals. |
| Projections and parity | GREEN | Eleven delivered rows pass real read-only `evaluateRouteGold`; all seven positive rows come from live producer output; fifteen full-request document decisions match. |
| Canary and rollback | Pass | Nine aggregate hard blocks driven; mixed pins refused; prior/restored manifest bytes identical. |
| Reconciliation | Partial | Phase docs reconciled; strict packet validation prohibited and not run. |

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] SC-001..SC-005 met with evidence; `router-replay.cjs` byte-unchanged
- [x] Stage-4 per-hub canary gate for `system-deep-loop` proven, rollback drill byte-exact, gate open for `006/003`

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md`
- **Master plan**: `../../spec.md`
