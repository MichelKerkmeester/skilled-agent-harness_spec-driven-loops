---
name: bots-run
description: "Run mode of system-skilled-bots: start a bot run, queue or drain run requests, and answer a needs-you item so its run continues."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
---

# Bots Run

The run mode of the `system-skilled-bots` hub. It starts or continues a bot run through `.skilled/bin/bots.cjs`: one bot run, a queued request, a drain of the queue, or an answer to a needs-you item. `bots answer` lives here because answering queues the run that continues the parked one.

---

## 1. WHEN TO USE

Use this packet when the `system-skilled-bots` hub selects the `run` mode, or when `/bots:run` names it.

- A request to start a run of one bot, or to queue a run from an event.
- A request to drain the bot request queue.
- A request to answer a bot's open question so its run continues.

### When NOT to Use

- Reading which items are open. That is `bots inbox`, which the status mode owns.
- Putting a bot on a schedule. The schedule mode owns launchd.

Do not invoke this packet as a separate advisor identity. Routing belongs to the parent hub.

---

## 2. SMART ROUTING

The parent hub resolves this packet through `mode-registry.json`: `hub-router.json` scores the
request, the winning `workflowMode` names this packet, and the hub loads this `SKILL.md` first.

The hub's root `ROUTER.md` stops at the packet: it names this packet and its first leaves, and the
packet's own `ROUTER.md` maps the intents that pick among the material this folder holds. That file,
not the hub router, is where a packet-local resource selection is decided.

A request that matches no registered intent returns `UNKNOWN_FALLBACK`, never a silent default.
That fallback asks for disambiguation instead of guessing a verb.
The machine router, its intent signals and its resource map live in
[`ROUTER.md`](./ROUTER.md). Read that file before loading a packet-local resource.

---

## 3. HOW IT WORKS

1. Confirm the bot id, or the needs-you item id for an answer, and the repository.
2. Run the one verb the request names: `bots run <id>`, `bots enqueue <id> ...`, `bots drain` or `bots answer <item-id> <text>`, with `--repo <path>`.
3. Read the exit code against the table in `references/run-queue-and-answer.md`.
4. Report the verb, its exit code and what the code means.

---

## 4. RULES

### ALWAYS

- Confirm the bot id and repository before a run, since a run dispatches a real executor.
- Report exit 5 as a parked question, not as a failure.

### NEVER

- Never start a run only to test routing.
- Never edit a `BOT.md` from this mode. Author owns that.

### ESCALATE IF

- A run exits 4, so it was refused before dispatch.
- The request would answer an item the operator has not seen.

---

## 5. REFERENCES

- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/run-queue-and-answer.md`](./references/run-queue-and-answer.md): the run verbs and their contract.
- [`README.md`](./README.md): packet overview.
- `../mode-registry.json`: authoritative packet registration.
- `../hub-router.json`: parent routing policy.

---

## 6. SUCCESS CRITERIA

- The verb ran once and its exit code is reported with its meaning.

---

## 7. INTEGRATION POINTS

- Input: requests routed from the `system-skilled-bots` hub, or `/bots:run`.
- Output: the verified run result, with the command run and its exit status.
