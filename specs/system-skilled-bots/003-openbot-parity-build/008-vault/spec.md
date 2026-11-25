---
title: "Feature Specification: Phase 8: vault"
description: "A bot's `secrets:` field is parsed and never resolved, so a bot that needs a key takes it from the operator's environment or a dotenv file. This phase adds `bots secret set` over the macOS keychain or a 0600 file, injects the named value into the child environment only, and records the names used on the run record."
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
| **Status** | Draft |
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

This is **Phase 8** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification. It is the second slice of the research's §9 smallest change: `bots secret set` with a no-echo prompt, backed by the macOS keychain or a 0600 file under the state root, named from the existing `secrets` field, injected only into the child environment and recorded as `HonoredPosture.secretsUsed`. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:77]

**Scope Boundary**: The store, the `bots secret` verb group, the child-environment injection and the `secretsUsed` record field. The per-run filtered UTCP config and `HonoredPosture.apps` belong to 007. A skill mode for the new verb, an OAuth server, a per-action approval hook and a secret list per bot are out of scope.

**Dependencies**:
- 007-per-bot-apps, which lands the per-run config the secret is injected beside and the `HonoredPosture` block this phase extends.
- The deep-loop dispatch-env gate at `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494`, which admits the one namespaced key the value travels under through the per-dispatch key list 007 states once for `UTCP_CONFIG_FILE`.

**Deliverables**:
- `bots secret set|list|forget` over the macOS keychain or a 0600 file under the identity's state root.
- `secrets:` resolved to one store entry, injected as `SKILLED_BOT_SECRET_<NAME>` into the child environment only.
- `HonoredPosture.secretsUsed`, every stored value added to the literal check that already guards a prompt, an answer and a delivery, and a post-run scan of `stdout.log`.
- rakazo's matcher and placeholder guard lifted with Apache-2.0 notices.
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

The verb does not exist, and the field is parsed at four places and read at none. No module resolves a name, so REQ-006 is met only when a run declaring `secrets: demo` refuses `secret-unknown` before dispatch instead of starting a child.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `bots secret set|list|forget` over a per-identity store under the user-level state root, with the value read from a no-echo prompt or a piped line and never from an argument.
- Store each value in the macOS keychain when `security` is available, else in a 0600 file, and record the backend per entry in a 0600 index.
- Resolve `secrets:` to one store entry before dispatch, refuse `secret-unknown` when the store does not hold it, and inject the value as `SKILLED_BOT_SECRET_<NAME>` into the child environment only.
- Record the names used on `HonoredPosture.secretsUsed`, and add every stored value to the literal check that already guards a body, a question, an answer, a request prompt and a delivery message.
- Lift rakazo's `secret-matcher.ts` and `secrets-guard.ts` with Apache-2.0 notices and one `THIRD_PARTY_NOTICES.md` entry per lifted file. The `secrets` name grammar is parsed once, in `definition.ts`, and the dropped-save check lives in `secrets.ts`, so no policy module restates the parse.

### Out of Scope
- A secret list per bot. `secrets:` stays one name, because the field is already singular and widening it is a schema change no requirement here earns.
- An OAuth server, per-person connections and a connector catalogue. The 002 research rules them out for a small team, and 007's `apps:` filter covers the server side. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/lineages/vibe-2/iterations/iteration-007.md:42]
- Encryption of the 0600 file beyond its file mode. The keychain is the encrypted store; a key file would add a second secret to protect the first, and turnstone's config-only key rule is recorded as the alternative rather than built. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/oauth-storage.md:26]
- A checker invariant for store membership. The store is user-level state the checker cannot read on another host, so the runner refuses before dispatch instead; the parser's name refusal still reaches the checker as `definition.secret-name-invalid`.
- A `bots secret run -- <command>` subcommand. It injects into a child the CLI spawns rather than into a bot run, so it cannot write `secretsUsed`.
- A hub mode or skill for the new verb. The hub's mode registry is a separate change; the verb is reachable from the CLI, and the field it fills is documented in the feature catalog's definition contract.
- A needs-you park for an unapproved use. An unattended run cannot ask, so `policy: ask` is not built: a bot either names a stored secret or is refused.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` | Create | The store: name grammar, backend choice, index, set/list/forget/resolve, 0600 writes, write-back verification and the dropped-save check |
| `.skilled/skills/system-skilled-bots/runtime/lib/secret-matcher.ts` | Create | rakazo's one-pass multi-value matcher, lifted with its notice and a statement of changes |
| `.skilled/skills/system-skilled-bots/runtime/lib/secrets-guard.ts` | Create | rakazo's placeholder guard and constant-time compare, lifted with its notice |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Own the one `secrets` name parse and refuse a value outside the name grammar as `secret-name-invalid` |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Name and create the identity's `secrets` folder |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | `HonoredPosture.secretsUsed`, read as `[]` when an older record omits it |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Resolve the name, refuse `secret-unknown`, pass the value to the child, record the name, and scan `stdout.log` after the child exits |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modify | `secretEnv` merged into `dispatchEnv`; store values added to the known-secret map; the matcher behind `findSecretLiteral` |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modify | Check a delivery message against the store's values as well as the environment's |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Check an operator answer against the store's values as well as the environment's |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Take `dispatchEnvKeys` in `assertDispatchEnvAllowed`, so one dispatch names exactly the key it resolved, and nothing else |
| `.skilled/bin/bots.cjs` | Modify | The `secret set|list|forget` verb group, the no-echo prompt and the `secret-no-input` refusal |
| `.skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` | Create | Store, backend, refusal and injection tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/secret-matcher.vitest.ts` | Create | Matcher tests, lifted with the module |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | The `secrets` comment, which today says the field is not enforced |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | One row per new module in the files table |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | The `secrets` field now names a store entry rather than a policy recorded only |
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
| REQ-001 | `bots secret set <name>` reads the value from stdin with echo off when stdin is a terminal, never from an argument, and stores it under the identity's state root. When stdin is not a terminal, one line is read without a prompt, which is the path the tests and AC-001 use; when stdin is closed or holds no line, the verb refuses `secret-no-input` with exit 2. `bots secret set demo --value x` exits 2 as an unknown option. |
| REQ-002 | The store is the macOS keychain when `security` is on PATH, else a 0600 file under the identity's `secrets` folder; the index records the backend per entry, and `--store file` or `--store keychain` overrides the choice. The keychain backend runs `security -i` and writes `add-generic-password -a <name> -s skilled-bots -U -w <value>` to that process's stdin, so REQ-001's reader is the only one, the value never enters argv, and `security` never reads the terminal, which is what lets the keychain path run without a tty. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/research.md:177] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/review-2-findings.md:21] |
| REQ-003 | `bots secret list` prints names and metadata only, and no verb prints a value. |
| REQ-004 | `bots secret forget <name>` removes the value from its backend and the entry from the index, and is idempotent for a name the store does not hold. |
| REQ-005 | `secrets:` names one store entry. A value outside the name grammar is refused at parse time as `secret-name-invalid`, so the checker reports `definition.secret-name-invalid` without a new invariant. |
| REQ-006 | The runner resolves the name before dispatch. A name the store does not hold is a refusal `secret-unknown` with exit 4, never a failed run and never a child started without the value. |
| REQ-007 | The value reaches the child environment only, under `SKILLED_BOT_SECRET_<NAME>`. The runtime never writes the value; a child that prints it is caught after the run. `runAuditedExecutorCommand` takes `dispatchEnvKeys?: string[]` alongside `dispatchEnv`, `assertDispatchEnvAllowed` accepts a key that is in the kind's list or in that array, and the runner passes exactly `SKILLED_BOT_SECRET_<NAME>` for the one name it resolved, so a second `SKILLED_BOT_SECRET_OTHER` key is still refused. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508] |
| REQ-008 | `HonoredPosture.secretsUsed` records the names used, never values, and a record written before this phase still validates with the field read as `[]`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Every stored value joins the known-secret map, so the existing literal check refuses it in a body, a question, an answer, a request prompt and a delivery message. |
| REQ-010 | `bots secret set` refuses an empty value as `secret-empty` and a known dev or example placeholder as `secret-placeholder`, both with exit 2. |
| REQ-011 | A write is verified by reading it back; a backend that drops the write is reported as `secret-write-dropped` rather than assumed to have stored it. |
| REQ-012 | Each lifted file carries its Apache-2.0 notice and a statement of changes, and `THIRD_PARTY_NOTICES.md` holds one entry per lifted file naming its source path. |
| REQ-013 | The literal scan runs through the lifted one-pass matcher, so many stored values cost one pass over the text rather than one scan per value. |
| REQ-014 | After the child exits, `stdout.log` is scanned with the same known-secret map. A match redacts the line in place, records `secret-in-output` on the run record, and the run is not delivered. The scan reads the file as written, including a partial log from a child that was killed. `secret-in-output` is the one cause name for this scan and for 010's returned answer text, so one scan never records two causes. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:133] |
| REQ-015 | The store's boundary is the OS user: every bot child runs as the same user and can read another name's 0600 value file, so the `secrets:` grant is enforced by not injecting a name and never by file permissions. The residual is accepted for the small-team model, and a test pins the read. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46] |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A bot declaring `secrets: demo` runs with `SKILLED_BOT_SECRET_DEMO` in its child environment and `secretsUsed: ["demo"]` in its record, and the value appears in no prompt, record or delivery; a child that prints it is caught by the post-run scan of `stdout.log`.
- **SC-002**: `bots secret set` never echoes the value and never accepts it as an argument, and the keychain backend passes the value on `security`'s stdin, so a value cannot land in shell history or in a process listing of the CLI or of `security`.
- **SC-003**: A bot naming a secret the store does not hold is refused before dispatch with exit 4, so an unattended fire never starts a child that lacks the key it was promised.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The deep-loop dispatch-env gate | The value cannot reach the child, and the phase lands with a store and no injection | Take `dispatchEnvKeys` in `assertDispatchEnvAllowed` and name exactly `SKILLED_BOT_SECRET_<NAME>` in it, the mechanism 007 states once for `UTCP_CONFIG_FILE`; if that is refused, fall back to `bots secret run` and drop REQ-007 |
| Dependency | 007-per-bot-apps | The record field has no sibling and the injection has no per-run config to sit beside | 007 is a scaffold; this phase adds `secretsUsed` itself if 007 has not landed, and the field is additive either way |
| Risk | Every bot child runs as the same OS user, so a child can read `{stateRoot}/{identity}/secrets/*.value` whatever `secrets:` it declares | High | Accepted for the small-team model: the store is 0700/0600 under the user-level state root, the grant is enforced by not injecting a name, and the boundary is the OS user. A per-run unreadable path or a keychain ACL per item is the isolation a later packet adds. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46] |
| Risk | A bot reads its own environment and writes the value into a file or a commit | High | The record names the secret, the literal check refuses the value in a prompt, an answer and a delivery, and the post-run scan catches it in `stdout.log`; a value the child writes to a file or a commit is outside this phase's reach, which is why the store is the only place a secret lives |
| Risk | A 0600 file is copied by a backup or a sync tool | Med | The file lives under the user-level state root, never the checkout, and the index names the backend so an operator can see which store holds a value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `bots secret list` answers in under 200 ms for 20 entries on the file backend.
- **NFR-P02**: Resolving one secret adds one file read, or one `security` call, to a run's pre-dispatch path.

### Security
- **NFR-S01**: No verb prints a value; `list` prints names and metadata only.
- **NFR-S02**: The store folder is 0700 and every file the store writes is 0600.
- **NFR-S03**: The value reaches the child environment only, under one namespaced key, and never the precheck's environment.
- **NFR-S04**: The store's boundary is the OS user. The `secrets:` grant is enforced by not injecting a name, never by file permissions, and the residual is accepted for the small-team model. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46]

### Reliability
- **NFR-R01**: A store that cannot be read is a refusal with a named reason, never an empty store.
- **NFR-R02**: A write is verified by reading it back, so a dropped write is reported rather than assumed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty input: `bots secret set demo` with an empty line stores nothing and exits 2 with `secret-empty`.
- No terminal and no piped line: `bots secret set demo < /dev/null` refuses `secret-no-input` with exit 2, so a set with nothing to read never writes an empty value.
- Maximum input: a value of 16,384 characters is accepted, matching rakazo's vault bound, and a longer one is refused `secret-too-long`. [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:35]
- Failure path: a name the store does not hold refuses `secret-unknown` with exit 4 before dispatch, and a store folder that cannot be read refuses `secret-store-unreadable` with exit 4.
- A child that prints the value: the post-run scan redacts the line in `stdout.log`, records `secret-in-output` and the run is not delivered. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three new modules, seven modified runtime modules, one CLI verb group, one shared gate, five documents |
| Risk | 16/25 | A secret store, a shared environment gate and a leak path; the one slice the research says can leak |
| Research | 8/20 | The 002 research and its lineage settle the design; the backend choice and the gate change are the only open decisions |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the deep-loop dispatch-env gate widen here, or does the vault land with a `bots secret run` subcommand? Decision: widen through the per-dispatch key list, because `dispatchEnv` is the only channel that merges after the per-kind filter, and a subcommand cannot write `secretsUsed`. The fallback is recorded in `plan.md` §7.
- Is one name per bot enough? Decision: yes for this phase. A list is a later schema change, and the record already carries a list so that change needs no record migration.
- Should the keychain be the default on macOS? Decision: yes, with `--store file` to override, because the keychain is the only encrypted store and the `security -i` form keeps the value out of argv.
<!-- /ANCHOR:questions -->
