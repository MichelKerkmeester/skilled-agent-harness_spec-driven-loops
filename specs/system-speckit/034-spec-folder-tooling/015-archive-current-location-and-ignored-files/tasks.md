---
title: "Tasks: Phase 15: archive-current-location-and-ignored-files"
description: "The task breakdown for current-location archives and the ignored-file index walk: the repair tool, the archive wiring, the upgrade alignment, the corpus walk, their tests and a real archive and restore."
trigger_phrases:
  - "archive current location and ignored files tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: archive-current-location-and-ignored-files

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the operator's choice of current-location semantics for archived packets, from phase 14's open question
- [x] T002 Reproduce the CI drift: a local index build listed 30 untracked containment copies that CI's fresh checkout never has
- [x] T003 [P] Find why an archived track packet fails after a move: the graph merge keeps a stored parent over a null re-derive (`.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Walk archived packets, write `description.json` `specFolder`, and clear the parent of a packet sitting directly in an archive (`.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs`)
- [x] T005 Re-derive the moved folder after every archive and restore, warning instead of failing (`.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh`)
- [x] T006 Run only `repair-derived` on failing archived packets under `--include-archive --apply` (`.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`)
- [x] T007 Skip untracked paths the committed `.gitignore` files exclude, and record the policy in `EXCLUSIONS` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`)
- [x] T008 [P] Describe the new behavior (`.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md`, `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T009 [P] Test each change (`trigger-index.vitest.ts`, `repair-derived.vitest.ts`, `archive-track.vitest.ts`, `upgrade-legacy.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the previous `repair-derived.cjs` on an archived fixture: it inspected 0 packets and left `specFolder` stale, so the new test can fail
- [x] T011 Archive and restore a real track packet with a stored parent: RESULT: PASSED before the move, after the archive and after the restore
- [x] T012 Rebuild the trigger index: the 30 containment copies leave the manifest, none of them tracked, and `--check` exits 0
- [x] T013 Run the spec-kit CLI suite and the sk-code drift guards
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - a real track packet archived and restored, validated at each step
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 to REQ-006, with the criteria table in `acceptance-criteria.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md - each fix at its producer, the archive move handing off to the repair tool
- [x] CHK-003 [P1] Dependencies identified and available - `repair-derived.cjs`, the graph backfill and git
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n` and shellcheck on `archive.sh`, `node --check` on the three Node tools
- [x] CHK-011 [P0] No console errors or warnings - the real archive and restore printed no warning
- [x] CHK-012 [P1] Error handling implemented - a missing or failing repair tool is reported after the move, unreadable JSON is left to the validator, and a missing git ignores nothing
- [x] CHK-013 [P1] Code follows project patterns - the re-derive mirrors the existing `refresh_track_root` hook, and the walk keeps machine-dependent paths out of the skipped list
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete - a real track packet archived and restored, validated at each step
- [x] CHK-022 [P1] Edge cases tested - a tracked file matching an ignore rule stays indexed, and a stale parent with its review flag is cleared
- [x] CHK-023 [P1] Error scenarios validated - with the repair tool absent, the fixture archive still succeeds and warns
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - stale recorded paths after a move are class-of-bug, the ignored walk is cross-consumer
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - archive and restore are the only movers, and both now re-derive
- [x] CHK-FIX-003 [P0] Consumer inventory completed - `walkCorpus` has one production caller, and `repair-derived.cjs` serves `archive.sh`, `upgrade-legacy.mjs` and the pre-commit gate
- [x] CHK-FIX-004 [P0] Adversarial cases - a global ignore rule over `specs/`, a forced tracked file, and a repair target outside the specs tree
- [x] CHK-FIX-005 [P1] Matrix axes - archive or restore, by track packet or phase, by stored parent or none
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant - the operator's global gitignore ignores `specs/`, which the walk now ignores in turn
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA - the code and the rebuilt index land as separate commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - none in the changed files
- [x] CHK-031 [P0] Input validation implemented - the repair keeps its existing containment to the specs tree
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable, local file edits with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - reconciled at close
- [x] CHK-041 [P1] Code comments adequate - each change carries its reason, with no spec paths or ids in comments
- [x] CHK-042 [P2] README updated (if applicable) - `README-repair-derived.md` sections 4 and 6 and the spec CLI README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the temporary track used for the real archive was deleted
- [x] CHK-051 [P1] scratch/ cleaned before completion - this packet's `scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---
