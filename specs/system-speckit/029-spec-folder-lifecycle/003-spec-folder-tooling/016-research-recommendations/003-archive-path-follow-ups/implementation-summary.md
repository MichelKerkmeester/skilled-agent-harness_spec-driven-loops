---
title: "Implementation Summary"
description: "Phase 3 of the Research recommendations: archive path follow-ups. A round-trip test proves an archived and restored packet passes strict validation, and the healer's SKIP_DIRS states the archive policy. Complete. The whole-tree test run (AC-006) passed on 2026-10-09."
trigger_phrases:
  - "archive path follow ups implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups"
    last_updated_at: "2026-10-08T22:59:56Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed AC-006 on the tree3 whole-tree gate (2026-10-09); all six rows Met"
    next_safe_action: "Ship with lane A combined commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-archive-path-follow-ups |
| **Status** | Complete. All six acceptance rows are Met. AC-006 closed on the whole-tree gate run of 2026-10-09 |
| **Completed** | 2026-10-08 at closeout; AC-006 closed 2026-10-09 |
| **Level** | 2 |
| **Created** | 2026-10-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 15 already re-derives a moved packet's recorded paths at archive and restore time. This phase adds the check that a round trip leaves the packet valid, and it states the archive policy where the healer skips archives. The phase is built, reviewed and verified against all six acceptance criteria. AC-006, the whole-tree `npm test`, passed on the 2026-10-09 gate run (see Verification).

- **Round-trip test** (`.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:280-317`). A new describe, `archive.sh round trip with the real tools`, holds one case. Closeout 3 (2026-10-09): the describe is at line 312 and the case at 313-338. The line numbers in this bullet are the first-pass position. It copies the fixture packet `002-valid-level1` into `specs/001-valid` and asserts that strict validation fails on the fresh copy. It archives the packet with `--force`, validates it in `specs/z_archive`, restores it, and validates the restored copy. Each archive and restore step must print neither "may still name the old folder" nor "were not re-derived".
- **Why the case links the real skill and creates `.opencode`.** `archive.sh` runs `repair-derived.cjs` and the validator from the working repository, so the case replaces the throwaway repository's copied scripts with a symlink to the real skill (lines 286-288 at the first pass, line 80 at closeout 3, inside `linkRealTools` at 77-82). The graph backfill refuses a target that resolves outside a configured specs root (`.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:309-314`). The root guard counts a root only when its workspace is anchored on a real `.opencode` directory, as its own comment states (`.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:1797-1799`). So the case also creates an empty `.opencode` directory (line 289 at the first pass, line 81 at closeout 3).
- **SKIP_DIRS policy comment** (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:54-65`). The comment above `SKIP_DIRS` says that archived and future trees keep their documents. It says that an archived packet's current location is a derived field, repaired by repair-derived and migrate-generated-json, and that the only archived document change is the marker-only questions-anchor un-nesting that upgrade-legacy's `repairArchived` applies. Its last lines state that an explicit `--folder` bypasses the skip, so a caller must not pass an archived packet. That last part was added after the final review (see Review). The set itself (line 66) is unchanged.

- **Test round (closeout 2).** Four more cases in the same file, at lines 213, 342, 380 and 411. The case at 213 covers the `rederive_moved` branch where the re-derive script is missing. The case at 342 re-derives a packet nested in the moved one from its own path. The case at 380 covers an archived phase, which derives no parent, and its restore, which re-derives the parent packet. The case at 411 covers a re-derive that fails after the move completes, and the retry of that repair exits 2. The shared setup now lives in the helpers at lines 73-90 (`linkRealTools`, `validate` and `graphParentId`). The file holds 22 cases in all.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modify | Round-trip case, lines 280-317 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` (closeout 2 test round) | Modify | Four cases at lines 213, 342, 380 and 411. Helpers at lines 73-90. Round-trip case now at lines 312-338 (the case itself is at 313-338 at closeout 3) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Comment only, lines 54-65; `SKIP_DIRS` unchanged at line 66. The file also carries other lanes' uncommitted edits. Re-read at closeout 3: the comment and `SKIP_DIRS` are unchanged by the Opus alignment fixes |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Verify | Read and cited at lines 436-443; not edited |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md` | Verify | Read and cited at lines 127-144; not edited |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts` | Verify | Read and cited at lines 25-27, 72-74 and 181-190; not edited |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Verify | Read and cited at lines 12-16 and 886-931 when the build ran; at the 2026-10-09 re-check the policy is at lines 13-17 and `repairArchived` at 967-1007 at the re-check and at 923-963 at closeout 3 (see Deviations); not edited |
| This spec folder: spec, plan, tasks, acceptance-criteria, goal and this summary | Modify | Closeout documents |
| This spec folder: graph-metadata.json | Derived | Re-derived by `repair-derived.cjs --apply`: status `planned` to `in_progress`, key_files order and `last_save_at`. Not hand-edited |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two briefs ran as DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route. 003-E1 built the round-trip case (T010), and 003-E2 built the SKIP_DIRS comment (T008). Each brief stayed inside the files the spec lists (D5). E1 ran before E2, which departs from D3's task order; the two briefs touch different files, so neither result depends on the order. Each brief reported its own check. At closeout the diffs and cited lines were read again, and the test was rerun. A third brief, 003-O4, ran as DeepSeek V4.1 Flash max through cli-devin after the final review, to fix the SKIP_DIRS comment (see Review).

### Review

One review round (003-R1b, DeepSeek through pi on the OpenCode Go route). The first attempt (003-R1, the LLM Gateway route) failed with the API error "reasoning_content in the thinking mode must be passed back" and wrote nothing. The reviewer had no shell, so its checks of the round trip's assertions, its isolation and its timeout were by reading. It reported one P2: the goal's citation of `repairArchived` at `upgrade-legacy.mjs:419-429`. Closeout reading confirms the stale citation. Those lines hold reversibility-manifest code, and `repairArchived` is at lines 891-931. The citation is corrected in goal.md and tasks.md T009. The closeout reran the test (18 passed) but did not separately test the reviewer's reasoning about isolation and the timeout. Re-checked 2026-10-09: `repairArchived` is now at lines 967-1007, so the 891-931 range above is stale.

The fresh Opus high final review (read-only) covered the whole build. Its verdict was FIX FIRST with no P0. Its F3 (P2) found that the SKIP_DIRS comment did not state the `--folder` bypass. Brief 003-O4 (DeepSeek through cli-devin) fixed the comment, and the evidence log records it as done. The phase had one DeepSeek round (003-R1b). The evidence records no second DeepSeek round for it, so the two-round limit in D4 was not reached. Closeout 2 (2026-10-09): the test round (003-T1, DeepSeek through cli-pi, the route the evidence log labels DSL) was not put to a read-only review. The evidence log lists an RLUNA review of the new tests as the next step, and no output for it exists in the build logs, so a second round for this phase is not recorded. The Opus final review ran before the test round and does not cover its four cases. Closeout 3 (2026-10-09): a fresh Opus high alignment and overengineering review, requested by the operator, ran after the test round. Its verdict was ALIGNED, with a simplify-first note, and all its findings were P2. Its fixes that touched `heal-spec-docs.cjs` (the section numbering and constants moved into section 2, and one exported atomic writer) and `upgrade-legacy.mjs` (one healer loader, and the duplicate writer removed) left this phase's comment and `SKIP_DIRS` as they were, which closeout 3 re-read at lines 54-66. The post-fix vitest run of the five test files, archive-track included, passed 124 tests (build log OC-O2). The closeout 2 sentence above that no output exists for the RLUNA review is superseded: its output is in the build logs as TR-R1. TR-R1 was a read-only Luna review of the test round, and its brief named `archive-track.vitest.ts`. It recorded no finding on that file. Its three findings were on the heal-lane and upgrade-legacy tests, and one of them was rejected. Its sandbox denied Vite's cache write, so it read the files and did not run them
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Decisions

| Decision | Why |
|----------|-----|
| The round-trip case uses the real skill, not copied scripts | The repair resolves the validator and the metadata writer from the working repository (comment at lines 280-283) |
| SKIP_DIRS gets a comment, not a change | The archive policy already matched the code. This phase verified it and did not alter behavior |
| Stale citations are corrected in the packet documents | The citations are documentation. The code they point at was not changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run runtime/cli/tests/archive-track.vitest.ts --config vitest.config.ts` from the skill root | Tests 18 passed (18), rc 0, at closeout |
| Cases in archive-track.vitest.ts | 18. The round-trip case is the last one |
| Console calls in the new case | None |
| `repair-derived.cjs --roots` on this folder, with `--apply` | rc 0. Re-derived this folder's graph metadata (inspected 1, repaired 1, failed 0). It lists AC_CLOSURE as not repairable here |
| `validate.sh --strict` on this folder | RESULT: FAILED, rc 2. Summary: Errors 1, Warnings 0. The one error is the rule `AC_CLOSURE`, with the message "packet claims completion with 1 unmet criterion(s)", naming AC-006 (Unmet). All other rules pass, including STATUS_CROSS_DOC_CONSISTENCY and PLACEHOLDER_FILLED |
| `check-goal.cjs` on this folder | RESULT: PASSED (5/5 checks), rc 0 |
| Whole-tree `npm test` | Not run. AC-006 is Unmet, pending the whole-tree gate run before ship |
| CLI check (`run check`, tsc --noEmit) | Not run for this change; pending the whole-tree gate run |

### Closeout re-run (2026-10-09)

The rows above describe the 2026-10-08 closeout state. The rows below supersede the whole-tree `npm test` row, the CLI check row and the `validate.sh` row that failed on AC_CLOSURE.

| Check | Result |
|-------|--------|
| Whole-tree gate tree3, `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` | Exit 0. The vitest summary reads 171 test files passed and 3 skipped (174), and 1752 tests passed and 19 skipped (1771), with no failed file or test named. The prior run had 1749 passed. The baseline before wave 1 had 1639 passed |
| Tree3 `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | Exit 0. The lint, boundary, allowlist, alignment and AST checks passed |
| Tree3 `typecheck` and `typecheck-cli` (tsc --noEmit) | Exit 0 for both |
| Tree3 `typecheck:tests` | Exit 2 with 95 error lines. This is a report-only lane and not the tsc step that CHK-010 names. The prior run had the same count |
| Tree3 hooks, `node --test runtime/tests/hooks/*.test.mjs` | Exit 0. 184 tests, 181 pass, 0 fail, 3 skipped |
| Tree3 doctor `run-all.sh` | Exit 0. 7 suites passed, 0 failed |
| Tree3 doctor-update compat node tests | Exit 0. 21 pass, 0 fail |
| Tree3 focused vitest, 8 files including archive-track | Exit 0. 129 tests passed |
| Tree3 `test-validation.sh` | RESULT: PASSED. 31 total, 0 failed |
| `archive-track.vitest.ts` run on its own after the doc edits | 18 passed, rc 0 |
| `repair-derived.cjs --folder` on this folder, with `--apply` | rc 0. Inspected 1, repaired 1, failed 0 |
| `validate.sh` on this folder, `--strict` | RESULT: PASSED. Errors 0, Warnings 0 |
| `check-goal.cjs` on this folder | RESULT: PASSED (5/5 checks), rc 0 |

The tree3 totals were read from the raw logs (cli-test, hooks, doctor-update, focused, test-validation and typecheck:tests), not only from the gate's summary file. The raw output of this re-run sits in the build gate directory for this phase.
### Closeout 2 re-run (2026-10-09, tree4)

The table below supersedes the tree3 rows above for the test, check, typecheck, hooks and doctor rows. Each result was read from the raw log in the tree4 gate directory, and each exit status from its rc file.

| Check | Result |
|-------|--------|
| tree4 cli test (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`) | cli-test.rc is 0. The raw log has no vitest summary line, so the totals of 171 files and 1775 tests in delta.txt are not confirmed from the raw log. The script chains vitest with `&&` ahead of the legacy and validation steps, and the raw log shows no failing count |
| tree4 focused vitest, the same 8 files | Test Files 8 passed (8), Tests 152 passed (152), rc 0 |
| tree4 workflow-invariance, isolated | Tests 2 passed (2), rc 0 |
| tree4 build, build-cli and cli-check | rc 0 for each. The cli-check log reports the architecture boundary, allowlist, source/dist alignment and AST checks as passed |
| tree4 typecheck and typecheck-cli | rc 0 for both |
| tree4 typecheck:tests | rc 2 with 95 error TS lines. This lane is report-only |
| tree4 hooks, node --test | 184 tests, 181 pass, 0 fail, 3 skipped, rc 0 |
| tree4 doctor run-all | 7 suites passed, 0 failed, rc 0 |
| tree4 doctor-update node tests | 22 pass, 0 fail, rc 0 |
| tree4 test-validation | Total 31, Failed 0, RESULT: PASSED |
| tree4 root test | rc 124 at the harness bound. Not a verdict, and not cited anywhere in this packet |
| `archive-track.vitest.ts` on its own, closeout 2 | Test Files 1 passed (1), Tests 22 passed (22), rc 0 |
| `repair-derived.cjs --folder` on this folder, with `--apply` | rc 0. Inspected 1, repaired 1, failed 0 |
| `validate.sh` on this folder, `--strict` | RESULT: PASSED, Errors 0, Warnings 0, rc 0 |
| `check-goal.cjs` on this folder | RESULT: PASSED (5/5 checks), rc 0 |

The raw output of this re-run sits in `gates/closeout2-003/` in the build scratchpad, with one rc file per command.
### Closeout 3 re-run (2026-10-09, tree5)

The table below supersedes the tree4 rows for the test, check, typecheck, hooks and doctor rows. Each result was read from the raw log in `gates/tree5/`, and each exit status from its rc file. The step timeline shows that commit `c2a0a667e9` landed at 10:37, after the cli test, so the cli test row is on one tree. The root step straddles that commit and this packet does not cite it.

| Check | Result |
|-------|--------|
| tree5 cli test (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`) | cli-test.rc is 0. The raw log has no vitest summary line, so the 171 files and 1775 tests in delta.txt are not confirmed from it |
| tree5 focused vitest, the same 8 files | Test Files 8 passed (8), Tests 152 passed (152), rc 0 |
| tree5 workflow-invariance, isolated | Tests 2 passed (2), rc 0 |
| tree5 build, build-cli and cli-check | rc 0 for each |
| tree5 typecheck and typecheck-cli | rc 0 for both |
| tree5 typecheck:tests | rc 2 with 95 error TS lines. This lane is report-only |
| tree5 hooks, node --test | 184 tests, 181 pass, 0 fail, 3 skipped, rc 0 |
| tree5 doctor run-all | 7 suites passed, 0 failed, rc 0 |
| tree5 doctor-update node tests | 22 pass, 0 fail, rc 0 |
| tree5 test-validation | Total 31, Failed 0, RESULT: PASSED |
| tree5 root test | rc 0. It straddles commit c2a0a667e9, so this packet does not cite it |
| `repair-derived.cjs --folder` on this folder, with `--apply` | rc 0 (`gates/closeout3-003/repair-derived.log`) |
| `validate.sh` on this folder, `--strict` | RESULT: PASSED, Errors 0, Warnings 0, rc 0 (`gates/closeout3-003/validate-strict.log`) |
| `check-goal.cjs` on this folder | RESULT: PASSED (5/5 checks), rc 0 (`gates/closeout3-003/check-goal.log`) |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Deviation | Note |
|-----------|------|
| Review route (D4) | The reviewer was DeepSeek through pi, not Luna through cli-codex as D4 names. The first attempt failed on the LLM Gateway route with the API error, and the rerun was on the OpenCode Go route. The evidence does not record a decision that replaces the Luna reviewer. Operator to confirm |
| Brief order (D3) | The test brief (T010) ran before the comment brief (T008). The two briefs touch different files |
| Pre-build Files table | The pre-build table listed Modify for repair-derived.cjs, README-repair-derived.md, migrate-generated-json.ts and upgrade-legacy.mjs. spec.md marks them Verify, and the build verified them without edits. spec.md is the authority |
| Plan actions not taken | plan.md's affected-surface actions for repair-derived.cjs (clarify the scope and remove the freeze claim) and migrate-generated-json.ts (add a policy comment) were not taken, because the comments already matched current-location semantics |
| Stale citations | Line citations in goal.md, tasks.md, plan.md and acceptance-criteria.md (419-429, 40, 189, 197-219 and 177-192) are corrected to the current lines |
| Review route, closeout note | The reviewer was DeepSeek through cli-pi on opencode-go. Parent D1 records that the operator dropped Luna on 2026-10-08, so a child goal's Luna route reads as DeepSeek. Parent D7 moved the failed llmgateway route (003-R1) to the other route (003-R1b). The reviewer identity is covered by D1 and D7 |
| Final review fix (003-O4) | The fresh Opus high final review (F3, P2) found that the SKIP_DIRS comment did not state the `--folder` bypass. Brief 003-O4 ran on DeepSeek through cli-devin and rewrote the comment. SKIP_DIRS itself is unchanged |
| Line drift at closeout | The citations written during the build went stale because phases 011, 012 and 015 edited upgrade-legacy.mjs and heal-spec-docs.cjs too (parent D6). Current lines: repairArchived at upgrade-legacy.mjs:967-1007 with its policy comment at 962-966 and call sites at 1141 and 1475; the upgrade-legacy header archive policy at lines 13-17; the heal SKIP_DIRS comment at 54-65, SKIP_DIRS at line 66 and the discover skip at line 723; enumerateSpecFolders at migrate-generated-json.ts:191. The earlier rows keep the numbers observed at the time |
| Reviewer identity, closeout 2 | The reviewer of 003-R1b was DeepSeek through cli-pi on opencode-go. Parent D1 and D4 name a fresh DeepSeek on the other route after the failed llmgateway attempt, and parent D4 is the decision that governs. The child goal's D4 names Luna, but the parent's binding rule says decisions above outrank child detail. The parent log also records the operator's 2026-10-08 "DeepSeek only" direction, which covers this reviewer. Luna returned to parent D1 on 2026-10-09 and did not review this phase. Closeout 3 correction: TR-R1, the Luna read-only review of the test round, did cover this phase's four new cases and recorded no finding on `archive-track.vitest.ts`. The statement above holds for the 003-R1b review only. The "Operator to confirm" note above is answered by the parent decisions, not by a new operator statement |
| Test round not reviewed read-only, closeout 2 | Brief 003-T1 added four cases after the Opus final review. No read-only review of them is recorded (see Review). The gate runs in Verification check them, and no reviewer has read them. Closeout 3 correction: TR-R1 (Luna, read-only) reviewed the test round, which includes these four cases, and recorded no finding on this file |
| Edge-case gap, closeout 2 | Two track-packet parent cases named by the spec's edge cases have no test (tasks.md CHK-022). The gap is recorded, not fixed, because this closeout changes documents only |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Follow-ups Outside This Phase

1. **README-repair-derived.md, section 6, lines 143-144.** The sentence "Only derived fields change: what an archived document says is never rewritten" is stale for the questions-anchor marker line that `repairArchived` moves (upgrade-legacy.mjs:967-1007). The upgrade-legacy header is accurate: its "never rewritten" sentence (lines 13-14) is followed on lines 14-16 by the marker exception, but the README does not name that exception. Owned by another phase; not edited here.
2. **Changelog.** The phase context asks for a refresh of `../changelog/` at close. No changelog folder exists under 016 or 034, so nothing was refreshed.
3. **Untested edge cases and failure branches.** The round trip covers one top-level packet. The spec's edge cases (a nested packet, an archived phase, a restored phase) and the warning branches of `rederive_moved` (`archive.sh:184-190`) have no test in this phase.
4. **Whole-tree gate.** Closed on 2026-10-09. The tree3 gate ran the whole-tree `npm test` and the CLI check, and both passed. See Verification.
5. **Commit.** The change is uncommitted in a shared worktree. CHK-FIX-007 waits for the lane A combined commit, and the ship commit closes it. Nothing was committed at closeout.
6. **Shared file.** `heal-spec-docs.cjs` carries other lanes' uncommitted edits. This phase's share is lines 54-65.
7. **Repair tool is not a no-op on a second run.** `repair-derived.cjs --apply` rewrites `last_save_at` in this folder's graph-metadata.json on every run and reports `repaired=1` each time. Observed at closeout: `last_save_at` was `2026-10-08T17:45:46.586Z` after the first apply and `2026-10-08T17:46:39.884Z` after the second, while spec NFR-R02 says a second run is a no-op. Owned by the repair tool; not changed here.
8. **Edge cases and failure branches, closeout 2.** Follow-up 3 is partly closed. The test round pins the nested packet, the archived and restored phase, and both `rederive_moved` failure branches. Still open: the archived track packet and the restored track packet parent cases (tasks.md CHK-022).
9. **Read-only review of the test round.** None is recorded. The lane owner should run one, or accept the gate runs as the only check on the four new cases. Closeout 3 correction: TR-R1 (Luna, read-only) reviewed the test round, and its output records no finding on this file, so the four cases have a read-only review on record.
10. **Raw cli test totals.** The tree4 `cli-test.log` ends with rc 0 and no failing count, but it has no vitest summary line. The 171 files and 1775 tests in the gate summary are not confirmed from the raw log. Writing the vitest summary to a file on the next run would confirm them.
<!-- /ANCHOR:limitations -->
