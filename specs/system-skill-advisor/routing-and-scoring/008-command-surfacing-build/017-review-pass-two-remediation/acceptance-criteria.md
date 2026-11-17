---
title: "Acceptance Criteria: Phase 17: review-pass-two-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one. All 30 rows are Met with the evidence observed at close-out."
trigger_phrases:
  - "review pass two remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation"
    last_updated_at: "2026-11-13T17:42:15Z"
    last_updated_by: "claude"
    recent_action: "Marked all 30 acceptance rows Met with observed evidence"
    next_safe_action: "Commit the phase, then build phase 018"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/scratch/after.txt"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/scratch/repro-after.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-review-pass-two-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 17: review-pass-two-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 017-review-pass-two-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The short names are the ones `tasks.md` defines in its Task Notation. Every reading ran on base commit `ec1869dae8` with the changes uncommitted in the working tree. `scratch/after.txt` and `scratch/repro-after.txt` are the coordinator's records. "Close-out rerun" marks a read-only check rerun from the final tree on 2026-11-13. A code citation names the line the check reads.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an agent request ending in each of the four no-edit wordings, When the attach path, the scorer gate and the explainer test read it, Then no command attaches, the gate says `false` and a read-only request reads as read-only | `VX tests/command-attach-guards.vitest.ts`, `VX tests/command-meaning-anchor.vitest.ts` and `VX tests/scorer/read-only-explainer.vitest.ts` report 0 failed with the T003 to T005 cases, and `probe-no-edit.mts` prints `undefined` on its five attach lines and `false` on its five scorer lines. Observed: `VALL` reads `Tests 1796 passed` with 0 failed at `scratch/after.txt:19`, which includes the three files, and the five attach lines and five scorer lines end at `scratch/repro-after.txt:96` and `scratch/repro-after.txt:101` with `-> undefined` and `-> false` on each | Met | - |
| AC-002 | REQ-002 | Given the before lines in `scratch/before.txt`, When T038 reruns `FLOOR` and `EVAL` after the rebuild, Then every value equals its before line | `scratch/after.txt` ends `RESULT: every floor equals its before line`. Observed: `scratch/after.txt:63` is that line, and its four `FLOOR` lines and `EVAL` `[160,50,21,5]` equal the lines in `scratch/before.txt` | Met | - |
| AC-003 | REQ-003 | Given a run log line naming a folder with a fake advisor CLI and hook and no arena marker, When the backfill runs, Then neither fake runs and the line holds `offerError` `untrusted_checkout` | The T010 cases pass in `VX tests/command-offer.vitest.ts`, and `probe-backfill-trust.mjs` prints `fake CLI ran: false, fake hook ran: false`. Observed: `VALL` 0 failed, `scratch/repro-after.txt:25` prints `fake CLI ran: false, fake hook ran: false` and the next line prints `offerError: "untrusted_checkout"` | Met | - |
| AC-004 | REQ-004 | Given a turn that creates `notes draft.md` and `plain.md`, When the restore runs, Then both files are gone and nothing is left over | The T011 cases pass in `VX tests/worktree-restore.vitest.ts`, and `probe-restore-quoted.mjs` prints `left on disk: notes draft.md false, plain.md false`. Observed: `VALL` 0 failed, and `scratch/repro-after.txt:157` prints `left on disk: notes draft.md false, plain.md false` after `"restored":true` and `"leftoverPaths":[]` | Met | - |
| AC-005 | REQ-005 | Given a selection of started-command ids with no `--arm`, When the runner picks the arm, Then it is `g2`, and a selection mixing them with other ids is refused with `mixed_row_arms` | The T012 cases pass in `VX tests/command-behaviour-guards.vitest.ts`, and `probe-arm-fixture.mjs` prints `-> arm g2` and `arm refused mixed_row_arms`. Observed: `VALL` 0 failed, `scratch/repro-after.txt:14` prints `--row-id g2-deep-review-ask -> arm g2` and `scratch/repro-after.txt:16` prints `-> arm refused mixed_row_arms` | Met | - |
| AC-006 | REQ-006 | Given a g2 run with `--fixture /custom/fixture`, When its log is backfilled, Then the replayed prompt names `/custom/fixture` | The T013 cases pass in `BG` and `COT`, and `probe-arm-fixture.mjs` prints `run line records the fixture: true` and a replay naming `/custom/fixture`. Observed: `VALL` 0 failed, `scratch/repro-after.txt:18` replays `review the parser under /custom/fixture` and `scratch/repro-after.txt:20` prints `run line records the fixture: true` | Met | - |
| AC-007 | REQ-007 | Given the finished phase, When T040 scans the diff against `BASE`, Then `AGENTS.md` and every `package.json` are unchanged, no added comment carries a label, no line adds `/create:skill` or `/create:sk-skill` and only the files the tasks name changed | Every T040 check prints what it names. Observed in a close-out rerun against `ec1869dae8`: `git diff --quiet -- AGENTS.md` exits 0, the package diff stat prints nothing, the label scan prints nothing on the diff and on the new test file, the `/create:(sk-)?skill` scan prints nothing, the 41 changed and 1 new files under `.skilled` and `.opencode` are each named by a task, and the parent row count prints 3, with row 7 at `../spec.md:122` | Met | - |
| AC-008 | REQ-008 | Given a stored debug record holding two marker strings, When status is read, Then the stored file holds both and the status output holds neither | The T006 case passes in `VX tests/handlers/advisor-status.vitest.ts`, and `probe-status-privacy.mts` prints `privacy case persists a record: true`. Observed: `VALL` 0 failed, `scratch/repro-after.txt:173` prints `privacy case persists a record: true` and `scratch/repro-after.txt:175` prints `stored record holds both markers: true` | Met | - |
| AC-009 | REQ-009 | Given the attach test file, When it is read, Then no assertion asks the injected table for a mode it has no row for | `rg -c "singleRoute\('sk-create-benchmark'\), PLAIN_PROMPT" $CAT` prints nothing and `VX tests/command-attach.vitest.ts` reports 0 failed. Observed: the close-out rerun of the `rg` prints nothing and exits 1, the kept assertion sits at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:120`, and `VALL` reports 0 failed | Met | - |
| AC-010 | REQ-010 | Given the `CommandRow` interface, When the README row sentence is read, Then it names `command`, `policy`, `mutating` and `ownerSkillId` | The T008 case passes in `VX tests/command-attach-guards.vitest.ts`. Observed: `VALL` 0 failed, and the sentence naming the four fields sits at `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50`, while a close-out `rg` finds the old sentence 0 times | Met | - |
| AC-011 | REQ-011 | Given values holding `\n`, `\r`, U+2028 and U+2029, When `tsString` emits them, Then each literal parses back to its value and the generated sources are unchanged | `VX tests/derive-command-bridges-strings.vitest.ts` reports 0 failed and `DERIVE` prints `{"status":"fresh","changed":[]}`. Observed: `VALL` 0 failed, `DERIVE` prints `{"status":"fresh","changed":[]}` at `scratch/after.txt:33`, and `scratch/repro-after.txt:183` prints `LF: raw break in literal false, parses true`, as do the CR, U+2028 and U+2029 lines after it | Met | - |
| AC-012 | REQ-012 | Given a caller environment, When `scoreCommandCorpus` returns, Then every `ENV9` value equals what it was before | The T014 case passes in `VX tests/command-routing-slice.vitest.ts`, and `probe-capture-env.mjs` prints `variables left changed: []`. Observed: `VALL` 0 failed, and `scratch/repro-after.txt:35` prints `variables left changed: []` | Met | - |
| AC-013 | REQ-013 | Given a parent shell with `AI_SESSION_CHILD=1`, When the cost script runs a hook, Then the hook sees no `AI_SESSION_CHILD` | The T015 case passes in `VX tests/measure-brief-cost.vitest.ts`, and `probe-cost-child.mjs` prints `hook saw AI_SESSION_CHILD=<unset>`. Observed: `VALL` 0 failed, and `scratch/repro-after.txt:52` prints `hook saw AI_SESSION_CHILD=<unset>` | Met | - |
| AC-014 | REQ-014 | Given the session form with `--row-id`, When the scorer runs, Then it exits 2 with `--row-id narrows --summary only` and no usage line offers the flag there | The T016 case passes in `VX tests/command-transcript-score.vitest.ts`, and the T016 and T018 `rg` checks print what they name. Observed: `VALL` 0 failed, `scratch/repro-after.txt:162` prints `exit=2 stdout= stderr=score-command-transcripts.mjs: --row-id narrows --summary only`, the refusal sits at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:123`, and the close-out `rg` reruns print nothing for the session `--row-id` usage and `narrows either mode` and print 1 for `is a usage error with` | Met | - |
| AC-015 | REQ-015 | Given the scorer header, When it is read, Then it describes counts and verdicts per runtime and arm | The T017 `rg` checks print what they name and `node --check $S` exits 0. Observed: the new header line sits at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:7`, the close-out reruns print nothing for `the reads and writes in order`, and `node --check` exits 0 | Met | - |
| AC-016 | REQ-016 | Given the playbook category tree, When the inventory note is read, Then it states 50 scenario files and none named `NNN-*.md` | The T022 assertions pass in `VX tests/manual-testing-playbook.vitest.ts` and `PBV` prints its `PASS` line. Observed: `VALL` 0 failed, the note sits at `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:40`, and `PBV` prints its `PASS` line at `scratch/after.txt:41` | Met | - |
| AC-017 | REQ-017 | Given the persistence paragraph, When it is read, Then it names the folder records are written to by hand, keeps the marker and makes no renderer claim | The T023 case passes in `VX tests/manual-testing-playbook.vitest.ts` and `PBV` prints its `PASS` line. Observed: `VALL` 0 failed, the paragraph sits at `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30`, `PBV` passes at `scratch/after.txt:41` and `scratch/repro-after.txt:138` prints an empty `renderer sentence:` | Met | - |
| AC-018 | REQ-018 | Given the tests README, When the playbook test row is read, Then it calls the file the playbook inventory test | The T024 `rg` checks print what they name. Observed: the row sits at `.skilled/skills/system-skill-advisor/runtime/tests/README.md:154`, and the close-out reruns print nothing for `Verifies manual testing playbook routing fixtures` and print 1 for `Checks the playbook inventory` | Met | - |
| AC-019 | REQ-019 | Given the plugin's jsdoc, When the bounding option is read, Then it says the option only sets a status field | The T025 `rg` check prints nothing and `VP` reports `fail 0`. Observed: the jsdoc sits at `.opencode/plugins/system-skill-advisor.js:1060`, the close-out `rg` prints nothing, and `VP` reads `pass 43` at `scratch/after.txt:30` with `fail 0` | Met | - |
| AC-020 | REQ-020 | Given the plugin source, When it is searched, Then no `compiledRouteSummary` function or metadata field remains | `rg -c "compiledRouteSummary" $PJ` prints nothing and `VP` reports `fail 0`. Observed: the close-out `rg` prints nothing, `VP` reads `fail 0` after `scratch/after.txt:30`, and `scratch/repro-after.txt:145` prints `compiledRouteSummary lines: []` | Met | - |
| AC-021 | REQ-021 | Given a row with `command`, `policy` and `ownerSkillId`, When the fallback and the plugin render it, Then each head shows `sk-doc → /create:agent (start)` | The T027 case passes in `VP`, the T028 case passes in `VX tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` with and without `AI_SESSION_CHILD=1`. Observed: the assertions sit at `.opencode/plugins/tests/system-skill-advisor.test.cjs:509` and `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:99`, `VP` reads `fail 0`, `VALL` 0 failed, and the child-flag run reads `Tests 4 passed (4)` at `scratch/after.txt:22` | Met | - |
| AC-022 | REQ-022 | Given a busy marker after 1 MiB of stderr or split across two writes there, When the subprocess fails, Then it retries once and reports `SQLITE_BUSY_EXHAUSTED` | `VX tests/subprocess-output-cap.vitest.ts` reports 0 failed with the T029 cases, and `probe-busy-cap.mts` prints `marker after 1 MiB: errorCode SQLITE_BUSY_EXHAUSTED, retriesAttempted 1`. Observed: `VALL` 0 failed, and `scratch/repro-after.txt:30` prints `marker after 1 MiB: errorCode SQLITE_BUSY_EXHAUSTED, retriesAttempted 1` | Met | - |
| AC-023 | REQ-023 | Given the advisor-recommend catalog page, When its citations are read, Then the six schema and handler anchors are named by symbol | `rg -c "advisor-tool-schemas\.ts:[0-9]" $ARM` and `rg -c "handlers/advisor-recommend\.ts:[0-9]" $ARM` print nothing. Observed: the close-out rerun of both patterns prints nothing, the anchors are named by symbol from `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:31` to line 37, `AdvisorRecommendationSchema` counts 3 and `AdvisorRecommendInputSchema` counts 2 | Met | - |
| AC-024 | REQ-024 | Given an embed output holding `ERROR: the restore failed`, When the workflow's exit-3 rule is read, Then it says the tree may be partly written and the outcome takes precedence over `restored:` | The T031 case passes in `NT $DAC` and `probe-embed-contract.sh` prints `workflow names the restore failure: 1`. Observed: `DALL` reads `pass 1211` at `scratch/after.txt:24` with `fail 0`, the rule sits at `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104`, and `scratch/repro-after.txt:57` prints `workflow names the restore failure: 1` | Met | - |
| AC-025 | REQ-025 | Given no hook health record, When `setup.md` explains the leg, Then it gives the workflow's reason and no longer names `SKILL_ADVISOR_DEBUG` | The T033 assertions pass in `NT $DSCT` and `SRM` exits 0. Observed: `DALL` `fail 0`, `SRM` prints `exit=0` at `scratch/after.txt:39`, the reason sits at `.skilled/commands/doctor/setup.md:82`, and `scratch/repro-after.txt:63` and the line after it print `setup router names the debug flag: 0` and `setup router gives the workflow reason: 1` | Met | - |
| AC-026 | REQ-026 | Given the engine's digest-named backup folder, When the workflow and the route name it, Then both say `doctor-agents-md/<first 16 characters of the plan digest>/` and the route names the temporary-directory fallback | The T032 case passes in `NT $DAC`, `RV` exits 0 and `probe-embed-contract.sh` prints `route names the temporary-directory fallback: yes`. Observed: `DALL` `fail 0`, `RV` prints `exit=0` at `scratch/after.txt:36`, the names sit at `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:34` and `.skilled/commands/doctor/_routes.yaml:546`, and `scratch/repro-after.txt:61` prints `route names the temporary-directory fallback: yes` | Met | - |
| AC-027 | REQ-027 | Given the seven wrapper launches and a quoted `echo` of the script, When the hook-wiring check reads them, Then the launches read `ok` and the `echo` reads `hook-missing` | The T034 cases pass in `NT $HWT`, `node $HW --root .` prints `ok` for claude, codex, cursor and devin, and `probe-hook-shapes.cjs` prints the T034 lines. Observed in close-out reruns: `NT $HWT` reads `pass 28` and `fail 0`, and `node $HW --root .` prints `ok claude`, `ok codex`, `ok cursor` and `ok devin` and exits 0. `scratch/repro-after.txt:73` prints `bash -lc: exit 0 ok claude`, the nine launch lines all read `exit 0 ok claude`, and `scratch/repro-after.txt:79` prints `echo with a quoted script: exit 1 hook-missing` | Met | - |
| AC-028 | REQ-028 | Given runtime copies with report-only entries, When A10 counts them, Then only PASS entries count as expected and the report-only ones are named apart | The T035 case passes in `NT $CHKT`, and `A10Q` prints a detail whose first number equals its `pass` count. Observed: `DALL` `fail 0`, and `scratch/after.txt:13` prints `3/6 copies as expected, 2 reported only, 1 pointer missing \| pass 3 \| reported 2` | Met | - |
| AC-029 | REQ-029 | Given the parent phase map, When rows 7, 14 and 15 are read against their child specs, Then row 7 names why it is open and rows 14 and 15 read Complete | `bash $PL/probe-phase-map.sh` prints no `differs` line for rows 7, 14 and 15. Observed: `scratch/repro-after.txt:119` prints `map=In Progress child=In Progress` for row 7, and `scratch/repro-after.txt:126` and `scratch/repro-after.txt:127` print `map=Complete child=Complete` for rows 14 and 15, none marked `differs` | Met | - |
| AC-030 | REQ-030 | Given the routing-accuracy README, When it is read, Then it names `untrusted_checkout`, `trustedCheckout`, the g2 arm rule with `mixed_row_arms`, the recorded `fixture` and the cost script's child flag | The T019, T020 and T021 `rg` checks print what they name. Observed: the sentences sit at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:82`, line 102 and lines 115 to 116, and close-out reruns count `untrusted_checkout` 1, `trustedCheckout` 1, `mixed_row_arms` 2, `folder its prompt named` 1 and `rather than the child form` 1 | Met | - |

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

**Closeable:** Yes

All 30 rows are `Met`. Each Verification cell names the record line or the close-out rerun it was observed in. The phase is built on base commit `ec1869dae8` and is not committed yet.
<!-- /ANCHOR:closure -->
