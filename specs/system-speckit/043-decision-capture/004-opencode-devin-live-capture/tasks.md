---
title: "Tasks: Phase 4: opencode-devin-live-capture"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "opencode devin live capture tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: opencode-devin-live-capture

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

Shell variables: `DC` is `.skilled/hooks/decision-capture`. `PROBE` is `.skilled/skills/.state/decision-capture/probe`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm the reader baseline (`$DC/bin/sweep-opencode.test.mjs`, `$DC/bin/sweep-devin.test.mjs`). Verify: `node --test $DC/bin/sweep-opencode.test.mjs $DC/bin/sweep-devin.test.mjs` prints `pass 11` and `fail 0`. Evidence: The two reader tests from a `git archive HEAD` copy print `pass 11` and `fail 0`.
- [x] T002 Ask the operator for consent to one harmless probe question in OpenCode and one in Devin, in a scratch project. Record the reply (`scratch/probe-consent.md`). Verify: `rg -n 'consent' scratch/probe-consent.md` prints the operator's quoted yes. No probe runs without it. Evidence: The `rg` prints `The consent answer, quoted: "Yes, all four (Recommended)"` (parent Q007).
- [x] T003 Probe OpenCode in a scratch project whose own `.opencode/plugins/` holds a throwaway logger for `tool.execute.after`, `question.replied` and `session.idle`, ask one harmless question and record key names, `input.callID`, `input.sessionID` and where the answers sat (`$PROBE/opencode.json`). Verify: `node -e` parses the file and `hook_payload` no longer reads "UNKNOWN: no live probe run", or names why the probe could not run. Evidence: `probe/opencode.json` parses; `hook_payload` starts `OBSERVED:` and names `input.callID`, `input.sessionID` and `output.metadata.answers`. No `question.replied` event reached the plugin.
- [x] T004 Probe Devin in a scratch project whose own `.devin/hooks.v1.json` binds `PostToolUse` matcher `^ask_user_question$` and `Stop` to throwaway loggers, ask one harmless question and record the payload keys, `session_id`, `tool_use_id`, whether `tool_response` holds the answer and whether a Stop `additionalContext` line was shown (`$PROBE/devin.json`). Verify: `node -e` parses the file and `hook_payload` no longer reads "UNKNOWN: no live probe run", or names why the probe could not run. Evidence: `probe/devin.json` parses; `hook_payload` starts `OBSERVED:` and names the payload keys, `session_id`, `tool_use_id`, the answer in `tool_response.output`, and that a Stop `additionalContext` line was not displayed.
- [x] T005 Copy the T003 probe session's own `session_message` row that holds the question call, from `opencode.db` opened read-only. If that session holds none, set `probe/opencode.json` status to `UNKNOWN` with the reason, skip T006 and T007 and record the waiver. Redact ids, paths and timestamps (`$DC/bin/fixtures/opencode-session-message.json`). Verify: `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" $DC/bin/fixtures/opencode-session-message.json` exits 0 and `rg -n '/Users/|ses_[A-Za-z0-9]{8}' $DC/bin/fixtures/opencode-session-message.json` prints nothing. Evidence: The fixture parses (exit 0) and the `rg` prints nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T006 Add a test that loads the real row into a temp `session_message` table and asserts the probe answer and its `toolSourceKey` (`$DC/bin/sweep-opencode.test.mjs`). Verify: the new case fails against the shipped reader, or, when the shape already matches, fails with the `MESSAGE_TABLE` branch of `loadOpenCodeParts` removed. The failing output is pasted into `implementation-summary.md`. Evidence: The shape already matched, so the case was run with the `session_message` branch disabled: 2 fail (`actual: 0, expected: 1`); the output is pasted in the summary.
- [x] T007 Fix the `session_message` conversion only where the real row differs from the inferred shape (`$DC/bin/sweep-opencode.mjs`). Verify: `node --test $DC/bin/sweep-opencode.test.mjs` prints `fail 0`, or the task records "no change, the real row matched" with T006's evidence. Evidence: No change, the real row matched (T006 evidence).
- [x] T008 Create the OpenCode plugin for the surface T003 proved, live through `tool.execute.after` or near-live through a `session.idle` run of `sweepOpenCodeSession`, honoring `isHookEnabled('decision-capture')` and failing open (`.opencode/plugins/decision-capture.js`). Verify: `node --test .opencode/plugins/tests/decision-capture.test.cjs` prints `fail 0`. When T003 proved neither, skip this task and record why under REQ-005. Evidence: Live through `tool.execute.after`; `decision-capture.test.cjs` 6 pass, 0 fail.
- [x] T009 Add the plugin's pending-answer nudge, a `takeNudge` call in `experimental.chat.system.transform` that pushes one line into `output.system` (`.opencode/plugins/decision-capture.js`). Verify: the plugin test shows one system line for two pending answers, then none on the next turn. Evidence: The case "two pending answers produce one system line, then none on the next transform" passes.
- [x] T010 Declare the plugin's hooks to the inventory test (`.opencode/plugins/tests/plugin-inventory.json`). Verify: `node --test .opencode/plugins/tests/plugin-inventory.test.cjs` prints `fail 0`. Evidence: `plugin-inventory.test.cjs` 54 pass, 0 fail.
- [x] T011 Create the Devin `PostToolUse` adapter for `ask_user_question` when T004 proved the payload carries the answer, with a redacted payload fixture and a test (`$DC/devin/ask-capture-posttooluse.mjs`). Verify: `node --test $DC/devin/ask-capture-posttooluse.test.mjs` prints `fail 0`. When T004 did not prove it, skip and record why under REQ-005. Evidence: 6 pass, 0 fail, including both producer orders, the kill switch and malformed JSON.
- [x] T012 Register the Devin binding in the `decision-capture` entry and regenerate (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints PASS and `rg -n 'decision-capture/devin' .devin/hooks.v1.json` prints one line. Evidence: `--check` prints PASS, and the `rg` prints one line.
- [x] T013 Add the Devin adapter's stdin-deadline entry (`.skilled/hooks/shared/hook-stdin-deadline.test.mjs`). Verify: `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs` prints `fail 0`. Evidence: 22 pass, 0 fail.
- [x] T014 Move the pinned registry binding count up by one for the Devin binding (`.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts`). Verify: the CLI vitest run of `hook-registration-sync.vitest.ts` prints no failed test. Evidence: Test Files 1 passed, Tests 7 passed (7); the binding count is 101.
- [x] T015 Forward the nudge in Devin's Stop adapter, and run `sweepDevinTranscript` for the session first when T004 showed the near-live path (`.skilled/skills/system-spec-kit/runtime/hooks/devin/session-stop.ts`). Verify: a runtime vitest case prints one `additionalContext` line for two pending answers, then none. When T004 showed Devin does not display Stop context, skip and record why under REQ-006. Evidence: Skipped under its own condition: T004 showed Devin does not display Stop context. Recorded under REQ-006 in the summary's Key Decisions and Known Limitations.
- [x] T016 Add same-key tests per runtime in both producer orders, live then reader and reader then live, with a skipped and a dismissed answer (`$DC/lib/capture-core.test.mjs`). Verify: `node --test $DC/lib/capture-core.test.mjs` prints `fail 0` and each case asserts one queue line per answered question. Evidence: `capture-core.test.mjs` 20 pass, 0 fail: Claude, Pi, OpenCode and Devin in both orders with empty, cancelled, unanswered and skipped answers, plus a skipped-question and near-miss-id case. Dedup disabled fails 6; case-insensitive dedup fails the near-miss case.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T017 Run every decision-capture and plugin suite (`$DC`, `.opencode/plugins/tests/`). Verify: `node --test $DC/bin/*.test.mjs $DC/lib/capture-core.test.mjs` and `node --test .opencode/plugins/tests/decision-capture.test.cjs .opencode/plugins/tests/plugin-inventory.test.cjs` each print `fail 0`. Evidence: 78 pass, 0 fail, and 60 pass, 0 fail.
- [x] T018 Answer one harmless question in a live session of each proven runtime and read the queue before any save (`.skilled/skills/.state/decision-capture/`). Verify: the session's queue file gains one line, and a following reader run prints `"recovered": 0`. Evidence: OpenCode and Devin live in fresh scratch projects: each queued `plum` with source `hook`, and its reader then printed `recovered 0` with 1 queue line.
- [x] T019 Re-prove with the live-conversation harness: an orchestrator drives a multi-turn OpenCode and Devin test-subject session in a scratch project and answers its questions as the human (`../006-live-conversation-test/`). Verify: the 006 results matrix shows each answer queued live or near-live during the conversation, once, and the save-time reader adding no duplicate. Evidence 2026-11-02: OpenCode and Devin main 14/14 and kill-switch 1/1 (`../006-live-conversation-test/scratch/live-runs/{opencode,devin}-run1/`); 6 queue lines each, 0 duplicates. The Devin run found that its call ids carry `#`, which the writer refuses in a key; the shared key builders in `lib/capture-core.mjs` now map any character outside `[A-Za-z0-9:._-]` to `.`, with a test for both capture orders.
- [x] T020 Update the decision-capture coverage rows for OpenCode and Devin (`.skilled/hooks/README.md`). Verify: `rg -n 'decision-capture' .skilled/hooks/README.md` shows the new OpenCode and Devin states, matching the probe files. Evidence: The coverage row shows OpenCode and Devin `✓ covered`, matching both probe files.
- [x] T021 Validate this packet (`specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED`, Errors 0, Warnings 0, on 2026-11-02 before the live re-proof. Rerun after T019.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed Evidence: the 006 live runs.
- [x] The 006 results matrix row for OpenCode and for Devin shows one queued answer per question and no reader duplicate. Evidence: 006 matrix rows OpenCode and Devin, and re-proof row 004 "pass: 6 queue lines each, 0 duplicates, 7 rows each".
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Finished build**: See `../001-decision-capture-build/implementation-summary.md`
- **Live re-proof harness**: See `../006-live-conversation-test/`
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

A task skipped because its probe did not prove the surface is not blocked. It is marked `[x]` with the probe evidence and the reason, under REQ-005 or REQ-006.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The operator's consent for both probes is recorded. `rg -n 'consent' scratch/probe-consent.md` prints it. Evidence: The `rg` prints the quoted yes.
- [x] CHK-002 [P0] T003 and T004 are marked `[x]` with probe evidence before T008 or T011 starts. `rg -n 'T00[34]' tasks.md` shows both done first. Evidence: The probe logs were written 08:35 (Devin) and 08:42 (OpenCode); the plugin at 09:17 and the adapter at 09:31.
- [x] CHK-003 [P1] The reader baseline is `pass 11` and `fail 0` (T001). Evidence: `pass 11`, `fail 0` at HEAD.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check` exits 0 for each new `.mjs` and `.js` file. Evidence: `node --check` exits 0 for the plugin and the Devin adapter.
- [x] CHK-011 [P0] The OpenCode plugin writes nothing to stdout or stderr. `rg -n 'console\.' .opencode/plugins/decision-capture.js` prints nothing. Evidence: The `rg` prints nothing.
- [x] CHK-012 [P1] Each adapter returns with no output on a bad payload, covered by a test case per adapter. Evidence: The plugin's malformed-payload case and the Devin adapter's malformed-JSON case pass.
- [x] CHK-013 [P1] Each adapter calls `normalizeAskUserQuestion` and `appendRecords` from `lib/capture-core.mjs` and holds no key logic of its own. `rg -n 'toolSourceKey' .opencode/plugins/decision-capture.js $DC/devin` prints nothing. Evidence: The `rg` prints nothing. The plugin calls `normalizeAskUserQuestion` and `appendRecords`; the Devin adapter calls the reader's `devinAnswerRecords`, which wraps `normalizeAskUserQuestion`, and `appendRecords`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is Met, Waived or Superseded. Evidence 2026-11-02: no row reads Unmet.
- [x] CHK-021 [P0] The live single-question check in T018 left one queue line per runtime before any save. Evidence: T018: one queue line per runtime before any save.
- [x] CHK-022 [P1] The real `session_message` case was seen to fail first (T006). Evidence: T006: 2 fail with the branch disabled.
- [x] CHK-023 [P1] Same-key tests cover both producer orders and a skipped and a dismissed answer (T016). Evidence: T016: both orders, with skipped and dismissed answers.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The one finding this packet closes, 001 Known Limitations item 3, is classed `cross-consumer`: two producers, the live adapter and the reader, write one queue. Evidence: Classed `cross-consumer`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'normalizeAskUserQuestion' $DC .opencode/plugins` lists every producer, and each is covered by T016. Evidence: The `rg` lists the core, the plugin, the Claude adapter and the five readers. T016 covers each runtime with two producers; Codex has only its reader, so it has no order to test.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'takeNudge|pendingRecords' .skilled .opencode` lists every reader of the queue, and each still passes its suite. Evidence: The `rg` lists the plugin, the core, the five readers, the Claude Stop hook and `match-decision-table.ts`: lib+bin 78 pass, plugin 60 pass, `hook-session-stop.vitest.ts` 19 passed, `match-decision-table.vitest.ts` 5 passed.
- [x] CHK-FIX-004 [P0] The key invariant has adversarial cases: a hook session id that differs from the stored one, a call id that differs in prefix or case and a multi-question call with one skipped answer. Evidence: The case "OpenCode capture keys stay exact for skipped answers and near-miss ids" covers a different live session id, call ids that differ in case and in prefix, and a three-question call with the middle answer skipped.
- [x] CHK-FIX-005 [P1] The matrix is runtime (2) by producer order (2) by answer state (3), twelve rows, listed in `plan.md` before completion. Evidence: plan.md lists runtime by producer order by answer state, twelve rows.
- [x] CHK-FIX-006 [P1] A run with `SYSTEM_DECISION_CAPTURE_DISABLED=1` set writes no queue line from either adapter. Evidence: The plugin's kill-switch case and the Devin adapter's disabled case each write no queue line.
- [ ] CHK-FIX-007 [P1] Evidence in `implementation-summary.md` is pinned to a commit SHA or an explicit diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] Fixtures hold no real path or id. `rg -n '/Users/' $DC/bin/fixtures $DC/devin` prints nothing. Evidence: The `rg` prints nothing, after a home-relative path in the 005 chat fixture was replaced.
- [x] CHK-031 [P0] Every database open in a reader or adapter passes `readOnly: true`. `rg -n 'new DatabaseSync' $DC .opencode/plugins/decision-capture.js` shows only read-only opens. Evidence: Both readers open with `readOnly: true`; only test files open writable databases, to build fixtures; neither adapter opens one.
- [x] CHK-032 [P1] The probes ran in a scratch project, not in this repository's `.opencode/plugins/` or `.devin/hooks.v1.json`. `git status --short .opencode/plugins .devin` shows no probe logger. Evidence: `git status` shows the regenerated `.devin/hooks.v1.json`, the plugin, its test and the plugin README, and no probe logger.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same surfaces per runtime as the final probe files. Evidence: spec.md and plan.md each carry the outcome line: live hooks for both runtimes, no near-live path, no Devin nudge.
- [x] CHK-041 [P1] Each new adapter has a header comment that says what it observes and that it fails open, with no packet or task ids in it. Evidence: Both headers say what the adapter observes and that it fails open, with no ids.
- [x] CHK-042 [P2] `.skilled/hooks/README.md` decision-capture coverage rows match the probe files (T020). Evidence: The coverage row matches both probe files.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Probe loggers, raw payload captures and the unredacted row stay under this packet's `scratch/` or the scratch project, never in a tracked fixture. Evidence: Loggers and raw captures stayed in the scratch projects and this packet's `scratch/`; fixtures are redacted.
- [x] CHK-051 [P1] Raw unredacted captures are deleted from `scratch/` before completion. `ls scratch/` lists only `probe-consent.md` and `.gitkeep`. Evidence: `ls -a scratch/` lists `.gitkeep` and `probe-consent.md`; the three raw logs held real ids and were moved out.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---



