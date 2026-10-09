---
title: "Implementation Summary"
description: "Phase 15: lane-rules-as-heal-modes is complete for its acceptance criteria. Five lane rules run as heal modes with derivability checks, and the open items are listed here."
trigger_phrases:
  - "lane rules as heal modes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes"
    last_updated_at: "2026-10-09T11:20:00Z"
    last_updated_by: "closeout"
    recent_action: "Third closeout pass: gates re-cited to tree5, corpus proof re-run"
    next_safe_action: "Commit with the D6 combined commit, then pin the SHA in CHK-FIX-007"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 015-lane-rules-as-heal-modes |
| **Status** | Complete |
| **Completed** | 2026-10-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is complete for its acceptance criteria, 19 of 19 Met. The five deterministic lane rules run as heal modes in `heal-spec-docs.cjs`, in this order: anchor-wrap, link-repoint, continuity-placeholders, level-from-spec and header-add. Each mode reads the text the mode before it returned, and each refuses when the packet's own evidence cannot prove the fix. `upgrade-legacy --apply` runs the modes after the healer and before the derivation steps, and it writes every refusal into the packet's `upgrade-baseline.json` under `refusals`. Lane rules 3 (reconstruction) and 7 (status alignment) stay reported and are never automated. The operator confirmed rule 7 on 2026-10-08.

### Phase 15: lane-rules-as-heal-modes

- **anchor-wrap** (`anchorWrap`, `heal-spec-docs.cjs:773`). Wraps a heading that the level's active template maps to an anchor id. It acts only when the document has at least one anchor marker and every marker is paired. It refuses when the level or template cannot be resolved, when the heading text repeats, or when the id is already present. Headings the template does not map are authored prose and stay untouched.
- **link-repoint** (`linkRepoint`, `:998`). Repoints one broken relative link when exactly one indexed `.md` file ends with the link's last one or two path segments. It refuses on zero matches, on several matches and on a reference definition it cannot resolve. It never unlinks. Scratch and memory folders are not candidates.
- **continuity-placeholders** (`continuityPlaceholders`, `:1180`). Fills `recent_action` and `next_safe_action` only when both are scaffold or empty. The fixed values are `"No continuity update was recorded"` and `"None recorded"`, or `"None, the packet is archived"` when the packet sits under a `z_archive` or `z_future` segment below the specs root. It refuses when only one of the two fields is a placeholder, because that pair is an edit in progress.
- **level-from-spec** (`levelFromSpec`, `:1240`). Writes `level: N` into the frontmatter of a document that declares no level in any form the validator reads, using the `SPECKIT_LEVEL` markers in spec.md when they agree. It refuses when spec.md is missing, has no marker, has a malformed value or has markers that disagree, and when the document has no frontmatter.
- **header-add** (`headerAdd`, `:1295`). Stamps the `SPECKIT_TEMPLATE_SOURCE` marker after the frontmatter, and only when the document's anchors match the level's render exactly, with nothing extra and nothing missing. It refuses on any other anchor set, on a template that renders no marker and on a missing frontmatter.
- **Runner and integration.** `runLaneModes` (`heal-spec-docs.cjs:1332`) runs the selected modes over each document, in mode order, and writes once per document under `--apply`. `upgrade-legacy.mjs` calls it in the lane-modes step (`:874-893`) and passes the refusals to the baseline (`:1460-1472`). `heal-spec-docs.cjs --lane-modes` runs the same modes on their own, dry run by default.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | The five modes, the runner and the `--lane-modes` CLI |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | The lane-modes step in the repair pass, and the refusals passed to the baseline |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts` | Create | 42 cases: positive, refusal, idempotence, CLI, sequence, and the archived-path and hostile-directory cases from the test round |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | `all-modes-sequence`, the integration case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | The "Heal Lane Modes" subsection and the `--lane-modes` CLI row |

The first two files and `upgrade-legacy.vitest.ts` also carry changes from phases 003, 009, 011 and 012, because those phases edit the same files. Parent D6 ships them in one combined commit, and `heal-lane-modes.vitest.ts` is a new file in that commit. No commit SHA is pinned yet.

### Test Matrix

`heal-lane-modes.vitest.ts` holds 42 cases: 5 anchor-wrap, 9 link-repoint (the hostile-directory case is the ninth), 14 continuity-placeholders (six named cases and an eight-row archived-path table), 5 level-from-spec, 6 header-add, 1 CLI and 2 for mode order and sequence. Each of the five modes has at least five cases, which the goal requires. `upgrade-legacy.vitest.ts::all-modes-sequence` covers the integration path.

| Scenario | Test | AC |
|----------|------|----|
| anchor-wrap adds the pair and changes nothing else | `anchor-wrap-positive` | AC-001 |
| anchor-wrap refuses a document with no anchors | `anchor-wrap-refuses-no-anchors` | AC-002 |
| anchor-wrap after a trailing fence, and with no final newline | `anchor-wrap-ends-after-trailing-fence`, `anchor-wrap-ends-without-final-newline` | review F1, F2 |
| link-repoint repoints one unique match | `link-repoint-positive` | AC-003 |
| link-repoint refuses several matches, zero matches and an unresolved reference definition | `link-repoint-refuses-multiple-matches`, `link-repoint-refuses-no-target`, `link-repoint-refuses-reference-definitions` | AC-004 |
| link-repoint skips fenced links and scratch or memory targets, and keeps angle brackets and fragments | `link-repoint-ignores-fenced-links`, `link-repoint-ignores-scratch-and-memory-candidates`, `link-repoint-preserves-angle-brackets-and-fragments` | review F7 |
| continuity fills empty fields, archived variant, archive status from the specs root | `continuity-placeholders-positive`, `continuity-placeholders-archived`, `continuity-placeholders-archive-status-from-specs-root` | AC-005 |
| continuity refuses an authored pair and leaves a non-placeholder alone | `continuity-placeholders-refuses-authored`, `continuity-placeholders-ignores-authored-replace` | AC-006 |
| level-from-spec writes the level, keeps an inline declaration, refuses a missing or malformed marker | `level-from-spec-positive`, `level-from-spec-keeps-inline-declaration`, `level-from-spec-refuses-missing-header`, `level-from-spec-refuses-malformed` | AC-007, AC-008 |
| header-add stamps an exact match, keeps CRLF, stamps past a fenced extra, refuses no match and a fenced-only anchor | `header-add-positive`, `header-add-keeps-crlf`, `header-add-stamps-past-fenced-extra`, `header-add-refuses-no-match`, `header-add-refuses-fenced-only-anchor` | AC-009, AC-010 |
| a second run changes nothing, one case per mode | `anchor-wrap-idempotence`, `link-repoint-idempotence`, `continuity-idempotence`, `level-from-spec-idempotence`, `header-add-idempotence` | AC-011, AC-012, REQ-002 |
| the CLI dry run and JSON output, and an unknown mode name exits 2 | `lane-modes-cli-dry-run-and-json` | CHK-012 |
| the five modes run in order, and a second run is identical | `lane-modes-order`, `lane-modes-sequence`, `upgrade-legacy.vitest.ts::all-modes-sequence` | AC-013, AC-016, REQ-006 |
| archived-path placements: delimiter look-alikes, `..` and doubled separators, outside-root, no-op and fallback (test round 015-T1) | `continuity-placeholders-archive-placement` (eight rows) | CHK-FIX-004 |
| link-repoint from a hostile working directory, then from the packet root (test round 015-T2, strengthened by 015-T3) | `link-repoint-hostile-working-directory` | CHK-FIX-006 |

Matrix axes (CHK-FIX-005): document kind (spec, plan, tasks, implementation summary), level, line ending (LF and CRLF), final newline (present and absent), fence position (none, trailing, inside a section), packet location (live, `z_archive`, scratch below the specs root) and evidence (present, absent and malformed). Not covered by a case: markers that disagree, which the code refuses and the README documents.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:review -->
## Review Rounds and Findings

Round 1 ran on opencode-go and round 2 on cli-devin, both read-only, with DeepSeek V4.1 Flash max, per parent D1 and D4. A finding was applied only after the builder confirmed it in the code. The final review was a fresh Opus high pass.

| Round | Finding | Priority | Class | Result |
|-------|---------|----------|-------|--------|
| R1 | header-add counted anchors inside fenced and inline code, so a stamp could rest on a code sample | P1 | algorithmic | Fixed in 015-F1. `anchorsOf` reads unfenced lines with inline code blanked. Two cases added |
| R1 | continuity-placeholders judged a packet archived on any absolute-path segment | P2 | algorithmic | Fixed in 015-F2. Archived status is judged below the specs root |
| R1 | header-add wrote `\n` into CRLF documents | P2 | matrix/evidence (line-ending axis) | Fixed in 015-F3. The stamp uses the document's own line ending. The case failed before the fix |
| R2 | level-from-spec missed the validator's inline `Level: N` form | P2 | cross-consumer | Fixed in 015-F6, with a no-op case for `Level: 3` |
| R2 | README said one marker was allowed, while the code accepts several that agree | P2 | cross-consumer (doc and code) | Fixed in 015-F7 |
| Gate | A second `--apply` on a repaired parent exited 2, and `dirty-tree-idempotent` leaked state. Root cause: `recordFindings` wrote an empty findings list for a packet that passed mid-run | P1 | algorithmic (015-F4), and test-isolation for the leaked case (015-F5) | Fixed in 015-F4. 015-F5 needed no change of its own |
| Final | An anchor-wrap closer landed before a trailing fence | P1 | algorithmic | Fixed in 015-O1, with a case |
| Final | An anchor-wrap closer was glued to the last prose line when the file had no final newline | P2 | matrix/evidence (end-of-file axis) | Fixed in 015-O2, with a case |
| Final | link-repoint could target scratch and memory folders | P2 | algorithmic | Fixed in 015-O3. The case failed before the fix |
| Test round | TR-R1 F1: the hostile-directory case could not fail, because its unrelated file did not match the broken link key | P1 | matrix/evidence (the fixture did not discriminate) | Fixed in 015-T3. The case now differs between the wrong root and the right root. TR-R1 F2 (an order-dependent packet in the shared upgrade-legacy sandbox) was accepted and assigned to phase 012. TR-R1 F3 was rejected: the flagged string is a workflow key the test reads, not an ephemeral label |
| Simplification | Opus F1, P2: the lane section in heal-spec-docs.cjs was unnumbered, and its constants sat outside section 2 | Structure only, no behavior change. Fixed in OC-F1: `LANE_MODES` and `LANE_DOCUMENTS` moved into section 2 and the section is numbered |
| Simplification | Opus O1, P2: two healer caches, `anchorToolsFor` and `laneToolsFor`, in upgrade-legacy.mjs | Structure only. Fixed in OC-O1: one loader, `healerFor(context)` (upgrade-legacy.mjs:802) |
| Simplification | Opus O2, P2: a second atomic writer, `writeDocumentAtomic`, in upgrade-legacy.mjs | Structure only. Fixed in OC-O2: the healer's `writeFileAtomic` (heal-spec-docs.cjs:597) is the one exported writer, and the duplicate is deleted |
| Simplification | Opus O3, P2: an EEXIST retry loop in the atomic writer | Fixed in OC-O2: one exclusive create (`'wx'`, heal-spec-docs.cjs:608) and no retry |
| Simplification | Opus F2 and O5, P2: `planLayoutMove` had no JSDoc, and an unreachable `?? order.size` fallback sat in upgrade-legacy.mjs | Fixed in OC-F2O5. The fallback is no longer in the file, and `sortRefusals` (upgrade-legacy.mjs:1141) reads the mode rank without one |

The fresh Opus review gave the verdict FIX FIRST with no P0. It checked comment hygiene, that rendered templates never nest, and that the corpus diffs are marker-only except four `packet_pointer` re-derivations. Its other findings (F3 to F6) belong to phases 003, 009, 011 and 013, and are recorded there.
<!-- /ANCHOR:review -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` (`gates/tree5/cli-test.log`, `gates/tree5/cli-test.rc`) | rc 0. Test Files 171 passed, 3 skipped (174). Tests 1775 passed, 19 skipped (1794). The tree3 gate had 1752 passed |
| Focused vitest on 8 files, including `heal-lane-modes.vitest.ts` and `upgrade-legacy.vitest.ts` (`gates/tree5/focused-vitest.log`) | 8 of 8 files passed, 152 tests passed, rc 0. The run started after the 015-T3 edit of the lane file |
| `heal-lane-modes.vitest.ts` alone, after 015-T3 (`gates/tests-after-tr/lane.log`) | 1 file, 42 of 42 tests passed |
| `workflow-invariance.vitest.ts`, run alone (`gates/tree5/workflow-invariance-isolated.log`) | 2 of 2 passed, rc 0 |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` (`gates/tree5/cli-check.log`) | rc 0 |
| Builds: runtime and CLI (`gates/tree5/build.log`, `build-cli.log`) | rc 0 and rc 0 |
| CLI typecheck (`gates/tree5/typecheck-cli.log`) and runtime typecheck (`gates/tree5/typecheck.log`) | rc 0 and rc 0 |
| `typecheck:tests` (`gates/tree5/typecheck-tests.log`) | rc 2, 95 `error TS` lines. Report-only, the same count as the earlier gates. None names `heal-spec-docs.cjs`, `upgrade-legacy.mjs` or `heal-lane-modes.vitest.ts` |
| Hooks, `node --test runtime/tests/hooks/*.test.mjs` (`gates/tree5/hooks.log`) | 184 tests, 181 pass, 0 fail, 3 skipped, rc 0 |
| Doctor, `run-all.sh` (`gates/tree5/doctor.log`) | 7 suites passed, 0 failed, rc 0 |
| Test validation, `test-validation.sh` (`gates/tree5/test-validation.log`) | Total 31, RESULT: PASSED, rc 0 |
| Doctor update compatibility, two `node --test` files (`gates/tree5/doctor-update.log`) | 22 of 22 pass, rc 0 |
| Root suite, `npm --prefix .skilled/skills/system-spec-kit test` (`gates/tree5/root-test.log`, `gates/tree5/root-test.rc`) | rc 0, with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`, the runner's own setting. Runtime suite 281 files and 4,180 tests passed. CLI sub-step 171 files and 1,775 tests passed. Four RESULT: PASSED lines from the spec and validation sub-steps. HEAD moved during the run, see the paragraph below the table |
| Corpus dry run over the real tree, `heal-spec-docs.cjs --lane-modes --roots specs` (`gates/closeout-015/lane-dry-run-corpus.txt`) | 262 would apply, 128 refused, rc 0 |
| Corpus two-pass run on a scratch copy (`gates/closeout-015/corpus-pass1.jsonl`, `corpus-pass2.jsonl`, before the 2026-10-09 simplification pass) | Pass 1: 264 actions. Pass 2: 0 actions, 0 changed files, no SHA-256 change across 42,353 .md files |
| Corpus two-pass re-run on the final code (`gates/closeout3-015/corpus-pass1.json`, `corpus-pass2.json`, `corpus-pass2-hash.diff`) | Pass 1: 262 actions, 131 changed files, 132 refusals. Pass 2: 0 actions, 0 changed files, the same 132 refusals, no SHA-256 change across 42,353 .md files. The dry run over the real tree left its SHA-256 unchanged (`gates/closeout3-015/real-md-sha.diff` is empty) |
| `validate.sh --strict` on this folder (`gates/closeout-015/validate-final.txt`, first closeout) | RESULT: PASSED, Errors 0, Warnings 0. AC_COVERAGE 19/19 and AC_CLOSURE 19/19 |
| `check-goal.cjs` on this folder (`gates/closeout-015/check-goal-final.txt`, first closeout) | RESULT: PASSED (5/5 checks), exit 0 |
| `repair-derived.cjs --folder` on this folder, second closeout (`gates/closeout2-015/repair-derived-final.txt`) | repaired=1, failed=0, rc 0 on the final run |
| `validate.sh --strict` on this folder, second closeout (`gates/closeout2-015/validate-strict.txt`, `validate-strict.rc`) | RESULT: PASSED, Errors 0, Warnings 0, rc 0. AC_COVERAGE 19/19 and AC_CLOSURE 19/19 |
| `check-goal.cjs` on this folder, second closeout (`gates/closeout2-015/check-goal.txt`, `check-goal.rc`) | RESULT: PASSED (5/5 checks), exit 0 |

The corpus runs were made by hand from the closeout worker, and the raw output is kept in `gates/closeout-015/`. The two-pass run used a scratch copy outside the repository that holds only `.md` files. Its two link-repoint actions were artifacts of that copy location, because they repointed to paths that climb out of the copy. The real-tree dry run shows no link-repoint action. The 2026-10-09 re-run ran with the copy as its working directory and made none of them: 262 actions, the same count as the real-tree dry run. That cause is inferred from the working directory, not isolated. The pass-2 result, zero actions and zero byte changes, is the property AC-019 checks, and it does not depend on those two actions.

The tree5 gate logs are the evidence for the test, check, typecheck, hooks, doctor and root rows. Tree5 ran after the simplification pass, so its logs cover the final state of the lane code and its tests. HEAD moved from `02cc1fb948` to `c2a0a667e9` during the root step. That commit belongs to another session, holds no runtime file and none of this phase's files, so the code under test did not change. The tree4 root step timed out at the 600000 ms bound and has no verdict.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Builder route.** Builders and reviewers ran DeepSeek V4.1 Flash max on cli-pi (opencode-go and llmgateway) and on cli-devin, not the GPT-6 Luna route that goal.md D4 names. Parent D1 and the operator's change of 2026-10-08 caused this. The builders' route failures moved the work along per D7. Build 015-B3 failed on llmgateway with a `reasoning_content` error and reran on opencode-go as 015-B3b. Review 015-R2b failed on opencode-go with a 429 usage limit and reran as 015-R2c on cli-devin.
2. **Shared files and one commit.** The build's changes to `heal-spec-docs.cjs`, `upgrade-legacy.mjs` and `upgrade-legacy.vitest.ts` sit beside phases 003, 009, 011 and 012. They ship in one combined commit under parent D6.
3. **Test file name.** The mode tests live in `heal-lane-modes.vitest.ts`, not `heal-spec-docs.vitest.ts`. spec.md's Files to Change allows "or new file". The acceptance rows AC-001 to AC-010 and goal.md named the old file, and the rows are corrected.
4. **No unlink branch.** The plan and T007 described an unlink branch for zero matches. The build refuses on zero matches instead, which is what spec.md's edge cases say. The README says "Never unlinks". T007 records this.
5. **Stale line numbers.** tasks.md cited lines 168 and 507-508 for the registration and the integration point. Those lines no longer match, so the tasks now cite function names and current line numbers.
6. **AC-019 verification corrected.** `validate.sh --corpus-mode` does not exist. The row now names the lane-mode CLI run described under Verification. This is a correction of the verification text, not a change of the criterion.
7. **AC-013 literal command replaced.** The row asked for a `validate.sh --strict` count on the second run. The verification now names the `all-modes-sequence` assertions. The phrase "same baseline count" is read as identical recorded findings, plus RESULT: PASSED on both runs.
8. **Changelog not refreshed.** spec.md asks for a refresh of `../changelog/` at close. Neither the parent nor the track has a `changelog/` folder, so there was nothing to refresh. Phase 010 recorded the same case.
9. **Goal citation.** goal.md's criterion for the mode tests named `heal-spec-docs.vitest.ts`. It now names `heal-lane-modes.vitest.ts`. No other goal.md text was changed.
10. **Test round routes.** 015-T1 ran on cli-devin. The devin daily quota ran out before 015-T2, so 015-T2 was rerun on llmgateway (DeepSeek, per D7). 015-T3 ran on the DSC route, which is pi's cline-pass provider (DeepSeek V4.1 Flash max, added to D1 by the operator on 2026-10-09). The test round edited test files only.
11. **Line citations re-derived.** The test round moved line numbers in `heal-lane-modes.vitest.ts` and `upgrade-legacy.vitest.ts`. The acceptance rows and tasks now cite the current lines. The earlier citations matched the files as they stood before the round.
12. **Root suite verdict.** The root `npm --prefix .skilled/skills/system-spec-kit test` step hit the 600000 ms harness bound in tree4 (rc 124). The tree5 run of the same command, with the runner's own `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`, exited 0 (`gates/tree5/root-test.rc`). The CLI suite the rows cite is `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, rc 0 in both trees.
13. **AC-014 grep corrected.** The first version of the row searched for the lowercase `reconstruction`, which has no hit in the file. The row now names the case-insensitive search. Closeout pass 3, 2026-10-09.
14. **Corpus proof re-run on the final code.** AC-019 was first measured before the 2026-10-09 simplification pass. The re-run in `gates/closeout3-015` gives 262 actions on pass 1 and 0 on pass 2. The two link-repoint actions of the earlier run were copy-location artifacts, see Verification.

<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations and Open Items

1. **T022 is open, an operator item.** No corpus-scale `upgrade-legacy --apply` run was made. The evidence log records the full-corpus apply in a throwaway clone as skipped, with the operator not objecting, and as a follow-up. That command refuses a tree without git, and the scratch corpus copy has no git repository. The one-packet version is `all-modes-sequence`, and the corpus-scale second run is AC-019.
2. **CHK-FIX-004 is closed (P0) by the 015-T1 table.** It covers the delimiter, joined-spelling, outside-root, no-op and fallback placements. It is not exhaustive beyond those rows.
3. **CHK-FIX-006 is closed (P1) by the 015-T2 case, strengthened by 015-T3.** The lane code (`heal-spec-docs.cjs`) reads no environment variable. Its only process-wide read is `process.cwd()`, at `laneRepoRoot` (line 949), when a document is outside git.
4. **CHK-FIX-007 is open (P1).** The build is not committed. The SHA is pinned after the combined commit.
5. **Plan pre-deployment item open.** "Derivability checks are validated on phase 13 fixtures" is not checked. The tests build their fixtures inline, and this closeout did not locate phase 13 fixtures to compare against.
6. **Disagreeing markers are not pinned.** `level-from-spec` refuses spec.md markers that disagree, and the README documents it, but no case covers it.
7. **Archived packets.** `upgrade-legacy` never runs lane modes on archived packets. The archived continuity text is reached only by a `--folder` run on an archived path. Archived status comes from the packet's current location, the same rule `repair-derived` follows.
8. **Boundary with anchor-repair-mode (phase 011).** `upgrade-legacy` runs the anchor repair before the lane modes, and anchor-wrap refuses repeated heading text and ids that are already present. Numbering and un-nesting stay in phase 011.
9. **Same class outside this phase.** `healDoc` in `heal-spec-docs.cjs:698` writes a hard-coded `\n` into the trigger-phrase fill at `:717`. It is the class of 015-F3, in code this phase does not change, so it is a follow-up.
10. **Corpus check scope.** The AC-019 two-pass run covers the 2,200 live packets that the lane walk reaches. Archived and scratch packets are outside the walk by design, and the scratch copy holds only `.md` files.
11. **Verification status.** The Status field reads Complete because every acceptance row is Met. After the third pass the only open checklist row is CHK-FIX-007 (P1), and the only open task is T022. The orchestrator decides whether the packet closes, given items 1, 4 and 5.
<!-- /ANCHOR:limitations -->
