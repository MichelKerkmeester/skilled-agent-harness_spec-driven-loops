---
title: "Tasks: Phase 3: link-roster-and-answer-gate"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "link roster and answer gate tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: link-roster-and-answer-gate

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

Four shell variables this list uses: `RT` is `.skilled/skills/system-skilled-bots/runtime`, `BOTS` is `node .skilled/bin/bots.cjs`, `CTX` is `specs/system-skilled-bots/context` and `G` is `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/golden`.

Every task that writes state runs on a temporary state root, never the real one: `T=$(mktemp -d) && mkdir -p "$T/checkout"`, then `XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets` in front of the command and `--repo "$T/checkout"` after it. The empty checkout keeps this repository's config and origin remote out of the run, and `SKILLED_BOTS_STATE_ROOT` must be unset because it wins over `XDG_STATE_HOME` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102-108]. A roster left on the real root would refuse real terminal answers. Every command runs with no tty, no token and no network.

Each task names the pre-expansion task it came from as `was T0NN`, so a citation of the old list still resolves.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the adapter contract, was T001 (`$CTX/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs`). Verify: `rg -n 'declared_capabilities|async fn start' $CTX/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs` prints both
- [ ] T002 Record the pairing lockout, was T004 (`$CTX/tinychannels-main/crates/tinychannels-runtime/src/security/mod.rs`). Verify: `rg -n 'MAX_PAIR_ATTEMPTS|PAIR_LOCKOUT_SECS' $CTX/tinychannels-main/crates/tinychannels-runtime/src/security/mod.rs` prints 5 and 300
- [ ] T003 Record the answer path, was T012 (`$RT/lib/answer.ts`). Verify: `rg -n 'export function answerItem' $RT/lib/answer.ts` prints one line
- [ ] T004 Record the state layout, was T013 (`$RT/lib/state-root.ts`). Verify: `rg -n 'export function deliveryClaimFolder' $RT/lib/state-root.ts` prints one line
- [ ] T005 Capture the baseline suite result, was T014 (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Create the contract, the message model, the capability keys and the unsupported result, was T015 and T016 (`$RT/lib/channel.ts`). Verify: `rg -n 'ChannelAdapter|ChannelInbound|ChannelOutbound|ChannelSendResult' $RT/lib/channel.ts` prints all four, and `rg -n 'unsupported|retryable|sentBeforeError' $RT/lib/channel.ts` prints the three flags
- [ ] T007 Add the config read and write, `redactToken`, the seen-record and listen-lease helpers and the reply table, was T074 and T058 (`$RT/lib/channel.ts`). Verify: `rg -n 'readChannelConfig|writeChannelConfig|redactToken|bot<redacted>' $RT/lib/channel.ts` prints all four, and `rg -n '^import' $RT/lib/channel.ts` prints only `./state-root`
- [ ] T008 Add `channelFolder`, `operatorsFile` and `ensureChannelState`, was T024 (`$RT/lib/state-root.ts`). Verify: `rg -n 'channelFolder|operatorsFile|ensureChannelState' $RT/lib/state-root.ts` prints all three. This is the handoff child 004 waits for
- [ ] T009 Create the pairing code and the link record with its sender id, was T017 and T052 (`$RT/lib/channel-link.ts`). Verify: `rg -n 'LINK_CODE_TTL|senderId|links.json' $RT/lib/channel-link.ts` prints all three
- [ ] T010 Add the five-attempt 300 s lockout, counting only a six-digit attempt, was T018 (`$RT/lib/channel-link.ts`). Verify: `rg -n 'MAX_PAIR_ATTEMPTS|PAIR_LOCKOUT_SECS' $RT/lib/channel-link.ts` prints 5 and 300
- [ ] T011 Add the roster read, write and creation rule and `isApprover`, was T019 and T051 (`$RT/lib/channel-link.ts`). Verify: `rg -n 'operators.json|isApprover|channel-roster-missing|channel-roster-owner' $RT/lib/channel-link.ts` prints all four, and `rg -n 'config.json' $RT/lib/channel-link.ts` exits 1, so the config has one owner
- [ ] T012 [P] Create the temporary state root and the scripted fake transport, was T035 (`$RT/tests/channel-support.ts`). Verify: `rg -n 'fakeTransport|temporaryStateRoot' $RT/tests/channel-support.ts` prints both
- [ ] T013 Add the roster check to `answerItem` before the lock, taking the actor and the surface as arguments, was T054 (`$RT/lib/answer.ts`). Verify: `rg -n 'answer-not-approver|isApprover|channel-roster-missing' $RT/lib/answer.ts` prints all three, and `rg -n 'isTTY' $RT/lib/answer.ts` exits 1
- [ ] T014 [P] Add the `channel` verb group with `link`, `unlink` and `roster add|remove|list`, was T032, the link half of T033 and T050 (`.skilled/bin/bots.cjs`). The entry is `channel: { ids: 0, options: ['role', 'secret'] }`, because `parseArgs` caps positionals by `spec.ids` and refuses an option outside `COMMON_OPTIONS` or `spec.options` [SOURCE: .skilled/bin/bots.cjs:143] [SOURCE: .skilled/bin/bots.cjs:167]. `role` and `secret` join `KNOWN_OPTIONS`, because an option outside that set is refused before the spec is read [SOURCE: .skilled/bin/bots.cjs:126]. A `channel` branch beside the `enqueue`, `schedule` and `answer` branches returns the subverb and its operands as `args`, because the generic tail returns `args: []` [SOURCE: .skilled/bin/bots.cjs:168]. Verify: `rg -n "channel: \{ ids: 0" .skilled/bin/bots.cjs` prints the verb spec and `rg -n "verb === 'channel'" .skilled/bin/bots.cjs` prints the parse branch
- [ ] T015 [P] Create the contract tests, the config test and the reply table against the goldens, was T036 (`$RT/tests/channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel.vitest.ts` prints no `failed`
- [ ] T016 [P] Create the link tests, was T037 (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts` prints no `failed`
- [ ] T017 [P] Add the roster cases to the answer tests (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts` prints no `failed`
- [ ] T018 [P] Create the CLI tests for `link`, `unlink` and `roster`, including the unlinked-message refusal, which no CLI command can reach because a message arrives from a transport, was T042 (`$RT/tests/cli-channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-channel.vitest.ts` prints no `failed`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run the whole runtime suite, was T061 (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T020 Type-check the runtime, was T062 (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0
- [ ] T021 Prove the lockout, was T064 (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts -t "lockout"` prints one passing test
- [ ] T022 Prove the non-approver refusal and the mismatched sender id, was T066 (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts -t "not-approver"` prints one passing test
- [ ] T023 Prove the roster verbs and the absent-roster refusal, was T069 (`$RT/tests/cli-channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-channel.vitest.ts -t "roster"` prints one passing test
- [ ] T024 Prove the link on a temporary state root, was T063 (`.skilled/bin/bots.cjs`). The roster is added first, because `link` refuses `channel-roster-missing` until `operators.json` names an owner. Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel roster add ada --role owner --repo "$T/checkout" </dev/null` exits 0, `jq -r .schemaVersion "$(find "$T/state" -name operators.json)"` prints 1 and `XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel link telegram --repo "$T/checkout" </dev/null` prints one line matching `^bots: telegram link code [0-9]{6}, valid for 5 minutes$`
- [ ] T025 Prove `answerItem` on both surfaces, was T070 (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "not-approver"` prints one passing test, `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "no roster"` prints one and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "present roster"` prints one
- [ ] T026 Run the validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] T019 and T020 pass from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
- **Parent specification**: See `../spec.md`
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

A blocked task is `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md` prints 10
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies available. Verify: T001 to T005 print what they say
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The typecheck passes. Verify: T020 exits 0
- [ ] CHK-011 [P1] `channel.ts` has no import cycle. Verify: `rg -n '^import' $RT/lib/channel.ts` prints only `./state-root`
- [ ] CHK-012 [P1] No ephemeral label in a code comment. Verify: `rg -n 'REQ-0|T0[0-9]{2}|specs/' $RT/lib/channel.ts $RT/lib/channel-link.ts` exits 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/acceptance-criteria.md` prints 10
- [ ] CHK-021 [P0] The suite passes. Verify: T019 prints no `failed`
- [ ] CHK-022 [P1] No test opens a socket. Verify: `rg -n 'fetch\(|net\.connect|new WebSocket' $RT/tests/channel*.ts $RT/tests/cli-channel.vitest.ts` exits 1
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] A channel answer from an actor the roster does not name is refused. Verify: T022 and T025 pass
- [ ] CHK-031 [P0] The channel files are 0600. Verify: after T024, `find "$T/state" -name 'operators.json' -perm 600` prints one path
- [ ] CHK-032 [P1] No token is stored. Verify: `rg -n 'token' "$T/state" -g '*.json'` exits 1 after T024
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The reply table equals the goldens. Verify: `cd $RT && npx vitest run tests/channel.vitest.ts -t "golden"` prints one passing test
- [ ] CHK-041 [P2] The parent map names this child. Verify: `rg -n '003-link-roster-and-answer-gate/ \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md` prints the map row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the ten files of the spec's Files to Change table change. Verify: `git status --short .skilled` lists no other path
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/scratch -type f ! -name .gitkeep` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
