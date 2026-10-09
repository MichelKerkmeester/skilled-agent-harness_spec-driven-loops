---
title: "Tasks: Phase 15: lane-rules-as-heal-modes"
description: "The task list for Phase 15: lane-rules-as-heal-modes, each task naming its file and the evidence that closed it. The one open task and the open checklist rows are listed in implementation-summary.md."
trigger_phrases:
  - "lane rules as heal modes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: lane-rules-as-heal-modes

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
## Phase 1: Setup and Design

- [x] T001 Design anchor-wrap mode: detection, wrapping and refusals (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, `anchorWrap` at line 773. The rule is in the README "Heal Lane Modes" table). Done in the code and the README, not as separate design notes.
- [x] T002 Design link-repoint mode: unique-match detection and refusal criteria (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, `linkRepoint` at line 998, README row). The unlink branch in the original plan was not built. See the deviation list in implementation-summary.md.
- [x] T003 Design continuity-placeholders mode: placeholder detection, fixed values, archived values and the do-not-overwrite rule (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, `continuityPlaceholders` at line 1180, README row).
- [x] T004 Design level-from-spec mode: derivation from spec.md markers and refusal on a missing, malformed or disagreeing marker (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, `levelFromSpec` at line 1240, README row).
- [x] T005 Design header-add mode: exact anchor match against the level's render, and refusal otherwise (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, `headerAdd` at line 1295, README row).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Implement anchor-wrap mode with derivability check in heal-spec-docs.cjs and register it (done in `LANE_MODES` at `heal-spec-docs.cjs:155`. The task's "discovery at line 168" no longer matches the file).
- [x] T007 Implement link-repoint mode with derivability check. Repoints when exactly one indexed file matches, and refuses on zero or several matches. Done without the unlink branch: zero matches refuse, as the spec edge cases say, and the README says "Never unlinks".
- [x] T008 Implement continuity-placeholders mode with placeholder detection and fixed values, and refuse when one of the two fields is already authored (`heal-spec-docs.cjs:1180`).
- [x] T009 Implement level-from-spec mode reading the `SPECKIT_LEVEL` markers in spec.md. Refuse when spec.md has no marker or a malformed one (`heal-spec-docs.cjs:1240`). The mode also reads the inline `Level: N` form the validator reads, after review finding 015-F6.
- [x] T010 Implement header-add mode matching template anchor ids against the document's anchors. Refuse when the match is not exact (`heal-spec-docs.cjs:1295`).
- [x] T011 Integrate all five modes into the upgrade-legacy repair pass (`upgrade-legacy.mjs:874-893`, after the healer and before the derivation steps). The task's line 507-508 no longer matches the file.
- [x] T012 Record mode refusals in each packet's `upgrade-baseline.json` under `refusals` (`upgrade-legacy.mjs:1170-1174` and `:1460-1472`). Pinned by `all-modes-sequence`, which reads back a continuity-placeholders refusal from the baseline.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Idempotence and Integration Tests

- [x] T013 Create unit tests for each mode: positive case, refusal case and idempotence case (`.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts`, 42 cases: 34 `it` cases and an eight-row `it.each` table). Done under this file name, not `heal-spec-docs.vitest.ts`, which the task and the first acceptance-criteria rows named.
- [x] T014 Test anchor-wrap idempotence: second run changes nothing (`heal-lane-modes.vitest.ts::anchor-wrap-idempotence`).
- [x] T015 Test link-repoint idempotence: second run changes nothing (`heal-lane-modes.vitest.ts::link-repoint-idempotence`).
- [x] T016 Test continuity-placeholders idempotence (`heal-lane-modes.vitest.ts::continuity-idempotence`).
- [x] T017 Test level-from-spec idempotence (`heal-lane-modes.vitest.ts::level-from-spec-idempotence`).
- [x] T018 Test header-add idempotence (`heal-lane-modes.vitest.ts::header-add-idempotence`).
- [x] T019 Integration test: all five modes in sequence under `upgrade-legacy --apply`, then a rerun with identical bytes and an identical baseline (`upgrade-legacy.vitest.ts::all-modes-sequence`). Scope note: the fixture is one packet under a root, not a corpus of failing packets. The corpus-scale second run is recorded under AC-019.
- [x] T020 Update `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` to document each new mode, its derivability rule and when it refuses (the "Heal Lane Modes" subsection and the `--lane-modes` CLI row).
- [x] T021 Verify the existing test suite passes with no new failures (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, exit status in `gates/tree5/cli-test.rc`, and the focused run in `gates/tree5/focused-vitest.log`).
- [ ] T022 Run upgrade-legacy --apply on a test corpus and verify per-folder validation reports no new findings on the second run. **Open, operator item.** Not run at corpus scale. The evidence log records the full-corpus `--apply` in a throwaway clone as skipped, with the operator not objecting, and as a follow-up. `upgrade-legacy --apply` refuses a tree without git (phase 010), and the scratch corpus copy has no git repository. The one-packet version is `all-modes-sequence`. The corpus-scale second lane-mode run is AC-019.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T022 is open, see above)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the corpus CLI runs in `gates/closeout-015/`, and the tests named above)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-007 in spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md sections 3 and 4, synchronized to the build at close)
- [x] CHK-003 [P1] Dependencies identified and available. spec.md names no blocking dependency, and the modes read only packet-local evidence.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint and format checks (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` exit 0 in `gates/tree5/cli-check.rc`. The typecheck of the CLI is exit 0 in `gates/tree5/typecheck-cli.rc`). The `typecheck:tests` report has 95 errors that are reported, not enforced, and the same count, 95, appears in the tree1 through tree5 gates. The per-code breakdown was re-derived for tree3 only.
- [x] CHK-011 [P0] No console errors or warnings. The lane CLI writes through `console.log` and `console.error`, and the upgrade-legacy lane step writes through `process.stdout.write`. Neither path emits warnings. Both corpus CLI passes wrote zero bytes to stderr (`gates/closeout-015/corpus-pass1.err` and `corpus-pass2.err`).
- [x] CHK-012 [P1] Error handling implemented: an unknown `--mode` exits 2 with a message, unreadable or malformed evidence is refused and recorded, and a lane-mode failure is reported as a step failure in `upgrade-legacy`.
- [x] CHK-013 [P1] Code follows project patterns. Judged by reading the diff: the new code keeps the file's section banners, its CommonJS style and its refusal-as-data return shape.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (19 of 19 Met in acceptance-criteria.md)
- [x] CHK-021 [P0] Manual testing complete. Run by hand: a dry run of `heal-spec-docs.cjs --lane-modes` over the real corpus, and two `--apply` passes over a scratch copy of the corpus markdown with a second-run byte check (`gates/closeout-015/`). The tests cover the rest.
- [x] CHK-022 [P1] Edge cases tested: anchor wrap after a trailing fence and with no final newline, CRLF stamping, fenced links ignored, reference definitions refused, scratch and memory targets skipped, archived packets, partially authored continuity refused, a marker-free spec.md, a malformed marker. Not pinned by a test: a spec.md whose markers disagree. The code refuses that case and the README documents it.
- [x] CHK-023 [P1] Error scenarios validated: zero matches, several matches, no anchors, a missing or mismatched template anchor, an authored continuity field, and an unknown mode name.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The classes are listed per finding in implementation-summary.md.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. The lane writers that choose a line ending are `endingAt` in `anchorWrap` (`heal-spec-docs.cjs:832-837`, which falls back to `\n` only when no line carries an ending), `levelFromSpec` (`:1275`) and `headerAdd` (`:1312`). `healDoc` at `:698` writes a hard-coded `\n` in its trigger-phrase fill at `:717`. That is the same class, outside this phase's modes, and is a follow-up.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed helpers: `anchorsOf` (used by `provenMarker` at `heal-spec-docs.cjs:321`), `findingsOf` (`upgrade-legacy.mjs:1107`, `:1126` and `:1459`), and the level forms the validator reads (`check-level-match.sh`).
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. Evidence: the test round's table `continuity-placeholders-archive-placement` (`heal-lane-modes.vitest.ts:922`, eight rows) covers delimiter look-alikes (`z_archived`, `z_archive-notes`, `my_z_archive`), joined and `..` spellings (a doubled separator, and `..` segments into and out of `z_archive`), outside-root (a document below no specs root), the no-op (an ordinary active packet) and the fallback. The outside-root case above the specs root is `continuity-placeholders-archive-status-from-specs-root`. Ran in the tree5 gate (`gates/tree5/focused-vitest.log`).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (implementation-summary.md, test matrix).
- [x] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state. Evidence: `link-repoint-hostile-working-directory` (`heal-lane-modes.vitest.ts:782`) runs the link-repoint mode for a packet outside git from an unrelated directory that holds a markdown near-miss, where it must refuse and leave both trees unchanged, and then from the packet root, where it must repoint to the `z_archive` copy. It restores the working directory after each run. The lane code reads `process.cwd()` when a document is outside git, which is the state this variant covers. A review of the test round (TR-R1 F1) found that the first version could not fail, so 015-T3 changed the fixture until the right root and the wrong root give different outcomes (evidence log, 015-T3). The file passed 42 of 42 after that change (`gates/tests-after-tr/lane.log`), and the tree5 focused run covers the same file (`gates/tree5/focused-vitest.log`, 152 tests, rc 0). The state leak found during the build (015-F4) was fixed and reproduced before the fix.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. **Open.** The build is not committed yet. It ships in the combined commit that parent D6 names, and the SHA is pinned after that commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. A grep of the added lines for secret, password, key, token and auth finds only prose in comments and test names, and no credential value.
- [x] CHK-031 [P0] Input validation implemented: an unknown mode name exits 2, and a malformed or disagreeing level marker is refused.
- [x] CHK-032 [P1] Auth and authz: not applicable. The healer reads and writes packet documents only and has no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria synchronized at close.
- [x] CHK-041 [P1] Code comments adequate. Judged by reading the new comments: each mode's header states the rule it keeps. A scan of the three changed files for spec, packet and finding labels found none.
- [x] CHK-042 [P2] README updated (the "Heal Lane Modes" subsection and the `--lane-modes` CLI row in `spec/README.md`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Run outputs for this closeout went to `gates/closeout-015/` in the build scratchpad, outside the phase folder.
- [x] CHK-051 [P1] scratch/ cleaned before completion. The phase `scratch/` folder holds only its `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 (open: CHK-FIX-007) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-09
<!-- /ANCHOR:summary -->
