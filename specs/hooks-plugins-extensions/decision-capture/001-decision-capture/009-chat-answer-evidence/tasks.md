---
title: "Tasks: Phase 9: chat-answer-evidence"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "chat answer evidence tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: chat-answer-evidence

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`$DC` is `.skilled/hooks/decision-capture`. `$F` is `$DC/bin/fixtures/claude-chat-questions.jsonl`. `$SP` is a scratch project outside this repository, set up like 006's mirror root, holding a scratch packet with an empty `decision-record.md`.

The scratch check, run after each scripted save: `printf 'chat_rows=%s pair6=%s\n' "$(rg -c 'source: claude:fixture-session:chat:' $SP/<packet>/decision-record.md || echo 0)" "$(rg -c 'source: claude:fixture-session:chat:fixture-a6:fixture-u6' $SP/<packet>/decision-record.md || echo 0)"`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm 008 has closed (`../008-project-scoped-state/acceptance-criteria.md`). Verify: `rg -c '\| Unmet \|' ../008-project-scoped-state/acceptance-criteria.md` prints nothing. Evidence: rerun 2026-11-03, `rg -c` printed nothing, exit 1; line 90 reads `**Closeable:** Yes`; 008's `validate.sh --strict` printed RESULT: PASSED, per its AC-012.
- [x] T002 Record the code baselines (`spec.md` Measured Behavior, `goal.md` §4). Verify: the Measured Behavior detector command prints `false` four times; `node --test $DC/{lib,bin,claude,devin}/*.test.mjs` reports `pass 107 fail 0`; the timing command prints a `real` line. Evidence: the detector printed `false` four times before the change and the hooks suites `pass 107 fail 0` (planner, `spec.md` Measured Behavior). No timing line was recorded before the change; T013 measured the pre-change detector side by side instead.
- [x] T003 Run three baseline scripted saves of the fixture on the pre-change code (`$SP`). Verify: after each, the scratch check prints `chat_rows=<n> pair6=<0|1>`. Evidence: four runs with the session-scratchpad harness `scripted-save.sh` (a `mktemp` project, the real sweep, a headless `claude -p` given `save.md`'s chat rule, then `generate-context.js --full-auto`). The model chose exactly one entry, pair 6, every time. Three runs printed `chat_rows=1 pair6=1`; one run's writer failed inside `withWorkflowRunLock` after the model's correct choice, a harness flake, and printed `chat_rows=0` with `entries=1` for pair 6.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the frozen lexicon constants and `answerEvidence(question, options, answer)`, and attach `evidence` to each candidate in `chatCandidates` (`$DC/lib/chat-questions.mjs`). Verify: the Measured Behavior detector command prints `true` four times, and `rg -n 'IMPERATIVE_VERBS|SHIFT_PHRASES|STOPWORDS'` prints the three constants. Evidence: rerun 2026-11-03, the detector prints `true` on all four candidates with `evidence` as the last key; `rg` prints lines 44, 65 and 81 for the three constants. Built by `llmgateway/deepseek-v4.1-flash-1017` at max through cli-pi, the D6 fallback, because `gpt-6-luna` hit its usage limit. A check script reproduced all ten expected rows of `plan.md` §3, failures 0; the worker first got pair 3 wrong until `use` was treated as a choice verb, as the plan's STOPWORDS already lists.
- [x] T005 Add `evidence` to the two whole-object assertions (`$DC/lib/chat-questions.test.mjs`, `$DC/bin/sweep-transcript.test.mjs`). Verify: both files pass under `node --test`, and no other assertion was edited. Evidence: both pass; `git diff HEAD -U0` over the two files removes one line only, an import widened to add `answerEvidence`.
- [x] T006 Add one unit case per field and per edge case in `plan.md` §3 (`$DC/lib/chat-questions.test.mjs`). Verify: the file passes, and with the `analy*` stem removed the `Analyxe` case fails. Evidence: seven new cases (topic shift with a new-task verb, `make it blue`, `use the darker one`, `First, make it blue`, `Push it`, `Yes`, null answer) pass. `Analyxe` is fixture pair 1, asserted in `sweep-transcript.test.mjs`, not a unit case in this file. With the stem removed in a scratch copy, that fixture test failed: pass 35, fail 1.
- [x] T007 Assert each fixture candidate's evidence against the plan table (`$DC/bin/sweep-transcript.test.mjs`). Verify: the test passes, and changing pair 6's expected `contentOverlap` to 0 makes it fail. Evidence: passes; in a scratch copy with line 688 set to `contentOverlap: 0` the file printed pass 25, fail 1.
- [x] T008 [P] Grow the labelled set (`$DC/bin/fixtures/claude-chat-answers-extended.jsonl`, `.labels.json`). Verify: `jq 'length'` prints 12 or more and the positives count 5 or more. Evidence: `jq` prints 14 and 9. Every pair is synthetic; the nine positives cover `yes_no`, `alternative`, `open_value` and `numbered_list`. The shape test `the extended Claude chat fixture yields one candidate per labelled pair` passes.
- [x] T009 Rewrite the chat rule (`.skilled/commands/speckit/save.md`, step 3). Verify: `rg -n 'clearly replies'` prints nothing, and each field name and `Evidence:` counts 1 or more. Evidence: `rg -n 'clearly replies'` prints nothing, exit 1; per-term counts are questionType 2, optionMatch 3, contentOverlap 2, imperativeOpening 2, topicShift 2, `Evidence:` 2. Line 75 says the evidence informs the judgment and never replaces it. Line 80 reconciles the old omit-why line: a pending answer still omits `why`, and a chat entry with no stated reason writes `Not stated.` then the `Evidence:` sentence.
- [x] T010 [P] Describe the evidence object and the `why` sentence (`.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md`). Verify: `rg -n 'evidence'` prints the new lines, one of which says no candidate is accepted or rejected by code. Evidence: line 41 names the five signals, says no candidate is accepted or rejected by code, and names the `Evidence:` sentence; line 63 names the evidence object in the file table.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun every decision-capture suite. Verify: the hooks suites report `fail 0` with more than 107 tests; the Pi vitest and the OpenCode plugin test report no failure. Evidence: rerun 2026-11-03, hooks `tests 119, pass 119, fail 0`, exit 0; Pi vitest `Tests 10 passed (10)`, exit 0; OpenCode plugin `tests 6, pass 6, fail 0`, exit 0.
- [x] T012 Run three scripted saves of the fixture on the changed code (`$SP`). Verify: each run's scratch check prints `chat_rows=1 pair6=1`, and the record holds the `Evidence:` sentence. Evidence: three runs each printed `save_exit=0` and `chat_rows=1 pair6=1 entries=1`, and each model entry's `why` read `Not stated. Evidence: numbered_list, option not_applicable, overlap 3, imperative false, shift false.` Those three runs counted record rows by key but did not grep the `why` in the record, so a fourth run added that grep: `chat_rows=1 pair6=1 entries=1`, and `rg -n` on the written `decision-record.md` printed row Q009, line 259, whose why cell is that sentence.
- [x] T013 Recheck the sweep time and the key invariant. Verify: the timing command prints a `real` within 10% of the baseline, and two sweeps print byte-identical output. Evidence: no baseline was in `goal.md` §4, so from a fresh `mktemp -d` six alternating runs timed the pre-change detector (a scratch copy with `chat-questions.mjs` from HEAD) against the changed one: every run printed `real 0.04` on both sides. `/usr/bin/time -p` resolves 0.01 s, so a difference under 10 ms cannot be seen. Two sweeps of `$F` were byte-identical by `cmp`, 4079 bytes each, with `evidence` on all four candidates; the pre-change copy printed it on none.
- [x] T014 Confirm nothing touched this repository's state (parent goal D4). Verify: `git status --short .skilled/skills/.state/decision-capture` prints nothing, and `git status --short specs` lists only this packet's files. Evidence: the verify does not hold as written. The first command prints ` M .skilled/skills/.state/decision-capture/README.md`, 008's tracked README edit. With `--ignored`, the only files newer than this phase are `.nudge` files from live sessions; every sweep and save here ran from a `mktemp` folder. `git status --short specs` also lists other packets' uncommitted work, the parent research reorganization and 008 and 010 among it, none written by this phase.
- [x] T015 Validate the packet. Verify: `validate.sh ... --strict` prints RESULT: PASSED. Evidence: the first run failed only on generated metadata (fingerprint and description drift) plus one long `next_safe_action`; after shortening it and `repair-derived.cjs --apply`, it printed `Summary: Errors: 0  Warnings: 0` and RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: three scripted scratch saves each printed `chat_rows=1 pair6=1`
- [x] Every row of `acceptance-criteria.md` reads Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../research/research.md` §5 and §13, and `../research/synthesis-review.md`
- **Prior decision**: ADR-002 in `../007-gap-closure/decision-record.md`
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

A blocked task carries `[B]` and the command output that blocks it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 8. Evidence: 8.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c YOUR_VALUE_HERE plan.md` prints nothing. Evidence: nothing, exit 1.
- [x] CHK-003 [P1] Dependencies available: `command -v codex pi claude` prints three paths, and 008's acceptance criteria hold no Unmet row. Evidence: three paths printed; the Unmet count printed nothing.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The sk-code quality gate over `chat-questions.mjs` and the two test files reports `NO_BLOCKER_FOUND`. Evidence: `quality-gate.cjs --files <the three> --lines changed` printed `gate=NO_BLOCKER_FOUND exit=0`, findings 0.
- [x] CHK-011 [P0] `node --check` on `chat-questions.mjs` exits 0 and the suites print no warning. Evidence: exit 0; the three suite runs above print no warning.
- [x] CHK-012 [P1] `answerEvidence` throws on nothing: a null answer returns `null`, and an answer of only punctuation returns zero overlap and two false booleans. Evidence: the null case is a committed test; a probe on `?!...` returned `contentOverlap` 0 with both booleans false, and an empty answer did the same.
- [x] CHK-013 [P1] No ephemeral labels in new comments: `git diff HEAD -U0` over the changed files piped to the label `rg` prints nothing. Evidence: nothing, exit 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row of `acceptance-criteria.md` reads Met.
- [x] CHK-021 [P0] Three scripted scratch saves each printed `chat_rows=1 pair6=1`. Evidence: T012, three runs plus a fourth with the record grep.
- [x] CHK-022 [P1] Edge cases tested: `make it blue`, `use the darker one`, `First, make it blue`, `Push it` and `Yes` each carry the evidence in the plan table. Evidence: one committed case each in `chat-questions.test.mjs`.
- [x] CHK-023 [P1] Error scenarios validated: a candidate with a null answer carries `evidence: null`. Evidence: `answerEvidence(..., null)` returns `null` in a committed test; a probe of `chatCandidatesFromTurns` with an unanswered question printed `{"answer":null,"evidence":null}`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: P1-3 outcome test `matrix/evidence`, P1-4 fixture lines `instance-only`, P2-7 shape tests `cross-consumer`, P2-8 lexicons `algorithmic`, P2-9 `not_applicable` `algorithmic`, P2-10 wording `instance-only`. Evidence: classes listed in the item.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n chatCandidatesFromTurns .skilled/hooks` shows one producer and five callers, none with its own candidate builder. Evidence: the producer at `chat-questions.mjs:334`; callers in `sweep-transcript`, `sweep-codex`, `sweep-pi`, `sweep-opencode` and `sweep-devin`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed in `plan.md` FIX ADDENDUM. Evidence: `plan.md` line 139 lists `save.md`, `save-workflow.md` and the catalog page; line 133 marks the writer as not a consumer.
- [x] CHK-FIX-004 [P0] The parser cases cover the adversarial inputs: misspelt opening, filler before verb, anaphor after verb, list marker before verb, shift phrase past word five, inline code inside an `or` question. Evidence: the first three were already committed (misspelt opening as fixture pair 1); `chat-questions.test.mjs` now adds `1. fix the login bug` (imperative true), a shift phrase past word five (topicShift false) and a backticked `or` question answered `backoff` (optionMatch true); the hooks suites print tests 122, pass 122, fail 0.
- [x] CHK-FIX-005 [P1] Matrix axes and rows listed in `plan.md`: four question types by seven reply shapes. Evidence: `plan.md` line 140.
- [x] CHK-FIX-006 [P1] Hostile env variant: N/A by construction, because the evidence reads no process-wide state. Evidence: `rg -n 'process\.(env|cwd)'` on `chat-questions.mjs` prints nothing, exit 1.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the commit that lands this phase. Evidence: landed in `af931860f8` on 2026-11-03, after the hooks (122 of 122), runtime vitest (52 of 52), Pi (10 of 10) and OpenCode plugin (6 of 6) suites, typecheck and lint all passed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or home paths in changed files or fixtures. Evidence: `git diff HEAD` over the five changed files piped to the `rg` prints nothing, exit 1; the same `rg` over the two new fixture files prints nothing, exit 1.
- [x] CHK-031 [P0] The evidence copies no question or answer text: every value is an enum, a boolean or a count. Evidence: every evidence object printed for the 7-pair and 14-pair fixtures holds only those value kinds.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same five fields and the same `Evidence:` sentence form. Evidence: each file counts at least one hit per field name; `spec.md` REQ-003 and `plan.md` line 112 carry the same sentence form.
- [x] CHK-041 [P1] `save.md` and the feature catalog page agree that the model decides and no code accepts or rejects a candidate. Evidence: `save.md` line 75 and catalog line 41.
- [ ] CHK-042 [P2] The deferred reject-only filter is recorded with the labelled-set size that would unblock it. Deferred: the filter is recorded as deferred in `spec.md`, `goal.md` D5 and `implementation-summary.md`, but no unblocking size has been decided.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the scratch project lives outside this repository and the planning probe stayed in the session scratchpad. Evidence: every scripted save ran in a `mktemp` project; the mutation and timing copies lived in the session scratchpad and were deleted after.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: this packet's `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
