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
    completion_pct: 0
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
**Status:** Draft
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
| AC-001 | REQ-001 | Given a pipe, When the operator runs `bots secret set demo` and supplies a value, Then the value is stored and never echoed. Given a closed stdin, Then it refuses `secret-no-input` with exit 2 | `printf 'skilled-test-value-7f3a\n' \| node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE" 2>&1 \| rg -c 'skilled-test-value-7f3a'` exits 1, and `node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE" < /dev/null; echo "exit=$?"` prints `secret-no-input` and `exit=2` | Unmet | - |
| AC-002 | REQ-002 | Given a host with a keychain program, When `bots secret set demo` runs with `--store file`, Then the index records `file` and the value file is 0600 | `jq -r '.entries.demo.backend' "$STATE/secrets/index.json"` prints `file`, and `stat -f '%Lp' "$STATE/secrets/demo.value"` prints 600 | Unmet | - |
| AC-003 | REQ-003 | Given a stored value, When `bots secret list` runs, Then it prints the name, the backend and the timestamps and no value | `node .skilled/bin/bots.cjs secret list --repo "$FIXTURE" \| rg -c 'skilled-test-value-7f3a'` exits 1, and the same command piped to `rg -c '^demo file '` prints 1 | Unmet | - |
| AC-004 | REQ-004 | Given a stored name, When `bots secret forget demo` runs twice, Then both exit 0, the second says the name was not held, and `list` omits it | `node .skilled/bin/bots.cjs secret forget demo --repo "$FIXTURE"; echo "exit=$?"` prints `exit=0` twice and the second run prints `bots: secret demo was not held`, and `bots secret list --repo "$FIXTURE"` prints `bots: no secrets stored` | Unmet | - |
| AC-005 | REQ-005 | Given a `BOT.md` with `secrets: ../etc/passwd`, When the checker runs, Then it prints `FAIL: definition.secret-name-invalid` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$BADNAME"` prints that line and exits 1 | Unmet | - |
| AC-006 | REQ-006 | Given a bot declaring `secrets: absent`, When `bots run` starts, Then it prints `refused before dispatch (secret-unknown)` and exits 4 | `node .skilled/bin/bots.cjs run pb-vault --repo "$FIXTURE"; echo "exit=$?"` prints the refusal line and `exit=4` | Unmet | - |
| AC-007 | REQ-007 | Given a bot declaring `secrets: demo` whose body prints its environment's names only (`env \| sed 's/=.*//'`), When the run completes, Then the child saw `SKILLED_BOT_SECRET_DEMO`, the run folder holds no value, and the child's own output on stdout and on stderr holds the name without the value | (cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "^secret injection injects the key and leaks no value$")` prints `Tests  1 passed`, and `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1 | Unmet | - |
| AC-008 | REQ-008 | Given a completed run, When the record is read, Then `posture.secretsUsed` is `["demo"]`, and a record written before this phase validates with `[]` | `jq -c '.posture.secretsUsed' "$STATE"/records/*.json` prints `["demo"]`, and `tests/run-record.vitest.ts` passes a record without the field | Unmet | - |
| AC-009 | REQ-009 | Given a stored value, When a body, a question, an answer, a request prompt or a delivery message holds it, Then the run refuses `body-secret`, the answer refuses `answer-secret` or the delivery is not sent. Given a vault that cannot be read, Then each check fails closed | `tests/secrets.vitest.ts` covers the five surfaces and the unreadable vault, and `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 | Unmet | - |
| AC-010 | REQ-010 | Given an empty line or a known placeholder, When `bots secret set demo` runs, Then it exits 2 with `secret-empty` or `secret-placeholder` and stores nothing | `printf 'dev-secret-change-me-please-32chars\n' \| node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE"; echo "exit=$?"` prints `secret-placeholder` and `exit=2`, and `test -e "$STATE/secrets/demo.value"` exits 1 | Unmet | - |
| AC-011 | REQ-011 | Given a backend that reports success and stores nothing, When `bots secret set demo` runs, Then it exits 4 with `secret-write-dropped`, the exit `contracts/refusals.md` section 3.7 gives it, and the index is not written | the fake `security` in dropped mode in `tests/secrets.vitest.ts` passes under `npm test` | Unmet | - |
| AC-012 | REQ-012 | Given the two lifted files, When the notices are read, Then each names its source path and its changes, and `THIRD_PARTY_NOTICES.md` holds two entries | `rg -c 'Apache-2.0' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints 2, and `rg -c 'Apache-2.0' .skilled/skills/system-skilled-bots/runtime/lib/secret-matcher.ts .skilled/skills/system-skilled-bots/runtime/lib/secrets-guard.ts` prints two lines | Unmet | - |
| AC-013 | REQ-013 | Given 20 stored values and a 10,000-character text, When `findSecretLiteral` runs, Then it returns the same match as a per-value scan and the existing dispatch tests still pass | `cd .skilled/skills/system-skilled-bots/runtime && npm test -- tests/secret-matcher.vitest.ts tests/dispatch.vitest.ts` exits 0 | Unmet | - |
| AC-014 | REQ-014 | Given a child that prints the value, its base64 form or its URL-encoded form on stdout or on stderr, When the run ends, Then every match in the run folder reads `[redacted: demo]`, one `secret-in-output` row is on `postRunCauses`, every delivery entry is `not-attempted` with `withheld: secret-in-output`, and the run keeps its own exit | (cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "^post-run scan ")` prints `Tests  3 passed`, and `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1 | Unmet | - |
| AC-015 | REQ-015 | Given a bot declaring no `secrets`, When its child reads `$STATE/secrets/demo.value`, Then the read succeeds and the record names no secret, so the boundary is the OS user and not the grant | `tests/secrets.vitest.ts` pins the read, and `jq -c '.posture.secretsUsed' "$STATE"/records/*.json` prints `[]` for that run | Unmet | - |
| AC-016 | REQ-002 | Given the fake `security` on `PATH`, When `bots secret set demo` runs with stdin a pipe and no tty, Then the set completes, the write reached `security -q -i` on stdin in hex form, and no recorded argv element holds the value or its hex form | the argv log of the fake `security` holds no `skilled-test-value-7f3a` and no `736b696c6c65642d746573742d76616c75652d37663361`, and `tests/secrets.vitest.ts` asserts it | Unmet | - |
| AC-017 | REQ-017 | Given an index that is not JSON, or carries `schemaVersion: 2`, When a run of a bot declaring `secrets: demo` starts and when `bots secret list` runs, Then the run refuses `secret-store-unreadable` with exit 4 and `list` prints `bots: secret-store-unreadable:` and exits 4, and neither reads the store as empty | `tests/secrets.vitest.ts` covers both indexes on the run and the verb | Unmet | - |
| AC-018 | REQ-016 | Given a value of 16,385 code points on the file backend, or a value whose keychain write line is 4,096 bytes, When `bots secret set demo` runs, Then it refuses `secret-too-long` with exit 2, stores nothing and spawns no keychain program | `tests/secrets.vitest.ts` covers both bounds and asserts the fake `security` log is empty | Unmet | - |
| AC-019 | REQ-017 | Given a fake `security` that sleeps for 30 s, When a run resolves a keychain name, Then the read is killed at 10 s and the run refuses `secret-store-unreadable` | `tests/secrets.vitest.ts` asserts the refusal and an elapsed time under 15 s | Unmet | - |
| AC-020 | REQ-002 | Given two identities that each set `demo` into the keychain, When one forgets `demo`, Then the other still resolves its own value, because each item's account is `demo@<scope>` with its own scope | `tests/secrets.vitest.ts` "account scope" case passes under `npm test` | Unmet | - |
| AC-021 | REQ-018 | Given a `set` stopped after its value write, or a `forget` stopped after its index write, When `list` and a run follow, Then `list` omits the name, the run refuses `secret-unknown`, and the next `forget` removes the orphan and any leftover temp file | `tests/secrets.vitest.ts` "leaves an orphan" cases pass under `npm test` | Unmet | - |
| AC-022 | REQ-018 | Given two `set` calls started together on different names, and on the same name with different values, When both finish, Then both exit 0, the index holds both names, and the same-name entry holds the value of the call that took the lock second | `tests/secrets.vitest.ts` "racing set" case passes under `npm test` | Unmet | - |
| AC-023 | REQ-005 | Given every row of `design/names-and-keys.md` section 1.1, When each is parsed as `secrets:` and passed to `bots secret set`, Then each accept row parses and each refuse row is `secret-name-invalid`, except the empty definition value, which keeps `secrets-invalid` | `tests/secrets.vitest.ts` walks the table, and `node .skilled/bin/bots.cjs secret set Demo --repo "$FIXTURE" < /dev/null; echo "exit=$?"` prints `secret-name-invalid` and `exit=2` | Unmet | - |
| AC-024 | REQ-007 | Given a bot declaring `secrets: slack-app-token`, When it runs, Then its child sees `SKILLED_BOT_SECRET_SLACK_APP_TOKEN` and no other `SKILLED_BOT_SECRET_` key | `tests/secrets.vitest.ts` asserts the key set, and `rg -n 'SKILLED_BOT_SECRET_SLACK_APP_TOKEN' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints one line | Unmet | - |
| AC-025 | REQ-004 | Given a name stored in the keychain through the fake `security`, When `bots secret forget` runs, Then the item and the entry are gone, and `forget --store file` is refused with exit 2 | `tests/secrets.vitest.ts` "keychain forget" case passes, and `node .skilled/bin/bots.cjs secret forget demo --store file --repo "$FIXTURE"; echo "exit=$?"` prints `secret forget takes no --store` and `exit=2` | Unmet | - |
| AC-026 | REQ-019 | Given the suite, When it runs, Then no test reaches the login keychain | `tests/secrets.vitest.ts` "login keychain guard" passes, and `security find-generic-password -s skilled-bots >/dev/null 2>&1; echo "exit=$?"` prints `exit=44` after the suite on a host where the operator has stored nothing | Unmet | - |
| AC-027 | REQ-014 | Given a child that writes the value to stderr, When the run ends, Then the stream is captured before it reaches the bots process's stderr, the redacted copy is what is re-emitted or written, no match survives under `$STATE/agent-logs`, and one `secret-in-output` row is on `postRunCauses` | (cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts -t "^post-run scan redacts the child's stderr$")` prints `Tests  1 passed`, and `rg -c 'skilled-test-value-7f3a' "$STATE"/agent-logs` exits 1 | Unmet | - |

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

All 26 rows are unmet: no verb stores a value yet, so every later criterion has nothing to read.
<!-- /ANCHOR:closure -->
