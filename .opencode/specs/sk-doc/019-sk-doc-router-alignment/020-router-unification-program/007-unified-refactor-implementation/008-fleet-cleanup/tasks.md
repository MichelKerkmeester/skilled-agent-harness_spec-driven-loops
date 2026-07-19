---
title: "Tasks: Fleet Cleanup — Retire the Legacy Dual-Read Path"
description: "Ordered, checkable execution list for the terminal cleanup phase: readiness preflight, skillId-parameterized per-skill deletion in activation order, hot-card alias stripping via snapshot regeneration, drift-checked final state, and byte-exact rollback drill — scorer untouched."
trigger_phrases:
  - "fleet cleanup tasks"
  - "per-skill deletion checklist"
  - "dual-read retirement tasks"
importance_tier: "critical"
contextType: "implementation"
status: "blocked-shadow"
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

- [ ] T001 [B] Read the `ActivationManifestV1` selector and confirm all four hubs (`mcp-code-mode`, `sk-code`, `system-deep-loop`, `mcp-tooling`) are on the compiled generation with zero open Stage-4 canary mismatch (REQ-001).
  - **Evidence**: all four committed selectors are legacy/shadow-only at generation 0; `system-deep-loop` also has an open `shadow-partial` route-gold gate.
- [x] T002 HALT if any hub is still legacy-authoritative or has an open canary mismatch — deletion is blocked until phase 006 is green fleet-wide (REQ-001, MIGRATION GATE).
  - **Evidence**: the real committed bytes produce `PREFLIGHT_BLOCKED/not-rolled-out`; no token or deletion is authorized.
- [ ] T003 [B] Record the post-rollout compiled-policy fingerprint that the terminal drift check compares against (REQ-005).
  - **Evidence**: blocked because no committed post-rollout selector exists; the checked-in generation-8 file is hypothetical only.
- [ ] T004 [B] Confirm retained-prior-generation storage and the bake-window policy are in place before any deletion (REQ-003, NFR-R01).
  - **Evidence**: blocked before real retained-generation creation; only the implementation and isolated positive control exist.
- [ ] T005 [B] Capture route-gold + drift-check baselines for delta comparison.
  - **Evidence**: fleet baseline is not green; `system-deep-loop` currently has seven resource mismatches.

---

## Phase 2: Per-Skill Deletion (activation order)

- [x] T006 Confirm the deletion driver is parameterized by `skillId` only; `rg -n 'SingularRouter\|skillId == .mcp-code-mode.\|if.*mcp-code-mode'` over the cleanup surface returns zero matches (REQ-002, SC-002).
  - **Evidence**: the validator reports `nameConditionalBranches:0`; the driver remains parameterized by `skillId`.
- [ ] T007 [B] `mcp-code-mode` (N=1): delete legacy dual-read resolver entries, registry adapters, and the compatibility alias array via the identical driver (walks empty ranking/bundle/handoff collections, no skill-name branch) (REQ-002, §5.2).
  - **Evidence**: blocked by the committed legacy/shadow-only selector.
- [ ] T008 [B] `mcp-code-mode`: fenced CAS to a generation without its dual-read; retain the byte-identical prior generation (REQ-003).
  - **Evidence**: blocked before any real file swap; the stale-CAS negative control remains green.
- [ ] T009 [B] `mcp-code-mode`: route-gold replay via the compatibility projector is byte-identical; drift check green; unmapped legacy input fails closed (REQ-005, NFR-S01).
  - **Evidence**: blocked before deletion by real committed readiness.
- [ ] T010 [B] `mcp-code-mode`: assert no over-emission — zero-signal returns `defer(no-match)` and the singular-omission + zero rank-call fixture still holds (REQ-006, §8.2).
  - **Evidence**: blocked before post-cleanup replay.
- [ ] T011 [B] `sk-code`: repeat T007–T010 (delete → CAS + retain → route-gold + drift → no-over-emission).
  - **Evidence**: blocked by the committed legacy/shadow-only selector.
- [ ] T012 [B] `system-deep-loop`: repeat T007–T010.
  - **Evidence**: blocked by committed readiness and `shadow-partial` candidate route-gold.
- [ ] T013 [B] `mcp-tooling`: repeat T007–T010 (highest blast radius — last).
  - **Evidence**: blocked by the committed legacy/shadow-only selector.

---

## Phase 3: Hot-Card & Final State

- [ ] T014 [B] Strip the compatibility alias array from the hot card by regenerating `PolicyCardV1.md` from the compiled snapshot (no hand-edit) (REQ-004, §5.3).
  - **Evidence**: blocked; no real terminal cleanup state exists.
- [ ] T015 [B] Verify the regenerated card carries no alias array and passes document-parity + the document-only replay lane (REQ-004, §8.3).
  - **Evidence**: blocked; the checked-in card is a hypothetical artifact only.
- [ ] T016 [B] Run the final drift check: preimage compare of the post-cleanup compiled policy vs the T003 fingerprint — must pass (REQ-005).
  - **Evidence**: blocked because T003 has no real post-rollout fingerprint.
- [ ] T017 [B] Run the full typed route-gold family + compatibility-projector fixtures; confirm byte-identical to baseline (SC-005).
  - **Evidence**: blocked; current `system-deep-loop` route-gold is `shadow-partial`.
- [ ] T018 [B] Prove byte-exact fenced-CAS rollback of a retained prior generation (hash equality) within the bake window; document that rollback cannot undo an external COMMITted effect (REQ-003, NFR-R02, §9).
  - **Evidence**: blocked before real deletion; stale CAS still rejects without changing target bytes.
- [x] T019 Confirm `git diff --stat -- '**/router-replay.cjs'` is empty — scorer untouched across the whole cleanup (REQ-007, SC-005).
  - **Evidence**: no git command was run; before/after SHA-256 values remain `b039b8dd...`, `d5a9cc72...`, and `249be7c1...`.

---

## Completion Criteria

- [ ] All tasks marked `[x]`.
  - **Evidence**: cleanup tasks remain blocked until committed rollout evidence becomes compiled-authoritative and fleet-green.
- [ ] No `[B]` blocked tasks remaining (phase 006 confirmed green fleet-wide).
  - **Evidence**: committed selectors remain legacy/shadow-only and `system-deep-loop` remains `shadow-partial`.
- [ ] SC-001..SC-005 satisfied with evidence: sole compiled resolver, N=1 via identical path, drift + rollback proven, hot card alias-free, scorer unchanged.
  - **Evidence**: the harness exits 0 with the honest current-state result `status:"PREFLIGHT_BLOCKED"`; no real cleanup occurred.

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§5.3, §9 Stage 7, §10)
- **Shared gate model**: `../spec.md`
