---
title: "Tasks: Phase 5: chat-question-detection"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "chat question detection tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: chat-question-detection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables: `R` is the repository root. `D` is `$R/.skilled/hooks/decision-capture`. `F` is `$D/bin/fixtures/claude-chat-questions.jsonl`. `T` is `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Skilled`. Every CLI sweep runs with its working directory set to a fresh `mktemp -d` folder, never to a real project.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the test baseline before any edit (`.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs`). Verify: `node --test $D/bin/sweep-transcript.test.mjs` prints `ℹ pass 10` and `ℹ fail 0` and exits 0. Evidence: `node --test` printed `ℹ pass 10` and `ℹ fail 0`, exit 0, before any edit.
- [x] T002 Time the current sweep of the largest baseline transcript (`.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`). Verify: `cd "$(mktemp -d)" && /usr/bin/time -p node $D/bin/sweep-transcript.mjs --transcript $T/dc90f89a-3498-4cd7-9381-9e7dc39789b2.jsonl > /dev/null` prints a `real` line, and that number goes into `goal.md` section 4. Evidence: `real` 0.57 to 0.60 s on 2026-11-01, recorded in goal.md section 4. A same-day rerun of the HEAD sweep on a frozen copy gave 0.53 to 0.54 s on 2026-11-02.
- [x] T003 Build the redacted fixture from the 7 baseline `earlier` pairs, one assistant line and one typed reply each, with paths, names, emails and ids replaced but question wording kept (`.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl`). Verify: `wc -l < $F` prints 14, and `rg -n 'michelkerkmeester|/Users/|@getbarter' $F` prints nothing. Evidence: `wc -l` prints 14 and the `rg` prints nothing, after a home-relative `/Users/operator/...` path in pair 3 was replaced at close-out.
- [x] T004 Write one label per fixture pair: `process` and `answers_earlier` (`.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json`). Verify: `jq '[.[] | select(.process)] | length'` prints 3 and `jq '[.[] | select(.answers_earlier)] | length'` prints 1. Evidence: The two `jq` counts print 3 and 1.
- [x] T005 Run the scratch measurement on the fixture (`scratch/measure-chat-questions.mjs`). Verify: its `TOTAL` row prints `7	0	7	4	1`. Evidence: The measurement on the fixture prints `TOTAL	7	0	7	4	1`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T006 Give `chatSourceKey` an optional fifth segment, appended after a colon only when present (`.skilled/hooks/decision-capture/lib/capture-core.mjs`). Verify: a one-line `node --input-type=module -e` import prints `claude:s:chat:a:u` for four arguments and `claude:s:chat:a:u:pabc` for five. Evidence: The import prints `claude:s:chat:a:u` and `claude:s:chat:a:u:pabc`.
- [x] T007 Add one case for the four- and five-argument key forms (`.skilled/hooks/decision-capture/lib/capture-core.test.mjs`). Verify: `node --test $D/lib/capture-core.test.mjs` prints `ℹ fail 0`. Evidence: `capture-core.test.mjs` passes with the key-form case, fail 0.
- [x] T008 Replace `chatCandidate` with `chatCandidates`: closing paragraph by today's test and key, earlier paragraphs by the asking test with code, quoted spans, blockquotes, table rows and headings removed, plus a following options-only paragraph (`.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`). Verify: new cases show a `?` only in code or quotes in an earlier paragraph gives no candidate, and a question followed by an `A)` to `D)` paragraph gives one candidate holding both paragraphs. Evidence: New cases: a `?` only in code or quotes, in a table row or in a heading gives no candidate, and a question plus an `A)` to `D)` paragraph gives one candidate holding both.
- [x] T009 Key each earlier candidate with `p` plus the first 12 hex digits of SHA-256 of its text, appending `-2` and up for a repeat in one message (`.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`). Verify: a new case sweeps one transcript twice and gets identical keys, and every key matches `^[A-Za-z0-9:._-]+$`. Evidence: Two sweeps of one transcript give identical keys, all matching `^[A-Za-z0-9:._-]+$`, and a repeated paragraph gets the `-2` suffix.
- [x] T010 Run the process filter per candidate, drop consumed keys, rank and cut to 3 per message, and print in message order (`.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`). Verify: a new case with five asking paragraphs gets 3 candidates with the closing one included, and a commit-permission paragraph gets none. Evidence: Five asking paragraphs give 3 in message order with the closing one included, and a commit-and-push paragraph gives none.
- [x] T011 Keep the newest 20 candidates per sweep and add `chat_candidates_dropped` (`.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`). Verify: a new case with 25 answered questions prints 20 candidates and `chat_candidates_dropped: 5`. Evidence: 25 answered questions give 20 candidates and `chat_candidates_dropped: 5`, keeping turns a5 to a24.
- [x] T012 Rewrite the comment above `lastParagraph`, which says earlier paragraphs are only reasoning (`.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`). Verify: `rg -n 'earlier paragraphs are the reasoning' $D/bin/sweep-transcript.mjs` prints nothing. Evidence: The `rg` prints nothing.
- [x] T013 Add a fixture case that asserts 4 candidates, none from a pair labelled `process`, and the 1 pair labelled `answers_earlier` among them (`.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs`). Verify: `node --test $D/bin/sweep-transcript.test.mjs` prints `ℹ fail 0`. Evidence: The fixture case asserts 4 candidates, none from a `process` pair and the `answers_earlier` pair among them; `ℹ fail 0`.
- [x] T014 Add the save-step sentence: several candidates can share one reply, so write an entry only for a question that reply answers (`.skilled/commands/speckit/save.md`). Verify: `rg -c 'share one reply' $R/.skilled/commands/speckit/save.md` prints 1. Evidence: `rg -c` prints 1.
- [x] T015 Copy the same sentence into the OpenCode command, which is a real file and not a symlink (`.opencode/commands/speckit/save.md`). Verify: `rg -c 'share one reply' $R/.opencode/commands/speckit/save.md` prints 1. Evidence: `rg -c` prints 1. `.opencode/commands/speckit` is a symlink to `../../.skilled/commands/speckit`, so the T014 edit covers this file; logged as a deviation in goal.md.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T016 Run the gate on both test files (`.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs`). Verify: `node --test $D/bin/sweep-transcript.test.mjs $D/lib/capture-core.test.mjs` prints `ℹ fail 0`, and `git diff --numstat -- $D/bin/sweep-transcript.test.mjs` shows 0 deleted lines. Evidence: `ℹ pass 43`, `ℹ fail 0` across both files; `git diff --numstat` shows `282	0` for the sweep test file.
- [x] T017 Sweep the fixture through the CLI (`.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl`). Verify: `cd "$(mktemp -d)" && node $D/bin/sweep-transcript.mjs --transcript $F | jq '.chat_candidates | length'` prints 4. Evidence: The command prints 4 (keys from pairs 1, 3, 6 and 7).
- [x] T018 Sweep each of the ten baseline transcripts in its own temporary project and compare the totals with the scratch script run in the same minute (`scratch/measure-chat-questions.mjs`). Verify: the summed `chat_candidates` lengths equal the script's `units` total (24 on 2026-11-01), the closing-paragraph keys equal the pre-change sweep's keys, and no transcript prints more than 20. Evidence: On frozen copies of the spec's ten ids, the summed candidates are 25 and the measurement's units total is 25, matching per file; the 20 closing keys equal the HEAD sweep's 20; the largest per-transcript count is 7. The live list had changed since 2026-11-01, see goal.md.
- [x] T019 Time the largest transcript again (`.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`). Verify: the `real` time from the T002 command is at most 10% above the T002 number. Evidence: 0.55 to 0.57 s against the same-day HEAD 0.53 to 0.54 s, at most 5.6 percent slower, and below the 2026-11-01 T002 figure.
- [x] T020 Run the live re-proof in the series harness (`../006-live-conversation-test/`). Verify: the 006 results matrix has a row for this child where a plain chat question asked mid-message was answered by the orchestrator and offered as 1 chat candidate, with no message above 3. Evidence 2026-11-02: the 006 Claude sibling re-proof passed 7/7 on the mirror root; S5b printed `count_candidates=1 mid_message=1 max_per_message=1`, and S6 recorded the reply as a chat row (`chat_rows=1`). The 006 Re-proof Rows table holds the row.
- [x] T021 Validate this child (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED`, Errors 0, Warnings 0, on 2026-11-02 before the live re-proof. Rerun after T020.
- [x] T022 Move the chat detector into `lib/chat-questions.mjs`, fed by ordered turns, with no change to the Claude sweep's output (ADR-001). Verify: `node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` prints pass 23, fail 0. Evidence 2026-11-02: `lib/chat-questions.mjs` exports `chatCandidatesFromTurns`; `sweep-transcript.test.mjs` pass 23, fail 0.
- [x] T023 Give the Pi sweep chat candidates, with a redacted fixture from the 006 Pi scratch session (`bin/sweep-pi.mjs`). Verify: `node --test .skilled/hooks/decision-capture/bin/sweep-pi.test.mjs` prints fail 0. Evidence 2026-11-02: pass 11, fail 0; the CLI on `bin/fixtures/pi-chat-session.jsonl` prints one `pi:` candidate, "Should the badge blink?" answered "No, keep it static.".
- [x] T024 Give the OpenCode sweep chat candidates, with a redacted fixture from the 006 OpenCode scratch session (`bin/sweep-opencode.mjs`). Verify: `node --test .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs` prints fail 0. Evidence 2026-11-02: pass 10, fail 0; on the full real OpenCode session it recovers 6 tool answers and offers exactly one chat candidate.
- [x] T025 Give the Devin sweep chat candidates, with a redacted fixture from the 006 Devin scratch session (`bin/sweep-devin.mjs`). Verify: `node --test .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs` prints fail 0. Evidence 2026-11-02: pass 8, fail 0; the fixture keeps the real step shapes and says in its description that step 22's text is a stand-in.
- [x] T026 Give the Codex sweep chat candidates, with a redacted fixture built from a real Codex rollout (`bin/sweep-codex.mjs`). Verify: `node --test .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs` prints fail 0. Evidence 2026-11-02: pass 12, fail 0; the fixture keeps five lines of the 003 probe rollout and names its stand-in text under `fixture_note`.
- [x] T027 Say in both copies of `save.md` that every runtime's sweep prints chat candidates. Verify: `rg -c 'empty .chat_candidates.' .skilled/commands/speckit/save.md` prints 0. Evidence 2026-11-02: `rg -c 'empty .chat_candidates.' .skilled/commands/speckit/save.md` prints nothing (0 matches); the feature catalog names the shared detector.
- [x] T028 Rerun the 006 main scenario on Pi, OpenCode and Devin. Verify: each S11 row reads `record_rows=7 repeat=identical`. Evidence 2026-11-02: S11 reads `record_rows=7 repeat=identical` on Pi, OpenCode and Devin, each with one consumed chat key for the S5 answer.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed Evidence: the 006 sibling and Pi, OpenCode and Devin live runs.
- [x] The T017 command prints 4 and the 006 results matrix holds the T020 row. Evidence 2026-11-02: the T017 command prints 4 after the detector moved to `lib/chat-questions.mjs`; 006 re-proof row 005 holds the T020 result.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Live harness**: See `../006-live-conversation-test/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its cause in `goal.md` section 4. T020 may wait on the 006 harness while every other task closes.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-0' spec.md` prints 9. Evidence: The `rg -c` prints 9.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n 'Data Flow' plan.md` prints one line. Evidence: One line.
- [x] CHK-003 [P1] Dependencies identified and available: `ls ../006-live-conversation-test/spec.md` prints the path. Evidence: The path prints.
- [x] CHK-004 [P0] The T001 baseline `ℹ pass 10` and the T002 time are in `goal.md` section 4. Evidence: goal.md section 4 holds the `ℹ pass 10` baseline and the 0.57 to 0.60 s time.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check $D/bin/sweep-transcript.mjs` and `node --check $D/lib/capture-core.mjs` exit 0. Evidence: Both `node --check` runs exit 0.
- [x] CHK-011 [P0] The T016 run prints no warning line on stderr. Evidence: The T016 run writes 0 lines to stderr.
- [x] CHK-012 [P1] An unreadable transcript still exits 1 with an `error` field: the existing CLI case passes. Evidence: The unreadable-transcript CLI case passes.
- [x] CHK-013 [P1] No comment in the changed files cites a spec path, packet number or task id: `rg -n 'specs/|T0[0-9]{2}|REQ-' $D/bin/sweep-transcript.mjs $D/lib/capture-core.mjs` prints nothing. Evidence: The `rg` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` reads `Met`. Evidence 2026-11-02: AC-001 to AC-011 all read Met.
- [x] CHK-021 [P0] The fixture sweep prints 4 candidates (T017) and the baseline totals match the scratch script (T018). Evidence: T017 prints 4; T018 sums 25 against units 25.
- [x] CHK-022 [P1] Edge cases tested: five asking paragraphs give 3, 25 candidates give 20 and `chat_candidates_dropped: 5`, a repeat paragraph gets `-2`. Evidence: The five-paragraph, 25-question and repeated-paragraph cases pass.
- [x] CHK-023 [P1] Error scenarios validated: the unreadable-transcript and torn-line cases pass. Evidence: The unreadable-transcript case and the torn-final-line case pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The one finding, 001 Known Limitation 2, is `algorithmic`. Evidence: Classed `algorithmic`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep: the plan's `rg` for `chatSourceKey|lastParagraph|chat_candidates` lists only the files in its surfaces table. Evidence: The `rg` lists the sweep, its test, capture-core, `save.md` and the OpenCode, Devin, Codex and Pi sweeps. The Codex and Pi sweeps arrived with the sibling Codex and Pi child after this plan was written. Since ADR-001 every sweep feeds the shared detector in `lib/chat-questions.mjs`, so all five print chat candidates (T022 to T026).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests: the writer, both `save.md` copies and the OpenCode and Devin sweeps are named. Evidence: plan.md names the writer, both `save.md` copies and the OpenCode and Devin sweeps; their tests pass unchanged.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases: a `?` in code, in quotes, in a table row, a paragraph split by a run of blank lines and a message with no asking paragraph each have a case. Evidence: Cases cover a `?` in code, in quotes and in a table row, a run of blank lines between paragraphs, a message with no asking paragraph, and malformed turns.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: the six axes in the plan, one row per value. Evidence: plan.md lists the six axes; each value has a test, including options inside the asking paragraph and an unanswered question at the end of the file.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state: the CLI cases run with `cwd` in a temporary folder, so no real queue is read. Evidence: Every CLI case runs with `cwd` set to a temporary project, and the frozen-baseline runs used a fresh `mktemp -d` each.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets: the fixture check in T003 prints nothing. Evidence: The T003 `rg` prints nothing.
- [x] CHK-031 [P0] Input validation implemented: a non-string text block or a missing `uuid` yields no candidate and no throw. Evidence: The malformed-turns case passes: a non-string text block, an assistant turn without `uuid` and a reply without `uuid` each give no candidate and no throw.
- [x] CHK-032 [P1] Auth/authz working correctly: N/A, the sweep reads a local file and calls no service. Evidence: N/A, confirmed: the sweep reads a local file only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: all three name the caps 3 and 20 and the `p` key segment. Evidence: spec REQ-003, plan.md and tasks T009 to T011 name the caps 3 and 20 and the `p` segment.
- [x] CHK-041 [P1] Code comments adequate: T012 done, and the new ranking and key code each carry a comment that says why. Evidence: T012 done; the ranking, key and missing-id code each carry a why comment.
- [x] CHK-042 [P2] README updated (if applicable): N/A, `.skilled/hooks/decision-capture/` has no README. Evidence: N/A, confirmed: the folder has no README.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only: sweep runs use `mktemp -d` folders, and the measurement script stays in this child's `scratch/`. Evidence: Sweep runs used `mktemp -d` folders; frozen copies sat in the session scratchpad, outside the repo.
- [x] CHK-051 [P1] scratch/ cleaned before completion: only `measure-chat-questions.mjs` remains, kept as the baseline's source. Evidence: `scratch/` holds only `measure-chat-questions.mjs`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---
