---
title: "bots-run"
description: "Run mode of system-skilled-bots: start a bot run, queue or drain run requests, and answer a needs-you item so its run continues."
version: 1.0.1.0
---

# bots-run

> The run mode of `system-skilled-bots`. It starts a bot run through `.skilled/bin/bots.cjs`, queues or drains run requests, and answers a needs-you item so the parked run continues.

---

## 1. OVERVIEW

The run mode is the one mode that starts an executor. A run dispatches a real executor, which may call a model and, under shared isolation, change the consumer checkout. Every request therefore names the bot id and the repository before anything runs. The table names what it covers and what it hands to the sibling modes.

| Aspect | What it gives you |
|---|---|
| **Use it for** | A request to start a run of one bot, or to queue a run from an event. A request to drain the bot request queue. A request to answer a bot's open question so its run continues |
| **Command** | `/bots:run` |
| **Tools** | Read, Bash, Grep, Glob. Bash runs only the `bots.cjs` run verbs |
| **Hands off** | Reading which items are open, which is `bots inbox` and belongs to the status mode. Putting a bot on a schedule, which the schedule mode owns through launchd |

`bots answer` lives here because answering an item queues the run that continues the parked one. The hub's `run` signal and the packet's own `ROUTER.md` both route to the same reference leaf.

---

## 2. VERBS

The mode runs four verbs. Each takes `--repo <path>` for the consumer checkout.

```text
bots run <id> --repo <path>
bots enqueue <id> --source <name> (--event-id <id> | --key <key>) --repo <path>
bots drain --repo <path>
bots answer <item-id> <text> --repo <path>
```

`bots run` starts one bot in the shared checkout. `bots enqueue` queues one request, and an event sent twice is a duplicate. `bots drain` claims every queued request once and routes each outcome. `bots answer` answers a needs-you item and queues the run that continues it. Read the item id from `bots inbox`, which the status mode owns.

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

Report exit 5 as a parked question rather than a failure. A run that ends at exit 5 holds every later run of that bot until its item is answered.

---

## 4. HOW TO USE

1. Confirm the bot id, or the needs-you item id for an answer, and the repository.
2. Run the one verb the request names, with `--repo <path>`.
3. Read the exit code against the table in section 3.
4. Report the verb, its exit code and what the code means.

Never start a run only to test routing. Routing is checked by replaying the request through the hub, not by running a bot.

---

## 5. FILES

- `SKILL.md`: the run workflow, its rules and its success criteria.
- `ROUTER.md`: the packet machine router.
- `references/run-queue-and-answer.md`: the run verbs and their contract.
- `changelog/`: release notes for this packet.

---

## 6. VERIFICATION

The hub's structural gate verifies the packet's shape:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots
```

The run passes when it ends with `OK: parent-skill-check`. A routing replay with a real run request confirms the hub selects this mode, because the structural gate asserts presence and never reachability.

---

## 7. RELATED

- [`SKILL.md`](./SKILL.md): the run workflow, its rules and its success criteria.
- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/run-queue-and-answer.md`](./references/run-queue-and-answer.md): the run verbs and their contract.
- [`../README.md`](../README.md): the hub overview with all four modes.
- [`../mode-registry.json`](../mode-registry.json): the packet registration this mode resolves through.
