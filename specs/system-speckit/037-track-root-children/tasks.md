---
title: "Tasks: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it"
description: "Survey the drift, build the shared module, the set-comparing sweep, the writer, the create.sh hook-up and the pre-push gate test-first, refresh all fifteen drifted track roots, then prove each guard with a mutation."
trigger_phrases:
  - "track root children_ids"
  - "refresh-track-roots"
  - "track-root pre-push gate"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it

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

- [x] T001 Survey every track root against its packets on disk: 15 of 18 disagree
- [x] T002 Confirm nothing keeps a track list current: `backfill-graph-metadata.ts` refuses a track root, `create.sh --track` ignored the list, the orchestrator exempts tracks, and the sweep compared counts and ran nowhere
- [x] T003 Confirm the packet deriver's child rule, numbered real folders, and how linked tracks appear in commits: ignored here, and untracked in their own repositories
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the sweep and writer tests and run them red: 8 of 10 failed (`runtime/cli/tests/track-roots.vitest.ts`)
- [x] T005 Shared reading and set comparison (`runtime/cli/lib/track-roots.mjs`)
- [x] T006 Sweep on the shared module, with sets, `--rev` and symlinked tracks left out of a commit (`runtime/cli/spec/sweep-track-roots.mjs`)
- [x] T007 Writer, dry unless `--apply` (`runtime/cli/spec/refresh-track-roots.mjs`)
- [x] T008 `refresh_track_root` after a normal and a phase scaffold, with six cases (`runtime/cli/spec/create.sh`, `runtime/cli/tests/create-track-refresh.vitest.ts`)
- [x] T009 Track-root gate with nine cases (`scripts/git-hooks/pre-push`, `scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T010 [P] Describe the writer, the set comparison and the gate (`runtime/cli/spec/README.md`, `runtime/cli/lib/README.md`, `scripts/git-hooks/README.md`, `.env.example`)
- [x] T011 Refresh the 13 track roots in this repository (`specs/<track>/graph-metadata.json`)
- [x] T012 Refresh `ai-systems`, write `anobel.com`'s record and refresh it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Remove each guarded rule on purpose and watch its suite fail: 8 on the module and scripts, 4 on `create.sh`, 6 on the gate
- [x] T014 The `cli` vitest project, `test:legacy`, `test:validation` and `pre-push.test.sh` pass
- [x] T015 The sweep exits 0 on the working tree across all 18 track roots
- [x] T016 Strict validation of this packet passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: `git` and `node`, which the hook already needs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `bash -n` on the hook, and the `.mjs` files load under the tests
- [x] CHK-011 [P0] No console errors or warnings: the writer's report goes to stderr inside `create.sh`, so `--json` stdout stays one payload
- [x] CHK-012 [P1] Error handling implemented: unreadable metadata exits 2 unwritten, an unreadable commit warns, a missing sweep blocks
- [x] CHK-013 [P1] Code follows project patterns: the module header, the hook's gate block and its skip variable follow their neighbours
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete: the sweep of the real `specs/`, before and after the refresh
- [x] CHK-022 [P1] Edge cases tested: a packet-named file, an archive folder, a foreign identity, an empty file and a symlinked track
- [x] CHK-023 [P1] Error scenarios validated: a missing writer, a missing sweep and unreadable metadata
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `class-of-bug`, since every track root lacked a writer and a check
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the only other track-list writer is the context save's append, listed in `plan.md`
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the sweep had no callers, and the three READMEs and `.env.example` now describe the new surfaces
- [x] CHK-FIX-004 [P0] Adversarial cases: a packet-named file, equal counts with different names, an uncommitted packet, a symlinked track and an empty file each have a test
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed in `plan.md`: two views, four track kinds, four entry kinds
- [x] CHK-FIX-006 [P1] Hostile global state: the fixtures set `core.hooksPath` and `core.excludesFile` to `/dev/null`, because a global ignore file listing `/specs` left every fixture commit empty
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree of this change and to named commits in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: unknown arguments exit 2, and `--track` must name an existing track root
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no authenticated surface changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: each new file and the gate open with why they exist
- [x] CHK-042 [P2] README updated (if applicable): the spec, lib and git-hooks READMEs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: mutation copies lived in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-24
<!-- /ANCHOR:summary -->

---
