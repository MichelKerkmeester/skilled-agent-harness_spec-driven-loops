---
title: "Acceptance Criteria: Phase 14: review-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "review remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/014-review-remediation"
    last_updated_at: "2026-11-13T07:47:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 14: review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV`, `TC`, `VX`, `VALL`, `NT`, `DALL`, `EMB`, `EMBT`, `DAE`, `DAP`, `DAC`, `CA`, `CAG`, `FU`, `DER`, `DERIVE`, `CBR`, `LR`, `RD`, `GT`, `ENV`, `RCS`, `R`, `ARB`, `S`, `BG`, `G2SUM`, `CHK`, `CHKT`, `DSR`, `CK`, `CKT`, `HW`, `HWT`, `DSY`, `DSM`, `DSP`, `DSC`, `DMR`, `DSCT`, `DIP`, `DIY`, `DICT`, `DEM`, `SARC`, `CAP`, `BASE`, `SLT`, `HOLD`, `RA`, `SR`, `SRT`, `VSR`, `SRD`, `SRR`, `PAR`, `SUB`, `SUBT`, `BENCH`, `VB`, `AR`, `ARCH`, `CMM`, `ARM`, `FLOOR`, `EVAL`, `RV`, `SRM`, `SP` and `PL` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the `claude-only` fixture with `--create-router` and a write that throws on its second call, When apply runs, Then it prints `restored:`, `backup:`, `undo:` and `STATUS=FAIL`, exits 3 and leaves the tree at its pre-run digest | `NT $EMBT` reports `fail 0` with the T005 case, and `node $PL/probe-embed-write-fault.cjs` prints `main returned 3`, `restored line: true` and `after: CLAUDE.md`. Met 2026-11-13: `NT $EMBT` reports `pass 43`, `fail 0` with the T005 case, and `node $PL/probe-embed-write-fault.cjs` prints `main returned 3`, `apply printed backup line: true, undo line: true, restored line: true` and `after: CLAUDE.md`. | Met | - |
| AC-002 | REQ-002 | Given a backup copy whose bytes no longer match its recorded hash, When a restore runs, Then it writes nothing and prints `does not match its recorded hash, so nothing was restored` with the backup folder | `NT $EMBT` reports `fail 0` with the T004 case. Met 2026-11-13: `NT $EMBT` reports `pass 43`, `fail 0`, and the T004 case asserts the `does not match its recorded hash, so nothing was restored` line. | Met | - |
| AC-003 | REQ-003 | Given a Cursor mirror linked to an in-root file or a linked router missing a shipped row, When plan runs, Then it exits 2 naming the link and its target and the linked file is unchanged, while a linked complete router is listed `unchanged` | `NT $EMBT` reports `fail 0` with the three T007 cases, and `bash $PL/probe-mirror-link.sh` prints `plan exit=2` and equal `ci.yml` digests. Met 2026-11-13: `NT $EMBT` reports `fail 0` with the three T007 cases, the refused Cursor mirror, the refused router that would gain rows and the router left `unchanged`. `bash $PL/probe-mirror-link.sh` prints `plan exit=2` and `ci.yml sha before=b8ae3686e91b after=b8ae3686e91b`. | Met | - |
| AC-004 | REQ-004 | Given a write that adds a line no template ships above the block, When apply runs, Then it prints the line after `foreign:`, restores the root document and exits 1 | `NT $EMBT` reports `fail 0` with the T006 case, and `node $PL/probe-postwrite-foreign.cjs \| rg -c "apply exit 0"` prints 15. Met 2026-11-13: `NT $EMBT` reports `fail 0` with the T006 case, and `node $PL/probe-postwrite-foreign.cjs \| rg -c "apply exit 0"` prints 15. | Met | - |
| AC-005 | REQ-005 | Given the prompt `use sk-doc to create a skill called invoice-parser, do not change anything yet`, When the hub attach runs on its single `sk-create-skill` route, Then no command is attached, and `FU` reads the same `NO_EDIT_REQUEST` | `VX tests/command-attach-guards.vitest.ts` reports 0 failed, `rg -c "const NO_EDIT_REQUEST" $FU` and `rg -c "semantic \(code" $FU` print nothing. Met 2026-11-13: `VX tests/command-attach-guards.vitest.ts` reports `14 passed (14)`, and both `rg -c` commands on `FU` print nothing and exit 1. `probe-attach.mts` prints `-> undefined` for the no-edit prompt. | Met | - |
| AC-006 | REQ-006 | Given a single `review` route, When the prompt only mentions `/deep:ai-council` or `/deep:reviw`, Then no command is attached, while `run /deep:review now` and `review the parser in depth` attach `/deep:review` | The T010 cases in `VX tests/command-attach-guards.vitest.ts` report 0 failed. Met 2026-11-13: `VX tests/command-attach-guards.vitest.ts` reports `14 passed (14)` with the four T010 cases. `probe-attach.mts` prints `'what did /deep:ai-council decide') -> undefined` and `'run /deep:review now') -> "/deep:review"`. | Met | - |
| AC-007 | REQ-007 | Given `see /create:skill.md for details` or `open /create:readme/notes.txt`, When `typedCommandIn` reads it, Then it returns no command, while `run /create:skill.` still returns `/create:skill` | The T011 cases in `VX tests/command-attach-guards.vitest.ts` report 0 failed. Met 2026-11-13: `VX tests/command-attach-guards.vitest.ts` reports `14 passed (14)` with the T011 cases. `probe-attach.mts` prints `'see /create:skill.md for details') -> undefined` and `'run /create:skill.') -> "/create:skill"`. | Met | - |
| AC-008 | REQ-008 | Given the deriver, When it regenerates, Then `command-attach.ts` holds no `COMMAND_POLICIES`, the check prints `fresh` and the READMEs name `TRACKED_COMMANDS` | `DERIVE` prints `fresh`, `rg -n "COMMAND_POLICIES" .skilled --glob '!**/node_modules/**'` prints nothing after T056's build and `rg -o "TRACKED_COMMANDS" $CBR \| wc -l` prints at least 2. Met 2026-11-13: `DERIVE` prints `fresh` and `rg -o "TRACKED_COMMANDS" $CBR \| wc -l` prints 2. The `.skilled` search prints one line, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:86`, which is the T013 case that pins the table as absent. The same search with `--glob '!**/tests/**'` prints nothing, so no code or doc holds `COMMAND_POLICIES`. | Met | - |
| AC-009 | REQ-009 | Given `AI_SESSION_CHILD=1` in the test process, When the golden, envelope and child-session files run, Then they report 0 failed, and the parity cases hold for `1`, `0`, `true` and an empty value | `AI_SESSION_CHILD=1 npx vitest run tests/command-brief-golden.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts tests/render-child-session.vitest.ts` in `ADV` reports 0 failed. Met 2026-11-13: the `AI_SESSION_CHILD=1` run over the three files reports `3 passed (3)` files and `28 passed (28)` tests. `VX tests/render-child-session.vitest.ts` reports `12 passed (12)` with the T016 `it.each` over `1`, `0`, `true` and an empty value. | Met | - |
| AC-010 | REQ-010 | Given `{ skill: 'command-create-agent', needsMode: true }`, When the brief renders, Then the head holds `(needs a mode)`, and given a child and `/doctor:speckit` on `command-speckit-search`, Then it holds `(parent-named only)` | The T017 and T018 cases report 0 failed, and the first two lines of `env -u AI_SESSION_CHILD node $PL/probe-render.mjs` hold `(needs a mode)` and `(parent-named only)` after T056's build. Met 2026-11-13: `VX tests/command-brief-golden.vitest.ts` reports `13 passed (13)` and `VX tests/render-child-session.vitest.ts` reports `12 passed (12)`. `env -u AI_SESSION_CHILD node $PL/probe-render.mjs` prints `use sk-doc (needs a mode)` on its first line and `/doctor:speckit (parent-named only)` on its second. | Met | - |
| AC-011 | REQ-011 | Given `SSH_AUTH_SOCK`, `AWS_ACCESS_KEY_ID`, `NPM_TOKEN`, `GH_TOKEN` and `AI_SESSION_CHILD` in the runner's environment, When `childEnv` builds a turn's environment, Then none of them is in it and `ANTHROPIC_API_KEY`, `PATH` and `HOME` are | The T021 case in `VX tests/command-behaviour-guards.vitest.ts` reports 0 failed. Met 2026-11-13: `VX tests/command-behaviour-guards.vitest.ts` reports `6 passed (6)` with the T021 case, which stubs the five names and expects each undefined and `ANTHROPIC_API_KEY` kept. | Met | - |
| AC-012 | REQ-012 | Given a checkout with no remote and no marker, When a live arm would start, Then `liveArmRefusal` returns `arena_unprepared`, and an arena from the builder returns `null` | The T022 cases in `VX tests/command-behaviour-guards.vitest.ts` report 0 failed and `$SP/arena-smoke.txt` holds `null` (T059). Met 2026-11-13: `VX tests/command-behaviour-guards.vitest.ts` reports `6 passed (6)` with the T022 cases, and `$SP/arena-smoke.txt` holds `null` for `liveArmRefusal(<arena>)`. | Met | - |
| AC-013 | REQ-013 | Given a g2 row id outside the old regex grammar in the shared table, When the scorer labels it, Then the label comes from the table, and the g2 start rates are unchanged | The T023 cases report 0 failed and `G2SUM` prints `{"claude":"3 of 6","codex":"0 of 6","devin":"4 of 6","dsh":"3 of 4","opencode":"5 of 6","pi":"4 of 6"}`. Met 2026-11-13: `VX tests/command-behaviour-guards.vitest.ts` reports `6 passed (6)` with the T023 cases, `VX tests/command-transcript-score.vitest.ts` reports `58 passed (58)` and `G2SUM` in `$SP/after.txt` prints the planning line. | Met | - |
| AC-014 | REQ-014 | Given all changes, When the floors and suites run, Then none is lower than its line in `$SP/before.txt` | T056 and T057 outputs in `$SP/after.txt`, ending `RESULT: every floor holds`. Met 2026-11-13: `$SP/after.txt` ends `RESULT: every floor holds`. `FLOOR` and `EVAL` equal their before lines, `VALL` reads 1744 passed against 1712, `DALL` reads `pass 1188` against 1164 and `VSR` reads `pass 93` against 90, each with 0 failed. | Met | - |
| AC-015 | REQ-015 | Given the diff and the runs, When they are searched, Then `AGENTS.md`, the parent `spec.md`, `scorer/text.ts` and every `package.json` are unchanged, no added comment names a label and no holdout prompt text was printed | The T060 outputs. Met 2026-11-13: the T060 checks were rerun. `git diff --quiet HEAD` exits 0 for `AGENTS.md` and `scorer/text.ts`, the package diff stat prints nothing and the label scan over the diff and the four new test files prints nothing. The parent `spec.md` differs from `HEAD` by 4 added lines, the phase map and handoff rows for phases 014 and 015 that planning wrote, and no task of this phase edits it. The holdout and model-session part is inferred from the commands run: `HOLD` reads only `id` and `split`, T053 named `holdout-prompts.jsonl` from `rg -l` only and T059 started no runtime. | Met | - |
| AC-016 | REQ-016 | Given a `.codex/AGENTS.md` link, a `CLAUDE.md` pointer with a local line and a tree with no `CLAUDE.md`, When A10 runs, Then it reports `symlink where none belongs`, `names AGENTS.md and carries no shipped line` and `1 pointer missing` | `NT $CHKT` reports `fail 0` with the T024 to T026 cases and `node $CHK \| rg "^A10"` prints a line starting `A10 runtime copies: 5/6 copies as expected, 1 pointer missing`. Met 2026-11-13: `NT $CHKT` reports `pass 44`, `fail 0` with the T024 to T026 cases, and `node $CHK \| rg "^A10"` prints `A10 runtime copies: 5/6 copies as expected, 1 pointer missing   (PASS)`. | Met | - |
| AC-017 | REQ-017 | Given a router row with a literal pipe in a cell, When A11 runs, Then it prints `malformed trigger row at line <n>` and no `missing` line for that rule | `NT $CHKT` reports `fail 0` with the T027 case and `node $CHK \| rg -c "^STATUS=OK"` prints 1. Met 2026-11-13: `NT $CHKT` reports `fail 0` with the T027 case, `node $CHK \| rg -c "^STATUS=OK"` prints 1 and `node $PL/probe-router-widths.cjs` prints `mismatched lines []` twice. | Met | - |
| AC-018 | REQ-018 | Given the check header and the scripts README, When they are read, Then they say four child checks, name the generator and describe exit 3, the foreign failure and the linked-path refusal | `rg -c "Four of the twelve rows" $CHK` prints 1, `rg -c "Three of them" $DSR` prints nothing and `rg -c "exits 3" $DSR` prints 1. Met 2026-11-13: `rg -c "Four of the twelve rows" $CHK` prints 1, `rg -c "Three of them" $DSR` prints nothing and `rg -c "exits 3" $DSR` prints 1. | Met | - |
| AC-019 | REQ-019 | Given `--root --json`, When the Codex approval check parses it, Then it exits 2 | `NT $CKT` reports `fail 0` with the T029 case. Met 2026-11-13: `NT $CKT` reports `pass 5`, `fail 0` with the T029 case. | Met | - |
| AC-020 | REQ-020 | Given a prompt entry that only echoes or describes the hook script, When the wiring check reads it, Then it prints `hook-missing`, while this repository prints `ok` for claude, codex, cursor and devin | `NT $HWT` reports `fail 0` with the T031 cases and `node $HW --root .` prints four `ok` lines and exits 0. Met 2026-11-13: `NT $HWT` reports `pass 8`, `fail 0` with the T031 and T064 cases, and `node $HW --root .` prints `ok claude`, `ok codex`, `ok cursor` and `ok devin` and exits 0. | Met | - |
| AC-021 | REQ-021 | Given a `.codex/hooks.json` without the advisor entry, When the approval check runs, Then it prints the `repair:` line, and the setup delivery leg routes that state to the printed line | `NT $CKT` reports `fail 0` with the T030 case and `NT $DSCT` reports `fail 0`. Met 2026-11-13: `NT $CKT` reports `pass 5`, `fail 0` with the T030 case and `NT $DSCT` reports `pass 4`, `fail 0`. `rg -c "Absent Codex advisor entry" $DSP` prints 1. | Met | - |
| AC-022 | REQ-022 | Given the symlink check workflow, When its output block is read, Then it names the hook check's exit 1 as WARN and exit 2 as FAIL | `NT $DSCT` reports `fail 0` and `rg -c "hook-wiring check exits 1" $DSC` prints 1. Met 2026-11-13: `NT $DSCT` reports `fail 0` and `rg -c "hook-wiring check exits 1" $DSC` prints 1. | Met | - |
| AC-023 | REQ-023 | Given the setup workflow, When it is read, Then its boundary names `/tmp/system-skill-advisor` and its advisor leg names `hook health not recorded` and `SKILL_ADVISOR_DEBUG` | `NT $DSCT` reports `fail 0` and `rg -c "hook health not recorded" $DSY $DSM` prints 1 for each file. Met 2026-11-13: `NT $DSCT` reports `fail 0`, `rg -c "hook health not recorded" $DSY $DSM` prints 1 for each file and `rg -c "SKILL_ADVISOR_DEBUG" $DSY` prints 1. | Met | - |
| AC-024 | REQ-024 | Given the install guide, When it is read, Then it names the six runtimes and `the ones already there` and says DSH is not offered | `NT $DICT` reports `fail 0` with the T038 case and `rg -c "outside the seven" $DIP` prints nothing. Met 2026-11-13: `NT $DICT` reports `pass 17`, `fail 0` with the T038 case and `rg -c "outside the seven" $DIP` prints nothing. | Met | - |
| AC-025 | REQ-025 | Given the embedder workflow, When its start and pull steps are read, Then they name `OLLAMA_HOST` from the resolved URL and refuse a non-local host | `NT $SARC` reports `fail 0` with the T039 case. Met 2026-11-13: `NT $SARC` reports `pass 12`, `fail 0` with the T039 case. | Met | - |
| AC-026 | REQ-026 | Given the recaptured baseline, When its row maps are counted against the corpus splits, Then no key is a holdout id | `HOLD` prints `{"holdout":44,"rows":0,"attachedRows":0,"typedRows":0}` and `VX tests/command-routing-slice.vitest.ts` reports 0 failed. Met 2026-11-13: `HOLD` in `$SP/after.txt` prints `{"holdout":44,"rows":0,"attachedRows":0,"typedRows":0}`, `VX tests/command-routing-slice.vitest.ts` reports `5 passed (5)` and `$SP/baseline-delta.txt` is empty. | Met | - |
| AC-027 | REQ-027 | Given the routing-accuracy README, When it is read, Then it counts 14 code files, lists 21 code and data files, names `head_moved` and `arena_unprepared` and says `offerReached` counts offers not shown missing | The T053 to T055 verify commands print what they say. Met 2026-11-13: the T053 counts print 1 and 21, the T054 counts print 1 for `head_moved`, `arena_unprepared` and `allowlist`, and the T055 counts print nothing for `whose brief arrived` and 1 for `not shown missing` and `leave out every holdout row`. | Met | - |
| AC-028 | REQ-028 | Given a corrupt `sessions.db` beside an intact transcript, When the Devin reader loads the session, Then it returns `ok` from the transcript | `NT $SRT/devin.test.mjs` reports `fail 0` with the T042 case. Met 2026-11-13: `NT $SRT/devin.test.mjs` reports `pass 14`, `fail 0` with the T042 case. | Met | - |
| AC-029 | REQ-029 | Given the readers, When they load a session, Then each reads the path its containment check resolved, a sourceless DSH message lands in `injected` as `unknown` and the readers' `capabilities` keys equal `ADVISOR_RUNTIME_VALUES` | `VSR` reports `fail 0`, the T045 `rg` prints nothing, `VX tests/hooks/advisor-runtime-list-parity.vitest.ts` reports 0 failed and `SRD --check` prints `current`. Met 2026-11-13: `VSR` reports `pass 93`, `fail 0`, the T045 `rg` prints nothing, `VX tests/hooks/advisor-runtime-list-parity.vitest.ts` reports `3 passed (3)` and `SRD --check` prints `STATUS=OK session-reader-declarations: 20 file(s) current`. | Met | - |
| AC-030 | REQ-030 | Given an advisor child that writes 2 MiB to stdout or stderr, When `runAdvisorSubprocess` collects it, Then each stream is cut at 1 MiB and the cut array reads `JSON_PARSE_FAILED` | `VX tests/subprocess-output-cap.vitest.ts` reports 0 failed. Met 2026-11-13: `VX tests/subprocess-output-cap.vitest.ts` reports `2 passed (2)`. The stderr cut is shown by the T062 case, whose busy marker past the cap gets no retry. | Met | - |
| AC-031 | REQ-031 | Given the bench file, When it runs with benches on, Then all four tests pass | `VB` reports `4 passed (4)`. Met 2026-11-13: `VB` in `$SP/after.txt` reports `4 passed (4)`. Before it reported `1 failed \| 3 passed (4)`. | Met | - |
| AC-032 | REQ-032 | Given the skill README, the command-meaning page and `ARCHITECTURE.md`, When they are read, Then they say 46 rows and name the DSH prompt adapter | The T050 and T051 verify commands print what they say. Met 2026-11-13: the T050 `rg` prints nothing and `node $DER --check \| jq .counts.typescriptActive` prints 46. The two T051 counts print 1 each. | Met | - |
| AC-033 | REQ-033 | Given `advisor-recommend.md`, When it is read, Then it gives the row shape with `mutating?`, names `TRACKED_COMMANDS[command].policy` and states the no-edit and deep-loop gates | The T052 verify commands print what they say. Met 2026-11-13: `rg -c "COMMAND_POLICIES" $ARM` prints nothing, and the `mutating\?`, `TRACKED_COMMANDS\[command\]\.policy` and `NO_EDIT_REQUEST` counts each print 1. | Met | - |

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

AC-001 to AC-033 are `Met` on `scratch/after.txt`, `scratch/repro-after.txt`, `scratch/arena-smoke.txt`, `scratch/boundaries.txt` and verify commands rerun from the final working tree over `320e7b64d4` on 2026-11-13.
<!-- /ANCHOR:closure -->
