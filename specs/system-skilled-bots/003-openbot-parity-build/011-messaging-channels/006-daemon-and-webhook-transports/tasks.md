---
title: "Tasks: Phase 6: daemon-and-webhook-transports"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "daemon and webhook transports tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: daemon-and-webhook-transports

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

The shell variables, the temporary state root and the `was T0NN` convention are those of `../003-link-roster-and-answer-gate/tasks.md` Task Notation: `RT` is `.skilled/skills/system-skilled-bots/runtime`, `BOTS` is `node .skilled/bin/bots.cjs` and `CTX` is `specs/system-skilled-bots/context`. Every task that writes state runs on `T=$(mktemp -d) && mkdir -p "$T/checkout"` with `XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets` in front and `--repo "$T/checkout"` after, and `SKILLED_BOTS_STATE_ROOT` unset. Every command runs with no tty, no token and no network.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm child 005's handoff (`$RT/tests/channel-transports.vitest.ts`). Verify: `test -f $RT/tests/channel-transports.vitest.ts && echo ok` prints `ok`
- [x] T002 Record the Signal wire facts as a design note in a worker of its own, the one worker whose brief names the tinychannels source, was T009 (`$CTX/tinychannels-main/src/providers/signal/`, writing `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/design/wire-notes.md` under one `## signal` heading). Verify: `rg -n '^## signal$' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/design/wire-notes.md` prints one line, and `rg -n 'api/v1/rpc|SIGNAL_TEXT_CHUNK_CHARS' $CTX/tinychannels-main/src/providers/signal/` prints both
- [x] T003 Record the WhatsApp wire facts in the same note, in the same worker as T002, was T010 (`$CTX/tinychannels-main/src/providers/whatsapp/`, writing `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/design/wire-notes.md` under one `## whatsapp` heading). Verify: `rg -n '^## whatsapp$' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/design/wire-notes.md` prints one line, and `rg -n 'X-Hub-Signature-256|TEXT_LIMIT' $CTX/tinychannels-main/src/providers/whatsapp/` prints both
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Create the Signal transport from `design/wire-notes.md` and the Wire Table, with no tinychannels path in the brief, was T028 (`$RT/lib/channel-signal.ts`). Verify: `rg -n 'api/v1/rpc|api/v1/events|api/v1/check|2000|channel-daemon-unreachable' $RT/lib/channel-signal.ts` prints all five
- [x] T005 [P] Create the WhatsApp listener with the signature check before parse, from `design/wire-notes.md` and the Wire Table with no tinychannels path in the brief, was T030 (`$RT/lib/channel-whatsapp.ts`). Verify: `rg -n 'X-Hub-Signature-256|timingSafeEqual|channel-signature|413|127.0.0.1' $RT/lib/channel-whatsapp.ts` prints all five
- [x] T006 Add the handshake, the served-number filter and the Graph send (`$RT/lib/channel-whatsapp.ts`). Verify: `rg -n 'hub.challenge|phone_number_id|v23.0|4096' $RT/lib/channel-whatsapp.ts` prints all four
- [x] T007 Add the `signal` and `whatsapp` rows to `listen`, after child 005 (`.skilled/bin/bots.cjs`). Verify: `rg -n "'signal'|'whatsapp'" .skilled/bin/bots.cjs` prints both
- [x] T008 [P] Record the Signal and WhatsApp fixtures with invented data only (`$RT/tests/fixtures/channels/`). Verify: `rg -n 'EAA[A-Za-z0-9]{20,}' $RT/tests/fixtures/channels/` exits 1
- [x] T009 Append the two `describe` blocks, after child 005 (`$RT/tests/channel-transports.vitest.ts`). Three tests inside `transport signal`, `follows the wire table`, `refuses a group event` and `probes the daemon before the stream`, and four inside `transport whatsapp`, `refuses an unsigned body before parse`, `follows the wire table`, `maps a failed status onto the queue entry` and `echoes the handshake challenge`. Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport signal ")` prints `Tests  3 passed`, `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport whatsapp ")` prints `Tests  4 passed` and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport ")` prints `Tests  22 passed` Observed `Tests  3 passed`, `Tests  4 passed` and `Tests  23 passed (23)`. The 22 in the verify is stale: child 005 left 16 tests, not 15, so 16 plus 7 is 23
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` Observed `Test Files  56 passed (56)` and `Tests  765 passed (765)`, exit 0
- [x] T011 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0 Observed exit 0
- [x] T012 Prove Signal replay, reconnect, the group refusal and the unreachable daemon (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport signal follows the wire table$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport signal refuses a group event$")` prints `Tests  1 passed` Observed `Tests  1 passed | 22 skipped (23)` for each
- [x] T013 Prove the signature, the size bound, the parser spy and the failed status (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport whatsapp refuses an unsigned body before parse$")` prints `Tests  1 passed`, `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport whatsapp follows the wire table$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport whatsapp maps a failed status onto the queue entry$")` prints `Tests  1 passed` Observed `Tests  1 passed | 22 skipped (23)` for each
- [x] T014 Prove the handshake and the served number (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport whatsapp echoes the handshake challenge$")` prints `Tests  1 passed` Observed `Tests  1 passed | 22 skipped (23)`
- [x] T015 Prove the shared cases still hold with the two new transports in the table (`$RT/tests/channel-transports.vitest.ts`). The `transport shared` block runs every case over every transport in the table, so adding Signal and WhatsApp extends it without a new test. Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport shared ")` prints `Tests  7 passed` Observed `Tests  8 passed | 15 skipped (23)`. The 7 in the verify is stale: child 005 left eight shared tests. The block is not table driven, so the Signal and WhatsApp cases were added inside the token, injection and golden tests with no new test
- [x] T016 Run the validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports --strict` prints `RESULT: PASSED` Observed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] T010 and T011 pass from the final state Observed `Test Files  56 passed (56)` and `Tests  765 passed (765)`, exit 0
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/spec.md` prints 4 Observed 4
- [x] CHK-002 [P0] The Wire Table has one row per transport. Verify: `rg -c '^\| `(signal|whatsapp)` \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/spec.md` prints 2 Observed 2
- [x] CHK-003 [P1] Dependencies available. Verify: T001 to T003 print what they say Observed: T001 printed `ok`, T002 and T003 each printed one heading line and both reference strings
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The typecheck passes. Verify: T011 exits 0 Observed exit 0
- [x] CHK-011 [P1] One parse on the webhook path, after the signature. Verify: `rg -c 'JSON.parse' $RT/lib/channel-whatsapp.ts` prints 1 Observed 1
- [x] CHK-012 [P1] No ephemeral label in a code comment. Verify: `rg -n 'REQ-0|T0[0-9]{2}|specs/' $RT/lib/channel-signal.ts $RT/lib/channel-whatsapp.ts` exits 1 Observed exit 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/acceptance-criteria.md` prints 4 Observed 4
- [x] CHK-021 [P0] The suite passes. Verify: T010 prints no `failed` Observed `Tests  765 passed (765)`
- [x] CHK-022 [P1] Every server a test opens binds loopback. Verify: `rg -n "listen\(0, '127.0.0.1'" $RT/tests/channel-transports.vitest.ts` prints at least two lines Observed 2 lines
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No unsigned body is parsed. Verify: T013 passes Observed: T013 passed
- [x] CHK-031 [P0] The listener binds loopback only. Verify: `rg -n '0\.0\.0\.0|::' $RT/lib/channel-whatsapp.ts` exits 1 Observed exit 1
- [x] CHK-032 [P1] No credential in a fixture. Verify: T008's `rg` exits 1 Observed exit 1
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Every Wire Table cell with a provider fact cites a source, says not stated or says UNKNOWN. Verify: `rg -o 'SOURCE: |not stated|UNKNOWN' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/spec.md | wc -l` prints a number above 12 Observed 19
- [x] CHK-041 [P2] The parent map names this child. Verify: `rg -n '006-daemon-and-webhook-transports/ \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md` prints the map row Observed line 263, the map row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the files of the spec's Files to Change table change. Verify: `git status --short .skilled` lists no other path beyond children 003 to 005 Observed the Files to Change rows plus `runtime/lib/channel-queue.ts`, the one deviation, recorded in implementation-summary.md
- [x] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/scratch -type f ! -name .gitkeep` prints nothing Observed nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-28
<!-- /ANCHOR:summary -->

---
