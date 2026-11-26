---
title: "Implementation Plan: Phase 7: per-bot-apps"
description: "Adds an apps key to the BOT.md parser, a runtime module that filters the repository UTCP config into each run folder, an apps list on the honored posture, the child environment key that points at it, and a fail-closed checker invariant."
trigger_phrases:
  - "per bot apps plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: per-bot-apps

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22+, loaded through the runtime's own `tsx`; the checker is CommonJS |
| **Framework** | None; the bots runtime is a flat module set over the deep-loop executor tables |
| **Storage** | JSON files: the repository `.utcp_config.json`, the per-run `<runFolder>/utcp.json`, and the run record |
| **Testing** | Vitest in `.skilled/skills/system-skilled-bots/runtime`, plus the checker's fixture-driven suite |

### Overview
One new module, `apps.ts`, reads the repository UTCP config, refuses a declared name it does not hold, and writes a filtered copy into the run folder and, for a run with its own worktree, into the worktree root, which is the path the project MCP configs already pin. The runner calls it between the posture check and dispatch, records the honored names on the run record, and hands the child the file's absolute path in `UTCP_CONFIG_FILE`, admitted through a per-dispatch key list rather than a widened kind list. A run that declares `apps` and has no worktree is refused `apps-unenforceable`, because there is nowhere to place the file without dirtying the checkout. A shared run that declares no `apps` still writes the run-folder copy and records `[]`, but its child reads the repository config through the pin, so `apps` narrows a worktree run only; the risk table names that limit rather than claiming a narrowing the pin prevents. The checker imports the same predicate, so a name the runner would refuse fails the check first.

Two rules keep the worktree write from outliving its run. The runner restores the tree's own file after the child exits, and a tree found holding the filtered file at the next open is restored before anything else is written, which covers a run killed between the write and the restore. The five documents under `design/` fix every field, the gate order, the refusal detail text, the fixture matrix and the text an operator reads, so no builder makes a design decision of its own.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` prints `Test Files` with no failed file and exits 0
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints `FAIL: apps-unknown-server:` and exits 1
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered module set with named refusals.

### Key Components
- **`apps.ts` (new)**: the only reader of `.utcp_config.json` and the only writer of a run's filtered config. It sits in the runner and dispatch group and imports `repo-config` and `state-root` and nothing else from `lib/`, as the packet's module table fixes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "1.2 New modules", row `apps.ts`] Exports `readUtcpServerNames`, `resolveApps` and `writeRunUtcpConfig`, each returning a `Result` with a named reason rather than throwing, so the checker and the runner report the same refusal. `writeRunUtcpConfig` writes `<runFolder>/utcp.json` and, when the run has a worktree, `<worktree>/.utcp_config.json`, and makes each `load_variables_from` entry's `env_file_path` absolute against the source config's folder. `design/records.md` section 4 fixes every key it writes.
- **`definition.ts`**: gains `apps` in `FRONTMATTER_KEYS` and a list predicate, so a malformed list is refused at parse time like every other field. `design/records.md` section 1 fixes the four legal inputs and the two refusals.
- **`runner.ts`**: calls `resolveApps` after `validatePosture` and before the worktree, writes the config, sets `seed.posture.apps`, passes `UTCP_CONFIG_FILE` in the environment handed to `dispatchHeadless` and names it in `dispatchEnvKeys`, restores the worktree's own file after the child exits, which covers the working tree and not a commit the child made, restores a tree found holding the filtered file at the next open before it writes anything, and refuses `apps-unenforceable` when the definition declares `apps` and `isolation` is not `worktree`. `design/state-machines.md` section 2 fixes the ten-step order and section 3 fixes the file's four states.
- **`run-record.ts`**: `HonoredPosture` gains `apps: string[]`. The record validator checks the posture block's shape and not its keys, so no validator change is needed. `design/records.md` section 3 fixes the value's four rules.
- **`executor-audit.ts`**: `RunAuditedExecutorCommandInput` gains `dispatchEnvKeys?: string[]`, and `assertDispatchEnvAllowed` accepts a key that is in the kind's list or in that array. A prefix rule is not used: it would admit any future caller's key built from a bot-controlled name.
- **`bot-check.cjs`**: gains `apps-unknown-server` in `HARD_INVARIANTS` and one call to `resolveApps` per definition, so the checker restates no field rule. `design/refusals.md` section 2 fixes the line and its detail.

### Data Flow
`BOT.md` → `parseDefinition` → `Posture.apps` → `resolveApps` against `.utcp_config.json` → honored names → `writeRunUtcpConfig` writes `<runFolder>/utcp.json` and, for a worktree run, `<worktree>/.utcp_config.json` → `seed.posture.apps` on the record → `UTCP_CONFIG_FILE` in the child environment, named in `dispatchEnvKeys` → the Code Mode server resolves that path instead of the repository config, and the project pin's relative value resolves to the same file because the child's working directory is the worktree. A shared run diverges at the last step: its working directory is the checkout, so the pin resolves to `<checkout>/.utcp_config.json` and the child reads the repository config, which is the limit the risk table names. After the child exits the tree's own file is restored, and a tree left holding the filtered file by a killed run is restored at its next open.

### Design Documents

The five documents under `design/` are the phase's design record and a builder reads them before the first edit. Each one owns a question this plan does not answer twice.

| Document | Owns | Read before |
|----------|------|-------------|
| [`design/records.md`](design/records.md) | every field, its type, its null rule, its absent-key default and its version rule | T005, T006, T007 |
| [`design/state-machines.md`](design/state-machines.md) | the declaration lifecycle, the gate order, the worktree file lifecycle and three sequences | T006, T009, T021, T022, T023 |
| [`design/refusals.md`](design/refusals.md) | the six names, their detail text, their precedence and what the operator sees | T005, T006, T008, T011 |
| [`design/fixtures.md`](design/fixtures.md) | the declaration by config-state matrix, the goldens and the checker defect fixture's literal tree | T012, T015, T016 |
| [`design/mockups.md`](design/mockups.md) | the literal text of every surface this phase changes | T011, T013, T014 |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a field and a fail-closed default, so it touches a shared dispatch-env gate, a record schema and a checker invariant.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Owns `DISPATCH_ENV_KEYS`, the per-kind list of caller-named keys, and `assertDispatchEnvAllowed` | update: add `dispatchEnvKeys?: string[]` to the input and accept a key in that array | `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2, and a test proves a key outside both lists is still refused |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Owns the frontmatter key set and the field predicates | update: add `apps` and its list predicate | `grep -n "'apps'" .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` prints the key-set line |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Owns `HonoredPosture` and the record validator | update: add `apps`; validator unchanged | `grep -n 'apps' .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` prints the interface line |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Owns the run order and the refusal causes | update: resolve, write both copies, record, set the child key and its `dispatchEnvKeys` entry, restore the worktree file after the child exits and at the next open of a tree that holds the filtered one, add `apps-refused` and `apps-unenforceable` | `grep -c 'apps-refused' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 1, `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 1 and `grep -c 'utcp_config.json' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 2 |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Owns the invariant lists and the audit | update: add the invariant and its call | `grep -n 'apps-unknown-server' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` prints two lines |
| `.skilled/skills/mcp-code-mode/mcp-server/dist/index.js` | Reads `UTCP_CONFIG_FILE` before falling back to the working directory | not a consumer of this change: it already resolves the key | `grep -n 'UTCP_CONFIG_FILE' .skilled/skills/mcp-code-mode/mcp-server/dist/index.js` prints the lookup line |
| `.claude/mcp.json`, `.codex/config.toml`, `opencode.json`, `.cursor/mcp.json`, `.mcp.json` | Pin `UTCP_CONFIG_FILE` to `.utcp_config.json` in each MCP server block | unchanged: the pin stays, and the worktree write is what makes it resolve to the filtered file; for a shared run the pin resolves against the checkout, which is the named limit | `grep -n 'UTCP_CONFIG_FILE' .claude/mcp.json` still prints line 9 |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` | Asserts the pin is present | unchanged: the pin stays | `grep -n 'UTCP_CONFIG_FILE' .skilled/commands/doctor/scripts/mcp-doctor-lib.sh` still prints two lines |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Indexes run rows | not a consumer: it holds no posture column | `grep -c 'posture' .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints 0 |

Required inventories:
- Same-class producers: `grep -rn 'manual_call_templates' .skilled --include='*.ts' --include='*.cjs'` names every reader of the server list; `apps.ts` must be the only new one.
- Consumers of changed symbols: `grep -rn 'HonoredPosture' .skilled/skills/system-skilled-bots/runtime` names `posture.ts`, `runner.ts` and `run-record.ts`; `grep -rn 'FRONTMATTER_KEYS' .skilled/skills/system-skilled-bots` names `definition.ts` alone.
- Matrix axes: declaration (`absent`, `null`, `[]`, one name, all 14 names, one unknown name) crossed with config state (`present`, `missing`, `malformed`) is the required row set for `apps.vitest.ts`.
- Algorithm invariant: the filtered config's `manual_call_templates` is a subset of the source list, in source order, and every other top-level key is byte-identical to the source except `load_variables_from`, whose `env_file_path` is made absolute against the source config's folder. Adversarial cases: a name differing only by case, a name that is a prefix of another, a duplicate name in the declaration, a config whose `manual_call_templates` is absent, and a relative `env_file_path` that would otherwise resolve inside the run folder.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `definition.ts`, `run-record.ts`, `runner.ts`, `bot-check.cjs` and the deep-loop dispatch-env gate, records the 14-server count, and reads the five documents under `design/`, which fix every field, the gate order, the refusal detail text, the fixture matrix and the text an operator reads. Implementation adds `apps.ts`, the `apps` field, the record field, the runner call, the `dispatchEnvKeys` entry, the checker invariant and the next-open restore. Verification runs the checker on the new defect fixture and on `clean`, then the runtime suite and the typecheck.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveApps` and `writeRunUtcpConfig` over the declaration and config matrix, and `parseDefinition` on a malformed `apps` | Vitest, `runtime/tests/apps.vitest.ts` |
| Integration | One run of a bot declaring `apps: [github]` and one declaring none, asserting the written file, the record's `posture.apps` and the child environment key; the absent-declaration case runs under both isolations, so a shared run's written file and `[]` record are proven even though its child reads the repository config | Vitest, `runtime/tests/apps.vitest.ts` over `runner-support.ts` |
| Integration | A worktree run, asserting `<worktree>/.utcp_config.json` holds one template and the tree's own file is back after the run; and a `isolation: shared` run declaring `apps`, asserting `apps-unenforceable` | Vitest, `runtime/tests/apps.vitest.ts` over `runner-support.ts` |
| Integration | A run killed between the worktree write and the restore, then the next open of that tree: the tree is left holding the filtered file, the next run restores the tree's own file before it writes anything and the filtered copy is not the base the next run copies from. The case drives the runner to the write, abandons it before the restore, then opens the same tree again and asserts the file's content and the order of the two writes | Vitest, `runtime/tests/apps.vitest.ts` over `runner-support.ts` |
| Unit | `assertDispatchEnvAllowed` admits a key named in `dispatchEnvKeys` and still refuses one named in neither list | Vitest, `runtime/tests/apps.vitest.ts` |
| Integration | The checker over the new defect fixture and over `clean` | Vitest, `runtime/tests/bot-check.vitest.ts` |
| Manual | `/doctor:bots` over a repository whose bot declares an unknown server | The command, read-only |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `yaml` 2.9.1, already in the runtime manifest | Internal | Green | The parser cannot read frontmatter |
| `vitest` 4.1.12, already in the runtime manifest | Internal | Green | No test can run |
| The deep-loop dispatch-env gate | Internal | Green | The child never sees `UTCP_CONFIG_FILE`, so the filtered config is written and unread |
| The repository `.utcp_config.json` | Internal | Green | No server names to check a declaration against; the run refuses when `apps` is declared |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run that declares `apps` reaches a server it did not declare, or a bot that declares none loses a connector it needs before the follow-up lands.
- **Procedure**: revert the one commit. The `apps` key leaves the parser's key set, so a definition that declares it is refused as `definition.unknown-key` again, the checker's invariant list loses its row, and `dispatchEnvKeys` leaves the executor input. No state file needs cleaning: the filtered config lives inside a run folder, and a run folder is evidence, not input. A worktree whose run was killed before the restore keeps the filtered copy, and the next open of that tree restores the tree's own file before anything else is written, so the reverted runtime leaves no tree narrowed. A tree the reverted runtime never opens keeps the filtered copy until something opens it, and the file holds a subset of the servers and no credential, so it narrows a later run rather than leaking one.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

Every task in `tasks.md` is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the worker count, and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:16]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this phase's own workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

**The roster.** Five executors, no sixth. `cli-opencode` at `opencode-go/deepseek-v4.1-flash` takes `#high` or `#max` on the model id, and it is this phase's primary [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:142]. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017` takes `--thinking high` or `max`, the one effort lever that is a standalone flag [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157]. `cli-mistral-vibe` at `deepseek-flash` runs at `max` only, because the tier is the roster row's `thinking` field and no flag moves it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]. `cli-devin` at `deepseek-v4-1-flash-max` bakes `max` into the model uid [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md:59]. `cli-codex` at `gpt-6-luna` takes `xhigh` on the `fast` service tier, and it is the only route to a GPT model [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28].

**The tier rule.** DeepSeek Flash at `high` carries a small mechanical task: an edit to a settled module, a test that mirrors an existing one, a doc line. DeepSeek Flash at `max` carries a design or tricky task: a new module, a new shared record, a seam between two phases. `gpt-6-luna` at `xhigh` on `fast` carries the hardest task and is the last fallback for every wave [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

**The worker rule.** Parallelism follows file overlap: no two workers touch one file, so a wave's worker count is the number of disjoint file groups its tasks fall into [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]. The parent's row for this phase fixes `cli-opencode` at `#high` and four workers in parallel [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION", row 007]. No wave below exceeds four.

**The effort the route actually runs.** `opencode-go/deepseek-v4.1-flash` is pinned to the max thinking tier by policy, and the fan-out builder upgrades a lower request [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146]. The `#high` cells below name the tier the task earns under the tier rule; on this route they run at max, and the parent row's `#high` cell reads the same way. `cli-pi` is the route that delivers a real `high`, which is why it is the first fallback for a mechanical wave.

The shell variables are the ones `tasks.md` sets, plus one for the audit gate: `LIB=.skilled/skills/system-skilled-bots/runtime/lib`, `TESTS=.skilled/skills/system-skilled-bots/runtime/tests`, `RT=.skilled/skills/system-skilled-bots/runtime`, `C=.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`, `AUDIT=.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`. A wave table's `Files` column names each file relative to the directory its task line gives, so `$LIB` and `$TESTS` resolve from the repository root and the four W1d paths sit under `.skilled/skills/system-skilled-bots/`.

### W0 Setup - orchestrator, no dispatch

Tasks T001, T002, T003 and T004. One worker, the orchestrator, because the wave writes no file: it reads the five files, records the 14-server count, and captures the two baselines the later waves are measured against.

Verify: `python3 -c "import json;d=json.load(open('.utcp_config.json'));print(len(d['manual_call_templates']),'servers')"` prints `14 servers`; `grep -c 'dispatchEnvKeys' $AUDIT` prints 0; `grep -rc 'apps' $LIB/*.ts $C | grep -v ':0'` prints nothing and exits 1; T002's baseline prints `FAIL: definition.unknown-key:` and exits 1; `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design` prints the five documents and `fixtures`, and every verify command in `design/fixtures.md` section 5 prints what it says.

### W1 Implementation - `cli-opencode` at `opencode-go/deepseek-v4.1-flash`, four workers

The wave brief fixes the two interfaces before any worker starts: `Posture.apps` is `string[] | null` and `HonoredPosture.apps` is `string[]`, and `apps.ts` exports `readUtcpServerNames`, `resolveApps` and `writeRunUtcpConfig`, each returning a `Result` with a named reason. With those fixed, the four groups share no file.

| Worker | Task ids | Files | Effort | Fallback if `cli-opencode` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W1a | T005, T007 | `$LIB/definition.ts`, `$LIB/run-record.ts` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |
| W1b | T006 | `$LIB/apps.ts` | `#max` | `cli-pi` `--thinking max`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |
| W1c | T010 | `$AUDIT` | `#max` | `cli-pi` `--thinking max`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |
| W1d | T013, T014 | `assets/bot-template.txt`, `bots-author/references/bot-definition.md`, `feature-catalog/definition/bot-definition-contract.md`, `feature-catalog/definition/definition-checker.md` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

W1a is mechanical: one key in a set, one predicate, one field on an interface. W1b and W1c carry `#max` because each is the design case the tier rule names: W1b is the new module that copies every top-level key and rewrites one path, and W1c is the shared gate every executor kind reads. W1d is doc lines and a template comment.

Verify: `grep -n "'apps'" $LIB/definition.ts` prints the key-set line and `grep -c 'apps-invalid' $LIB/definition.ts` prints 1; `grep -n 'apps' $LIB/run-record.ts` prints one line inside the interface; `grep -c 'export function' $LIB/apps.ts` prints 3, `grep -c 'utcp.json' $LIB/apps.ts` prints 1 and `grep -c 'env_file_path' $LIB/apps.ts` prints 1; `grep -c 'dispatchEnvKeys' $AUDIT` prints 2; `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line; `grep -l 'apps' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md .skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md .skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` prints all three paths and `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1.

The wave runs no typecheck: `HonoredPosture` gains a required `apps`, and `runner.ts` does not seed it until W2, so a typecheck here would fail on the wave's own interface rather than on a worker's mistake.

### W2 Runner wiring - `cli-opencode` at `opencode-go/deepseek-v4.1-flash`, one worker

Tasks T008, T009, T021, T022 and T023. One worker, because all five edit `$LIB/runner.ts` and the run order they change is one sequence: the refusal cause, the seed, the resolve-and-write call, the child key, the no-worktree refusal, the after-exit restore and the next-open restore.

| Worker | Task ids | Files | Effort | Fallback if `cli-opencode` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W2 | T008, T009, T021, T022, T023 | `$LIB/runner.ts` | `#max` | `cli-pi` `--thinking max`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

`#max` because this is the seam the tier rule names: the call sits between the posture check and the worktree, and the two restores have to leave a commit the child made alone.

Verify: `grep -c 'apps-refused' $LIB/runner.ts` prints 1, `grep -c 'apps: \[\]' $LIB/runner.ts` prints 1, `grep -c 'UTCP_CONFIG_FILE' $LIB/runner.ts` prints 2, `grep -c 'dispatchEnvKeys' $LIB/runner.ts` prints 1, `grep -c 'apps-unenforceable' $LIB/runner.ts` prints 1 and `grep -c 'utcp_config.json' $LIB/runner.ts` prints 2; `cd $RT && npm run typecheck` exits 0.

### W3 Checker and fixture - `cli-opencode` at `opencode-go/deepseek-v4.1-flash`, one worker

Tasks T011 and T012. One worker, because T012's verify runs the checker T011 changes, so the fixture cannot be proven before the invariant exists.

| Worker | Task ids | Files | Effort | Fallback if `cli-opencode` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W3 | T011, T012 | `$C`, `.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

Verify: `grep -c 'apps-unknown-server' $C` prints 2; `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints a line starting `FAIL: apps-unknown-server:` and exits 1; `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0.

### W4 Tests - `cli-opencode` at `opencode-go/deepseek-v4.1-flash`, two workers

| Worker | Task ids | Files | Effort | Fallback if `cli-opencode` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W4a | T015 | `$TESTS/apps.vitest.ts` | `#max` | `cli-pi` `--thinking max`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |
| W4b | T016 | `$TESTS/bot-check.vitest.ts` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

W4a carries `#max` because it is the matrix `design/fixtures.md` section 1 fixes: declaration (`absent`, `null`, `[]`, one name, all 14 names, one unknown name, a duplicate, a case-differing name, a prefix name) crossed with config state (`present`, `missing`, `malformed`, no `manual_call_templates`), plus the worktree write, both refusals, the killed-run restore and the unlisted-key case. W4b is one row mirroring an existing one.

Verify: `cd $RT && npx vitest run tests/apps.vitest.ts` exits 0; `cd $RT && npx vitest run tests/bot-check.vitest.ts` exits 0.

### W5 Verification - orchestrator, no dispatch

Tasks T017, T018, T019 and T020. One worker, the orchestrator, because the wave writes no file: it runs the whole suite, the typecheck, the checker over both fixtures, and the `/doctor:bots` route over the defect fixture.

Verify: `cd $RT && npm test` exits 0 and prints no `FAIL` line; `cd $RT && npm run typecheck` exits 0; `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0; `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints `FAIL: apps-unknown-server:` and exits 1; `git status --porcelain -- .skilled/skills/system-skilled-bots/scripts/fixtures` prints nothing, so the read-only route wrote nothing; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps --strict` prints `RESULT: PASSED`.

T020's route is read-only and its checker is `$C`, so the orchestrator runs the same binary the route runs rather than a second copy of the check [SOURCE: .opencode/commands/doctor/bots.md:33].

### Fallback order

Every wave walks this ladder from its own entry point, and a wave names only that entry point. A row is skipped, not retried, when its guard refuses or its usage is exhausted. The phase's primary sits first and the parent's relative order holds for the four behind it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

1. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78]
2. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101]
3. `cli-mistral-vibe` at `deepseek-flash`, always at the row's `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67]
4. `cli-devin` at `deepseek-v4-1-flash-max`, probed first with a trivial read-only call, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, the last fallback [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199].
- Compose every prompt as the child preamble, then the inlined persona, then the task, and set `AI_SESSION_CHILD=1` on the run [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:38] [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:68].
- One change per brief: the file, the edit and the check that proves it.
- Close stdin on every non-interactive dispatch. `opencode run` hangs at 0% CPU with stdin open [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130], and `pi -p` inherits the caller's stdin without `</dev/null` [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78].
- Read the outcome record, not stdout. `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116].

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator removes its own row from the roster before the first wave. The ladder above is written to survive one row being gone.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-opencode` | any `OPENCODE_*` env var other than `OPENCODE_API_KEY` is set, `opencode` is in the process ancestry, or `~/.opencode/state/<id>/lock` exists | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:91] |
| `cli-pi` | never for being inside Pi; only from inside a fan-out lineage or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:13] |
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
| Setup | Nothing; it reads the five files and records the server count | Implementation, which needs the parser's key set and the runner's refusal-cause table |
| Implementation | Setup, whose reads fix the exact insertion points | Verification, which exercises the written file and the invariant |
| Verification | Implementation, whose module and invariant it runs | Phase 8, which injects secrets into the same per-run config |
<!-- /ANCHOR:phase-deps -->

---
