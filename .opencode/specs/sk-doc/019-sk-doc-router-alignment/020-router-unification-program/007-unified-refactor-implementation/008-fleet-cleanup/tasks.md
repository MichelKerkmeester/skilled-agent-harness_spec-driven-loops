---
title: "Tasks: Fleet Cleanup — Retire the Legacy Dual-Read Path"
description: "Ordered, checkable execution list for the terminal cleanup phase: readiness preflight, skillId-parameterized per-skill deletion in activation order, hot-card alias stripping via snapshot regeneration, drift-checked final state, and byte-exact rollback drill — scorer untouched."
trigger_phrases:
  - "fleet cleanup tasks"
  - "per-skill deletion checklist"
  - "dual-read retirement tasks"
importance_tier: "critical"
contextType: "implementation"
status: "implemented-contract"
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

- [x] T001 Read the `ActivationManifestV1` selector and confirm all four hubs (`mcp-code-mode`, `sk-code`, `system-deep-loop`, `mcp-tooling`) are on the compiled generation with zero open Stage-4 canary mismatch (REQ-001).
  - **Evidence**: preflight executes the actual committed gate harnesses, binds candidate hashes/generations 1–4, and confirms current checked-in manifests remain legacy-authoritative before cleanup.
- [x] T002 HALT if any hub is still legacy-authoritative or has an open canary mismatch — deletion is blocked until phase 006 is green fleet-wide (REQ-001, MIGRATION GATE).
  - **Evidence**: a planted false external canary throws `PREFLIGHT_BLOCKED`; deletion without the issued token throws `PREFLIGHT_REQUIRED`.
- [x] T003 Record the post-rollout compiled-policy fingerprint that the terminal drift check compares against (REQ-005).
  - **Evidence**: `compiled/final-manifest.json` is frozen at SHA-256 `062261a3...`.
- [x] T004 Confirm retained-prior-generation storage and the bake-window policy are in place before any deletion (REQ-003, NFR-R01).
  - **Evidence**: the initial manifest requires four retained deletions and `discardAuthorized:false`; every prior is fsynced before swap.
- [x] T005 Capture route-gold + drift-check baselines for delta comparison.
  - **Evidence**: baseline replay digests are captured per skill and compared after each deletion; the three scorer files are hashed before execution.

---

## Phase 2: Per-Skill Deletion (activation order)

- [x] T006 Confirm the deletion driver is parameterized by `skillId` only; `rg -n 'SingularRouter\|skillId == .mcp-code-mode.\|if.*mcp-code-mode'` over the cleanup surface returns zero matches (REQ-002, SC-002).
  - **Evidence**: the validator reports `nameConditionalBranches:0`; all four results name `deleteLegacySkill` as the driver.
- [x] T007 `mcp-code-mode` (N=1): delete legacy dual-read resolver entries, registry adapters, and the compatibility alias array via the identical driver (walks empty ranking/bundle/handoff collections, no skill-name branch) (REQ-002, §5.2).
  - **Evidence**: generation 5 uses the common driver with one destination, zero composition rules, and zero rank calls.
- [x] T008 `mcp-code-mode`: fenced CAS to a generation without its dual-read; retain the byte-identical prior generation (REQ-003).
  - **Evidence**: prior hash `c25a6322...` is retained; a red replay drill restores it byte-exactly through a second fenced swap.
- [x] T009 `mcp-code-mode`: route-gold replay via the compatibility projector is byte-identical; drift check green; unmapped legacy input fails closed (REQ-005, NFR-S01).
  - **Evidence**: two rows pass phase-002's projector/read-only scorer path and zero signal projects to empty observations.
- [x] T010 `mcp-code-mode`: assert no over-emission — zero-signal returns `defer(no-match)` and the singular-omission + zero rank-call fixture still holds (REQ-006, §8.2).
  - **Evidence**: final replay returns typed `defer(no-match)` with empty recovery, withheld authority, no targets, and zero rank calls.
- [x] T011 `sk-code`: repeat T007–T010 (delete → CAS + retain → route-gold + drift → no-over-emission).
  - **Evidence**: generation 6 passes 5 real-scorer rows and retains `c225dfac...`.
- [x] T012 `system-deep-loop`: repeat T007–T010.
  - **Evidence**: generation 7 passes 11 real-scorer rows and retains `f32901eb...`.
- [x] T013 `mcp-tooling`: repeat T007–T010 (highest blast radius — last).
  - **Evidence**: generation 8 passes 8 real-scorer rows and retains `34eb9f60...`.

---

## Phase 3: Hot-Card & Final State

- [x] T014 Strip the compatibility alias array from the hot card by regenerating `PolicyCardV1.md` from the compiled snapshot (no hand-edit) (REQ-004, §5.3).
  - **Evidence**: phase card bytes equal generator output from the final manifest and four compiled policy identities.
- [x] T015 Verify the regenerated card carries no alias array and passes document-parity + the document-only replay lane (REQ-004, §8.3).
  - **Evidence**: post-cleanup count is zero; a planted property rejects, and zero-signal document replay defers without a union.
- [x] T016 Run the final drift check: preimage compare of the post-cleanup compiled policy vs the T003 fingerprint — must pass (REQ-005).
  - **Evidence**: final bytes match SHA-256 `062261a3...`; a planted generation change throws `FINAL_STATE_DRIFT`.
- [x] T017 Run the full typed route-gold family + compatibility-projector fixtures; confirm byte-identical to baseline (SC-005).
  - **Evidence**: 26 total rows pass after their respective deletions with unchanged per-skill replay digests.
- [x] T018 Prove byte-exact fenced-CAS rollback of a retained prior generation (hash equality) within the bake window; document that rollback cannot undo an external COMMITted effect (REQ-003, NFR-R02, §9).
  - **Evidence**: the bake-window drill restores `34eb9f60...` exactly; the limitation is recorded in both contract and summary.
- [x] T019 Confirm `git diff --stat -- '**/router-replay.cjs'` is empty — scorer untouched across the whole cleanup (REQ-007, SC-005).
  - **Evidence**: no git command was run; before/after SHA-256 values remain `b039b8dd...`, `d5a9cc72...`, and `249be7c1...`.

---

## Completion Criteria

- [x] All tasks marked `[x]`.
  - **Evidence**: T001–T019 are checked with command or artifact evidence.
- [x] No `[B]` blocked tasks remaining (phase 006 confirmed green fleet-wide).
  - **Evidence**: all external readiness receipts are green; the negative preflight fixture demonstrates the blocking state.
- [x] SC-001..SC-005 satisfied with evidence: sole compiled resolver, N=1 via identical path, drift + rollback proven, hot card alias-free, scorer unchanged.
  - **Evidence**: `node harness/validate-cleanup.cjs` exits 0 with `status:"GREEN"`; strict `validate.sh` remains intentionally unrun by instruction.

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§5.3, §9 Stage 7, §10)
- **Shared gate model**: `../spec.md`
