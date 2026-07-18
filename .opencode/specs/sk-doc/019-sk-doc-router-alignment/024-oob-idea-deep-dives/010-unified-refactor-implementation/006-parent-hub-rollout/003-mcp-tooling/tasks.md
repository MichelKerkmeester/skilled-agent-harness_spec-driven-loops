---
title: "Tasks: Activate the Compiled Contract on mcp-tooling (Phase 006/003)"
description: "Ordered, checkable task list to execute the mcp-tooling activation plan: confirm preconditions and blast-radius data, author the destination graph and the two composition edge kinds (composeAfter, requiresAuthorityFrom), specify the fenced selector and fixtures via the compatibility projector, and pass the Stage 4 canary + Stage 6 destination-rollout gates with read-only legs before mutating legs. The shared scorer is never touched."
trigger_phrases:
  - "mcp-tooling activation tasks"
  - "composeAfter requiresAuthorityFrom tasks"
  - "stage 4 canary stage 6 destination rollout tasks"
importance_tier: "critical"
contextType: "implementation"
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

- [ ] T001 Confirm `006/002` (`system-deep-loop`) Stage 4 canary is cleared; mcp-tooling activates LAST [synthesis §9]
- [ ] T002 Obtain real blast-radius data resolving open question Q1 (mcp-tooling-last vs Terra's transports-first) before opening Stage 4 [synthesis §11 Q1]
- [ ] T003 Re-read the `mcp-tooling` transport/judgment boundary as source-of-truth [`.opencode/skills/mcp-tooling/SKILL.md:15,32-36`]
- [ ] T004 [P] Inventory tooling transports (mcp-figma, mcp-refero, mcp-mobbin) and note mcp-code-mode as external infrastructure, never a judgment authority [synthesis §7]

---

## Phase B: Author the compiled destination graph

- [ ] T005 Enumerate `destinations[]` for mcp-tooling with `role ∈ {actor, evidence, transport, judgment}` [synthesis §2.2]
- [ ] T006 Assert invariant: no `transport`-role destination appears as an approver in any `authorityGraph[]` edge (transports never own judgment) [synthesis §7, §9]
- [ ] T007 Fix `selectionKinds = {single, orderedBundle}` and document that "ordered" here means *effect order*, distinct from `sk-code`'s order-of-loading evidence [synthesis §5.3, §7]

---

## Phase C: Author composition + authority edges

- [ ] T008 Specify `composeAfter(A, B)` rules for effect-ordered transport chains; ordering is a successful-route shape, never a recovery mechanism [synthesis §6, §7]
- [ ] T009 Specify `requiresAuthorityFrom(T, J)` edges in `authorityGraph[]`: transport T reaches COMMIT only after judgment J approves the pinned intent [synthesis §7, §2.2]
- [ ] T010 Specify authority as destination-local and scoped to the approved intent, consumed only at VERIFY→COMMIT; every non-`route` decision withholds authority [synthesis §2.3, §10]
- [ ] T011 Author the canonical worked case: `orderedBundle[ sk-design/<mode>, mcp-tooling/mcp-figma ]`, transport authorized only post-approval [synthesis §7]
- [ ] T012 Assert no hub-name or transport-name conditional exists anywhere; all behavior lives in compiled data [synthesis §5.3, §7]

---

## Phase D: Fenced activation selector

- [ ] T013 Specify accept-snapshot of candidate artifacts + prior manifest; expected generation/hash compare; atomic swap under token lock + fencing epoch checked immediately before rename [synthesis §9]
- [ ] T014 Specify one-generation-per-request pinning; retained prior generation during the activation window [synthesis §9]

---

## Phase E: Fixtures via the compatibility projector (scorer untouched)

- [ ] T015 Enumerate fixture families: exact single route; ordered bundle; `role escalation + missing authority dependency`; direct route with forbidden handoff artifacts; stale/absent advisor parity; stale proof rejected by VERIFY; duplicate idempotency-key receipt [synthesis §8.2]
- [ ] T016 Confirm each fixture maps back through the existing compatibility projector into the intent/resource gold shape [synthesis §8.2]
- [ ] T017 Assert `router-replay.cjs` is unedited; log any required scorer edit as a MIGRATION FAILURE, not a fix [synthesis §8.2, §10]

---

## Phase F: Gates + rollback drill

- [ ] T018 Define the Stage 4 per-hub canary acceptance: zero hard mismatch; advisor identity match-or-ignore; document parity; rollback drill proven [master plan Stage 4; synthesis §9]
- [ ] T019 Define the Stage 6 destination-rollout acceptance: proof/expiry/read-set/authority/epoch/idempotency/receipt fixtures pass, read-only legs proven BEFORE any mutating leg is enabled [master plan Stage 6; synthesis §9]
- [ ] T020 Define document-only parity: generated `PolicyCardV1.md` reaches the same decision and emits `PREPARED_DRAFT`, never claiming live activation freshness or committed effects [synthesis §8.3]
- [ ] T021 Define rollback = fenced CAS to byte-identical prior manifest; state explicitly it CANNOT undo an external COMMITted effect; post-effect recovery is destination-owned [synthesis §9]
- [ ] T022 Enumerate the hard gates that block activation and assert each: transport-supplies-judgment, missing authority edge, COMMIT-without-VERIFY, duplicate-key second effect, exact-route-with-clarify/handoff-artifacts, hash mismatch, mixed generations [synthesis §9]

---

## Completion Criteria

- [ ] All tasks marked `[x]`; no `[B]` blocked tasks remaining
- [ ] Destination graph, composition edges, and authority graph specified as compiled data (no name conditionals)
- [ ] Design-affecting Figma worked case specified with authority withheld until approval
- [ ] Stage 4 canary + Stage 6 destination-rollout gates defined with read-only-before-mutating sequencing
- [ ] Route-gold green throughout; `router-replay.cjs` untouched
- [ ] Rollback drill defined including the external-COMMIT limit

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../../009-unified-refactor-research/unified-refactor-synthesis.md`
- **Phase parent / gate model**: `../../spec.md`
