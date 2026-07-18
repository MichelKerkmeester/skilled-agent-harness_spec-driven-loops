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

- [x] T001 Confirm upstream phases landed and frozen: schemas (`000`), shadow compiler + fenced selector (`001`), evaluator + compatibility projector (`002`)
- [x] T002 Record the frozen legacy route-gold baseline for `sk-code` (Stage 0)
- [x] T003 Inventory `sk-code` authored routing: workflow modes, surface packets, `routerPolicy.outcomes.surfaceBundle`, legacy alias set (`.opencode/skills/sk-code/mode-registry.json`, `SKILL.md:50-57`)
- [x] T004 [P] Enumerate the dual-read alias set and confirm each entry has a target mode (Stage 2 precondition)

**Evidence**: Upstream harnesses exited 0; the compiler binds the live authored bytes, emits four destinations, and resolves all 29 aliases.

## Phase 2: Compile sk-code into the contract

- [x] T005 Compile the `sk-code` destination graph: `workflow` modes → `actor` (`mutatesWorkspace=true`); `surface` packets → `evidence` (`mutatesWorkspace=false`, `routingClass: metadata`) — REQ-001
- [x] T006 Assign destination identity `(skillId, workflowMode, packetId, packetKind, backendKind)` + role per destination (synthesis §2.2)
- [x] T007 Model the bundle outcome as `route(surfaceBundle, [actor, ...evidence])` ordered by order-of-loading, actor first — REQ-002
- [x] T008 Encode the authority fence: only `actor` targets reach COMMIT; `evidence` authority structurally withheld; VERIFY refuses evidence-COMMIT — REQ-003
- [x] T009 [P] Generate `AdvisorProjectionV1` for sk-code (hub id, eligible modes, admission labels, `effectivePolicyHash`, projection hash) — REQ-006
- [x] T010 [P] Generate `PolicyCardV1.md` for sk-code from the same compiled snapshot — REQ-008
- [x] T011 Verify byte-identical recompile from identical authored input (determinism, NFR-D01)

**Evidence**: Canonical base/effective hashes are `54bdc95a…cc06` and `77bf5a97…b31c`; independent recompile is byte-identical and a self-declared mismatch is rejected.

## Phase 3: Fixtures and parity (scorer untouched)

- [x] T012 Add surfaceBundle route fixture: `"review my webflow animation for jank"` → `route(surfaceBundle, [code-review(actor), code-webflow(evidence)])` — REQ-002
- [x] T013 Add single-mode degenerate fixture: workflow mode + zero surfaces → `route(single, [actor])`
- [x] T014 Add evidence-cannot-COMMIT hard-block fixture (evidence in a COMMIT path → activation hard-blocks; VERIFY refuses) — REQ-003, SC-002
- [x] T015 Add advisor parity fixtures: `live`+identity-match ranks; `stale` annotates; `absent` contributes zero, routes on last-known-good — REQ-006, SC-004
- [x] T016 Add no-over-emission fixtures: zero-signal → `defer(no-match)` (no default union); ambiguous → one `clarify` from `UNKNOWN_FALLBACK_CHECKLIST` (`SKILL.md:64-69`); forbidden → `reject` — REQ-007
- [x] T017 Add dual-read fixture: every legacy alias resolves; unmapped fails closed (Stage 2) — REQ-009
- [x] T018 Project all fixtures through the compatibility projector into `observedIntents`/`observedResources`; run the route-gold gate — REQ-004
- [x] T019 Assert zero hard route-gold mismatch AND unchanged scorer digests — SC-001, REQ-004
- [x] T020 Run the document-only replay lane against the sk-code policy card; confirm decision parity with no silent machine fallback — REQ-008, SC-004

**Evidence**: Real `evaluateRouteGold` passes 5/5 independently authored rows; corrupted observation fails, all hard blocks name exact refusal codes, and planted document divergence is rejected.

## Phase 4: Fenced activation and rollback drill

- [x] T021 Add the sk-code candidate generation to the fenced activation manifest; keep legacy serving-authoritative — REQ-005
- [x] T022 Prove one-generation pinning per request; assert no request observes mixed generations (NFR-D02)
- [x] T023 Execute the rollback drill: accept → ship (canary) → rollback CAS to the retained prior generation — REQ-005, SC-003
- [x] T024 Verify the rollback restores byte-identical prior manifest bytes and passes the preimage drift check — SC-003, NFR-R01

**Evidence**: The phase-local drill rejects a wrong preimage and mixed request pins, advances fencing epoch 0→1→2, and restores exact retained bytes with matching SHA-256.

## Phase 5: Stage-4 gate reconciliation and handoff

- [x] T025 Reconcile the Stage-4 per-hub canary gate: zero hard mismatch, advisor identity matches-or-ignored, document parity, rollback drill proven — MIGRATION GATE
- [x] T026 Confirm no hard-block condition present (evidence commit, negative-with-authority, hash mismatch, mixed generation, clarify/handoff on exact route, COMMIT without VERIFY, scorer edit) — synthesis §9
- [x] T027 Record compiled sk-code slice, fixtures, and rollback proof as reproducible evidence for the `006/002` (system-deep-loop) handoff — SC-005
- [x] T028 Reconcile spec.md / plan.md / tasks.md completion claims; no conflicting states

**Evidence**: Validator reports `status: GREEN`, all Stage-4 sub-gates pass, and the accepted candidate remains `legacy`/`shadowOnly` for safe handoff.

---

## Completion Criteria

- [x] All tasks marked `[x]` (no deferrals)
- [x] No `[B]` blocked tasks remaining
- [x] Stage-4 per-hub canary gate green for `sk-code`; scorer digests unchanged
- [x] Byte-exact rollback drill demonstrated; prior generation retained
- [x] Handoff evidence recorded for `006/002`

**Evidence**: `checklist.md` records 23/23 P0 and 5/5 P1 checks with command-backed evidence; `implementation-summary.md` records the remaining external boundaries.

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (§7, §9, §2.3, §8.1–§8.3, §10)
- **Master plan gate model**: `../../spec.md` (Shared Migration-Gate Model, Stage 4)
