---
title: "Tasks: Phase 8: vault"
description: "Ordered tasks for the secret store, its three backends, the index lock, the `bots secret` verb group, the child-environment injection, the post-run scan and the `secretsUsed` record field, each with the command that proves it."
trigger_phrases:
  - "vault task list"
  - "secret store tasks"
  - "vault verification steps"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: vault

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

Short names keep the paths short. `R` is `.skilled/skills/system-skilled-bots/runtime` and `S` is `.skilled/skills/system-skilled-bots`. The tests plant the value `skilled-test-value-7f3a`, and `pb-vault` is the fixture bot `tests/secrets.vitest.ts` writes into the fixture checkout. `RUN` is the run folder the fixture prints.

`FIXTURE` and `STATE` come from one recipe, which keeps every CLI check off the operator's real state root and login keychain. It pins the state root in the fixture's own `bots/config.json`, which `jobEnv` and `userStateRoot` honor [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:783] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:105]. A pinned `SKILLED_BOTS_STATE_ROOT` in the shell is not isolated, because the verb resolves through the job environment, which turns it into `XDG_STATE_HOME` set to its parent folder [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:343-346].

```sh
FIXTURE=$(mktemp -d) && git -C "$FIXTURE" init -q && mkdir -p "$FIXTURE/bots" && printf '{"identity":"skilled-scratch/vault","stateRoot":"%s/state"}\n' "$FIXTURE" > "$FIXTURE/bots/config.json" && STATE="$FIXTURE/state/skilled-scratch%2Fvault"
mkdir -p "$FIXTURE/bots/pb-vault" && printf -- '---\nid: pb-vault\ntrigger: {kind: cron, expression: "0 9 * * *"}\nruntime: {kind: cli-codex}\nbudget: {maxIterations: 1, timeoutSeconds: 60}\nisolation: shared\ndelivery: local-only\nsecrets: absent\n---\nPrint the names of your environment variables only.\n' > "$FIXTURE/bots/pb-vault/BOT.md"
BADNAME=$(mktemp -d) && git -C "$BADNAME" init -q && mkdir -p "$BADNAME/bots/pb-bad" && cp "$FIXTURE/bots/config.json" "$BADNAME/bots/" && sed -e 's/pb-vault/pb-bad/' -e 's#secrets: absent#secrets: ../etc/passwd#' "$FIXTURE/bots/pb-vault/BOT.md" > "$BADNAME/bots/pb-bad/BOT.md"
```

`bot-check.cjs "$FIXTURE"` prints eight `PASS:` lines and exits 0 today, which proves `pb-vault` parses. Do not `bots run pb-vault` before this phase lands: today's runtime ignores `secrets` and would dispatch a real executor. `BADNAME` is a separate checkout, so AC-005's checker output holds only that bot's line.

Every CLI check that stores a value passes `--store file --repo "$FIXTURE"`. A check of the keychain path runs inside `tests/secrets.vitest.ts` behind the fake `security` (`design/backends.md` section 7), never against the login keychain.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the runtime modules this phase changes, the nine contract files and the seven `design/` notes, and record the refusal ids (`spec.md`). Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md` prints 19.
- [ ] T002 Capture the measured behavior the problem statement rests on (`spec.md`). Verify: `node .skilled/bin/bots.cjs secret set demo </dev/null 2>&1 | head -1` prints `bots: unknown verb: secret`, and `node .skilled/bin/bots.cjs secret set demo </dev/null >/dev/null 2>&1; echo "exit=$?"` prints `exit=2`.
- [ ] T003 Confirm the dispatch-env gate refuses a key outside its per-kind list (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: `rg -n 'is not allowed for' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints one line.
- [ ] T004 Confirm the identity's state folders carry no `secrets` entry today (`$R/lib/state-root.ts`). Verify: `rg -n 'secrets' $R/lib/state-root.ts` exits 1.
- [ ] T005 [P] Confirm `HonoredPosture` carries no `secretsUsed` today (`$R/lib/run-record.ts`). Verify: `rg -n 'secretsUsed' $R/lib/run-record.ts` exits 1.
- [ ] T006 [P] Confirm the record validator reads a field group as an object and never a posture key (`$R/lib/run-record.ts`). Verify: `rg -n 'FIELD_GROUPS' $R/lib/run-record.ts` prints two lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Store

- [ ] T007 Name and create the identity's `secrets` folder (`$R/lib/state-root.ts`). Verify: `rg -n 'secrets: join' $R/lib/state-root.ts` prints one line.
- [ ] T008 Create the store with `SECRET_NAME_PATTERN`, `SECRET_NAME_MAX = 64`, the 0600 value file and the 0700 folder narrowed on every write (`$R/lib/secrets.ts`, `design/names-and-keys.md` section 1, `design/backends.md` section 4). Verify: `rg -n 'export function setSecret' $R/lib/secrets.ts` prints one line.
- [ ] T040 Add `secretEnvKey(name)` and `keychainAccount(name, secretsFolder)`, the account `<name>@<first 12 hex of sha256(realpath(secretsFolder))>` (`$R/lib/secrets.ts`, `design/names-and-keys.md` sections 2 and 3). Verify: `rg -c 'export function (secretEnvKey|keychainAccount)' $R/lib/secrets.ts` prints 2.
- [ ] T009 Add the keychain and file backends behind one interface, chosen by the table in `design/backends.md` section 1 with `--store` overriding. The macOS write spawns `security -q -i` and writes one line, `add-generic-password -a <account> -s skilled-bots -U -w <hex>`, to its stdin. The read is `find-generic-password -a <account> -s skilled-bots -w` and the delete `delete-generic-password -a <account> -s skilled-bots`. The Linux commands are section 3. The password is the lowercase hex of the UTF-8 bytes, every spawn is an argv array with no shell, its output is never printed, and it is killed after 10,000 ms. The three keychain functions take an optional `keychainPath` that only tests pass (`$R/lib/secrets.ts`). Verify: `rg -c "add-generic-password -a |find-generic-password|delete-generic-password" $R/lib/secrets.ts` prints 3, `rg -c "'store'|'lookup'|'clear'" $R/lib/secrets.ts` prints 3 and `rg -n '10_000' $R/lib/secrets.ts` prints one line.
- [ ] T041 Refuse a keychain write line over 4,095 bytes as `secret-too-long` before the spawn, and a value over 16,384 code points on every backend (`$R/lib/secrets.ts`, `design/backends.md` section 2.3). Verify: `rg -n '4095' $R/lib/secrets.ts` prints one line and `rg -n '16_384' $R/lib/secrets.ts` prints one line.
- [ ] T042 Add `readSecretsIndex` with the validation table and the temp-and-rename writer, entries in name order and unknown keys kept (`$R/lib/secrets.ts`, `design/index-and-writes.md` sections 1 and 2.2). Verify: `rg -n 'export function readSecretsIndex' $R/lib/secrets.ts` prints one line.
- [ ] T043 Add the `secrets/index.lock` lock in the form of `contracts/answer-seam.md` step 6, polled every 25 ms with no deadline below the 60 s reclaim, and released in a `finally` (`$R/lib/secrets.ts`, `design/index-and-writes.md` section 2.1). Verify: `rg -n "'index.lock'" $R/lib/secrets.ts` prints one line.
- [ ] T010 Verify each write by reading it back in constant time and report a dropped, failed or timed-out write as `secret-write-dropped` with no index write (`$R/lib/secrets.ts`). Verify: `rg -n 'secret-write-dropped' $R/lib/secrets.ts` prints one line.
- [ ] T011 Add `listSecrets`, `forgetSecret`, `resolveSecret` and `knownSecretValues` with the write order of `design/index-and-writes.md` section 2.3, the orphan sweep of section 3 and the outcome map of `design/backends.md` section 6. None returns a value except `resolveSecret` and `knownSecretValues` (`$R/lib/secrets.ts`). Verify: `rg -c 'export function (listSecrets|forgetSecret|resolveSecret|knownSecretValues)' $R/lib/secrets.ts` prints 4.
- [ ] T044 Return `secret-store-unreadable` for every unreadable case REQ-017 lists (`$R/lib/secrets.ts`). Verify: `rg -c 'secret-store-unreadable' $R/lib/secrets.ts` prints at least 1.

### Lifted modules

- [ ] T012 Lift the one-pass matcher with its Apache-2.0 notice and a statement of changes (`$R/lib/secret-matcher.ts`). Verify: `rg -n 'Apache-2.0' $R/lib/secret-matcher.ts` prints one line.
- [ ] T013 Lift the placeholder guard and the constant-time compare with its notice (`$R/lib/secrets-guard.ts`). Verify: `rg -n 'Apache-2.0' $R/lib/secrets-guard.ts` prints one line.
- [ ] T014 Append a `## 008-vault` section to `THIRD_PARTY_NOTICES.md` with one entry per lifted file, naming its source path and its changes (`$S/THIRD_PARTY_NOTICES.md`). Verify: `rg -c 'Apache-2.0' $S/THIRD_PARTY_NOTICES.md` prints 2.

### Definition and record

- [ ] T015 Check the `secrets` value after `optionalString` against the grammar and the 64 character bound and refuse `secret-name-invalid` (`$R/lib/definition.ts`). Verify: `rg -n 'secret-name-invalid' $R/lib/definition.ts` prints one line.
- [ ] T016 Add `secretsUsed` to `HonoredPosture`, read as `[]` when absent, and extend `postRunCauses` as `contracts/records.md` section 4 types it, read as `[]` when absent. 005 lands the field, so this phase only writes rows into it and adds no second declaration (`$R/lib/run-record.ts`). Verify: `rg -c 'secretsUsed' $R/lib/run-record.ts` prints 2 and `rg -c 'postRunCauses' $R/lib/run-record.ts` prints at least 2.

### Dispatch and runner

- [ ] T017 Pass the resolved key on the `extraEnv` field 007 lands, so `dispatchInLineage` merges it into `dispatchEnv` and names it in `dispatchEnvKeys`. This phase adds no second field and no second merge (`$R/lib/runner.ts`, `design/injection-sequence.md` step 7). Verify: `rg -c 'extraEnv' $R/lib/runner.ts` prints 1.
- [ ] T018 Put the matcher behind `findSecretLiteral`, keeping its signature and return shape (`$R/lib/dispatch.ts`). Verify: `rg -n 'createSecretMatcher' $R/lib/dispatch.ts` prints one line.
- [ ] T019 Resolve the name after posture, build the known map through `collectAllKnownSecrets`, refuse `secret-unknown` and `secret-store-unreadable`, pass the key on `extraEnv` and record the name (`$R/lib/runner.ts`). Verify: `rg -n 'secret-unknown' $R/lib/runner.ts` prints one line, `rg -c 'secret-store-unreadable' $R/lib/runner.ts` prints at least 1 and `rg -c 'collectAllKnownSecrets' $R/lib/runner.ts` prints 1.
- [ ] T020 Run the post-run scan of `design/leak-checks.md` section 3 before `finalAnswerText`: the in-memory stdout, the child's captured stderr, every file under the run folder and the receipt folder, the plain, base64 and URL-encoded forms, the `[redacted: <name>]` token and one `postRunCauses` row (`$R/lib/runner.ts`). Verify: `rg -n 'secret-in-output' $R/lib/runner.ts` prints one line and `rg -n 'redacted: ' $R/lib/runner.ts` prints one line.
- [ ] T021 Build the delivery check's map through `collectAllKnownSecrets`, fail closed on an unreadable vault, and withhold every entry of a record whose `postRunCauses` holds `secret-in-output` (`$R/lib/delivery.ts`). Verify: `rg -n 'collectAllKnownSecrets' $R/lib/delivery.ts` prints one line and `rg -n 'withheld: secret-in-output' $R/lib/delivery.ts` prints one line.
- [ ] T022 Build the answer check's map through `collectAllKnownSecrets`, which covers both the answer text and 005's `answer confirm` settle, and refuse `secret-store-unreadable` when the vault cannot be read (`$R/lib/answer.ts`). Verify: `rg -n 'collectAllKnownSecrets' $R/lib/answer.ts` prints one line.
- [ ] T023 Prove the gate 007 lands still refuses an unnamed key: a dispatch that names `SKILLED_BOT_SECRET_DEMO` in `dispatchEnvKeys` and carries a second `SKILLED_BOT_SECRET_OTHER` key in `dispatchEnv` throws, because the gate admits only the keys the caller names (`$R/tests/secrets.vitest.ts`). Verify: `(cd $R && npx vitest run tests/secrets.vitest.ts -t "^dispatch env gate refuses an unnamed secret key$")` prints `Tests  1 passed`.

### CLI and docs

- [ ] T024 Add the `secret set|list|forget` verb group: `VERB_SPECS.secret` with `--store` on `set` only, the name check, the no-echo prompt and the read rules of `design/leak-checks.md` section 1, `secret-no-input` and `secret forget takes no --store`. The same file's `bots remember` check moves to `collectAllKnownSecrets`, which is 005's call site (`.skilled/bin/bots.cjs`). Verify: after the `FIXTURE` recipe, `node .skilled/bin/bots.cjs secret list --repo "$FIXTURE"` prints `bots: no secrets stored` and exits 0, and `rg -c 'collectAllKnownSecrets' .skilled/bin/bots.cjs` prints 1.
- [ ] T025 Replace the template comment that says the field is not enforced with the short form of the upgrade note (`$S/assets/bot-template.txt`). Verify: `rg -n 'secrets:' $S/assets/bot-template.txt` prints one line and `rg -n 'bots secret set' $S/assets/bot-template.txt` prints one line.
- [ ] T026 Add one row per new module to the files table (`$R/lib/README.md`). Verify: `rg -c 'secrets.ts' $R/lib/README.md` prints 1.
- [ ] T027 Update the author reference and the feature-catalog contract to say the field names a store entry, and add the upgrade note of `design/names-and-keys.md` section 4 verbatim to the author reference (`$S/bots-author/references/bot-definition.md`, `$S/feature-catalog/definition/bot-definition-contract.md`). Verify: `rg -n 'Upgrading to the vault' $S/bots-author/references/bot-definition.md` prints one line and `rg -c 'secrets' $S/bots-author/references/bot-definition.md $S/feature-catalog/definition/bot-definition-contract.md` prints two lines.

### Tests

- [ ] T028 Prove the keychain backend's argv and stdin through the fake `security` of `design/backends.md` section 7: a set with stdin a pipe and no tty stores the hex form, the write reaches `security -q -i` on stdin, and no recorded argv element holds the value or its hex form (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'argv log' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T029 Prove the same-user boundary: a child of a bot declaring no `secrets` reads another name's value file, and the record names no secret (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'same-user' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T030 Prove the post-run scan in a `describe('post-run scan')` block with three tests. `redacts the plain, base64 and URL-encoded forms` covers a `stdout.log` holding the value, its base64 form or its URL-encoded form redacted to `[redacted: demo]`, including a partial log from a killed child. `redacts the child's stderr` covers a child that writes the value to stderr. `withholds the delivery and keeps the exit` covers `secret-in-output` on `postRunCauses`, the withheld delivery and the run's own exit (`$R/tests/secrets.vitest.ts`). Verify: `(cd $R && npx vitest run tests/secrets.vitest.ts -t "^post-run scan ")` prints `Tests  3 passed`.
- [ ] T045 Prove the grammar on every row of `design/names-and-keys.md` section 1.1, through `parseDefinition` and through the verb (`$R/tests/secrets.vitest.ts`). Verify: `rg -c 'secret-name-invalid' $R/tests/secrets.vitest.ts` prints at least 4.
- [ ] T046 Prove the environment key on every accept row, including `slack-app-token` to `SKILLED_BOT_SECRET_SLACK_APP_TOKEN`, and its inverse (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'SKILLED_BOT_SECRET_SLACK_APP_TOKEN' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T047 Prove keychain forget through the fake `security`: the item and the entry are gone, a second forget says the name was not held, and `forget --store file` exits 2 (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'keychain forget' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T048 Prove the concurrent cases of `design/index-and-writes.md` section 5 with two child processes on one barrier file (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'racing set' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T049 Prove the stop table and the orphan rule: a stop after the value write and after the forget's index write each leave an orphan that `list` omits and the next `forget` removes, and a leftover temp file is removed (`$R/tests/secrets.vitest.ts`, `design/lifecycle.md` section 3). Verify: `rg -c 'leaves an orphan' $R/tests/secrets.vitest.ts` prints 2.
- [ ] T050 Prove `secret-too-long` on the file backend at 16,385 code points and on the keychain at a line of 4,096 bytes, with no spawn, and `secret-store-unreadable` for a malformed index, a newer `schemaVersion`, a fake `security` that sleeps past 10 s and a keychain item not in hex form (`$R/tests/secrets.vitest.ts`). Verify: `rg -c 'secret-too-long|secret-store-unreadable' $R/tests/secrets.vitest.ts` prints at least 6.
- [ ] T051 Prove the keychain account scope: two identities each set `demo`, the fake `security` holds two accounts, and one identity's forget leaves the other's value (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'account scope' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T052 Guard the login keychain: `beforeAll` asserts the first `security` on `PATH` is the fake, except in the one macOS test that uses a scratch keychain through `keychainPath` (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'login keychain guard' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T053 Prove a bot that declares both `apps` and `secrets` reaches dispatch with both keys: `UTCP_CONFIG_FILE` and `SKILLED_BOT_SECRET_DEMO` sit in `dispatchEnv`, both are named in `dispatchEnvKeys`, and the gate admits the pair (`$R/tests/secrets.vitest.ts`). Verify: `(cd $R && npx vitest run tests/secrets.vitest.ts -t "^dispatch env gate carries apps and secrets together$")` prints `Tests  1 passed`.
- [ ] T054 Add `onStderr?: (text: string) => void` to `RunAuditedExecutorCommandInput` and call it with the child's stderr instead of writing that stream to the bots process's stderr, so dispatch captures it and the post-run scan redacts it before it is re-emitted or written (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `design/leak-checks.md` section 3.1). Verify: `rg -c 'onStderr' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2.
- [ ] T055 Migrate every `collectKnownSecrets` call site that exists at build time to `collectAllKnownSecrets`, 005's `bots remember` check in `bots.cjs` and its `answer confirm` settle in `answer.ts` included, so no surface keeps the environment-only map (`$R/lib/runner.ts`, `$R/lib/delivery.ts`, `$R/lib/answer.ts`, `.skilled/bin/bots.cjs`, `design/leak-checks.md` section 2). Verify: `rg -n 'export function collectKnownSecrets' $R/lib` prints one line, and `rg -n 'collectKnownSecrets\(' $R/lib .skilled/bin/bots.cjs` prints two lines, the definition and the one call inside `collectAllKnownSecrets`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T031 Run the store and matcher tests (`$R/tests/secrets.vitest.ts`, `$R/tests/secret-matcher.vitest.ts`). Verify: `cd $R && npm test -- tests/secrets.vitest.ts tests/secret-matcher.vitest.ts` exits 0.
- [ ] T032 Run the whole runtime suite (`$R/tests/`). Verify: `cd $R && npm test` exits 0.
- [ ] T033 Run the typecheck (`$R/tsconfig.json`). Verify: `cd $R && npm run typecheck` exits 0.
- [ ] T034 Run the definition checker on the clean fixture (`$S/scripts/bot-check.cjs`). Verify: `node $S/scripts/bot-check.cjs $S/scripts/fixtures/clean` exits 0.
- [ ] T035 Run the fixture bot declaring `secrets: demo`, whose body prints its environment's names only, and scan its run folder and its `agent-logs` file for the planted value, in a `describe('secret injection')` block whose one test is `injects the key and leaks no value` (`$R/tests/secrets.vitest.ts`). Verify: `(cd $R && npx vitest run tests/secrets.vitest.ts -t "^secret injection injects the key and leaks no value$")` prints `Tests  1 passed`.
- [ ] T036 Confirm the record carries the name and not the value (`$R/tests/secrets.vitest.ts`). Verify: `jq '.posture.secretsUsed' "$STATE"/records/*.json` prints `["demo"]`.
- [ ] T037 Confirm an unknown name refuses before dispatch (`$R/tests/secrets.vitest.ts`). Verify: `node .skilled/bin/bots.cjs run pb-vault --repo "$FIXTURE"` prints `refused before dispatch (secret-unknown)` and exits 4.
- [ ] T038 Confirm no verb prints a value. Verify: after `printf 'skilled-test-value-7f3a\n' | node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE"`, `node .skilled/bin/bots.cjs secret list --repo "$FIXTURE" | rg -c 'skilled-test-value-7f3a'` exits 1.
- [ ] T039 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/008-vault/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/008-vault --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Design notes**: See `design/`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md` prints 19.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 3. ARCHITECTURE' specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md` prints one line.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `rg -n '^## 6. DEPENDENCIES' specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md` prints one line.
- [ ] CHK-004 [P1] Every design decision a task needs is in a design note. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/008-vault/design | wc -l` prints 7.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The typecheck passes. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] CHK-011 [P0] The suite passes with no skipped secret test, the one macOS scratch keychain test aside on another platform. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] CHK-012 [P1] Every store refusal names its reason and its detail. Verify: `rg -c "reason: 'secret-" .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` prints at least 5.
- [ ] CHK-013 [P1] The new modules follow the runtime's section-comment layout. Verify: `rg -c '^// [0-9]\. ' .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` prints at least 3.
- [ ] CHK-014 [P0] No keychain spawn goes through a shell. Verify: `rg -n 'shell: true' .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` exits 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is Met, and there is at least one per requirement. Verify: `test "$(rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md)" -ge "$(rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md)"` exits 0.
- [ ] CHK-021 [P0] The fixture run proves the injection. Verify: `(cd $R && npx vitest run tests/secrets.vitest.ts -t "^secret injection injects the key and leaks no value$")` prints `Tests  1 passed`, and `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1.
- [ ] CHK-022 [P1] The backend matrix is covered: keychain through the fake `security`, keychain through the fake `secret-tool` and file, each with a stored, absent and unreadable store. Verify: `rg -c "backend" .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 6.
- [ ] CHK-023 [P1] The adversarial names are covered: a slash, `..`, an empty name on the verb and a 65-character name. Verify: `rg -c 'secret-name-invalid' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 4.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Verify: `rg -n 'secrets' .skilled/skills/system-skilled-bots/runtime/lib` names only `definition.ts` before the change.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Verify: `rg -n 'posture\.secrets|secretsUsed|postRunCauses|collectKnownSecrets|findSecretLiteral' .skilled --glob '*.ts' --glob '*.cjs'` names every consumer.
- [ ] CHK-FIX-004 [P0] Security fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. Verify: `rg -c 'secret-name-invalid|secret-too-long|secret-empty' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 3.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md` prints one line.
- [ ] CHK-FIX-006 [P1] Hostile env variant executed when tests or code read process-wide state. Verify: `rg -c 'process\.env' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 1.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret in the new modules or the tests. Verify: `rg -n 'ghp_|sk-[A-Za-z0-9]{20}' .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` exits 1.
- [ ] CHK-031 [P0] The store folder is 0700 and every file it writes is 0600. Verify: after T038, `stat -f '%Lp' "$STATE/secrets"` prints 700 and `stat -f '%Lp' "$STATE/secrets/index.json" "$STATE/secrets/demo.value"` prints 600 twice.
- [ ] CHK-032 [P1] The value reaches the child environment only. Verify: `rg -c 'skilled-test-value-7f3a' "$RUN" "$STATE"/records/*.json` exits 1.
- [ ] CHK-033 [P0] A child that prints the value is caught after the run. Verify: `rg -c 'secret-in-output' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 1.
- [ ] CHK-034 [P1] The keychain set leaves no value and no hex form in any argv. Verify: `rg -n 'argv log' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints one line.
- [ ] CHK-035 [P1] The same-user boundary is stated and pinned. Verify: `rg -n 'same-user' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints one line.
- [ ] CHK-036 [P0] No test touches the login keychain. Verify: `rg -n 'login keychain guard' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints one line, and `security find-generic-password -s skilled-bots >/dev/null 2>&1; echo "exit=$?"` prints `exit=44` after the suite on a host where the operator has stored nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on the refusal ids. Verify: `rg -c 'secret-unknown' specs/system-skilled-bots/003-openbot-parity-build/008-vault/{spec,plan,tasks,acceptance-criteria}.md` prints four lines.
- [ ] CHK-041 [P1] The template comment no longer says the field is unenforced. Verify: `rg -n 'does not enforce' .skilled/skills/system-skilled-bots/assets/bot-template.txt` exits 1.
- [ ] CHK-042 [P2] The bot template names the verb that fills the store. Verify: `rg -n 'bots secret' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/008-vault/scratch` lists no tracked artifact.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `git status --porcelain specs/system-skilled-bots/003-openbot-parity-build/008-vault/scratch` prints nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->
