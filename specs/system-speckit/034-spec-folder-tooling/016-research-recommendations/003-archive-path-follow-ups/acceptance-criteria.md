---
title: "Acceptance Criteria: Archive path follow-ups"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "archive path follow ups acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups"
    last_updated_at: "2026-10-08T22:59:56Z"
    last_updated_by: "orchestrator"
    recent_action: "All six rows Met. AC-006 closed 2026-10-09 on the whole-tree gate"
    next_safe_action: "Ship with lane A combined commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Archive path follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups
**Level:** 2
**Status:** Complete. All six rows are Met, and AC-006 closed on the whole-tree gate run of 2026-10-09. Closeout 2 (2026-10-09) re-checked every row after the test round and re-cited AC-006 to the tree4 gate. Closeout 3 (2026-10-09) re-read every citation after the Opus alignment fixes and re-cited AC-006 to the tree5 gate (see the AC-006 row)
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a real spec packet with spec.md, plan.md, tasks.md, implementation-summary.md, description.json, and graph-metadata.json, When archive.sh is run, Then rederive_moved calls repair-derived.cjs --roots with --apply | Observed at closeout: the round-trip case at `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:285-316` passed (file: 18 passed, rc 0). The case asserts first that the fresh copy fails strict validation (lines 295-297) and then that the archived copy passes (lines 304-306), so the pass depends on the re-derive. `rederive_moved` runs `node "$repair_script" --roots "$destination" --apply` at `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:188` and is called from the archive path at `archive.sh:312`. The fixture `002-valid-level1` holds all six files named in the Given. Re-checked 2026-10-09: the round-trip case ran again on its own after the doc edits, 18 passed, rc 0. `rederive_moved` is defined at `archive.sh:181`. Closeout 2 (2026-10-09): the round-trip case now sits at `archive-track.vitest.ts:313-338` with its describe at 312. The stub case at lines 196-211 pins the `--roots <folder> --apply` arguments for both moves. The two branches of `rederive_moved` are asserted at lines 213-224 (script missing) and 411-428 (repair fails). The rerun of the file on its own printed Tests 22 passed (22), rc 0, saved at gates/closeout2-003/archive-track.log | Met | - |
| AC-002 | REQ-001 | Given the archived packet is restored with archive.sh --restore, When validate.sh --strict is run, Then exit status is 0 and RESULT: PASSED is printed | Observed at closeout: the restore step at `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:308-311` exits 0 with no re-derive warning, and `validate.sh --strict` on `specs/001-valid` exits 0 and prints `RESULT: PASSED` (lines 313-315). The round-trip block is `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:280-317`. The restore path re-derives at `archive.sh:425`. Re-checked 2026-10-09: the same case passed again on its own, 18 passed, rc 0. Closeout 2 (2026-10-09): the case spans `archive-track.vitest.ts:313-338`, with the restore step at 330-331 and the restored validation at 335-337. The rerun of the file on its own printed Tests 22 passed (22), rc 0 | Met | - |
| AC-003 | REQ-003 | Given repair-derived.cjs, heal-spec-docs.cjs, migrate-generated-json.ts, and upgrade-legacy.mjs, When each is read for archive policy comments, Then all four agree on current-location semantics | Observed at closeout by reading each comment. Grep for FROZEN, archive and z_archive returns 7, 16, 7 and 29 lines in the four files. `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:436-443`: archived packets are walked and repaired, and FROZEN_TREES is `node_modules`, `.git`, `scratch` (line 442). `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:54-64`: archives are skipped, and the questions-anchor un-nesting is left to upgrade-legacy. `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:25-27, 72-74, 181-190`: archives are walked and migrated. `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12-16, 886-890`: archived prose is kept, and `repairArchived` (line 891) moves only the marker line. The README sentence "what an archived document says is never rewritten" (`README-repair-derived.md:143-144`) does not name that marker-line edit; recorded in implementation-summary.md Follow-ups. Re-checked 2026-10-09 after the final review's comment fix (003-O4): the heal comment is at `heal-spec-docs.cjs:54-65`, SKIP_DIRS is at line 66, the discover skip is at line 723 and the `--folder` bypass at lines 622-627; `repairArchived` is at `upgrade-legacy.mjs:967-1007` with its policy comment at 962-966, and the header archive policy is at lines 13-17. The line numbers quoted above for those two files are the ones observed at closeout, before the shared file moved. Closeout 2 (2026-10-09) re-read all four: `heal-spec-docs.cjs:54-65` with SKIP_DIRS at line 66, `upgrade-legacy.mjs` header at 13-17 with `repairArchived` at 967-1007 and its policy comment at 962-966, `repair-derived.cjs` FROZEN_TREES at line 442 with its comment at 436-441, and `migrate-generated-json.ts` at 25-27, 72-74 and 191. Each still says what this row says. Closeout 3 (2026-10-09), after the Opus alignment fixes: `repairArchived` is at `upgrade-legacy.mjs:923-963` with its policy comment at 918-922, and its call sites are at 1097 and 1443 (the 967-1007, 962-966, 1141 and 1475 numbers above predate those fixes). The header archive policy is still at lines 13-17. The heal comment is still at `heal-spec-docs.cjs:54-65` with `SKIP_DIRS` at line 66. The discover skip is at line 746 (723 above predates the fixes), and the `--folder` bypass is at lines 645-649 in `runAnchorRepair` (622-627 above predates the fixes). `FROZEN_TREES` is still at `repair-derived.cjs:442`, and the `migrate-generated-json.ts` lines 25-27, 72-74 and 191 are unchanged. The rg counts for FROZEN, archive and z_archive are 7, 17, 7 and 29, and the healer count rose from 16 to 17 | Met | - |
| AC-004 | REQ-002 | Given the fixture test is written with metadata, archive, restore, and validate steps, When it runs, Then all steps complete with exit 0 | Observed at closeout: each step's exit status is asserted in `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts`: archive `--force` (lines 299-300), in-archive strict validation (lines 304-305), restore (lines 308-309) and restored strict validation (lines 313-314). The case passed at closeout (18 passed, rc 0), and again on 2026-10-09 when it ran on its own (18 passed, rc 0). The fixture holds spec.md, plan.md, tasks.md, implementation-summary.md, description.json and graph-metadata.json. Closeout 2 (2026-10-09): the steps now sit at lines 321-322 (archive `--force`), 326-328 (in-archive validation), 330-331 (restore) and 335-337 (restored validation). The rerun of the file on its own printed Tests 22 passed (22), rc 0 | Met | - |
| AC-005 | REQ-004 | Given README-repair-derived.md section 6, When read, Then it documents archive scope under current-location semantics | Observed by reading: `.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:127-144` is section 6, titled LIMITS. Its archived-packets bullet (lines 140-144) states that archived packets are walked and repaired, so their recorded paths name the current location, and that `archive.sh` runs the tool after each move. Closeout 2 (2026-10-09): re-read, with LIMITS still at line 127 and the archived-packets bullet still at lines 140-144 | Met | - |
| AC-006 | REQ-005 | Given all test suites in runtime/cli/tests, When npm test is run, Then no tests fail and archive-path-related tests pass | Observed on 2026-10-09 in the whole-tree gate run tree3, read from its raw logs. `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` exited 0. Its vitest summary reads 171 test files passed and 3 skipped (174), and 1752 tests passed and 19 skipped (1771), with no failed file or test named. The prior run, tree2, had 1749 passed, and the baseline before wave 1 had 1639 passed. The archive-path case ran on its own after the doc edits: `archive-track.vitest.ts` gave 18 passed, rc 0. The workflow-invariance run gave 2 passed, rc 0, and the focused set of 8 files gave 129 passed, rc 0. Closeout 2 re-cite to the tree4 gate (2026-10-09, raw logs in gates/tree4 read by the closeout worker): `cli-test.rc` is 0, and the cli test script chains its vitest step with `&&` ahead of the two legacy steps, so an exit of 0 means each step exited 0. The raw `cli-test.log` holds no vitest summary line, so the totals of 171 files and 1775 tests in `delta.txt` are not confirmed from the raw log. The focused run of 8 files printed Test Files 8 passed (8) and Tests 152 passed (152), rc 0. The workflow-invariance run printed Tests 2 passed (2), rc 0. The hooks run printed 184 tests, 181 pass, 0 fail and 3 skipped, rc 0. The doctor run printed 7 suites passed and 0 failed, rc 0. test-validation printed Total 31, Failed 0 and RESULT: PASSED. The root test step ended at the harness bound with rc 124. It is not a verdict, and this packet does not cite it. Closeout 3 re-cite to the tree5 gate (2026-10-09, raw logs in gates/tree5): `cli-test.rc` is 0, and the cli step ran from 10:08 to 10:22, before commit c2a0a667e9 landed at 10:37, so this row's cli-test evidence is on one tree. The raw `cli-test.log` again holds no vitest summary line, so the 171 files and 1775 tests in `delta.txt` are not confirmed from it. The focused run of 8 files printed Test Files 8 passed (8) and Tests 152 passed (152), rc 0. The workflow-invariance run printed Tests 2 passed (2), rc 0. The hooks run printed 184 tests, 181 pass, 0 fail and 3 skipped, rc 0. The doctor run printed 7 suites passed and 0 failed, rc 0. test-validation printed Total 31, Failed 0 and RESULT: PASSED. The tree5 root step finished with rc 0 but straddles commit c2a0a667e9, so this row does not cite it | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes. All six rows are Met.

AC-001 to AC-005 are Met on the round-trip case (`archive-track.vitest.ts:280-317`, 18 passed at closeout) and on the comment and README reads cited in their rows. AC-006, the whole-tree `npm test` with no regressions, passed on the tree3 gate run of 2026-10-09 (see its row). Closeout 3 (2026-10-09): the round-trip case is at `archive-track.vitest.ts:313-338`, and the 280-317 range above is the first-pass position. Consciously left out of this phase: the spec's edge cases and the failure branches of `rederive_moved` have no test here (tasks.md CHK-022 and CHK-023).
<!-- /ANCHOR:closure -->
