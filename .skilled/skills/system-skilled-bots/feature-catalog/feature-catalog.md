---
title: "system-skilled-bots: Feature Catalog"
description: "Current-state inventory of file-defined headless bots: definitions, schedules, runs, queued requests, needs-you items, delivery, status and hub routing."
trigger_phrases:
  - "system-skilled-bots feature catalog"
  - "headless bots features"
  - "bot runner capabilities"
  - "bots cli inventory"
  - "feature catalog"
last_updated: "2026-11-23"
version: 1.0.3.0
---

# system-skilled-bots: Feature Catalog

This document is the current feature inventory for the `system-skilled-bots` hub, which defines, runs, schedules and reports on file-defined headless bots. Each entry summarizes one shipped capability and links to a per-feature reference that carries its source files and tests.

---

## 1. OVERVIEW

A bot is one `BOT.md` file under a repository's `bots/` folder. It runs headless through a deep-loop executor by hand, on a launchd schedule or from a queued request. The runtime under `runtime/lib/` holds every rule and the `bots` CLI at `.skilled/bin/bots.cjs` is its front door. The hub routes a bot request to one of four modes. The sections below group the capabilities from the shared foundations through definitions, scheduling, runs, requests, the operator loop and status to hub routing.

---

## 2. FOUNDATIONS

### Repository config and identity

#### Description

Reads the per-repository bots/config.json policy and resolves the repository identity that keys every label, queue and state folder.

#### Current Reality

`bots/config.json` is optional. A missing file yields the defaults, and a malformed one is refused rather than read as defaults. It can restrict executor kinds, move the state root, set a default isolation, declare an identity, opt in to git-hook triggers and bound retention. Identity comes from the value an installed job pins first, then the declared field, the environment and the origin remote. An unknown identity is the refusal `identity-unknown`, never a fallback key.

#### Source Files

See [`foundations/repository-config-and-identity.md`](foundations/repository-config-and-identity.md) for full implementation and test file listings.

---

### State layout

#### Description

Keeps everything a run must not write under a user-level state root outside every checkout, and run evidence in the Skilled tree's gitignored state folder.

#### Current Reality

Requests, leases, switches, needs-you items, run records, install records, definition approvals and receipts live under `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`, keyed by identity and created owner-only. An installed job pins its state root, which outranks the config's `stateRoot`. Ledgers, logs and transcripts live in the Skilled tree's gitignored state folder. Every caller takes its paths from one module.

#### Source Files

See [`foundations/state-layout.md`](foundations/state-layout.md) for full implementation and test file listings.

---

## 3. DEFINITION

### BOT.md definition contract

#### Description

Parses one BOT.md into a typed bot definition and returns a named refusal for every field defect instead of throwing.

#### Current Reality

A bot is `bots/<id>/BOT.md` with frontmatter fields for id, trigger, runtime, budget, delivery, posture, precheck and spec folder, plus a non-empty body that becomes the prompt. Triggers are `cron`, `queue`, `git-hook` or `manual`. Unknown keys are refused, and an undeclared isolation with no repository default is refused as `isolation-undeclared`. The author mode writes from the shipped template and hands the check to `/doctor:bots`.

#### Source Files

See [`definition/bot-definition-contract.md`](definition/bot-definition-contract.md) for the field rules, trigger kinds and template, with full implementation and test file listings.

---

### Definition checker

#### Description

Audits a repository's bots/ folder read-only with the runtime's own predicates and names each failed invariant.

#### Current Reality

`bot-check.cjs` reads a repository's `bots/` folder with the runtime's own parser, config reader, identity resolver, cron translator, label grammar and delivery list. It prints one line per finding. It exits 0 when every hard invariant passes, 1 on a failure and 2 when the audit cannot finish. A folder whose name differs from its bot id fails. No advisory invariant is defined, so `--strict` changes nothing.

#### Source Files

See [`definition/definition-checker.md`](definition/definition-checker.md) for the invariant list, output format and exit codes, with full implementation and test file listings.

---

## 4. SCHEDULING

### Cron translation

#### Description

Turns a cron expression into launchd calendar dictionaries that fire exactly as cron would, or refuses it with a named invariant id.

#### Current Reality

Every-minute cron becomes `StartInterval 60`, and other expressions expand to a capped, ordered list of `StartCalendarInterval` dictionaries. `@reboot`, power macros, malformed fields and day-field combinations launchd would read differently are refused by id. A schedule that restricts only one day field, such as weekdays, is emitted with that key alone, as a live fire log confirmed launchd fires it only on matching days.

#### Source Files

See [`scheduling/cron-translation.md`](scheduling/cron-translation.md) for the expansion rules and every refusal id, with full implementation and test file listings.

---

### launchd installer

#### Description

Installs a cron bot or the queue-drain job as a launchd agent through one preflighted transaction, held disabled on first install.

#### Current Reality

Every install reruns its preflight, then renders, lints, boots out, moves, bootstraps and reads back the job in one transaction. Every job pins the state root and identity, and a bot job carries the scheduled-fire marker. The install record pins the bot's executor path, which a scheduled fire puts first on its otherwise bare PATH. Install and enable approve the bot's definition. A first install stays disabled until `bots enable`. Labels carry the identity, bot id and schedule index. The id `drain` is the per-identity queue-drain job. Install records let status name a stale install that needs a reinstall.

#### Source Files

See [`scheduling/launchd-installer.md`](scheduling/launchd-installer.md) for the transaction, the hold, labels and install records, with full implementation and test file listings.

---

### Missed-slot accounting

#### Description

Names the slot each scheduled fire stands for, classifies how late it ran and summarizes missed slots without running them.

#### Current Reality

A scheduled fire records the slot it stands for and classes itself `on-time`, `late` or `catch-up` against a grace window. Slots missed while the host slept are summarized and never backfilled. The per-schedule fire record is written before dispatch, so a held or refused fire is still counted once.

#### Source Files

See [`scheduling/missed-slot-accounting.md`](scheduling/missed-slot-accounting.md) for slot listing, lateness classes and the fire record, with full implementation and test file listings.

---

## 5. RUNS

### Bot runner

#### Description

Runs one bot once in a fixed order of checks, with distinct exit codes for a completed, failed, refused, recursion-guarded or parked run.

#### Current Reality

The runner checks approval, disable, the needs-you hold, the lease, pause, precheck, posture and secrets before dispatch. `bots run` exits 0 completed, 1 failed, 2 usage, 3 recursion guard, 4 refused and 5 awaiting decision. The run is bounded by its budget and timeout. A killed run's lease is reclaimed and its record closed as unknown, so every run ends in exactly one record.

#### Source Files

See [`runs/bot-runner.md`](runs/bot-runner.md) for the check order, exit codes, lease and guards, with full implementation and test file listings.

---

### Definition approval

#### Description

Lets an unattended run use only the BOT.md and bots/config.json an operator approved, and refuses one whose files are unapproved or changed since.

#### Current Reality

Installing a schedule, enabling a bot and every hand-typed `bots run` record the hashes of the bot's `BOT.md` and the checkout's `bots/config.json` under the user-level state root. A scheduled, queued or resumed run with no approval is refused as `definition-unapproved`, and one whose files changed since is refused as `definition-drifted`. A manual run is never refused for drift.

#### Source Files

See [`runs/definition-approval.md`](runs/definition-approval.md) for what is hashed, who approves and the two refusals, with full implementation and test file listings.

---

### Executor posture and secret guard

#### Description

Refuses before dispatch any isolation or sandbox posture the chosen executor kind cannot honor, and any prompt that carries a known secret literal.

#### Current Reality

The `native` executor kind is never admitted. Approval-gated kinds may run read-only only, and only a kind with an OS-level sandbox may write. A kind whose output cannot carry the decision marker never dispatches. A prompt or answer holding a known secret value is refused, naming the key and never the value.

#### Source Files

See [`runs/executor-posture-and-secret-guard.md`](runs/executor-posture-and-secret-guard.md) for the posture matrix and the secret check, with full implementation and test file listings.

---

### Worktree isolation

#### Description

Gives a bot that declares worktree isolation its own numbered worktree, and removes it only when clean.

#### Current Reality

A `worktree` bot gets a tree numbered by sk-git's script under the configured worktree base, with shared paths linked instead of installed. The tree is removed only when clean, gitignored files included, at its base commit and without a stash, after every recorded link is unlinked. Anything else is kept and named in the record and the notice.

#### Source Files

See [`runs/worktree-isolation.md`](runs/worktree-isolation.md) for creation, the removal rule and resume, with full implementation and test file listings.

---

### Run record and result ledger

#### Description

Writes one run record per run under the user-level state root and one idempotent result event through the deep-loop append gateway.

#### Current Reality

One record per run under the user-level state root joins the request, the dispatch, the exit, the evidence and the delivery entries, and it adds the `awaiting-decision` exit. One result event per run goes through the deep-loop append gateway under the run id, so a retried write is a replay and never a second dispatch.

#### Source Files

See [`runs/run-record-and-result-ledger.md`](runs/run-record-and-result-ledger.md) for the record shape and the ledger, with full implementation and test file listings.

---

## 6. REQUESTS

### Request queue

#### Description

Queues run requests as files under the user-level state root, where each state change is one rename and a re-sent event is stored once.

#### Current Reality

`bots enqueue` writes a `run` or `resume` request keyed by its source and event id or a caller key, never a body hash. The queue moves a request between sibling folders by rename, so only one consumer can claim it. A seen-key marker makes a re-sent event a duplicate.

#### Source Files

See [`requests/request-queue.md`](requests/request-queue.md) for the record, folders and dedupe, with full implementation and test file listings.

---

### Queue drain

#### Description

Claims every queued request once, runs it and routes the outcome to done, retry or quarantine.

#### Current Reality

`bots drain` and the installed drain job claim each request once and run it. A completed or parked run is done. A refusal or hold is quarantined with its reason, while a failure, a held lease or a wait for an answered item's resume retries until the bound. A run that already ran or an empty decision marker is quarantined at once. A setup failure that would hit every request, a missing executor included, stops the pass and puts the request back.

#### Source Files

See [`requests/queue-drain.md`](requests/queue-drain.md) for routing, the retry bound and setup failures, with full implementation and test file listings.

---

### Commit-triggered requests

#### Description

Queues one run request per commit for each git-hook bot in a repository that opts in, without ever running a bot from the hook.

#### Current Reality

The post-commit hook's bots leg runs only when `bots/config.json` sets `gitHookTrigger`, outside a bot run and through the trusted source root. It enqueues one request per git-hook bot keyed by the commit sha, swallows every failure and never blocks the commit.

#### Source Files

See [`requests/commit-triggered-requests.md`](requests/commit-triggered-requests.md) for the opt-in, the skips and the enqueue, with full implementation and test file listings.

---

## 7. OPERATOR LOOP

### Needs-you items

#### Description

Parks a run that needs a human decision as an item under the user-level state root, and holds the bot's later runs until it is answered or expires.

#### Current Reality

A child that prints `[NEEDS-DECISION] ` parks: the runner writes one item with the question and options and ends the run at exit 5. Item state is derived on read, and items expire after seven days by default. An open item, a damaged item that may be the bot's or an unlistable folder holds the bot's later runs.

#### Source Files

See [`operator-loop/needs-you-items.md`](operator-loop/needs-you-items.md) for parking, expiry and the hold, with full implementation and test file listings.

---

### Needs-you answer

#### Description

Records the operator's answer on a needs-you item and queues one resume request so the parked run continues.

#### Current Reality

`bots answer` checks the answer for secrets, records it on the item, then enqueues one `resume` request keyed by the item id. A repeated answer stores one request. The resumed run's prompt carries the parked prompt, the question and the answer, with the same spec folder and any kept worktree.

#### Source Files

See [`operator-loop/needs-you-answer.md`](operator-loop/needs-you-answer.md) for the write order and the resumed run, with full implementation and test file listings.

---

### Run delivery

#### Description

Announces each run's outcome to its declared targets at most once, after the terminal record is written.

#### Current Reality

Delivery runs after the terminal record and sends to the bot's targets, or its failure targets on a failed run. The shipped channels are `local-only` and the macOS desktop notice, recorded `attempted` and never `delivered`. Each send is claimed first and an uncertain send is `unknown` and never retried. No notice carries a command line, environment value or secret.

#### Source Files

See [`operator-loop/run-delivery.md`](operator-loop/run-delivery.md) for targets, channels and the at-most-once claim, with full implementation and test file listings.

---

### Stop switches

#### Description

Disables or pauses a bot through switch files under the user-level state root that no run can reach.

#### Current Reality

`bots disable` and `bots enable` set and clear the disable switch, which the runner reads before the lease. They also hold or release an installed schedule. `bots pause` and `bots resume` set and clear the pause switch, read after the lease. A damaged switch reads as set.

#### Source Files

See [`operator-loop/stop-switches.md`](operator-loop/stop-switches.md) for disable, pause and their effects, with full implementation and test file listings.

---

## 8. STATUS

### Status index

#### Description

Keeps a derived SQLite index of run records and needs-you items under the user-level state root that a rebuild can always restore.

#### Current Reality

The index is one SQLite file under the user-level state root. Run rows are written once and delivery and item changes live in their own tables. The generation stamp tells status when to suggest `bots status --rebuild`. Retention bounds rows, run folders and closed items per identity and bot, and a failed build deletes nothing.

#### Source Files

See [`status/status-index.md`](status/status-index.md) for rows, retention and the rebuild, with full implementation and test file listings.

---

### Status and inbox report

#### Description

Joins the status index, the install records and launchctl print into one bots status report and the needs-you inbox.

#### Current Reality

`bots status` shows every installed bot with its last run, delivery and one row state such as `ok`, `never-run`, `held`, `needs-reinstall` or `run-folder-gone`. It reads three fields from `launchctl print` and answers `unknown` otherwise. `bots inbox` lists open and expired needs-you items. Neither opens a run folder.

#### Source Files

See [`status/status-and-inbox-report.md`](status/status-and-inbox-report.md) for row states, launchctl reading and the inbox, with full implementation and test file listings.

---

## 9. HUB ROUTING

### Four-mode hub routing

#### Description

Routes a bot request to the author, run, schedule or status mode through the hub router and mode registry, and defers when no mode is named.

#### Current Reality

`hub-router.json` picks one of four modes, a bundle or a defer, and `mode-registry.json` maps it to its packet and command: `/bots:author`, `/bots:run`, `/bots:schedule` or `/bots:status`. Every signal is anchored on the word bot or the bot-only term needs-you, and a bot request that names no mode defers.

#### Source Files

See [`hub-routing/four-mode-hub-routing.md`](hub-routing/four-mode-hub-routing.md) for the two stages, modes and defer, with full implementation and test file listings.
