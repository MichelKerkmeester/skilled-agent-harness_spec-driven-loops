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
One store module owns the value, and the runner resolves the name once before dispatch. The value travels to the child through `dispatchEnv`, the only channel the deep-loop audit merges after its per-kind environment filter, so the precheck and the runner's own environment never see it. The runner scans `stdout.log` after the child exits, so a child that prints the value is caught rather than trusted. The proof is a fixture bot that prints its environment's names only (`env | sed 's/=.*//'`) and a scan of the run folder, the record and the delivery message for the planted value.

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
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/008-vault --strict` prints `RESULT: PASSED`
- [ ] Docs updated: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, the lib README and the bot template
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Store, resolver, injector: three steps in one direction, with the value never leaving the store except into a child's environment.

### Key Components
- **`secrets.ts`**: the only module that reads or writes a value. Owns the name grammar, the backend choice, the 0600 index, `setSecret`, `listSecrets`, `forgetSecret`, `resolveSecret`, `knownSecretValues` and the dropped-save check. Nothing it returns carries a value except `resolveSecret`.
- **`secrets-guard.ts`**: refuses a placeholder value and compares two strings in constant time, lifted from rakazo's `secrets-guard.ts`.
- **`secret-matcher.ts`**: the one-pass matcher behind `findSecretLiteral`, lifted from rakazo's `secret-matcher.ts`, so many stored values cost one pass.
- **The runner's resolve step**: after `validatePosture` and before the literal check, resolve the name, refuse `secret-unknown`, add the value to the known-secret map, and build `secretEnv`.
- **The runner's post-run scan**: after the child exits, scan `stdout.log` with the same known-secret map, redact a matching line in place, record `secret-in-output` and withhold the delivery.
- **The deep-loop dispatch-env gate**: takes `dispatchEnvKeys?: string[]` in `assertDispatchEnvAllowed`, so one dispatch names exactly the key it resolved and a key outside both lists is still refused. 007 states the mechanism once for `UTCP_CONFIG_FILE`; this phase passes the same array with `SKILLED_BOT_SECRET_<NAME>`.

### Data Flow
`bots secret set demo` reads the value once, from a no-echo prompt or a piped line, refuses a placeholder, writes it to the keychain by handing `security -i` the `add-generic-password` command on stdin or to a 0600 file, verifies the write by reading it back, and records `{backend, createdAt, updatedAt}` in the 0600 index. A run declaring `secrets: demo` resolves the name, refuses when the index has no entry, adds the value to the known-secret map, and passes `secretEnv: { SKILLED_BOT_SECRET_DEMO: <stored value> }` to `dispatchHeadless`, which merges it into `dispatchEnv` and names the key in `dispatchEnvKeys`. The child sees the key; the record gets `secretsUsed: ["demo"]`; the prompt and the delivery message get neither, and the post-run scan of `stdout.log` catches a child that prints it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/definition.ts` | Parses `secrets` as an optional string and never validates it | update: own the one `secrets` name parse and refuse a name outside the grammar | `rg -n 'secret-name-invalid' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` prints one line |
| `runtime/lib/state-root.ts` | Names the per-identity folders | update: add `secrets` to `identityStatePaths` and `ensureIdentityState` | `rg -n "secrets: join" .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints one line |
| `runtime/lib/run-record.ts` | `HonoredPosture` carries isolation, sandbox, executorKind and model | update: add `secretsUsed`, read as `[]` when absent | `rg -n 'secretsUsed' .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` prints at least two lines |
| `runtime/lib/runner.ts` | Checks the body, question, answer and request prompt for literals at line 942 | update: resolve the name, refuse `secret-unknown`, pass `secretEnv` and its `dispatchEnvKeys` entry, record the name, and scan `stdout.log` after the child exits | `rg -n 'secret-unknown' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints one line and `rg -n 'secret-in-output' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints one line |
| `runtime/lib/dispatch.ts` | Builds the child prompt and filtered environment; `collectKnownSecrets` reads the environment and dotenv files | update: `secretEnv` into `dispatchEnv`, an extra known-secret map, the matcher behind `findSecretLiteral` | `rg -n 'secretEnv' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints at least two lines |
| `runtime/lib/delivery.ts` | Checks a delivery message against the environment's secrets at line 291 | update: include the store's values | `rg -n 'knownSecretValues' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` prints one line |
| `runtime/lib/answer.ts` | Checks an operator answer against the environment's secrets | update: include the store's values, the literal check only; the review seam is 005's and the guarded write is 006's, per the parent's shared-records table | `rg -n 'knownSecretValues' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` prints one line |
| `system-deep-loop/.../executor-audit.ts` | `assertDispatchEnvAllowed` admits only the per-kind list at line 1508 | update: take `dispatchEnvKeys?: string[]` and accept a key in that array, the mechanism 007 states once | `rg -n 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints two lines |
| `.skilled/bin/bots.cjs` | Parses one verb and one id; `VERB_SPECS` is the closed verb list | update: the `secret` verb group, the no-echo prompt and the `secret-no-input` refusal | `node .skilled/bin/bots.cjs secret list` exits 0 |
| `scripts/bot-check.cjs` | Reports every parser refusal as `definition.<reason>` | not a consumer: the name refusal arrives through the parser | `rg -n 'secret-name-invalid' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` exits 1 |
| `assets/bot-template.txt` | Says the `secrets` field is recorded and not enforced | update: the comment and the default | `rg -n 'secrets:' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line |
| `runtime/lib/README.md` | One row per module in the files table | update: one row per new module | `rg -c 'secrets.ts' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints 1 |
| `bots-author/references/bot-definition.md` | Describes `secrets` as a policy recorded on the definition only | update: the field now names a store entry | `rg -n 'secrets' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints one line |
| `feature-catalog/definition/bot-definition-contract.md` | Describes the posture fields, `secrets` included | update: the field now names a store entry | `rg -n 'secrets' .skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md` prints one line |

Required inventories:
- Same-class producers: `rg -n 'secrets' .skilled/skills/system-skilled-bots/runtime/lib` finds every module that names the field; only `definition.ts` does today.
- Consumers of the changed symbol: `rg -n 'posture\.secrets|secretsUsed|collectKnownSecrets|findSecretLiteral' .skilled --glob '*.ts' --glob '*.cjs'` names the runner, dispatch, delivery, answer and the tests.
- Matrix axes: backend (`keychain`, `file`) × value shape (ordinary, empty, placeholder, 16,384 characters, 16,385) × store state (absent, present, unreadable) × bot state (no `secrets`, stored name, unknown name).
- Algorithm invariant: a value reaches exactly one child environment and no other surface the runtime writes, and a child that prints it is caught by the post-run scan. Adversarial cases: a name with `/` or `..`, a value holding a newline, a value equal to a placeholder, a store folder at mode 0755, a record written before the field existed, a child that prints the value, and an undeclared bot reading another name's value file.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `definition.ts`, `state-root.ts`, `run-record.ts`, `dispatch.ts` and the deep-loop gate, and captures the measured behavior. Implementation adds `secrets.ts`, the two lifted modules, the runner's resolve step and post-run scan, the CLI verb group and the record field. Verification runs the fixture bot, scans the run folder and the record for the planted value, and runs the suite, the typecheck and the checker.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `secrets.ts` over a temporary state root with the file backend: set, list, forget, resolve, the name grammar, the 0600 modes, a dropped write, an unreadable index, a closed stdin | Vitest, `tests/secrets.vitest.ts` |
| Unit | `secret-matcher.ts` against the lifted cases: overlapping values, a repeated value, an empty list, the state cap falling back to a per-value scan | Vitest, `tests/secret-matcher.vitest.ts` |
| Unit | `secrets-guard.ts`: a placeholder refused, an ordinary value accepted, the constant-time compare equal and unequal | Vitest, `tests/secrets.vitest.ts` |
| Unit | The keychain backend's one reader and its argv: a set with stdin a pipe and no tty stores the value, the command reaches `security -i` on stdin, and a process-table sample finds no value in any `security` argument | Vitest, `tests/secrets.vitest.ts` |
| Unit | The post-run scan: a `stdout.log` holding the value is redacted in place, `secret-in-output` lands on the record and the delivery is withheld; a partial log from a killed child is scanned | Vitest, `tests/secrets.vitest.ts` |
| Unit | The same-user boundary: a child of a bot declaring no `secrets` reads another name's value file, and the record names no secret | Vitest, `tests/secrets.vitest.ts` |
| Integration | A fixture bot declaring `secrets: demo` runs through `runBot` with a stub executor, and its record carries `secretsUsed: ["demo"]` | Vitest, `tests/secrets.vitest.ts` with `tests/runner-support.ts` |
| Integration | `bots secret set` through the CLI with a piped value, then `bots secret list`, then `bots secret forget` | Vitest, `tests/secrets.vitest.ts` spawning `.skilled/bin/bots.cjs` |
| Manual | One live run of a bot whose body prints its environment's names only (`env \| sed 's/=.*//' \| rg '^SKILLED_BOT_SECRET_'`), then a scan of the run folder for the planted value | `bots run`, `rg` |

The one command that decides the phase: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0, and `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1, where `RUN` is the run folder the fixture prints.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `security` on PATH (macOS) | External | Green on this host, absent elsewhere | The store falls back to the 0600 file; no requirement changes |
| The deep-loop dispatch-env gate | Internal | Yellow: one predicate takes a per-dispatch key list | The value cannot reach the child; the fallback in §7 applies |
| 007-per-bot-apps | Internal | Yellow: a scaffold, not built | This phase adds `secretsUsed` itself; the field is additive |
| `tsx` and Vitest, already in `runtime/node_modules` | Internal | Green | No test can run |
| No new package | Internal | Green | The store uses `node:fs`, `node:child_process` and `node:readline` only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run's prompt, record or delivery message holds a stored value, or the post-run scan misses one.
- **Procedure**: revert the one commit. The store lives under the user-level state root and is untouched by a revert, so `bots secret forget <name>` removes a value the reverted code can no longer read. If the per-dispatch key list is the failing part, revert that file alone and drop REQ-007; the store and the verb group stay useful, and the fallback is a `bots secret run -- <command>` subcommand that spawns its own child.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This phase's build is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the wave, and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:16]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this packet's workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

### Executor roster

| Executor | Model | Effort lever | Dispatch shape | Source |
|----------|-------|--------------|----------------|--------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max`, a standalone flag | `pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking <level> --mode text </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:61] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id | `opencode run --standalone -m opencode-go/deepseek-v4.1-flash#<level> --format json "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:108] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:193] |
| `cli-mistral-vibe` | `deepseek-flash` | none; the roster row's `thinking` is `max` and no flag moves it | `vibe -p "<prompt>" --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] |
| `cli-devin` | `deepseek-v4-1-flash-max` | none; the max tier is baked into the uid, and the weekly quota is probed first with a trivial read-only call | `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous -- "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` | `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:131] |

**Effort policy.** DeepSeek Flash at `high` carries a small mechanical task: a folder name, a record field, a doc line, a test that mirrors an existing one. DeepSeek Flash at `max` carries a design or tricky task: the store and its two backends, the child-environment injection, the post-run scan, the CLI verb group. `gpt-6-luna` at `xhigh` on the `fast` service tier carries the hardest task and is the last fallback for every wave. GPT models go through `cli-codex` alone, because it is the hub's OpenAI-backed mode and no other row in this roster reaches an OpenAI model [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28]. The parent's row for this phase names `--thinking max` as the phase's primary effort [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:201]; the mechanical waves below drop to `high` under the parent's own tier rule, which gives `high` to a small mechanical task and `max` to a design or tricky one [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:188].

**The worker rule.** Parallelism follows file overlap: no two workers touch one file, so a wave's worker count is the number of disjoint file groups its tasks fall into. The parent fixes this phase at four workers, which is the bound every wave below stays under [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:190] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:201].

### Waves

`tasks.md` owns the task ids and their verify clauses; this table owns the assignment. Every wave walks the ladder in §Fallback order, and its executor column is that wave's entry point. The Files column names each file relative to the directory its task line gives: `lib/` and `tests/` sit under `$RT`, `bin/bots.cjs` under `.skilled/`, `system-deep-loop/` under `.skilled/skills/`, and the rest under `.skilled/skills/system-skilled-bots/`.

| Wave | Task ids | Files | Executor | Model | Effort | Workers in parallel | Verify |
|------|----------|-------|----------|-------|--------|---------------------|--------|
| 0 | T001–T006 | none; six reads | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 1, because the six reads feed one baseline record and no file is written | V0 |
| 1 | T008–T013 | `lib/secrets.ts`, `lib/secret-matcher.ts`, `lib/secrets-guard.ts` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3, the file-overlap bound: one worker per new module | V1 |
| 2 | T007, T014–T016, T025–T027 | `lib/state-root.ts`, `lib/definition.ts`, `lib/run-record.ts`, `THIRD_PARTY_NOTICES.md`, `assets/bot-template.txt`, `lib/README.md`, `bots-author/references/bot-definition.md`, `feature-catalog/definition/bot-definition-contract.md` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 4, the file-overlap bound: `state-root.ts` with `definition.ts`, `run-record.ts` with the notices, the template with the lib README, and the two definition docs | V2 |
| 3 | T017–T023 | `lib/dispatch.ts`, `lib/runner.ts`, `lib/delivery.ts`, `lib/answer.ts`, `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 4, the file-overlap bound: `dispatch.ts`, `runner.ts`, `delivery.ts` with `answer.ts`, and the audit gate | V3 |
| 4 | T024 | `bin/bots.cjs` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 1, because one file holds the whole verb group and wave 3 already spends the four-worker bound | V4 |
| 5 | T028–T030 | `tests/secrets.vitest.ts` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 1, because all three tasks write one test file | V5 |
| 6 | T031–T039 | none; the suite, the typecheck, the checker, the fixture run and the validator | the orchestrator, no external executor | none | none | 1 | V6 |

- **V0**: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md` prints 15; `node .skilled/bin/bots.cjs secret set demo` prints `bots: unknown verb: secret` and exits 2; `rg -n 'is not allowed for' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints one line; `rg -n 'secrets' $RT/lib/state-root.ts` exits 1; `rg -n 'secretsUsed' $RT/lib/run-record.ts` exits 1; `rg -n 'FIELD_GROUPS' $RT/lib/run-record.ts` prints two lines.
- **V1**: `rg -n 'export function setSecret' $RT/lib/secrets.ts` prints one line; `rg -n 'add-generic-password' $RT/lib/secrets.ts` prints one line; `rg -n 'secret-write-dropped' $RT/lib/secrets.ts` prints one line; `rg -c 'export function (listSecrets|forgetSecret|resolveSecret|knownSecretValues)' $RT/lib/secrets.ts` prints 4; `rg -n 'Apache-2.0' $RT/lib/secret-matcher.ts $RT/lib/secrets-guard.ts` prints two lines; `cd $RT && npm run typecheck` exits 0.
- **V2**: `rg -n 'secrets: join' $RT/lib/state-root.ts` prints one line; `rg -n 'secret-name-invalid' $RT/lib/definition.ts` prints one line; `rg -c 'secretsUsed' $RT/lib/run-record.ts` prints 2; `rg -c 'Apache-2.0' $S/THIRD_PARTY_NOTICES.md` prints 2; `rg -n 'secrets:' $S/assets/bot-template.txt` prints one line; `rg -c 'secrets.ts' $RT/lib/README.md` prints 1; `rg -c 'secrets' $S/bots-author/references/bot-definition.md $S/feature-catalog/definition/bot-definition-contract.md` prints two lines; `cd $RT && npm run typecheck` exits 0.
- **V3**: `rg -c 'secretEnv' $RT/lib/dispatch.ts` prints 2; `rg -n 'createSecretMatcher' $RT/lib/dispatch.ts` prints one line; `rg -n 'secret-unknown' $RT/lib/runner.ts` prints one line; `rg -n 'secret-in-output' $RT/lib/runner.ts` prints one line; `rg -n 'knownSecretValues' $RT/lib/delivery.ts $RT/lib/answer.ts` prints two lines; `rg -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2; `cd $RT && npm run typecheck` exits 0.
- **V4**: `node .skilled/bin/bots.cjs secret list` exits 0; `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) node .skilled/bin/bots.cjs secret set demo < /dev/null; echo "exit=$?"` prints `secret-no-input` and `exit=2`; `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) sh -c "printf 'skilled-test-value-7f3a\n' | node .skilled/bin/bots.cjs secret set demo --store file && node .skilled/bin/bots.cjs secret list"` exits 0 and prints no value.
- **V5**: `cd $RT && npx vitest run tests/secrets.vitest.ts` prints a `Test Files` line with no `failed`.
- **V6**: `cd $RT && npm test` exits 0; `cd $RT && npm run typecheck` exits 0; `node $S/scripts/bot-check.cjs $S/scripts/fixtures/clean` exits 0; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/008-vault --strict` prints `RESULT: PASSED`.

Wave 6 runs in the orchestrator because each of its tasks reads the finished tree, so a dispatch would add a hop without adding evidence. `$RT` is `.skilled/skills/system-skilled-bots/runtime` and `$S` is `.skilled/skills/system-skilled-bots`, the same variables `tasks.md` uses.

### Fallback order

When a CLI runs out of usage, the wave moves down this ladder and keeps its task ids, its files and its verify step. The order is the parent's, not this phase's, so a phase that falls back still finishes at the effort it was planned for [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:209].

1. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:61]
2. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:108]
3. `cli-mistral-vibe` at `deepseek-flash`, always at the row's `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]
4. `cli-devin` at `deepseek-v4-1-flash-max`, probed first with a trivial read-only call, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, the last fallback [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199].
- Set `AI_SESSION_CHILD=1` on the run and state the exemption in the prompt, because a model cannot see an environment variable [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:165].
- One change per brief: the file, the edit and the check that proves it [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:168].
- Read the outcome record, not stdout. `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116].

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator removes its own row from the roster before the first wave. The ladder above is written to survive one row being gone.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-pi` | never for being inside Pi; only from inside a fan-out lineage or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10] |
| `cli-opencode` | any `OPENCODE_*` env var other than `OPENCODE_API_KEY` is set, `opencode` is in the process ancestry, or `~/.opencode/state/<id>/lock` exists | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:187] |
| `cli-mistral-vibe` | `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] |
| `cli-devin` | `$DEVIN_PROJECT_DIR` is set, or `devin` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:35] |
| `cli-codex` | `$CODEX_SESSION_ID` or any `CODEX_*` env var is set, or `codex` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:35] |

<!-- /ANCHOR:external-orchestration -->

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
