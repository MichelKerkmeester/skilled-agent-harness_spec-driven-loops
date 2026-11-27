---
title: "Bot Runs: Run, Queue, Drain and Answer"
description: "The bots CLI verbs that start a run: run one bot, queue a request, drain the queue, and answer a needs-you item so its run continues."
trigger_phrases:
  - "run the bot"
  - "drain the bot queue"
  - "answer the bot"
importance_tier: normal
contextType: reference
version: 1.0.3.0
---

# Bot Runs: Run, Queue, Drain and Answer

Every way a bot run starts goes through `.skilled/bin/bots.cjs`. This reference names the verbs and what their exit codes mean.

---

## 1. OVERVIEW

### Purpose

Give the run mode the four verbs that start or continue a run, and the exit codes that tell a refused run from a broken one and from one waiting on the operator.

### When to Use

- Running one bot.
- Queueing a run request from an event and draining the queue.
- Answering a needs-you item so the parked run continues.

---

## 2. VERBS

| Verb | Does |
|------|------|
| `bots run <id>` | Runs one bot now: in the shared checkout, or in its own worktree for a bot whose isolation is `worktree`. It approves the bot's current `BOT.md` and `bots/config.json` for its unattended runs |
| `bots enqueue <id> --source <name> (--event-id <id> \| --key <key>)` | Queues one run request. An event sent twice is a duplicate |
| `bots drain` | Claims every queued request once, runs it and routes the outcome. A request for a bot whose definition is unapproved or changed since approval is quarantined as `definition-unapproved` or `definition-drifted` |
| `bots answer <item-id> <text>` | Answers a needs-you item and queues the run that continues it |
| `bots answer <item-id> <text> --as <name>` | Records who answered as the answer's `by`. Without it the answer records the OS user. A name is letters, digits, dot, dash and underscore, at most 64 characters, starting with a letter or digit. Outside a tty the CLI refuses a name that is not the OS user with `bots: --as needs a tty`, so a script cannot answer under another person's name. Two names match only exactly, so `Ada` and `ada` are two people |
| `bots answer <item-id> <text> --scope once\|deny` | Records the answer's scope. With no `--scope` the answer records `once`. `--scope always` and `--scope conversation` are refused `bots: grant-scope-unsupported`, and any other value `bots: --scope takes once or deny`, both exit 2. The same text with another scope is refused `item-answered-differently` |
| `bots schedule install <id> --full-access` | The only way a definition's `danger-full-access` sandbox is honored. Without it a declared `danger-full-access` runs at `workspace-write`. It needs a tty (`bots: --full-access needs a tty`). For a bot whose trigger is not cron it records the grant in the install record and installs no schedule, printing `bots: <id> has a <kind> trigger, so full access is recorded and no schedule is installed`. Without the flag such a bot is still refused `trigger-not-cron` |

Each verb takes `--repo <path>` for the consumer checkout. Read the item id for `bots answer` from `bots inbox`, which the status mode owns.

A queued request runs only once the bot is approved: a hand-typed `bots run <id>`, `bots enable <id>` or an install approves it. Only the installed schedule passes `--schedule-index`, so a hand-typed `bots run <id> --schedule-index <n>` exits 2.

`answer` and `enable` are refused `bots: child-write-refused` (exit 2) when a bot child's run marker (`SKILLED_BOT_RUN_ID` or `AI_SESSION_CHILD=1`) is in the environment. It is a bar against the ordinary case and not an authentication.

---

## 3. EXIT CODES

| Exit | Meaning |
|------|---------|
| 0 | Completed |
| 1 | Run failure |
| 2 | Usage |
| 3 | Recursion guard |
| 4 | Refused before dispatch |
| 5 | Awaiting decision: the run parked a needs-you item |

A run that ends at exit 5 holds every later run of that bot until its item is answered. After the answer, the bot's scheduled and queued runs keep waiting until the queued resume has run.

---

## 4. SAFETY

A run dispatches a real executor, which may call a model and, under shared isolation, change the checkout. Confirm the bot id and the repository before running it, and never start a run only to test routing.
