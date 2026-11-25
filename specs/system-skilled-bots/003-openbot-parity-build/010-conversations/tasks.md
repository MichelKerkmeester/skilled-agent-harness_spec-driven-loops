---
title: "Tasks: Phase 10: conversations"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "conversations tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: conversations

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

Two shell variables this list uses: `RT` is `.skilled/skills/system-skilled-bots/runtime` and `BOTS` is `node .skilled/bin/bots.cjs`.
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

- [ ] T007 Create the message record and the conversation path (`$RT/lib/conversation.ts`). Verify: `rg -n 'ConversationMessage|conversationFile' $RT/lib/conversation.ts` prints both
- [ ] T008 Add the append-only write (`$RT/lib/conversation.ts`). Verify: `rg -n 'appendFileSync' $RT/lib/conversation.ts` prints one call and no `writeFileSync`
- [ ] T009 Add the read that skips a torn last line (`$RT/lib/conversation.ts`). Verify: `rg -n 'torn' $RT/lib/conversation.ts` prints the skip and its report
- [ ] T010 Add the `@bot` parse and the transcript bound (`$RT/lib/conversation.ts`). Verify: `rg -n 'TRANSCRIPT_MAX_MESSAGES|TRANSCRIPT_MAX_CHARS|parseAddress' $RT/lib/conversation.ts` prints all three
- [ ] T011 Add the `conversations` folder to the identity paths (`$RT/lib/state-root.ts`). Verify: `rg -n 'conversations' $RT/lib/state-root.ts` prints the field and the `mkdirSync`
- [ ] T012 Add the `requestIds` filter to the drain (`$RT/lib/request-drain.ts`). Verify: `rg -n 'requestIds' $RT/lib/request-drain.ts` prints the input field and the filter
- [ ] T013 Return the answer text on the `completed` outcome (`$RT/lib/runner.ts`). Verify: `rg -n 'answer' $RT/lib/runner.ts` prints the outcome field and its fill
- [ ] T014 Add the `chat` verb's usage line, verb spec and options (`.skilled/bin/bots.cjs`). Verify: `rg -n 'chat' .skilled/bin/bots.cjs` prints the usage line, the verb spec and the option list
- [ ] T015 Add the one-message path: append, enqueue, drain one, append the reply (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --message hello` on a temporary state root exits 0 and prints one reply line
- [ ] T016 Add the transcript read and its `--json` form (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --transcript --json` prints a JSON array
- [ ] T017 Add the terminal loop with readline history and completion (`.skilled/bin/bots.cjs`). Verify: `printf '/exit\n' | $BOTS chat my-bot` exits 0 and appends nothing
- [ ] T018 Create the conversation tests (`$RT/tests/conversation.vitest.ts`). Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts` prints no `failed`
- [ ] T019 Create the CLI chat tests (`$RT/tests/cli-chat.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-chat.vitest.ts` prints no `failed`
- [ ] T020 Extend the queued-run tests with the `requestIds` filter (`$RT/tests/queued-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/queued-run.vitest.ts` prints no `failed`
- [ ] T021 Extend the runner tests with the answer text (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts` prints no `failed`
- [ ] T022 Add the chat read and send to the crate's client (`crates/bots-tui/src/cli.rs`). Verify: `rg -n 'chat_transcript|chat_send' crates/bots-tui/src/cli.rs` prints both
- [ ] T023 Add the chat state (`crates/bots-tui/src/ui_state.rs`). Verify: `rg -n 'chat' crates/bots-tui/src/ui_state.rs` prints the draft and the scroll offset
- [ ] T024 Replace the chat placeholder with the transcript body (`crates/bots-tui/src/render/panes.rs`). Verify: `rg -n 'phase 010' crates/bots-tui/src/render/panes.rs` exits 1
- [ ] T025 Bind the chat keys and their labels (`crates/bots-tui/src/keys.rs`). Verify: `rg -n 'Enter|Esc' crates/bots-tui/src/keys.rs` prints the chat rows
- [ ] T026 Add the canned chat payload to the fixture (`crates/bots-tui/tests/fixtures/bots`). Verify: `rg -n 'chat' crates/bots-tui/tests/fixtures/bots` prints the transcript branch
- [ ] T027 Write the Apache-2.0 notice for turnstone's loop (`THIRD_PARTY_NOTICES.md`). Verify: `rg -n 'turnstone/cli.py' THIRD_PARTY_NOTICES.md` prints the source path
- [ ] T028 Add the module row and the topology edge to the runtime README (`$RT/lib/README.md`). Verify: `rg -n 'conversation.ts' $RT/lib/README.md` prints the row
- [ ] T029 Name `bots chat` in the run reference's verb table (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n 'bots chat' .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the row
- [ ] T030 Name the chat verb in the run mode's scope (`.skilled/skills/system-skilled-bots/bots-run/SKILL.md`). Verify: `rg -n 'bots chat' .skilled/skills/system-skilled-bots/bots-run/SKILL.md` prints the line
- [ ] T031 Name `bots chat` as a run-mode verb in the hub (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots chat' .skilled/skills/system-skilled-bots/SKILL.md` prints the line
- [ ] T032 Mirror the hub line (`.opencode/skills/system-skilled-bots/SKILL.md`). Verify: `diff -q .skilled/skills/system-skilled-bots/SKILL.md .opencode/skills/system-skilled-bots/SKILL.md` prints nothing
- [ ] T033 Mirror the edited CLI (`.opencode/bin/bots.cjs`). Verify: `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing
- [ ] T034 Document the chat tab's keys and verbs in the crate README (`crates/bots-tui/README.md`). Verify: `rg -n 'chat' crates/bots-tui/README.md` prints the section
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T035 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T036 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npx tsc --noEmit` exits 0
- [ ] T037 Run the crate's tests (`crates/bots-tui/`). Verify: `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok`
- [ ] T038 Prove one live message on a temporary state root (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --message hello` exits 0 and `$BOTS chat my-bot --transcript --json` prints two messages
- [ ] T039 Prove `@bot` routing on a temporary state root (`.skilled/bin/bots.cjs`). Verify: `$BOTS chat my-bot --message '@other-bot hello'` appends a human message whose `botId` is `other-bot`
- [ ] T040 Prove the torn line is skipped (`$RT/tests/conversation.vitest.ts`). Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "torn"` prints one passing test
- [ ] T041 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/010-conversations/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$BOTS chat my-bot --transcript --json` prints a JSON array and exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md` prints 11
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npx tsc --noEmit` exits 0
- [ ] CHK-011 [P0] The new module prints nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/conversation.ts` prints nothing
- [ ] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'ok: false' $RT/lib/conversation.ts` prints the refusals
- [ ] CHK-013 [P1] Code follows project patterns. Verify: `rg -n 'Result<' $RT/lib/conversation.ts` prints the return types
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations --strict` prints `RESULT: PASSED`
- [ ] CHK-021 [P0] Manual testing complete. Verify: `$BOTS chat my-bot --transcript` exits 0
- [ ] CHK-022 [P1] Edge cases tested. Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "torn"` prints one passing test
- [ ] CHK-023 [P1] Error scenarios validated. Verify: `cd $RT && npx vitest run tests/cli-chat.vitest.ts -t "bot-unknown"` prints one passing test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase adds a persisted file format and changes a shared outcome type. These rows verify the inventories it names.

- [ ] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Verify: `rg -c '^\| .*runtime/lib/' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md` prints 4
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'appendFileSync|writeStateAtomic' $RT/lib/` prints every writer of a state file
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'RunOutcome|DrainInput|IdentityStatePaths' $RT --glob '*.ts'` prints every reader
- [ ] CHK-FIX-004 [P0] The append-only invariant's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/conversation.vitest.ts` prints the case block
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md` prints the line
- [ ] CHK-FIX-006 [P1] The hostile-environment variant ran. Verify: `cd $RT && npx vitest run tests/conversation.vitest.ts -t "torn"` prints one passing test
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'secret|token|password' $RT/lib/conversation.ts` prints nothing
- [ ] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'isSafeSegment' $RT/lib/conversation.ts` prints the conversation-id check
- [ ] CHK-032 [P1] The file mode is owner-only. Verify: `rg -n 'STATE_DIR_MODE|0o600' $RT/lib/conversation.ts` prints the mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -l 'bots chat' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md specs/system-skilled-bots/003-openbot-parity-build/010-conversations/tasks.md` prints three paths
- [ ] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/conversation.ts` prints a count above zero
- [ ] CHK-042 [P2] The runtime README names the module. Verify: `rg -n 'conversation.ts' $RT/lib/README.md` prints the row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/010-conversations/scratch/` lists no file the phase wrote outside it
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/010-conversations/scratch -type f` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---

