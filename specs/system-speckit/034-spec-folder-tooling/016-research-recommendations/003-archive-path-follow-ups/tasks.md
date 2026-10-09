---
title: "Tasks: Archive path follow-ups"
description: "The task list for Archive path follow-ups, each task naming its file. Every task is done. T012, the whole-tree npm test, passed on the 2026-10-09 whole-tree gate run."
trigger_phrases:
  - "archive path follow ups tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Archive path follow-ups

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
## Phase 1: Audit and Documentation

- [x] T001 [P0] Grep for archive policy mentions in all four tools (.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs, heal-spec-docs.cjs, .../graph/migrate-generated-json.ts, .../spec/upgrade-legacy.mjs) (Done: at closeout, `rg -c 'FROZEN|archive|z_archive'` counts 7 lines in repair-derived.cjs, 16 in heal-spec-docs.cjs, 7 in migrate-generated-json.ts and 29 in upgrade-legacy.mjs; the mentions agree, see acceptance-criteria.md AC-003)
- [x] T002 [P0] Read README-repair-derived.md section 6 and document current content (.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:section 6) (Done: section 6 is titled LIMITS, lines 127-144. Its archived-packets bullet at lines 140-144 says archived packets are walked and repaired so their recorded paths name the current location, and that archive.sh runs the tool after each move)
- [x] T003 [P] [P0] Review upgrade-legacy.mjs archive test and comments (.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:197-219, archive test section) (Done with corrected lines: the archive cases are at upgrade-legacy.vitest.ts:361-433, the leave-alone case at 361 and the un-nesting case at 375, with its --include-archive run at 412 and archived validate at 433. No archive mention appears before line 361, so 197-219 is not the archive section). Closeout 3 (2026-10-09): the file has moved since. The leave-alone case is at `upgrade-legacy.vitest.ts:647-655`, the un-nesting case is at 657-722 with its `--include-archive` run at 699 and its archived validate at 720-721, and the umask case is at 724-750
- [x] T004 [P] [P0] List heal-spec-docs.cjs archive behavior at lines 40 and 189 (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:40,189) (Done with corrected lines: the archive policy is the SKIP_DIRS set at heal-spec-docs.cjs:64, with its comment at 54-63; the walk skips SKIP_DIRS members at line 714. The comment at 62-63 states that an explicit --folder is not filtered. Re-checked 2026-10-09: after the final review's comment fix (003-O4), the comment is at lines 54-65, SKIP_DIRS is at line 66 and the discover skip is at line 723 at that re-check, and at line 746 at closeout 3, inside `discover` at 736-752)
- [x] T005 [P] [P0] Review migrate-generated-json.ts archive walk and rewrite (.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:25,72,276) (Done: the archive walk is documented at lines 25-27 and TRAVERSAL_SKIP_DIRS at 72-74, which leaves z_archive and z_future out so they are reached; enumerateSpecFolders at lines 181-190 walks archives (re-checked 2026-10-09: the function is at line 191). Line 276 is regenDescriptionScoped, which has no archive-specific branch: the file's archive mentions are at lines 15, 25-26, 72-73, 181 and 185)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P0] Verify repair-derived.cjs FROZEN_TREES and comments reflect current-location semantics (.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:436-443) (Done: FROZEN_TREES is `['node_modules', '.git', 'scratch']` at repair-derived.cjs:442, and the comment at 436-441 says an archived packet is walked and repaired like any other. Verify only, no edit)
- [x] T007 [P0] Verify README-repair-derived.md section 6 documents archive scope under current-location semantics (.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:127-144) (Done: the archive scope is at lines 140-144. Verify only, no edit. Stale wording recorded in implementation-summary.md Follow-ups: "what an archived document says is never rewritten" at lines 143-144 does not name the questions-anchor marker-line edit that repairArchived applies)
- [x] T008 [P0] Add archive documentation comment to heal-spec-docs.cjs SKIP_DIRS section to explain policy (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:40) (Done: the comment sits at heal-spec-docs.cjs:54-63, directly above SKIP_DIRS at line 64. The constant is unchanged. The line 40 in the task was the pre-build position. Re-checked 2026-10-09: after the 003-O4 comment fix, the comment is at lines 54-65 and SKIP_DIRS is at line 66). Closeout 3 (2026-10-09): unchanged after the Opus alignment fixes, so the comment still sits at lines 54-65 and `SKIP_DIRS` at line 66
- [x] T009 [P1] Verify upgrade-legacy.mjs header and repairArchived function align with current-location policy (.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12-14,419-429) (Done with corrected lines: the header at upgrade-legacy.mjs:12-16 states the archive policy, and repairArchived is at lines 891-931 with its policy comment at 886-890, called at 1065 and 1371. Lines 419-429 hold reversibility-manifest code, not repairArchived. The stale citation was review finding F1 and is corrected here. Re-checked 2026-10-09: the header's archive policy is at lines 13-17, and repairArchived is at lines 967-1007 with its policy comment at 962-966. The file moved because phases 011, 012 and 015 also edited it (parent D6). Verify only, no edit). Closeout 3 (2026-10-09): `repairArchived` is at lines 923-963 with its policy comment at 918-922, and its call sites are at 1097 and 1443. The header is still at 13-17
- [x] T010 [P0] Add fixture test to archive-track.vitest.ts that archives a real packet, restores it, and validates with --strict (.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts) (Done: the round-trip case is at archive-track.vitest.ts:280-317, its describe at 284 and its test at 285-316. It runs the real tools in a throwaway repository, see implementation-summary.md. Re-checked 2026-10-09: the lines are unchanged. Closeout 2: the case now sits at archive-track.vitest.ts:313-338, with its describe at 312)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 [P0] Run test suite and confirm all archive-track tests pass (.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts) (Done: `npx vitest run runtime/cli/tests/archive-track.vitest.ts --config vitest.config.ts` from the skill root printed Tests 18 passed (18), rc 0, at closeout. The file holds 18 cases, so the new case ran. Closeout 2: the file now holds 22 cases. The rerun on its own printed Tests 22 passed (22), rc 0, saved at gates/closeout2-003/archive-track.log)
- [x] T012 [P0] Run full spec-kit test suite with npm test and verify no regressions (Done 2026-10-09 on the tree3 whole-tree gate: the cli test exited 0 with 171 files passed and 1752 tests passed, 0 failed. See acceptance-criteria.md AC-006. Closeout 2: re-cited to the tree4 gate, whose cli-test.rc is 0. The raw cli-test.log holds no vitest totals, see AC-006. Closeout 3: re-cited to the tree5 gate, cli-test rc 0 on the tree before commit c2a0a667e9, see AC-006)
- [x] T013 [P1] Manually verify archive-restore-validate workflow with a real test packet (Done differently: no separate manual run was made. The round-trip case runs the same steps on the real fixture packet 002-valid-level1 with the real tools: archive.sh --force, archive.sh --restore, and validate.sh --strict on both locations, archive-track.vitest.ts:299-315. It passed at closeout, see T011)
- [x] T014 [P1] Review spec.md, plan.md, tasks.md for consistency (Done at closeout: spec.md Status is Complete and its OPEN QUESTIONS are resolved; plan.md Definition and pre-deployment boxes are ticked where the evidence exists, its stale citations are corrected, and its affected-surface actions for repair-derived.cjs and migrate-generated-json.ts were not taken because the comments already matched, recorded in implementation-summary.md Deviations. plan.md's research section 7.4 box stays unticked because that section was not re-read at closeout. The stale citations in goal.md and tasks.md are corrected)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T012 closed 2026-10-09 on the tree3 gate, re-cited to tree4 in closeout 2 and to tree5 in closeout 3)
- [x] No `[B]` blocked tasks remaining (no `[B]` rows in this file)
- [x] Manual verification passed (Done differently: see T013)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md sections 4 and 5: REQ-001 to REQ-005, SC-001 to SC-003)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md sections 3 and 4)
- [x] CHK-003 [P1] Dependencies identified and available (Phase 15's rederive_moved is at archive.sh:181-191 and is called at archive.sh:312 on archive and at 425 on restore; validate.sh and the fixture 002-valid-level1 are present)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (Done 2026-10-09 on the tree3 gate: `run check` exited 0, covering the lint, boundary, allowlist, alignment and AST checks, and `typecheck` and `typecheck-cli` (tsc --noEmit) exited 0. The `typecheck:tests` lane is report-only and exits 2 with 95 errors, the same count as the prior run. Closeout 2 re-cite on tree4: cli-check rc 0, typecheck rc 0, typecheck-cli rc 0, and typecheck-tests rc 2 with 95 error TS lines, report-only. Closeout 3 re-cite on tree5 gives the same four rc values, read from gates/tree5)
- [x] CHK-011 [P0] No console errors or warnings (the case has no console call, archive-track.vitest.ts:280-317; the only warning in the closeout run is the Vite configLoader notice for vitest.config.ts). Closeout 2: grep finds no console call in any of the file's 22 cases)
- [x] CHK-012 [P1] Error handling implemented (Done differently: the case is the error check. Each step asserts its exit status and the absence of the two re-derive warnings, archive-track.vitest.ts:296-315 at closeout 1, now 318-337). Closeout 2: the two failure branches are asserted at archive-track.vitest.ts:213-224 (script missing) and :411-428 (repair fails))
- [x] CHK-013 [P1] Code follows project patterns (the case reuses the file's archive() helper at archive-track.vitest.ts:69-71 and its describe, it and expect pattern)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (Done 2026-10-09: all six rows of acceptance-criteria.md are Met, AC-006 on the tree3 gate, re-cited to tree4 in closeout 2 and to tree5 in closeout 3)
- [x] CHK-021 [P0] Manual testing complete (Done differently: see T013; the automated round trip is the test run)
- [x] CHK-022 [P1] Edge cases tested (Closeout 2: ticked with one gap, the way sibling 010 records its unpinned edge cases. Pinned by the test round: a nested packet re-derives its parent from its own path (archive-track.vitest.ts:342-376). An archived phase derives no parent and a restored phase re-derives its parent packet (:380-406). Not pinned by a test: an archived track packet and a restored track packet, the two track-packet cases the spec names. The round trip at :313-338 restores a top-level packet and asserts only its validation)
- [x] CHK-023 [P1] Error scenarios validated (Closeout 2: both failure branches of rederive_moved are asserted. The script-missing branch, archive.sh:184-186, is covered at archive-track.vitest.ts:213-224, which expects the move to complete with the warning "were not re-derived". The repair-fails branch, archive.sh:188-190, is covered at :411-428, which expects the move to complete with "may still name the old folder". The retry of the repair there exits 2, prints FAILED and leaves the corrupt file untouched. archive.sh exits 0 in both branches by its own contract)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (The one review finding, F1 at P2, is `instance-only`: a stale line citation. Corrected in goal.md, tasks.md T009 and plan.md)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (Proven by grep: `rg -n "repairArchived"` across the skill finds the definition, its two calls and one comment only, at upgrade-legacy.mjs:891, 1065, 1371 and heal-spec-docs.cjs:59. Within this folder, the only citations of lines 419-429 were goal.md and tasks.md T009. Re-run 2026-10-09: the definition is at upgrade-legacy.mjs:967 (closeout 3: 923), its calls at 1141 and 1475 (closeout 3: 1097 and 1443), and the comment at heal-spec-docs.cjs:60 (still at 60), so the 891, 1065 and 1371 numbers above are stale)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (The changed items are doc citations and one comment. Their consumers are goal.md, tasks.md, plan.md lines 76 and 78, and acceptance-criteria.md AC-002 and AC-005. All corrected here)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (not applicable: the change adds a test case and a comment, and no security, path, parser or redaction fix)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (not applicable: no matrix; one fixture packet)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (not applicable: the case reads and sets no environment variable and no process-wide state; the scripts it spawns inherit the environment as the earlier cases do). Closeout 2: grep finds no process.env or chdir in archive-track.vitest.ts, so the reason holds for the cases the test round added
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (Open: nothing is committed. The change sits uncommitted in a shared worktree and is to be pinned at the lane A combined commit. Closeout 2: git status still lists archive-track.vitest.ts and heal-spec-docs.cjs as uncommitted, and the ship commit closes this)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (the case holds no credential or token; its throwaway repository path comes from os.tmpdir(), archive-track.vitest.ts:280-317). Closeout 2: the repository is made in beforeEach at archive-track.vitest.ts:23-24 and removed in afterEach at :38-40
- [x] CHK-031 [P0] Input validation implemented (not applicable: the case uses fixed fixture inputs and adds no input boundary)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable: no auth or authorization surface in this change)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md Status and open questions, plan.md checkboxes and citations, and this file match the build. The plan's divergent actions are recorded in implementation-summary.md Deviations)
- [x] CHK-041 [P1] Code comments adequate (the case comment at archive-track.vitest.ts:280-283 gives the reason for the symlink and the .opencode directory; the SKIP_DIRS comment at heal-spec-docs.cjs:54-65 gives the archive policy and the --folder bypass; neither names a packet or phase id. Closeout 2: the real-tools comment now sits at archive-track.vitest.ts:73-76, and the comments of the cases at :340-341, :378-379 and :408-410 give the durable reason only)
- [x] CHK-042 [P2] README updated (if applicable) (not applicable: README-repair-derived.md is verify-only in spec.md Files to Change. Its section 6 already states archive scope, and its stale sentence is a follow-up for another phase)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only .gitkeep; the case's throwaway repository is under os.tmpdir() and removed in afterEach, archive-track.vitest.ts:38-40)
- [x] CHK-051 [P1] scratch/ cleaned before completion claim (scratch/ holds only .gitkeep)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 23/23 |
| P1 Items | 16 | 15/16 |
| P2 Items | 1 | 1/1 |

Open: CHK-FIX-007 only, which the ship commit closes. CHK-022 and CHK-023 were ticked in closeout 2, and CHK-022 keeps one named gap (the two track-packet parent cases). T012, CHK-010 and CHK-020 closed on 2026-10-09 on the tree3 gate and are re-cited to tree4 in closeout 2.

**Verification Date**: 2026-10-09
<!-- /ANCHOR:summary -->

---
