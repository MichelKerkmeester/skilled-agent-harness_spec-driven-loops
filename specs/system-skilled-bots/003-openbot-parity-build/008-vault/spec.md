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
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` for this folder. 009 reads the `secrets` name grammar and the store's refusal ids, and nothing else passes between the two. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification. It is the second slice of the research's §9 smallest change: `bots secret set` with a no-echo prompt, backed by the macOS keychain or a 0600 file under the state root, named from the existing `secrets` field, injected only into the child environment and recorded as `HonoredPosture.secretsUsed`. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:77]

**Scope Boundary**: The store, the `bots secret` verb group, the child-environment injection and the `secretsUsed` record field. The per-run filtered UTCP config and `HonoredPosture.apps` belong to 007. A skill mode for the new verb, an OAuth server, a per-action approval hook and a secret list per bot are out of scope.

**Dependencies**:
- 007-per-bot-apps, which lands the per-run config the secret is injected beside and the `HonoredPosture` block this phase extends.
- The deep-loop dispatch-env gate at `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494`, which admits the one namespaced key the value travels under.

**Deliverables**:
- `bots secret set|list|forget` over the macOS keychain or a 0600 file under the identity's state root.
- `secrets:` resolved to one store entry, injected as `SKILLED_BOT_SECRET_<NAME>` into the child environment only.
- `HonoredPosture.secretsUsed`, and every stored value added to the literal check that already guards a prompt, an answer and a delivery.
- rakazo's matcher, placeholder guard and vault policy lifted with Apache-2.0 notices.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A bot that needs a key takes it from the operator's environment or a dotenv file, so every bot on the host can read every key and nothing records which bot used which. The `secrets:` field in `BOT.md` is parsed into `BotDefinition.posture.secrets` and read by no other module, so an author who declares it gets no store, no injection and no record. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57]

### Purpose
Give one bot one named secret, stored once by the operator, injected into that bot's child environment only, and recorded by name on the run record, so a key never reaches a prompt, a run folder, a delivery or another bot's environment.
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
- Add `bots secret set|list|forget` over a per-identity store under the user-level state root, with the value read from a no-echo prompt and never from an argument.
- Store each value in the macOS keychain when `security` is available, else in a 0600 file, and record the backend per entry in a 0600 index.
- Resolve `secrets:` to one store entry before dispatch, refuse `secret-unknown` when the store does not hold it, and inject the value as `SKILLED_BOT_SECRET_<NAME>` into the child environment only.
- Record the names used on `HonoredPosture.secretsUsed`, and add every stored value to the literal check that already guards a body, a question, an answer, a request prompt and a delivery message.
- Lift rakazo's `secret-matcher.ts`, `secrets-guard.ts` and `vault.ts` policy with Apache-2.0 notices and one `THIRD_PARTY_NOTICES.md` entry per lifted file.

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
| `.skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` | Create | The store: name grammar, backend choice, index, set/list/forget/resolve, 0600 writes, write-back verification |
| `.skilled/skills/system-skilled-bots/runtime/lib/secret-matcher.ts` | Create | rakazo's one-pass multi-value matcher, lifted with its notice and a statement of changes |
| `.skilled/skills/system-skilled-bots/runtime/lib/secrets-guard.ts` | Create | rakazo's placeholder guard and constant-time compare, lifted with its notice |
| `.skilled/skills/system-skilled-bots/runtime/lib/vault-policy.ts` | Create | rakazo's vault policy vocabulary and dropped-save check, adapted to one bot's `secrets` name |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Refuse a `secrets` value outside the name grammar as `secret-name-invalid` |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Name and create the identity's `secrets` folder |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | `HonoredPosture.secretsUsed`, read as `[]` when an older record omits it |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Resolve the name, refuse `secret-unknown`, pass the value to the child, record the name |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modify | `secretEnv` merged into `dispatchEnv`; store values added to the known-secret map; the matcher behind `findSecretLiteral` |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modify | Check a delivery message against the store's values as well as the environment's |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Check an operator answer against the store's values as well as the environment's |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Admit the `SKILLED_BOT_SECRET_` prefix in `assertDispatchEnvAllowed`, and nothing else |
| `.skilled/bin/bots.cjs` | Modify | The `secret set|list|forget` verb group and the no-echo prompt |
| `.skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` | Create | Store, backend, refusal and injection tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/secret-matcher.vitest.ts` | Create | Matcher tests, lifted with the module |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | The `secrets` comment, which today says the field is not enforced |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | One row per new module in the files table |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | The `secrets` field now names a store entry rather than a policy recorded only |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md` | Modify | The same correction in the feature catalog's definition contract |
| `THIRD_PARTY_NOTICES.md` | Create | One entry per lifted file, naming its source path and its changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots secret set <name>` reads the value from stdin with echo off when stdin is a terminal, never from an argument, and stores it under the identity's state root. `bots secret set demo --value x` exits 2 as an unknown option. |
| REQ-002 | The store is the macOS keychain when `security` is on PATH, else a 0600 file under the identity's `secrets` folder; the index records the backend per entry, and `--store file` or `--store keychain` overrides the choice. |
| REQ-003 | `bots secret list` prints names and metadata only, and no verb prints a value. |
| REQ-004 | `bots secret forget <name>` removes the value from its backend and the entry from the index, and is idempotent for a name the store does not hold. |
| REQ-005 | `secrets:` names one store entry. A value outside the name grammar is refused at parse time as `secret-name-invalid`, so the checker reports `definition.secret-name-invalid` without a new invariant. |
| REQ-006 | The runner resolves the name before dispatch. A name the store does not hold is a refusal `secret-unknown` with exit 4, never a failed run and never a child started without the value. |
| REQ-007 | The value reaches the child environment only, under `SKILLED_BOT_SECRET_<NAME>`, and never the prompt, the run folder, the run record or a delivery message. |
| REQ-008 | `HonoredPosture.secretsUsed` records the names used, never values, and a record written before this phase still validates with the field read as `[]`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Every stored value joins the known-secret map, so the existing literal check refuses it in a body, a question, an answer, a request prompt and a delivery message. |
| REQ-010 | `bots secret set` refuses an empty value as `secret-empty` and a known dev or example placeholder as `secret-placeholder`, both with exit 2. |
| REQ-011 | A write is verified by reading it back; a backend that drops the write is reported as `secret-write-dropped` rather than assumed to have stored it. |
| REQ-012 | Each lifted file carries its Apache-2.0 notice and a statement of changes, and `THIRD_PARTY_NOTICES.md` holds one entry per lifted file naming its source path. |
| REQ-013 | The literal scan runs through the lifted one-pass matcher, so many stored values cost one pass over the text rather than one scan per value. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A bot declaring `secrets: demo` runs with `SKILLED_BOT_SECRET_DEMO` in its child environment and `secretsUsed: ["demo"]` in its record, and the value appears in no prompt, record, run folder or delivery.
- **SC-002**: `bots secret set` never echoes the value and never accepts it as an argument, so a value cannot land in shell history or a process listing of the CLI.
- **SC-003**: A bot naming a secret the store does not hold is refused before dispatch with exit 4, so an unattended fire never starts a child that lacks the key it was promised.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The deep-loop dispatch-env gate | The value cannot reach the child, and the phase lands with a store and no injection | Widen `assertDispatchEnvAllowed` with the `SKILLED_BOT_SECRET_` prefix in the same change; if that is refused, fall back to `bots secret run` and drop REQ-007 |
| Dependency | 007-per-bot-apps | The record field has no sibling and the injection has no per-run config to sit beside | 007 is a scaffold; this phase adds `secretsUsed` itself if 007 has not landed, and the field is additive either way |
| Risk | The value is visible in `ps` while `security add-generic-password -w <value>` runs | Med | The 0600 file is the default where `security` is absent, `--store file` forces it, and the verb's help names the exposure |
| Risk | A bot reads its own environment and writes the value into a file or a commit | High | The record names the secret, the literal check refuses the value in a prompt, an answer and a delivery, and the acceptance check scans the run folder for it |
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

### Reliability
- **NFR-R01**: A store that cannot be read is a refusal with a named reason, never an empty store.
- **NFR-R02**: A write is verified by reading it back, so a dropped write is reported rather than assumed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty input: `bots secret set demo` with an empty line stores nothing and exits 2 with `secret-empty`.
- Maximum input: a value of 16,384 characters is accepted, matching rakazo's vault bound, and a longer one is refused `secret-too-long`. [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:35]
- Failure path: a name the store does not hold refuses `secret-unknown` with exit 4 before dispatch, and a store folder that cannot be read refuses `secret-store-unreadable` with exit 4.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Four new modules, seven modified runtime modules, one CLI verb group, one shared gate, five documents |
| Risk | 16/25 | A secret store, a shared environment gate and a leak path; the one slice the research says can leak |
| Research | 8/20 | The 002 research and its lineage settle the design; the backend choice and the gate widening are the only open decisions |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the deep-loop dispatch-env gate widen here, or does the vault land with a `bots secret run` subcommand? Decision: widen, because `dispatchEnv` is the only channel that merges after the per-kind filter, and a subcommand cannot write `secretsUsed`. The fallback is recorded in `plan.md` §7.
- Is one name per bot enough? Decision: yes for this phase. A list is a later schema change, and the record already carries a list so that change needs no record migration.
- Should the keychain be the default on macOS? Decision: yes, with `--store file` to override, because the keychain is the only encrypted store and the argv exposure lasts one short-lived process.
<!-- /ANCHOR:questions -->
