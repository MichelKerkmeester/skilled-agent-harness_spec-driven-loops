---
title: "Feature Specification: Phase 8: vault"
description: "A bot's `secrets:` field is parsed and never resolved, so a bot that needs a key takes it from the operator's environment or a dotenv file. This phase adds `bots secret set` over the OS keychain or a 0600 file, injects the named value into the child environment only, and records the names used on the run record."
trigger_phrases:
  - "bots secret set"
  - "vault secret store"
  - "secret injection posture"
  - "keychain secret store"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: vault

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-per-bot-apps |
| **Successor** | 009-skills |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` for this folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification. It is the second slice of the research's §9 smallest change: `bots secret set` with a no-echo prompt, backed by the OS keychain or a 0600 file under the state root, named from the existing `secrets` field, injected only into the child environment and recorded as `HonoredPosture.secretsUsed`. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:77]

**Scope Boundary**: The store, the `bots secret` verb group, the child-environment injection, the `secretsUsed` record field and the post-run scan. The per-run filtered UTCP config and `HonoredPosture.apps` belong to 007. A skill mode for the new verb, an OAuth server, a per-action approval hook and a secret list per bot are out of scope.

**Dependencies**:
- 007-per-bot-apps, which lands the per-run config the secret is injected beside and the `HonoredPosture` block this phase extends.
- The deep-loop dispatch-env gate at `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494`, which admits the one namespaced key the value travels under through the per-dispatch key list 007 states once for `UTCP_CONFIG_FILE`.
- The packet contracts in `../contracts/`: the secrets index, the name grammar and the environment key in `records.md` section 8, the refusals in `refusals.md` section 3.7, the run-record fields in `records.md` section 4 and decision D6 in `decisions.md`. This phase adopts them as written and cites them rather than copying them.

**Deliverables**:
- `bots secret set|list|forget` over the OS keychain or a 0600 file under the identity's state root.
- `secrets:` resolved to one store entry, injected as `SKILLED_BOT_SECRET_<NAME>` into the child environment only.
- `HonoredPosture.secretsUsed`, every stored value added to the literal check that already guards a prompt, an answer and a delivery, and a post-run scan of the run folder.
- rakazo's one-pass matcher lifted with its Apache-2.0 notice.

**Design notes**: The decisions a builder needs live in `design/`. `names-and-keys.md` holds the grammar, the environment key, the keychain account and the upgrade note. `backends.md` holds the exact commands. `index-and-writes.md` holds the index reader, the lock, the write order and the orphan rule. `leak-checks.md` holds every check. `threat-model.md`, `lifecycle.md` and `injection-sequence.md` hold the threat table, the state machine and the run sequence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A bot that needs a key takes it from the operator's environment or a dotenv file, so every bot on the host can read every key and nothing records which bot used which. The `secrets:` field in `BOT.md` is parsed into `BotDefinition.posture.secrets` and read by no other module, so an author who declares it gets no store, no injection and no record. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57]

### Purpose
Give one bot one named secret, stored once by the operator, injected into that bot's child environment only, and recorded by name on the run record, so a key never reaches a prompt, a delivery or another bot's environment, and a child that prints it is caught after the run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/bin/bots.cjs secret set demo; echo "exit=$?"
bots: unknown verb: secret
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
exit=2

$ rg -n 'posture\.secrets' .skilled/skills/system-skilled-bots/runtime/lib; echo "exit=$?"
exit=1

$ rg -n 'secrets' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts
57:  secrets: string | null;
101:  'secrets',
263:  for (const key of ['sandbox', 'secrets', 'precheck', 'spec_folder']) {
281:        secrets: strings.secrets ?? null,
```

The verb does not exist, and the field is parsed at four places and read at none. No module resolves a name, so REQ-006 is met only when a run declaring `secrets: demo` refuses `secret-unknown` before dispatch instead of starting a child. The usage text after the first line is longer than shown.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `bots secret set|list|forget` over a per-identity store under the user-level state root, with the value read from a no-echo prompt or a piped line and never from an argument.
- Store each value in the OS keychain when the host has one (`security` on macOS, `secret-tool` on Linux with a session bus), else in a 0600 file, and record the backend and the actor per entry in the 0600 index `contracts/records.md` section 8 fixes.
- Resolve `secrets:` to one store entry before dispatch, refuse `secret-unknown` when the store does not hold it, and inject the value as `SKILLED_BOT_SECRET_<NAME>` into the child environment only.
- Record the names used on `HonoredPosture.secretsUsed`, add every stored value to the literal check that already guards a body, a question, an answer, a request prompt and a delivery message, and scan the run folder after the child exits.
- Lift rakazo's `secret-matcher.ts` with its Apache-2.0 notice and one `THIRD_PARTY_NOTICES.md` entry. Its `secrets-guard.ts` is not lifted: its placeholder strings are rakazo's own development defaults, and the read-back compare uses Node's `crypto.timingSafeEqual` over the two values' UTF-8 buffers, after a byte-length check that treats a different length as a mismatch. No environment check is copied, because rakazo's guard switches itself off under Vitest. The `secrets` name grammar is checked in `definition.ts` and in `bots.cjs`, and the dropped-save check lives in `secrets.ts`, so no policy module restates the parse.

### Out of Scope
- A secret list per bot. `secrets:` stays one name, because the field is already singular and widening it is a schema change no requirement here earns.
- An OAuth server, per-person connections and a connector catalogue. The 002 research rules them out for a small team, and 007's `apps:` filter covers the server side. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/iterations/iteration-007.md:42]
- Encryption of the 0600 file beyond its file mode. The keychain is the encrypted store. A key file would add a second secret to protect the first, and turnstone's config-only key rule is recorded as the alternative rather than built. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/oauth-storage.md:26]
- A checker invariant for store membership. The store is user-level state the checker cannot read on another host, so the runner refuses before dispatch instead. The parser's name refusal still reaches the checker as `definition.secret-name-invalid`.
- A `bots secret run -- <command>` subcommand. It injects into a child the CLI spawns rather than into a bot run, so it cannot write `secretsUsed`.
- A hub mode or skill for the new verb. The hub's mode registry is a separate change. The verb is reachable from the CLI, and the field it fills is documented in the feature catalog's definition contract.
- A needs-you park for an unapproved use. An unattended run cannot ask, so `policy: ask` is not built: a bot either names a stored secret or is refused.
- A `--json` form of `bots secret list`. `contracts/cli-json.md` section 2 records that the verb prints text only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` | Create | The store: name constants, `secretEnvKey`, backend choice and the three backends, the index reader and writer, the lock, `setSecret`, `listSecrets`, `forgetSecret`, `resolveSecret`, `knownSecretValues`, the write-back check and the orphan sweep |
| `.skilled/skills/system-skilled-bots/runtime/lib/secret-matcher.ts` | Create | rakazo's one-pass multi-value matcher, lifted with its notice and a statement of changes |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Check the `secrets` value against the name grammar and refuse `secret-name-invalid` |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Name and create the identity's `secrets` folder |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | `HonoredPosture.secretsUsed`, read as `[]` when an older record omits it |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Resolve the name, refuse `secret-unknown` and `secret-store-unreadable`, pass the key on 007's `extraEnv`, record the name, and run the post-run scan over stdout and stderr before the output is read |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modify | `collectAllKnownSecrets` over `collectKnownSecrets` and the vault rows, and the matcher behind `findSecretLiteral`. The `extraEnv` merge is 007's, so this phase adds no field |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modify | Check a delivery message against the store's values, and withhold a run that recorded `secret-in-output` |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Check an operator answer against the store's values as well as the environment's |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Take `dispatchEnvKeys` in `assertDispatchEnvAllowed`, so one dispatch names exactly the key it resolved, and nothing else |
| `.skilled/bin/bots.cjs` | Modify | The `secret set|list|forget` verb group, the `--store` option on `set`, the no-echo prompt and the verb refusals |
| `.skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` | Create | Store, backend, refusal, concurrency, scan and injection tests, with the fake keychain programs |
| `.skilled/skills/system-skilled-bots/runtime/tests/secret-matcher.vitest.ts` | Create | Matcher tests, lifted with the module |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | The `secrets` comment, which today says the field is not enforced, replaced by the upgrade note's short form |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | One row per new module in the files table |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | The `secrets` field now names a store entry, and the upgrade note from `design/names-and-keys.md` section 4 verbatim |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md` | Modify | The same correction in the feature catalog's definition contract |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Modify | Append a `## 008-vault` section: one entry per lifted file, naming its source path and its changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots secret set <name>` reads the value once, never from an argument, and stores it under the identity's state root. When stdin is a terminal it prompts on stderr with echo off. When stdin is not a terminal it reads one line without a prompt, which is the path the tests use. End of input before any byte, or a stopped prompt, refuses `secret-no-input` with exit 2. `bots secret set demo --value x` exits 2 as an unknown option. The read and normalize rules are `design/leak-checks.md` section 1. |
| REQ-002 | `set` picks the backend by the table in `design/backends.md` section 1: the macOS keychain through `security`, the Linux Secret Service through `secret-tool`, else the 0600 file, with `--store keychain` or `--store file` overriding. The keychain item is service `skilled-bots`, account `<name>@<scope>` (`design/names-and-keys.md` section 3), and its password is the lowercase hex of the value's UTF-8 bytes. The macOS write runs `security -q -i` and writes exactly one line, `add-generic-password -a <account> -s skilled-bots -U -w <hex>`, to its stdin. The read runs `security find-generic-password -a <account> -s skilled-bots -w`. The Linux commands are `design/backends.md` section 3. No argv of any spawn carries the value or its hex form, and every keychain spawn is killed after 10 s. |
| REQ-003 | `bots secret list` prints one line per index entry, `<name> <backend> <createdAt> <updatedAt>`, in name order, and `bots: no secrets stored` when there is none. No verb prints a value. |
| REQ-004 | `bots secret forget <name>` removes the index entry, then deletes the value from the backend the entry recorded and from the other backend when the host has it, so an orphan is removed too. It reads the backend from the index only, and takes no `--store`: `bots secret forget demo --store file` exits 2. A name the store does not hold prints `bots: secret <name> was not held` and exits 0. A delete that fails after the index entry is gone exits 1 and says to run `forget` again. The macOS delete is `security delete-generic-password -a <account> -s skilled-bots`. |
| REQ-005 | `secrets:` names one store entry. The name grammar is `^[a-z0-9][a-z0-9-]*$` with at most 64 characters, as `contracts/records.md` section 8 fixes. A value outside it is refused at parse time as `secret-name-invalid`, so the checker reports `definition.secret-name-invalid` without a new invariant, and `bots secret set` and `forget` refuse it with exit 2. The accept and refuse sets are `design/names-and-keys.md` section 1.1. |
| REQ-006 | The runner resolves the name after posture and before the literal check. A name the store does not hold is a refusal `secret-unknown`, class `operator`, with exit 4, never a failed run and never a child started without the value. The refusal's detail is `<name> is not stored, run bots secret set <name>`, so the CLI prints `bots: <bot> refused before dispatch (secret-unknown): <name> is not stored, run bots secret set <name>`. |
| REQ-007 | The value reaches the child environment only, under the key `contracts/records.md` section 8 maps the name to: `SKILLED_BOT_SECRET_` plus the name upper-cased with each hyphen turned into an underscore, so `demo` becomes `SKILLED_BOT_SECRET_DEMO` and `slack-app-token` becomes `SKILLED_BOT_SECRET_SLACK_APP_TOKEN`. The map cannot collide, because the grammar admits no underscore. `runAuditedExecutorCommand` takes `dispatchEnvKeys?: string[]` alongside `dispatchEnv`, `assertDispatchEnvAllowed` accepts a key that is in the kind's list or in that array, and the runner passes exactly the one key it resolved, so a second `SKILLED_BOT_SECRET_OTHER` key is still refused. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508] The sequence is `design/injection-sequence.md`. |
| REQ-008 | `HonoredPosture.secretsUsed` records the names used, never values, and a record written before this phase still validates with the field read as `[]`, per `contracts/records.md` section 4. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Every stored value joins the known-secret map, keyed `vault:<name>`, so the existing literal check refuses it in a body, a question, an answer, a request prompt and a delivery message. A vault that cannot be read fails each of these checks closed (`design/leak-checks.md` section 2). |
| REQ-010 | `bots secret set` refuses an empty value as `secret-empty` with exit 2. No placeholder list is checked, because a stored placeholder fails loudly at first use. |
| REQ-011 | A write is verified by reading it back and comparing with Node's `crypto.timingSafeEqual` over the two values' UTF-8 buffers, after a byte-length check that treats a different length as a mismatch. A backend that drops the write, exits non-zero, times out or returns another value is reported as `secret-write-dropped` with exit 4, and the index is not written. |
| REQ-012 | Each lifted file carries its Apache-2.0 notice and a statement of changes, and `THIRD_PARTY_NOTICES.md` holds one entry per lifted file naming its source path. |
| REQ-013 | The literal scan runs through the lifted one-pass matcher, so many stored values cost one pass over the text rather than one scan per value. |
| REQ-014 | After the child exits, and before its output is read, the runner scans the captured stdout, every file under the run folder and every file under the run's receipt folder with the known-secret map plus the lowercase hex, unpadded base64 and URL-encoded forms of each stored value. Each match is replaced by `[redacted: <name>]`, the token `contracts/records.md` section 17 fixes. A match adds one `postRunCauses` row `{ cause: 'secret-in-output', names, detail }` and withholds every delivery entry as `not-attempted` with `withheld: secret-in-output`. The run keeps its own outcome and exit: 0 completed, 1 failed, 5 awaiting a decision. The scan reads a partial log from a killed child the same way. `secret-in-output` is the one cause name for this scan and for 010's returned answer text. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"] |
| REQ-015 | The store's boundary is the OS user: every bot child runs as the same user and can read another name's 0600 value file, so the `secrets:` grant is enforced by not injecting a name and never by file permissions. The residual is accepted for the small-team model, as decision D6 confirms, and a test pins the read. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46] |
| REQ-016 | `bots secret set` refuses `secret-too-long` with exit 2, before any store is touched, when the value is longer than 16,384 code points, when 65,536 piped bytes hold no newline, or when the macOS keychain write line would be longer than 4,095 bytes, which any value of at most 1,984 UTF-8 bytes avoids. The detail names the bound that applied. |
| REQ-017 | A store that cannot be read refuses `secret-store-unreadable` with exit 4, never reads as empty. That covers an index that does not read, does not validate or carries a newer `schemaVersion` (`design/index-and-writes.md` section 1), a keychain that does not answer within 10 s, a keychain entry on a host with no keychain program and a keychain item not in hex form. On a run it is a run refusal with class `environment`. On `set`, `list` and `forget` it prints `bots: secret-store-unreadable: <detail>` and exits 4. The detail is one fixed phrase per cause from `design/backends.md` section 6 and never captured program output. |
| REQ-018 | `set` and `forget` hold `secrets/index.lock` across their whole change and write the index through a temp file and a rename. `set` writes the value, reads it back, then writes the index. `forget` writes the index, then deletes the value. A value with no index entry is ignored by `list`, `resolve` and the known-secret map, and is removed by the next `set` or `forget` of that name. Leftover temp files are removed by the next `set` or `forget` of any name. The rules and the stop table are `design/index-and-writes.md` sections 2 to 4. |
| REQ-019 | No test writes to the operator's login keychain. The keychain tests run against a fake `security` and `secret-tool` on `PATH`, or on macOS against a scratch keychain passed through the `keychainPath` option, which `bots.cjs` never sets (`design/backends.md` section 7). |
| REQ-020 | `bots secret set` records `setBy` on the index entry, the actor `resolveActor` returns, the OS user or the pinned operator, so a shared host does not erase who stored a value. `bots secret list` does not print it, so its line stays `<name> <backend> <createdAt> <updatedAt>`. The key is `contracts/records.md` section 8's `entries.<name>.setBy`, read as `null` on an entry written before the actor was recorded. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A bot declaring `secrets: demo` runs with `SKILLED_BOT_SECRET_DEMO` in its child environment and `secretsUsed: ["demo"]` in its record, and the value appears in no prompt, record or delivery. A child that prints it is caught by the post-run scan and redacted to `[redacted: demo]`.
- **SC-002**: `bots secret set` never echoes the value and never accepts it as an argument, and the keychain backend passes it on the program's stdin in hex form, so a value cannot land in shell history or in a process listing of the CLI or of `security`.
- **SC-003**: A bot naming a secret the store does not hold is refused before dispatch with exit 4, so an unattended fire never starts a child that lacks the key it was promised.
- **SC-004**: Two `set` calls at once, or a `set` stopped at any step, never leave the index naming a value the backend does not hold.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Decision | D6, the same-user boundary | Confirmed as designed in `contracts/decisions.md`: every bot child runs as the same OS user and can read another name's 0600 value file, and the grant is enforced by not injecting a name | REQ-015 and AC-015 pin it. Open for the operator to override in that file |
| Dependency | The deep-loop dispatch-env gate | The value cannot reach the child, and the phase lands with a store and no injection | Take `dispatchEnvKeys` in `assertDispatchEnvAllowed` and name exactly `SKILLED_BOT_SECRET_<NAME>` in it, the mechanism 007 states once for `UTCP_CONFIG_FILE`. If that is refused, fall back to `bots secret run` and drop REQ-007 |
| Dependency | 007-per-bot-apps | The record field has no sibling and the injection has no per-run config to sit beside | 007 lands the gate and the field. This phase passes the key on 007's `extraEnv` and relies on 007's gate floor, so without 007 the value cannot reach the child |
| Risk | Every bot child runs as the same OS user, so a child can read `{stateRoot}/{identity}/secrets/*.value` whatever `secrets:` it declares | High | Accepted for the small-team model, D6. The store is 0700 and 0600 under the user-level state root, and the boundary is the OS user. A per-run unreadable path or a keychain access list per item is the isolation a later packet adds. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46] |
| Risk | A bot reads its own environment and writes the value into a file or a commit | High | The record names the secret, the literal check refuses the value in a prompt, an answer and a delivery, and the post-run scan catches it in the run folder. A value the child writes to a file or a commit is outside this phase's reach (`design/threat-model.md` T6) |
| Risk | `security -i` splits a line over 4,096 bytes into commands that write a truncated item to the default keychain and echo the rest to stderr | High | Observed while the design was probed. The line is measured before the spawn and refused (REQ-016), and the program's output is never printed (`design/backends.md` section 2.3) |
| Risk | A locked keychain blocks `security` with no limit | Med | Observed: a scratch keychain locked after 300 s and the next call blocked. Every keychain spawn has a 10 s timeout (REQ-002, REQ-017) |
| Risk | While the keychain cannot be read, every run of every bot in the identity refuses `secret-store-unreadable`, a bot that names no secret included | Med | Fail-closed on purpose: the known-secret map guards every body against every stored value. The map stops at the first failing keychain entry, so a run spends one 10 s timeout. The jobs run in the `gui/<uid>` launchd domain and reach the login keychain while the operator is logged in. A host whose bots must run while the keychain is locked stores with `--store file` (`design/backends.md` section 6) |
| Risk | A 0600 file is copied by a backup or a sync tool | Med | The file lives under the user-level state root, never the checkout, and the index names the backend so an operator can see which store holds a value |
| Risk | A bot that declared `secrets` before this phase stops running | Med | The upgrade note in `design/names-and-keys.md` section 4 goes into the author reference and the template |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `bots secret list` answers in under 200 ms for 20 entries on the file backend.
- **NFR-P02**: Resolving one secret adds one file read, or one keychain call, to a run's pre-dispatch path, and the known-secret map adds one read per stored entry. Twenty `security` reads of an unlocked scratch keychain took 0.315 s on this host, so a store of 20 keychain entries adds about a third of a second to a run.

### Security
- **NFR-S01**: No verb prints a value. `list` prints names and metadata only.
- **NFR-S02**: The store folder is 0700 and every file the store writes is 0600. `set` and `forget` narrow a widened folder or index back before they write.
- **NFR-S03**: The value reaches the child environment only, under one namespaced key, and never the precheck's environment.
- **NFR-S04**: The store's boundary is the OS user. The `secrets:` grant is enforced by not injecting a name, never by file permissions, and the residual is accepted for the small-team model. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46]

### Reliability
- **NFR-R01**: A store that cannot be read is a refusal with a named reason, never an empty store.
- **NFR-R02**: A write is verified by reading it back, so a dropped write is reported rather than assumed.
- **NFR-R03**: No keychain call outlives 10 s.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty input: `bots secret set demo` with an empty line stores nothing and exits 2 with `secret-empty`.
- No terminal and no piped line: `bots secret set demo < /dev/null` refuses `secret-no-input` with exit 2, so a set with nothing to read never writes an empty value.
- Maximum input: a value of 16,384 code points is accepted on the file backend and the Linux keychain, matching rakazo's vault bound, and a longer one is refused `secret-too-long`. On the macOS keychain the bound is the 4,095 byte write line, which holds any value of at most 1,984 UTF-8 bytes. [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:35]
- Short value: a value under 8 characters is stored and injected, and no literal check sees it, because the detector skips values under `MIN_SECRET_LENGTH`. This is a stated residual (`design/threat-model.md` T9). [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:54]
- Failure path: a name the store does not hold refuses `secret-unknown` with exit 4 before dispatch, and a store that cannot be read refuses `secret-store-unreadable` with exit 4.
- A locked keychain: the read is killed at 10 s and the run refuses `secret-store-unreadable`.
- A child that prints the value: the post-run scan redacts it to `[redacted: demo]` in the run folder, records `secret-in-output` and the run is not delivered. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062]
- A moved state root: keychain entries read as absent and refuse `secret-unknown` until set again, because the keychain account is scoped to the store's real path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Three new modules, seven modified runtime modules, one CLI verb group, one shared gate, five documents and three backends |
| Risk | 17/25 | A secret store, a shared environment gate and a leak path, the one slice the research says can leak, with two hazards the probes found |
| Research | 6/20 | The 002 research, the plan-depth research, the contracts and the measured probes in `design/backends.md` settle the design |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the deep-loop dispatch-env gate widen here, or does the vault land with a `bots secret run` subcommand? Decision: widen through the per-dispatch key list, because `dispatchEnv` is the only channel that merges after the per-kind filter, and a subcommand cannot write `secretsUsed`. The fallback is recorded in `plan.md` §7.
- Is one name per bot enough? Decision: yes for this phase. A list is a later schema change, and the record already carries a list so that change needs no record migration.
- Should the keychain be the default on macOS? Decision: yes, with `--store file` to override, because the keychain is the only encrypted store and the `security -i` form keeps the value out of argv.
- Why not `security`'s own prompting form, `-w` as the last option? Decision: not on the runtime path. It reads through `getpass`, which asks twice, reads `/dev/tty` when there is one and kept only 128 characters of a 200-character password when probed (`design/backends.md` section 2.5).
- Does Linux get a keychain backend? Decision: yes, through `secret-tool`, recorded as `keychain` in the index because the contract's backend enum has two values. Its commands are inferred from the manual page and tested through a fake program, because this host has none.
- What does `--store` on `forget` mean? Decision: nothing. `forget` reads the backend from the index and sweeps both backends, so it takes no `--store` and no refusal for a mismatch is needed.
<!-- /ANCHOR:questions -->
