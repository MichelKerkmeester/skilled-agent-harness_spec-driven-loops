---
title: "Tasks: Unified Router Refactor — sk-code Per-Hub Canary"
description: "Ordered, checkable task list to compile sk-code into a surfaceBundle route, wire it behind the fenced activation selector with legacy serving-authoritative, add typed route-gold fixtures via the compatibility projector (scorer untouched), prove advisor degradation and document parity, and demonstrate a byte-exact rollback drill for the Stage-4 per-hub canary gate."
trigger_phrases:
  - "sk-code canary tasks"
  - "surfaceBundle activation task list"
  - "stage-4 per-hub canary checklist sk-code"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Unified Router Refactor — sk-code Per-Hub Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Preconditions and inventory

- [ ] T001 [B] Confirm upstream phases landed and frozen: schemas (`000`), shadow compiler + fenced selector (`001`), evaluator + compatibility projector (`002`) (blocked until those phases complete)
- [ ] T002 Record the frozen legacy route-gold baseline for `sk-code` (Stage 0)
- [ ] T003 Inventory `sk-code` authored routing: workflow modes, surface packets, `routerPolicy.outcomes.surfaceBundle`, legacy alias set (`.opencode/skills/sk-code/mode-registry.json`, `SKILL.md:50-57`)
- [ ] T004 [P] Enumerate the dual-read alias set and confirm each entry has a target mode (Stage 2 precondition)

## Phase 2: Compile sk-code into the contract

- [ ] T005 Compile the `sk-code` destination graph: `workflow` modes → `actor` (`mutatesWorkspace=true`); `surface` packets → `evidence` (`mutatesWorkspace=false`, `routingClass: metadata`) — REQ-001
- [ ] T006 Assign destination identity `(skillId, workflowMode, packetId, packetKind, backendKind)` + role per destination (synthesis §2.2)
- [ ] T007 Model the bundle outcome as `route(surfaceBundle, [actor, ...evidence])` ordered by order-of-loading, actor first — REQ-002
- [ ] T008 Encode the authority fence: only `actor` targets reach COMMIT; `evidence` authority structurally withheld; VERIFY refuses evidence-COMMIT — REQ-003
- [ ] T009 [P] Generate `AdvisorProjectionV1` for sk-code (hub id, eligible modes, admission labels, `effectivePolicyHash`, projection hash) — REQ-006
- [ ] T010 [P] Generate `PolicyCardV1.md` for sk-code from the same compiled snapshot — REQ-008
- [ ] T011 Verify byte-identical recompile from identical authored input (determinism, NFR-D01)

## Phase 3: Fixtures and parity (scorer untouched)

- [ ] T012 Add surfaceBundle route fixture: `"review my webflow animation for jank"` → `route(surfaceBundle, [code-review(actor), code-webflow(evidence)])` — REQ-002
- [ ] T013 Add single-mode degenerate fixture: workflow mode + zero surfaces → `route(single, [actor])`
- [ ] T014 Add evidence-cannot-COMMIT hard-block fixture (evidence in a COMMIT path → activation hard-blocks; VERIFY refuses) — REQ-003, SC-002
- [ ] T015 Add advisor parity fixtures: `live`+identity-match ranks; `stale` annotates; `absent` contributes zero, routes on last-known-good — REQ-006, SC-004
- [ ] T016 Add no-over-emission fixtures: zero-signal → `defer(no-match)` (no default union); ambiguous → one `clarify` from `UNKNOWN_FALLBACK_CHECKLIST` (`SKILL.md:64-69`); forbidden → `reject` — REQ-007
- [ ] T017 Add dual-read fixture: every legacy alias resolves; unmapped fails closed (Stage 2) — REQ-009
- [ ] T018 Project all fixtures through the compatibility projector into `observedIntents`/`observedResources`; run the route-gold gate — REQ-004
- [ ] T019 Assert zero hard route-gold mismatch AND empty scorer diff (`git diff router-replay.cjs` shows no change) — SC-001, REQ-004
- [ ] T020 Run the document-only replay lane against the sk-code policy card; confirm decision parity with no silent machine fallback — REQ-008, SC-004

## Phase 4: Fenced activation and rollback drill

- [ ] T021 Add the sk-code candidate generation to the fenced activation manifest; keep legacy serving-authoritative — REQ-005
- [ ] T022 Prove one-generation pinning per request; assert no request observes mixed generations (NFR-D02)
- [ ] T023 Execute the rollback drill: accept → ship (canary) → rollback CAS to the retained prior generation — REQ-005, SC-003
- [ ] T024 Verify the rollback restores byte-identical prior manifest bytes and passes the preimage drift check — SC-003, NFR-R01

## Phase 5: Stage-4 gate reconciliation and handoff

- [ ] T025 Reconcile the Stage-4 per-hub canary gate: zero hard mismatch, advisor identity matches-or-ignored, document parity, rollback drill proven — MIGRATION GATE
- [ ] T026 Confirm no hard-block condition present (evidence commit, negative-with-authority, hash mismatch, mixed generation, clarify/handoff on exact route, COMMIT without VERIFY, scorer edit) — synthesis §9
- [ ] T027 Record compiled sk-code slice, fixtures, and rollback proof as reproducible evidence for the `006/002` (system-deep-loop) handoff — SC-005
- [ ] T028 Reconcile spec.md / plan.md / tasks.md completion claims; no conflicting states

---

## Completion Criteria

- [ ] All tasks marked `[x]` (except any user-approved deferrals)
- [ ] No `[B]` blocked tasks remaining
- [ ] Stage-4 per-hub canary gate green for `sk-code`; scorer diff empty
- [ ] Byte-exact rollback drill demonstrated; prior generation retained
- [ ] Handoff evidence recorded for `006/002`

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../009-unified-refactor-research/unified-refactor-synthesis.md` (§7, §9, §2.3, §8.1–§8.3, §10)
- **Master plan gate model**: `../../spec.md` (Shared Migration-Gate Model, Stage 4)
