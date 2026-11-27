---
title: "Implementation Plan: Phase 3: link-roster-and-answer-gate"
description: "channel.ts first, with the contract, the capability keys, the config and the reply table, then the link and roster module, the roster check in answer.ts and the channel verb group's link, unlink and roster verbs, over a temporary state root and a scripted fake transport. Section 8 holds the executor roster for the whole phase parent."
trigger_phrases:
  - "link roster plan"
  - "channel contract plan"
  - "messaging channels executor roster"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: link-roster-and-answer-gate

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22 or later for the runtime, CommonJS for the CLI |
| **Framework** | None. `node:crypto` for the code |
| **Storage** | Files under the identity's state root: `channels/config.json`, `channels/links.json` and `operators.json`, each `schemaVersion: 1` |
| **Testing** | vitest, with `temporaryStateRoot` and the fake transport in `tests/channel-support.ts` and no network call in any test |

### Overview
`channel.ts` owns the contract every transport implements, the message shapes, the capability keys of child 002 and the explicit `unsupported` result. It also owns the config file, the token redaction, the seen-record and listen-lease helpers and the reply table of child 001, so every later module has one place to take each from. `channel-link.ts` owns the facts that decide who a chat is: the pending code, the link and the pairing lockout, all in `links.json` and the roster in `operators.json`. `answer.ts` gains one check that every answer surface reaches. The verb group in `bots.cjs` holds argv and printing and no rule a module could hold.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs channel list` prints `bots: unknown verb: channel` and exits 2
- [ ] `ls specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/golden/*.txt | wc -l` prints 21
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One contract module, one file-backed state module, one gate in the shared answer path.

### Key Components
- **`channel.ts`**: the contract, the message model and the capability keys. It imports `state-root.ts` and nothing else (`contracts/runtime-architecture.md` section 1.2). An undeclared operation returns `unsupported` with `retryable: false` and `sentBeforeError: false`, the rule the reference states once per provider [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:55-63]. The contract follows the reference's adapter shape: a descriptor, declared capabilities, a start that takes an inbound sink, a stop, a send that returns a receipt and a status [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:13-117]. The reference is GPL-3.0, so it is design only and no line is copied.
- **`channel-link.ts`**: the code, the link, the pairing lockout and the roster. The lockout constants are the reference's five attempts and 300 s [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/security/mod.rs:15-18]. An unlinked chat is denied by default, the allowlist rule the reference applies to every provider [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/config.rs:133-172]. `link` and `unlink` write the config through `channel.ts`'s `writeChannelConfig`.
- **The 0600 rule**: one helper, `writeStateFile(path, content)` in `state-root.ts`, which writes a temporary file beside the target, calls `chmodSync(temp, 0o600)` and renames it into place, the order `status-index.ts` already uses for its index [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:708]. Every channel file goes through it, so `operators.json`, `channels/config.json`, `channels/links.json` and child 004's `channels/approvals.json` are 0600 inside a 0700 folder without each writer remembering the mode.
- **`answer.ts`**: the one write path an answer takes, and the one place the roster is checked. `answerItem` takes the surface and the actor as arguments and refuses at step 5 of `contracts/answer-seam.md`, before the lock of step 6.
- **The `channel` verb group in `bots.cjs`**: `link`, `unlink` and `roster`. Children 004, 005 and 006 add their verbs to the same group in that order.

### Data Flow
`bots channel roster add ada --role owner` writes `operators.json`. `bots channel link telegram` checks the roster, writes the config entry and a pending code to `links.json` and prints M09. A transport (child 005) hands the inbound message to `channel-link.ts`, which links a chat that sent the pending code from its sender id, refuses an unlinked chat `channel-unlinked`, counts a wrong six-digit code and refuses a locked chat `channel-locked`. A linked chat's answer reaches `answerItem` with the linked actor and the surface `channel`, and `answerItem` refuses `channel-roster-missing` or `answer-not-approver` before anything is written.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/state-root.ts` | Names every per-identity folder | update - add `channelFolder`, `operatorsFile` and `ensureChannelState` | `rg -n 'channelFolder\|operatorsFile\|ensureChannelState' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints three |
| `lib/answer.ts` | Owns the answer write and the resume enqueue | update - the roster check keyed on the surface | `rg -n 'answer-not-approver' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` prints the refusal |
| `bin/bots.cjs` | Owns the verb table, the usage text and the exit codes | update - the `channel` group's first verbs | `node .skilled/bin/bots.cjs channel --help` exits 0 |
| `bots answer` and the screen's answer | Write through `answerItem` with the surface `terminal` | unchanged argv, a present roster now refuses an actor it does not name | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer refuses a terminal answer from an actor off a present roster$")` prints `Tests  1 passed` |

Required inventories:
- Same-class producers of the roster: `rg -n 'operators.json|isApprover' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names one writer (`channel-link.ts`) and one reader (`answer.ts`).
- Same-class producers of the config: `rg -n 'writeChannelConfig' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names one writer (`channel.ts`) and its callers in `channel-link.ts`.
- Consumers of the answer path: `rg -n 'answerItem' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every surface that answers.
- Algorithm invariant: the roster check runs before the lock and before any write, so no channel surface records an answer from an actor the roster does not name.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the reference adapter, the lockout constants, `answer.ts` and `state-root.ts` and captures the baseline suite. Implementation writes `channel.ts` and the state folders first, which is the handoff child 004 waits for, then the helpers, `channel-link.ts`, the roster check and the verbs. Verification runs the four test files, the suite, the typecheck, one link on a temporary state root and the validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `channel.ts`: the contract, the message model, the unsupported result, the config, the redaction and the reply table against the goldens | `npx vitest run tests/channel.vitest.ts` |
| Unit | `channel-link.ts`: the code, the default deny, the lockout, the roster, the mismatched sender id | `npx vitest run tests/channel-link.vitest.ts` |
| Unit | `answer.ts`: the roster check on both surfaces, the absent roster, the present roster on the terminal, the concurrent answer | `npx vitest run tests/answer.vitest.ts` |
| Integration | The verbs' argv, refusals and exit codes | `npx vitest run tests/cli-channel.vitest.ts` |
| Manual | One roster add and one link on a temporary state root | `tasks.md` T024 |

No test opens a socket. The fake transport records each wire call and returns a scripted result.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Children 001 and 002 | Internal | Written | The reply table and the shapes would be undecided |
| Phase 001's actor | Internal | Yellow | `answerItem` would have no actor argument to check |
| Phase 006's guarded write | Internal | Yellow | A concurrent answer would not be refused |
| Phase 008's vault | Internal | Yellow | Not used here. `link` writes a secret name and never reads a value |

No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a channel answers an item for a sender who is not an owner or member, or a terminal answer on an absent roster is refused.
- **Procedure**: revert this child's commit. Delete `<stateRoot>/<identity>/channels/` and `operators.json` on any host that ran it, because nothing else reads them once `answer.ts` reverts. `bots answer` returns to the host-authority rule with no roster check.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | Setup and children 001 and 002 | Verification and child 004 once T006 to T008 land |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This section is the executor roster for the whole phase parent. Every other child's plan section 8 points here and adds its own wave table. The build is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the wave and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:16]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this packet's workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

### Executor roster

| Executor | Model | Effort lever | Dispatch shape | Source |
|----------|-------|--------------|----------------|--------|
| `cli-mistral-vibe` | `deepseek-flash` | none, always the row's `max` | `VIBE_HOME="$VH" vibe -p "<prompt>" --model deepseek-flash --add-dir "$WT" --auto-approve --output-dir "$RUN_DIR/out" </dev/null`, run from a scratch folder inside the worktree `$WT`, with `$VH` a fresh `mktemp -d` outside it | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] |
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max` | `pi -p "<prompt>" --model llmgateway/deepseek-v4.1-flash-1017 --thinking <level> --mode text --offline </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id | `opencode run --standalone -m opencode-go/deepseek-v4.1-flash#<level> --format json "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] |
| `cli-devin` | `deepseek-v4-1-flash-max` | none, the max tier is in the uid | `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous -- "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:85] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` | `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" "<prompt>"` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] |

**Effort policy.** `high` carries a small mechanical task: a verb option, a doc line, a test that mirrors an existing one. `max` carries a design or tricky task: a new module, a transport, the roster check. `gpt-6-luna` at `xhigh` is the last fallback for every wave, through `cli-codex` alone, because no other row reaches an OpenAI model [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28]. The parent packet's EXTERNAL ORCHESTRATION section sets `cli-mistral-vibe` at `deepseek-flash` and `max (fixed)` as this phase's primary and the four-worker bound, so every wave runs at `max` and the tier sets only the fallback tier on `cli-pi`.

**The worker rule.** No two workers touch one file, so a wave's worker count is the number of disjoint file groups its tasks fall into, at most four. Across children, `bots.cjs` is edited in the order 003, 004, 005, 006 and the two shared test files in the order the parent spec section 5 gives.

### Waves of this child

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T005 | none, reads and the baseline | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `high` | 1 | V0 |
| 1 | T006 to T008 | `lib/channel.ts`, `lib/state-root.ts` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 2 | V1, the handoff to child 004 |
| 2 | T009 to T012 | `lib/channel-link.ts`, `tests/channel-support.ts` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 2 | V2 |
| 3 | T013, T014 | `lib/answer.ts`, `bin/bots.cjs` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 2 | V3 |
| 4 | T015 to T018 | the four test files | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `high` | 4 | V4 |
| 5 | T019 to T026 | none | the orchestrator | none | 1 | V5 |

- **V0**: T001 to T005 print what they say.
- **V1**: T006 to T008 print what they say, and `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- **V2**: T009 to T012 print what they say, and the typecheck exits 0.
- **V3**: T013 and T014 print what they say, and the typecheck exits 0.
- **V4**: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts tests/channel-link.vitest.ts tests/answer.vitest.ts tests/cli-channel.vitest.ts` prints a `Test Files` line with no `failed` count.
- **V5**: T019 to T026 print what they say.

### Fallback order

When a CLI runs out of usage, the wave moves down this ladder and keeps its task ids, its files and its verify step.

1. `cli-mistral-vibe` at `deepseek-flash`, always at the row's `max`
2. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max`
3. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max`
4. `cli-devin` at `deepseek-v4-1-flash-max`, probed first with a trivial read-only call, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, the last fallback

A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198].
- Compose every prompt as the child preamble, then the inlined persona, then the task and set `AI_SESSION_CHILD=1` on the run [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:38].
- One change per brief: the file, the edit and the check that proves it.
- Keep GPL sources out of the brief of a worker that writes a transport. tinychannels is GPL-3.0 and Skilled is MIT. The worker that reads a provider's tinychannels source writes the wire facts it needs as a design note, `design/wire-notes.md` in the child that owns the transport, in its own words with one `[SOURCE:]` per fact. A different worker writes the transport from that note and the child's Wire Table, and its brief names no tinychannels path. The orchestrator records which worker wrote which file. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/plan.md:168]
- Read the outcome record, not stdout. `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:72].
- A Vibe worker starts from its own scratch folder inside the worktree, passes `--add-dir` for the worktree and keeps `VIBE_HOME` outside it, as the parent's Vibe dispatch says [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "BUILD ORCHESTRATION", Vibe dispatch].
- Every task that writes state runs on a temporary state root, never the real one, as `tasks.md` Task Notation requires.

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator removes its own row from the roster before the first wave.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-pi` | from inside a fan-out lineage, or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10] |
| `cli-opencode` | any `OPENCODE_*` env var other than `OPENCODE_API_KEY` is set, or `opencode` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:187] |
| `cli-mistral-vibe` | `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] |
| `cli-devin` | `$DEVIN_PROJECT_DIR` is set, or `devin` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:35] |
| `cli-codex` | `$CODEX_SESSION_ID` or any `CODEX_*` env var is set, or `codex` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:35] |
<!-- /ANCHOR:external-orchestration -->
