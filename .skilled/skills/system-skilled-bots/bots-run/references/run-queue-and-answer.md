---
title: "Bot Runs: Run, Queue, Drain and Answer"
description: "The bots CLI verbs that start a run: run one bot, queue a request, drain the queue, and answer a needs-you item so its run continues."
trigger_phrases:
  - "run the bot"
  - "drain the bot queue"
  - "answer the bot"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Bot Runs: Run, Queue, Drain and Answer

Every way a bot run starts goes through `.skilled/bin/bots.cjs`. This reference names the verbs and what their exit codes mean.

---

## 1. OVERVIEW

### Purpose

Give the run mode the four verbs that start or continue a run, and the exit codes that tell a refused run from a broken one and from one waiting on the operator.

### Usage

- Running one bot.
- Queueing a run request from an event and draining the queue.
- Answering a needs-you item so the parked run continues.

---

## 2. VERBS

| Verb | Does |
|------|------|
| `bots run <id>` | Runs one bot, in the shared checkout |
| `bots enqueue <id> --source <name> (--event-id <id> \| --key <key>)` | Queues one run request. An event sent twice is a duplicate |
| `bots drain` | Claims every queued request once, runs it and routes the outcome |
| `bots answer <item-id> <text>` | Answers a needs-you item and queues the run that continues it |

Each verb takes `--repo <path>` for the consumer checkout. Read the item id for `bots answer` from `bots inbox`, which the status mode owns.

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

A run that ends at exit 5 holds every later run of that bot until its item is answered.

---

## 4. SAFETY

A run dispatches a real executor, which may call a model and, under shared isolation, change the checkout. Confirm the bot id and the repository before running it, and never start a run only to test routing.
