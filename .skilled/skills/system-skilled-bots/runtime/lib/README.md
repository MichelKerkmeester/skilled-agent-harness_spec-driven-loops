---
title: "system-skilled-bots runtime library"
description: "Flat TypeScript module set holding the contracts, schedule translation, runner, request queue, launchd installer and status index for file-defined bots."
trigger_phrases:
  - "bots runtime library"
  - "skilled bots lib modules"
---

# system-skilled-bots / runtime / lib

---

## 1. OVERVIEW

This folder holds the bots domain logic as 32 flat modules, one concern per file. The front door CLI and the definition checker load these files through the runtime's own `tsx` and hold no rules themselves. A defect in a definition, a config or a request comes back as a refusal with a named reason, not a throw, so a caller can report it and keep going.

The modules lean on the deep-loop runtime for the parts a bot run shares with a loop iteration: atomic state writes, the executor tables, the audited spawn, the loop lock and the mode append gateway. They add the bot-specific layers on top: BOT.md parsing, cron translation, the file queue, launchd jobs, delivery and the status index.

---

## 2. PACKAGE TOPOLOGY

```text
contracts and state   repo-config, definition, identity, state-root,
                      approval, run-record, switches, needs-you,
                      routine, routine-state, memory, skills
        ▲
        │ every other group reads these
        │
schedule              cron-translator ──▶ slot-lister ──▶ slot-accounting
runner and dispatch   runner ──▶ dispatch, posture, result-ledger
isolation, delivery   isolation, delivery           (called by runner)
request pipeline      request-record ──▶ request-queue ──▶ request-drain ──▶ runner, conversation
                      answer ──▶ request-queue, skill-proposal
                      conversation ──▶ dispatch, memory
launchd installer     installer ──▶ plist-render, label, cron-translator, request-drain
                      launchctl-print ──▶ installer
status index          status ──▶ status-index, launchctl-print, installer
```

Allowed direction: a contracts module imports no `lib/` module outside its own group, and `repo-config.ts` imports no sibling at all. Every other group may import the contracts group, and the arrows show its main edges beyond that. No module imports the CLI under `../../../../bin/` or the checker under `../../scripts/`.

---

## 3. FILES

| File | Group | Responsibility |
|---|---|---|
| `repo-config.ts` | Contracts and state | The one reader of a repository's bots config. A missing file yields defaults, and a malformed one is a refusal. Also loads the shared repository identity resolver. |
| `definition.ts` | Contracts and state | Parses one BOT.md into a `BotDefinition`: trigger kind (`cron`, `queue`, `git-hook`, `manual`), runtime block, budget, isolation, sandbox and delivery. |
| `identity.ts` | Contracts and state | `resolveIdentity` takes the identity an installed job pins in `SKILLED_BOTS_IDENTITY` first, then the declared config identity, then the shared resolver, and refuses when none gives an answer. |
| `actor.ts` | Contracts and state | The actor name pattern and `resolveActor`, which takes an explicit `--as` name first, then the operator pinned into a job's environment on a scheduled fire or drain only, then the OS user. |
| `state-root.ts` | Contracts and state | Names the user-level state root and the per-identity folders for requests, leases, switches, items and records. The root is the absolute path an installed job pins in `SKILLED_BOTS_STATE_ROOT`, else the config's `stateRoot` when set, else a `system-skilled-bots` folder under `XDG_STATE_HOME` or the home `.local/state` folder. Also names each bot's approval file in the identity's approvals folder. |
| `approval.ts` | Contracts and state | Hashes a bot's `BOT.md` and the checkout's bots config. `approveDefinition` records both hashes at an operator act (install, enable, manual run), and `checkApproval` refuses an unattended run as `definition-unapproved` or `definition-drifted`. |
| `action-kind.ts` | Contracts and state | The seven action kinds in their fixed order, the word lists that recognize six of them and `classifyAction`, which reads the whole question, takes an `[ACTION: <kind>]` token as a floor and returns the strictest kind or `other`. |
| `approval-ladder.ts` | Contracts and state | The four rungs in OpenBot's order and the `bot` fallback, `decideApproval`, which returns rung `kind` or `bot` and never rungs 2 to 4, plus the two scopes an answer may grant with the NO rule. |
| `run-record.ts` | Contracts and state | The one record per run that the queue, delivery and status index all read. Adds the `awaiting-decision` exit for a parked run. |
| `switches.ts` | Contracts and state | The `disabled`, `paused` and `completed` stop files, kept outside every checkout so a run cannot clear its own stop. |
| `needs-you.ts` | Contracts and state | Items a run leaves for an operator decision. State (open, answered, expired) is derived on every read and never stored, and the item's grants field carries the kind, the rung and the granted scope. |
| `memory.ts` | Contracts and state | The two bounded memory files, the shared one beside the identity folders and one per bot in its identity's `memory` folder, both owner-only and made by the first append. One entry is one line, `- <type> \| <YYYY-MM-DD> \| <actor> \| <source> \| <text>`, split on its first four delimiters, with an 8-hex id from the SHA-256 of the line. A file holds at most 60 entries and 3,600 bytes and a text at most 400 characters, and an append past either bound is refused `memory-full` rather than rewritten. `renderMemoryBlock` writes the labelled `<memory>` block the prompt carries. Imports `state-root.ts` only. |
| `skills.ts` | Contracts and state | The BOT.md `skills` list. `parseSkillList` checks the names against the bot id grammar, `loadSkills` reads each named `SKILL.md` once and refuses a body over 16,384 bytes, a list over 20,480 bytes or a body whose digest differs from its pin, `resolveSkillPins` finds that pin in the install record or the bot's last dispatched run, and `renderSkillsPrompt` writes one labelled `<skill_content>` block per skill. Imports `memory.ts`, `run-record.ts` and `state-root.ts` only. |
| `secrets.ts` | Contracts and state | The vault and the only module that reads or writes a stored value. Names follow the bot id grammar with at most 64 characters, and a name maps to the child environment key `SKILLED_BOT_SECRET_<NAME>`. A value lives in the OS keychain, through `security` on macOS or `secret-tool` on Linux, stored in hex under account `<name>@<scope>`, or in a 0600 file under the identity's `secrets` folder. The 0600 index records the backend, the timestamps and who set each entry. `set` and `forget` hold `secrets/index.lock`, every keychain call is killed after 10 s and a store that cannot be read refuses `secret-store-unreadable` rather than reading as empty. Imports `state-root.ts` only. |
| `secret-matcher.ts` | Contracts and state | The one-pass multi-value matcher lifted from Rakazo under its licence, which `findSecretLiteral` and the post-run scan use so many stored values cost one pass over a text. Imports nothing. |
| `routine.ts` | Contracts and state | The optional BOT.md `routine` block: `parseRoutine` takes the trigger parser as an argument, `renderTrigger` makes the first start the bot's trigger, `describeStart` phrases a start such as `every 6h`, `routineDelivery` maps `does: tell` to local-only and `checkRoutineFloor` refuses a cron start under 900 seconds from a period its caller measures. Pure, and imports `definition.ts` for types only. |
| `routine-state.ts` | Contracts and state | The per-bot routine state file under the identity's `routines` folder, owner-only: `untilMetAt`, `fatiguedAt`, `fatigueItemId` and `enabledAt`. Counts the failure streak from the run records and, at ten failures in a row, raises one needs-you item and sets the `disabled` switch. |
| `cron-translator.ts` | Schedule | The only cron reader. `translateCron` turns a cron string into launchd calendar dictionaries that fire exactly as cron would, or refuses with a named id. |
| `slot-lister.ts` | Schedule | `listSlots` lists the wall-clock slots a set of calendar dictionaries covers, reading translator output only. |
| `slot-accounting.ts` | Schedule | `accountFire` names the slot a scheduled fire stood for, how late it ran and which missed slots it replaced. Missed slots are summarized and never run. |
| `runner.ts` | Runner and dispatch | `runBot` runs one bot in a fixed order: approval, disable switch, needs-you hold, lease, pause switch, precheck, posture, secret check, dispatch, result. The precheck runs in its own process group, which a timeout ends as a whole. Defines `EXIT_CODES` 0 to 5. |
| `dispatch.ts` | Runner and dispatch | Builds the child prompt and filtered environment, checks the prompt for secret literals and reads the child's output for a decision marker. The prompt names the run's working place: the directory the child starts in, its branch and the run folder. The spawn goes through the deep-loop executor audit. |
| `posture.ts` | Runner and dispatch | `validatePosture` refuses an isolation and sandbox pair the chosen executor kind cannot honor. The `native` kind is never admitted. |
| `result-ledger.ts` | Runner and dispatch | Writes each run's single result event through the deep-loop mode append gateway, keyed so a resent event is stored once. |
| `isolation.ts` | Isolation and delivery | `createBotWorktree` and `finishBotWorktree` give a worktree bot its own tree through sk-git's numbering script, never through git branch primitives. A tree holding only gitignored changes is kept as `ignored-changes`, because removing it would delete them. `checkoutBranch` reads the checkout branch of a shared run once and returns null on a detached HEAD or a failed read, never a refusal. |
| `delivery.ts` | Isolation and delivery | `deliverRecord` tells a run's declared targets what happened, at most once. The one channel is `desktop`, sent through `osascript`. |
| `request-record.ts` | Request pipeline | Builds and validates a `run` or `resume` request. The idempotency key comes from the event source and id, never a hash of the body. |
| `request-queue.ts` | Request pipeline | File queue keyed by identity. Every state change is one rename between sibling folders, so only one consumer can claim a request. |
| `request-drain.ts` | Request pipeline | `drainQueue` claims each request, hands it to the runner and routes it to done, back to the watched folder or to quarantine after `RETRY_BOUND` attempts. A failure a second dispatch cannot mend is quarantined at once, and a missing executor stops the pass. With `requestIds` a pass drains only the named requests. It appends the one bot message of every request that carries a `conversationId`, and a `chat` request is never retried. |
| `conversation.ts` | Request pipeline | The append-only conversation file of `bots chat`, one JSON message per line under the identity's owner-only `conversations` folder. `appendMessage` writes one whole line and never rewrites one, `readConversation` skips and counts a line that does not parse, the torn last line included, and `parseAddress` routes a leading `@<bot-id>` to that bot. `renderConversationBlock` writes the labelled `<conversation id="...">` block a chat run gets as its request prompt, holding the newest 40 messages within 8,000 characters, and `renderChannelBlock` writes the `channel` form an inbound channel message uses. `prepareHumanMessage` runs the three refusals before the append: the address, the secret literal and the prompt bound. Imports `state-root.ts`, `definition.ts`, `dispatch.ts` and `memory.ts`. |
| `answer.ts` | Request pipeline | `answerItem` records an operator answer on a needs-you item, then enqueues one `resume` request keyed by the item id, and the lock that guards the item write sits beside the item. |
| `skill-proposal.ts` | Request pipeline | `bots skill propose`. `writeProposal` reads one run record and writes a draft `SKILL.md`, then `proposal.json`, then one review item under the reserved `skill-proposals` bot id, into the identity's proposals folder. `claimProposalAnswer` checks the pin before an answer is written, and `settleProposalAnswer` writes `answer.json` beside the proposal after it. |
| `installer.ts` | launchd installer | The only module that writes a job file or calls `launchctl`. `installSchedule`, `enableSchedule`, `disableSchedule` and `uninstallSchedule` each rerun a preflight first. A first install is held disabled. The install record pins the executor path, and `scheduledRunEnv` puts its folder first on a scheduled fire's PATH. The drain job's record pins every resolvable executor for the queued runs `scheduledDrain` starts. |
| `plist-render.ts` | launchd installer | Renders bot and drain job property lists with absolute paths only, because launchd starts a job with no shell and a bare PATH. Every job pins the state root and identity, and a bot job also carries the scheduled-fire marker `SKILLED_BOTS_SCHEDULED_FIRE`. |
| `label.ts` | launchd installer | Builds and parses job labels under `com.skilled.bots.` from identity, bot id and schedule index. Holds the reserved ids. |
| `launchctl-print.ts` | launchd installer | Reads state, run count and last exit code from `launchctl print` and answers `unknown` for anything it cannot parse. |
| `status-index.ts` | Status index | One derived SQLite file under the state root, built from run records and needs-you items. `rebuildIndex` restores it from those sources. |
| `status.ts` | Status index | `statusReport` joins index rows, install records and `launchctl print` so a bot that never ran still shows. A row ends with `branch <name>` when the last run recorded its tree or checkout branch and `worktree <path>` when it ran in a tree. |
| `activity.ts` | Status index | The seven activity groups and their order, and the pure grouping of index runs and items, live leases, queued requests and schedule fires into the bots activity payload and its text lines. It reads no file and imports status-index types only. |
| `better-sqlite3.d.ts` | Status index | Ambient types for the slice of `better-sqlite3` the status index calls, since the package ships none. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Deep-loop imports | `../../../system-deep-loop/runtime/lib/deep-loop/` for atomic state, executor config, executor audit and the loop lock, plus that runtime's `authorized-ledger`, `event-envelope`, `mode-append-gateway` and `deep-research-authority` barrels for the result ledger. |
| Shared identity | `repo-config.ts` loads `../../../sk-code/shared/scripts/lib/repository-identity.cjs` and never reimplements remote parsing. |
| Packages | `yaml` in `definition.ts` and `better-sqlite3` in `status-index.ts`. Every other import is a Node built-in. |
| Side effects | Only `installer.ts` calls `launchctl` or writes the per-user agents folder. Only `isolation.ts` creates worktrees. Only `delivery.ts` sends a notice. |

---

## 5. VALIDATION

Run from the repository root.

```bash
cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck
```

Expected result: `tsc` prints nothing and exits 0. The per-module suites are listed in [`../tests/README.md`](../tests/README.md).

---

## 6. RELATED

- [Runtime overview](../README.md)
- [Runtime tests](../tests/README.md)
- [Definition checker](../../scripts/README.md)
- [Bot definition reference](../../bots-author/references/bot-definition.md)
