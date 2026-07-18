---
title: "Tasks: Fleet Cleanup — Retire the Legacy Dual-Read Path"
description: "Ordered, checkable execution list for the terminal cleanup phase: readiness preflight, skillId-parameterized per-skill deletion in activation order, hot-card alias stripping via snapshot regeneration, drift-checked final state, and byte-exact rollback drill — scorer untouched."
trigger_phrases:
  - "fleet cleanup tasks"
  - "per-skill deletion checklist"
  - "dual-read retirement tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Fleet Cleanup — Retire the Legacy Dual-Read Path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact/contract)`

---

## Phase 1: Readiness Preflight

- [ ] T001 Read the `ActivationManifestV1` selector and confirm all four hubs (`mcp-code-mode`, `sk-code`, `system-deep-loop`, `mcp-tooling`) are on the compiled generation with zero open Stage-4 canary mismatch (REQ-001).
- [ ] T002 [B] HALT if any hub is still legacy-authoritative or has an open canary mismatch — deletion is blocked until phase 006 is green fleet-wide (REQ-001, MIGRATION GATE).
- [ ] T003 Record the post-rollout compiled-policy fingerprint that the terminal drift check compares against (REQ-005).
- [ ] T004 Confirm retained-prior-generation storage and the bake-window policy are in place before any deletion (REQ-003, NFR-R01).
- [ ] T005 Capture route-gold + drift-check baselines for delta comparison.

---

## Phase 2: Per-Skill Deletion (activation order)

- [ ] T006 Confirm the deletion driver is parameterized by `skillId` only; `rg -n 'SingularRouter\|skillId == .mcp-code-mode.\|if.*mcp-code-mode'` over the cleanup surface returns zero matches (REQ-002, SC-002).
- [ ] T007 `mcp-code-mode` (N=1): delete legacy dual-read resolver entries, registry adapters, and the compatibility alias array via the identical driver (walks empty ranking/bundle/handoff collections, no skill-name branch) (REQ-002, §5.2).
- [ ] T008 `mcp-code-mode`: fenced CAS to a generation without its dual-read; retain the byte-identical prior generation (REQ-003).
- [ ] T009 `mcp-code-mode`: route-gold replay via the compatibility projector is byte-identical; drift check green; unmapped legacy input fails closed (REQ-005, NFR-S01).
- [ ] T010 `mcp-code-mode`: assert no over-emission — zero-signal returns `defer(no-match)` and the singular-omission + zero rank-call fixture still holds (REQ-006, §8.2).
- [ ] T011 `sk-code`: repeat T007–T010 (delete → CAS + retain → route-gold + drift → no-over-emission).
- [ ] T012 `system-deep-loop`: repeat T007–T010.
- [ ] T013 `mcp-tooling`: repeat T007–T010 (highest blast radius — last).

---

## Phase 3: Hot-Card & Final State

- [ ] T014 Strip the compatibility alias array from the hot card by regenerating `PolicyCardV1.md` from the compiled snapshot (no hand-edit) (REQ-004, §5.3).
- [ ] T015 Verify the regenerated card carries no alias array and passes document-parity + the document-only replay lane (REQ-004, §8.3).
- [ ] T016 Run the final drift check: preimage compare of the post-cleanup compiled policy vs the T003 fingerprint — must pass (REQ-005).
- [ ] T017 Run the full typed route-gold family + compatibility-projector fixtures; confirm byte-identical to baseline (SC-005).
- [ ] T018 Prove byte-exact fenced-CAS rollback of a retained prior generation (hash equality) within the bake window; document that rollback cannot undo an external COMMITted effect (REQ-003, NFR-R02, §9).
- [ ] T019 Confirm `git diff --stat -- '**/router-replay.cjs'` is empty — scorer untouched across the whole cleanup (REQ-007, SC-005).

---

## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining (phase 006 confirmed green fleet-wide).
- [ ] SC-001..SC-005 satisfied with evidence: sole compiled resolver, N=1 via identical path, drift + rollback proven, hot card alias-free, scorer unchanged.

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§5.3, §9 Stage 7, §10)
- **Shared gate model**: `../spec.md`
