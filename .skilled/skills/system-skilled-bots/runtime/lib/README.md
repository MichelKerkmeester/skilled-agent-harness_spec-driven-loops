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

This folder holds the bots domain logic as 28 flat modules, one concern per file. The front door CLI and the definition checker load these files through the runtime's own `tsx` and hold no rules themselves. A defect in a definition, a config or a request comes back as a refusal with a named reason, not a throw, so a caller can report it and keep going.

The modules lean on the deep-loop runtime for the parts a bot run shares with a loop iteration: atomic state writes, the executor tables, the audited spawn, the loop lock and the mode append gateway. They add the bot-specific layers on top: BOT.md parsing, cron translation, the file queue, launchd jobs, delivery and the status index.

---

## 2. PACKAGE TOPOLOGY

```text
contracts and state   repo-config, definition, identity, state-root,
                      approval, run-record, switches, needs-you
        ▲
        │ every other group reads these
        │
schedule              cron-translator ──▶ slot-lister ──▶ slot-accounting
runner and dispatch   runner ──▶ dispatch, posture, result-ledger
isolation, delivery   isolation, delivery           (called by runner)
request pipeline      request-record ──▶ request-queue ──▶ request-drain ──▶ runner
                      answer ──▶ request-queue
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
| `state-root.ts` | Contracts and state | Names the user-level state root and the per-identity folders for requests, leases, switches, items and records. The root is the absolute path an installed job pins in `SKILLED_BOTS_STATE_ROOT`, else the config's `stateRoot` when set, else a `system-skilled-bots` folder under `XDG_STATE_HOME` or the home `.local/state` folder. Also names each bot's approval file in the identity's approvals folder. |
| `approval.ts` | Contracts and state | Hashes a bot's `BOT.md` and the checkout's bots config. `approveDefinition` records both hashes at an operator act (install, enable, manual run), and `checkApproval` refuses an unattended run as `definition-unapproved` or `definition-drifted`. |
| `run-record.ts` | Contracts and state | The one record per run that the queue, delivery and status index all read. Adds the `awaiting-decision` exit for a parked run. |
| `switches.ts` | Contracts and state | The `disabled` and `paused` stop files, kept outside every checkout so a run cannot clear its own stop. |
| `needs-you.ts` | Contracts and state | Items a run leaves for an operator decision. State (open, answered, expired) is derived on every read and never stored. |
| `cron-translator.ts` | Schedule | The only cron reader. `translateCron` turns a cron string into launchd calendar dictionaries that fire exactly as cron would, or refuses with a named id. |
| `slot-lister.ts` | Schedule | `listSlots` lists the wall-clock slots a set of calendar dictionaries covers, reading translator output only. |
| `slot-accounting.ts` | Schedule | `accountFire` names the slot a scheduled fire stood for, how late it ran and which missed slots it replaced. Missed slots are summarized and never run. |
| `runner.ts` | Runner and dispatch | `runBot` runs one bot in a fixed order: approval, disable switch, needs-you hold, lease, pause switch, precheck, posture, secret check, dispatch, result. The precheck runs in its own process group, which a timeout ends as a whole. Defines `EXIT_CODES` 0 to 5. |
| `dispatch.ts` | Runner and dispatch | Builds the child prompt and filtered environment, checks the prompt for secret literals and reads the child's output for a decision marker. The spawn goes through the deep-loop executor audit. |
| `posture.ts` | Runner and dispatch | `validatePosture` refuses an isolation and sandbox pair the chosen executor kind cannot honor. The `native` kind is never admitted. |
| `result-ledger.ts` | Runner and dispatch | Writes each run's single result event through the deep-loop mode append gateway, keyed so a resent event is stored once. |
| `isolation.ts` | Isolation and delivery | `createBotWorktree` and `finishBotWorktree` give a worktree bot its own tree through sk-git's numbering script, never through git branch primitives. A tree holding only gitignored changes is kept as `ignored-changes`, because removing it would delete them. |
| `delivery.ts` | Isolation and delivery | `deliverRecord` tells a run's declared targets what happened, at most once. The one channel is `desktop`, sent through `osascript`. |
| `request-record.ts` | Request pipeline | Builds and validates a `run` or `resume` request. The idempotency key comes from the event source and id, never a hash of the body. |
| `request-queue.ts` | Request pipeline | File queue keyed by identity. Every state change is one rename between sibling folders, so only one consumer can claim a request. |
| `request-drain.ts` | Request pipeline | `drainQueue` claims each request, hands it to the runner and routes it to done, back to the watched folder or to quarantine after `RETRY_BOUND` attempts. A failure a second dispatch cannot mend is quarantined at once, and a missing executor stops the pass. |
| `answer.ts` | Request pipeline | `answerItem` records an operator answer on a needs-you item, then enqueues one `resume` request keyed by the item id. |
| `installer.ts` | launchd installer | The only module that writes a job file or calls `launchctl`. `installSchedule`, `enableSchedule`, `disableSchedule` and `uninstallSchedule` each rerun a preflight first. A first install is held disabled. The install record pins the executor path, and `scheduledRunEnv` puts its folder first on a scheduled fire's PATH. The drain job's record pins every resolvable executor for the queued runs `scheduledDrain` starts. |
| `plist-render.ts` | launchd installer | Renders bot and drain job property lists with absolute paths only, because launchd starts a job with no shell and a bare PATH. Every job pins the state root and identity, and a bot job also carries the scheduled-fire marker `SKILLED_BOTS_SCHEDULED_FIRE`. |
| `label.ts` | launchd installer | Builds and parses job labels under `com.skilled.bots.` from identity, bot id and schedule index. Holds the reserved ids. |
| `launchctl-print.ts` | launchd installer | Reads state, run count and last exit code from `launchctl print` and answers `unknown` for anything it cannot parse. |
| `status-index.ts` | Status index | One derived SQLite file under the state root, built from run records and needs-you items. `rebuildIndex` restores it from those sources. |
| `status.ts` | Status index | `statusReport` joins index rows, install records and `launchctl print` so a bot that never ran still shows. |
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
