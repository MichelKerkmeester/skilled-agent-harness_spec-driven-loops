---
title: "Implementation Plan: Phase 8: vault"
description: "Adds a per-identity secret store behind `bots secret set|list|forget`, resolves a bot's `secrets` name before dispatch, injects the value into the child environment only, and records the names used on the run record."
trigger_phrases:
  - "vault build plan"
  - "secret store files"
  - "child environment injection"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: vault

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22, ESM, run through `tsx` by `.skilled/bin/bots.cjs` |
| **Framework** | None; the runtime is plain modules under `runtime/lib/` |
| **Storage** | The macOS keychain through `security`, or a 0600 file under the identity's state root, with a 0600 JSON index |
| **Testing** | Vitest, `npm test` in `.skilled/skills/system-skilled-bots/runtime` |

### Overview
One store module owns the value, one policy module owns the grant, and the runner resolves the name once before dispatch. The value travels to the child through `dispatchEnv`, the only channel the deep-loop audit merges after its per-kind environment filter, so the precheck and the runner's own environment never see it. The proof is a fixture bot that prints its own environment and a scan of the run folder, the record and the delivery message for the planted value.

### Deviation from the lineage design
The 002 lineage proposed an encrypted store file with a key read only from the repository config. This phase stores in the keychain or a 0600 file instead, because the keychain is already an encrypted store and a key file would add a second secret to protect the first. The residual exposure is named in `spec.md` §6 and the alternative is recorded in §7 below.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs secret set demo` prints `bots: unknown verb: secret` and exits 2, the measured behavior `spec.md` rests on
- [ ] `rg -n 'posture\.secrets' .skilled/skills/system-skilled-bots/runtime/lib` exits 1, so no module resolves the field today
- [ ] `ls .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` fails, so the store does not exist yet
- [ ] `rg -n 'SKILLED_BOT_SECRET_' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` exits 1, so the gate does not admit the key yet

### Definition of Done
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 with `secrets.vitest.ts` and `secret-matcher.vitest.ts` in the run
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .` exits 0 on this repository
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/008-vault --strict` prints `RESULT: PASSED`
- [ ] Docs updated: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, the lib README and the bot template
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Store, resolver, injector: three steps in one direction, with the value never leaving the store except into a child's environment.

### Key Components
- **`secrets.ts`**: the only module that reads or writes a value. Owns the name grammar, the backend choice, the 0600 index, `setSecret`, `listSecrets`, `forgetSecret`, `resolveSecret` and `knownSecretValues`. Nothing it returns carries a value except `resolveSecret`.
- **`vault-policy.ts`**: the grant. Answers whether a bot may use a name (`allow` or `off`) and whether a write the backend reported actually landed, adapted from rakazo's `vault.ts`.
- **`secrets-guard.ts`**: refuses a placeholder value and compares two strings in constant time, lifted from rakazo's `secrets-guard.ts`.
- **`secret-matcher.ts`**: the one-pass matcher behind `findSecretLiteral`, lifted from rakazo's `secret-matcher.ts`, so many stored values cost one pass.
- **The runner's resolve step**: after `validatePosture` and before the literal check, resolve the name, refuse `secret-unknown`, add the value to the known-secret map, and build `secretEnv`.
- **The deep-loop dispatch-env gate**: admits the `SKILLED_BOT_SECRET_` prefix in `assertDispatchEnvAllowed`, so the value reaches the child past the per-kind filter and nowhere else.

### Data Flow
`bots secret set demo` reads the value from a no-echo prompt, refuses a placeholder, writes it to the keychain or a 0600 file, verifies the write by reading it back, and records `{backend, createdAt, updatedAt}` in the 0600 index. A run declaring `secrets: demo` resolves the name, refuses when the index has no entry, adds the value to the known-secret map, and passes `secretEnv: { SKILLED_BOT_SECRET_DEMO: <stored value> }` to `dispatchHeadless`, which merges it into `dispatchEnv`. The child sees the key; the record gets `secretsUsed: ["demo"]`; the prompt, the run folder and the delivery message get neither.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/definition.ts` | Parses `secrets` as an optional string and never validates it | update: refuse a name outside the grammar | `rg -n 'secret-name-invalid' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` prints one line |
| `runtime/lib/state-root.ts` | Names the per-identity folders | update: add `secrets` to `identityStatePaths` and `ensureIdentityState` | `rg -n "secrets: join" .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints one line |
| `runtime/lib/run-record.ts` | `HonoredPosture` carries isolation, sandbox, executorKind and model | update: add `secretsUsed`, read as `[]` when absent | `rg -n 'secretsUsed' .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` prints at least two lines |
| `runtime/lib/runner.ts` | Checks the body, question, answer and request prompt for literals at line 942 | update: resolve the name, refuse `secret-unknown`, pass `secretEnv`, record the name | `rg -n 'secret-unknown' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints one line |
| `runtime/lib/dispatch.ts` | Builds the child prompt and filtered environment; `collectKnownSecrets` reads the environment and dotenv files | update: `secretEnv` into `dispatchEnv`, an extra known-secret map, the matcher behind `findSecretLiteral` | `rg -n 'secretEnv' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints at least two lines |
| `runtime/lib/delivery.ts` | Checks a delivery message against the environment's secrets at line 291 | update: include the store's values | `rg -n 'knownSecretValues' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` prints one line |
| `runtime/lib/answer.ts` | Checks an operator answer against the environment's secrets | update: include the store's values | `rg -n 'knownSecretValues' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` prints one line |
| `system-deep-loop/.../executor-audit.ts` | `assertDispatchEnvAllowed` admits only the per-kind list at line 1508 | update: admit the `SKILLED_BOT_SECRET_` prefix | `rg -n 'SKILLED_BOT_SECRET_' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints one line |
| `.skilled/bin/bots.cjs` | Parses one verb and one id; `VERB_SPECS` is the closed verb list | update: the `secret` verb group and the no-echo prompt | `node .skilled/bin/bots.cjs secret list` exits 0 |
| `scripts/bot-check.cjs` | Reports every parser refusal as `definition.<reason>` | not a consumer: the name refusal arrives through the parser | `rg -n 'secret-name-invalid' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` exits 1 |
| `assets/bot-template.txt` | Says the `secrets` field is recorded and not enforced | update: the comment and the default | `rg -n 'secrets:' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line |
| `runtime/lib/README.md` | One row per module in the files table | update: one row per new module | `rg -c 'secrets.ts' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints 1 |
| `bots-author/references/bot-definition.md` | Describes `secrets` as a policy recorded on the definition only | update: the field now names a store entry | `rg -n 'secrets' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints one line |
| `feature-catalog/definition/bot-definition-contract.md` | Describes the posture fields, `secrets` included | update: the field now names a store entry | `rg -n 'secrets' .skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md` prints one line |

Required inventories:
- Same-class producers: `rg -n 'secrets' .skilled/skills/system-skilled-bots/runtime/lib` finds every module that names the field; only `definition.ts` does today.
- Consumers of the changed symbol: `rg -n 'posture\.secrets|secretsUsed|collectKnownSecrets|findSecretLiteral' .skilled --glob '*.ts' --glob '*.cjs'` names the runner, dispatch, delivery, answer and the tests.
- Matrix axes: backend (`keychain`, `file`) × value shape (ordinary, empty, placeholder, 16,384 characters, 16,385) × store state (absent, present, unreadable) × bot state (no `secrets`, stored name, unknown name).
- Algorithm invariant: a value reaches exactly one child environment and no other surface. Adversarial cases: a name with `/` or `..`, a value holding a newline, a value equal to a placeholder, a store folder at mode 0755, a record written before the field existed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `definition.ts`, `state-root.ts`, `run-record.ts`, `dispatch.ts` and the deep-loop gate, and captures the measured behavior. Implementation adds `secrets.ts`, the three lifted modules, the runner's resolve step, the CLI verb group and the record field. Verification runs the fixture bot, scans the run folder and the record for the planted value, and runs the suite, the typecheck and the checker.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `secrets.ts` over a temporary state root with the file backend: set, list, forget, resolve, the name grammar, the 0600 modes, a dropped write, an unreadable index | Vitest, `tests/secrets.vitest.ts` |
| Unit | `secret-matcher.ts` against the lifted cases: overlapping values, a repeated value, an empty list, the state cap falling back to a per-value scan | Vitest, `tests/secret-matcher.vitest.ts` |
| Unit | `secrets-guard.ts`: a placeholder refused, an ordinary value accepted, the constant-time compare equal and unequal | Vitest, `tests/secrets.vitest.ts` |
| Integration | A fixture bot declaring `secrets: demo` runs through `runBot` with a stub executor, and its record carries `secretsUsed: ["demo"]` | Vitest, `tests/secrets.vitest.ts` with `tests/runner-support.ts` |
| Integration | `bots secret set` through the CLI with a piped value, then `bots secret list`, then `bots secret forget` | Vitest, `tests/secrets.vitest.ts` spawning `.skilled/bin/bots.cjs` |
| Manual | One live run of a bot whose body prints its environment filtered to `SKILLED_BOT_SECRET_`, then a scan of the run folder for the planted value | `bots run`, `rg` |

The one command that decides the phase: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0, and `rg -c 'skilled-test-value-7f3a' "$RUN"` prints 0, where `RUN` is the run folder the fixture prints.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `security` on PATH (macOS) | External | Green on this host, absent elsewhere | The store falls back to the 0600 file; no requirement changes |
| The deep-loop dispatch-env gate | Internal | Yellow: one predicate must widen | The value cannot reach the child; the fallback in §7 applies |
| 007-per-bot-apps | Internal | Yellow: a scaffold, not built | This phase adds `secretsUsed` itself; the field is additive |
| `tsx` and Vitest, already in `runtime/node_modules` | Internal | Green | No test can run |
| No new package | Internal | Green | The store uses `node:fs`, `node:child_process` and `node:readline` only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run's prompt, record, run folder or delivery message holds a stored value, or a bot reaches a secret it did not name.
- **Procedure**: revert the one commit. The store lives under the user-level state root and is untouched by a revert, so `bots secret forget <name>` removes a value the reverted code can no longer read. If the deep-loop gate widening is the failing part, revert that file alone and drop REQ-007; the store and the verb group stay useful, and the fallback is a `bots secret run -- <command>` subcommand that spawns its own child.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing; it reads the runtime and captures the measured behavior | Implementation, which needs the exact refusal ids and field shapes |
| Implementation | Setup | Verification, which needs the store, the verb and the record field |
| Verification | Implementation | Close; no acceptance row can be Met before it |
<!-- /ANCHOR:phase-deps -->
