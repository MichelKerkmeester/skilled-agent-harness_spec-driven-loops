---
title: "Tasks: Phase 2: conversation-runtime-and-chat-verb"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "conversations tasks"
  - "conversation runtime tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: conversation-runtime-and-chat-verb

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

Three shell variables this list uses: `RT` is `.skilled/skills/system-skilled-bots/runtime`, `BOTS` is `node .skilled/bin/bots.cjs` and `P` is `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb`. Every command runs from the repository root with no tty. A live probe runs against a temporary state root that holds a `my-bot` and an `other-bot` `BOT.md`.

The task ids are the pre-expansion phase's. T022 to T026 and T032, the crate's tasks, moved with their ids to `../003-chat-pane-and-proof/tasks.md`, and T038, the crate's test run, moved with them. New tasks take ids from T045.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the current verb list and option sets (`.skilled/bin/bots.cjs`). Verify: `rg -n 'VERB_SPECS|FLAG_OPTIONS' .skilled/bin/bots.cjs` prints both declarations and no `chat` entry
- [ ] T002 Record the current identity folders (`$RT/lib/state-root.ts`). Verify: `rg -n 'conversations' $RT/lib/state-root.ts` exits 1
- [ ] T003 Record the drain's claim loop (`$RT/lib/request-drain.ts`). Verify: `rg -n 'listInbox' $RT/lib/request-drain.ts` prints the loop and no `requestIds`
- [ ] T004 Record the prompt composition and the outcome union (`$RT/lib/runner.ts`). Verify: `rg -n 'REQUEST_PROMPT_HEADER|kind: .completed.' $RT/lib/runner.ts` prints the header and the completed line
- [ ] T005 Record the turnstone loop's shape (`specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py`). Verify: `rg -n 'setup_readline|SLASH_COMMANDS' specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py` prints both
- [ ] T006 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Create the message record and the conversation path (`$RT/lib/conversation.ts`). Verify: `rg -n 'ConversationMessage|conversationFile' $RT/lib/conversation.ts` prints both, and `rg -n "by: 'bot'|control" $RT/lib/conversation.ts` prints the bot's `by` and the control-character strip, which keeps the line feed (D10 in `contracts/decisions.md`)
- [ ] T008 Add the append-only write with mode 0600 (`$RT/lib/conversation.ts`). Verify: `rg -n 'appendFileSync' $RT/lib/conversation.ts` prints one call, `rg -n 'writeFileSync' $RT/lib/conversation.ts` exits 1, and `rg -n '0o600' $RT/lib/conversation.ts` prints the mode
- [ ] T009 Add the read that skips a torn last line (`$RT/lib/conversation.ts`). Verify: `rg -n 'torn' $RT/lib/conversation.ts` prints the skip and its report
- [ ] T010 Add the `@bot` parse by the routing grammar and the bound by the design's count and cut rules (`$RT/lib/conversation.ts`). Verify: `rg -n 'TRANSCRIPT_MAX_MESSAGES|TRANSCRIPT_MAX_CHARS|parseAddress|characters dropped' $RT/lib/conversation.ts` prints all four
- [ ] T011 Add the `conversations` folder to the identity paths (`$RT/lib/state-root.ts`). Verify: `rg -n 'conversations' $RT/lib/state-root.ts` prints the field and the `mkdirSync`
- [ ] T012 Add the `requestIds` filter to the drain (`$RT/lib/request-drain.ts`). Verify: `rg -n 'requestIds' $RT/lib/request-drain.ts` prints the input field and the filter
- [ ] T013 Return the answer text on the `completed` outcome, redacted when it holds a known secret literal, with the cause in `postRunCauses` (`$RT/lib/runner.ts`). Verify: `rg -n 'answer|redacted|secret-in-output|postRunCauses' $RT/lib/runner.ts` prints the outcome field, its fill, the redaction and the cause
- [ ] T014 Add the `chat` verb's usage line, verb spec and options, with `message` in `FREE_TEXT_OPTIONS` (`.skilled/bin/bots.cjs`). Verify: `rg -n "chat|'message'" .skilled/bin/bots.cjs` prints the usage line, the verb spec, the option list and the free-text entry
- [ ] T015 Add the one-message path: strip every control character but the line feed, parse, check the text, append, enqueue, drain one, append the reply (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --message hello` exits 0 and prints one `my-bot › ` line, and `$BOTS chat my-bot --message "ghp_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"` with that value stored exits 4 with `body-secret` and appends nothing
- [ ] T016 Add the transcript read, its text form and its `--json` envelope (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --transcript --json | jq -r '.version, .conversationId, (.messages | type)'` prints `1`, `my-bot` and `array`
- [ ] T017 Add the terminal loop with readline history and completion (`.skilled/bin/bots.cjs`). Verify: `printf '/exit\n' | $BOTS chat my-bot; echo "exit=$?"` prints `exit=0` and appends nothing
- [ ] T018 Create the conversation tests (`$RT/tests/conversation.vitest.ts`). Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts` prints no `failed`
- [ ] T019 Create the CLI chat tests (`$RT/tests/cli-chat.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-chat.vitest.ts` prints no `failed`
- [ ] T020 Extend the queued-run tests with the `requestIds` filter and the resumed append (`$RT/tests/queued-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/queued-run.vitest.ts` prints no `failed`
- [ ] T021 Extend the runner tests with the answer text and its redaction (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts` prints no `failed`
- [ ] T027 Append the Apache-2.0 notice for turnstone's loop to the shared notices file (`.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`). Verify: `rg -n '^## 010-conversations|turnstone/cli.py' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints the heading and the source path
- [ ] T028 Add the module row and the topology edge to the runtime README (`$RT/lib/README.md`). Verify: `rg -n 'conversation.ts' $RT/lib/README.md` prints the row
- [ ] T029 Name `bots chat` in the run reference's verb table (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n 'bots chat' .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the row
- [ ] T030 Name the chat verb in the run mode's scope (`.skilled/skills/system-skilled-bots/bots-run/SKILL.md`). Verify: `rg -n 'bots chat' .skilled/skills/system-skilled-bots/bots-run/SKILL.md` prints the line
- [ ] T031 Name `bots chat` as a run-mode verb in the hub (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots chat' .skilled/skills/system-skilled-bots/SKILL.md` prints the line
- [ ] T033 Render the block as `contracts/prompt-sections.md` section 1.9 writes it: the `id` opening tag, the label line, one `<human>` or `<bot>` line per message and the reserved-tag escape (`$RT/lib/conversation.ts`). Verify: `rg -n '<conversation id=|</conversation>|<human> |<bot> |&lt;' $RT/lib/conversation.ts` prints the tag, the close, both prefixes and the escape and `cd $RT && npx vitest run tests/conversation.vitest.ts -t "escape"` prints one passing test
- [ ] T034 Check both roles for secret literals before the append (`$RT/lib/conversation.ts`, `$RT/lib/runner.ts`). Verify: `rg -n 'body-secret|redacted' $RT/lib/conversation.ts $RT/lib/runner.ts` prints the refusal and the redaction
- [ ] T035 Stamp the parked run's conversation id on the resume request and append the resumed answer, adding the key to the item's and the request's closed key lists (`$RT/lib/needs-you.ts`, `$RT/lib/request-record.ts`, `$RT/lib/answer.ts`, `$RT/lib/request-drain.ts`). Verify: `rg -n 'conversationId' $RT/lib/needs-you.ts $RT/lib/request-record.ts $RT/lib/answer.ts $RT/lib/request-drain.ts` prints the two keys, the stamp and the append
- [ ] T045 Export the renderer's `channel` form for phase 011 (`$RT/lib/conversation.ts`). Verify: `rg -n 'channel=' $RT/lib/conversation.ts` prints the form, and `cd $RT && npx vitest run tests/conversation.vitest.ts -t "channel"` prints one passing test
- [ ] T046 Test the eight routing rules and the five refusals of the design's routing grammar (`$RT/tests/conversation.vitest.ts`, `$RT/tests/cli-chat.vitest.ts`). Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "routing"` prints eight passing tests
- [ ] T047 Read the two contract goldens in the tests (`$RT/tests/conversation.vitest.ts`, `$RT/tests/cli-chat.vitest.ts`). Verify: `rg -n 'fixtures/conversation.jsonl|fixtures/chat-transcript.json' $RT/tests/conversation.vitest.ts $RT/tests/cli-chat.vitest.ts` prints one line per file
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T036 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T037 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0
- [ ] T039 Prove one live message on a temporary state root (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --message hello` exits 0 and `$BOTS chat my-bot --transcript --json | jq '.messages | length'` prints 2
- [ ] T040 Prove `@bot` routing on a temporary state root (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --message '@other-bot hello'` then `$BOTS chat my-bot --transcript --json | jq -r '.messages[-2].botId'` prints `other-bot`
- [ ] T041 Prove the torn line is skipped (`$RT/tests/conversation.vitest.ts`). Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "torn"` prints one passing test
- [ ] T042 Prove a parked message answered and resumed leaves three messages (`$RT/tests/cli-chat.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-chat.vitest.ts -t "resumed"` prints one passing test
- [ ] T043 Prove the injection table and the redaction (`$RT/tests/conversation.vitest.ts`, `$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "injection"` prints eight passing tests
- [ ] T044 Run the packet validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$BOTS chat my-bot --transcript --json | jq -r '.version'` prints `1` and exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Design child**: See `../001-chat-ux-and-pane-map/design/`
- **Pane child**: See `../003-chat-pane-and-proof/tasks.md`
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

A blocked task is marked `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' $P/spec.md` prints 14
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' $P/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npm run typecheck` exits 0
- [ ] CHK-011 [P0] The new module prints nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/conversation.ts` prints nothing
- [ ] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'ok: false' $RT/lib/conversation.ts` prints the refusals
- [ ] CHK-013 [P1] Code follows project patterns. Verify: `rg -n 'Result<' $RT/lib/conversation.ts` prints the return types
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' $P/acceptance-criteria.md` prints 14
- [ ] CHK-021 [P0] Manual testing complete. Verify: `$BOTS chat my-bot --transcript` exits 0
- [ ] CHK-022 [P1] Edge cases tested. Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "torn"` prints one passing test
- [ ] CHK-023 [P1] Error scenarios validated. Verify: `cd $RT && npx vitest run tests/cli-chat.vitest.ts -t "bot-unknown"` prints one passing test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase adds a persisted file format and changes a shared outcome type. These rows verify the inventories it names.

- [ ] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Verify: `rg -c '^\| .*runtime/lib/' $P/plan.md` prints 7
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'appendFileSync|writeStateAtomic' $RT/lib/` prints every writer of a state file
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'RunOutcome|DrainInput|IdentityStatePaths|NeedsYouItem|QueuedRequest' $RT --glob '*.ts'` prints every reader
- [ ] CHK-FIX-004 [P0] The append-only invariant's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/conversation.vitest.ts` prints the case block
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' $P/plan.md` prints the line
- [ ] CHK-FIX-006 [P1] The hostile-environment variant ran. Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "torn"` prints one passing test
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n "(secret|token|password)\s*[:=]\s*['\"]" $RT/lib/conversation.ts` prints nothing, so the module names the check and holds no value
- [ ] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'isSafeSegment|BOT_ID_PATTERN' $RT/lib/conversation.ts` prints the conversation-id check and the bot id check
- [ ] CHK-032 [P1] The file mode is owner-only. Verify: `rg -n 'STATE_DIR_MODE|0o600' $RT/lib/conversation.ts` prints the mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized. Verify: `rg -l 'bots chat' $P/spec.md $P/plan.md $P/tasks.md` prints three paths
- [ ] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/conversation.ts` prints a count above zero
- [ ] CHK-042 [P2] The runtime README names the module. Verify: `rg -n 'conversation.ts' $RT/lib/README.md` prints the row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls $P/scratch/` lists no file the phase wrote outside it
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find $P/scratch -type f ! -name .gitkeep` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
