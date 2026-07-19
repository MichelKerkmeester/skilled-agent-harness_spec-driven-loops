---
title: "Tasks: Activate the Compiled Contract on mcp-tooling (Phase 006/003)"
description: "Ordered, checkable task list to execute the mcp-tooling activation plan: confirm preconditions and blast-radius data, author the destination graph and the two composition edge kinds (composeAfter, requiresAuthorityFrom), specify the fenced selector and fixtures via the compatibility projector, and pass the Stage 4 canary + Stage 6 destination-rollout gates with read-only legs before mutating legs. The shared scorer is never touched."
trigger_phrases:
  - "mcp-tooling activation tasks"
  - "composeAfter requiresAuthorityFrom tasks"
  - "stage 4 canary stage 6 destination rollout tasks"
importance_tier: "critical"
contextType: "implementation"
status: "executed; execution-plane idempotency alignment and all listed tasks evidenced by the phase-local canary; strict packet validation blocked by legacy template/runtime prerequisites"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Activate the Compiled Contract on mcp-tooling (Phase 006/003)

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description [gate/synthesis ref]`

---

## Phase A: Preconditions

- [x] T001 Confirm `006/002` (`system-deep-loop`) Stage 4 canary is cleared; mcp-tooling activates LAST [synthesis §9]
- [x] T002 Obtain real blast-radius data resolving open question Q1 (mcp-tooling-last vs Terra's transports-first) before opening Stage 4 [synthesis §11 Q1]
- [x] T003 Re-read the `mcp-tooling` transport/judgment boundary as source-of-truth [`.opencode/skills/mcp-tooling/SKILL.md:15,32-36`]
- [x] T004 [P] Inventory tooling transports (mcp-figma, mcp-refero, mcp-mobbin) and note mcp-code-mode as external infrastructure, never a judgment authority [synthesis §7]

---

## Phase B: Author the compiled destination graph

- [x] T005 Enumerate `destinations[]` for mcp-tooling with `role ∈ {actor, evidence, transport, judgment}` [synthesis §2.2]
- [x] T006 Assert invariant: no `transport`-role destination appears as an approver in any `authorityGraph[]` edge (transports never own judgment) [synthesis §7, §9]
- [x] T007 Fix `selectionKinds = {single, orderedBundle}` and document that "ordered" here means *effect order*, distinct from `sk-code`'s order-of-loading evidence [synthesis §5.3, §7]

---

## Phase C: Author composition + authority edges

- [x] T008 Specify `composeAfter(A, B)` rules for effect-ordered transport chains; ordering is a successful-route shape, never a recovery mechanism [synthesis §6, §7]
- [x] T009 Specify `requiresAuthorityFrom(T, J)` edges in `authorityGraph[]`: transport T reaches COMMIT only after judgment J approves the pinned intent [synthesis §7, §2.2]
- [x] T010 Specify authority as destination-local and scoped to the approved intent, consumed only at VERIFY→COMMIT; every non-`route` decision withholds authority [synthesis §2.3, §10]
- [x] T011 Author the canonical worked case: `orderedBundle[ sk-design/<mode>, mcp-tooling/mcp-figma ]`, transport authorized only post-approval [synthesis §7]
- [x] T012 Assert no hub-name or transport-name conditional exists anywhere; all behavior lives in compiled data [synthesis §5.3, §7]

---

## Phase D: Fenced activation selector

- [x] T013 Specify accept-snapshot of candidate artifacts + prior manifest; expected generation/hash compare; atomic swap under token lock + fencing epoch checked immediately before rename [synthesis §9]
- [x] T014 Specify one-generation-per-request pinning; retained prior generation during the activation window [synthesis §9]

---

## Phase E: Fixtures via the compatibility projector (scorer untouched)

- [x] T015 Enumerate fixture families: exact single route; ordered bundle; `role escalation + missing authority dependency`; direct route with forbidden handoff artifacts; stale/absent advisor parity; stale proof rejected by VERIFY; duplicate idempotency-key receipt [synthesis §8.2]
- [x] T016 Confirm each fixture maps back through the existing compatibility projector into the intent/resource gold shape [synthesis §8.2]
- [x] T017 Assert `router-replay.cjs` is unedited; log any required scorer edit as a MIGRATION FAILURE, not a fix [synthesis §8.2, §10]

---

## Phase F: Gates + rollback drill

- [x] T018 Define the Stage 4 per-hub canary acceptance: zero hard mismatch; advisor identity match-or-ignore; document parity; rollback drill proven [master plan Stage 4; synthesis §9]
- [x] T019 Define the Stage 6 destination-rollout acceptance: proof/expiry/read-set/authority/epoch/idempotency/receipt fixtures pass, read-only legs proven BEFORE any mutating leg is enabled [master plan Stage 6; synthesis §9]
- [x] T020 Define document-only parity: generated `PolicyCardV1.md` reaches the same decision and emits `PREPARED_DRAFT`, never claiming live activation freshness or committed effects [synthesis §8.3]
- [x] T021 Define rollback = fenced CAS to byte-identical prior manifest; state explicitly it CANNOT undo an external COMMITted effect; post-effect recovery is destination-owned [synthesis §9]
- [x] T022 Enumerate the hard gates that block activation and assert each: transport-supplies-judgment, missing authority edge, COMMIT-without-VERIFY, duplicate-key second effect, exact-route-with-clarify/handoff-artifacts, hash mismatch, mixed generations [synthesis §9]
- [x] T023 Align composition idempotency with the frozen `RouteProofV1` binding over request facts, full target, and effective policy [synthesis §3 Idea 7]
- [x] T024 Prove policy-only changes alter the key and the resulting key equals the execution-plane owner's derivation [synthesis §8.2]

---

## Completion Criteria

- [x] All tasks marked `[x]`; no `[B]` blocked tasks remaining
- [x] Destination graph, composition edges, and authority graph specified as compiled data (no name conditionals)
- [x] Design-affecting Figma worked case specified with authority withheld until approval
- [x] Stage 4 canary + Stage 6 destination-rollout gates defined with read-only-before-mutating sequencing
- [x] Route-gold green throughout; `router-replay.cjs` untouched
- [x] Rollback drill defined including the external-COMMIT limit
- [x] Composition idempotency teeth pass for effective-policy sensitivity and execution-plane parity

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md`
- **Phase parent / gate model**: `../../spec.md`
