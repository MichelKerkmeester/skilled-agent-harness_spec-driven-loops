---
title: "Acceptance Criteria: Phase 8: vault"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vault acceptance criteria"
  - "secret store criteria"
  - "vault closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/008-vault"
    last_updated_at: "2026-11-25T07:13:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-vault"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: vault

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/008-vault
**Level:** 2
**Status:** Complete
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Short names keep the checks concrete. `skilled-test-value-7f3a` is the value the tests plant. `RUN` is the run folder the fixture prints. `FIXTURE` is the throwaway checkout with the bot `pb-vault`, `BADNAME` a second one whose bot names `../etc/passwd`, and `STATE` the identity folder, all made by the recipe in `tasks.md` Task Notation, which pins the state root in the fixture's own `bots/config.json` so no check reaches the operator's real state root. Every CLI check that stores a value passes `--store file --repo "$FIXTURE"`, and every keychain check runs inside `tests/secrets.vitest.ts` behind the fake `security`, so no check writes to the login keychain.

A scan that must find nothing is stated as `exits 1`, never as `prints 0`: `rg -c` prints nothing and exits 1 when it matches nothing, so a count of zero is never observed. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/review-3-findings.md:20]

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a pipe, When the operator runs `bots secret set demo` and supplies a value, Then the value is stored and never echoed. Given a closed stdin, Then it refuses `secret-no-input` with exit 2 | `printf 'skilled-test-value-7f3a\n' \| node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE" 2>&1 \| rg -c 'skilled-test-value-7f3a'` exits 1, and `node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE" < /dev/null; echo "exit=$?"` prints `secret-no-input` and `exit=2` Observed 2026-11-28: the piped set's output scan exited 1, and the closed-stdin set printed `bots: secret-no-input: demo` with `exit=2`. | Met | - |
| AC-002 | REQ-002 | Given a host with a keychain program, When `bots secret set demo` runs with `--store file`, Then the index records `file` and the value file is 0600 | `jq -r '.entries.demo.backend' "$STATE/secrets/index.json"` prints `file`, and `stat -f '%Lp' "$STATE/secrets/demo.value"` prints 600 Observed: `jq` printed `file`, `stat` printed 600 for `demo.value`, and 700 and 600 for the folder and `index.json`. | Met | - |
| AC-003 | REQ-003 | Given a stored value, When `bots secret list` runs, Then it prints the name, the backend and the timestamps and no value | `node .skilled/bin/bots.cjs secret list --repo "$FIXTURE" \| rg -c 'skilled-test-value-7f3a'` exits 1, and the same command piped to `rg -c '^demo file '` prints 1 Observed: the value scan of `list` exited 1 and `rg -c '^demo file '` printed 1. | Met | - |
| AC-004 | REQ-004 | Given a stored name, When `bots secret forget demo` runs twice, Then both exit 0, the second says the name was not held, and `list` omits it | `node .skilled/bin/bots.cjs secret forget demo --repo "$FIXTURE"; echo "exit=$?"` prints `exit=0` twice and the second run prints `bots: secret demo was not held`, and `bots secret list --repo "$FIXTURE"` prints `bots: no secrets stored` Observed: a forget printed `bots: secret demo forgotten` with exit 0, the next two printed `bots: secret demo was not held` with `exit=0`, and `list` printed `bots: no secrets stored`. | Met | - |
| AC-005 | REQ-005 | Given a `BOT.md` with `secrets: ../etc/passwd`, When the checker runs, Then it prints `FAIL: definition.secret-name-invalid` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$BADNAME"` prints that line and exits 1 Observed: the checker printed `FAIL: definition.secret-name-invalid: bots/pb-bad/BOT.md: secret-name-invalid (...)` and exited 1. | Met | - |
| AC-006 | REQ-006 | Given a bot declaring `secrets: absent`, When `bots run` starts, Then it prints `bots: pb-vault refused before dispatch (secret-unknown): absent is not stored, run bots secret set absent` and exits 4 | `node .skilled/bin/bots.cjs run pb-vault --repo "$FIXTURE"; echo "exit=$?"` prints the refusal line and `exit=4` Observed with `--skilled-tree` set to a scratch tree: the exact refusal line and `exit=4`, and the record's `exit.refusal.cause` is `secret-unknown`. Run from a worktree checkout without that flag, the run refuses `run-folder-refused` (`skilled-tree-is-worktree`) first, a host fact older than this phase. | Met | - |
| AC-007 | REQ-007 | Given a bot declaring `secrets: demo` whose body prints its environment's names only (`env \| sed 's/=.*//'`), When the run completes, Then the child saw `SKILLED_BOT_SECRET_DEMO`, the run folder holds no value, and the child's own output on stdout and on stderr holds the name without the value | (cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "^secret injection injects the key and leaks no value$")` prints `Tests  1 passed`, and `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1 Observed: the test printed `Tests  1 passed`. A live cli-codex run of `pb-vault` with `secrets: demo` converged, its `stdout.log` holds `SKILLED_BOT_SECRET_DEMO`, the value scan of `$RUN` exited 1, and the bots process's own stdout and stderr hold the key name and no value. | Met | - |
| AC-008 | REQ-008 | Given a completed run, When the record is read, Then `posture.secretsUsed` is `["demo"]`, and a record written before this phase validates with `[]` | `jq -c '.posture.secretsUsed' "$STATE"/records/*.json` prints `["demo"]`, and `tests/run-record.vitest.ts` passes a record without the field Observed: the live run's `jq -c` printed `["demo"]`, and `tests/run-record.vitest.ts` printed `Tests  13 passed` with a posture that carries no `secretsUsed`. No reader consumes the field yet, so the `[]` reading is a contract for later readers. | Met | - |
| AC-009 | REQ-009 | Given a stored value, When a body, a question, an answer, a request prompt or a delivery message holds it, Then the run refuses `body-secret`, the answer refuses `answer-secret` or the delivery is not sent. Given a vault that cannot be read, Then each check fails closed | `tests/secrets.vitest.ts` covers the five surfaces and the unreadable vault, and `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 Observed: the `leak surfaces` block (4 tests) and the `unreadable vault` block (2 tests) pass inside `Tests  43 passed`, and `npm test` printed `Test Files  49 passed (49)` and `Tests  634 passed (634)`, exit 0. | Met | - |
| AC-010 | REQ-010 | Given an empty line, When `bots secret set demo` runs, Then it exits 2 with `secret-empty` and stores nothing | `printf '\n' \| node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE"; echo "exit=$?"` prints `secret-empty` and `exit=2`, and `test -e "$STATE/secrets/demo.value"` exits 1 Observed: `bots: secret-empty: demo`, `exit=2`, and `test -e` exited 1. | Met | - |
| AC-011 | REQ-011 | Given a backend that reports success and stores nothing, When `bots secret set demo` runs, Then it exits 4 with `secret-write-dropped`, the exit `contracts/refusals.md` section 3.7 gives it, and the index is not written | the fake `security` in dropped mode in `tests/secrets.vitest.ts` passes under `npm test` Observed: `reports a dropped write` passes under `npm test`, the index holds no entry afterwards, and `bots.cjs` maps `secret-write-dropped` to exit 4. | Met | - |
| AC-012 | REQ-012 | Given the one lifted file, When the notices are read, Then it names its source path and its changes, `THIRD_PARTY_NOTICES.md` holds one 008 entry and no `secrets-guard.ts` exists | `rg -c 'Apache-2.0' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints 1, `rg -c 'Apache-2.0' .skilled/skills/system-skilled-bots/runtime/lib/secret-matcher.ts` prints 1, and `test -e .skilled/skills/system-skilled-bots/runtime/lib/secrets-guard.ts` exits 1 Observed: both counts printed 1 and `test -e` exited 1. The `## 008-vault` section names `packages/core/src/messages/secret-matcher.ts` and its test. | Met | - |
| AC-013 | REQ-013 | Given 20 stored values and a 10,000-character text, When `findSecretLiteral` runs, Then it returns the same match as a per-value scan and the existing dispatch tests still pass | `cd .skilled/skills/system-skilled-bots/runtime && npm test -- tests/secret-matcher.vitest.ts tests/dispatch.vitest.ts` exits 0 Observed: `Test Files  2 passed (2)` and `Tests  29 passed (29)`, exit 0. | Met | - |
| AC-014 | REQ-014 | Given a child that prints the value, its lowercase hex form, its base64 form with or without padding or its URL-encoded form on stdout or on stderr, When the run ends, Then every match in the run folder reads `[redacted: demo]`, one `secret-in-output` row is on `postRunCauses`, every delivery entry is `not-attempted` with `withheld: secret-in-output`, and the run keeps its own exit | (cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "^post-run scan ")` prints `Tests  3 passed`, and `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1 Observed: the `post-run scan` block printed `Tests  3 passed`. The live run's `$RUN` scan exited 1. | Met | - |
| AC-015 | REQ-015 | Given a bot declaring no `secrets`, When its child reads `$STATE/secrets/demo.value`, Then the read succeeds and the record names no secret, so the boundary is the OS user and not the grant | `tests/secrets.vitest.ts` pins the read, and `jq -c '.posture.secretsUsed' "$STATE"/records/*.json` prints `[]` for that run Observed: the `vault boundary` test passes. A live cli-codex run of `pb-reader`, which declares no `secrets`, read the value file (it printed `23`), and its record's `posture.secretsUsed` is `[]`. | Met | - |
| AC-016 | REQ-002 | Given the fake `security` on `PATH`, When `bots secret set demo` runs with stdin a pipe and no tty, Then the set completes, the write reached `security -q -i` on stdin in hex form, and no recorded argv element holds the value or its hex form | the argv log of the fake `security` holds no `skilled-test-value-7f3a` and no `736b696c6c65642d746573742d76616c75652d37663361`, and `tests/secrets.vitest.ts` asserts it Observed: the `keychain backend` test that stores the hex form through stdin asserts that no argv element holds the value or its hex form, and passes. | Met | - |
| AC-017 | REQ-017 | Given an index that is not JSON, or carries `schemaVersion: 2`, When a run of a bot declaring `secrets: demo` starts and when `bots secret list` runs, Then the run refuses `secret-store-unreadable` with exit 4 and `list` prints `bots: secret-store-unreadable:` and exits 4, and neither reads the store as empty | `tests/secrets.vitest.ts` covers both indexes on the run and the verb Observed: `reads a malformed or newer index as unreadable`, `fails every check closed` and `refuses a newer index on a run and on the verb` pass. The CLI `list` exits 4 with `bots: secret-store-unreadable:`. | Met | - |
| AC-018 | REQ-016 | Given a value of 16,385 code points on the file backend, or a value whose keychain write line is 4,096 bytes, When `bots secret set demo` runs, Then it refuses `secret-too-long` with exit 2, stores nothing and spawns no keychain program | `tests/secrets.vitest.ts` covers both bounds and asserts the fake `security` log is empty Observed: `refuses an empty and an over-long value` (16,385 code points) and `refuses a keychain line over the bound and spawns nothing`, which asserts an empty fake log, both pass. | Met | - |
| AC-019 | REQ-017 | Given a fake `security` that sleeps for 30 s, When a run resolves a keychain name, Then the read is killed at 10 s and the run refuses `secret-store-unreadable` | `tests/secrets.vitest.ts` asserts the refusal and an elapsed time under 15 s Observed: `kills a keychain read that does not answer` asserts `secret-store-unreadable`, the detail `did not answer within 10 s` and an elapsed time under 15,000 ms, and passes. | Met | - |
| AC-020 | REQ-002 | Given two identities that each set `demo` into the keychain, When one forgets `demo`, Then the other still resolves its own value, because each item's account is `demo@<scope>` with its own scope | `tests/secrets.vitest.ts` "account scope" case passes under `npm test` Observed: `account scope keeps two identities apart` passes. | Met | - |
| AC-021 | REQ-018 | Given a `set` stopped after its value write, or a `forget` stopped after its index write, When `list` and a run follow, Then `list` omits the name, the run refuses `secret-unknown`, and the next `forget` removes the orphan and any leftover temp file | `tests/secrets.vitest.ts` "leaves an orphan" cases pass under `npm test` Observed: both `leaves an orphan` cases and `forget removes an orphan the index does not name` pass. | Met | - |
| AC-022 | REQ-018 | Given two `set` calls started together on different names, and on the same name with different values, When both finish, Then both exit 0, the index holds both names, and the same-name entry holds the value of the call that took the lock second | `tests/secrets.vitest.ts` "racing set" case passes under `npm test` Observed: `racing set on two names and on one name` passes. | Met | - |
| AC-023 | REQ-005 | Given every row of `design/names-and-keys.md` section 1.1, When each is parsed as `secrets:` and passed to `bots secret set`, Then each accept row parses and each refuse row is `secret-name-invalid`, except the empty definition value, which keeps `secrets-invalid` | `tests/secrets.vitest.ts` walks the table, and `node .skilled/bin/bots.cjs secret set Demo --repo "$FIXTURE" < /dev/null; echo "exit=$?"` prints `secret-name-invalid` and `exit=2` Observed: `walks the accept and refuse table` passes, and the CLI printed `bots: secret-name-invalid: Demo` with `exit=2`. | Met | - |
| AC-024 | REQ-007 | Given a bot declaring `secrets: slack-app-token`, When it runs, Then its child sees `SKILLED_BOT_SECRET_SLACK_APP_TOKEN` and no other `SKILLED_BOT_SECRET_` key | `tests/secrets.vitest.ts` asserts the key set, and `rg -n 'SKILLED_BOT_SECRET_SLACK_APP_TOKEN' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints one line Observed: `gives a hyphenated name its one key` passes and the `rg -n` printed one line. | Met | - |
| AC-025 | REQ-004 | Given a name stored in the keychain through the fake `security`, When `bots secret forget` runs, Then the item and the entry are gone, and `forget --store file` is refused with exit 2 | `tests/secrets.vitest.ts` "keychain forget" case passes, and `node .skilled/bin/bots.cjs secret forget demo --store file --repo "$FIXTURE"; echo "exit=$?"` prints `secret forget takes no --store` and `exit=2` Observed: `keychain forget removes the item and the entry` passes, and the CLI printed `bots: secret forget takes no --store` with `exit=2`. | Met | - |
| AC-026 | REQ-019 | Given the suite, When it runs, Then no test reaches the login keychain | `tests/secrets.vitest.ts` "login keychain guard" passes, and `security find-generic-password -s skilled-bots >/dev/null 2>&1; echo "exit=$?"` prints `exit=44` after the suite on a host where the operator has stored nothing Observed: `login keychain guard` passes, and `security find-generic-password -s skilled-bots` printed `exit=44` after the full suite. | Met | - |
| AC-027 | REQ-014 | Given a child that writes the value to stderr, When the run ends, Then the stream is captured before it reaches the bots process's stderr, the redacted copy is what is re-emitted or written, no match survives under `$STATE/agent-logs`, and one `secret-in-output` row is on `postRunCauses` | (cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "^post-run scan redacts the child's stderr$")` prints `Tests  1 passed`, and `rg -c 'skilled-test-value-7f3a' "$STATE"/agent-logs` exits 1 Observed: the stderr test printed `Tests  1 passed`. `$STATE/agent-logs` holds only a scheduled job's streams and a manual run makes none, so the scan ran on the bots process's stderr from the live run instead. It holds the key name and no value (exit 1), and no form of the value exists under the state root or the run tree. | Met | - |
| AC-028 | REQ-020 | Given a stored value, When `bots secret set demo` runs and the index is read, Then `entries.demo.setBy` names the actor `resolveActor` returned, an entry written before the actor was recorded reads as `null` and `bots secret list` prints no actor | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "^secret index records the actor and keeps it out of list$")` prints `Tests  1 passed` Observed: `Tests  1 passed`. | Met | - |
| AC-029 | REQ-021 | Given a stored value holding a double quote and a backslash, When a cli-deepseek-harness child prints it inside its JSON final event, Then the answer, the stream and the run folder carry `[redacted: <name>]` and neither the raw nor the JSON-escaped value, and `postRunCauses` holds `secret-in-output` with the name. Given a child that prints every character of a stored value as a Unicode escape, When the runner decodes the answer, Then the answer is redacted and the one `secret-in-output` row names the answer | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "redacts a (JSON\|unicode)-escaped value")` prints `Tests  2 passed` Observed 2026-11-28: against the base runner both tests failed with the raw value in the answer (`Tests  2 failed`), and with the fix both passed (`Tests  2 passed`). | Met | - |

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

All 29 rows are met with observed evidence. AC-006 and AC-027 record where the literal command could not run as written and which surface was checked instead.
<!-- /ANCHOR:closure -->
