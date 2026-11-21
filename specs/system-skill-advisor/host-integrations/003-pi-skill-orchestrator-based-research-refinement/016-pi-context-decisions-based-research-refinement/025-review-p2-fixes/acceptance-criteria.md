---
title: "Acceptance Criteria: Fix the ten P2 advisories from the lane removal deep review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review p2 fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes"
    last_updated_at: "2026-11-21T13:34:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-025-review-p2-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Fix the ten P2 advisories from the lane removal deep review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 025-review-p2-fixes
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `HF_EMBED_SERVER_URL` names a real Unix socket in the socket folder, When machine checks run and then apply, Then M4 lists the socket, apply deletes it, and the case asserts machine exit 1 before apply and 0 after | `VITEST -t 'probes and deletes the socket file'` exits 0 on the fixed source, and the socket is bound with `net.createServer().listen` in a short temp folder. Observed: the case `probes and deletes the socket file a custom server address names, beside the fixed names` binds a real socket with `net.createServer().listen` in a `makeShortTempDir` folder and asserts `isSocket()`; `VITEST -t 'probes and deletes the socket file'` exit 0 with 1 passed; it asserts machine exit 1 (`expect(machine.exitCode).toBe(1)`) and apply exit 0, and M4 and apply both list `custom.sock` beside the fixed names | Met | - |
| AC-002 | REQ-001 | Given `HF_EMBED_SERVER_URL` names a regular text file in the socket folder, When machine checks run and then apply, Then the file is neither listed nor deleted, a note names it, and machine mode exits 0 | The new regular-file case fails on `bf3bca7a8b1` (it lists and deletes the file) and passes after the fix. Observed: the case `keeps a regular file a custom server address names in the socket folder, and notes it` failed on the unfixed tool, where M4 listed the file and its folder, and passes after the fix; it asserts M4 absent with one note naming the file, machine exit 0, the file and folder kept after apply, and no action on either | Met | - |
| AC-003 | REQ-002 | Given a dotenv file with one line the parser rejects and one lane key on another line, When M7 runs, Then its note names the file, its status stays FOUND, and no value appears in the output | The new dotenv case passes; before the fix it has no note. Observed: the case `notes a dotenv file with a line the parser rejects, keeps the key it found and prints neither line` passes; on the unfixed tool it failed with `expected [] to deeply equal [ StringContaining{…} ]`; it asserts status `found`, the one key, the note and that neither the line's text nor the value prints | Met | - |
| AC-004 | REQ-003 | Given the command `node /Users/x/My Repo/.skilled/bin/hf-model-server.cjs`, When `runsModelServer` is called, Then it returns true | The measured command in spec.md prints `true true` after the fix; before the fix it prints `false true`. Observed: after the fix the measured command printed `true true`; on the unfixed tool the spaced row of the `reads the server script from the whole command line: %s` table returned false | Met | - |
| AC-005 | REQ-003 | Given `node other.js /path/hf-model-server.cjs`, `node /x/My Repo/y.js /p/hf-model-server.cjs` and `node /x/xhf-model-server.cjs`, When `runsModelServer` is called, Then each returns false, and the ownership cases still pass | The script-match table in the Vitest file passes. Observed: the three false rows of the `reads the server script from the whole command line: %s` table pass, and the ownership cases `owns node running this checkout's script as its first script argument, and nothing else`, `lists node running any checkout's server script, never a shell or pager that only names it` and `exits 0 when the only processes merely name the server script` pass | Met | - |
| AC-006 | REQ-004 | Given the fixes are in place, When the Vitest file runs from `runtime/cli` with the `cli` project, Then it prints no failed test and exits 0 | `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts` exits 0. Observed: exit 0 with `Tests 106 passed (106)` after the follow-up review fixes (103 after the independent review fix), against 92 at baseline | Met | - |
| AC-007 | REQ-004 | Given the fixes are in place, When `node --test` runs the gate test, Then it exits 0 | `node --test .skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` exits 0. Observed: exit 0 with `tests 2`, `pass 2`, `fail 0` | Met | - |
| AC-008 | REQ-004 | Given the trigger index is regenerated, When repo mode runs on this checkout, Then it exits 0 with 47 of 47 allowlist rows matched | `sweep-lane-residue.mjs repo --json` exits 0 and reports `allowlistRowsMatched` 47 of 47. Observed: exit 0 after the regeneration with `allowlistRowsMatched` 47 of `allowlistRows` 47 and `live` 0 | Met | - |
| AC-009 | REQ-004 | Given the planted-term fixture, When the gate test runs its case, Then the fixture run exits 1 | The case `a lane term planted in a tracked file fails repo mode` passes in the gate test. Observed: the case passed in the gate run, which exit 0 | Met | - |
| AC-010 | REQ-004 | Given a fixture with one finding, When machine mode runs, apply runs, and machine mode runs again, Then the exit goes from 1 to 0 | The assertion in the real-socket case passes. Observed: the case `probes and deletes the socket file a custom server address names, beside the fixed names` asserts machine exit 1 (`expect(machine.exitCode).toBe(1)`) before apply and exit 0 after, and passes | Met | - |
| AC-011 | REQ-004 | Given the 024 parent and its eight phases, When strict validation runs recursively with auto-repair off, Then it prints `RESULT: PASSED` | `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <024> --recursive --strict` prints `RESULT: PASSED`. Observed: `RESULT: PASSED` for the parent and all eight children, exit 0 | Met | - |
| AC-012 | REQ-004 | Given this packet's documents, When strict validation runs, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <025> --strict` prints `RESULT: PASSED`. Observed: `RESULT: PASSED`, exit 0 | Met | - |
| AC-013 | REQ-004 | Given the 016 parent and its phase map, When strict validation runs with auto-repair off, Then it prints `RESULT: PASSED` | `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <016> --strict` prints `RESULT: PASSED`. Observed: `RESULT: PASSED` for 016 and each child, exit 0 | Met | - |
| AC-014 | REQ-004 | Given every packet and tool edit is done, When the trigger index generator runs, Then it exits 0 and no packet or tool file changes after it | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` exits 0, and the modification times of the edited files precede it. Observed: the generator exit 0 as the last write, and `git status` after it shows no further packet or tool change | Met | - |
| AC-015 | REQ-005 | Given the three every-push sites, When they are read, Then each says the gate runs on every pull request and on pushes to `main` and `skilled/**`, and the trigger lines are unchanged | `rg -n 'every push'` prints no line in the workflow comment, the catalog page or 024 `008` plan.md, and `git diff` on the workflow touches comment lines only. Observed: `rg -n -i 'every push'` prints no line in the workflow, the catalog page or 024 `008` plan.md; the workflow diff changes comment lines 23 to 25 only | Met | - |
| AC-016 | REQ-006 | Given the catalog page and the tool header, When they are read, Then each states that an exact-path allowlist row exempts the whole file, and the new sentences hold no identifier or prose term | `rg -n 'whole file'` prints one line in each file, and the term check in T014 prints no hit. Observed: `rg -n 'whole file'` prints catalog line 27 and tool line 36, one each; the T014 check printed `hits=0` | Met | - |
| AC-017 | REQ-007 | Given the allowlist reasons, When they are read, Then none cites a line number and all 47 paths are unchanged | `rg -n '[Ll]ines? [0-9]' ALLOW` prints no line, and repo mode still matches 47 of 47 (AC-008). Observed: the `rg` printed no line; the 47 paths are unchanged in order; repo mode matches 47 of 47 | Met | - |
| AC-018 | REQ-008 | Given the 024 parent goal, When criteria are ticked and the log is appended, Then each tick cites its check, and the new progress row is written through `goal.cjs packet-log` | `rg -n 'Complete'` in the 024 progress log shows the new row, and `git diff` on the goal shows additions only. Observed: `git show 1d1bfadab67` on the goal ticks all five criteria and adds two log rows. The `Phases 001 to 008` row cites the checks for criteria 1, 2, 3 and 5 and says criterion 4 is open. The later `Criterion 4` row reads Complete, resting on the C-08 and BAT-01 dispositions in `008-cleanup-wiring-and-gating/implementation-summary.md`. The log is append-only, so the later row supersedes the earlier. Criterion 4 is ticked on those two dispositions, not fixes, and its "fixed and committed" text was not amended. Besides the two rows, the five ticks are the only changed lines. The first row went through `goal.cjs packet-log`, and how the second was written is not recorded | Met | - |
| AC-019 | REQ-009 | Given phase 005 T053 and AC-014, When they close, Then the typecheck and shared tests exit 0 and the absence checks print `No such file` twice, and the operator's `npm ci` exit status is cited from the operator's report | G10 commands exit 0; the `ls` check prints two `No such file` lines; phase commit `1f85a9dd6dd` exists. Observed: G10 typechecks exit 0 and the shared tests exit 0 with 9 of 9; the `ls` check printed two `No such file` lines; `git cat-file -t 1f85a9dd6dd` prints `commit`; the `npm ci` exit status is the conducting session's report | Met | - |
| AC-020 | REQ-009 | Given phase 005 closes, When its documents and the parents are read, Then each status field reads Complete, and the 016 row 24 reads Complete | `rg -n 'Blocked|Unmet|not committed'` shows no status field left in the 005 documents, and `rg -n '^\| 24 \|' ../spec.md` shows Complete. Observed: the 005 `rg` leaves only the notation row, the AC legend, the dependency table's Impact-if-Blocked text and the superseded log row 78; the 005 and 024 status fields and 016 row 24 read Complete | Met | - |
| AC-021 | REQ-010 | Given the 23 checked CHK rows in 001 and 006, When they are read, Then each carries an Evidence clause that names a file line or a command, and CHK-022 and CHK-023 cite the Vitest cases that back them | The count of checked rows with an Evidence clause equals the count of checked rows in both files. Observed: 001 has 34 of 34 checked CHK rows with Evidence and 006 has 35 of 35; CHK-022 cites `exits 0 for a repository with no tracked files` and `exits 0 when the only hit is allowlisted by its exact path`, and CHK-023 cites `exits 2 when git cannot be found` and the `refuses %s` table, each with its line number at `bf3bca7a8b1` (`:514`, `:497`, `:529`, `:404`) | Met | - |
| AC-022 | REQ-011 | Given the 016 phase map, When it is read, Then row 25 names `025-review-p2-fixes` beside rows 23 and 24 | `rg -n '025-review-p2-fixes' ../spec.md` prints one line. Observed: `rg -n '025-review-p2-fixes' ../spec.md` prints line 161 only | Met | - |
| AC-023 | REQ-004 | Given the tool and its test, When the comment-hygiene check runs, Then no finding id, packet number or test id appears in a code comment or a test name | `rg -n -e 'R[0-9]+-P2-' -e 'SL4-00' -e '025-review'` on the tool and the test prints no line. Observed: the `rg` printed no line (exit 1) | Met | - |
| AC-024 | REQ-012 | Given the fixes are in place, When the follow-up `/deep:review` on the native executor replays them, Then its report records a verdict and states SL4-005's disposition | The review's report names the verdict and SL4-005's disposition | Unmet | - |

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

**Closeable:** No

No. AC-001 to AC-023 are Met: the three fixes landed with their tests, and every gate in plan.md section 5 except G12 passed on the tree of `1d1bfadab67`. After the follow-up review fixes, G1, G3, G7 and G11 were rerun and pass. AC-024 stays Unmet until the follow-up `/deep:review` records a verdict and decides SL4-005.
<!-- /ANCHOR:closure -->
